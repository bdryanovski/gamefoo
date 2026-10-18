import { MapObjectBehaviour, type MapObject } from '../../../../src/index';
import { saveScope } from '../services';

/**
 * A walk-over collectible: the owner is picked up when the player's box
 * overlaps its authored `pickup` collider. The behavior owns the one-time
 * latch and its persistence (the game's save store, scoped by
 * {@link CollectibleBehaviour.scope}), so {@link PickupSystem} can dispatch on
 * the behavior with no hardcoded object import.
 *
 * Durable facts live here as **restored state**, never as the source of truth:
 * the store is the truth, and {@link onAttach} reads it back on every spawn.
 */
export class CollectibleBehaviour extends MapObjectBehaviour {
  readonly type = 'collectible';

  private collected = false;

  constructor(
    owner: MapObject,
    /** Save-store scope the picked ids are remembered in. */
    private readonly scope = 'collectibles',
    /** HUD text shown on pickup. */
    readonly toast = 'You picked something up',
    /** Dialog tag handed to {@link DialogSystem.start}. */
    readonly dialogTag = 'collectible',
    /** Toast duration in seconds. */
    readonly toastSeconds = 1.2,
  ) {
    super(owner);
  }

  /**
   * The stable key this collectible is remembered under: the authored `id`
   * property when present, else the placement id. Empty means unpersisted.
   */
  private get saveKey(): string {
    const authored = (this.owner.authored.id ?? '').trim();
    return authored !== '' ? authored : this.owner.id;
  }

  /** Restores the picked flag from the save store on every spawn. */
  override onAttach(): void {
    const id = this.saveKey;
    this.collected =
      id !== '' && saveScope(this.owner.services, this.scope)?.get<boolean>(id) === true;
  }

  /** Whether this collectible has already been picked up. */
  get isCollected(): boolean {
    return this.collected;
  }

  /** Dialog to run on pickup, from the owner's `message` property. */
  get dialogRef(): string | null {
    const raw = this.owner.authored.message;
    return raw?.trim() ? raw.trim() : null;
  }

  /**
   * Picks the owner up: records it in the save store (so it stays gone across
   * screens and reloads) and latches.
   *
   * @returns `true` only on the first pickup.
   */
  collect(): boolean {
    if (this.collected) {
      return false;
    }
    this.collected = true;
    const id = this.saveKey;
    if (id !== '') {
      saveScope(this.owner.services, this.scope)?.set(id, true);
    }
    return true;
  }
}
