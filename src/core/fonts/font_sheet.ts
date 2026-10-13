import Asset from '../asset';
import type { RenderContext } from '../renderer/type';
import type { TextFont } from './text_font';

/**
 * Maps every CP437 code (0–255) to its Unicode codepoint.
 *
 * The bundled `dungeon-437` sheet is laid out in code-page-437 order, so the
 * cell index alone does not identify a glyph: byte `0x92` is `’`, `0x10` is
 * `►`, and so on. This table lets the sheet resolve ordinary Unicode strings
 * (including the curly quotes and dashes used by the game's dialogs).
 *
 * @internal
 */
// prettier-ignore
const CP437: readonly number[] = [
  0x0000, 0x263a, 0x263b, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022,
  0x25d8, 0x25cb, 0x25d9, 0x2642, 0x2640, 0x266a, 0x266b, 0x263c,
  0x25ba, 0x25c4, 0x2195, 0x203c, 0x00b6, 0x00a7, 0x25ac, 0x21a8,
  0x2191, 0x2193, 0x2192, 0x2190, 0x221f, 0x2194, 0x25b2, 0x25bc,
  0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027,
  0x0028, 0x0029, 0x002a, 0x002b, 0x002c, 0x002d, 0x002e, 0x002f,
  0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
  0x0038, 0x0039, 0x003a, 0x003b, 0x003c, 0x003d, 0x003e, 0x003f,
  0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047,
  0x0048, 0x0049, 0x004a, 0x004b, 0x004c, 0x004d, 0x004e, 0x004f,
  0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057,
  0x0058, 0x0059, 0x005a, 0x005b, 0x005c, 0x005d, 0x005e, 0x005f,
  0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067,
  0x0068, 0x0069, 0x006a, 0x006b, 0x006c, 0x006d, 0x006e, 0x006f,
  0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
  0x0078, 0x0079, 0x007a, 0x007b, 0x007c, 0x007d, 0x007e, 0x2302,
  0x00c7, 0x00fc, 0x00e9, 0x00e2, 0x00e4, 0x00e0, 0x00e5, 0x00e7,
  0x00ea, 0x00eb, 0x00e8, 0x00ef, 0x00ee, 0x00ec, 0x00c4, 0x00c5,
  0x00c9, 0x00e6, 0x00c6, 0x00f4, 0x00f6, 0x00f2, 0x00fb, 0x00f9,
  0x00ff, 0x00d6, 0x00dc, 0x00a2, 0x00a3, 0x00a5, 0x20a7, 0x0192,
  0x00e1, 0x00ed, 0x00f3, 0x00fa, 0x00f1, 0x00d1, 0x00aa, 0x00ba,
  0x00bf, 0x2310, 0x00ac, 0x00bd, 0x00bc, 0x00a1, 0x00ab, 0x00bb,
  0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556,
  0x2555, 0x2563, 0x2551, 0x2557, 0x255d, 0x255c, 0x255b, 0x2510,
  0x2514, 0x2534, 0x252c, 0x251c, 0x2500, 0x253c, 0x255e, 0x255f,
  0x255a, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256c, 0x2567,
  0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256b,
  0x256a, 0x2518, 0x250c, 0x2588, 0x2584, 0x258c, 0x2590, 0x2580,
  0x03b1, 0x00df, 0x0393, 0x03c0, 0x03a3, 0x03c3, 0x00b5, 0x03c4,
  0x03a6, 0x0398, 0x03a9, 0x03b4, 0x221e, 0x03c6, 0x03b5, 0x2229,
  0x2261, 0x00b1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00f7, 0x2248,
  0x00b0, 0x2219, 0x00b7, 0x221a, 0x207f, 0x00b2, 0x25a0, 0x00a0,
];

/**
 * Characters that are not in CP437 but are common in UI, mapped onto the
 * closest glyph the sheet does provide.
 *
 * @internal
 */
const GLYPH_ALIASES: Readonly<Record<string, string>> = {
  '\u25b6': '\u25ba', // ▶ → ►
};

/**
 * Configuration for {@link FontSheet.load}.
 */
export interface FontSheetOptions {
  /** Columns of glyph cells in the sheet. @defaultValue `16` */
  columns?: number;
  /** Rows of glyph cells in the sheet. @defaultValue `16` */
  rows?: number;
  /** Width of one glyph cell in pixels. @defaultValue `8` */
  glyphWidth?: number;
  /** Height of one glyph cell in pixels. @defaultValue `8` */
  glyphHeight?: number;
  /**
   * CP437 code of the top-left cell. Bumps the whole mapping forward for
   * sheets that do not start at the code page origin. @defaultValue `0`
   */
  firstCode?: number;
  /** Extra pixels inserted between glyphs when rendering. @defaultValue `0` */
  spacing?: number;
  /**
   * Minimum colour distance (0–255) from the sheet's background for a pixel
   * to count as ink. Works for transparent-background sheets and for opaque
   * sheets whose glyphs sit on a solid colour (the background is sampled from
   * the top-left pixel). @defaultValue `128`
   */
  threshold?: number;
}

