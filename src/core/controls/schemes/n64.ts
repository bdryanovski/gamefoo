/**
 * Nintendo 64 control scheme.
 *
 * The N64 controller has a unique three-pronged design with multiple
 * ways to hold it. It features a D-pad, analog stick, four C-buttons
 * (for camera control), A/B buttons, Z trigger, and L/R shoulders.
 *
 * @category Controls
 * @module controls/schemes/n64
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * N64 control scheme.
 *
 * Physical layout:
 * ```
 *   [L]                        [R]
 *
 *   [D-PAD]              [C-UP]
 *          [STICK] [C-LEFT][C-RIGHT]
 *                        [C-DOWN]
 *              [B]  [A]
 *            [Z]
 *      [START]
 * ```
 *
 * The N64 controller can be held in different ways:
 * - Left grip + middle: D-pad + Z + L + B + A
 * - Middle + right: Stick + Z + R + B + A + C-buttons (most common)
 *
 * Keyboard mapping (middle + right grip style):
 * - Analog stick: WASD
 * - A button: X or J
 * - B button: Z or K
 * - C-buttons: I/K/J/L (arrow cluster) or Numpad
 * - Z trigger: Space
 * - L/R shoulders: Q/E
 * - Start: Enter
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, N64_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, N64_CONTROLS);
 * if (mapper.isAction('A')) player.jump();
 * if (mapper.isAction('Z')) player.aim();
 * if (mapper.isAction('C_UP')) camera.lookUp();
 * ```
 */
export const N64_CONTROLS: ControlScheme = {
  name: 'N64',
  actions: {
    // Analog stick (primary movement for most games)
    UP: binding(['w', 'arrowup'], { axis: 1, axisDirection: -1 }),
    DOWN: binding(['s', 'arrowdown'], { axis: 1, axisDirection: 1 }),
    LEFT: binding(['a', 'arrowleft'], { axis: 0, axisDirection: -1 }),
    RIGHT: binding(['d', 'arrowright'], { axis: 0, axisDirection: 1 }),

    // Face buttons
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A (large, bottom right)
    SECONDARY: binding(['c'], { button: 1 }), // B (small, above A)
    TERTIARY: unassignedBinding(), // No dedicated X button
    QUATERNARY: unassignedBinding(), // No dedicated Y button

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: unassignedBinding(), // N64 doesn't have Select
    MENU: binding(['escape']),

    // Shoulder buttons and Z trigger
    L1: binding(['q'], { button: 4 }), // L shoulder
    R1: binding(['e'], { button: 5 }), // R shoulder
    L2: binding(['z', 'space'], { button: 6 }), // Z trigger (under middle grip)
    R2: unassignedBinding(), // No R2
    L3: unassignedBinding(),
    R3: unassignedBinding(),

    // N64 C-buttons (unique to N64, used for camera/secondary actions)
    C_UP: binding(['i'], { button: 3 }), // C-up (often mapped to Y)
    C_DOWN: binding(['k'], { button: 13 }), // C-down
    C_LEFT: binding(['j'], { button: 14 }), // C-left
    C_RIGHT: binding(['l'], { button: 15 }), // C-right
  },
  aliases: {
    // N64 button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    Z: 'L2',
    L: 'L1',
    R: 'R1',
    // Common actions
    JUMP: 'PRIMARY',
    ATTACK: 'SECONDARY',
    AIM: 'L2',
    TARGET: 'L2',
  },
} as const;
