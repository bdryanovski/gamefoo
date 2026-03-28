/**
 * Built-in 4x6 pixel bitmap font.
 *
 * Each character is a 4-pixel-wide, 6-pixel-tall glyph stored as an
 * array of 6 integers. Each integer is a bitmask where bit 3
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 * Small but readable, good for status bars.
 *
 * Supported characters: uppercase A–Z, lowercase a–z, digits 0–9,
 * and common punctuation / special characters.
 *
 * @category Fonts
 * @since 0.2.0
 * @internal
 *
 * @example Reading a glyph
 * ```ts
 * import FONT_4x6 from "./font_4x6";
 *
 * const letterA = FONT_4x6["A"];
 * // 6, 9, 9, 15, 9, 9
 * ```
 */

/** Catalogue name used by {@link FontBitmap} to look up this font. */
export const FONT_4x6_NAME = '4x6';

/**
 * Glyph width in pixels (excluding spacing).
 * @defaultValue `4`
 */
export const FONT_4x6_WIDTH = 4;

/**
 * Glyph height in pixels.
 * @defaultValue `6`
 */
export const FONT_4x6_HEIGHT = 6;

/**
 * Horizontal spacing between glyphs in pixels.
 * @defaultValue `1`
 */
export const FONT_4x6_SPACING = 1;

/**
 * Complete set of supported characters as a single string.
 */
export const FONT_4x6_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !?.,:;-+*/\\()[]{}<>=#%&@^_\'"`~|$';

/**
 * Glyph data keyed by character.
 *
 * Each value is a 6-element `number[]` where each entry is a 4-bit
 * row bitmask (bit 3 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link FontBitmap} — consumes this data for rendering
 */
