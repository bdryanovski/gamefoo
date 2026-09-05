import { MapObject, type Rect } from '../../../../src/index';

/**
 * Custom class bound to the "shelf" object — an interactable bookshelf that
 * starts a dialog when the player activates it. A placed shelf carries one
 * authored property:
 *
 * - **`message` property** — which dialog to run. Accepts a dialog tree by
 *   keyed name (e.g. `"Base"`), tree id, or numeric index — or a **message
 *   id** (e.g. `"msg_…"`, copied from the dialog editor) to open the dialog at
 *   that specific message. The default `"0"` means "no dialog": such a shelf
 *   is inert. Set it on the placement (or the object default) in the editor's
 *   placement panel.
 *
 * Its reach is the current state's `activation` collider (authored in the
 * object editor; the footprint is used when none exists). Pressing **E** next
 * to a shelf whose {@link Bookshelf.dialogRef} resolves opens the dialog modal.
 *
 * The class only reports its reach + dialog reference; {@link MapGame} drives
 * the dialog runtime.
 */
export class Bookshelf extends MapObject {
  static override readonly type = 'shelf';

  /**
   * The dialog this shelf shows, from the `message` property. `null` when
   * unset or left at the `"0"` default — such a shelf is inert.
   */
  get dialogRef(): string | null {
    const raw = this.properties.message?.trim();
    return raw && raw !== '0' ? raw : null;
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
