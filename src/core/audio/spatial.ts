/**
 * Pure spatial maths for the audio system — no Web Audio, no state, so the
 * distance model can be unit-tested and reasoned about in isolation.
 *
 * @category Audio
 * @since 0.5.0
 */

import type { Vector2 } from '../../generic_types';
import type { DistanceConfig, PositionTarget } from './types';

/**
 * Reads the current position of a {@link PositionTarget}.
 *
 * Returns a fresh {@link Vector2} — the result is never an alias of the
 * target, so callers cannot accidentally mutate the game object it came
 * from.
 *
 * @since 0.5.0
 */
export function resolvePosition(target: PositionTarget): Vector2 {
  if (typeof target === 'function') {
    return target();
  }
  return { x: target.x, y: target.y };
}

/**
 * Volume factor `0..1` for a sound at `emitter` heard from `listener`,
 * falling off linearly across the {@link DistanceConfig} range:
 *
 * - inside `min` — `1` (full volume),
 * - between `min` and `max` — linear ramp down to `0`,
 * - at or beyond `max` — `0` (silent).
 *
 * A degenerate `max <= 0` range is treated as "not spatialised" (`1`) so a
 * malformed JSON entry can never mute a sound completely by accident.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const factor = distanceFactor(player, torch, { min: 32, max: 220 });
 * // 100px away → roughly 0.68 → the torch hums at 68% volume.
 * ```
 */
export function distanceFactor(
  listener: Vector2,
  emitter: Vector2,
  config: DistanceConfig,
): number {
  if (config.max <= 0) {
    // Degenerate range — treat the sound as non-spatial.
    return 1;
  }
  const min = config.min < 0 ? 0 : config.min;
  const dx = emitter.x - listener.x;
  const dy = emitter.y - listener.y;
  const distanceSquared = dx * dx + dy * dy;
  const maxSquared = config.max * config.max;
  // Early out before the expensive sqrt — most emitters are out of range.
  if (distanceSquared >= maxSquared) {
    return 0;
  }
  if (config.max <= min) {
    // Step falloff — everything inside `max` is full volume.
    return 1;
  }
  const distance = Math.sqrt(distanceSquared);
  if (distance <= min) {
    return 1;
  }
  return (config.max - distance) / (config.max - min);
}
