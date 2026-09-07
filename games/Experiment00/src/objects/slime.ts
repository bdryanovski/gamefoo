import { ExploreAI } from './ai/explore_ai';
/**
 * The "slime" critter, bound to the `slime` object and driven by its exported
 * state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). It runs its own simple
 * AI every frame:
 *
 * - **Flee** — when the player enters the slime's authored `vision` collider it
 *   bolts directly away (and keeps re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or
 *   a short pause) every so often.
 *
 * Movement slides against the screen's solids and stays on walkable ground.
 * The slime can't see the game-owned player on its own, so the game feeds it the
 * player's box + the screen collision each frame via {@link slime.sense}; the
 * state machine is switched to match the heading so the animation follows.
 */
export class Slime extends ExploreAI {
  public static override readonly type = 'slime';
}
