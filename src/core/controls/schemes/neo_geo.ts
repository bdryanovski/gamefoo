/**
 * SNK Neo Geo control scheme.
 *
 * The Neo Geo arcade stick/controller has a joystick and four buttons
 * (A, B, C, D) plus Start and Select. It was designed for arcade-perfect
 * ports of fighting games and action games.
 *
 * @category Controls
 * @module controls/schemes/neo_geo
 * @since 0.5.0
 */

import { binding, unassignedBinding } from '../scheme_builder';
import type { ControlScheme } from '../types';

/**
 * Neo Geo control scheme.
 *
 * Physical layout (arcade stick style):
 * ```
 *                   [SELECT] [START]
 *   [JOYSTICK]        [A] [B] [C] [D]
 * ```
 *
 * Button conventions:
 * - Fighting games: A = light punch, B = light kick, C = heavy punch, D = heavy kick
 * - Run-and-gun: A = shoot, B = jump, C = bomb/special, D = varies
 *
 * Keyboard mapping:
 * - Joystick: WASD or Arrow keys
 * - A button: Z or K (light attack)
 * - B button: X or J (light attack alt)
 * - C button: C (heavy attack)
 * - D button: V (heavy attack alt)
 * - Start: Enter
 * - Select: Shift
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { InputMapper, NEO_GEO_CONTROLS } from 'gamefoo';
 *
 * const mapper = new InputMapper(input, NEO_GEO_CONTROLS);
 * // Fighting game style
 * if (mapper.isAction('A')) player.lightPunch();
 * if (mapper.isAction('C')) player.heavyPunch();
 * ```
 */
export const NEO_GEO_CONTROLS: ControlScheme = {
  name: 'Neo Geo',
  actions: {
    // 8-way joystick
    UP: binding(['w', 'arrowup'], { button: 12 }),
    DOWN: binding(['s', 'arrowdown'], { button: 13 }),
    LEFT: binding(['a', 'arrowleft'], { button: 14 }),
    RIGHT: binding(['d', 'arrowright'], { button: 15 }),

    // Four face buttons in a row
    PRIMARY: binding(['z', 'k'], { button: 0 }), // A
    SECONDARY: binding(['x', 'j'], { button: 1 }), // B
    TERTIARY: binding(['c'], { button: 2 }), // C
    QUATERNARY: binding(['v'], { button: 3 }), // D

    // System
    START: binding(['enter'], { button: 9 }),
    SELECT: binding(['shift'], { button: 8 }),
    MENU: binding(['escape']),

    // No shoulder buttons (arcade stick)
    L1: unassignedBinding(),
    R1: unassignedBinding(),
    L2: unassignedBinding(),
    R2: unassignedBinding(),
    L3: unassignedBinding(),
    R3: unassignedBinding(),

    // No C-buttons (Neo Geo C is a face button)
    C_UP: unassignedBinding(),
    C_DOWN: unassignedBinding(),
    C_LEFT: unassignedBinding(),
    C_RIGHT: unassignedBinding(),
  },
  aliases: {
    // Neo Geo button names
    A: 'PRIMARY',
    B: 'SECONDARY',
    C: 'TERTIARY',
    D: 'QUATERNARY',
    // Fighting game actions
    LIGHT_PUNCH: 'PRIMARY',
    LIGHT_KICK: 'SECONDARY',
    HEAVY_PUNCH: 'TERTIARY',
    HEAVY_KICK: 'QUATERNARY',
    // Generic actions
    ATTACK: 'PRIMARY',
    JUMP: 'SECONDARY',
    SPECIAL: 'TERTIARY',
  },
} as const;
