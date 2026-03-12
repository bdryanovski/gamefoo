/**
 * Type definitions for the {@link Grid} system.
 *
 * These types define the data structures used by both orthogonal and
 * isometric grid layouts. They are intentionally projection-agnostic —
 * the grid stores spatial data while projection utilities handle
 * screen-space conversion.
 *
 * @category Grid
 * @module grid_types
 * @since 0.4.0
 */

import type { Vector2 } from "../../generic_types";

/**
 * A single cell within a {@link Grid}.
 *
 * Each cell knows its own column/row coordinates, holds a user-defined
 * value (tile ID, terrain type, etc.) and a walkability flag used by
 * the {@link Pathfinder}.
 *
 * @typeParam T - The type of data stored in each cell. Defaults to
 *   `number` (typically a tile ID).
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const cell: GridCell<number> = {
 *   col: 3,
 *   row: 7,
 *   value: 2,       // grass tile
 *   walkable: true,
 * };
 * ```
 *
 * @example Custom cell data
 * ```ts
 * interface TerrainData {
 *   biome: string;
 *   elevation: number;
 * }
 *
 * const cell: GridCell<TerrainData> = {
 *   col: 0,
 *   row: 0,
 *   value: { biome: "forest", elevation: 0.6 },
 *   walkable: true,
 * };
 * ```
 */
export interface GridCell<T = number> {
  /** Zero-based column index (horizontal). */
  col: number;
  /** Zero-based row index (vertical). */
  row: number;
  /** User-defined payload for this cell. */
  value: T;
  /** Whether entities can traverse this cell. Used by pathfinding. */
  walkable: boolean;
}

/**
 * Configuration object for constructing a {@link Grid}.
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example Minimal config
 * ```ts
 * const config: GridConfig = {
 *   cols: 32,
 *   rows: 32,
 *   cellWidth: 64,
 *   cellHeight: 32,
 * };
 * ```
 *
 * @example With world-space origin offset
 * ```ts
 * const config: GridConfig = {
 *   cols: 16,
 *   rows: 16,
 *   cellWidth: 32,
 *   cellHeight: 32,
 *   origin: { x: 100, y: 50 },
 * };
 * ```
 */
export interface GridConfig {
  /** Number of columns in the grid. */
  cols: number;
  /** Number of rows in the grid. */
  rows: number;
  /** Width of a single cell in world-space pixels. */
  cellWidth: number;
  /** Height of a single cell in world-space pixels. */
  cellHeight: number;
  /**
   * World-space offset of the grid origin (cell 0,0).
   *
   * @defaultValue `{ x: 0, y: 0 }`
   */
  origin?: Vector2;
}
