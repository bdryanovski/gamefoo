import { MapObject } from '../../../../src/index';
import { LightSource, type FireEffects, type FireFogLight } from '../behaviors/light_source';

/** A small, quick flame: tighter glow, fewer/slower embers than a campfire. */
const EFFECTS: FireEffects = {
  glow: { color: '#ffb24a', radius: 28, intensity: 0.22, pulseSpeed: 1.3, pulseAmount: 0.4 },
  particles: { color: '#ffd27a', rate: 4, speed: 9, spread: 3, gravity: 1, lifetime: 8 },
};

/**
 * A tight, nervous flame: fully clear at its core, a long slow dissolve
 * through the dither, quick flicker so it feels alive.
 */
const FOG: FireFogLight = {
  innerRadius: 5,
  ditherRadius: 70,
  strength: 1,
  pattern: 'bayer8',
  color: '#ffb24a',
  glowAlpha: 0.16,
  flickerAmount: 0.18,
  flickerSpeed: 0.4,
};

/**
 * Custom class bound to the "torch" object — a wall torch the player can
 * toggle lit/unlit. Shares the {@link LightSource} behavior; only the registry
 * `type` and a smaller flame differ from a campfire. The two-state machine and
 * `solid` collider come from the object definition, so there is nothing to
 * load or configure.
 *
 * Bind it with `registry.register(Torch)` (keyed by its static `type`,
 * matching the object name `"light"`).
 */
export class Torch extends MapObject {
  static override readonly type = 'light';

  override onSpawn(): void {
    this.attachBehaviour(new LightSource(this, EFFECTS, FOG));
  }
}
