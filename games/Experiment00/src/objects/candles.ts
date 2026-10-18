import { MapObject } from '../../../../src/index';
import { LightSource, DEFAULT_FIRE_EFFECTS, type FireFogLight } from '../behaviors/light_source';

const FOG: FireFogLight = {
  innerRadius: 5,
  ditherRadius: 80,
  strength: 1,
  pattern: 'bayer8',
  flickerAmount: 0.01,
  flickerSpeed: 0.3,
};

/** A cluster of candles: the default flame with a small, calm fog ring. */
export class Candles extends MapObject {
  static override readonly type = 'candles';

  override onSpawn(): void {
    this.attachBehaviour(new LightSource(this, DEFAULT_FIRE_EFFECTS, FOG));
  }
}
