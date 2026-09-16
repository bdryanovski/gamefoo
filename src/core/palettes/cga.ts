/**
 * IBM CGA (Color Graphics Adapter) color palette.
 *
 * CGA was IBM's first color graphics card (1981). This palette uses
 * Mode 4, Palette 1, High Intensity - the most commonly used CGA mode
 * in games, featuring cyan, magenta, white, and black.
 *
 * @category Palettes
 * @module palettes/cga
 * @since 0.5.0
 *
 * @see {@link https://en.wikipedia.org/wiki/Color_Graphics_Adapter} Wikipedia
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for the CGA Mode 4 Palette 1 High Intensity.
 *
 * @since 0.5.0
 */
export interface CgaColors {
  BLACK: HexColor;
  CYAN: HexColor;
  MAGENTA: HexColor;
  WHITE: HexColor;
}

/**
 * CGA Mode 4, Palette 1, High Intensity (4 colors).
 *
 * This is the iconic CGA palette used in many classic DOS games.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Classic CGA look
 * ctx.fillRect(0, 0, 320, 200, CGA.named.BLACK);
 * ctx.fillRect(10, 10, 50, 50, CGA.named.CYAN);
 * ctx.fillRect(70, 10, 50, 50, CGA.named.MAGENTA);
 * ```
 */
export const CGA: NamedColorPalette<CgaColors> = {
  name: 'CGA (Mode 4, Palette 1, High)',
  colors: [
    '#000000', // Black (background)
    '#55FFFF', // Cyan (high intensity)
    '#FF55FF', // Magenta (high intensity)
    '#FFFFFF', // White (high intensity)
  ] as const,
  named: {
    BLACK: '#000000',
    CYAN: '#55FFFF',
    MAGENTA: '#FF55FF',
    WHITE: '#FFFFFF',
  },
} as const;

/**
 * Full CGA 16-color palette (all available colors).
 *
 * While CGA graphics modes typically only allowed 4 colors at once,
 * the full palette had 16 colors available in text mode and for
 * background/border colors.
 *
 * @since 0.5.0
 */
export interface CgaFullColors {
  BLACK: HexColor;
  BLUE: HexColor;
  GREEN: HexColor;
  CYAN: HexColor;
  RED: HexColor;
  MAGENTA: HexColor;
  BROWN: HexColor;
  LIGHT_GRAY: HexColor;
  DARK_GRAY: HexColor;
  LIGHT_BLUE: HexColor;
  LIGHT_GREEN: HexColor;
  LIGHT_CYAN: HexColor;
  LIGHT_RED: HexColor;
  LIGHT_MAGENTA: HexColor;
  YELLOW: HexColor;
  WHITE: HexColor;
}

/**
 * Full CGA 16-color palette.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Access all 16 CGA colors
 * for (let i = 0; i < CGA_FULL.colors.length; i++) {
 *   ctx.fillRect(i * 20, 0, 20, 20, CGA_FULL.colors[i]);
 * }
 * ```
 */
export const CGA_FULL: NamedColorPalette<CgaFullColors> = {
  name: 'CGA (Full 16-color)',
  colors: [
    '#000000', // 0  - Black
    '#0000AA', // 1  - Blue
    '#00AA00', // 2  - Green
    '#00AAAA', // 3  - Cyan
    '#AA0000', // 4  - Red
    '#AA00AA', // 5  - Magenta
    '#AA5500', // 6  - Brown
    '#AAAAAA', // 7  - Light Gray
    '#555555', // 8  - Dark Gray
    '#5555FF', // 9  - Light Blue
    '#55FF55', // 10 - Light Green
    '#55FFFF', // 11 - Light Cyan
    '#FF5555', // 12 - Light Red
    '#FF55FF', // 13 - Light Magenta
    '#FFFF55', // 14 - Yellow
    '#FFFFFF', // 15 - White
  ] as const,
  named: {
    BLACK: '#000000',
    BLUE: '#0000AA',
    GREEN: '#00AA00',
    CYAN: '#00AAAA',
    RED: '#AA0000',
    MAGENTA: '#AA00AA',
    BROWN: '#AA5500',
    LIGHT_GRAY: '#AAAAAA',
    DARK_GRAY: '#555555',
    LIGHT_BLUE: '#5555FF',
    LIGHT_GREEN: '#55FF55',
    LIGHT_CYAN: '#55FFFF',
    LIGHT_RED: '#FF5555',
    LIGHT_MAGENTA: '#FF55FF',
    YELLOW: '#FFFF55',
    WHITE: '#FFFFFF',
  },
} as const;
