/**
 * Type definitions for the {@link GridDebugSystem}.
 *
 * @category Debug
 * @module grid_debug_types
 * @since 0.4.0
 */

import type { Grid } from '../core/grid/grid';
import type { IsometricProjection } from '../core/grid/isometric';
import type World from '../core/world';

/**
 * Configuration for the {@link GridDebugSystem} subsystem.
 *
 * Toggle individual debug overlays via boolean flags. All overlays
 * default to `false` (disabled).
 *
 * @category Debug
 * @since 0.4.0
 *
 * @example Enable all overlays
 * ```ts
 * const config: GridDebugConfig = {
 *   grid: myGrid,
 *   projection: isoProjection,
 *   world: collisionWorld,
 *   showGrid: true,
 *   showCoordinates: true,
 *   showWorldCoordinates: true,
 *   showCollisionBounds: true,
 *   showPathfinding: true,
 *   showTileInspector: true,
 * };
 * ```
 *
 * @example Minimal — grid lines only
 * ```ts
 * const config: GridDebugConfig = {
 *   grid: myGrid,
 *   showGrid: true,
 * };
 * ```
 */
export interface GridDebugConfig {
  /**
   * The grid to visualise.
   */
  grid: Grid;

  /**
   * The canvas element to attach mouse event listeners to.
   *
   * Required for {@link GridDebugConfig.showTileInspector} and
   * {@link GridDebugConfig.showWorldCoordinates} to respond to mouse
   * movement. When omitted, `GridDebugSystem` falls back to
   * `document.querySelector("canvas")` (browser-only).
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const debug = new GridDebugSystem({
   *   grid: myGrid,
   *   canvas: document.getElementById("game") as HTMLCanvasElement,
   *   showTileInspector: true,
   * });
   * ```
   */
  canvas?: HTMLCanvasElement;

  /**
   * Isometric projection. When provided, the debug overlay renders
   * diamond outlines instead of rectangular grid lines.
   */
  projection?: IsometricProjection;

  /**
   * Collision world reference. Required for
   * {@link GridDebugConfig.showCollisionBounds}.
   */
  world?: World;

  /**
   * Draw grid lines (orthogonal) or tile diamond outlines (isometric).
   *
   * @defaultValue `false`
   */
  showGrid?: boolean;

  /**
   * Show `(col, row)` text in each visible cell.
   *
   * @defaultValue `false`
   */
  showCoordinates?: boolean;

  /**
   * Show world-space and grid-space coordinates at a fixed screen
   * position tracking the cursor.
   *
   * @defaultValue `false`
   */
  showWorldCoordinates?: boolean;

  /**
   * Render collision bounds (AABB rectangles / circles) for all
   * active colliders. Requires {@link GridDebugConfig.world}.
   *
   * @defaultValue `false`
   */
  showCollisionBounds?: boolean;

  /**
   * Visualise the most recently set pathfinding result as a green
   * line connecting cell centres.
   *
   * @defaultValue `false`
   */
  showPathfinding?: boolean;

  /**
   * Highlight the tile under the cursor and show a tooltip with
   * tile ID, coordinates, and walkability.
   *
   * @defaultValue `false`
   */
  showTileInspector?: boolean;

  /**
   * Colour for grid lines / diamond outlines.
   *
   * @defaultValue `"rgba(255,255,0,0.3)"`
   */
  gridColor?: string;

  /**
   * Colour for the pathfinding overlay line.
   *
   * @defaultValue `"rgba(0,255,0,0.8)"`
   */
  pathColor?: string;

  /**
   * Colour for collision bound outlines.
   *
   * @defaultValue `"rgba(255,0,0,0.5)"`
   */
  collisionColor?: string;

  /**
   * Font size in pixels for text overlays.
   *
   * @defaultValue `8`
   */
  fontSize?: number;
}
