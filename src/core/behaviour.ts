import type Entity from '../entities/entity';
import type { RenderContext } from './renderer/type';

/**
 * Abstract base class for all entity behaviours in the GameFoo engine.
 *
 * A **behaviour** is a self-contained unit of logic (input handling,
 * collision response, health tracking, rendering, etc.) that can be
 * attached to any {@link Entity} at runtime via
 * {@link Entity.attachBehaviour}.
 *
 * Subclasses **must** implement:
 * - {@link Behaviour.type | type} — a unique string identifier (e.g. `"control"`, `"healthkit"`).
 *
 * Subclasses **may** override:
 * - {@link Behaviour.update | update} — called once per frame with `deltaTime`.
 *
 * Subclasses **may** override:
 * - {@link Behaviour.render | render} — draw debug visuals or overlays.
 * - {@link Behaviour.onAttach | onAttach} — setup hook when added to an entity.
 * - {@link Behaviour.onDetach | onDetach} — teardown hook when removed.
 *
 * @typeParam T - The entity type this behaviour operates on.
 *   Defaults to {@link Entity}; narrow it to {@link DynamicEntity} or
 *   {@link Player} when the behaviour needs velocity, speed, etc.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Creating a custom behaviour
 * ```ts
 * import { Behaviour, type Entity } from "gamefoo";
 *
 * class Gravity extends Behaviour<Entity> {
 *   readonly type = "gravity";
 *
 *   update(deltaTime: number): void {
 *     this.owner.y += 9.8 * 60 * deltaTime;
 *   }
 * }
 * ```
 *
 * @example Attaching to an entity
 * ```ts
 * const entity = new Player("hero", 100, 100, 32, 32);
 * entity.attachBehaviour(new Gravity(entity));
 * ```
 *
 * @see {@link Entity.attachBehaviour}
 * @see {@link Entity.detachBehaviour}
 */
export abstract class Behaviour<T extends Entity = Entity> {
  /**
   * Reference to the entity that owns this behaviour.
   * Available to subclasses for reading and mutating entity state.
   */
  protected owner: T;

  /**
   * Unique string identifier for this behaviour type.
   *
   * Used as the look-up key in {@link Entity.getBehaviour} and
   * {@link Entity.hasBehaviour}. Must be a compile-time constant
   * (`readonly`).
   *
   * @example
   * ```ts
   * class Gravity extends Behaviour {
   *   readonly type = "gravity";
   *   // ...
   * }
   * ```
   */
  abstract readonly type: string;

  /**
   * Execution priority — lower numbers run first.
   *
   * When an entity has multiple behaviours, they are sorted by priority
   * before each update/render pass.
   *
   * @defaultValue `1`
   */
  public priority: number = 1;

  /**
   * Whether this behaviour is currently active.
   *
   * Disabled behaviours are skipped during both
   * {@link Entity.updateBehaviours} and {@link Entity.renderBehaviours}.
   *
   * @defaultValue `true`
   */
  public enabled: boolean = true;

  /**
   * Derived look-up key, equal to {@link Behaviour.type} in lowercase.
   *
   * Used internally by the entity's behaviour map so that look-ups are
   * case-insensitive.
   */
  get key(): string {
    return this.type.toLowerCase();
  }

  /**
   * Creates a new behaviour bound to the given entity.
   *
   * @param owner - The entity this behaviour will operate on.
   */
  constructor(owner: T) {
    this.owner = owner;
  }

  /**
   * Returns the entity this behaviour is attached to.
   *
   * @returns The owning entity.
   *
   * @since 0.5.0
   */
  getOwner(): T {
    return this.owner;
  }

  /**
   * Called once per frame to advance this behaviour's logic.
   *
   * Override in subclasses that need per-frame logic. Behaviours that
   * are purely reactive (collision, health, terminal render) can omit
   * this — the default is a no-op.
   *
   * @param _deltaTime - Seconds elapsed since the previous frame.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_deltaTime: number): void {}

  /**
   * Optional rendering hook invoked after the entity's own
   * {@link Entity.render} call.
   *
   * Override this to draw debug shapes, health bars, status effects, etc.
   *
   * @param ctx - The rendering context.
   */
  render?(ctx: RenderContext): void;

  /**
   * Lifecycle hook called immediately after the behaviour is attached
   * to an entity via {@link Entity.attachBehaviour}.
   *
   * Use this for one-time setup such as registering with the
   * collision {@link World}.
   */
  onAttach?(): void;

  /**
   * Lifecycle hook called when the behaviour is removed from an entity
   * via {@link Entity.detachBehaviour}.
   *
   * Use this to unregister from external systems or release resources.
   */
  onDetach?(): void;
}
