/**
 * Nintendo Famicom (Family Computer) control scheme.
 *
 * The Famicom controller is functionally identical to the NES controller:
 * D-pad, A, B, Start, and Select. The main differences were physical
 * (hardwired controllers) and regional (Japan).
 *
 * @category Controls
 * @module controls/schemes/famicom
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Famicom control scheme.
 *
 * Physical layout (same as NES):
 * ```
 *              [SELECT] [START]
 *   [D-PAD]              [B] [A]
 * ```
 *
 * Note: Famicom Player 2 controller had a microphone instead of Start/Select,
 * but this scheme represents the standard Player 1 controller.
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
export const FAMICOM_CONTROLS: ControlScheme = {
  name: 'Famicom',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons (same as NES)
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
    // Button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    // Common actions
    JUMP: 'PRIMARY',
    RUN: 'SECONDARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
  },
} as const;
