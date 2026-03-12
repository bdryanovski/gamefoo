/**
 * A single layer of tile data within a {@link TileMap}.
 *
 * Each `TileLayer` holds a flat, row-major array of tile IDs and a
 * reference to a {@link TileSet} that maps those IDs to sprite frames.
 * Rendering is handled per-tile with viewport culling so only visible
 * tiles are drawn.
 *
 * Layers support opacity, visibility toggling, and pixel offsets for
 * parallax effects.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example Create a ground layer
 * ```ts
 * import { TileLayer, TileSet } from "gamefoo";
 *
 * const layer = new TileLayer({
 *   name: "ground",
 *   cols: 32,
 *   rows: 32,
 *   tileSet: myTileSet,
 *   data: groundData,  // number[] of length 32*32
 * });
 *
 * layer.setTile(5, 3, 2); // change tile at col=5, row=3 to ID 2
 * ```
 *
 * @see {@link TileSet} — maps tile IDs to sprite frames
 * @see {@link TileMap} — owns and renders multiple layers
 */
import type { IsometricProjection } from "../grid/isometric";
import type { TileSet } from "./tileset";
import type { TileLayerConfig } from "./tilemap_types";
import type { VisibleRange } from "../grid/isometric_types";

export class TileLayer {
  /** Human-readable name of this layer. */
  readonly name: string;

  /** Number of tile columns. */
  readonly cols: number;

  /** Number of tile rows. */
  readonly rows: number;

  /** The tileset used to resolve tile IDs to sprite frames. */
  tileSet: TileSet;

  /** Whether this layer is rendered. */
  visible: boolean;

  /** Layer opacity in `[0, 1]`. */
  opacity: number;

  /** Horizontal pixel offset (parallax). */
  offsetX: number;

  /** Vertical pixel offset (parallax). */
  offsetY: number;

  /** Flat row-major tile data. `-1` means empty. */
  private data: number[];

  /**
   * Creates a new tile layer.
   *
   * @param config - Layer dimensions, tileset reference, and tile data.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const layer = new TileLayer({
   *   name: "ground",
   *   cols: 16,
   *   rows: 16,
   *   tileSet: myTileSet,
   *   data: new Array(16 * 16).fill(0),
   * });
   * ```
   */
  constructor(config: TileLayerConfig) {
    this.name = config.name;
    this.cols = config.cols;
    this.rows = config.rows;
    this.tileSet = config.tileSet;
    this.data = config.data;
    this.visible = config.visible ?? true;
    this.opacity = config.opacity ?? 1;
    this.offsetX = config.offsetX ?? 0;
    this.offsetY = config.offsetY ?? 0;
  }

  /**
   * Returns the tile ID at the given grid position.
   *
   * @param col - Column index.
   * @param row - Row index.
   * @returns Tile ID, or `-1` if out of bounds.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const id = layer.getTile(5, 3);
   * if (id !== -1) {
   *   console.log("Tile ID:", id);
   * }
   * ```
   */
  getTile(col: number, row: number): number {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return -1;
    return this.data[row * this.cols + col] ?? -1;
  }

  /**
   * Sets the tile ID at the given grid position.
   *
   * Does nothing if the coordinates are out of bounds.
   *
   * @param col    - Column index.
   * @param row    - Row index.
   * @param tileId - New tile ID to write.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * layer.setTile(5, 3, 2); // place grass tile
   * layer.setTile(5, 4, -1); // clear tile
   * ```
   */
  setTile(col: number, row: number, tileId: number): void {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    this.data[row * this.cols + col] = tileId;
  }

