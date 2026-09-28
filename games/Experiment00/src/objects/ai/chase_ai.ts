import type { DeltaTime } from '../../../../../src/generic_types';
import type { Rect } from '../../../../../src/index';
import { CritterAI } from './critter_ai';

const CHASE_SPEED = 16; // px/s — a slow, inevitable approach

/**
 * A hostile that stalks the player instead of fleeing. Built on {@link
 * CritterAI}'s shared movement/perception, it:
 *
 * - **Approaches** — whenever the player is on-screen it walks straight toward
 *   them at a slow, menacing pace, sliding along solids.
 * - **Confronts** — once the player is inside its authored `activation` zone it
 *   stops, faces idle, and (via the game) opens the dialog named by its
 *   `message` property. This happens automatically only on the **first**
 *   meeting; afterward the player replays it on demand with **E**.
 *
 * The dialog runtime is game-owned, so this class only *reports* readiness:
 * {@link ChaseAI.takeGreeting} fires the one-shot, {@link ChaseAI.dialogRef}
 * names the tree, and {@link ChaseAI.overlaps} lets the player re-trigger it
 * with **E**.
 */
export abstract class ChaseAI extends CritterAI {
  static override readonly type: string;

  /** Latched after the one automatic greeting; only **E** replays afterward. */
  private greeted = false;

  protected think(dt: DeltaTime): void {
    const t = this.target;
    if (!t || this.reached) {
      // No player, or already in talking range: hold position and idle.
      this.heading = { x: 0, y: 0 };
      this.moving = false;
      this.applyFacing();
      return;
    }

    const c = this.center();
    const ax = t.x + t.width / 2 - c.x;
    const ay = t.y + t.height / 2 - c.y;
    const len = Math.hypot(ax, ay) || 1;
    this.heading = { x: ax / len, y: ay / len };
    this.moving = true;
    // A blocked step just stalls against the wall/pit — keep pursuing.
    this.move(this.heading.x * CHASE_SPEED * dt, this.heading.y * CHASE_SPEED * dt);
    this.applyFacing();
  }

  /** True when the player is inside this foe's `activation` (talking) zone. */
  get reached(): boolean {
    return this.overlapsTarget(this.zoneBounds('activation'));
  }

  /**
   * The dialog tree to run, from the `message` property — a tree by name/id or
   * a `msg_…` message id. `null` when unset (an inert, silent stalker).
   */
  get dialogRef(): string | null {
    const raw = this.properties.message;
    return raw && raw.trim() ? raw.trim() : null;
  }

  /** True when `box` overlaps this foe's `activation` zone — the E-reach test. */
  overlaps(box: Rect): boolean {
    const a = this.zoneBounds('activation');
    return (
      box.x < a.x + a.width && box.x + box.width > a.x && box.y < a.y + a.height && box.y + box.height > a.y
    );
  }

  /**
   * Fires `true` exactly once, the first time the player enters talking
   * range. After that it stays quiet forever — the player replays the dialog
   * on demand with **E**. The game turns a `true` into an opened dialog.
   */
  takeGreeting(): boolean {
    if (this.greeted || !this.reached) {
      return false;
    }
    this.greeted = true;
    return true;
  }
}
