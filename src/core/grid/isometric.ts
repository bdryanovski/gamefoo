/**
 * Stateless isometric projection utility.
 *
 * Converts between grid coordinates `(col, row)` and screen-space pixel
 * positions using a configurable tile width/height ratio. The ratio
 * controls the perceived camera angle:
 *
 * - **2:1** (tileWidth=64, tileHeight=32) — classic isometric.
 * - **1.33:1** (64 × 48) — steep / aggressive, more "3D" feel.
 * - **4:1** (64 × 16) — very flat, almost top-down.
 *
 * Supports both **diamond** (rotated square) and **staggered** (offset
 * rows) layouts via the {@link IsoConfig.layout} option.
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example Classic 2:1 diamond projection
 * ```ts
 * import { IsometricProjection } from "gamefoo";
 *
 * const iso = new IsometricProjection({
 *   tileWidth: 64,
 *   tileHeight: 32,
 * });
 *
 * const screen = iso.gridToScreen(3, 2);
 * // screen → { x: 32, y: 80 }
 *
 * const cell = iso.screenToGrid(screen.x, screen.y);
 * // cell → { col: 3, row: 2 }
 * ```
 *
 * @example Steep projection centred on canvas
 * ```ts
 * const iso = new IsometricProjection({
 *   tileWidth: 64,
 *   tileHeight: 48,
 *   origin: { x: 400, y: 50 },
 * });
 * ```
 *
 * @see {@link Grid}       — the underlying data structure
 * @see {@link TileMap}    — renders tiles using a projection
 * @see {@link Pathfinder} — navigates the grid
 */
import type { Vector2 } from '../../generic_types';
import type { IsoConfig, IsoLayout, VisibleRange } from './isometric_types';

export class IsometricProjection {
  /**
   * Full width of an isometric tile in pixels.
   */
  readonly tileWidth: number;

  /**
   * Full height of an isometric tile in pixels.
   */
  readonly tileHeight: number;

  /**
   * Screen-space offset applied to all projected coordinates.
   */
  readonly origin: Vector2;

  /**
   * Layout mode: `"diamond"` or `"staggered"`.
   */
  readonly layout: IsoLayout;

  /**
   * Half-tile width, cached for performance.
   */
  private readonly hw: number;

  /**
   * Half-tile height, cached for performance.
   */
  private readonly hh: number;

  /**
   * Reusable output object for gridToScreen to reduce allocations.
   */
  private readonly _screenOut: Vector2 = { x: 0, y: 0 };

  /**
   * Reusable output object for screenToGrid to reduce allocations.
   */
  private readonly _gridOut: { col: number; row: number } = { col: 0, row: 0 };

  /**
   * Creates a new isometric projection.
   *
   * @param config - Tile dimensions, origin offset, and layout mode.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const iso = new IsometricProjection({
   *   tileWidth: 64,
   *   tileHeight: 32,
   *   origin: { x: 256, y: 32 },
   *   layout: "diamond",
   * });
   * ```
   */
  constructor(config: IsoConfig) {
    this.tileWidth = config.tileWidth;
    this.tileHeight = config.tileHeight;
    this.origin = config.origin ?? { x: 0, y: 0 };
    this.layout = config.layout ?? 'diamond';
    this.hw = this.tileWidth / 2;
    this.hh = this.tileHeight / 2;
  }

  // ── Grid ↔ Screen conversion ─────────────────────────────────────

  /**
   * Converts grid coordinates to screen-space pixel position.
   *
   * For **diamond** layout the returned point is the **top vertex** of
   * the tile diamond. For **staggered** layout it is the top-left
   * corner of the tile rectangle.
   *
   * @param col - Grid column index.
   * @param row - Grid row index.
   * @returns Screen-space pixel position.
   *
   * @since 0.4.0
   *
   * @example Diamond layout
   * ```ts
   * const pos = iso.gridToScreen(2, 3);
   * // Classic 2:1 (64×32): { x: origin.x + (2-3)*32, y: origin.y + (2+3)*16 }
   * ```
   *
   * @example Staggered layout
   * ```ts
   * const iso = new IsometricProjection({
   *   tileWidth: 64, tileHeight: 32, layout: "staggered",
   * });
   * const pos = iso.gridToScreen(2, 3);
   * // Odd row offset by half a tile width
   * ```
   */
  gridToScreen(col: number, row: number): Vector2 {
    if (this.layout === 'staggered') {
      return this.gridToScreenStaggered(col, row);
    }
    return this.gridToScreenDiamond(col, row);
  }

