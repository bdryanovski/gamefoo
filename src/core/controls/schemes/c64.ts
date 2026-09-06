/**
 * Commodore 64 control scheme.
 *
 * The C64 primarily used joysticks with a single fire button, compatible
 * with Atari 2600 controllers. The keyboard could also be used for input,
 * but most games used joystick port 2.
 *
 * @category Controls
 * @module controls/schemes/c64
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Commodore 64 control scheme.
 *
 * Physical layout (joystick):
 * ```
 *     [STICK]
 *       |
 *     [FIRE]
 * ```
 *
 * Many C64 games also supported keyboard controls as alternatives
 * or for additional functions. Common keyboard controls included
 * Q/A/O/P for directions and Space for fire.
 *
 * Keyboard mapping:
 * - Joystick: WASD, Arrow keys, or Q/A/O/P (classic C64 style)
 * - Fire: X, J, Space, or Ctrl
 * - Run/Stop: Escape (pause equivalent)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, C64_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, C64_CONTROLS);
 * if (mapper.isAction('FIRE')) player.shoot();
 * ```
 */
export const C64_CONTROLS: ControlScheme = {
  name: 'Commodore 64',
  actions: {
    // 8-way joystick (with classic C64 keyboard alternatives)
    UP: binding(['w', 'arrowup', 'q'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown', 'a'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft', 'o'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright', 'p'], { button: 15 }),

    // Single fire button
    PRIMARY: binding(['x', 'j', 'space', 'control'], { button: 0 }), // Fire
    SECONDARY: unassignedBinding(), // No second button
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // System (keyboard-based)
    START: binding(['enter', 'f1'], { button: 9 }), // Start game
    SELECT: binding(['f3'], { button: 8 }), // Often used for options
    MENU: binding(['escape']), // Run/Stop key

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
    // C64 terminology
    FIRE: 'PRIMARY',
    RUN_STOP: 'MENU',
    // Generic actions
    ACTION: 'PRIMARY',
    SHOOT: 'PRIMARY',
    JUMP: 'PRIMARY',
  },
} as const;
