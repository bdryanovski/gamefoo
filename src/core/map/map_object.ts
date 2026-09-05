import type { RenderContext } from '../renderer/type';
import StateMachine from '../state_machine';
import AnimatedObject from './animated_object';
import type AssetManager from './asset_manager';
import { drawFrame } from './draw';
import { shapeBounds, translateShape, type WorldCollider } from './collision_map';
import type { Shader } from '../shaders/shader';
import { ShaderStack } from '../shaders/shader_stack';
import type { ShaderRegion } from '../shaders/types';
import type {
  Frame,
  GameObjectDefinition,
  MapObjectContext,
  StateMachineDefinition,
  StateNodeDefinition,
  Transform,
} from './types';
import type { DeltaTime } from '@/generic_types';

/**
 * A resolved draw unit of the current state: a static frame or a live
 * animation, positioned at a pixel offset from the object origin.
 */
interface Part {
  frame?: Frame;
  anim?: AnimatedObject;
  ox: number;
  oy: number;
  transform?: Transform;
}

/**
 * Base class for every placed object driven by a {@link StateMachineDefinition}
 * (chests, torches, switches, enemies).
 *
 * The base wires the FSM from {@link MapObjectContext.machine}, resolves
 * each state's `display` (a static sprite or an animation) on entry, and
 * draws/advances it — so an unsubclassed `MapObject` already works. Custom
 * classes extend this to own the machine: add timers, fire conditions in
 * {@link MapObject.interact | interact}, and override the lifecycle hooks.
 *
 * Instances are created when their screen becomes active and disposed when
 * it is left (see {@link Screen}); {@link MapObject.onDespawn | onDespawn}
 * tears the FSM down.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example A custom chest
 * ```ts
 * class Chest extends MapObject {
 *   static readonly type = "Chest";
 *   private opened = false;
 *   override interact(): boolean {
 *     if (this.opened) return false;
 *     this.opened = true;
 *     return this.play("open"); // by state name
 *   }
 * }
 * registry.register(Chest);
 * ```
 *
 * @see {@link MapObjectRegistry}
 * @see {@link StateMachine}
 */
export default class MapObject {
  /**
   * Registry key. Override in subclasses; falls back to the object name.
   */
  public static readonly type?: string;

  /**
   * Pixel X within the screen.
   */
  public x: number;
  /**
   * Pixel Y within the screen.
   */
  public y: number;
  /**
   * Z-layer this object lives on.
   */
  public readonly level: number;

  /**
   * The object prefab (name, sprites, animations, meta).
   */
  protected readonly def: GameObjectDefinition;
  /**
   * The machine definition (states + transitions).
   */
  protected readonly machine: StateMachineDefinition;
  /**
   * Free-form key/value config authored on the object.
   */
  protected readonly properties: Record<string, string>;
  /**
   * Shared catalog for resolving frames/clips.
   */
  protected readonly assets: AssetManager;
  /**
   * The finite state machine this object drives.
   */
  protected readonly fsm: StateMachine<string>;

  private readonly transform?: Transform;
  /**
   * Resolved draw parts for the current state — each visible composition cell
   * as a static frame or a live animation with its pixel offset. Parts stack
   * bottom→top, so a layered state (e.g. `base` + `door`) renders in full.
   */
  private parts: Part[] = [];

  /**
   * Screen effects attached to this object (glow, particles, …).
   */
  private readonly shaders = new ShaderStack();

  constructor(ctx: MapObjectContext) {
    this.x = ctx.x;
    this.y = ctx.y;
    this.level = ctx.level;
    this.def = ctx.def;
    this.machine = ctx.machine;
    this.properties = ctx.properties;
    this.assets = ctx.assets;
    this.transform = ctx.transform;

    const initial =
      ctx.startStateId ?? ctx.machine.initialStateId ?? ctx.machine.states[0]?.id ?? '';
    this.fsm = new StateMachine<string>(initial);

    for (const state of ctx.machine.states) {
      this.fsm.onEnter(state.id, () => this.applyState(state));
    }

    const initialState = ctx.machine.states.find((s) => s.id === initial);
    if (initialState) {
      this.applyState(initialState);
    }
  }

  /**
   * The current state's id.
   */
  public get state(): string {
    return this.fsm.current;
  }

  /**
   * Fires `condition`. If a transition leaves the current state on that
   * condition, moves to its target (and swaps the display).
   *
   * @returns `true` if a transition was taken.
   */
  public interact(condition: string): boolean {
    const current = this.fsm.current;
    const edge = this.machine.transitions.find(
      (t) => t.fromStateId === current && t.condition === condition,
    );
    if (!edge) {
      return false;
    }
    return this.fsm.transition(edge.toStateId);
  }

  /**
   * Called once when the object's screen becomes active.
   */
  public onSpawn(): void {}

  /**
   * Called once when the object's screen is left; disposes the FSM.
   */
  public onDespawn(): void {
    this.shaders.clear();
    this.fsm.destroy();
  }

  /**
   * Advances the current animation, if any.
   */
  public update(_deltaTime: DeltaTime): void {
    for (const part of this.parts) {
      part.anim?.update(_deltaTime);
    }
    this.shaders.update(_deltaTime);
  }

