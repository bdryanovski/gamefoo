/**
 * Sega Genesis / Mega Drive control scheme.
 *
 * The original Genesis controller has a D-pad and three buttons (A, B, C)
 * plus Start. The 6-button controller added X, Y, Z and Mode, but this
 * scheme covers the standard 3-button layout.
 *
 * @category Controls
 * @module controls/schemes/genesis
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Sega Genesis / Mega Drive control scheme (3-button).
 *
 * Physical layout:
 * ```
 *                   [START]
 *   [D-PAD]      [A] [B] [C]
 * ```
 *
 * Button conventions vary by game:
 * - Sonic: A/B/C all jump, some games use C for spin dash
 * - Fighting games: A = punch, B = kick, C = special
 * - Action games: A = jump, B = attack, C = special
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: Z or K (leftmost)
 * - B button: X or J (middle)
 * - C button: C (rightmost)
 * - Start: Enter
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, GENESIS_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, GENESIS_CONTROLS);
 * // Sonic-style: any button jumps
 * if (mapper.isAction('A') || mapper.isAction('B') || mapper.isAction('C')) {
 *   player.jump();
 * }
 * ```
 */
export const GENESIS_CONTROLS: ControlScheme = {
  name: 'Genesis / Mega Drive',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons: A, B, C (left to right)
    PRIMARY: binding(['z', 'k'], { button: 0 }), // A (left)
    SECONDARY: binding(['x', 'j'], { button: 1 }), // B (middle)
    TERTIARY: binding(['c'], { button: 2 }), // C (right)
    QUATERNARY: unassignedBinding(), // 3-button doesn't have a 4th

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: unassignedBinding(), // Genesis doesn't have Select (Mode on 6-button)
    MENU: binding(['escape']),

    // No shoulder buttons on Genesis
    L1: unassignedBinding(),
    R1: unassignedBinding(),
    L2: unassignedBinding(),
    R2: unassignedBinding(),
    L3: unassignedBinding(),
    R3: unassignedBinding(),

    // No C-buttons (Genesis C is a face button, not N64-style)
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // Genesis button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    C: 'TERTIARY',
    // Common actions
    JUMP: 'PRIMARY',
    ATTACK: 'SECONDARY',
    SPECIAL: 'TERTIARY',
  },
} as const;
