/**
 * Utility functions for working with color palettes.
 *
 * @category Palettes
 * @module palettes/utils
 * @since 0.5.0
 */

import type { ColorPalette, GeneratedPalette, HexColor } from './types';

/**
 * Converts a hex color string to RGB tuple.
 *
 * @param hex - Hex color string (with or without #)
 * @returns RGB tuple [r, g, b] with values 0-255
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * hexToRgb('#FF0000'); // [255, 0, 0]
 * hexToRgb('00FF00');  // [0, 255, 0]
 * ```
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Parse hex values
  const r = Number.parseInt(cleanHex.substring(0, 2), 16);
  const g = Number.parseInt(cleanHex.substring(2, 4), 16);
  const b = Number.parseInt(cleanHex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * Converts RGB values to a hex color string.
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Hex color string in format #RRGGBB
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * rgbToHex(255, 0, 0);   // '#FF0000'
 * rgbToHex(0, 255, 128); // '#00FF80'
 * ```
 */
export function rgbToHex(r: number, g: number, b: number): HexColor {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

  const rHex = clamp(r).toString(16).padStart(2, '0');
  const gHex = clamp(g).toString(16).padStart(2, '0');
  const bHex = clamp(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`.toUpperCase() as HexColor;
}

/**
 * Type guard to check if a palette is a generated palette.
 *
 * @param palette - Palette to check
 * @returns true if the palette is a GeneratedPalette
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * if (isGeneratedPalette(palette)) {
 *   const color = palette.generate(31, 0, 0);
 * }
 * ```
 */
export function isGeneratedPalette(
  palette: ColorPalette | GeneratedPalette,
): palette is GeneratedPalette {
  return 'generate' in palette && typeof palette.generate === 'function';
}

/**
 * Gets the number of colors in a palette.
 *
 * @param palette - The palette to measure
 * @returns Number of colors (or totalColors for generated palettes)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * paletteSize(PICO8);        // 16
 * paletteSize(SNES);         // 32768
 * ```
 */
export function paletteSize(palette: ColorPalette | GeneratedPalette): number {
  if (isGeneratedPalette(palette)) {
    return palette.totalColors;
  }
  return palette.colors.length;
}

/**
 * Gets a random color from a palette.
 *
 * @param palette - The palette to pick from
 * @returns A random hex color from the palette
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const color = randomColor(PICO8);
 * ctx.fillStyle = color;
 * ```
 */
export function randomColor(
  palette: ColorPalette | GeneratedPalette,
): HexColor {
  if (isGeneratedPalette(palette)) {
    const max = 2 ** palette.bitsPerChannel - 1;
    const r = Math.floor(Math.random() * (max + 1));
    const g = Math.floor(Math.random() * (max + 1));
    const b = Math.floor(Math.random() * (max + 1));
    return palette.generate(r, g, b);
  }

  const index = Math.floor(Math.random() * palette.colors.length);
  return palette.colors[index]!;
}

/**
 * Gets a color by index with wrapping (modulo).
 *
 * @param palette - The palette to pick from
 * @param index - Color index (wraps if out of bounds)
 * @returns The hex color at the wrapped index
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * getColor(PICO8, 0);  // First color
 * getColor(PICO8, 16); // Wraps to first color
 * getColor(PICO8, -1); // Last color
 * ```
 */
export function getColor(palette: ColorPalette, index: number): HexColor {
  const len = palette.colors.length;
  // Handle negative indices
  const wrappedIndex = ((index % len) + len) % len;
  return palette.colors[wrappedIndex]!;
}

/**
 * Calculates the squared Euclidean distance between two colors.
 * Used for color matching (avoids expensive sqrt).
 *
 * @param hex1 - First hex color
 * @param hex2 - Second hex color
 * @returns Squared distance in RGB space
 *
 * @internal
 */
function colorDistanceSquared(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);

  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;

  return dr * dr + dg * dg + db * db;
}

/**
 * Finds the nearest color in a palette to a target color.
 * Uses Euclidean distance in RGB space.
 *
 * @param palette - The palette to search
 * @param targetHex - Target color to match
 * @returns The closest color from the palette
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Find closest PICO-8 color to pure red
 * const closest = nearestColor(PICO8, '#FF0000');
 * // Returns '#FF004D' (PICO-8 red)
 * ```
 */
export function nearestColor(
  palette: ColorPalette,
  targetHex: string,
): HexColor {
  let nearestIdx = 0;
  let nearestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < palette.colors.length; i++) {
    const color = palette.colors[i]!;
    const dist = colorDistanceSquared(targetHex, color);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestIdx = i;
    }
  }

  return palette.colors[nearestIdx]!;
}

/**
 * Alias for nearestColor. Quantizes any color to the nearest palette color.
 *
 * @param color - Color to quantize
 * @param palette - Target palette
 * @returns Nearest color from the palette
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Snap any color to Game Boy palette
 * const gbColor = quantize('#7F7F7F', GAMEBOY);
 * ```
 */
export function quantize(color: string, palette: ColorPalette): HexColor {
  return nearestColor(palette, color);
}

/**
 * Creates a gradient of colors between two palette indices.
 *
 * @param palette - Source palette
 * @param startIndex - Starting color index
 * @param endIndex - Ending color index
 * @param steps - Number of colors in the gradient
 * @returns Array of interpolated hex colors
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Create 5-step gradient from black to white in PICO-8
 * const gradient = paletteGradient(PICO8, 0, 7, 5);
 * ```
 */
export function paletteGradient(
  palette: ColorPalette,
  startIndex: number,
  endIndex: number,
  steps: number,
): HexColor[] {
  if (steps < 2) {
    return [getColor(palette, startIndex)];
  }

  const startColor = hexToRgb(getColor(palette, startIndex));
  const endColor = hexToRgb(getColor(palette, endIndex));

  const result: HexColor[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * t);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * t);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * t);
    result.push(rgbToHex(r, g, b));
  }

  return result;
}
