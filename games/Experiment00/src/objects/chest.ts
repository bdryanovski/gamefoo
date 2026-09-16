import { MapObject, type Rect, type ScopedState, type WorldCollider } from '../../../../src/index';

/**
 * A chest the player opens with **E**. Authored as a two-state machine
 * (`init` = closed ⇄ `open`) with a `solid` collider and an `activation`
 * collider on the closed state.
 *
 * ### Opening
 *
 * Pressing E next to a closed chest ({@link Chest.overlaps} its activation
 * zone) swaps it to the open sprite. **Opening is one-way** — a chest stays
 * open. {@link Chest.open} returns `true` only the first time, so the game
 * grants the item, plays the sound, and runs the dialog exactly once.
 *
 * ### Persistence
 *
 * Opened chests are remembered in a shared {@link ScopedState} (the save
 * store, scoped to `"chests"`), keyed by the placement {@link MapObject.id}.
 * Backed by `localStorage`, an opened chest stays open across screen re-entry
 * and reloads — {@link Chest.onSpawn} restores it when the screen re-activates.
 *
 * ### Payload
 *
 * - **`message` property** — a dialog to run on open (a tree name/id or a
 *   `msg_…` id). The project uses `"0"` as the "unset" sentinel.
 * - **`item` property** — the item id the chest holds (added to the player's
 *   inventory by {@link MapGame}). `"0"`/empty means the chest is empty.
 *
 * Bind it with `registry.register(Chest)` (keyed by its static `type`,
 * matching the object name `"chest"`) and `Chest.useState(store.scope('chests'))`.
 *
 * @see {@link ScopedState}
 */
export class Chest extends MapObject {
  static override readonly type = 'chest';

  /** Shared "which chests are open" state, scoped to `"chests"`. */
  private static store: ScopedState | null = null;

  /** Binds the opened-chests state every instance reads and writes. */
  static useState(store: ScopedState | null): void {
    Chest.store = store;
  }

  /** The open state's id (authored state name `open`). */
  private get openStateId(): string {
    return this.machine.states.find((s) => s.name === 'open')?.id ?? '';
  }

  /** Whether the chest is open. Open chests stay open. */
  get isOpen(): boolean {
    const open = this.openStateId;
    return open !== '' && this.state === open;
  }

  /**
   * Dialog to run when opened, from the `message` property. The project uses
   * `"0"` (and empty) as the "unset" sentinel, so both resolve to `null`.
   */
  get dialogRef(): string | null {
    const raw = this.properties.message?.trim();
    return raw && raw !== '0' ? raw : null;
  }

  /** Item id this chest holds, from the `item` property (`"0"`/empty = none). */
  get item(): string | null {
    const raw = this.properties.item?.trim();
    return raw && raw !== '0' ? raw : null;
  }

  override onSpawn(): void {
    // Restore a previously-opened chest so it spawns open and stays open.
    if (this.id !== '' && Chest.store?.get<boolean>(this.id) === true) {
      this.play('open');
    }
  }

  /**
   * Opens the chest if closed: swaps to the open sprite and records it in the
   * shared state (so it stays open across screens and reloads). Returns `true`
   * only on the first open.
   */
  open(): boolean {
    if (this.isOpen) {
      return false;
    }
    this.play('open');
    if (this.id !== '') {
      Chest.store?.set(this.id, true);
    }
    return true;
  }

  /**
   * A chest is a solid prop whether shut or open, but only the closed
   * (`init`) state authors colliders — reuse them so an open chest still
   * blocks and cannot be walked through.
   */
  override worldColliders(): WorldCollider[] {
    const closed = this.machine.initialStateId ?? this.state;
    return this.collidersForState(closed);
  }

  /** World-space activation zone, or the footprint when none is authored. */
  activationBox(): Rect {
    const activation = this.worldColliders().find((c) => c.layer === 'activation');
    return activation ? activation.bounds : this.bounds();
  }

  /** True when `box` overlaps this chest's activation zone. */
  overlaps(box: Rect): boolean {
    const a = this.activationBox();
    return (
      box.x < a.x + a.width &&
      box.x + box.width > a.x &&
      box.y < a.y + a.height &&
      box.y + box.height > a.y
    );
  }
}
