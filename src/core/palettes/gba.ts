/**
 * Nintendo Game Boy Advance (GBA) color palette.
 *
 * The GBA uses 15-bit RGB color (5 bits per channel), same as SNES,
 * allowing 32,768 total colors. This module provides a generator
 * and the default GBA system colors.
 *
 * @category Palettes
 * @module palettes/gba
 * @since 0.5.0
 */

import type { GeneratedPalette, HexColor } from './types';
import { rgbToHex } from './utils';

/**
 * GBA 15-bit RGB generated palette.
 *
 * The GBA uses 5 bits per color channel (0-31), resulting in
 * 32,768 possible colors (same as SNES).
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Generate specific colors
 * const red = GBA.generate(31, 0, 0);
 * const green = GBA.generate(0, 31, 0);
 *
 * // GBA screen has slightly different gamma
 * // Colors appear more washed out on real hardware
 * ```
 */
export const GBA: GeneratedPalette = {
  name: 'Game Boy Advance',
  totalColors: 32768, // 2^15
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
