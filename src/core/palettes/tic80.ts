/**
 * TIC-80 fantasy console color palette (Sweetie 16).
 *
 * TIC-80 uses the Sweetie 16 palette by default, a carefully crafted
 * 16-color palette designed for pixel art games with good color harmony.
 *
 * @category Palettes
 * @module palettes/tic80
 * @since 0.5.0
 *
 * @see {@link https://tic80.com/} TIC-80 Official Site
 * @see {@link https://lospec.com/palette-list/sweetie-16} Sweetie 16 Palette
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for the TIC-80 / Sweetie 16 palette.
 *
 * @since 0.5.0
 */
export interface Tic80Colors {
  BLACK: HexColor;
  PURPLE: HexColor;
  RED: HexColor;
  ORANGE: HexColor;
  YELLOW: HexColor;
  LIGHT_GREEN: HexColor;
  GREEN: HexColor;
  DARK_CYAN: HexColor;
  DARK_BLUE: HexColor;
  BLUE: HexColor;
  LIGHT_BLUE: HexColor;
  CYAN: HexColor;
  WHITE: HexColor;
  LIGHT_GRAY: HexColor;
  GRAY: HexColor;
  DARK_GRAY: HexColor;
}

/**
 * TIC-80 / Sweetie 16 color palette.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Array access
 * const red = TIC80.colors[2];
 *
 * // Named access
 * const red2 = TIC80.named.RED;
 * ```
 */
export const TIC80: NamedColorPalette<Tic80Colors> = {
  name: 'TIC-80 (Sweetie 16)',
  colors: [
    '#1A1C2C', // 0  - Black (dark purple)
    '#5D275D', // 1  - Purple
    '#B13E53', // 2  - Red
    '#EF7D57', // 3  - Orange
    '#FFCD75', // 4  - Yellow
    '#A7F070', // 5  - Light Green
    '#38B764', // 6  - Green
    '#257179', // 7  - Dark Cyan
    '#29366F', // 8  - Dark Blue
    '#3B5DC9', // 9  - Blue
    '#41A6F6', // 10 - Light Blue
    '#73EFF7', // 11 - Cyan
    '#F4F4F4', // 12 - White
    '#94B0C2', // 13 - Light Gray
    '#566C86', // 14 - Gray
    '#333C57', // 15 - Dark Gray
  ] as const,
  named: {
    BLACK: '#1A1C2C',
    PURPLE: '#5D275D',
    RED: '#B13E53',
    ORANGE: '#EF7D57',
    YELLOW: '#FFCD75',
    LIGHT_GREEN: '#A7F070',
    GREEN: '#38B764',
    DARK_CYAN: '#257179',
    DARK_BLUE: '#29366F',
    BLUE: '#3B5DC9',
    LIGHT_BLUE: '#41A6F6',
    CYAN: '#73EFF7',
    WHITE: '#F4F4F4',
    LIGHT_GRAY: '#94B0C2',
    GRAY: '#566C86',
    DARK_GRAY: '#333C57',
  },
} as const;
