/**
 * Sony PlayStation (PS1/PSX) control scheme.
 *
 * The PlayStation controller introduced the iconic shape-based button
 * layout (Cross, Circle, Square, Triangle) and dual shoulder buttons.
 * Later revisions added analog sticks (DualShock).
 *
 * @category Controls
 * @module controls/schemes/ps1
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * PlayStation control scheme.
 *
 * Physical layout:
 * ```
 *   [L2]  [L1]              [R1]  [R2]
 *
 *              [SELECT] [START]
 *   [D-PAD]              [△]
 *                      [□]  [○]
 *                        [×]
 * ```
 *
 * Button conventions (Japanese vs Western differ):
 * - Japan: ○ = confirm, × = cancel
 * - West: × = confirm, ○ = cancel
 * This scheme uses Western conventions (× = PRIMARY/confirm).
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - Cross (×): X or J (confirm)
 * - Circle (○): Z or K (cancel)
 * - Square (□): C (attack)
 * - Triangle (△): V (menu/special)
 * - L1/R1: Q/E
 * - L2/R2: 1/2
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, PS1_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, PS1_CONTROLS);
 * if (mapper.isAction('CROSS')) player.jump();      // or 'X'
 * if (mapper.isAction('SQUARE')) player.attack();
 * if (mapper.isAction('R1')) player.aim();
 * ```
 */
export const PS1_CONTROLS: ControlScheme = {
  name: 'PlayStation',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons (Western convention: X = confirm)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // Cross (×) - confirm
    SECONDARY: binding(['z', 'k'], { button: 1 }), // Circle (○) - cancel
    TERTIARY: binding(['c'], { button: 2 }), // Square (□) - attack
    QUATERNARY: binding(['v'], { button: 3 }), // Triangle (△) - menu

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // Shoulder buttons
    L1: binding(['q'], { button: 4 }),
    R1: binding(['e'], { button: 5 }),
    L2: binding(['1'], { button: 6 }),
    R2: binding(['2'], { button: 7 }),
    L3: unassignedBinding(), // Original PS1 controller had no stick clicks
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // PlayStation button names (shapes)
    CROSS: 'PRIMARY',
    CIRCLE: 'SECONDARY',
    SQUARE: 'TERTIARY',
    TRIANGLE: 'QUATERNARY',
    // Alternative names
    X: 'PRIMARY', // Common shorthand for Cross
    O: 'SECONDARY', // Common shorthand for Circle
    // Common actions
    JUMP: 'PRIMARY',
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    ATTACK: 'TERTIARY',
    SPECIAL: 'QUATERNARY',
  },
} as const;
