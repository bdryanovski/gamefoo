import type { DeltaTime } from '../../../../src/generic_types';
import { MapObject, type Rect, type ScopedState } from '../../../../src/index';

/** One tile — how far a movable shelf slides. */
const SLIDE_DISTANCE = 16;
/** Slide speed in px/s (~0.5s to fully open). */
const SLIDE_SPEED = 32;

/**
 * Custom class bound to the "shelf" object — an interactable bookshelf that
 * starts a dialog when the player activates it. A placed shelf carries two
 * authored properties:
 *
 * - **`message` property** — which dialog to run (a tree name/id, numeric
 *   index, or a `msg_…` message id). The default `"0"` means "no dialog".
 * - **`id` property** — when set to a meaningful value (anything but the `"0"`
 *   default) the shelf becomes a **movable secret door**: activating it slides
 *   the shelf one tile (16px) to the right, permanently opening the passage
 *   behind it. If a `message` is also set, the dialog is shown first and the
 *   shelf slides once it is dismissed.
 *
 * ### Persistence
 *
 * A slid-open shelf is remembered in a shared {@link ScopedState} (the save
 * store, scoped to `"shelves"`), keyed by the placement {@link MapObject.id}.
 * {@link Bookshelf.onSpawn} restores the opened position when the screen
 * re-activates, so the passage stays open across screens and reloads.
 *
 * The class reports its reach + dialog reference and owns the slide;
 * {@link MapGame} drives the dialog runtime and triggers the slide after the
 * message is read.
 */
export class Bookshelf extends MapObject {
  static override readonly type = 'shelf';

  /** Shared "which shelves are open" state, scoped to `"shelves"`. */
  private static store: ScopedState | null = null;

  /** Binds the opened-shelves state every instance reads and writes. */
  static useState(store: ScopedState | null): void {
    Bookshelf.store = store;
  }

  /** X the shelf is sliding toward; snapped to exactly on arrival. */
  private slideTargetX = 0;
  /** Whether a slide animation is in progress. */
  private sliding = false;
  /** Whether the shelf has been opened (slid, or restored open). */
  private moved = false;

  /**
   * The dialog this shelf shows, from the `message` property. `null` when
   * unset or left at the `"0"` default — such a shelf shows no dialog.
   */
  get dialogRef(): string | null {
    const raw = this.properties.message?.trim();
    return raw && raw !== '0' ? raw : null;
  }

  /** A movable secret shelf carries a meaningful `id` property (not `"0"`). */
  get movable(): boolean {
    const raw = this.properties.id?.trim();
    return raw !== undefined && raw !== '' && raw !== '0';
  }

  /** Whether the shelf has already slid open (its passage is available). */
  get isOpen(): boolean {
    return this.moved;
  }

  override onSpawn(): void {
    // Restore an already-opened shelf at its slid position, instantly.
    if (this.movable && this.id !== '' && Bookshelf.store?.get<boolean>(this.id) === true) {
      this.x += SLIDE_DISTANCE;
      this.moved = true;
    }
  }

  /**
   * Slides the shelf one tile to the right (once) and records it, opening the
   * passage behind it for good. Returns `true` only on the first open.
   */
  slideOpen(): boolean {
    if (!this.movable || this.moved) {
      return false;
    }
    this.moved = true;
    this.slideTargetX = this.x + SLIDE_DISTANCE;
    this.sliding = true;
    if (this.id !== '') {
      Bookshelf.store?.set(this.id, true);
    }
    return true;
  }

  override update(deltaTime: DeltaTime): void {
    super.update(deltaTime);
    if (!this.sliding) {
      return;
    }
    // Advance toward the target, snapping exactly on arrival so the collider
    // lands on the tile grid (no sub-pixel drift blocking the opened cell).
    if (this.x + SLIDE_SPEED * deltaTime >= this.slideTargetX) {
      this.x = this.slideTargetX;
      this.sliding = false;
    } else {
      this.x += SLIDE_SPEED * deltaTime;
    }
  }

  /**
   * World-space AABB of the current state's `activation` collider, or the
   * object's footprint when none is authored.
   */
  activationBox(): Rect {
    const activation = this.worldColliders().find((c) => c.layer === 'activation');
    return activation ? activation.bounds : this.bounds();
  }

  /** True when `box` overlaps this shelf's activation zone. */
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
