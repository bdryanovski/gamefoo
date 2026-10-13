import { Firelight, type FireFogLight } from './base/firelight';

export class Candles extends Firelight {
  static override readonly type = 'candles';

  protected override fogLightOptions(): FireFogLight {
    return {
      innerRadius: 5,
      ditherRadius: 80,
      strength: 1,
      pattern: 'bayer8',
      flickerAmount: 0.01,
      flickerSpeed: 0.3,
    };
  }
}
