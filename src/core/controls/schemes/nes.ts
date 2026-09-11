/**
 * Nintendo Entertainment System (NES) control scheme.
 *
 * The NES controller has a D-pad and four buttons: A, B, Start, and Select.
 * A is typically used for jumping/confirming, B for running/canceling.
 *
 * @category Controls
 * @module controls/schemes/nes
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * NES control scheme.
 *
 * Physical layout:
 * ```
 *              [SELECT] [START]
 *   [D-PAD]              [B] [A]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J (right button - jump/confirm)
 * - B button: Z or K (left button - run/cancel)
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, NES_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, NES_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('B')) player.run();
 * ```
 */
export const NES_CONTROLS: ControlScheme = {
  name: 'NES',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons: A (right), B (left)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A - jump/confirm
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B - run/cancel
    TERTIARY: unassignedBinding(), // NES doesn't have X
    QUATERNARY: unassignedBinding(), // NES doesn't have Y

    // System buttons
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // No shoulder buttons on NES
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
    // NES button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    // Common game actions
    JUMP: 'PRIMARY',
    RUN: 'SECONDARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
  },
} as const;
