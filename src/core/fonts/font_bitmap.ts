import { metadata as FONT_3x5_METADATA } from "./internal/font_3x5";
import { metadata as FONT_4x6_METADATA } from "./internal/font_4x6";
import { metadata as FONT_5x5_METADATA } from "./internal/font_5x5";
import { metadata as FONT_6x8_METADATA } from "./internal/font_6x8";
import { metadata as FONT_8x8_METADATA } from "./internal/font_8x8";
import { metadata as FONT_8x13_METADATA } from "./internal/font_8x13";

/**
 * Internal catalogue of registered bitmap font definitions.
 *
 * Fonts are added at module load time. Currently ships with the
 * built-in {@link FONT_5x5 | 5x5} pixel font.
 *
 * @internal
 */
const Catalog = new Map<
  string,
  {
    name: string;
    width: number;
    height: number;
    chars: string;
    spacing: number;
    data: Record<string, number[]>;
  }
>();

Catalog.set(FONT_3x5_METADATA.name, FONT_3x5_METADATA);
Catalog.set(FONT_4x6_METADATA.name, FONT_4x6_METADATA);
Catalog.set(FONT_5x5_METADATA.name, FONT_5x5_METADATA);
Catalog.set(FONT_6x8_METADATA.name, FONT_6x8_METADATA);
Catalog.set(FONT_8x13_METADATA.name, FONT_8x13_METADATA);
Catalog.set(FONT_8x8_METADATA.name, FONT_8x8_METADATA);

export type InternalBitmapFontName = "3x5" | "4x6" | "5x5" | "6x8" | "8x13" | "8x8";

/**
 * Pixel-perfect bitmap font renderer.
 *
 * `FontBitmap` looks up a named font from the built-in catalogue,
 * then renders individual characters or whole strings onto a
 * `CanvasRenderingContext2D` one pixel at a time using `fillRect`.
 *
 * Each character is stored as an array of row bitmasks where each bit
 * represents a single pixel.
 *
 * @category Fonts
 * @since 0.1.0
 *
 * @example Rendering text with the built-in 5x5 font
 * ```ts
 * import { FontBitmap } from "gamefoo";
 *
 * const font = new FontBitmap("5x5");
 *
 * ctx.fillStyle = "#ffffff";
 * font.renderText("HELLO WORLD", 10, 10, ctx);
 * ```
 *
 * @example Measuring text width
 * ```ts
 * const font  = new FontBitmap("5x5");
 * const width = font.getTextWidth("SCORE 999");
 * // width === 9 * 6 = 54 (each char is 5px + 1px spacing)
 * ```
 *
 * @see {@link FONT_5x5} — the built-in 5x5 pixel font data
 */
export default class FontBitmap {
  /** The catalogue name of the loaded font (e.g. `"5x5"`). */
  public readonly name: string;

  /**
   * Character bitmask data keyed by character string.
   *
   * Each value is an array of integers where each integer represents
   * one row of pixels (MSB = leftmost pixel).
   */
  protected readonly data: Record<string, number[]>;

  /**
   * Character cell width in pixels (including spacing).
   *
   * @defaultValue `0` (populated from catalogue on construction)
   */
  public width: number = 0;

  /**
   * Character cell height in pixels.
   *
   * @defaultValue `0` (populated from catalogue on construction)
   */
  public height: number = 0;

  /**
   * Horizontal spacing between the drawable area and the full cell
   * width, in pixels.
   *
   * @defaultValue `0`
   */
  protected spacing: number = 0;

  /**
   * Creates a font renderer for the named catalogue entry.
   *
   * If the name does not match any registered font the instance will
   * have empty data and zero dimensions — calls to `renderChar` /
   * `renderText` will be no-ops.
   *
   * @param name - The catalogue key (e.g. `"5x5"`).
   *
   * @throws Error if the name is not found in the catalogue.
   *
   * @example
   * ```ts
   * const font = new FontBitmap("5x5");
   * ```
   */
  constructor(name: InternalBitmapFontName) {
    this.name = name;

    this.data = {};

    if (Catalog.has(name)) {
      this.data = Catalog.get(name)!.data;
    } else {
      throw new Error(`FontBitmap: No font found for name "${name}".`);
    }

    this.width = this.metadata?.width || 0;
    this.height = this.metadata?.height || 0;
    this.spacing = this.metadata?.spacing || 0;
  }

  /**
   * Returns the raw catalogue entry for this font, or `null` if the
   * font name was not found.
   *
   * @returns Font metadata object or `null`.
   */
  get metadata() {
    return Catalog.get(this.name) || null;
  }

  /**
   * Retrieves the bitmask rows for a single character.
   *
   * @param char - A single character string (e.g. `"A"`).
   * @returns An array of row bitmasks, or `null` if the character is
   *   not defined in this font.
   *
   * @example
   * ```ts
   * const rows = font.getChar("A");
   * // rows → [14, 17, 31, 17, 17] for the 5x5 font
   * ```
   */
  getChar(char: string): number[] | null {
    return this.data[char] || null;
  }

  /**
   * Computes the pixel width required to render the given text string.
   *
   * @param text - The string to measure.
   * @returns Width in pixels (`text.length * cellWidth`).
   *
   * @example
   * ```ts
   * const w = font.getTextWidth("HI"); // 12 for the 5x5 font
   * ```
   */
  getTextWidth(text: string): number {
    return text.length * this.width;
  }

  /**
   * Renders a single character at the given pixel position.
   *
   * Each set bit in the character's row bitmask produces a 1x1
   * `fillRect` call using the context's current `fillStyle`.
   *
   * @param char - The character to draw.
   * @param x    - Left edge X coordinate in canvas pixels.
   * @param y    - Top edge Y coordinate in canvas pixels.
   * @param ctx  - The 2-D rendering context to draw into.
   *
   * @example
   * ```ts
   * ctx.fillStyle = "#00ff00";
   * font.renderChar("G", 20, 40, ctx);
   * ```
   */
  renderChar(char: string, x: number, y: number, ctx: CanvasRenderingContext2D) {
    const charData = this.getChar(char);
    if (charData === null) {
      return;
    }
    for (let row = 0; row < charData.length; row++) {
      const bits = charData[row]!;
      for (let col = 0; col < this.width - this.spacing; col++) {
        if ((bits & (1 << (this.width - this.spacing - 1 - col))) !== 0) {
          ctx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }

  /**
   * Renders a full text string by drawing each character sequentially.
   *
   * Characters are spaced according to the font's cell width.
   *
   * @param text - The string to render.
   * @param x    - Left edge X coordinate of the first character.
   * @param y    - Top edge Y coordinate.
   * @param ctx  - The 2-D rendering context.
   *
   * @example
   * ```ts
   * ctx.fillStyle = "#ffffff";
   * font.renderText("GAME OVER", 100, 50, ctx);
   * ```
   */
  renderText(text: string, x: number, y: number, ctx: CanvasRenderingContext2D) {
    let offsetX = 0;
    for (const char of text) {
      this.renderChar(char, x + offsetX, y, ctx);
      offsetX += this.width;
    }
  }
}