  /**
   * Draws the current state's display.
   */
  public render(ctx: RenderContext): void {
    for (const part of this.parts) {
      if (part.anim) {
        // keep the animation aligned with the object (custom classes may move it)
        part.anim.x = this.x + part.ox;
        part.anim.y = this.y + part.oy;
        part.anim.render(ctx);
      } else if (part.frame) {
        drawFrame(ctx, part.frame, this.x + part.ox, this.y + part.oy, part.transform);
      }
    }
    this.shaders.render(ctx, this.bounds());
  }

  /**
   * Attaches a screen shader to this object; returns it for configuration.
   */
  public attachShader<T extends Shader>(shader: T): T {
    return this.shaders.attach(shader);
  }

  /**
   * The attached shader with `type`, or `undefined`.
   */
  public getShader<T extends Shader>(type: string): T | undefined {
    return this.shaders.get<T>(type);
  }

  /**
   * Whether a shader with `type` is attached.
   */
  public hasShader(type: string): boolean {
    return this.shaders.has(type);
  }

  /**
   * Detaches the shader with `type`, if present.
   */
  public detachShader(type: string): void {
    this.shaders.detach(type);
  }

  /**
   * This object's colliders in world (screen) pixels for its **current
   * state**, resolved from `collisionsByState`. Each carries its layer
   * (`solid`, `trigger`, …) and points back to this object as `owner`, so a
   * {@link CollisionMap} can block movement or resolve interactions. Empty
   * when the current state authors none (e.g. an unlit, non-solid campfire).
   */
  public worldColliders(): WorldCollider[] {
    const defs = this.def.collisionsByState?.[this.state] ?? [];
    const out: WorldCollider[] = [];
    for (const collision of defs) {
      if (collision.enabled === false) {
        continue;
      }
      const shape = translateShape(collision.shape, this.x, this.y);
      out.push({ layer: collision.layerId, shape, bounds: shapeBounds(shape), owner: this });
    }
    return out;
  }

  /**
   * The object's bounding box, used as the region passed to shaders.
   */
  protected bounds(): ShaderRegion {
    const grid = this.def.grid;
    if (grid) {
      return { x: this.x, y: this.y, width: grid.cols * grid.cell, height: grid.rows * grid.cell };
    }
    const frame = this.parts[0]?.anim?.frame ?? this.parts[0]?.frame;
    const width = frame?.sw ?? 16;
    const height = frame?.sh ?? 16;
    return { x: this.x, y: this.y, width, height };
  }

  /**
   * Transitions to a state by **id**.
   */
  protected transition(stateId: string): boolean {
    return this.fsm.transition(stateId);
  }

  /**
   * Transitions to a state by its authored **name**.
   */
  protected play(stateName: string): boolean {
    const target = this.machine.states.find((s) => s.name === stateName);
    return target ? this.fsm.transition(target.id) : false;
  }

  /**
   * Reads an authored property.
   */
  protected prop(key: string): string | undefined {
    return this.properties[key];
  }

  /**
   * Reads an authored property as a number, or `fallback` if absent/NaN.
   */
  protected propNumber(key: string, fallback = 0): number {
    const value = Number(this.properties[key]);
    return Number.isFinite(value) ? value : fallback;
  }

  /**
   * Reads an authored property as a boolean (`"true"`/`"1"` are true).
   */
  protected propBool(key: string): boolean {
    const value = this.properties[key];
    return value === 'true' || value === '1';
  }

  /**
   * Resolves a state's `display` into a frame or a fresh animation.
   */
  private applyState(state: StateNodeDefinition): void {
    this.parts = [];

    const layers = this.def.layersByState?.[state.id];
    if (layers && layers.length > 0) {
      const cell = this.def.grid?.cell ?? 16;
      for (const layer of layers) {
        if (!layer.visible) {
          continue;
        }
        for (const c of layer.cells) {
          const ox = c.col * cell;
          const oy = c.row * cell;
          const transform: Transform = {
            rotation: this.transform?.rotation,
            flipX: (this.transform?.flipX ?? false) !== (c.flipX ?? false),
            flipY: (this.transform?.flipY ?? false) !== (c.flipY ?? false),
          };
          if (c.source.kind === 'sprite') {
            const frame = this.assets.frame(c.source.spriteId);
            if (frame) {
              this.parts.push({ frame, ox, oy, transform });
            }
          } else {
            const clip = this.assets.clip(c.source.animationId);
            if (clip) {
              this.parts.push({
                anim: new AnimatedObject(clip, this.x + ox, this.y + oy, transform),
                ox,
                oy,
              });
            }
          }
        }
      }
      return;
    }

    // Fallback: the state's single representative display (objects with no
    // authored composition).
    const { display } = state;
    if (display.kind === 'sprite' && display.spriteId) {
      const frame = this.assets.frame(display.spriteId);
      if (frame) {
        this.parts.push({ frame, ox: 0, oy: 0, transform: this.transform });
      }
    } else if (display.kind === 'animation' && display.animationId) {
      const clip = this.assets.clip(display.animationId);
      if (clip) {
        this.parts.push({
          anim: new AnimatedObject(clip, this.x, this.y, this.transform),
          ox: 0,
          oy: 0,
        });
      }
    }
  }
}

/**
 * Constructor shape a {@link MapObjectRegistry} stores.
 */
export type MapObjectConstructor = (new (ctx: MapObjectContext) => MapObject) & {
  type?: string;
};
