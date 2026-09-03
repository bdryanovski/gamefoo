import type { RenderContext } from '../renderer/type';
import AnimatedObject from './animated_object';
import type AssetManager from './asset_manager';
import { drawFrame } from './draw';
import CollisionMap, { shapeBounds, translateShape } from './collision_map';
import MapObject, { type MapObjectConstructor } from './map_object';
import type MapObjectRegistry from './map_object_registry';
import {
  type Clip,
  type CollisionDefinition,
  type Frame,
  type MapData,
  type MapObjectContext,
  type ScreenCoordinate,
  type ScreenData,
  type ScreenName,
  type Transform,
  screenKey,
} from './types';
import type { DeltaTime } from '@/generic_types';

/**
 * Placement z-level treated as the walkable floor for ground detection.
 */
const GROUND_LEVEL = 0;

/**
 * A static tile: a resolved frame at a fixed offset with a transform.
 */
interface Tile {
  frame: Frame;
  x: number;
  y: number;
  transform?: Transform;
}

/**
 * A blueprint for a live object, resolved at build time and instantiated
 * fresh each time the screen is activated.
 */
type LiveDescriptor =
  | { kind: 'animation'; clip: Clip; x: number; y: number; transform: Transform }
  | { kind: 'object'; ctor: MapObjectConstructor; context: MapObjectContext };

/**
 * One z-layer: inert tiles, live blueprints, and their live instances.
 */
interface Layer {
  tiles: Tile[];
  descriptors: LiveDescriptor[];
  instances: Array<AnimatedObject | MapObject>;
}

/**
 * One navigable screen.
 *
 * Built once at load into z-{@link Layer}s: static `sprite` placements
 * become inert {@link Tile}s (resident, never updated); animation and
 * machine placements become {@link LiveDescriptor} blueprints. Live
 * instances exist only while the screen is **active** — created on
 * {@link Screen.activate} and disposed on {@link Screen.deactivate} — so
 * leaving a screen frees every per-object state, timer and subscription.
 *
 * Rendering walks layers back-to-front; within a layer tiles draw before
 * live objects.
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link MapManager}
 * @see {@link MapObject}
 */
export default class Screen {
  /**
   * Stable `"x,y"` identifier.
   */
  readonly name: ScreenName;
  /**
   * Grid coordinate `[x, y]`.
   */
  readonly coordinate: ScreenCoordinate;
  /**
   * Screen width in pixels (`screenCols * blockSize`).
   */
  readonly width: number;
  /**
   * Screen height in pixels (`screenRows * blockSize`).
   */
  readonly height: number;

  /**
   * Precomputed collision world for this screen (solids + ground + objects).
   */
  readonly collision: CollisionMap;

  /**
   * Sparse, index === z-level. Holes are skipped when iterating.
   */
  private readonly layers: Layer[] = [];
  private active = false;

  constructor(data: ScreenData, assets: AssetManager, map: MapData, registry?: MapObjectRegistry) {
    this.coordinate = [data.x, data.y];
    this.name = screenKey(data.x, data.y);
    this.width = map.screenCols * map.blockSize;
    this.height = map.screenRows * map.blockSize;
    this.collision = new CollisionMap(map.screenCols, map.screenRows, map.blockSize);

    this.paintFill(data.defaultSpriteId ?? map.defaultSpriteId ?? null, assets, map);

    for (const placement of data.placements) {
      const layer = this.layer(placement.level);
      const transform: Transform = {
        rotation: placement.rotation,
        flipX: placement.flipX,
        flipY: placement.flipY,
      };

      if (placement.kind === 'sprite') {
        const frame = assets.frame(placement.spriteId);
        if (frame) {
          layer.tiles.push({ frame, x: placement.x, y: placement.y, transform });
        }
        const collisions = assets.spriteCollisions(placement.spriteId);

        if (collisions) {
          this.addStaticColliders(collisions, placement.x, placement.y);
        }

        if (placement.level === GROUND_LEVEL) {
          const size = this.collision.cellSize;
          /**
           * TODO: this is assumption that we make - and GROUND_LEVEL is hardcoded so it's most
           * likely limitation that we are creating for ourself
           */
          this.collision.setWalkable(
            Math.floor(placement.x / size),
            Math.floor(placement.y / size),
          );
        }
      } else if (placement.kind === 'animation') {
        const clip = assets.clip(placement.animationId);

        if (clip) {
          layer.descriptors.push({
            kind: 'animation',
            clip,
            x: placement.x,
            y: placement.y,
            transform,
          });
        }
      } else {
        const owner = assets.objectByMachine(placement.machineId);

        if (!owner) {
          continue;
        }

        const machine = owner.machine;

        const startStateId = placement.stateName
          ? machine.states.find((s) => s.name === placement.stateName)?.id
          : undefined;

        const context: MapObjectContext = {
          assets,
          machine,
          def: owner,
          properties: owner.properties,
          x: placement.x,
          y: placement.y,
          level: placement.level,
          transform,
          startStateId,
        };

        const key = owner.properties.class ?? owner.name;
        const ctor = registry?.resolve(key) ?? MapObject;
        layer.descriptors.push({ kind: 'object', ctor, context });
      }
    }
  }

