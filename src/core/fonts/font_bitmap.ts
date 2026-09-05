import type { RenderContext } from '../renderer/type';
import type { BitmapCatalogEntry } from '../shared/bitmap_data_renderer';
import { BitmapDataRenderer } from '../shared/bitmap_data_renderer';
import { metadata as FONT_3x5_METADATA } from './internal/font_3x5';
import { metadata as FONT_4x6_METADATA } from './internal/font_4x6';
import { metadata as FONT_5x5_METADATA } from './internal/font_5x5';
import { metadata as FONT_6x8_METADATA } from './internal/font_6x8';
import { metadata as FONT_8x8_METADATA } from './internal/font_8x8';
import { metadata as FONT_8x13_METADATA } from './internal/font_8x13';

/**
 * Internal catalogue of registered bitmap font definitions.
 *
 * @internal
 */
const Catalog = new Map<string, BitmapCatalogEntry>();

Catalog.set(FONT_3x5_METADATA.name, FONT_3x5_METADATA);
Catalog.set(FONT_4x6_METADATA.name, FONT_4x6_METADATA);
Catalog.set(FONT_5x5_METADATA.name, FONT_5x5_METADATA);
Catalog.set(FONT_6x8_METADATA.name, FONT_6x8_METADATA);
Catalog.set(FONT_8x13_METADATA.name, FONT_8x13_METADATA);
Catalog.set(FONT_8x8_METADATA.name, FONT_8x8_METADATA);

export type InternalBitmapFontName = '3x5' | '4x6' | '5x5' | '6x8' | '8x13' | '8x8';

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
export default class FontBitmap extends BitmapDataRenderer {
  /**
   * Map of pre-built `Path2D` objects for each character. Keys are characters,
   * values are their corresponding paths.
   */
  private glyphPaths: Map<string, Path2D> = new Map();

  /**
   * Creates a font renderer for the named catalogue entry.
   *
   * @param name - The catalogue key (e.g. `"5x5"`).
   * @throws Error if the name is not found in the catalogue.
   *
   * @example
   * ```ts
   * const font = new FontBitmap("5x5");
   * ```
   */
  constructor(name: InternalBitmapFontName) {
    super(name, Catalog, 'FontBitmap');
  }

  /**
   * Returns the raw catalogue entry for this font, or `null` if the
   * font name was not found.
   *
   * @returns Font metadata object or `null`.
   */
  public get metadata() {
    return Catalog.get(this.name) ?? null;
  }

  /**
   * Builds a `Path2D` object for the specified character based on its bitmap data.
   *
   * @param char The character to build a path for.
   * @returns A `Path2D` object representing the character's shape, or `null` if not found.
   */
  private buildGlyphPath(char: string): Path2D | null {
    const charData = this.getChar(char);
    if (!charData) {
      return null;
    }

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
   * cache.
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
   * ```
   */
  public getChar(char: string): number[] | null {
    return this.data[char] ?? null;
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
  public getTextWidth(text: string): number {
    return text.length * this.width;
  }

  /**
   * Renders a single character at the given pixel position.
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

    if (!canvasCtx) {
      return;
    }

    // Canvas path: use pre-built Path2D for performance
    let path = this.glyphPaths.get(char);
    if (path === undefined) {
      const built = this.buildGlyphPath(char);
      if (!built) {
        return;
      }
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
  public renderText(text: string, x: number, y: number, ctx: RenderContext) {
    if (!ctx.getCanvas?.()) {
      return;
    }

    let offsetX = 0;
    for (const char of text) {
      this.renderChar(char, x + offsetX, y, ctx);
      offsetX += this.width;
    }
  }
}
