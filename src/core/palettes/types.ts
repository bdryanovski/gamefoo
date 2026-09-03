/**
 * Type definitions for console color palettes.
 *
 * @category Palettes
 * @module palettes/types
 * @since 0.5.0
 */

/**
 * A hex color string in the format `#RRGGBB`.
 *
 * @since 0.5.0
 */
export type HexColor = `#${string}`;

/**
 * A basic color palette with a name and array of colors.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const myPalette: ColorPalette = {
 *   name: 'My Palette',
 *   colors: ['#000000', '#FFFFFF'],
 * };
 * ```
 */
export interface ColorPalette {
  /**
   * Display name of the palette.
   */
  readonly name: string;
  /**
   * Array of hex color values.
   */
  readonly colors: readonly HexColor[];
}

/**
 * A color palette with both array access and named color access.
 *
 * @typeParam T - Record of named colors mapping names to hex values.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const palette: NamedColorPalette<{ BLACK: HexColor; WHITE: HexColor }> = {
 *   name: 'Simple',
 *   colors: ['#000000', '#FFFFFF'],
 *   named: {
 *     BLACK: '#000000',
 *     WHITE: '#FFFFFF',
 *   },
 * };
 *
 * // Array access
 * palette.colors[0]; // '#000000'
 *
 * // Named access
 * palette.named.BLACK; // '#000000'
 * ```
 */
export interface NamedColorPalette<T = Record<string, HexColor>> extends ColorPalette {
  /**
   * Named color access.
   */
  readonly named: T;
}

/**
 * A palette that generates colors programmatically.
 *
 * Used for consoles with large color spaces (SNES, Genesis, etc.)
 * where defining all colors manually would be impractical.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const snes: GeneratedPalette = {
 *   name: 'SNES',
 *   totalColors: 32768,
 *   bitsPerChannel: 5,
 *   generate(r, g, b) {
 *     // Convert 5-bit RGB to hex
 *     return '#...';
 *   },
 * };
 *
 * const red = snes.generate(31, 0, 0); // Full red
 * ```
 */
export interface GeneratedPalette {
  /**
   * Display name of the palette.
   */
  readonly name: string;
  /**
   * Total number of possible colors.
   */
  readonly totalColors: number;
  /**
   * Bits per color channel (e.g., 5 for SNES 15-bit RGB).
   */
  readonly bitsPerChannel: number;
  /**
   * Generates a hex color from channel values.
   *
   * @param r - Red channel value (0 to 2^bitsPerChannel - 1)
   * @param g - Green channel value (0 to 2^bitsPerChannel - 1)
   * @param b - Blue channel value (0 to 2^bitsPerChannel - 1)
   * @returns Hex color string
   */
  generate(r: number, g: number, b: number): HexColor;
  /**
   * Optional subset of commonly used colors for quick access.
   */
  readonly commonColors?: readonly HexColor[];
}