  /**
   * Converts a screen-space pixel position back to grid coordinates.
   *
   * The returned column and row are **floored** to the nearest cell.
   * Results may be out of grid bounds — use
   * {@link Grid.isInBounds} to validate.
   *
   * @param screenX - Screen-space X coordinate.
   * @param screenY - Screen-space Y coordinate.
   * @returns Grid column and row as integers.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const { col, row } = iso.screenToGrid(mouseX, mouseY);
   * if (grid.isInBounds(col, row)) {
   *   console.log("Hovered cell:", col, row);
   * }
   * ```
   */
  screenToGrid(screenX: number, screenY: number): { col: number; row: number } {
    if (this.layout === 'staggered') {
      return this.screenToGridStaggered(screenX, screenY);
    }
    return this.screenToGridDiamond(screenX, screenY);
  }

  /**
   * Allocation-free variant of {@link gridToScreen}. Writes into a
   * shared internal object and returns it. **Do not cache** the
   * returned reference — it is overwritten on the next call.
   *
   * Ideal for tight render loops where thousands of calls per frame
   * would otherwise create garbage.
   *
   * @param col - Grid column index.
   * @param row - Grid row index.
   * @returns Shared mutable `{ x, y }` — use immediately.
   *
   * @since 0.4.0
   */
  gridToScreenFast(col: number, row: number): Vector2 {
    if (this.layout === 'staggered') {
      const offsetX = row % 2 === 1 ? this.hw : 0;
      this._screenOut.x = this.origin.x + col * this.tileWidth + offsetX;
      this._screenOut.y = this.origin.y + row * this.hh;
    } else {
      this._screenOut.x = this.origin.x + (col - row) * this.hw;
      this._screenOut.y = this.origin.y + (col + row) * this.hh;
    }
    return this._screenOut;
  }

  /**
   * Allocation-free variant of {@link screenToGrid}. Writes into a
   * shared internal object and returns it. **Do not cache** the
   * returned reference.
   *
   * @param screenX - Screen-space X coordinate.
   * @param screenY - Screen-space Y coordinate.
   * @returns Shared mutable `{ col, row }` — use immediately.
   *
   * @since 0.4.0
   */
  screenToGridFast(screenX: number, screenY: number): { col: number; row: number } {
    if (this.layout === 'staggered') {
      const sx = screenX - this.origin.x;
      const sy = screenY - this.origin.y;
      const roughRow = Math.floor(sy / this.hh);
      const offsetX = roughRow % 2 === 1 ? this.hw : 0;
      this._gridOut.col = Math.floor((sx - offsetX) / this.tileWidth);
      this._gridOut.row = roughRow;
    } else {
      const sx = screenX - this.origin.x;
      const sy = screenY - this.origin.y;
      this._gridOut.col = Math.floor((sx / this.hw + sy / this.hh) / 2);
      this._gridOut.row = Math.floor((sy / this.hh - sx / this.hw) / 2);
    }
    return this._gridOut;
  }

  /**
   * Snaps a screen-space position to the nearest grid cell center.
   *
   * Equivalent to `screenToGrid` followed by `gridToScreen`, which
   * effectively rounds to the closest tile.
   *
   * @param screenX - Screen-space X coordinate.
   * @param screenY - Screen-space Y coordinate.
   * @returns The grid cell that the point falls within.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const snapped = iso.snapToGrid(mouseX, mouseY);
   * // Place a building at the snapped cell
   * building.moveTo(snapped.col, snapped.row);
   * ```
   */
  snapToGrid(screenX: number, screenY: number): { col: number; row: number } {
    return this.screenToGrid(screenX, screenY);
  }

  // ── Tile geometry ─────────────────────────────────────────────────

  /**
   * Returns the four corner vertices of a tile diamond at the given
   * grid position. Useful for debug rendering and hit-testing.
   *
   * Vertices are ordered: **top**, **right**, **bottom**, **left**
   * (clockwise from the top).
   *
   * @param col - Grid column index.
   * @param row - Grid row index.
   * @returns Array of 4 screen-space points forming the diamond.
   *
   * @since 0.4.0
   *
   * @example Draw a tile outline
   * ```ts
   * const [top, right, bottom, left] = iso.getTileDiamond(3, 2);
   *
   * ctx.beginPath();
   * ctx.moveTo(top.x, top.y);
   * ctx.lineTo(right.x, right.y);
   * ctx.lineTo(bottom.x, bottom.y);
   * ctx.lineTo(left.x, left.y);
   * ctx.closePath();
   * ctx.stroke();
   * ```
   */
  getTileDiamond(col: number, row: number): [Vector2, Vector2, Vector2, Vector2] {
    const center = this.gridToScreenDiamond(col, row);
    const cx = center.x + this.hw;
    const cy = center.y + this.hh;

    return [
      { x: cx, y: cy - this.hh }, // top
      { x: cx + this.hw, y: cy }, // right
      { x: cx, y: cy + this.hh }, // bottom
      { x: cx - this.hw, y: cy }, // left
    ];
  }

