/**
 * Built-in 8x8 pixel bitmap font.
 *
 * Each character is a 8-pixel-wide, 8-pixel-tall glyph stored as an
 * array of 8 integers. Each integer is a bitmask where bit 7
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 * Chunky square glyphs, ideal at 2× or 4× scale.
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
 * import FONT_8x8 from "./font_8x8";
 *
 * const letterA = FONT_8x8["A"];
 * // 24, 36, 66, 66, 126, 66, 66, 0
 * ```
 */

/** Catalogue name used by {@link FontBitmap} to look up this font. */
export const FONT_8x8_NAME = '8x8';

/**
 * Glyph width in pixels (excluding spacing).
 * @defaultValue `8`
 */
export const FONT_8x8_WIDTH = 8;

/**
 * Glyph height in pixels.
 * @defaultValue `8`
 */
export const FONT_8x8_HEIGHT = 8;

/**
 * Horizontal spacing between glyphs in pixels.
 * @defaultValue `1`
 */
export const FONT_8x8_SPACING = 1;

/**
 * Complete set of supported characters as a single string.
 */
export const FONT_8x8_CHARS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !?.,:;-+*/\\()[]{}<>=#%&@^_\'"`~|$';

/**
 * Glyph data keyed by character.
 *
 * Each value is a 8-element `number[]` where each entry is a 8-bit
 * row bitmask (bit 7 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link FontBitmap} — consumes this data for rendering
 */
