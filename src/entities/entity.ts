import type { Behaviour } from "../core/behaviour";
import type { RenderContext } from "../core/renderer/type";
import type { Demension, Vector2 } from "../generic_types";

/**
 * Abstract base class for every game entity in the GameFoo engine.
 *
 * `Entity` provides:
 *
 * - **Identity** — a unique string {@link Entity.id | id}.
 * - **Transform** — a 2-D {@link Entity.position | position} and
 *   {@link Entity.size | size} with convenient `x`/`y` accessors.
 * - **Behaviour system** — attach, detach, query, and bulk-update
 *   {@link Behaviour} instances that compose an entity's logic.
 *
 * Subclasses must implement {@link Entity.update} and
 * {@link Entity.render}.
 *
 * @category Entities
 * @since 0.1.0
 *
 * @example Subclassing
 * ```ts
 * import { Entity } from "gamefoo";
 *
 * class Wall extends Entity {
 *   constructor(x: number, y: number, w: number, h: number) {
 *     super("wall", x, y, w, h);
 *   }
 *
 *   update(_dt: number) {}
 *
 *   render(ctx: RenderContext) {
 *     ctx.fillStyle = "#888";
 *     ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
 *   }
 * }
 * ```
 *
 * @example Attaching behaviours
 * ```ts
 * const entity = new Wall(0, 0, 100, 20);
 * entity.attachBehaviour(new Collidable(entity, world, { ... }));
 *
 * if (entity.hasBehaviour("collidable")) {
 *   console.log("Wall has collision!");
 * }
 * ```
 *
 * @see {@link DynamicEntity} — extends Entity with velocity / speed
 * @see {@link Player}        — concrete player entity
 * @see {@link Behaviour}     — composable logic units
 */
export default abstract class Entity {
  /**
   * Unique identifier for this entity.
   *
   * Used as the key in {@link GameObjectRegister} and for
   * collision-callback identification.
   */
  public id: string = "";

  /**
   * World-space position of the entity's origin (top-left corner).
   */
  protected readonly position: Vector2 = { x: 0, y: 0 };

  /**
   * Bounding dimensions of the entity in pixels.
   */
  protected readonly size: Demension = { width: 0, height: 0 };

  /**
   * Internal map from behaviour key (lowercased type) to
   * {@link Behaviour} instance.
   */
  private behaviorMap: Map<string, Behaviour> = new Map();

  /**
   * Priority-sorted cache of behaviours. Invalidated (`null`) whenever
   * a behaviour is attached or detached.
   */
  private _sortedBehaviors: Behaviour[] | null = null;

  /**
   * Horizontal position of the entity (shorthand for
   * `position.x`).
   */
  get x(): number {
    return this.position.x;
  }

  /** Sets the horizontal position. */
  set x(value: number) {
    this.position.x = value;
  }

  /**
   * Vertical position of the entity (shorthand for
   * `position.y`).
   */
  get y(): number {
    return this.position.y;
  }

  /** Sets the vertical position. */
  set y(value: number) {
    this.position.y = value;
  }

  /**
   * Creates a new entity.
   *
   * @param id     - Unique string identifier.
   * @param x      - Initial X position in pixels.
   * @param y      - Initial Y position in pixels.
   * @param width  - Width of the entity's bounding box in pixels.
   * @param height - Height of the entity's bounding box in pixels.
   *
   * @example
   * ```ts
   * class Crate extends Entity {
   *   constructor(x: number, y: number) {
   *     super("crate", x, y, 32, 32);
   *   }
   *   // ...
   * }
   * ```
   */
  constructor(id: string, x: number, y: number, width?: number, height?: number) {
    this.id = id;
    this.position = { x, y };

    if (width && height) {
      this.size = { width, height };
    }
  }

  /**
   * Advances the entity's state by one frame.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  abstract update(deltaTime: number): void;

  /**
   * Draws the entity .
   *
   * @param ctx - The 2-D rendering context.
   */
  abstract render(ctx: RenderContext): void;

  /**
   * Returns a **copy** of the entity's current position.
   *
   * @returns A new {@link Vector2} with the entity's `x` and `y`.
   */
  getPosition(): Vector2 {
    return this.position;
  }

  /**
   * Returns a **copy** of the entity's bounding dimensions.
   *
   * @returns An object with `width` and `height`.
   */
  getSize(): Demension {
    return this.size;
  }

