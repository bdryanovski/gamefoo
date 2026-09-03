/**
 * Abstract base class for pixel-perfect bitmap data renderers.
 *
 * Handles the shared catalog lookup, field assignment, and metadata
 * accessor used by both {@link FontBitmap} and {@link IconBitmap}.
 *
 * @category Core
 * @since 0.4.0
 */

/**
 * Catalog entry shape shared by fonts and icon sets. @internal
 */
export interface BitmapCatalogEntry {
  name: string;
  width: number;
  height: number;
  spacing: number;
  data: Record<string, number[]>;
}

export abstract class BitmapDataRenderer {
  /**
   * The catalogue name of the loaded resource.
   */
  public readonly name: string;

  /**
   * Bitmask data keyed by character / icon name.
   *
   * Each value is an array of integers where each integer represents
   * one row of pixels (MSB = leftmost pixel).
   */
  protected readonly data: Record<string, number[]>;

  /**
   * Cell width in pixels (including spacing).
   *
   * @defaultValue `0` (populated from catalogue on construction)
   */
  public width: number = 0;

  /**
   * Cell height in pixels.
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
   * Looks up `name` in the provided catalog, throws if not found, and
   * populates `width`, `height`, and `spacing` from the entry.
   *
   * @param name    - Catalog key to look up.
   * @param catalog - The registry map to search.
   * @param kind    - Human-readable label used in the error message.
   */
  constructor(name: string, catalog: Map<string, BitmapCatalogEntry>, kind: string) {
    this.name = name;
    const entry = catalog.get(name);
    if (!entry) {
      throw new Error(`${kind}: No entry found for name "${name}".`);
    }
    this.data = entry.data;
    this.width = entry.width;
    this.height = entry.height;
    this.spacing = entry.spacing;
  }
}
