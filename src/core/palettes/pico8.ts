/**
 * PICO-8 fantasy console color palette.
 *
 * PICO-8 is a fantasy console with a fixed 16-color palette designed for
 * retro-style games. The palette was carefully chosen to provide a balanced
 * range of colors suitable for pixel art.
 *
 * @category Palettes
 * @module palettes/pico8
 * @since 0.5.0
 *
 * @see {@link https://www.lexaloffle.com/pico-8.php} PICO-8 Official Site
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for the PICO-8 palette.
 *
 * @since 0.5.0
 */
export interface Pico8Colors {
  BLACK: HexColor;
  DARK_BLUE: HexColor;
  DARK_PURPLE: HexColor;
  DARK_GREEN: HexColor;
  BROWN: HexColor;
  DARK_GRAY: HexColor;
  LIGHT_GRAY: HexColor;
  WHITE: HexColor;
  RED: HexColor;
  ORANGE: HexColor;
  YELLOW: HexColor;
  GREEN: HexColor;
  BLUE: HexColor;
  INDIGO: HexColor;
  PINK: HexColor;
  PEACH: HexColor;
}

/**
 * PICO-8 16-color palette.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Array access
 * const red = PICO8.colors[8];
 *
 * // Named access
 * const red2 = PICO8.named.RED;
 *
 * // Use in rendering
 * ctx.fillRect(0, 0, 10, 10, PICO8.named.DARK_BLUE);
 * ```
 */
export const PICO8: NamedColorPalette<Pico8Colors> = {
  name: 'PICO-8',
  colors: [
    '#000000', // 0  - Black
    '#1D2B53', // 1  - Dark Blue
    '#7E2553', // 2  - Dark Purple
    '#008751', // 3  - Dark Green
    '#AB5236', // 4  - Brown
    '#5F574F', // 5  - Dark Gray
    '#C2C3C7', // 6  - Light Gray
    '#FFF1E8', // 7  - White
    '#FF004D', // 8  - Red
    '#FFA300', // 9  - Orange
    '#FFEC27', // 10 - Yellow
    '#00E436', // 11 - Green
    '#29ADFF', // 12 - Blue
    '#83769C', // 13 - Indigo
    '#FF77A8', // 14 - Pink
    '#FFCCAA', // 15 - Peach
  ] as const,
  named: {
    BLACK: '#000000',
    DARK_BLUE: '#1D2B53',
    DARK_PURPLE: '#7E2553',
    DARK_GREEN: '#008751',
    BROWN: '#AB5236',
    DARK_GRAY: '#5F574F',
    LIGHT_GRAY: '#C2C3C7',
    WHITE: '#FFF1E8',
    RED: '#FF004D',
    ORANGE: '#FFA300',
    YELLOW: '#FFEC27',
    GREEN: '#00E436',
    BLUE: '#29ADFF',
    INDIGO: '#83769C',
    PINK: '#FF77A8',
    PEACH: '#FFCCAA',
  },
} as const;