  // ── Viewport culling ──────────────────────────────────────────────

  /**
   * Computes the range of grid cells that are potentially visible
   * within a viewport rectangle.
   *
   * The returned range is conservatively padded by one tile in every
   * direction to avoid popping at the edges.
   *
   * @param viewX - Left edge of the viewport in screen-space.
   * @param viewY - Top edge of the viewport in screen-space.
   * @param viewW - Width of the viewport in pixels.
   * @param viewH - Height of the viewport in pixels.
   * @param gridCols - Total columns in the grid (used for clamping).
   * @param gridRows - Total rows in the grid (used for clamping).
   * @returns A {@link VisibleRange} with min/max column and row.
   *
   * @since 0.4.0
   *
   * @example Render only visible tiles
   * ```ts
   * const view = camera.getViewRect();
   * const range = iso.getVisibleRange(
   *   view.x, view.y, view.width, view.height,
   *   grid.cols, grid.rows,
   * );
   *
   * for (let row = range.minRow; row <= range.maxRow; row += 1) {
   *   for (let col = range.minCol; col <= range.maxCol; col += 1) {
   *     renderTile(col, row);
   *   }
   * }
   * ```
   */
  getVisibleRange(
    viewX: number,
    viewY: number,
    viewW: number,
    viewH: number,
    gridCols: number,
    gridRows: number,
  ): VisibleRange {
    const pad = 2;

    const topLeft = this.screenToGrid(viewX, viewY);
    const topRight = this.screenToGrid(viewX + viewW, viewY);
    const bottomLeft = this.screenToGrid(viewX, viewY + viewH);
    const bottomRight = this.screenToGrid(viewX + viewW, viewY + viewH);

    const minCol = Math.max(0, Math.min(topLeft.col, bottomLeft.col) - pad);
    const maxCol = Math.min(gridCols - 1, Math.max(topRight.col, bottomRight.col) + pad);
    const minRow = Math.max(0, Math.min(topLeft.row, topRight.row) - pad);
    const maxRow = Math.min(gridRows - 1, Math.max(bottomLeft.row, bottomRight.row) + pad);

    return { minCol, maxCol, minRow, maxRow };
  }

  // ── Private: Diamond layout ───────────────────────────────────────

  /**
   * Diamond layout: grid → screen.
   *
   * ```
   * screenX = origin.x + (col - row) * (tileWidth / 2)
   * screenY = origin.y + (col + row) * (tileHeight / 2)
   * ```
   *
   * @internal
   */
  private gridToScreenDiamond(col: number, row: number): Vector2 {
    return {
      x: this.origin.x + (col - row) * this.hw,
      y: this.origin.y + (col + row) * this.hh,
    };
  }

  /**
   * Diamond layout: screen → grid (inverse of gridToScreenDiamond).
   *
   * ```
   * col = floor((sx / halfW + sy / halfH) / 2)
   * row = floor((sy / halfH - sx / halfW) / 2)
   * ```
   *
   * @internal
   */
  private screenToGridDiamond(screenX: number, screenY: number): { col: number; row: number } {
    const sx = screenX - this.origin.x;
    const sy = screenY - this.origin.y;
    return {
      col: Math.floor((sx / this.hw + sy / this.hh) / 2),
      row: Math.floor((sy / this.hh - sx / this.hw) / 2),
    };
  }

  // ── Private: Staggered layout ─────────────────────────────────────

  /**
   * Staggered layout: grid → screen.
   *
   * Odd rows are offset by half a tile width.
   *
   * @internal
   */
  private gridToScreenStaggered(col: number, row: number): Vector2 {
    const offsetX = row % 2 === 1 ? this.hw : 0;
    return {
      x: this.origin.x + col * this.tileWidth + offsetX,
      y: this.origin.y + row * this.hh,
    };
  }

  /**
   * Staggered layout: screen → grid.
   *
   * @internal
   */
  private screenToGridStaggered(screenX: number, screenY: number): { col: number; row: number } {
    const sx = screenX - this.origin.x;
    const sy = screenY - this.origin.y;

    const roughRow = Math.floor(sy / this.hh);
    const offsetX = roughRow % 2 === 1 ? this.hw : 0;
    const roughCol = Math.floor((sx - offsetX) / this.tileWidth);

    return { col: roughCol, row: roughRow };
  }
}
