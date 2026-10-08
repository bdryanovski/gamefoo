import type { DitherLight } from '../../../../src/index';
import { GlowShader, MapObject, type Rect } from '../../../../src/index';
import { getFog } from '../fog';

const CRITTER_SIZE = 64;

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

  /** This skull's ghost-light in the dither fog. */
  private fogLight: DitherLight | null = null;

  override onSpawn(): void {
    super.onSpawn();
    const fog = getFog();
    if (!fog) {
      return;
    }
    this.fogLight = fog.addLight({
      x: this.x + CRITTER_SIZE,
      y: this.y + CRITTER_SIZE,
      followTarget: this,
      offsetX: CRITTER_SIZE / 3.2,
      offsetY: CRITTER_SIZE / 1.5,
      innerRadius: 15,
      ditherRadius: 80,
      strength: 1,
      pattern: 'bayer8',
      flickerAmount: 0.12,
      flickerSpeed: 0.2,
    });

    this.attachShader(
      new GlowShader({
        color: '#759553',
        radius: 42,
        intensity: 2,
        pulseSpeed: 0.2,
        pulseAmount: 0,
      }),
    );
  }

  /**
   * The dialog to run, from the `message` property. `null` when unset — such a
   * king is inert (silent).
   */
  get dialogRef(): string | null {
    const raw = this.properties.message;
    return raw?.trim() ? raw.trim() : null;
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
