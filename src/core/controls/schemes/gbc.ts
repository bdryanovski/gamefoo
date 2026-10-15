/**
 * Nintendo Game Boy Color control scheme.
 *
 * The Game Boy Color has the same button layout as the original Game Boy:
 * D-pad, A, B, Start, and Select. The differences are in display and
 * hardware capabilities, not controls.
 *
 * @category Controls
 * @module controls/schemes/gbc
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Game Boy Color control scheme.
 *
 * Physical layout (same as Game Boy):
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
 */
export const GBC_CONTROLS: ControlScheme = {
  name: 'Game Boy Color',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons (same as Game Boy)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // System buttons
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
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
    // Game Boy Color button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    // Common actions
    JUMP: 'PRIMARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    BACK: 'SECONDARY',
  },
} as const;