  /**
   * Set size of the entity
   *
   * @since 0.2.0
   *
   * @return void
   */
  setSize(width: number, height: number): void {
    this.size.width = width;
    this.size.height = height;
  }

  /**
   * Retrieves a behaviour by its key (case-insensitive).
   *
   * @typeParam T - The expected concrete behaviour type.
   * @param key - The behaviour's {@link Behaviour.type | type} string.
   * @returns The behaviour cast to `T`, or `undefined` if not found.
   *
   * @example
   * ```ts
   * const ctrl = entity.getBehaviour<Control>("control");
   * if (ctrl) ctrl.enabled = false;
   * ```
   */
  getBehaviour<T extends Behaviour>(key: string): T | undefined {
    return this.behaviorMap.get(key.toLowerCase()) as T | undefined;
  }

  /**
   * Returns all attached behaviours that are instances of the given
   * class.
   *
   * @typeParam T - The behaviour subclass to filter by.
   * @param type - The constructor function to test with `instanceof`.
   * @returns An array of matching behaviours.
   *
   * @example
   * ```ts
   * const renderers = entity.getBehavioursByType(SpriteRender);
   * ```
   */
  getBehavioursByType<T extends Behaviour>(type: new (...args: any[]) => T): T[] {
    return this.behaviors.filter((b) => b instanceof type) as T[];
  }

  /**
   * Checks whether a behaviour with the given key is attached.
   *
   * @param key - The behaviour's {@link Behaviour.type | type} string
   *   (case-insensitive).
   * @returns `true` if the behaviour exists on this entity.
   */
  hasBehaviour(key: string): boolean {
    return this.behaviorMap.has(key.toLowerCase());
  }

  /**
   * Attaches a behaviour to this entity.
   *
   * If the behaviour defines an {@link Behaviour.onAttach | onAttach}
   * hook, it is called immediately.  The sorted-behaviour cache is
   * invalidated.
   *
   * @typeParam T - The behaviour type being attached.
   * @param behavior - The behaviour instance to add.
   * @returns The same behaviour instance (for chaining).
   *
   * @example
   * ```ts
   * const hk = entity.attachBehaviour(new HealthKit(entity, 100));
   * hk.takeDamage(10);
   * ```
   */
  attachBehaviour<T extends Behaviour>(behavior: T): T {
    this.behaviorMap.set(behavior.key, behavior);
    this._sortedBehaviors = null;

    if (behavior.onAttach) {
      behavior.onAttach();
    }
    return behavior;
  }

  /**
   * Detaches a behaviour by its key and calls
   * {@link Behaviour.onDetach | onDetach} if defined.
   *
   * @param key - The behaviour's {@link Behaviour.type | type} string
   *   (case-insensitive).
   *
   * @example
   * ```ts
   * entity.detachBehaviour("collidable");
   * ```
   */
  detachBehaviour(key: string): void {
    const behavior = this.behaviorMap.get(key.toLowerCase());
    if (!behavior) return;

    if (behavior.onDetach) {
      behavior.onDetach();
    }
    this.behaviorMap.delete(key.toLowerCase());
    this._sortedBehaviors = null;
  }

  /**
   * Returns all attached behaviours sorted by
   * {@link Behaviour.priority} (ascending).  The result is cached and
   * only re-computed when behaviours are added or removed.
   *
   * @internal
   */
  private get behaviors(): Behaviour[] {
    if (!this._sortedBehaviors) {
      this._sortedBehaviors = Array.from(this.behaviorMap.values()).sort((a, b) => a.priority - b.priority);
    }
    return this._sortedBehaviors;
  }

  /**
   * Calls {@link Behaviour.update | update(deltaTime)} on every
   * enabled behaviour, in priority order.
   *
   * Typically called from a subclass's `update` implementation.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  protected updateBehaviours(deltaTime: number): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled) {
        behavior.update(deltaTime);
      }
    }
  }

  /**
   * Calls {@link Behaviour.render | render(ctx)} on every enabled
   * behaviour that defines a render method, in priority order.
   *
   * Typically called from a subclass's `render` implementation.
   *
   * @param ctx - The rendering context.
   */
  protected renderBehaviours(ctx: RenderContext): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled && behavior.render) {
        behavior.render(ctx);
      }
    }
  }
}
