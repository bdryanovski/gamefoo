import {
  MapObject,
  type RenderContext,
  type ScopedState,
  type WorldCollider,
} from '../../../../src/index';

/**
 * A collectible olive placed on the map. Each placement carries an authored
 * `id` property (`"1"`, `"2"`, …) that is its stable identity, and may carry
 * a `message` property naming a dialog to run when it is picked up.
 *
 * ### Persistence
 *
 * Picked olives are remembered in a shared {@link ScopedState} (the game's
 * save store, scoped to `"olives"`): {@link Olive.collect} writes
 * `olives.<id> = true`. Because the store is backed by `localStorage`, a
 * collected olive stays gone across screen re-entry **and** page reloads —
 * {@link Olive.onSpawn} reads that flag when the screen re-activates, so the
 * olive never renders or blocks again once taken.
 *
 * The state is bound once via the static {@link Olive.useState}; the map
 * instantiates olives generically through the registry, so there is no
 * per-instance injection point.
 *
 * ### Pickup
 *
 * Olives author a `pickup` collider (not `solid`), so the player walks over
 * them freely. {@link MapGame} detects a pickup with
 * `collision.owners(player.box(), 'pickup')` and calls {@link Olive.collect};
 * a collected olive drops its colliders ({@link Olive.worldColliders} returns
 * none) so it leaves the collision world the same frame.
 *
 * Bind it with `registry.register(Olive)` (keyed by its static `type`,
 * matching the object's name `"olive"`).
 *
 * @see {@link ScopedState}
 */
export class Olive extends MapObject {
  static override readonly type = 'olive';

  /** Shared "which olives are collected" state, scoped to `"olives"`. */
  private static state: ScopedState | null = null;

  /**
   * Binds the collected-olives state every instance reads and writes. Call
   * once at load, before any screen with olives activates:
   * `Olive.useState(store.scope('olives'))`. Pass `null` to unbind.
   */
  static useState(state: ScopedState | null): void {
    Olive.state = state;
  }

  private collected = false;

  /**
   * Stable identity from the authored `id` property (trimmed). Empty when
   * unset — such an olive still works but is not persisted (no key).
   */
  get oliveId(): string {
    return (this.properties.id ?? '').trim();
  }

  /**
   * Dialog to run on pickup, from the `message` property (a tree name/id or
   * a `msg_…` id, like {@link Sign}). `null` when the olive carries none.
   */
  get dialogRef(): string | null {
    const raw = this.properties.message;
    return raw?.trim() ? raw.trim() : null;
  }

  /** Whether this olive has already been picked up. */
  get isCollected(): boolean {
    return this.collected;
  }

  override onSpawn(): void {
    const id = this.oliveId;
    this.collected = id !== '' && Olive.state?.get<boolean>(id) === true;
  }

  /**
   * Picks the olive up: records it in the shared state (so it stays gone
   * across screens and reloads) and retires it from the world. Returns
   * `true` only on the first pickup — the caller uses that to fire a
   * one-time effect (a toast, a dialog).
   */
  collect(): boolean {
    if (this.collected) {
      return false;
    }
    this.collected = true;
    const id = this.oliveId;
    if (id !== '') {
      Olive.state?.set(id, true);
    }
    return true;
  }

  /** A collected olive contributes no colliders — it is gone. */
  override worldColliders(): WorldCollider[] {
    return this.collected ? [] : super.worldColliders();
  }

  override render(ctx: RenderContext): void {
    if (this.collected) {
      return;
    }
    super.render(ctx);
  }
}
