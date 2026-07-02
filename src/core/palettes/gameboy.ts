/**
 * Nintendo Game Boy color palette.
 *
 * The original Game Boy (DMG) had a 4-color green-tinted LCD display.
 * This module provides the classic green palette and a generator function
 * to create custom Game Boy-style palettes with different tints.
 *
 * @category Palettes
 * @module palettes/gameboy
 * @since 0.5.0
 */

import type { HexColor, NamedColorPalette } from './types';
import { hexToRgb, rgbToHex } from './utils';

/**
 * Named colors for the Game Boy palette.
 *
 * @since 0.5.0
 */
export interface GameBoyColors {
  DARKEST: HexColor;
  DARK: HexColor;
  LIGHT: HexColor;
  LIGHTEST: HexColor;
}

/**
 * Original Game Boy (DMG) green-tinted palette.
 *
 * This represents the classic green colors of the original
 * Game Boy's LCD display.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Array access (darkest to lightest)
 * const darkest = GAMEBOY.colors[0];
 * const lightest = GAMEBOY.colors[3];
 *
 * // Named access
 * const bg = GAMEBOY.named.LIGHTEST;
 * const fg = GAMEBOY.named.DARKEST;
 * ```
 */
export const GAMEBOY: NamedColorPalette<GameBoyColors> = {
  name: 'Game Boy',
  colors: [
    '#081820', // Darkest (near black)
    '#346856', // Dark green
    '#88C070', // Light green
    '#E0F8D0', // Lightest (near white)
  ] as const,
  named: {
    DARKEST: '#081820',
    DARK: '#346856',
    LIGHT: '#88C070',
    LIGHTEST: '#E0F8D0',
  },
} as const;

/**
 * Creates a custom Game Boy-style 4-color palette from a tint color.
 *
 * Generates 4 shades from darkest (10% brightness) to lightest (95% brightness)
 * based on the provided tint color.
 *
 * @param tint - Base color to create shades from
 * @returns A 4-color palette with named access
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Sepia/brown tint
 * const sepia = createGameBoyPalette('#D4A574');
 *
 * // Blue tint
 * const blue = createGameBoyPalette('#4488FF');
 *
 * // Grayscale
 * const gray = createGameBoyPalette('#AAAAAA');
 *
 * // Use the palette
 * ctx.fillRect(0, 0, 10, 10, sepia.named.DARKEST);
 * ```
 */
export function createGameBoyPalette(
  tint: HexColor,
): NamedColorPalette<GameBoyColors> {
  const [r, g, b] = hexToRgb(tint);

  // Luminance levels from darkest to lightest
  const shades = [0.1, 0.4, 0.7, 0.95] as const;

  const darkest = rgbToHex(
    Math.round(r * shades[0]),
    Math.round(g * shades[0]),
    Math.round(b * shades[0]),
  );
  const dark = rgbToHex(
    Math.round(r * shades[1]),
    Math.round(g * shades[1]),
    Math.round(b * shades[1]),
  );
  const light = rgbToHex(
    Math.round(r * shades[2]),
    Math.round(g * shades[2]),
    Math.round(b * shades[2]),
  );
  const lightest = rgbToHex(
    Math.round(r * shades[3]),
    Math.round(g * shades[3]),
    Math.round(b * shades[3]),
  );

  return {
    name: 'Game Boy (Custom)',
    colors: [darkest, dark, light, lightest] as const,
    named: {
      DARKEST: darkest,
      DARK: dark,
      LIGHT: light,
      LIGHTEST: lightest,
    },
  };
}