export const FONT_8x8: Record<string, number[]> = {
  '0': [60, 66, 70, 74, 82, 98, 60, 0],
  '1': [24, 56, 24, 24, 24, 24, 126, 0],
  '2': [60, 66, 2, 12, 48, 64, 126, 0],
  '3': [126, 2, 4, 28, 2, 2, 124, 0],
  '4': [4, 12, 20, 36, 68, 254, 4, 0],
  '5': [254, 128, 252, 2, 2, 66, 60, 0],
  '6': [62, 64, 128, 252, 130, 130, 124, 0],
  '7': [254, 4, 8, 16, 32, 64, 128, 0],
  '8': [60, 66, 66, 60, 66, 66, 60, 0],
  '9': [60, 66, 66, 62, 2, 2, 60, 0],
  A: [24, 36, 66, 66, 126, 66, 66, 0],
  B: [252, 66, 66, 124, 66, 66, 252, 0],
  C: [62, 64, 128, 128, 128, 64, 62, 0],
  D: [248, 68, 66, 66, 66, 68, 248, 0],
  E: [254, 128, 128, 252, 128, 128, 254, 0],
  F: [254, 128, 128, 252, 128, 128, 128, 0],
  G: [62, 64, 128, 142, 130, 66, 62, 0],
  H: [66, 66, 66, 126, 66, 66, 66, 0],
  I: [126, 24, 24, 24, 24, 24, 126, 0],
  J: [62, 4, 4, 4, 132, 136, 112, 0],
  K: [130, 132, 136, 240, 136, 132, 130, 0],
  L: [128, 128, 128, 128, 128, 128, 254, 0],
  M: [130, 198, 170, 146, 130, 130, 130, 0],
  N: [130, 194, 162, 146, 138, 134, 130, 0],
  O: [60, 66, 129, 129, 129, 66, 60, 0],
  P: [252, 130, 130, 252, 128, 128, 128, 0],
  Q: [60, 66, 129, 129, 133, 66, 61, 0],
  R: [252, 130, 130, 252, 136, 132, 130, 0],
  S: [62, 64, 128, 124, 2, 2, 252, 0],
  T: [254, 16, 16, 16, 16, 16, 16, 0],
  U: [130, 130, 130, 130, 130, 68, 56, 0],
  V: [130, 130, 68, 68, 40, 40, 16, 0],
  W: [130, 130, 130, 146, 170, 198, 130, 0],
  X: [130, 68, 40, 16, 40, 68, 130, 0],
  Y: [130, 68, 40, 16, 16, 16, 16, 0],
  Z: [254, 4, 8, 16, 32, 64, 254, 0],
  a: [0, 0, 60, 2, 62, 66, 62, 0],
  b: [64, 64, 124, 66, 66, 66, 124, 0],
  c: [0, 0, 62, 64, 64, 64, 62, 0],
  d: [2, 2, 62, 66, 66, 66, 62, 0],
  e: [0, 0, 60, 66, 126, 64, 62, 0],
  f: [14, 16, 16, 62, 16, 16, 16, 0],
  g: [0, 62, 66, 66, 62, 2, 60, 0],
  h: [64, 64, 124, 66, 66, 66, 66, 0],
  i: [16, 0, 48, 16, 16, 16, 62, 0],
  j: [8, 0, 8, 8, 8, 72, 48, 0],
  k: [64, 68, 72, 112, 72, 68, 66, 0],
  l: [96, 32, 32, 32, 32, 32, 126, 0],
  m: [0, 0, 218, 170, 170, 130, 130, 0],
  n: [0, 0, 124, 66, 66, 66, 66, 0],
  o: [0, 0, 60, 66, 66, 66, 60, 0],
  p: [0, 124, 66, 66, 124, 64, 64, 0],
  q: [0, 62, 66, 66, 62, 2, 2, 0],
  r: [0, 0, 94, 96, 64, 64, 64, 0],
  s: [0, 0, 62, 64, 60, 2, 124, 0],
  t: [32, 32, 126, 32, 32, 34, 28, 0],
  u: [0, 0, 66, 66, 66, 70, 58, 0],
  v: [0, 0, 66, 66, 36, 40, 16, 0],
  w: [0, 0, 130, 130, 146, 170, 68, 0],
  x: [0, 0, 66, 36, 24, 36, 66, 0],
  y: [0, 66, 66, 66, 62, 2, 60, 0],
  z: [0, 0, 254, 4, 24, 96, 254, 0],
  ' ': [0, 0, 0, 0, 0, 0, 0, 0],
  '!': [24, 24, 24, 24, 24, 0, 24, 0],
  '?': [60, 66, 2, 4, 8, 0, 8, 0],
  '.': [0, 0, 0, 0, 0, 48, 48, 0],
  ',': [0, 0, 0, 0, 48, 48, 96, 0],
  ':': [0, 24, 24, 0, 24, 24, 0, 0],
  ';': [0, 24, 24, 0, 24, 24, 48, 0],
  '-': [0, 0, 0, 254, 0, 0, 0, 0],
  '+': [0, 16, 16, 254, 16, 16, 0, 0],
  '*': [0, 130, 68, 56, 68, 130, 0, 0],
  '/': [2, 4, 8, 16, 32, 64, 128, 0],
  '\\': [128, 64, 32, 16, 8, 4, 2, 0],
  '(': [12, 16, 32, 32, 32, 16, 12, 0],
  ')': [48, 8, 4, 4, 4, 8, 48, 0],
  '[': [120, 64, 64, 64, 64, 64, 120, 0],
  ']': [30, 2, 2, 2, 2, 2, 30, 0],
  '{': [30, 48, 16, 96, 16, 48, 30, 0],
  '}': [120, 12, 8, 6, 8, 12, 120, 0],
  '<': [4, 8, 16, 32, 16, 8, 4, 0],
  '>': [32, 16, 8, 4, 8, 16, 32, 0],
  '=': [0, 0, 254, 0, 254, 0, 0, 0],
  '#': [36, 36, 254, 36, 254, 36, 36, 0],
  '%': [194, 196, 8, 16, 32, 67, 131, 0],
  '&': [56, 68, 72, 48, 74, 68, 58, 0],
  '@': [60, 66, 157, 165, 158, 64, 60, 0],
  '^': [16, 40, 68, 130, 0, 0, 0, 0],
  _: [0, 0, 0, 0, 0, 0, 254, 0],
  "'": [24, 24, 48, 0, 0, 0, 0, 0],
  '"': [72, 72, 0, 0, 0, 0, 0, 0],
  '`': [48, 24, 8, 0, 0, 0, 0, 0],
  '~': [0, 70, 137, 144, 0, 0, 0, 0],
  '|': [24, 24, 24, 24, 24, 24, 24, 0],
  $: [24, 62, 96, 60, 6, 124, 24, 0],
};

/**
 * Complete metadata object for the 8x8 font, used by the
 * {@link FontBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /** Catalogue name. */
  name: FONT_8x8_NAME,
  /** Cell width including spacing (8 + 1 = 9). */
  width: FONT_8x8_WIDTH + FONT_8x8_SPACING,
  /** Cell height (8). */
  height: FONT_8x8_HEIGHT,
  /** Inter-glyph spacing (1). */
  spacing: FONT_8x8_SPACING,
  /** Supported character string. */
  chars: FONT_8x8_CHARS,
  /** Glyph bitmask data. */
  data: FONT_8x8,
};

export default FONT_8x8;