  /**
   * Renders visible tiles in **orthogonal** (top-down) mode.
   *
   * Only tiles within the viewport rectangle are drawn. Each tile is
   * rendered at its world position calculated from column/row times
   * cell dimensions.
   *
   * @param ctx       - Canvas 2D rendering context.
   * @param cellWidth - Width of a single cell in pixels.
   * @param cellHeight - Height of a single cell in pixels.
   * @param viewport  - Visible viewport rectangle in world-space.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * layer.renderOrthogonal(ctx, 32, 32, camera.getViewRect());
   * ```
   */
  renderOrthogonal(
    ctx: CanvasRenderingContext2D,
    cellWidth: number,
    cellHeight: number,
    viewport: { x: number; y: number; width: number; height: number },
  ): void {
    if (!this.visible) return;

    const startCol = Math.max(0, Math.floor(viewport.x / cellWidth) - 1);
    const startRow = Math.max(0, Math.floor(viewport.y / cellHeight) - 1);
    const endCol = Math.min(this.cols - 1, Math.ceil((viewport.x + viewport.width) / cellWidth) + 1);
    const endRow = Math.min(this.rows - 1, Math.ceil((viewport.y + viewport.height) / cellHeight) + 1);

    const prevAlpha = ctx.globalAlpha;
    if (this.opacity < 1) ctx.globalAlpha = this.opacity;

    const img = this.tileSet.sprite.image;
    const ox = this.offsetX;
    const oy = this.offsetY;
    const dataCols = this.cols;

    for (let row = startRow; row <= endRow; row++) {
      const rowOffset = row * dataCols;
      for (let col = startCol; col <= endCol; col++) {
        const tileId = this.data[rowOffset + col] ?? -1;
        if (tileId < 0) continue;

        const frame = this.tileSet.getFrame(tileId);
        if (!frame) continue;

        ctx.drawImage(
          img,
          frame.x, frame.y, frame.width, frame.height,
          Math.round(col * cellWidth + ox), Math.round(row * cellHeight + oy),
          cellWidth, cellHeight,
        );
      }
    }

    if (this.opacity < 1) ctx.globalAlpha = prevAlpha;
  }

  /**
   * Renders visible tiles in **isometric** mode using the given
   * projection for coordinate conversion.
   *
   * Tiles are rendered back-to-front (painters algorithm) by
   * iterating rows from low to high, then columns from low to high.
   *
   * @param ctx        - Canvas 2D rendering context.
   * @param projection - Isometric projection for grid → screen conversion.
   * @param viewport   - Visible viewport rectangle in screen-space.
   * @param gridCols   - Total columns in the grid (for culling).
   * @param gridRows   - Total rows in the grid (for culling).
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * layer.renderIsometric(ctx, projection, camera.getViewRect(), 32, 32);
   * ```
   */
  renderIsometric(
    ctx: CanvasRenderingContext2D,
    projection: IsometricProjection,
    viewport: { x: number; y: number; width: number; height: number },
    gridCols: number,
    gridRows: number,
  ): void {
    if (!this.visible) return;

    const range = projection.getVisibleRange(
      viewport.x, viewport.y, viewport.width, viewport.height,
      gridCols, gridRows,
    );

    const prevAlpha = ctx.globalAlpha;
    if (this.opacity < 1) ctx.globalAlpha = this.opacity;

    const img = this.tileSet.sprite.image;
    const tw = projection.tileWidth;
    const th = projection.tileHeight;
    const ox = this.offsetX;
    const oy = this.offsetY;

    for (let row = range.minRow; row <= range.maxRow; row++) {
      for (let col = range.minCol; col <= range.maxCol; col++) {
        const tileId = this.data[row * this.cols + col] ?? -1;
        if (tileId < 0) continue;

        const frame = this.tileSet.getFrame(tileId);
        if (!frame) continue;

        const pos = projection.gridToScreenFast(col, row);

        ctx.drawImage(
          img,
          frame.x, frame.y, frame.width, frame.height,
          Math.round(pos.x + ox), Math.round(pos.y + oy),
          tw, th,
        );
      }
    }

    if (this.opacity < 1) ctx.globalAlpha = prevAlpha;
  }
}
