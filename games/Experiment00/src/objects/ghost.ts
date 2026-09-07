import { ExploreAI } from './ai/explore_ai';

/**
 * The "ghost" critter, bound to the `ghost` object and driven by its exported
 * state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). It runs its own simple
 * AI every frame:
 *
 * - **Flee** — when the player enters the ghost's authored `vision` collider it
 *   bolts directly away (and keeps re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or
 *   a short pause) every so often.
 *
 * Movement slides against the screen's solids and stays on walkable ground.
 * The ghost can't see the game-owned player on its own, so the game feeds it the
 * player's box + the screen collision each frame via {@link ghost.sense}; the
 * state machine is switched to match the heading so the animation follows.
 */
export class Ghost extends ExploreAI {
  static override readonly type = 'ghost';
}
