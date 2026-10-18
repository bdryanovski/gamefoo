import { FogLight, GHOST_LIGHT } from '../behaviors/fog_light';
import { ExploreAI } from './ai/explore_ai';

/**
 * The "her" critter: a wandering {@link ExploreAI} that drifts the dark with the
 * shared {@link FogLight} halo — the same {@link GHOST_LIGHT} tuning as the
 * flying skull, attached on spawn.
 */
export class Her extends ExploreAI {
  static override readonly type = 'her';

  override onSpawn(): void {
    super.onSpawn();
    this.attachBehaviour(new FogLight(this, GHOST_LIGHT));
  }
}
