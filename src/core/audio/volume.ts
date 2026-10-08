/**
 * Volume maths for the audio system — no Web Audio, no state.
 *
 * @category Audio
 * @since 0.5.0
 */

/**
 * Clamps a volume to `0..1`, substituting `fallback` when the value is
 * not a finite number (NaN, ±Infinity, or non-numeric junk from JSON).
 *
 * The usual `Math.min(1, Math.max(0, v))` clamp is NaN-transparent —
 * `Math.max(0, NaN)` is `NaN` — so one garbage volume would poison a
 * gain node forever. This clamp keeps the audio graph finite no matter
 * what the game hands it: unusable input resolves to `fallback` instead.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * clamp01(0.8, 1); // 0.8
 * clamp01(4, 1); // 1 — clamped down
 * clamp01(Number.NaN, 1); // 1 — garbage resolved to the fallback
 * ```
 */
export function clamp01(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, value));
}
