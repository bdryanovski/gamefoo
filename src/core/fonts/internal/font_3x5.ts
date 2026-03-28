/**
 * Built-in 3x5 pixel bitmap font.
 *
 * Each character is a 3-pixel-wide, 5-pixel-tall glyph stored as an
 * array of 5 integers. Each integer is a bitmask where bit 2
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 * Ultra-compact, great for HUDs and tiny labels.
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
 * import FONT_3x5 from "./font_3x5";
 *
 * const letterA = FONT_3x5["A"];
 * // 2, 5, 7, 5, 5
 * ```
 */

/** Catalogue name used by {@link FontBitmap} to look up this font. */
export const FONT_3x5_NAME = '3x5';

/**
 * Glyph width in pixels (excluding spacing).
 * @defaultValue `3`
 */
export const FONT_3x5_WIDTH = 3;

/**
 * Glyph height in pixels.
 * @defaultValue `5`
 */
export const FONT_3x5_HEIGHT = 5;

/**
 * Horizontal spacing between glyphs in pixels.
 * @defaultValue `1`
 */
export const FONT_3x5_SPACING = 1;

/**
 * Complete set of supported characters as a single string.
 */
export const FONT_3x5_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !?.,:;-+*/\\()[]<>=#%&@^_\'"`~|$';

/**
 * Glyph data keyed by character.
 *
 * Each value is a 5-element `number[]` where each entry is a 3-bit
 * row bitmask (bit 2 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link FontBitmap} — consumes this data for rendering
 */
export const FONT_3x5: Record<string, number[]> = {
  '0': [2, 5, 5, 5, 2],
  '1': [2, 6, 2, 2, 7],
  '2': [6, 1, 2, 4, 7],
  '3': [6, 1, 2, 1, 6],
  '4': [5, 5, 7, 1, 1],
  '5': [7, 4, 6, 1, 6],
  '6': [3, 4, 6, 5, 2],
  '7': [7, 1, 2, 2, 2],
  '8': [2, 5, 2, 5, 2],
  '9': [2, 5, 3, 1, 6],
  A: [2, 5, 7, 5, 5],
  B: [6, 5, 6, 5, 6],
  C: [3, 4, 4, 4, 3],
  D: [6, 5, 5, 5, 6],
  E: [7, 4, 6, 4, 7],
  F: [7, 4, 6, 4, 4],
  G: [3, 4, 5, 5, 3],
  H: [5, 5, 7, 5, 5],
  I: [7, 2, 2, 2, 7],
  J: [7, 1, 1, 5, 2],
  K: [5, 5, 6, 5, 5],
  L: [4, 4, 4, 4, 7],
  M: [5, 7, 7, 5, 5],
  N: [5, 7, 7, 5, 5],
  O: [2, 5, 5, 5, 2],
  P: [6, 5, 6, 4, 4],
  Q: [2, 5, 5, 3, 1],
  R: [6, 5, 6, 5, 5],
  S: [3, 4, 2, 1, 6],
  T: [7, 2, 2, 2, 2],
  U: [5, 5, 5, 5, 7],
  V: [5, 5, 5, 5, 2],
  W: [5, 5, 5, 7, 5],
  X: [5, 5, 2, 5, 5],
  Y: [5, 5, 2, 2, 2],
  Z: [7, 1, 2, 4, 7],
  a: [0, 3, 5, 7, 5],
  b: [4, 6, 5, 5, 6],
  c: [0, 3, 4, 4, 3],
  d: [1, 3, 5, 5, 3],
  e: [0, 2, 5, 6, 3],
  f: [3, 4, 6, 4, 4],
  g: [0, 3, 5, 3, 6],
  h: [4, 6, 5, 5, 5],
  i: [0, 2, 0, 2, 3],
  j: [0, 1, 0, 1, 6],
  k: [4, 5, 6, 5, 5],
  l: [2, 2, 2, 2, 3],
  m: [0, 7, 7, 5, 5],
  n: [0, 6, 5, 5, 5],
  o: [0, 2, 5, 5, 2],
  p: [0, 6, 5, 6, 4],
  q: [0, 3, 5, 3, 1],
  r: [0, 3, 4, 4, 4],
  s: [0, 3, 2, 1, 6],
  t: [2, 7, 2, 2, 3],
  u: [0, 5, 5, 5, 3],
  v: [0, 5, 5, 5, 2],
  w: [0, 5, 5, 7, 5],
  x: [0, 5, 2, 2, 5],
  y: [0, 5, 3, 1, 6],
  z: [0, 7, 2, 4, 7],
  ' ': [0, 0, 0, 0, 0],
  '!': [2, 2, 2, 0, 2],
  '?': [6, 1, 2, 0, 2],
  '.': [0, 0, 0, 0, 2],
  ',': [0, 0, 0, 2, 4],
  ':': [0, 2, 0, 2, 0],
  ';': [0, 2, 0, 2, 4],
  '-': [0, 0, 7, 0, 0],
  '+': [0, 2, 7, 2, 0],
  '*': [0, 5, 2, 5, 0],
  '/': [1, 1, 2, 4, 4],
  '\\': [4, 4, 2, 1, 1],
  '(': [1, 2, 2, 2, 1],
  ')': [4, 2, 2, 2, 4],
  '[': [3, 2, 2, 2, 3],
  ']': [6, 2, 2, 2, 6],
  '<': [1, 2, 4, 2, 1],
  '>': [4, 2, 1, 2, 4],
  '=': [0, 7, 0, 7, 0],
  '#': [5, 7, 5, 7, 5],
  '%': [5, 1, 2, 4, 5],
  '&': [2, 5, 2, 5, 3],
  '@': [2, 5, 7, 4, 3],
  '^': [2, 5, 0, 0, 0],
  _: [0, 0, 0, 0, 7],
  "'": [2, 2, 0, 0, 0],
  '"': [5, 5, 0, 0, 0],
  '`': [4, 2, 0, 0, 0],
  '~': [0, 2, 5, 4, 0],
  '|': [2, 2, 2, 2, 2],
  $: [2, 3, 6, 3, 2],
};

/**
 * Complete metadata object for the 3x5 font, used by the
 * {@link FontBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /** Catalogue name. */
  name: FONT_3x5_NAME,
  /** Cell width including spacing (3 + 1 = 4). */
  width: FONT_3x5_WIDTH + FONT_3x5_SPACING,
  /** Cell height (5). */
  height: FONT_3x5_HEIGHT,
  /** Inter-glyph spacing (1). */
  spacing: FONT_3x5_SPACING,
  /** Supported character string. */
  chars: FONT_3x5_CHARS,
  /** Glyph bitmask data. */
  data: FONT_3x5,
};

export default FONT_3x5;
