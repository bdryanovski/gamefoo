import type { DitherFog } from '../../../src/index';

/**
 * The game's single dither-fog instance, shared with the object classes
 * (campfires, torches, chests, flying skulls) so each can attach its own
 * light on spawn. `main.ts` creates the fog and publishes it here **before**
 * the map loads — objects spawn during load, so the fog must already be
 * reachable when their `onSpawn` runs.
 */

let instance: DitherFog | null = null;

/** Publishes the shared fog instance (called once from `main.ts`). */
export function setFog(fog: DitherFog | null): void {
  instance = fog;
}

/** The shared fog instance, or `null` before the game setup creates it. */
export function getFog(): DitherFog | null {
  return instance;
}
