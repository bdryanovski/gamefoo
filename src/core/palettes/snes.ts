/**
 * Super Nintendo Entertainment System (SNES) color palette.
 *
 * The SNES PPU uses 15-bit RGB color (5 bits per channel),
 * allowing 32,768 total colors. This module provides a generator
 * function to create any SNES-compatible color.
 *
 * @category Palettes
 * @module palettes/snes
 * @since 0.5.0
 *
 * @see {@link https://snes.nesdev.org/wiki/PPU} SNESdev Wiki
 */

import type { GeneratedPalette, HexColor } from './types';
import { rgbToHex } from './utils';

/**
 * SNES 15-bit RGB generated palette.
 *
 * The SNES uses 5 bits per color channel (0-31), resulting in
 * 32,768 possible colors. Use the `generate()` function to create
 * any color in the SNES color space.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Generate specific colors
 * const red = SNES.generate(31, 0, 0);      // Full red
 * const green = SNES.generate(0, 31, 0);    // Full green
 * const blue = SNES.generate(0, 0, 31);     // Full blue
 * const white = SNES.generate(31, 31, 31);  // White
 *
 * // Medium gray
 * const gray = SNES.generate(16, 16, 16);
 *
 * // Random SNES color
 * const r = Math.floor(Math.random() * 32);
 * const g = Math.floor(Math.random() * 32);
 * const b = Math.floor(Math.random() * 32);
 * const random = SNES.generate(r, g, b);
 * ```
 */
export const SNES: GeneratedPalette = {
  name: 'SNES (Super Nintendo)',
  totalColors: 32768, // 2^15
  bitsPerChannel: 5,

  generate(r: number, g: number, b: number): HexColor {
    // Clamp values to 5-bit range (0-31)
    const r5 = Math.max(0, Math.min(31, Math.round(r)));
    const g5 = Math.max(0, Math.min(31, Math.round(g)));
    const b5 = Math.max(0, Math.min(31, Math.round(b)));

    // Convert 5-bit (0-31) to 8-bit (0-255)
    // Using the formula: 8bit = 5bit * 255 / 31
    const r8 = Math.round((r5 * 255) / 31);
    const g8 = Math.round((g5 * 255) / 31);
    const b8 = Math.round((b5 * 255) / 31);

    return rgbToHex(r8, g8, b8);
  },

  // Common colors for quick access
  commonColors: [
    '#000000', // Black (0, 0, 0)
    '#FFFFFF', // White (31, 31, 31)
    '#FF0000', // Red (31, 0, 0)
    '#00FF00', // Green (0, 31, 0)
    '#0000FF', // Blue (0, 0, 31)
    '#FFFF00', // Yellow (31, 31, 0)
    '#00FFFF', // Cyan (0, 31, 31)
    '#FF00FF', // Magenta (31, 0, 31)
    '#848484', // Medium Gray (16, 16, 16)
  ] as const,
};

/**
 * Converts an 8-bit RGB value (0-255) to SNES 5-bit format.
 *
 * @param value - 8-bit color value (0-255)
 * @returns 5-bit color value (0-31)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Convert standard RGB to SNES
 * const r = to5Bit(255); // 31
 * const g = to5Bit(128); // 16
 * const b = to5Bit(0);   // 0
 * const color = SNES.generate(r, g, b);
 * ```
 */
export function to5Bit(value: number): number {
  return Math.round((Math.max(0, Math.min(255, value)) * 31) / 255);
}

/**
 * Converts a hex color to the nearest SNES-compatible color.
 *
 * @param hex - Hex color string
 * @returns SNES-compatible hex color
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Quantize any color to SNES palette
 * const snesColor = toSNES('#7F3F1F');
 * ```
 */
export function toSNES(hex: string): HexColor {
  const cleanHex = hex.replace(/^#/, '');
  const r8 = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g8 = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b8 = Number.parseInt(cleanHex.substring(4, 6), 16);

  return SNES.generate(to5Bit(r8), to5Bit(g8), to5Bit(b8));
}
