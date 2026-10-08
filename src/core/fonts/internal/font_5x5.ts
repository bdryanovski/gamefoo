/**
 * Built-in 5x5 pixel bitmap font.
 *
 * Each character is a 5-pixel-wide, 5-pixel-tall glyph stored as an
 * array of five integers. Each integer is a bitmask where bit 4
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 * Supported characters: `A–Z`, `0–9`, and space.
 *
 * @category Fonts
 * @since 0.1.0
 * @internal
 *
 * @example Reading a glyph
 * ```ts
 * import FONT_5x5 from "./font_5x5";
 *
 * const letterA = FONT_5x5["A"];
 * // [14, 17, 31, 17, 17]
 * //
 * //  .###.   = 0b01110 = 14
 * //  #...#   = 0b10001 = 17
 * //  #####   = 0b11111 = 31
 * //  #...#   = 0b10001 = 17
 * //  #...#   = 0b10001 = 17
 * ```
 */

/**
 * Catalogue name used by {@link FontBitmap} to look up this font.
 */
export const FONT_5x5_NAME = '5x5';

/**
 * Glyph width in pixels (excluding spacing).
 * @defaultValue `5`
 */
export const FONT_5x5_WIDTH = 5;

/**
 * Glyph height in pixels.
 * @defaultValue `5`
 */
export const FONT_5x5_HEIGHT = 5;

/**
 * Horizontal spacing between glyphs in pixels.
 * @defaultValue `1`
 */
export const FONT_5x5_SPACING = 1;

/**
 * Complete set of supported characters as a single string.
 */
export const FONT_5x5_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789';

/**
 * Glyph data keyed by character.
 *
 * Each value is a 5-element `number[]` where each entry is a 5-bit
 * row bitmask (bit 4 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link FontBitmap} — consumes this data for rendering
 */
export const FONT_5x5: Record<string, number[]> = {
  A: [14, 17, 31, 17, 17],
  B: [30, 17, 30, 17, 30],
  C: [15, 16, 16, 16, 15],
  D: [30, 17, 17, 17, 30],
  E: [31, 16, 28, 16, 31],
  F: [31, 16, 28, 16, 16],
  G: [15, 16, 19, 17, 15],
  H: [17, 17, 31, 17, 17],
  I: [31, 4, 4, 4, 31],
  L: [16, 16, 16, 16, 31],
  M: [17, 27, 21, 17, 17],
  N: [17, 25, 21, 19, 17],
  O: [14, 17, 17, 17, 14],
  P: [30, 17, 30, 16, 16],
  R: [30, 17, 30, 18, 17],
  S: [15, 16, 14, 1, 30],
  T: [31, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 14],
  V: [17, 17, 17, 10, 4],
  W: [17, 17, 21, 27, 17],
  Y: [17, 10, 4, 4, 4],
  ' ': [0, 0, 0, 0, 0],
  '0': [14, 17, 17, 17, 14],
  '1': [4, 12, 4, 4, 14],
  '2': [14, 17, 6, 8, 31],
  '3': [30, 1, 14, 1, 30],
  '4': [18, 18, 31, 2, 2],
  '5': [31, 16, 30, 1, 30],
  '6': [14, 16, 30, 17, 14],
  '7': [31, 1, 2, 4, 4],
  '8': [14, 17, 14, 17, 14],
  '9': [14, 17, 15, 1, 14],
  '.': [0, 0, 0, 12, 12],
  ',': [0, 0, 0, 12, 4],
  '/': [1, 2, 4, 8, 16],
  '|': [4, 4, 4, 4, 4],
  '(': [2, 4, 4, 4, 2],
  ')': [8, 4, 4, 4, 8],
  '?': [14, 17, 6, 0, 4],
  '!': [4, 4, 4, 0, 4],
  '#': [10, 31, 10, 31, 10],
  $: [14, 16, 14, 1, 14],
  '%': [19, 9, 4, 18, 25],
  '@': [14, 17, 21, 21, 14],
  '^': [4, 10, 17, 0, 0],
  '&': [14, 17, 14, 21, 14],
  '*': [0, 10, 4, 10, 0],
  '-': [0, 0, 31, 0, 0],
  '+': [0, 4, 14, 4, 0],
  '=': [0, 14, 0, 14, 0],
};

/**
 * Complete metadata object for the 5x5 font, used by the
 * {@link FontBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /**
   * Catalogue name.
   */
  name: FONT_5x5_NAME,
  /**
   * Cell width including spacing (5 + 1 = 6).
   */
  width: FONT_5x5_WIDTH + FONT_5x5_SPACING,
  /**
   * Cell height (5).
   */
  height: FONT_5x5_HEIGHT,
  /**
   * Inter-glyph spacing (1).
   */
  spacing: FONT_5x5_SPACING,
  /**
   * Supported character string.
   */
  chars: FONT_5x5_CHARS,
  /**
   * Glyph bitmask data.
   */
  data: FONT_5x5,
};

export default FONT_5x5;
