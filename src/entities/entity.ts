import type { Behaviour } from '../core/behaviour';
import type { RenderContext } from '../core/renderer/type';
import Node from './node';
import type { Shader } from '../core/shaders/shader';
import { ShaderStack } from '../core/shaders/shader_stack';
import type { ShaderRegion } from '../core/shaders/types';

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
export default abstract class Entity extends Node {
  /**
   * Unique identifier for this entity.
   *
   * Used as the key in {@link GameObjectRegister} and for
   * collision-callback identification.
   */
  public id: string = '';

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
   * Screen effects attached to this entity (glow, particles, …).
   *
   * @since 0.5.0
   */
  private readonly shaderStack = new ShaderStack();

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
    super({ x, y }, { width: width || 0, height: height || 0 });
    this.id = id;
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
    if (!behavior) {
      return;
    }

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
      this._sortedBehaviors = Array.from(this.behaviorMap.values()).sort(
        (a, b) => a.priority - b.priority,
      );
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

  /**
   * Attaches a screen shader to this entity and returns it.
   *
   * Effects render when the subclass calls {@link Entity.renderShaders} and
   * advance when it calls {@link Entity.updateShaders} — mirroring the
   * behaviour update/render hooks.
   *
   * @since 0.5.0
   *
   * @param shader - The shader to attach.
   */
  attachShader<T extends Shader>(shader: T): T {
    return this.shaderStack.attach(shader);
  }

  /**
   * The attached shader with `type`, or `undefined`.
   *
   * @since 0.5.0
   */
  getShader<T extends Shader>(type: string): T | undefined {
    return this.shaderStack.get<T>(type);
  }

  /**
   * Whether a shader with `type` is attached.
   *
   * @since 0.5.0
   */
  hasShader(type: string): boolean {
    return this.shaderStack.has(type);
  }

  /**
   * Detaches the shader with `type`, if present.
   *
   * @since 0.5.0
   */
  detachShader(type: string): void {
    this.shaderStack.detach(type);
  }

  /**
   * Advances every enabled shader. Call from a subclass's `update`, next to
   * {@link Entity.updateBehaviours}.
   *
   * @since 0.5.0
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  protected updateShaders(deltaTime: number): void {
    this.shaderStack.update(deltaTime);
  }

  /**
   * Renders every enabled shader over this entity's bounding box. Call from
   * a subclass's `render`, next to {@link Entity.renderBehaviours}.
   *
   * @since 0.5.0
   *
   * @param ctx - The rendering context.
   */
  protected renderShaders(ctx: RenderContext): void {
    const size = this.getSize();
    const region: ShaderRegion = { x: this.x, y: this.y, width: size.width, height: size.height };
    this.shaderStack.render(ctx, region);
  }
}
