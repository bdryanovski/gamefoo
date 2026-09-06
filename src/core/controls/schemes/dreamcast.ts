/**
 * Sega Dreamcast control scheme.
 *
 * The Dreamcast controller has a D-pad, analog stick, four face buttons
 * (A, B, X, Y), two triggers (L, R), and Start. It was one of the first
 * controllers with analog triggers.
 *
 * @category Controls
 * @module controls/schemes/dreamcast
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Sega Dreamcast control scheme.
 *
 * Physical layout:
 * ```
 *              [L]      [R]
 *
 *   [D-PAD]              [Y]
 *            [STICK]  [X]   [B]
 *                        [A]
 *              [START]
 * ```
 *
 * Button layout is similar to Xbox (ABXY diamond with A at bottom).
 *
 * Keyboard mapping:
 * - D-pad/Stick: WASD or Arrow keys
 * - A button: X or J (bottom)
 * - B button: C (right)
 * - X button: Z or K (left)
 * - Y button: V (top)
 * - L trigger: Q
 * - R trigger: E
 * - Start: Enter
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, DREAMCAST_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, DREAMCAST_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('R')) player.accelerate();
 * ```
 */
export const DREAMCAST_CONTROLS: ControlScheme = {
  name: 'Dreamcast',
  actions: {
    // D-pad / Analog stick
    UP: binding(['w', 'arrowup'], { axis: 1, axisDirection: -1 }),
    DOWN: binding(['s', 'arrowdown'], { axis: 1, axisDirection: 1 }),
    LEFT: binding(['a', 'arrowleft'], { axis: 0, axisDirection: -1 }),
    RIGHT: binding(['d', 'arrowright'], { axis: 0, axisDirection: 1 }),

    // Face buttons (Xbox-style layout)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A (bottom)
    SECONDARY: binding(['c'], { button: 1 }), // B (right)
    TERTIARY: binding(['z', 'k'], { button: 2 }), // X (left)
    QUATERNARY: binding(['v'], { button: 3 }), // Y (top)

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: unassignedBinding(), // Dreamcast doesn't have Select
    MENU: binding(['escape']),

    // Analog triggers
    L1: binding(['q'], { button: 6 }), // L trigger (analog)
    R1: binding(['e'], { button: 7 }), // R trigger (analog)
    L2: unassignedBinding(), // No L2/R2
    R2: unassignedBinding(),
    L3: unassignedBinding(), // No stick click
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // Dreamcast button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    X: 'TERTIARY',
    Y: 'QUATERNARY',
    L: 'L1',
    R: 'R1',
    // Common actions
    JUMP: 'PRIMARY',
    ATTACK: 'TERTIARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
  },
} as const;
