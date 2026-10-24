import {
  MapObject,
  type RenderContext,
  type WorldCollider,
} from '../../../../src/index';
import { CollectibleBehaviour } from '../behaviors/collectible';

/**
 * A collectible olive placed on the map. Each placement carries an authored
 * `id` property (`"1"`, `"2"`, …) that is its stable identity, and may carry
 * a `message` property naming a dialog to run when it is picked up.
 *
 * ### Persistence
 *
 * A {@link CollectibleBehaviour} is attached on spawn and owns the picked
 * latch + persistence (the game's save store, scoped to `"olives"`). The
 * store is the source of truth and is read back on every spawn, so a
 * collected olive stays gone across screen re-entry and reloads without any
 * per-class static injection point.
 *
 * ### Behaviour
 *
 * {@link PickupSystem} dispatches on the behavior (no hardcoded `Olive`
 * import): a picked olive contributes no colliders and does not render, so it
 * retires from the world the moment it is taken.
 */
export class Olive extends MapObject {
  static override readonly type = 'olive';

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

  /** The collectible behavior driving this olive (attached on spawn). */
  private get collectible(): CollectibleBehaviour | undefined {
    return this.getBehaviour<CollectibleBehaviour>('collectible');
  }

  /** Whether this olive has already been picked up. */
  get isCollected(): boolean {
    return this.collectible?.isCollected ?? false;
  }

  override onSpawn(): void {
    this.attachBehaviour(new CollectibleBehaviour(this, 'olives', 'You picked an olive', 'olive'));
  }

  /**
   * Picks the olive up: records it in the save store and retires it from the
   * world. Returns `true` only on the first pickup — the caller uses that to
   * fire a one-time effect (a toast, a dialog).
   */
  collect(): boolean {
    return this.collectible?.collect() ?? false;
  }

  /** A collected olive contributes no colliders — it is gone. */
  override worldColliders(): WorldCollider[] {
    return this.isCollected ? [] : super.worldColliders();
  }

  override render(ctx: RenderContext): void {
    if (this.isCollected) {
      return;
    }
    super.render(ctx);
  }
}
