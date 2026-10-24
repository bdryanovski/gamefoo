import type { RenderContext } from '../renderer/type';
import type MapObject from './map_object';

/**
 * A composable capability attached to a {@link MapObject}, the map-world
 * counterpart of {@link Behaviour} for {@link Entity}.
 *
 * Behaviors are created per object instance — objects are re-created on every
 * screen activation, so behaviors attach on spawn and detach on despawn;
 * durable facts (collected/opened/unlocked) live in a `StateStore`, never here.
 *
 * The engine drives the lifecycle from {@link Screen}: authored behaviours are
 * attached on activation and detached on deactivation, and every enabled
 * behaviour is ticked/rendered in priority order while the object is live.
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link MapObjectBehaviourRegistry}
 * @see {@link MapObject}
 */
export abstract class MapObjectBehaviour {
  /**
   * Registry key — also the authored `behaviours` list entry in the map
   * project. Must be a compile-time constant (`readonly`).
   */
  abstract readonly type: string;

  /**
   * Execution priority — lower runs first within one object.
   *
   * @defaultValue `1`
   */
  priority = 1;

  /**
   * Whether this behaviour is currently active. Disabled behaviours are
   * skipped by {@link MapObject.updateBehaviours} / `renderBehaviours`.
   *
   * @defaultValue `true`
   */
  enabled = true;

  /**
   * The object this behaviour is attached to.
   */
  protected readonly owner: MapObject;

  /**
   * Creates a behaviour bound to `owner`.
   *
   * @param owner - The map object this behaviour operates on.
   */
  protected constructor(owner: MapObject) {
    this.owner = owner;
  }

  /**
   * Derived look-up key, equal to {@link MapObjectBehaviour.type} in lowercase.
   */
  get key(): string {
    return this.type.toLowerCase();
  }

  /**
   * Returns the object this behaviour is attached to.
   */
  getOwner(): MapObject {
    return this.owner;
  }

  /**
   * Called once per frame to advance this behaviour's logic.
   *
   * @param _deltaTime - Seconds elapsed since the previous frame.
   */
  update(_deltaTime: number): void {}

  /**
   * Optional rendering hook, invoked after the object's own render.
   */
  render?(_ctx: RenderContext): void;

  /**
   * Lifecycle hook called immediately after the behaviour is attached.
   */
  onAttach?(): void;

  /**
   * Lifecycle hook called when the behaviour is detached.
   */
  onDetach?(): void;
}
