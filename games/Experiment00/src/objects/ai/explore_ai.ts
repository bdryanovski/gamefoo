import { ExploreBehavior } from '../../behaviors/explore';
import { CritterAI } from './critter_ai';

/**
 * A skittish critter (rat, bat, slime, ghost, flying skull). It is only a
 * {@link CritterAI} (the shared movement/perception brain-stem) with the
 * {@link ExploreBehavior} temperament attached on spawn — flee when the player
 * enters the `vision` zone, otherwise wander.
 */
export class ExploreAI extends CritterAI {
  static override readonly type: string;

  override onSpawn(): void {
    super.onSpawn();
    this.attachBehaviour(new ExploreBehavior(this));
  }

  /** True while the critter is bolting away from a sensed player. */
  get fleeing(): boolean {
    return this.sees;
  }
}
