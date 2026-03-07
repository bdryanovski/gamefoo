import FontBitmap from "./font_bitmap";

/**
 * Bitmap font renderer that pre-builds character paths for faster rendering and
 * reduced CPU usage at the cost of increased memory usage.
 *
 * GC pressure is reduced by pre-building `Path2D` objects for each character,
 * which are then reused on subsequent renders. This can significantly improve
 * performance when rendering the same characters multiple times, such as in a
 * game UI or repeated text elements.
 *
 * Build on top of {@link FontBitmap}, `FontBitmapPrebuild` overrides the character rendering
 *
 * @category Fonts
 * @since 0.2.0
 *
 * @example Pre-building glyphs for a menu
 *
 * ```ts
 * import { FontBitmapPrebuild } from "gamefoo";
 *
 * const font = new FontBitmapPrebuild("5x5");
 * font.prebuildGlyphs("PLAY SETTINGS EXIT".split(""));
 *
 * // Later in the render loop
 * ctx.fillStyle = "#ffffff";
 * font.renderText("PLAY", 10, 10, ctx);
 * font.renderText("SETTINGS", 10, 20, ctx);
 * font.renderText("EXIT", 10, 30, ctx);
 * ```
 *
 * @example Performance comparison
 *
 * ```ts
 * import { FontBitmap, FontBitmapPrebuild } from "gamefoo";
 *
 * const fontStandard = new FontBitmap("5x5");
 * const fontPrebuild = new FontBitmapPrebuild("5x5");
 * fontPrebuild.prebuildGlyphs("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
 *
 * // In the render loop, measure time taken to render a string multiple times
 * console.time("Standard Bitmap");
 * for (let i = 0; i < 1000; i++) {
 *  fontStandard.renderText("HELLO WORLD", 10, 10, ctx);
 * }
 * console.timeEnd("Standard Bitmap");
 *
 * console.time("Prebuilt Bitmap");
 * for (let i = 0; i < 1000; i++) {
 *  fontPrebuild.renderText("HELLO WORLD", 10, 10, ctx);
 * }
 * console.timeEnd("Prebuilt Bitmap");
 * ```
 *
 * @remarks
 *
 * Pre-building glyphs can significantly improve rendering performance when
 * the same characters are rendered multiple times, as it avoids the overhead
 * of constructing `Path2D` objects on each render. However, it does increase
 * memory usage, especially if a large number of unique characters are pre-built.
 * Use this class when you have a known set of characters that will be rendered
 * frequently, such as in a game UI or static text elements.
 *
 * @see FontBitmap for a more memory-efficient alternative that builds paths on demand.
 *
 */
export default class FontBitmapPrebuild extends FontBitmap {
  /**
   * Map of pre-built `Path2D` objects for each character. Keys are characters,
   * values are their corresponding paths.
   * This cache is used to store pre-built paths for characters that have been
   * rendered at least once, allowing for faster rendering on subsequent calls.
   */
  private glyphPaths: Map<string, Path2D> = new Map();

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
   * Renders a single character at the given pixel position using a pre-built `Path2D` object.
   * If the character's path has not been pre-built, it will be built on demand and cached for future use.
   */
  override renderChar(char: string, x: number, y: number, ctx: CanvasRenderingContext2D) {
    let path = this.glyphPaths.get(char);
    if (path === undefined) {
      const built = this.buildGlyphPath(char);
      if (!built) return;
      path = built;
      this.glyphPaths.set(char, path);
    }

    ctx.translate(x, y);
    ctx.fill(path);
    ctx.translate(-x, -y);
  }
}
