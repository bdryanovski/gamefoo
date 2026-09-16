import { Firelight, type FireEffects } from './base/firelight';

/**
 * Custom class bound to the "torch" object — a wall torch the player can
 * toggle lit/unlit. Shares all behaviour with {@link Firelight}; only the
 * registry `type` and a smaller flame differ from a {@link Campfire}. The
 * two-state machine and `solid` collider come from the object definition, so
 * there is nothing to load or configure.
 *
 * Bind it with `registry.register(Torch)` (keyed by its static `type`,
 * matching the object's name).
 */
export class Torch extends Firelight {
  static override readonly type = 'light';

  protected override effects(): FireEffects {
    return {
      glow: { color: '#ffb24a', radius: 28, intensity: 0.22, pulseSpeed: 1.3, pulseAmount: 0.4 },
      particles: { color: '#ffd27a', rate: 4, speed: 9, spread: 3, gravity: 1, lifetime: 8 },
    };
  }
}
