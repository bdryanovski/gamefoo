/**
 * Sony PlayStation Portable (PSP) control scheme.
 *
 * The PSP uses the PlayStation button layout (Cross, Circle, Square,
 * Triangle) with a single analog nub, D-pad, and L/R shoulder buttons.
 * It lacks L2/R2 and analog stick clicks.
 *
 * @category Controls
 * @module controls/schemes/psp
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * PSP control scheme.
 *
 * Physical layout:
 * ```
 *   [L]                          [R]
 *
 *   [D-PAD]    [SCREEN]      [△]
 *                          [□]  [○]
 *   [ANALOG]                 [×]
 *
 *          [SELECT]  [START]
 * ```
 *
 * Keyboard mapping:
 * - D-pad/Analog: WASD or Arrow keys
 * - Cross (×): X or J
 * - Circle (○): Z or K
 * - Square (□): C
 * - Triangle (△): V
 * - L/R: Q/E
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, PSP_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, PSP_CONTROLS);
 * if (mapper.isAction('CROSS')) player.confirm();
 * if (mapper.isAction('L')) camera.rotateLeft();
 * ```
 */
export const PSP_CONTROLS: ControlScheme = {
  name: 'PSP',
  actions: {
    // D-pad / Analog nub
    UP: binding(['w', 'arrowup'], { axis: 1, axisDirection: -1 }),
    DOWN: binding(['s', 'arrowdown'], { axis: 1, axisDirection: 1 }),
    LEFT: binding(['a', 'arrowleft'], { axis: 0, axisDirection: -1 }),
    RIGHT: binding(['d', 'arrowright'], { axis: 0, axisDirection: 1 }),

    // Face buttons (PlayStation layout)
    PRIMARY: binding(['x', 'j'], { button: 0 }), // Cross (×)
    SECONDARY: binding(['z', 'k'], { button: 1 }), // Circle (○)
    TERTIARY: binding(['c'], { button: 2 }), // Square (□)
    QUATERNARY: binding(['v'], { button: 3 }), // Triangle (△)

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']), // Home button

    // Shoulder buttons (L/R only, no L2/R2)
    L1: binding(['q'], { button: 4 }), // L
    R1: binding(['e'], { button: 5 }), // R
    L2: unassignedBinding(), // PSP doesn't have L2
    R2: unassignedBinding(), // PSP doesn't have R2
    L3: unassignedBinding(), // No stick click
    R3: unassignedBinding(),

    // No C-buttons
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // PlayStation button names
    CROSS: 'PRIMARY',
    CIRCLE: 'SECONDARY',
    SQUARE: 'TERTIARY',
    TRIANGLE: 'QUATERNARY',
    X: 'PRIMARY',
    O: 'SECONDARY',
    L: 'L1',
    R: 'R1',
    // Common actions
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    ATTACK: 'TERTIARY',
  },
} as const;
