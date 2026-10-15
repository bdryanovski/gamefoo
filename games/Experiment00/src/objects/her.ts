import type { DitherLight } from '../../../../src';
import { getFog } from '../fog';
import { CRITTER_SIZE } from './ai/critter_ai';
import { ExploreAI } from './ai/explore_ai';

export class Her extends ExploreAI {
  static override readonly type = 'her';

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
