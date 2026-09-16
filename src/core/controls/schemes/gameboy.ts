/**
 * Nintendo Game Boy control scheme.
 *
 * The original Game Boy has a D-pad and four buttons: A, B, Start, Select.
 * The same layout is used for Game Boy Pocket and Game Boy Light.
 *
 * @category Controls
 * @module controls/schemes/gameboy
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Game Boy control scheme.
 *
 * Physical layout:
 * ```
 *                   [A]
 *   [D-PAD]      [B]
 *
 *      [SELECT] [START]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J
 * - B button: Z or K
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, GAMEBOY_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, GAMEBOY_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('B')) player.cancel();
 * ```
 */
export const GAMEBOY_CONTROLS: ControlScheme = {
  name: 'Game Boy',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B
    TERTIARY: unassignedBinding(), // No X button
    QUATERNARY: unassignedBinding(), // No Y button

    // System buttons
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // No shoulder buttons on original Game Boy
    L1: unassignedBinding(),
    R1: unassignedBinding(),
    L2: unassignedBinding(),
    R2: unassignedBinding(),
    L3: unassignedBinding(),
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // Game Boy button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    // Common actions
    JUMP: 'PRIMARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    BACK: 'SECONDARY',
  },
} as const;
