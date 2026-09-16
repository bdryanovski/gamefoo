import { MapObject, type Rect } from '../../../../src/index';

/**
 * Custom class bound to the "slime_king" object — a stationary NPC. Its state
 * machine has a single `Idle` state and no transitions, so it never moves and
 * simply loops its idle animation.
 *
 * It carries one authored property:
 *
 * - **`message` property** — which dialog to run when the player presses **E**
 *   beside it (a dialog tree by name/id, or a `msg_…` message id such as
 *   `"msg_mtujs2a5_k"`). Set it on the placement (or the object default) in the
 *   editor's placement panel.
 *
 * Its reach is the current state's `activation` collider (the footprint is used
 * when none exists). The class only reports its reach + dialog reference;
 * {@link MapGame} drives the dialog runtime.
 */
export class SlimeKing extends MapObject {
  static override readonly type = 'slime_king';

  /**
   * The dialog to run, from the `message` property. `null` when unset — such a
   * king is inert (silent).
   */
  get dialogRef(): string | null {
    const raw = this.properties.message;
    return raw && raw.trim() ? raw.trim() : null;
  }

  /**
   * World-space AABB of the current state's `activation` collider, or the
   * object's footprint when none is authored.
   */
  activationBox(): Rect {
    const activation = this.worldColliders().find((c) => c.layer === 'activation');
    return activation ? activation.bounds : this.bounds();
  }

  /** True when `box` overlaps this king's activation zone. */
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
