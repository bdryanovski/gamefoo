import type { RenderContext } from "../renderer/type";
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
   * Map of pre-built `Path2D` objects for each character. Keys are characters,
   * values are their corresponding paths.
   * This cache is used to store pre-built paths for characters that have been
   * rendered at least once, allowing for faster rendering on subsequent calls.
   */
  private glyphPaths: Map<string, Path2D> = new Map();

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
   * Builds a `Path2D` object for the specified character based on its bitmap data.
   * This method reads the character's bitmap data and constructs a path that
   * represents the filled pixels of the character.
   *
   * @param char The character to build a path for.
   *
   * @returns A `Path2D` object representing the character's shape, or `null` if the character is not found in the font data.
   *
   * @remarks
   * This method is called internally when a character is rendered for the first time
   * or when pre-building glyphs. It converts the bitmap representation of the character
   * into a vector path that can be efficiently rendered using `CanvasRenderingContext2D`.
   * The resulting `Path2D` object is cached in the `glyphPaths` map for future use, reducing the overhead of path construction on subsequent renders.
   */
  private buildGlyphPath(char: string): Path2D | null {
    const charData = this.getChar(char);
    if (!charData) return null;

    const path = new Path2D();
    const w = this.width - this.spacing;
    for (let row = 0; row < charData.length; row++) {
      const bits = charData[row]!;
      for (let col = 0; col < w; col++) {
        if ((bits & (1 << (w - 1 - col))) !== 0) {
          path.rect(col, row, 1, 1);
        }
      }
    }
    return path;
  }

  /**
   * Pre-builds `Path2D` objects for a set of characters, storing them in the `glyphPaths`
   * cache. This method can be called with a list of characters that are expected to
   * be rendered frequently,
   */
  public prebuildGlyphs(chars: string[] = []): void {
    for (const char of chars) {
      if (!this.glyphPaths.has(char)) {
        const built = this.buildGlyphPath(char);
        if (built) {
          this.glyphPaths.set(char, built);
        }
      }
    }
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
  public renderChar(char: string, x: number, y: number, ctx: RenderContext) {
    const canvasCtx = ctx.getCanvas?.();

    // For terminal / non-canvas contexts, delegate to drawText
    if (!canvasCtx) {
      ctx.drawText(char, x, y);
      return;
    }

    // Canvas path: use pre-built Path2D for performance
    let path = this.glyphPaths.get(char);
    if (path === undefined) {
      const built = this.buildGlyphPath(char);
      if (!built) return;
      path = built;
      this.glyphPaths.set(char, path);
    }

    canvasCtx.translate(x, y);
    canvasCtx.fill(path);
    canvasCtx.translate(-x, -y);
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
  renderText(text: string, x: number, y: number, ctx: RenderContext) {
    // For terminal / non-canvas contexts, use drawText directly
    if (!ctx.getCanvas?.()) {
      ctx.drawText(text, x, y);
      return;
    }

    let offsetX = 0;
    for (const char of text) {
      this.renderChar(char, x + offsetX, y, ctx);
      offsetX += this.width;
    }
  }
}
