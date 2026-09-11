/**
 * Sega Genesis / Mega Drive color palette.
 *
 * The Genesis VDP uses 9-bit RGB color (3 bits per channel),
 * allowing 512 total colors. This module provides a generator
 * function to create any Genesis-compatible color.
 *
 * @category Palettes
 * @module palettes/sega_genesis
 * @since 0.5.0
 *
 * @see {@link https://segaretro.org/Sega_Mega_Drive/Palettes} Sega Retro
 */

import type { GeneratedPalette, HexColor } from './types';
import { rgbToHex } from './utils';

/**
 * Sega Genesis / Mega Drive 9-bit RGB generated palette.
 *
 * The Genesis uses 3 bits per color channel (0-7), resulting in
 * 512 possible colors. Use the `generate()` function to create
 * any color in the Genesis color space.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Generate specific colors
 * const red = GENESIS.generate(7, 0, 0);    // Full red
 * const green = GENESIS.generate(0, 7, 0);  // Full green
 * const blue = GENESIS.generate(0, 0, 7);   // Full blue
 * const white = GENESIS.generate(7, 7, 7);  // White
 *
 * // Sonic blue
 * const sonicBlue = GENESIS.generate(0, 4, 7);
 *
 * // Random Genesis color
 * const r = Math.floor(Math.random() * 8);
 * const g = Math.floor(Math.random() * 8);
 * const b = Math.floor(Math.random() * 8);
 * const random = GENESIS.generate(r, g, b);
 * ```
 */
export const GENESIS: GeneratedPalette = {
  name: 'Sega Genesis / Mega Drive',
  totalColors: 512, // 2^9
  bitsPerChannel: 3,

  generate(r: number, g: number, b: number): HexColor {
    // Clamp values to 3-bit range (0-7)
    const r3 = Math.max(0, Math.min(7, Math.round(r)));
    const g3 = Math.max(0, Math.min(7, Math.round(g)));
    const b3 = Math.max(0, Math.min(7, Math.round(b)));

    // Convert 3-bit (0-7) to 8-bit (0-255)
    // Using the formula: 8bit = 3bit * 255 / 7
    const r8 = Math.round((r3 * 255) / 7);
    const g8 = Math.round((g3 * 255) / 7);
    const b8 = Math.round((b3 * 255) / 7);

    return rgbToHex(r8, g8, b8);
  },

  // Common colors for quick access
  commonColors: [
    '#000000', // Black (0, 0, 0)
    '#FFFFFF', // White (7, 7, 7)
    '#FF0000', // Red (7, 0, 0)
    '#00FF00', // Green (0, 7, 0)
    '#0000FF', // Blue (0, 0, 7)
    '#FFFF00', // Yellow (7, 7, 0)
    '#00FFFF', // Cyan (0, 7, 7)
    '#FF00FF', // Magenta (7, 0, 7)
    '#929292', // Medium Gray (4, 4, 4)
    '#0092FF', // Sonic Blue-ish (0, 4, 7)
  ] as const,
};

/**
 * Alias for GENESIS for Mega Drive naming.
 *
 * @since 0.5.0
 */
export const MEGADRIVE = GENESIS;

/**
 * Converts an 8-bit RGB value (0-255) to Genesis 3-bit format.
 *
 * @param value - 8-bit color value (0-255)
 * @returns 3-bit color value (0-7)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Convert standard RGB to Genesis
 * const r = to3Bit(255); // 7
 * const g = to3Bit(128); // 4
 * const b = to3Bit(0);   // 0
 * const color = GENESIS.generate(r, g, b);
 * ```
 */
export function to3Bit(value: number): number {
  return Math.round((Math.max(0, Math.min(255, value)) * 7) / 255);
}

/**
 * Converts a hex color to the nearest Genesis-compatible color.
 *
 * @param hex - Hex color string
 * @returns Genesis-compatible hex color
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Quantize any color to Genesis palette
 * const genesisColor = toGenesis('#7F3F1F');
 * ```
 */
export function toGenesis(hex: string): HexColor {
  const cleanHex = hex.replace(/^#/, '');
  const r8 = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g8 = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b8 = Number.parseInt(cleanHex.substring(4, 6), 16);

  return GENESIS.generate(to3Bit(r8), to3Bit(g8), to3Bit(b8));
}
