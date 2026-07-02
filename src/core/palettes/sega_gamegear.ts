/**
 * Sega Game Gear color palette.
 *
 * The Game Gear VDP uses 12-bit RGB color (4 bits per channel),
 * allowing 4,096 total colors. This module provides a generator
 * function to create any Game Gear-compatible color.
 *
 * @category Palettes
 * @module palettes/sega_gamegear
 * @since 0.5.0
 *
 * @see {@link https://segaretro.org/Sega_Game_Gear/Palettes} Sega Retro
 */

import type { GeneratedPalette, HexColor } from './types';
import { rgbToHex } from './utils';

/**
 * Sega Game Gear 12-bit RGB generated palette.
 *
 * The Game Gear uses 4 bits per color channel (0-15), resulting in
 * 4,096 possible colors. Use the `generate()` function to create
 * any color in the Game Gear color space.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Generate specific colors
 * const red = GAMEGEAR.generate(15, 0, 0);    // Full red
 * const green = GAMEGEAR.generate(0, 15, 0);  // Full green
 * const blue = GAMEGEAR.generate(0, 0, 15);   // Full blue
 * const white = GAMEGEAR.generate(15, 15, 15); // White
 *
 * // Medium brightness
 * const midRed = GAMEGEAR.generate(8, 0, 0);
 *
 * // Random Game Gear color
 * const r = Math.floor(Math.random() * 16);
 * const g = Math.floor(Math.random() * 16);
 * const b = Math.floor(Math.random() * 16);
 * const random = GAMEGEAR.generate(r, g, b);
 * ```
 */
export const GAMEGEAR: GeneratedPalette = {
  name: 'Sega Game Gear',
  totalColors: 4096, // 2^12
  bitsPerChannel: 4,

  generate(r: number, g: number, b: number): HexColor {
    // Clamp values to 4-bit range (0-15)
    const r4 = Math.max(0, Math.min(15, Math.round(r)));
    const g4 = Math.max(0, Math.min(15, Math.round(g)));
    const b4 = Math.max(0, Math.min(15, Math.round(b)));

    // Convert 4-bit (0-15) to 8-bit (0-255)
    // Using the formula: 8bit = 4bit * 255 / 15 = 4bit * 17
    const r8 = r4 * 17;
    const g8 = g4 * 17;
    const b8 = b4 * 17;

    return rgbToHex(r8, g8, b8);
  },

  // Common colors for quick access
  commonColors: [
    '#000000', // Black (0, 0, 0)
    '#FFFFFF', // White (15, 15, 15)
    '#FF0000', // Red (15, 0, 0)
    '#00FF00', // Green (0, 15, 0)
    '#0000FF', // Blue (0, 0, 15)
    '#FFFF00', // Yellow (15, 15, 0)
    '#00FFFF', // Cyan (0, 15, 15)
    '#FF00FF', // Magenta (15, 0, 15)
    '#888888', // Medium Gray (8, 8, 8)
  ] as const,
};

/**
 * Converts an 8-bit RGB value (0-255) to Game Gear 4-bit format.
 *
 * @param value - 8-bit color value (0-255)
 * @returns 4-bit color value (0-15)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Convert standard RGB to Game Gear
 * const r = to4Bit(255); // 15
 * const g = to4Bit(128); // 8
 * const b = to4Bit(0);   // 0
 * const color = GAMEGEAR.generate(r, g, b);
 * ```
 */
export function to4Bit(value: number): number {
  return Math.round((Math.max(0, Math.min(255, value)) * 15) / 255);
}

/**
 * Converts a hex color to the nearest Game Gear-compatible color.
 *
 * @param hex - Hex color string
 * @returns Game Gear-compatible hex color
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Quantize any color to Game Gear palette
 * const ggColor = toGameGear('#7F3F1F');
 * ```
 */
export function toGameGear(hex: string): HexColor {
  const cleanHex = hex.replace(/^#/, '');
  const r8 = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g8 = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b8 = Number.parseInt(cleanHex.substring(4, 6), 16);

  return GAMEGEAR.generate(to4Bit(r8), to4Bit(g8), to4Bit(b8));
}
