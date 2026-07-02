/**
 * IBM EGA (Enhanced Graphics Adapter) color palette.
 *
 * EGA (1984) expanded CGA's capabilities to 64 possible colors,
 * with 16 displayable at once. The default palette matches CGA
 * for compatibility, but games could choose any 16 from 64.
 *
 * @category Palettes
 * @module palettes/ega
 * @since 0.5.0
 *
 * @see {@link https://en.wikipedia.org/wiki/Enhanced_Graphics_Adapter} Wikipedia
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for the EGA default palette.
 *
 * @since 0.5.0
 */
export interface EgaColors {
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
 * EGA default 16-color palette.
 *
 * This is the standard EGA palette that matches CGA colors.
 * EGA could display any 16 colors from its 64-color space,
 * but this default was used for CGA compatibility.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Draw with EGA colors
 * ctx.fillRect(0, 0, 10, 10, EGA.named.LIGHT_BLUE);
 * ctx.fillRect(10, 0, 10, 10, EGA.named.YELLOW);
 * ```
 */
export const EGA: NamedColorPalette<EgaColors> = {
  name: 'EGA (Default 16-color)',
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

/**
 * Full EGA 64-color palette.
 *
 * EGA uses 2 bits per channel (RGB), allowing 4 levels per channel
 * and 64 total colors. Colors are ordered by RGB value.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Show all 64 EGA colors
 * for (let i = 0; i < EGA_64.colors.length; i++) {
 *   const x = (i % 8) * 20;
 *   const y = Math.floor(i / 8) * 20;
 *   ctx.fillRect(x, y, 20, 20, EGA_64.colors[i]);
 * }
 * ```
 */
export const EGA_64: NamedColorPalette<EgaColors> = {
  name: 'EGA (Full 64-color)',
  colors: [
    // 2 bits per channel: 00, 01, 10, 11 -> 0x00, 0x55, 0xAA, 0xFF
    '#000000',
    '#000055',
    '#0000AA',
    '#0000FF',
    '#005500',
    '#005555',
    '#0055AA',
    '#0055FF',
    '#00AA00',
    '#00AA55',
    '#00AAAA',
    '#00AAFF',
    '#00FF00',
    '#00FF55',
    '#00FFAA',
    '#00FFFF',
    '#550000',
    '#550055',
    '#5500AA',
    '#5500FF',
    '#555500',
    '#555555',
    '#5555AA',
    '#5555FF',
    '#55AA00',
    '#55AA55',
    '#55AAAA',
    '#55AAFF',
    '#55FF00',
    '#55FF55',
    '#55FFAA',
    '#55FFFF',
    '#AA0000',
    '#AA0055',
    '#AA00AA',
    '#AA00FF',
    '#AA5500',
    '#AA5555',
    '#AA55AA',
    '#AA55FF',
    '#AAAA00',
    '#AAAA55',
    '#AAAAAA',
    '#AAAAFF',
    '#AAFF00',
    '#AAFF55',
    '#AAFFAA',
    '#AAFFFF',
    '#FF0000',
    '#FF0055',
    '#FF00AA',
    '#FF00FF',
    '#FF5500',
    '#FF5555',
    '#FF55AA',
    '#FF55FF',
    '#FFAA00',
    '#FFAA55',
    '#FFAAAA',
    '#FFAAFF',
    '#FFFF00',
    '#FFFF55',
    '#FFFFAA',
    '#FFFFFF',
  ] as const,
  // Named colors point to the most saturated versions
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
