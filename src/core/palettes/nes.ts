/**
 * Nintendo Entertainment System (NES) color palette.
 *
 * The NES PPU (Picture Processing Unit) generates colors using a YIQ-based
 * system that produces 64 unique color entries, though some are duplicates
 * or unusable. This palette uses the FCEUX emulator's canonical 54-color
 * subset representing all visually distinct colors.
 *
 * @category Palettes
 * @module palettes/nes
 * @since 0.5.0
 *
 * @see {@link https://www.nesdev.org/wiki/PPU_palettes} NESdev Wiki
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for common NES palette entries.
 *
 * @since 0.5.0
 */
export interface NesColors {
  // Grays
  BLACK: HexColor;
  DARK_GRAY: HexColor;
  GRAY: HexColor;
  LIGHT_GRAY: HexColor;
  WHITE: HexColor;
  // Reds
  DARK_RED: HexColor;
  RED: HexColor;
  LIGHT_RED: HexColor;
  // Oranges
  DARK_ORANGE: HexColor;
  ORANGE: HexColor;
  LIGHT_ORANGE: HexColor;
  // Yellows
  DARK_YELLOW: HexColor;
  YELLOW: HexColor;
  LIGHT_YELLOW: HexColor;
  // Greens
  DARK_GREEN: HexColor;
  GREEN: HexColor;
  LIGHT_GREEN: HexColor;
  // Cyans
  DARK_CYAN: HexColor;
  CYAN: HexColor;
  LIGHT_CYAN: HexColor;
  // Blues
  DARK_BLUE: HexColor;
  BLUE: HexColor;
  LIGHT_BLUE: HexColor;
  // Purples
  DARK_PURPLE: HexColor;
  PURPLE: HexColor;
  LIGHT_PURPLE: HexColor;
  // Pinks
  DARK_PINK: HexColor;
  PINK: HexColor;
  LIGHT_PINK: HexColor;
}

/**
 * NES 54-color palette (FCEUX-based).
 *
 * Colors are organized by hue and brightness level.
 * The full 64-entry PPU palette includes duplicates and
 * "blacker than black" colors that are omitted here.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Array access
 * const marioRed = NES.colors[6];
 *
 * // Named access for common colors
 * const sky = NES.named.LIGHT_BLUE;
 * const grass = NES.named.GREEN;
 * ```
 */
export const NES: NamedColorPalette<NesColors> = {
  name: 'NES (FCEUX)',
  colors: [
    // Row 0: Darkest colors
    '#666666', // 00 - Dark Gray
    '#002A88', // 01 - Dark Blue
    '#1412A7', // 02 - Dark Indigo
    '#3B00A4', // 03 - Dark Violet
    '#5C007E', // 04 - Dark Magenta
    '#6E0040', // 05 - Dark Rose
    '#6C0600', // 06 - Dark Red
    '#561D00', // 07 - Dark Orange
    '#333500', // 08 - Dark Olive
    '#0B4800', // 09 - Dark Green
    '#005200', // 10 - Dark Forest
    '#004F08', // 11 - Dark Teal
    '#00404D', // 12 - Dark Cyan
    '#000000', // 13 - Black

    // Row 1: Medium-dark colors
    '#ADADAD', // 14 - Gray
    '#155FD9', // 15 - Blue
    '#4240FF', // 16 - Indigo
    '#7527FE', // 17 - Violet
    '#A01ACC', // 18 - Magenta
    '#B71E7B', // 19 - Rose
    '#B53120', // 20 - Red
    '#994E00', // 21 - Orange
    '#6B6D00', // 22 - Olive
    '#388700', // 23 - Green
    '#0C9300', // 24 - Forest
    '#008F32', // 25 - Teal
    '#007C8D', // 26 - Cyan
    '#000000', // 27 - Black (duplicate, kept for index alignment)

    // Row 2: Medium-light colors
    '#FFFEFF', // 28 - White
    '#64B0FF', // 29 - Light Blue
    '#9290FF', // 30 - Light Indigo
    '#C676FF', // 31 - Light Violet
    '#F36AFF', // 32 - Light Magenta
    '#FE6ECC', // 33 - Light Rose
    '#FE8170', // 34 - Light Red
    '#EA9E22', // 35 - Light Orange
    '#BCBE00', // 36 - Light Olive
    '#88D800', // 37 - Light Green
    '#5CE430', // 38 - Light Forest
    '#45E082', // 39 - Light Teal
    '#48CDDE', // 40 - Light Cyan
    '#4F4F4F', // 41 - Medium Gray

    // Row 3: Lightest colors (pastels)
    '#FFFEFF', // 42 - White (duplicate)
    '#C0DFFF', // 43 - Pale Blue
    '#D3D2FF', // 44 - Pale Indigo
    '#E8C8FF', // 45 - Pale Violet
    '#FBC2FF', // 46 - Pale Magenta
    '#FEC4EA', // 47 - Pale Rose
    '#FECCC5', // 48 - Pale Red
    '#F7D8A5', // 49 - Pale Orange
    '#E4E594', // 50 - Pale Olive
    '#CFEF96', // 51 - Pale Green
    '#BDF4AB', // 52 - Pale Forest
    '#B3F3CC', // 53 - Pale Teal
  ] as const,
  named: {
    // Grays
    BLACK: '#000000',
    DARK_GRAY: '#666666',
    GRAY: '#ADADAD',
    LIGHT_GRAY: '#4F4F4F',
    WHITE: '#FFFEFF',
    // Reds
    DARK_RED: '#6C0600',
    RED: '#B53120',
    LIGHT_RED: '#FE8170',
    // Oranges
    DARK_ORANGE: '#561D00',
    ORANGE: '#994E00',
    LIGHT_ORANGE: '#EA9E22',
    // Yellows (olive tones on NES)
    DARK_YELLOW: '#333500',
    YELLOW: '#6B6D00',
    LIGHT_YELLOW: '#BCBE00',
    // Greens
    DARK_GREEN: '#0B4800',
    GREEN: '#388700',
    LIGHT_GREEN: '#88D800',
    // Cyans
    DARK_CYAN: '#00404D',
    CYAN: '#007C8D',
    LIGHT_CYAN: '#48CDDE',
    // Blues
    DARK_BLUE: '#002A88',
    BLUE: '#155FD9',
    LIGHT_BLUE: '#64B0FF',
    // Purples
    DARK_PURPLE: '#3B00A4',
    PURPLE: '#7527FE',
    LIGHT_PURPLE: '#C676FF',
    // Pinks
    DARK_PINK: '#5C007E',
    PINK: '#A01ACC',
    LIGHT_PINK: '#F36AFF',
  },
} as const;
