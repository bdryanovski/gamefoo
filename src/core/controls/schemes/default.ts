/**
 * Default control scheme using WASD and arrow keys.
 *
 * This is the fallback scheme used when no console-specific scheme
 * is specified. It provides a standard PC gaming layout with support
 * for both WASD and arrow key movement.
 *
 * @category Controls
 * @module controls/schemes/default
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Default control scheme for PC gaming.
 *
 * Layout:
 * - Movement: WASD or Arrow keys
 * - PRIMARY (action): X, J, or Space
 * - SECONDARY (cancel): Z, K
 * - START: Enter
 * - SELECT: Shift
 * - MENU: Escape
 *
 * Gamepad mapping follows the W3C Standard Gamepad layout.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, DEFAULT_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, DEFAULT_CONTROLS);
 * if (mapper.isAction('PRIMARY')) player.jump();
 * ```
 */
export const DEFAULT_CONTROLS: ControlScheme = {
  name: 'Default (WASD)',
  actions: {
    // Directional - WASD and Arrow keys
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons
    PRIMARY: binding(['x', 'j', 'space'], { button: 0 }), // A / Cross
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B / Circle
    TERTIARY: binding(['c'], { button: 2 }), // X / Square
    QUATERNARY: binding(['v'], { button: 3 }), // Y / Triangle

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape'], { button: 16 }),

    // Shoulder buttons
    L1: binding(['q'], { button: 4 }),
    R1: binding(['e'], { button: 5 }),
    L2: binding(['1'], { button: 6 }),
    R2: binding(['2'], { button: 7 }),

    // Stick clicks
    L3: binding(['3'], { button: 10 }),
    R3: binding(['4'], { button: 11 }),

    // N64 C-buttons (not used in default, but defined)
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // Generic button names
    ACTION: 'PRIMARY',
    CANCEL: 'SECONDARY',
    JUMP: 'PRIMARY',
    ATTACK: 'SECONDARY',
  },
} as const;
