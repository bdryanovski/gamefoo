/**
 * SNK Neo Geo color palette.
 *
 * The Neo Geo uses 16-bit color with 5 bits per RGB channel plus
 * a "dark bit" for shadow effects, allowing 65,536 colors total.
 * In practice, it's often treated as 15-bit RGB (32,768 colors).
 *
 * @category Palettes
 * @module palettes/neogeo
 * @since 0.5.0
 *
 * @see {@link https://wiki.neogeodev.org/index.php?title=Palettes} Neo Geo Dev Wiki
 */

import type { GeneratedPalette, HexColor } from './types';
import { rgbToHex } from './utils';

/**
 * Neo Geo 15-bit RGB generated palette.
 *
 * Uses 5 bits per color channel (0-31), resulting in 32,768 colors.
 * The Neo Geo's "dark bit" for shadow effects is not modeled here.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Generate specific colors
 * const red = NEO_GEO.generate(31, 0, 0);
 * const fatalFuryBlue = NEO_GEO.generate(8, 16, 31);
 * ```
 */
export const NEO_GEO: GeneratedPalette = {
  name: 'Neo Geo',
  totalColors: 32768, // 2^15 (ignoring dark bit)
  bitsPerChannel: 5,

  generate(r: number, g: number, b: number): HexColor {
    // Clamp values to 5-bit range (0-31)
    const r5 = Math.max(0, Math.min(31, Math.round(r)));
    const g5 = Math.max(0, Math.min(31, Math.round(g)));
    const b5 = Math.max(0, Math.min(31, Math.round(b)));

    // Convert 5-bit (0-31) to 8-bit (0-255)
    const r8 = Math.round((r5 * 255) / 31);
    const g8 = Math.round((g5 * 255) / 31);
    const b8 = Math.round((b5 * 255) / 31);

    return rgbToHex(r8, g8, b8);
  },

  commonColors: [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
  ] as const,
};
