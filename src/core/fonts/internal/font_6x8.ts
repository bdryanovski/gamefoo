/**
 * Built-in 6x8 pixel bitmap font.
 *
 * Each character is a 6-pixel-wide, 8-pixel-tall glyph stored as an
 * array of 8 integers. Each integer is a bitmask where bit 5
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 * Classic arcade and console aesthetic.
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
 * import FONT_6x8 from "./font_6x8";
 *
 * const letterA = FONT_6x8["A"];
 * // 12, 18, 33, 33, 63, 33, 33, 0
 * ```
 */

/** Catalogue name used by {@link FontBitmap} to look up this font. */
export const FONT_6x8_NAME = "6x8";

/**
 * Glyph width in pixels (excluding spacing).
 * @defaultValue `6`
 */
export const FONT_6x8_WIDTH = 6;

/**
 * Glyph height in pixels.
 * @defaultValue `8`
 */
export const FONT_6x8_HEIGHT = 8;

/**
 * Horizontal spacing between glyphs in pixels.
 * @defaultValue `1`
 */
export const FONT_6x8_SPACING = 1;

/**
 * Complete set of supported characters as a single string.
 */
export const FONT_6x8_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !?.,:;-+*/\\()[]{}<>=#%&@^_'\"`~|$";

/**
 * Glyph data keyed by character.
 *
 * Each value is a 8-element `number[]` where each entry is a 6-bit
 * row bitmask (bit 5 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link FontBitmap} — consumes this data for rendering
 */
