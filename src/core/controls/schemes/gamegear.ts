/**
 * Sega Game Gear control scheme.
 *
 * The Game Gear has a D-pad and two buttons (1 and 2) plus Start.
 * It's essentially a portable Master System, sharing the same
 * button layout but with different button labels.
 *
 * @category Controls
 * @module controls/schemes/gamegear
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Sega Game Gear control scheme.
 *
 * Physical layout:
 * ```
 *   [D-PAD]     [SCREEN]     [1] [2]
 *
 *              [START]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - Button 1: X or J (left)
 * - Button 2: Z or K (right)
 * - Start: Enter
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, GAMEGEAR_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, GAMEGEAR_CONTROLS);
 * if (mapper.isAction('1')) player.jump();
 * if (mapper.isAction('2')) player.attack();
 * ```
 */
export const GAMEGEAR_CONTROLS: ControlScheme = {
  name: 'Game Gear',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons: 1 (left), 2 (right)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // Button 1
    SECONDARY: binding(['z', 'k'], { button: 1 }), // Button 2
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: unassignedBinding(), // No Select button
    MENU: binding(['escape']),

    // No shoulder buttons
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
    // Game Gear button names (numbered)
    '1': 'PRIMARY',
    '2': 'SECONDARY',
    BUTTON_1: 'PRIMARY',
    BUTTON_2: 'SECONDARY',
    // Common actions
    JUMP: 'PRIMARY',
    ATTACK: 'SECONDARY',
  },
} as const;
