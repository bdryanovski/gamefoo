/**
 * ANSI escape code utilities for terminal rendering.
 *
 * All functions return strings containing ANSI / VT100 escape sequences.
 * Concatenate them and write to `process.stdout` to control a TTY terminal.
 *
 * These are used internally by {@link TerminalRenderContext} and are
 * exported for advanced use (e.g. custom terminal UI overlays).
 *
 * @module ansi
 * @since 0.4.0
 *
 * @example Writing directly to the terminal
 * ```ts
 * import * as ansi from "gamefoo/renderer/utils/ansi";
 *
 * process.stdout.write(ansi.hideCursor());
 * process.stdout.write(ansi.clearScreen());
 * process.stdout.write(ansi.moveTo(5, 10));
 * process.stdout.write(ansi.fgRGB(0, 255, 0) + "Hello!" + ansi.reset());
 * process.stdout.write(ansi.showCursor());
 * ```
 */

/**
 * The ASCII ESC character (`\x1b`, decimal 27).
 *
 * All ANSI escape sequences begin with this byte.
 *
 * @since 0.4.0
 */
export const ESC = "\x1b";

/**
 * Control Sequence Introducer — `ESC[`.
 *
 * The two-character prefix for most ANSI CSI sequences (cursor movement,
 * colour, erase, etc.).
 *
 * @since 0.4.0
 */
export const CSI = `${ESC}[`;

/**
 * Moves the cursor to the specified row and column (both 1-indexed).
 *
 * Emits `ESC[<row>;<col>H`.
 *
 * @param row - Target row (1 = top of screen).
 * @param col - Target column (1 = left of screen).
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.moveTo(1, 1)); // top-left corner
 * ```
 */
export const moveTo = (row: number, col: number) => `${CSI}${row};${col}H`;

/**
 * Erases the entire screen and moves the cursor to the top-left.
 *
 * Emits `ESC[2J` followed by `ESC[H`.
 *
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.clearScreen());
 * ```
 */
export const clearScreen = () => `${CSI}2J${CSI}H`;

/**
 * Hides the terminal cursor.
 *
 * Emits `ESC[?25l`. Remember to call {@link showCursor} on process exit.
 *
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.hideCursor());
 * process.on("exit", () => process.stdout.write(ansi.showCursor()));
 * ```
 */
export const hideCursor = () => `${CSI}?25l`;

/**
 * Shows the terminal cursor.
 *
 * Emits `ESC[?25h`. Always call this on exit to restore the cursor.
 *
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 */
export const showCursor = () => `${CSI}?25h`;

/**
 * Sets the foreground (text) colour using 24-bit truecolour.
 *
 * Emits `ESC[38;2;<r>;<g>;<b>m`.
 *
 * @param r - Red channel (0–255).
 * @param g - Green channel (0–255).
 * @param b - Blue channel (0–255).
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.fgRGB(0, 255, 0) + "GREEN TEXT" + ansi.reset());
 * ```
 */
export const fgRGB = (r: number, g: number, b: number) => `${CSI}38;2;${r};${g};${b}m`;

/**
 * Sets the background colour using 24-bit truecolour.
 *
 * Emits `ESC[48;2;<r>;<g>;<b>m`.
 *
 * @param r - Red channel (0–255).
 * @param g - Green channel (0–255).
 * @param b - Blue channel (0–255).
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.bgRGB(255, 0, 0) + "RED BG" + ansi.reset());
 * ```
 */
export const bgRGB = (r: number, g: number, b: number) => `${CSI}48;2;${r};${g};${b}m`;

/**
 * Resets all ANSI text attributes (colour, bold, underline, etc.)
 * back to terminal defaults.
 *
 * Emits `ESC[0m`. Always append this after coloured output to avoid
 * colour bleeding into subsequent text.
 *
 * @returns ANSI escape string.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * process.stdout.write(ansi.fgRGB(255, 165, 0) + "ORANGE" + ansi.reset());
 * ```
 */
export const reset = () => `${CSI}0m`;

/**
 * Converts a CSS hex colour string to an `[r, g, b]` tuple.
 *
 * Accepts the common `#rrggbb` format (with or without the `#` prefix).
 * Values are clamped to the 0–255 range by the bit-mask.
 *
 * @param hex - Hex colour string, e.g. `"#1a2a3a"` or `"ff8800"`.
 * @returns A `[red, green, blue]` tuple, each in the range 0–255.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const [r, g, b] = ansi.hexToRGB("#7fdbca");
 * // r = 127, g = 219, b = 202
 * ```
 */
export const hexToRGB = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
