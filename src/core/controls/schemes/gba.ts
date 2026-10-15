/**
 * Nintendo Game Boy Advance control scheme.
 *
 * The GBA added shoulder buttons (L and R) to the Game Boy layout,
 * bringing it closer to the SNES controller while remaining portable.
 *
 * @category Controls
 * @module controls/schemes/gba
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Game Boy Advance control scheme.
 *
 * Physical layout:
 * ```
 *   [L]                    [R]
 *
 *                      [A]
 *   [D-PAD]         [B]
 *
 *      [SELECT] [START]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J
 * - B button: Z or K
 * - L shoulder: Q
 * - R shoulder: E
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, GBA_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, GBA_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('L')) player.prevWeapon();
 * if (mapper.isAction('R')) player.nextWeapon();
 * ```
 */
export const GBA_CONTROLS: ControlScheme = {
  name: 'Game Boy Advance',
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

    // Shoulder buttons (new for GBA)
    L1: binding(['q'], { button: 4 }), // L
    R1: binding(['e'], { button: 5 }), // R
    L2: unassignedBinding(), // No L2/R2
    R2: unassignedBinding(),
    L3: unassignedBinding(), // No stick clicks
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // GBA button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    L: 'L1',
    R: 'R1',
    // Common actions
    JUMP: 'PRIMARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    BACK: 'SECONDARY',
  },
} as const;
