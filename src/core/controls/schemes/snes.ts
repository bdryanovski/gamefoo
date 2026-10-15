/**
 * Super Nintendo Entertainment System (SNES) control scheme.
 *
 * The SNES controller expanded on the NES with four face buttons
 * (A, B, X, Y) and shoulder buttons (L, R). This layout became the
 * template for modern controllers.
 *
 * @category Controls
 * @module controls/schemes/snes
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * SNES control scheme.
 *
 * Physical layout:
 * ```
 *        [L]                    [R]
 *              [SELECT] [START]
 *   [D-PAD]              [Y] [X]
 *                        [B] [A]
 * ```
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J (bottom right)
 * - B button: Z or K (bottom left)
 * - X button: C (top right)
 * - Y button: V (top left)
 * - L shoulder: Q
 * - R shoulder: E
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, SNES_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, SNES_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('Y')) player.attack();
 * if (mapper.isAction('L')) camera.rotateLeft();
 * ```
 */
export const SNES_CONTROLS: ControlScheme = {
  name: 'SNES',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons in Nintendo layout
    // Note: Nintendo uses B/A on bottom, Y/X on top (opposite of Xbox)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A (bottom right)
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B (bottom left)
    TERTIARY: binding(['c'], { button: 2 }), // X (top right)
    QUATERNARY: binding(['v'], { button: 3 }), // Y (top left)

    // System buttons
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // Shoulder buttons
    L1: binding(['q'], { button: 4 }), // L
    R1: binding(['e'], { button: 5 }), // R
    L2: unassignedBinding(), // SNES doesn't have L2/R2
    R2: unassignedBinding(),
    L3: unassignedBinding(), // SNES doesn't have stick clicks
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // SNES button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    X: 'TERTIARY',
    Y: 'QUATERNARY',
    L: 'L1',
    R: 'R1',
    // Common actions
    JUMP: 'PRIMARY',
    RUN: 'SECONDARY',
    ATTACK: 'QUATERNARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
  },
} as const;
