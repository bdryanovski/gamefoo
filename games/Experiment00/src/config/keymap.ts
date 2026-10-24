import { GAME_CONTROLS } from './controls';

/**
 * Keyboard keys used by the active control scheme.
 *
 * The scroll shield derives this from the scheme, so switching controllers
 * does not leave stale keys in the list.
 */
export const GAME_KEYS = new Set(
  Object.values(GAME_CONTROLS.actions).flatMap((action) =>
    (action?.keys ?? []).map((key) => key.toLowerCase()),
  ),
);
