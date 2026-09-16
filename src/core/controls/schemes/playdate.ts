/**
 * Playdate handheld control scheme.
 *
 * The Playdate has a unique control scheme with a D-pad, two buttons
 * (A and B), a Menu button, and a hand crank for analog input.
 * The crank provides unique gameplay possibilities.
 *
 * @category Controls
 * @module controls/schemes/playdate
 * @since 0.5.0
 *
 * @see {@link https://play.date/} Playdate Official Site
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Playdate control scheme.
 *
 * Physical layout:
 * ```
 *   [D-PAD]     [SCREEN]    [CRANK]
 *
 *      [MENU]          [B] [A]
 * ```
 *
 * The crank can be docked (hidden) or undocked. When undocked, it
 * provides continuous rotational input. Games can also detect
 * dock/undock events.
 *
 * Keyboard mapping:
 * - D-pad: WASD or Arrow keys
 * - A button: X or J (right - confirm)
 * - B button: Z or K (left - cancel)
 * - Menu: Escape
 * - Crank: Q/E for rotate left/right (simulated)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, PLAYDATE_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, PLAYDATE_CONTROLS);
 * if (mapper.isAction('A')) player.confirm();
 * if (mapper.isAction('B')) player.back();
 * // Crank input would need special handling
 * ```
 */
export const PLAYDATE_CONTROLS: ControlScheme = {
  name: 'Playdate',
  actions: {
    // D-pad
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Face buttons
    PRIMARY: binding(['x', 'j'], { button: 0 }), // A (right)
    SECONDARY: binding(['z', 'k'], { button: 1 }), // B (left)
    TERTIARY: unassignedBinding(),
    QUATERNARY: unassignedBinding(),

    // System
    START: unassignedBinding(), // No Start button
    SELECT: unassignedBinding(), // No Select button
    MENU: binding(['escape'], { button: 16 }), // Menu button

    // Crank simulation via shoulder buttons
    // In a real Playdate, crank is read as a rotational value
    L1: binding(['q']), // Simulate crank left
    R1: binding(['e']), // Simulate crank right
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
    // Playdate button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    CRANK_LEFT: 'L1',
    CRANK_RIGHT: 'R1',
    // Common actions
    CONFIRM: 'PRIMARY',
    CANCEL: 'SECONDARY',
    BACK: 'SECONDARY',
  },
} as const;
