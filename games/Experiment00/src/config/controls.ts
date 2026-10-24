import { CONTROL_SCHEMES, binding, extendScheme, type ControlScheme } from '../../../../src/index';

/**
 * Action names used by Experiment00.
 *
 * They are standard action names so any built-in preset can replace
 * {@link GAME_CONTROLS} without changing the systems.
 */
export const GAME_ACTION = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
  interact: 'PRIMARY',
  inventory: 'MENU',
} as const;

/**
 * Experiment00's default controller.
 *
 * It keeps the game's existing keyboard layout and adds gamepad bindings:
 * the D-pad and left stick move, A/Cross interacts, and Start opens the
 * inventory. Change {@link GAME_CONTROLS} to a built-in scheme such as
 * `CONTROL_SCHEMES.NES` to run with a console layout instead.
 *
 * Touch controls can later feed the same actions without touching systems.
 */
export const EXPERIMENT00_CONTROLS: ControlScheme = extendScheme(CONTROL_SCHEMES.DEFAULT, {
  name: 'Experiment00',
  actions: {
    UP: binding(['w', 'arrowup'], { button: 12, axis: 1, axisDirection: -1 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13, axis: 1, axisDirection: 1 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14, axis: 0, axisDirection: -1 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15, axis: 0, axisDirection: 1 }),
    PRIMARY: binding(['e', ' ', 'enter', 'x', 'j'], { button: 0 }),
    MENU: binding(['escape'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
  },
  aliases: {
    INTERACT: 'PRIMARY',
    CONFIRM: 'PRIMARY',
    ACCEPT: 'PRIMARY',
    USE: 'PRIMARY',
    INVENTORY: 'MENU',
    CANCEL: 'MENU',
    BACK: 'MENU',
  },
});

/** The scheme the game is currently using. */
export const GAME_CONTROLS: ControlScheme = EXPERIMENT00_CONTROLS;
