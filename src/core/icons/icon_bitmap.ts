import { metadata as ICON_8x8_METADATA } from '../icons/internal/icons_8x8';
import { metadata as ICON_16x16_METADATA } from '../icons/internal/icons_16x16';
import type { RenderContext } from '../renderer/type';
import type { BitmapCatalogEntry } from '../shared/bitmap_data_renderer';
import { BitmapDataRenderer } from '../shared/bitmap_data_renderer';

/**
 * Internal catalogue of registered bitmap icon definitions.
 *
 * @internal
 */
const Catalog = new Map<string, BitmapCatalogEntry>();

Catalog.set(ICON_8x8_METADATA.name, ICON_8x8_METADATA);
Catalog.set(ICON_16x16_METADATA.name, ICON_16x16_METADATA);

export type InternalBitmapIconName = 'icons_8x8' | 'icons_16x16';

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
export default class IconBitmap extends BitmapDataRenderer {
  /**
   * Creates an icon renderer for the named catalogue entry.
   *
   * @param name - The catalogue key (e.g. `"icons_8x8"`).
   * @throws Error if the name is not found in the catalogue.
   *
   * @example
   * ```ts
   * const icon = new IconBitmap("icons_8x8");
   * ```
   */
  constructor(name: InternalBitmapIconName) {
    super(name, Catalog, 'IconBitmap');
  }

  /**
   * Returns the raw catalogue entry for this icon set, or `null` if not found.
   *
   * @returns Icon metadata object or `null`.
   */
  get metadata() {
    return Catalog.get(this.name) || null;
  }

  /**
   * Retrieves the bitmask rows for a single icon.
   *
   * @param icon - Icon name (e.g. `"heart"`).
   * @returns An array of row bitmasks, or `null` if not found.
   *
   * @example
   * ```ts
   * const rows = icon.getIconBitmask("heart");
   * ```
   */
  getIconBitmask(icon: string): number[] | null {
    return this.data[icon] || null;
  }

  /**
   * Returns the width of a single icon cell.
   */
  getTextWidth(): number {
    return this.width;
  }

  /**
   * Renders a single icon at the given pixel position.
   *
   * Each set bit in the icon's row bitmask produces a 1x1
   * `fillRect` call using the context's current `fillStyle`.
   *
   * @param icon - The icon name to draw.
   * @param x    - Left edge X coordinate in canvas pixels.
   * @param y    - Top edge Y coordinate in canvas pixels.
   * @param ctx  - The 2-D rendering context to draw into.
   *
   * @example
   * ```ts
   * ctx.fillStyle = "#00ff00";
   * icon.renderIcon("heart", 20, 40, ctx);
   * ```
   */
  renderIcon(icon: string, x: number, y: number, ctx: RenderContext) {
    const charData = this.getIconBitmask(icon);
    if (charData === null) {
      return;
    }
    // Icon rendering is pixel-by-pixel; only meaningful on canvas contexts
    const canvasCtx = ctx.getCanvas?.();
    if (!canvasCtx) {
      return;
    }
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
