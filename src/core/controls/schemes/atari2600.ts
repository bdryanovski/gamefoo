/**
 * Atari 2600 control scheme.
 *
 * The Atari 2600 joystick has an 8-way stick and a single fire button.
 * The console itself has Reset and Select switches used for game control.
 *
 * @category Controls
 * @module controls/schemes/atari2600
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Atari 2600 control scheme.
 *
 * Physical layout (joystick):
 * ```
 *     [STICK]
 *       |
 *     [FIRE]
 * ```
 *
 * Keyboard mapping:
 * - Joystick: WASD or Arrow keys
 * - Fire: X, J, or Space
 * - Reset: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, ATARI_2600_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, ATARI_2600_CONTROLS);
 * if (mapper.isAction('FIRE')) player.shoot();
 * ```
 */
export const ATARI_2600_CONTROLS: ControlScheme = {
  name: 'Atari 2600',
  actions: {
    // 8-way joystick
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Single fire button
    PRIMARY: binding(['x', 'j', 'space'], { button: 0 }), // Fire
    SECONDARY: unassignedBinding(), // No second button
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // Console switches
    START: binding(['enter'], { button: 9 }), // Reset
    SELECT: binding(['shift'], { button: 8 }), // Select
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
    // Atari terminology
    FIRE: 'PRIMARY',
    RESET: 'START',
    // Generic
    ACTION: 'PRIMARY',
    SHOOT: 'PRIMARY',
  },
} as const;
