/**
 * Nintendo DS control scheme.
 *
 * The Nintendo DS has a D-pad, four face buttons (A, B, X, Y), L/R
 * shoulder buttons, Start, and Select. It also has a touchscreen,
 * but touch input is handled separately from button controls.
 *
 * @category Controls
 * @module controls/schemes/nds
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Nintendo DS control scheme.
 *
 * Physical layout:
 * ```
 *   [L]                    [R]
 *
 *   [D-PAD]    [SCREEN]   [X]
 *                       [Y] [A]
 *                         [B]
 *
 *          [SELECT] [START]
 * ```
 *
 * Button layout matches SNES/GBA conventions with Nintendo's
 * standard A=confirm, B=cancel pattern.
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J (right)
 * - B button: Z or K (bottom)
 * - X button: C (top)
 * - Y button: V (left)
 * - L/R: Q/E
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, NDS_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, NDS_CONTROLS);
 * if (mapper.isAction('A')) player.confirm();
 * if (mapper.isAction('B')) player.back();
 * if (mapper.isAction('Y')) player.openMenu();
 * ```
 */
export const NDS_CONTROLS: ControlScheme = {
  name: 'Nintendo DS',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons (Nintendo diamond layout)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A (right)
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B (bottom)
    TERTIARY: binding(['c'], { button: 2 }), // X (top)
    QUATERNARY: binding(['v'], { button: 3 }), // Y (left)

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // Shoulder buttons
    L1: binding(['q'], { button: 4 }), // L
    R1: binding(['e'], { button: 5 }), // R
    L2: unassignedBinding(), // DS doesn't have L2/R2
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
    // Nintendo button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    X: 'TERTIARY',
    Y: 'QUATERNARY',
    L: 'L1',
    R: 'R1',
    // Common actions
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    BACK: 'SECONDARY',
    JUMP: 'SECONDARY', // Many DS platformers use B for jump
  },
} as const;
