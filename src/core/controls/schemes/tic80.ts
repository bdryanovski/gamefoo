/**
 * TIC-80 fantasy console control scheme.
 *
 * TIC-80 uses an 8-button layout: D-pad and four action buttons
 * (A, B, X, Y). The standard keyboard mapping uses arrow keys or
 * WASD-style keys for movement.
 *
 * @category Controls
 * @module controls/schemes/tic80
 * @since 0.5.0
 *
 * @see {@link https://tic80.com/} TIC-80 Official Site
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * TIC-80 control scheme.
 *
 * Physical layout:
 * ```
 *     [D-PAD]     [A] [B]
 *                 [X] [Y]
 * ```
 *
 * Default keyboard mapping (Player 1):
 * - D-pad: Arrow keys (Up, Down, Left, Right)
 * - A button: Z
 * - B button: X
 * - X button: A
 * - Y button: S
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, TIC80_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, TIC80_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('B')) player.attack();
 * ```
 */
export const TIC80_CONTROLS: ControlScheme = {
  name: 'TIC-80',
  actions: {
    // D-pad - Arrow keys
    UP: binding(['arrowup'], { button: 12 }),
    DOWN: binding(['arrowdown'], { button: 13 }),
    LEFT: binding(['arrowleft'], { button: 14 }),
    RIGHT: binding(['arrowright'], { button: 15 }),

    // TIC-80 face buttons
    PRIMARY: binding(['z', 'j'], { button: 0 }), // A button
    SECONDARY: binding(['x', 'k'], { button: 1 }), // B button
    TERTIARY: binding(['a'], { button: 2 }), // X button
    QUATERNARY: binding(['s'], { button: 3 }), // Y button

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape'], { button: 16 }),

    // No shoulder buttons on TIC-80
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
    // TIC-80 button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    X: 'TERTIARY',
    Y: 'QUATERNARY',
    // Common game actions
    JUMP: 'PRIMARY',
    ACTION: 'PRIMARY',
  },
} as const;
