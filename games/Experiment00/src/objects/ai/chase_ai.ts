import { StalkBehavior } from '../../behaviors/stalk';
import { StalkerBehavior } from '../../behaviors/interactable';
import type { Rect } from '../../../../../src/index';
import { CritterAI } from './critter_ai';

/**
 * A hostile stalker (skeleton, goblin): a {@link CritterAI} with the
 * {@link StalkBehavior} temperament attached on spawn — approach the player,
 * then open its `message` dialog once when the player enters the `activation`
 * zone. Pressing **E** next to it replays that dialog (the Interactable
 * surface below).
 */
export abstract class ChaseAI extends CritterAI {
  static override readonly type: string;

  override onSpawn(): void {
    super.onSpawn();
    this.attachBehaviour(new StalkBehavior(this));
    this.attachBehaviour(new StalkerBehavior(this));
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
      box.x < a.x + a.width &&
      box.x + box.width > a.x &&
      box.y < a.y + a.height &&
      box.y + box.height > a.y
    );
  }

}