/**
 * Pixel-perfect bitmap font backed by a glyph-atlas image.
 *
 * `FontSheet` slices a fixed grid of equal cells out of an image and turns
 * each cell into a `Path2D`, so text can be filled in any colour at integer
 * scales with no anti-aliasing — ideal for pixel art that is later upscaled.
 *
 * The bundled `dungeon-437` sheet is a 16×16 grid of 8×8 cells ordered by
 * CP437, which this class decodes by default, so ordinary Unicode strings
 * (curly quotes, dashes, box-drawing, arrows) resolve to the right glyph.
 *
 * @category Fonts
 * @since 0.5.0
 *
 * @example Loading and drawing
 * ```ts
 * const font = await FontSheet.load('/assets/fonts/dungeon-437.png');
 * font.render(ctx, 'HELLO', 8, 8, '#ffd75f', 2);
 * const width = font.measure('HELLO', 2);
 * ```
 */
export default class FontSheet implements TextFont {
  /** Native glyph height in pixels at scale `1`. */
  readonly lineHeight: number;

  /** Native glyph cell width in pixels at scale `1`, excluding spacing. */
  readonly cellWidth: number;

  /** Extra pixels between glyphs, added to every advance. */
  private readonly spacing: number;

  /** Pre-built glyph outlines, keyed by Unicode character. */
  private readonly glyphs = new Map<string, Path2D>();

  private constructor(
    glyphs: Map<string, Path2D>,
    cellWidth: number,
    lineHeight: number,
    spacing: number,
  ) {
    this.glyphs = glyphs;
    this.cellWidth = cellWidth;
    this.lineHeight = lineHeight;
    this.spacing = spacing;
  }

  /**
   * Loads a glyph-atlas image and slices it into a ready-to-draw font.
   *
   * @param src     - URL/path of the atlas image (loaded via {@link Asset}).
   * @param options - Grid geometry and decode settings.
   * @returns A promise for the loaded font.
   *
   * @throws {Error} If the image cannot be loaded or has no 2-D context.
   */
  // oxlint-disable-next-line max-statements
  static async load(
    src: string,
    options: FontSheetOptions = {},
  ): Promise<FontSheet> {
    const image = await Asset.load(src);
    const columns = options.columns ?? 16;
    const rows = options.rows ?? 16;
    const glyphWidth = options.glyphWidth ?? 8;
    const glyphHeight = options.glyphHeight ?? 8;
    const firstCode = options.firstCode ?? 0;
    const spacing = options.spacing ?? 0;
    const threshold = options.threshold ?? 128;

    const scratch = document.createElement('canvas');
    scratch.width = image.width;
    scratch.height = image.height;
    const raw = scratch.getContext('2d');
    if (!raw) {
      throw new Error('FontSheet: failed to get a 2-D context for the atlas.');
    }
    raw.drawImage(image, 0, 0);
    const { data } = raw.getImageData(0, 0, image.width, image.height);

    // Sample the background from the top-left pixel. A pixel is ink when it
    // differs from that background by more than `threshold` in any channel —
    // this reads white-on-black (opaque) sheets and white-on-transparent
    // (alpha) sheets alike, where an alpha test alone would flood-fill the
    // opaque black backdrop and render every glyph as a solid block.
    const [bgR, bgG, bgB, bgA] = [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, data[3] ?? 0];

    const glyphs = new Map<string, Path2D>();
    const total = columns * rows;
    for (let code = 0; code < total; code++) {
      const col = code % columns;
      const row = Math.floor(code / columns);
      const gx = col * glyphWidth;
      const gy = row * glyphHeight;
      const path = new Path2D();
      for (let y = 0; y < glyphHeight; y++) {
        for (let x = 0; x < glyphWidth; x++) {
          const px = gx + x;
          const py = gy + y;
          if (px >= image.width || py >= image.height) {
            continue;
          }
          const i = (py * image.width + px) << 2;
          const distance = Math.max(
            Math.abs((data[i] ?? 0) - bgR),
            Math.abs((data[i + 1] ?? 0) - bgG),
            Math.abs((data[i + 2] ?? 0) - bgB),
            Math.abs((data[i + 3] ?? 0) - bgA),
          );
          if (distance >= threshold) {
            path.rect(x, y, 1, 1);
          }
        }
      }
      const mapped = CP437[(firstCode + code) & 0xff];
      if (mapped !== undefined && mapped !== 0) {
        glyphs.set(String.fromCodePoint(mapped), path);
      }
    }
    for (const [from, to] of Object.entries(GLYPH_ALIASES)) {
      const target = glyphs.get(to);
      if (target) {
        glyphs.set(from, target);
      }
    }

    return new FontSheet(glyphs, glyphWidth, glyphHeight, spacing);
  }

  /** Width in pixels of `text` rendered at integer `scale`. */
  measure(text: string, scale = 1): number {
    return text.length * (this.cellWidth + this.spacing) * scale;
  }

  /**
   * Draws `text` with its top-left corner at `(x, y)`.
   *
   * Glyphs without a matching cell are skipped (their advance is still
   * counted, so columns stay aligned).
   */
  // oxlint-disable-next-line max-params
  render(
    ctx: RenderContext,
    text: string,
    x: number,
    y: number,
    color: string,
    scale = 1,
  ): void {
    const raw = ctx.getCanvas?.();
    if (!raw) {
      return;
    }

    raw.save();
    raw.fillStyle = color;
    raw.translate(x, y);
    if (scale !== 1) {
      raw.scale(scale, scale);
    }
    // The translate below runs in scaled space, so cells advance by
    // (cellWidth + spacing) * scale automatically.
    for (const char of text) {
      const glyph = this.glyphs.get(char);
      if (glyph) {
        raw.fill(glyph);
      }
      raw.translate(this.cellWidth + this.spacing, 0);
    }
    raw.restore();
  }
}