  /**
   * Adds a sprite/tile's authored colliders to the collision world.
   */
  private addStaticColliders(defs: CollisionDefinition[], x: number, y: number): void {
    for (const collision of defs) {
      if (collision.enabled === false) {
        continue;
      }
      const shape = translateShape(collision.shape, x, y);
      this.collision.addStatic({ layer: collision.layerId, shape, bounds: shapeBounds(shape) });
    }
  }

  /**
   * Instantiates every live object and fires their spawn hooks.
   */
  activate(): void {
    if (this.active) {
      return;
    }

    // TODO: why we set it again to active ?
    this.active = true;
    for (const layer of this.layers) {
      if (!layer) {
        continue;
      }
      for (const descriptor of layer.descriptors) {
        if (descriptor.kind === 'animation') {
          layer.instances.push(
            new AnimatedObject(descriptor.clip, descriptor.x, descriptor.y, descriptor.transform),
          );
        } else {
          const instance = new descriptor.ctor(descriptor.context);
          instance.onSpawn();
          layer.instances.push(instance);
          this.collision.addOccupant(instance);
        }
      }
    }
  }

  /**
   * Disposes every live object (spawn/despawn is idempotent).
   */
  deactivate(): void {
    if (!this.active) {
      return;
    }
    this.active = false;
    for (const layer of this.layers) {
      if (!layer) {
        continue;
      }
      for (const instance of layer.instances) {
        if (instance instanceof MapObject) {
          instance.onDespawn();
          this.collision.removeOccupant(instance);
        }
      }
      layer.instances.length = 0;
    }
  }

  /**
   * Advances every live object (no-op while inactive).
   */
  update(deltaTime: DeltaTime): void {
    if (!this.active) {
      return;
    }
    for (const layer of this.layers) {
      if (!layer) {
        continue;
      }
      for (const instance of layer.instances) {
        instance.update(deltaTime);
      }
    }
  }

  /**
   * Draws every layer back-to-front (tiles then live objects per layer).
   */
  render(ctx: RenderContext): void {
    for (const layer of this.layers) {
      if (!layer) {
        continue;
      }
      for (const tile of layer.tiles) {
        drawFrame(ctx, tile.frame, tile.x, tile.y, tile.transform);
      }
      for (const instance of layer.instances) {
        instance.render(ctx);
      }
    }
  }

  /**
   * Live {@link MapObject}s on the active screen (empty while inactive).
   */
  get objects(): MapObject[] {
    const out: MapObject[] = [];
    for (const layer of this.layers) {
      if (!layer) {
        continue;
      }
      for (const instance of layer.instances) {
        if (instance instanceof MapObject) {
          out.push(instance);
        }
      }
    }
    return out;
  }

  /**
   * Live objects that are instances of `type`.
   */
  objectsByType<T extends MapObject>(type: new (...args: never[]) => T): T[] {
    return this.objects.filter((o): o is T => o instanceof type);
  }

  /**
   * Returns (creating if needed) the layer at z-`level`.
   */
  private layer(level: number): Layer {
    let layer = this.layers[level];
    if (!layer) {
      layer = { tiles: [], descriptors: [], instances: [] };
      this.layers[level] = layer;
    }
    return layer;
  }

  /**
   * Tiles the fill sprite across the whole grid on layer 0.
   */
  private paintFill(spriteId: string | null, assets: AssetManager, map: MapData): void {
    if (!spriteId) {
      return;
    }
    const frame = assets.frame(spriteId);
    if (!frame) {
      return;
    }

    const layer = this.layer(0);
    for (let row = 0; row < map.screenRows; row += 1) {
      for (let col = 0; col < map.screenCols; col += 1) {
        layer.tiles.push({ frame, x: col * map.blockSize, y: row * map.blockSize });
        this.collision.setWalkable(col, row);
      }
    }
  }
}
