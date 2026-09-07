import { ExploreAI } from './ai/explore_ai';

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
 * player's box + the screen collision each frame via {@link flying_skull.sense}; the
 * state machine is switched to match the heading so the animation follows.
 */
export class FlyingSkull extends ExploreAI {
  public static override readonly type = 'flying_skull';
}