export const FONT_4x6: Record<string, number[]> = {
  '0': [6, 9, 11, 13, 9, 6],
  '1': [2, 6, 2, 2, 2, 7],
  '2': [6, 9, 1, 6, 8, 15],
  '3': [14, 1, 6, 1, 1, 14],
  '4': [3, 5, 9, 15, 1, 1],
  '5': [15, 8, 14, 1, 1, 14],
  '6': [3, 4, 14, 9, 9, 6],
  '7': [15, 1, 2, 4, 4, 4],
  '8': [6, 9, 6, 9, 9, 6],
  '9': [6, 9, 9, 7, 1, 12],
  A: [6, 9, 9, 15, 9, 9],
  B: [14, 9, 14, 9, 9, 14],
  C: [7, 8, 8, 8, 8, 7],
  D: [14, 9, 9, 9, 9, 14],
  E: [15, 8, 14, 8, 8, 15],
  F: [15, 8, 14, 8, 8, 8],
  G: [7, 8, 8, 11, 9, 7],
  H: [9, 9, 15, 9, 9, 9],
  I: [14, 4, 4, 4, 4, 14],
  J: [7, 1, 1, 1, 9, 6],
  K: [9, 10, 12, 10, 9, 9],
  L: [8, 8, 8, 8, 8, 15],
  M: [9, 15, 15, 9, 9, 9],
  N: [9, 13, 11, 9, 9, 9],
  O: [6, 9, 9, 9, 9, 6],
  P: [14, 9, 9, 14, 8, 8],
  Q: [6, 9, 9, 9, 6, 3],
  R: [14, 9, 9, 14, 9, 9],
  S: [7, 8, 6, 1, 1, 14],
  T: [15, 4, 4, 4, 4, 4],
  U: [9, 9, 9, 9, 9, 6],
  V: [9, 9, 9, 9, 6, 6],
  W: [9, 9, 9, 15, 15, 9],
  X: [9, 9, 6, 6, 9, 9],
  Y: [9, 9, 6, 4, 4, 4],
  Z: [15, 1, 2, 4, 8, 15],
  a: [0, 6, 1, 7, 9, 7],
  b: [8, 8, 14, 9, 9, 14],
  c: [0, 7, 8, 8, 8, 7],
  d: [1, 1, 7, 9, 9, 7],
  e: [0, 6, 9, 15, 8, 7],
  f: [3, 4, 14, 4, 4, 4],
  g: [0, 7, 9, 7, 1, 14],
  h: [8, 8, 14, 9, 9, 9],
  i: [0, 4, 0, 4, 4, 6],
  j: [0, 2, 0, 2, 2, 12],
  k: [8, 9, 10, 12, 10, 9],
  l: [4, 4, 4, 4, 4, 3],
  m: [0, 0, 14, 15, 9, 9],
  n: [0, 0, 14, 9, 9, 9],
  o: [0, 0, 6, 9, 9, 6],
  p: [0, 0, 14, 9, 14, 8],
  q: [0, 0, 7, 9, 7, 1],
  r: [0, 0, 7, 8, 8, 8],
  s: [0, 0, 7, 12, 3, 14],
  t: [4, 4, 14, 4, 4, 3],
  u: [0, 0, 9, 9, 9, 7],
  v: [0, 0, 9, 9, 6, 6],
  w: [0, 0, 9, 9, 15, 9],
  x: [0, 0, 9, 6, 6, 9],
  y: [0, 0, 9, 7, 1, 14],
  z: [0, 0, 15, 2, 4, 15],
  ' ': [0, 0, 0, 0, 0, 0],
  '!': [2, 2, 2, 2, 0, 2],
  '?': [6, 9, 1, 2, 0, 2],
  '.': [0, 0, 0, 0, 0, 4],
  ',': [0, 0, 0, 0, 4, 8],
  ':': [0, 4, 0, 4, 0, 0],
  ';': [0, 4, 0, 4, 4, 8],
  '-': [0, 0, 15, 0, 0, 0],
  '+': [0, 4, 14, 4, 0, 0],
  '*': [0, 9, 6, 6, 9, 0],
  '/': [1, 1, 2, 4, 8, 8],
  '\\': [8, 8, 4, 2, 1, 1],
  '(': [2, 4, 4, 4, 4, 2],
  ')': [4, 2, 2, 2, 2, 4],
  '[': [6, 4, 4, 4, 4, 6],
  ']': [6, 2, 2, 2, 2, 6],
  '{': [3, 4, 12, 4, 4, 3],
  '}': [12, 2, 3, 2, 2, 12],
  '<': [1, 2, 4, 4, 2, 1],
  '>': [8, 4, 2, 2, 4, 8],
  '=': [0, 15, 0, 15, 0, 0],
  '#': [5, 15, 5, 15, 5, 0],
  '%': [9, 1, 2, 4, 8, 9],
  '&': [4, 10, 4, 10, 9, 7],
  '@': [6, 9, 11, 11, 8, 6],
  '^': [4, 10, 0, 0, 0, 0],
  _: [0, 0, 0, 0, 0, 15],
  "'": [6, 4, 0, 0, 0, 0],
  '"': [10, 10, 0, 0, 0, 0],
  '`': [8, 4, 0, 0, 0, 0],
  '~': [0, 6, 9, 9, 0, 0],
  '|': [4, 4, 4, 4, 4, 4],
  $: [4, 7, 12, 7, 1, 14],
};

/**
 * Complete metadata object for the 4x6 font, used by the
 * {@link FontBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /** Catalogue name. */
  name: FONT_4x6_NAME,
  /** Cell width including spacing (4 + 1 = 5). */
  width: FONT_4x6_WIDTH + FONT_4x6_SPACING,
  /** Cell height (6). */
  height: FONT_4x6_HEIGHT,
  /** Inter-glyph spacing (1). */
  spacing: FONT_4x6_SPACING,
  /** Supported character string. */
  chars: FONT_4x6_CHARS,
  /** Glyph bitmask data. */
  data: FONT_4x6,
};

export default FONT_4x6;
