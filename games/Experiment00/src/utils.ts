/** Smooth acceleration/deceleration for the iris wipe, `0..1 → 0..1`. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
