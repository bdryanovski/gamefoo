/**
 * PICO-8 fantasy console control scheme.
 *
 * PICO-8 uses a simple 6-button layout: D-pad and two action buttons
 * (O and X). The standard keyboard mapping uses arrow keys for movement
 * and Z/X or C/V for the buttons.
 *
 * @category Controls
 * @module controls/schemes/pico8
 * @since 0.5.0
 *
 * @see {@link https://www.lexaloffle.com/pico-8.php} PICO-8 Official Site
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * PICO-8 control scheme.
 *
 * Physical layout:
 * ```
 *     [D-PAD]     [O] [X]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: Arrow keys (or S/F/E/D for Player 2)
 * - O button: Z or C or N
 * - X button: X or V or M
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, PICO8_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, PICO8_CONTROLS);
 * if (mapper.isAction('O')) player.jump();  // Console-specific alias
 * if (mapper.isAction('X')) player.shoot(); // Console-specific alias
 * ```
 */
export const PICO8_CONTROLS: ControlScheme = {
  name: 'PICO-8',
  actions: {
    // D-pad - Arrow keys only (PICO-8 standard)
    UP: binding(['arrowup', 'e'], { button: 12 }),
    DOWN: binding(['arrowdown', 'd'], { button: 13 }),
    LEFT: binding(['arrowleft', 's'], { button: 14 }),
    RIGHT: binding(['arrowright', 'f'], { button: 15 }),

    // PICO-8 buttons: O (left) and X (right)
    // O is typically jump/confirm
    PRIMARY: binding(['z', 'c', 'n'], { button: 0 }), // O button
    // X is typically shoot/cancel
    SECONDARY: binding(['x', 'v', 'm'], { button: 1 }), // X button

    // PICO-8 doesn't have additional face buttons
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // System - PICO-8 uses P for pause menu
    START: binding(['p', 'enter'], { button: 9 }),
    SELECT: unassignedBinding(), // No select button
    MENU: binding(['escape'], { button: 16 }),

    // No shoulder buttons on PICO-8
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
    // PICO-8 button names
    O: 'PRIMARY',
    X: 'SECONDARY',
    // Common game actions
    JUMP: 'PRIMARY',
    SHOOT: 'SECONDARY',
    ACTION: 'PRIMARY',
  },
} as const;
