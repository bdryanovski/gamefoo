import Asset from '../asset';
import type {
  Clip,
  CollisionDefinition,
  Frame,
  GameObjectDefinition,
  ImageResolver,
  MapProject,
  StateMachineDefinition,
} from './types';

/**
 * Loads a {@link MapProject}'s images and pre-resolves its catalog into
 * draw-ready {@link Frame}s and {@link Clip}s, so the render loop never
 * performs string/id lookups.
 *
 * All catalogs are keyed by their authoring id (`spr_…`, `anim_…`,
 * `sm_…`, `img_…`). {@link MapManager} owns one `AssetManager` shared by
 * every {@link Screen}.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const assets = new AssetManager();
 * await assets.load(project, (img) => `./assets/${img.name}`);
 * const frame = assets.frame("spr_floor");
 * ```
 *
 * @see {@link MapManager}
 */
export default class AssetManager {
  /**
   * Loaded images by `ImageDefinition.id`.
   */
  private images = new Map<string, HTMLImageElement>();
  /**
   * Draw-ready source rects by `SpriteRegionDefinition.id`.
   */
  private framesById = new Map<string, Frame>();
  /**
   * Resolved animations by `AnimationDefinition.id`.
   */
  private clipsById = new Map<string, Clip>();
  /**
   * Embedded machines by `StateMachineDefinition.id`.
   */
  private machinesById = new Map<string, StateMachineDefinition>();
  /**
   * Object prefabs by `GameObjectDefinition.id`.
   */
  private objectsById = new Map<string, GameObjectDefinition>();
  /**
   * Object prefabs by their embedded machine's id.
   */
  private objectsByMachineId = new Map<string, GameObjectDefinition>();
  /**
   * Object prefabs by their `name` (last one wins on duplicates).
   */
  private objectsByName = new Map<string, GameObjectDefinition>();
  /**
   * Authored colliders by `SpriteRegionDefinition.id` (only sprites that have any).
   */
  private spriteCollisionsById = new Map<string, CollisionDefinition[]>();

  /**
   * Loads every image, then resolves frames, clips, machines and objects.
   *
   * @param project - The parsed project document.
   * @param resolve - Maps each `ImageDefinition` to the URL to fetch. Defaults to
   *   the raw `url` field. Use it to redirect editor paths
   *   (`/uploads/x.png`) to wherever the game actually serves them.
   */
  async load(project: MapProject, resolve: ImageResolver = (i) => i.url): Promise<void> {
    await Promise.all(
      project.images.map(async (def) => {
        this.images.set(def.id, await Asset.load(resolve(def)));
      }),
    );

    for (const sprite of project.sprites) {
      if (sprite.collisions?.length) {
        this.spriteCollisionsById.set(sprite.id, sprite.collisions);
      }

      const imageData = this.images.get(sprite.imageId);

      /**
       * We could not find an image we should quit early
       */
      if (!imageData) {
        continue;
      }

      this.framesById.set(sprite.id, {
        image: imageData,
        sx: sprite.x,
        sy: sprite.y,
        sw: sprite.width,
        sh: sprite.height,
        name: sprite.name,
      });
    }

    for (const animation of project.animations) {
      const frames: Frame[] = [];
      for (const frameId of animation.frames) {
        const frame = this.framesById.get(frameId);
        if (frame) {
          frames.push(frame);
        }
      }
      this.clipsById.set(animation.id, {
        name: animation.name,
        frames,
        duration: animation.duration,
        loop: animation.loop,
      });
    }

    for (const obj of project.objects) {
      this.objectsById.set(obj.id, obj);
      this.objectsByName.set(obj.name, obj);
      this.objectsByMachineId.set(obj.machine.id, obj);
      this.machinesById.set(obj.machine.id, obj.machine);
    }
  }

  /**
   * Draw-ready frame for a sprite id, or `undefined` if unknown.
   */
  frame(id: string): Frame | undefined {
    return this.framesById.get(id);
  }

  /**
   * Resolved animation clip for an animation id.
   */
  clip(id: string): Clip | undefined {
    return this.clipsById.get(id);
  }

  /**
   * State machine definition for a machine id.
   */
  machine(id: string): StateMachineDefinition | undefined {
    return this.machinesById.get(id);
  }

  /**
   * Object prefab for an object id.
   */
  object(id: string): GameObjectDefinition | undefined {
    return this.objectsById.get(id);
  }

  /**
   * Object prefab that owns the machine with `machineId`.
   */
  objectByMachine(machineId: string): GameObjectDefinition | undefined {
    return this.objectsByMachineId.get(machineId);
  }

  /**
   * Object prefab with the given `name`, or `undefined`.
   */
  objectByName(name: string): GameObjectDefinition | undefined {
    return this.objectsByName.get(name);
  }

  /**
   * Authored colliders for a sprite id, or `undefined` if it has none.
   */
  spriteCollisions(id: string): CollisionDefinition[] | undefined {
    return this.spriteCollisionsById.get(id);
  }

  /**
   * Loaded image element for an image id.
   */
  image(id: string): HTMLImageElement | undefined {
    return this.images.get(id);
  }
}
