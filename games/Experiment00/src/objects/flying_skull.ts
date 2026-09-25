import { CRITTER_SIZE } from './ai/critter_ai';
import { ExploreAI } from './ai/explore_ai';
import { DitherLight } from '../../../../src/index';
import { getFog } from '../fog';

/**
 * The "flying_skull" critter, bound to the `flying_skull` object and driven by its exported
 * state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). It runs its own simple
 * AI every frame:
 *
 * - **Flee** — when the player enters the flying_skull's authored `vision` collider it
 *   bolts directly away (and keeps re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or
 *   a short pause) every so often.
 *
 * Movement slides against the screen's solids and stays on walkable ground.
 * The flying_skull can't see the game-owned player on its own, so the game feeds it the
 * player's box + the screen collision each frame via {@link FlyingSkull.sense}; the
 * state machine is switched to match the heading so the animation follows.
 *
 * It also carries a small, unsteady ghost-light through the dither fog: a
 * pale-blue reveal that follows the skull as it wanders (and bolts), so the
 * critter drifts through the darkness as a fading wisp.
 */
export class FlyingSkull extends ExploreAI {
  static override readonly type = 'flying_skull';

  /** This skull's ghost-light in the dither fog. */
  private fogLight: DitherLight | null = null;

  override onSpawn(): void {
    super.onSpawn();
    const fog = getFog();
    if (!fog) {
      return;
    }
    this.fogLight = fog.addLight({
      x: this.x + CRITTER_SIZE / 2,
      y: this.y + CRITTER_SIZE / 2,
      followTarget: this,
      offsetX: CRITTER_SIZE / 2,
      offsetY: CRITTER_SIZE / 2,
      innerRadius: 10,
      ditherRadius: 50,
      strength: 1,
      pattern: 'bayer8',
      flickerAmount: 0.12,
      flickerSpeed: 1.7,
    });
  }

  override onDespawn(): void {
    if (this.fogLight) {
      getFog()?.removeLight(this.fogLight);
      this.fogLight = null;
    }
    super.onDespawn();
  }
}