export const FONT_6x8: Record<string, number[]> = {
  "0": [30, 33, 35, 37, 41, 49, 30, 0],
  "1": [12, 28, 12, 12, 12, 12, 63, 0],
  "2": [30, 33, 1, 14, 16, 32, 63, 0],
  "3": [30, 33, 1, 30, 1, 33, 30, 0],
  "4": [6, 14, 22, 38, 63, 6, 6, 0],
  "5": [63, 32, 62, 1, 1, 33, 30, 0],
  "6": [30, 33, 32, 62, 33, 33, 30, 0],
  "7": [63, 1, 2, 4, 8, 16, 32, 0],
  "8": [30, 33, 33, 30, 33, 33, 30, 0],
  "9": [30, 33, 33, 31, 1, 33, 30, 0],
  A: [12, 18, 33, 33, 63, 33, 33, 0],
  B: [62, 33, 33, 62, 33, 33, 62, 0],
  C: [30, 33, 32, 32, 32, 33, 30, 0],
  D: [60, 34, 33, 33, 33, 34, 60, 0],
  E: [63, 32, 32, 60, 32, 32, 63, 0],
  F: [63, 32, 32, 60, 32, 32, 32, 0],
  G: [30, 33, 32, 39, 33, 33, 31, 0],
  H: [33, 33, 33, 63, 33, 33, 33, 0],
  I: [30, 12, 12, 12, 12, 12, 30, 0],
  J: [15, 3, 3, 3, 3, 35, 30, 0],
  K: [33, 34, 36, 40, 52, 34, 33, 0],
  L: [32, 32, 32, 32, 32, 32, 63, 0],
  M: [33, 51, 45, 37, 33, 33, 33, 0],
  N: [33, 49, 41, 37, 35, 33, 33, 0],
  O: [30, 33, 33, 33, 33, 33, 30, 0],
  P: [62, 33, 33, 62, 32, 32, 32, 0],
  Q: [30, 33, 33, 33, 37, 34, 29, 0],
  R: [62, 33, 33, 62, 36, 34, 33, 0],
  S: [31, 32, 32, 30, 1, 1, 62, 0],
  T: [63, 12, 12, 12, 12, 12, 12, 0],
  U: [33, 33, 33, 33, 33, 33, 30, 0],
  V: [33, 33, 33, 33, 18, 18, 12, 0],
  W: [33, 33, 33, 37, 45, 51, 33, 0],
  X: [33, 18, 12, 12, 18, 33, 33, 0],
  Y: [33, 33, 18, 12, 12, 12, 12, 0],
  Z: [63, 1, 2, 12, 16, 32, 63, 0],
  a: [0, 0, 30, 1, 31, 33, 31, 0],
  b: [32, 32, 46, 49, 33, 49, 46, 0],
  c: [0, 0, 30, 32, 32, 32, 30, 0],
  d: [1, 1, 29, 35, 33, 35, 29, 0],
  e: [0, 0, 30, 33, 63, 32, 30, 0],
  f: [14, 17, 16, 60, 16, 16, 16, 0],
  g: [0, 29, 35, 33, 31, 1, 30, 0],
  h: [32, 32, 46, 49, 33, 33, 33, 0],
  i: [12, 0, 12, 28, 12, 12, 30, 0],
  j: [6, 0, 6, 6, 6, 38, 28, 0],
  k: [32, 32, 33, 38, 56, 38, 33, 0],
  l: [24, 8, 8, 8, 8, 8, 30, 0],
  m: [0, 0, 54, 41, 33, 33, 33, 0],
  n: [0, 0, 46, 49, 33, 33, 33, 0],
  o: [0, 0, 30, 33, 33, 33, 30, 0],
  p: [0, 46, 49, 33, 49, 46, 32, 32],
  q: [0, 29, 35, 33, 35, 29, 1, 1],
  r: [0, 0, 30, 32, 32, 32, 32, 0],
  s: [0, 0, 31, 32, 30, 1, 62, 0],
  t: [16, 16, 60, 16, 16, 17, 14, 0],
  u: [0, 0, 33, 33, 33, 35, 29, 0],
  v: [0, 0, 33, 33, 18, 18, 12, 0],
  w: [0, 0, 33, 33, 37, 45, 18, 0],
  x: [0, 0, 33, 18, 12, 18, 33, 0],
  y: [0, 33, 33, 33, 31, 1, 30, 0],
  z: [0, 0, 63, 2, 12, 16, 63, 0],
  " ": [0, 0, 0, 0, 0, 0, 0, 0],
  "!": [12, 12, 12, 12, 12, 0, 12, 0],
  "?": [30, 33, 1, 6, 12, 0, 12, 0],
  ".": [0, 0, 0, 0, 0, 12, 12, 0],
  ",": [0, 0, 0, 0, 12, 12, 24, 0],
  ":": [0, 12, 12, 0, 12, 12, 0, 0],
  ";": [0, 12, 12, 0, 12, 12, 24, 0],
  "-": [0, 0, 0, 63, 0, 0, 0, 0],
  "+": [0, 12, 12, 63, 12, 12, 0, 0],
  "*": [0, 33, 18, 12, 18, 33, 0, 0],
  "/": [1, 1, 2, 12, 16, 32, 0, 0],
  "\\": [32, 16, 8, 4, 2, 1, 0, 0],
  "(": [6, 12, 24, 24, 24, 12, 6, 0],
  ")": [24, 12, 6, 6, 6, 12, 24, 0],
  "[": [30, 16, 16, 16, 16, 16, 30, 0],
  "]": [30, 2, 2, 2, 2, 2, 30, 0],
  "{": [14, 24, 24, 48, 24, 24, 14, 0],
  "}": [28, 6, 6, 3, 6, 6, 28, 0],
  "<": [3, 12, 48, 48, 12, 3, 0, 0],
  ">": [48, 12, 3, 3, 12, 48, 0, 0],
  "=": [0, 63, 0, 63, 0, 0, 0, 0],
  "#": [18, 18, 63, 18, 63, 18, 18, 0],
  "%": [33, 34, 4, 12, 16, 32, 33, 0],
  "&": [24, 36, 36, 25, 38, 36, 27, 0],
  "@": [30, 33, 33, 47, 41, 32, 31, 0],
  "^": [12, 18, 33, 0, 0, 0, 0, 0],
  _: [0, 0, 0, 0, 0, 0, 63, 0],
  "'": [12, 12, 24, 0, 0, 0, 0, 0],
  '"': [36, 36, 0, 0, 0, 0, 0, 0],
  "`": [24, 12, 0, 0, 0, 0, 0, 0],
  "~": [0, 17, 42, 36, 0, 0, 0, 0],
  "|": [12, 12, 12, 12, 12, 12, 12, 0],
  $: [12, 30, 32, 30, 1, 30, 12, 0],
};

/**
 * Complete metadata object for the 6x8 font, used by the
 * {@link FontBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /** Catalogue name. */
  name: FONT_6x8_NAME,
  /** Cell width including spacing (6 + 1 = 7). */
  width: FONT_6x8_WIDTH + FONT_6x8_SPACING,
  /** Cell height (8). */
  height: FONT_6x8_HEIGHT,
  /** Inter-glyph spacing (1). */
  spacing: FONT_6x8_SPACING,
  /** Supported character string. */
  chars: FONT_6x8_CHARS,
  /** Glyph bitmask data. */
  data: FONT_6x8,
};

export default FONT_6x8;
