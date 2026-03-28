import { metadata as ICON_8x8_METADATA } from "../icons/internal/icons_8x8";
import { metadata as ICON_16x16_METADATA } from "../icons/internal/icons_16x16";
import type { RenderContext } from "../renderer/type";

// import { metadata as ICON_32x32_METADATA } from "../icons/internal/icons_32x32";

/**
 * Internal catalogue of registered bitmap icons definitions.
 *
 * Icons are added at module load time. Currently ships with the
 *
 * @internal
 */
const Catalog = new Map<
  string,
  {
    name: string;
    width: number;
    height: number;
    keys: string[];
    spacing: number;
    data: Record<string, number[]>;
  }
>();

Catalog.set(ICON_8x8_METADATA.name, ICON_8x8_METADATA);
Catalog.set(ICON_16x16_METADATA.name, ICON_16x16_METADATA);
// Catalog.set(ICON_32x32_METADATA.name, ICON_32x32_METADATA);

export type InternalBitmapIconName = "icons_8x8" | "icons_16x16";

/**
 * Pixel-perfect bitmap icons set
 *
 * @category Icons
 * @since 0.4.0
 *
 * @example Rendering icon with the built-in icons_8x8
 * ```ts
 * import { IconBitmap } from "gamefoo";
 *
 * const Icon = new IconBitmap("icons_8x8");
 *
 * ctx.fillStyle = "#ffffff";
 * Icon.renderIcon("heart", 10, 10, ctx);
 * ```
 *
 */
export default class IconBitmap {
  /** The catalogue icon name. */
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
   * @param name - The catalogue key (e.g. `"icon_8x8"`).
   *
   * @throws Error if the name is not icon set in the catalogue.
   *
   * @example
   * ```ts
   * const icon = new IconBitmap("icon_8x8");
   * ```
   */
  constructor(name: InternalBitmapIconName) {
    this.name = name;

    this.data = {};

    if (Catalog.has(name)) {
      this.data = Catalog.get(name)!.data;
    } else {
      throw new Error(`IconBitmap: No font found for name "${name}".`);
    }

    this.width = this.metadata?.width || 0;
    this.height = this.metadata?.height || 0;
    this.spacing = this.metadata?.spacing || 0;
  }

  /**
   * Returns the raw catalogue entry for this icon set, or `null` if the icons are not found
   *
   * @returns Icon metadata object or `null`.
   */
  get metadata() {
    return Catalog.get(this.name) || null;
  }

  /**
   * Retrieves the bitmask rows for a single character.
   *
   * @param char - A single character string (e.g. `"A"`).
   * @returns An array of row bitmasks, or `null` if the character is
   *   not defined in this icon.
   *
   * @example
   * ```ts
   * const rows = font.getIcon("heart");
   * ```
   */
  getIconBitmask(icon: string): number[] | null {
    return this.data[icon] || null;
  }

  /**
   * Computes the pixel width required to render the given text string.
   *
   * @param text - The string to measure.
   * @returns Width in pixels (`text.length * cellWidth`).
   *
   * @example
   * ```ts
   * const w = font.getTextWidth("heart");
   * ```
   */
  getTextWidth(): number {
    return this.width;
  }

  /**
   * Renders a single icon at the given pixel position.
   *
   * Each set bit in the character's row bitmask produces a 1x1
   * `fillRect` call using the context's current `fillStyle`.
   *
   * @param icon - The character to draw.
   * @param x    - Left edge X coordinate in canvas pixels.
   * @param y    - Top edge Y coordinate in canvas pixels.
   * @param ctx  - The 2-D rendering context to draw into.
   *
   * @example
   * ```ts
   * ctx.fillStyle = "#00ff00";
   * font.renderChar("heart", 20, 40, ctx);
   * ```
   */
  renderIcon(icon: string, x: number, y: number, ctx: RenderContext) {
    const charData = this.getIconBitmask(icon);
    if (charData === null) {
      return;
    }
    // Icon rendering is pixel-by-pixel; only meaningful on canvas contexts
    const canvasCtx = ctx.getCanvas?.();
    if (!canvasCtx) return;
    for (let row = 0; row < charData.length; row++) {
      const bits = charData[row]!;
      for (let col = 0; col < this.width - this.spacing; col++) {
        if ((bits & (1 << (this.width - this.spacing - 1 - col))) !== 0) {
          canvasCtx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }
}
