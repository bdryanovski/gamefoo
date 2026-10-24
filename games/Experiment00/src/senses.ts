import type { CollisionMap, Rect } from '../../../src/index';
import { game } from './services';

/**
 * The world facts roaming critters need, pulled (not pushed) each think —
 * reached through the shared services bag rather than a module singleton.
 * Temperament behaviors call these with the owner's `services`; `WorldSystem`
 * no longer feeds them per frame.
 */

/** The player's world box, or `null` while off-screen / not yet spawned. */
export function playerBox(services: object | undefined): Rect | null {
  return game(services)?.player?.box() ?? null;
}

/** The active screen's collision world, or `null` before the map loads. */
export function collision(services: object | undefined): CollisionMap | null {
  return game(services)?.world?.current()?.collision ?? null;
}

/** Record + open a stalker's one-shot greeting dialog. */
export function greet(services: object | undefined, kind: string, ref: string | null): void {
  const ctx = game(services);
  if (!ctx) {
    return;
  }
  ctx.telemetry.enemyGreeting(kind);
  if (ref) {
    ctx.dialog?.start(ref, 'greeting');
  }
}
