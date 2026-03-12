/**
 * Type definitions for the {@link IsometricProjection} utility.
 *
 * @category Grid
 * @module isometric_types
 * @since 0.4.0
 */

import type { Vector2 } from "../../generic_types";

/**
 * Layout mode for isometric tile placement.
 *
 * - `"diamond"` — tiles form a rotated square (default, most common).
 * - `"staggered"` — tiles are placed in offset rows, like a brick wall.
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const layout: IsoLayout = "diamond";
 * ```
 */
export type IsoLayout = "diamond" | "staggered";

/**
 * Configuration for constructing an {@link IsometricProjection}.
 *
 * The `tileWidth / tileHeight` ratio controls the perceived camera angle:
 *
 * | Ratio   | tileWidth | tileHeight | Feel                           |
 * | ------- | --------- | ---------- | ------------------------------ |
 * | 4:1     | 64        | 16         | Very flat, almost top-down     |
 * | 2:1     | 64        | 32         | **Classic isometric**          |
 * | 1.33:1  | 64        | 48         | Steep / aggressive — more "3D" |
 * | 1:1     | 64        | 64         | 45-degree diamond (extreme)    |
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example Classic 2:1 isometric
 * ```ts
 * const config: IsoConfig = {
 *   tileWidth: 64,
 *   tileHeight: 32,
 * };
 * ```
 *
 * @example Steep perspective with centering offset
 * ```ts
 * const config: IsoConfig = {
 *   tileWidth: 64,
 *   tileHeight: 48,
 *   origin: { x: 400, y: 50 },
 *   layout: "diamond",
 * };
 * ```
 */
export interface IsoConfig {
  /** Full width of an isometric tile in pixels. */
  tileWidth: number;
  /** Full height of an isometric tile in pixels. */
  tileHeight: number;
  /**
   * Screen-space offset applied to all projected coordinates.
   * Useful for centering the map on the canvas.
   *
   * @defaultValue `{ x: 0, y: 0 }`
   */
  origin?: Vector2;
  /**
   * Tile layout mode.
   *
   * @defaultValue `"diamond"`
   */
  layout?: IsoLayout;
}

/**
 * A range of grid cells visible within a viewport rectangle.
 *
 * Returned by {@link IsometricProjection.getVisibleRange} for
 * frustum culling during rendering.
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const range: VisibleRange = {
 *   minCol: 0, maxCol: 15,
 *   minRow: 0, maxRow: 15,
 * };
 *
 * for (let r = range.minRow; r <= range.maxRow; r++) {
 *   for (let c = range.minCol; c <= range.maxCol; c++) {
 *     // render tile at (c, r)
 *   }
 * }
 * ```
 */
export interface VisibleRange {
  minCol: number;
  maxCol: number;
  minRow: number;
  maxRow: number;
}
