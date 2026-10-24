import { FogLight, GHOST_LIGHT } from '../behaviors/fog_light';
import { ExploreAI } from './ai/explore_ai';

/**
 * The "flying_skull" critter, bound to the `flying_skull` object and driven by
 * its exported state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). It wanders
 * (and flees the player) via {@link ExploreAI}, and its signature ghost-light is
 * the shared {@link FogLight} behaviour — attached on spawn with the critter
 * {@link GHOST_LIGHT} tuning — so it drifts through the darkness as a fading
 * wisp.
 */
export class FlyingSkull extends ExploreAI {
  static override readonly type = 'flying_skull';

  override onSpawn(): void {
    super.onSpawn();
    this.attachBehaviour(new FogLight(this, GHOST_LIGHT));
  }
}
