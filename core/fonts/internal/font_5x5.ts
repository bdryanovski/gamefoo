export const FONT_5x5_NAME = "5x5";

export const FONT_5x5_WIDTH = 5;
export const FONT_5x5_HEIGHT = 5;
export const FONT_5x5_SPACING = 1;

export const FONT_5x5_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";

// 5x5 bitmap font — each row is a 5-bit mask (bit 4 = left, bit 0 = right)
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
  " ": [0, 0, 0, 0, 0],
  "0": [14, 17, 17, 17, 14],
  "1": [4, 12, 4, 4, 14],
  "2": [14, 17, 6, 8, 31],
  "3": [30, 1, 14, 1, 30],
  "4": [18, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 30],
  "6": [14, 16, 30, 17, 14],
  "7": [31, 1, 2, 4, 4],
  "8": [14, 17, 14, 17, 14],
  "9": [14, 17, 15, 1, 14],
};

export const metadata = {
  name: FONT_5x5_NAME,
  width: FONT_5x5_WIDTH + FONT_5x5_SPACING,
  height: FONT_5x5_HEIGHT,
  spacing: FONT_5x5_SPACING,
  chars: FONT_5x5_CHARS,
  data: FONT_5x5,
};

export default FONT_5x5;
