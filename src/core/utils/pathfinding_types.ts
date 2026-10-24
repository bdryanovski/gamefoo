/**
 * Type definitions for the A* {@link Pathfinder}.
 *
 * @category Utilities
 * @module pathfinding_types
 * @since 0.4.0
 */

import type { Grid } from '../grid/grid';

/**
 * Heuristic function name for A* distance estimation.
 *
 * - `"manhattan"` — `|dx| + |dy|`. Best for 4-directional movement.
 * - `"euclidean"` — `sqrt(dx² + dy²)`. Best for 8-directional or
 *   free movement.
 * - `"chebyshev"` — `max(|dx|, |dy|)`. Best for 8-directional with
 *   uniform diagonal cost.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const h: HeuristicName = "manhattan";
 * ```
 */
export type HeuristicName = 'manhattan' | 'euclidean' | 'chebyshev';

/**
 * A single node in the A* open/closed sets.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const node: PathNode = {
 *   col: 3, row: 5,
 *   g: 4.0, h: 6.0, f: 10.0,
 *   parent: null,
 * };
 * ```
 */
export interface PathNode {
  /**
   * Grid column index.
   */
  col: number;
  /**
   * Grid row index.
   */
  row: number;
  /**
   * Accumulated cost from the start node to this node.
   */
  g: number;
  /**
   * Heuristic estimate from this node to the goal.
   */
  h: number;
  /**
   * Total estimated cost: `g + h`.
   */
  f: number;
  /**
   * Parent node in the shortest path tree, or `null` for the start.
   */
  parent: PathNode | null;
}

/**
 * Configuration for constructing a {@link Pathfinder}.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example 4-directional Manhattan
 * ```ts
 * const config: PathfinderConfig = {
 *   grid: myGrid,
 *   allowDiagonal: false,
 *   heuristic: "manhattan",
 * };
 * ```
 *
 * @example 8-directional Euclidean
 * ```ts
 * const config: PathfinderConfig = {
 *   grid: myGrid,
 *   allowDiagonal: true,
 *   diagonalCost: Math.SQRT2,
 *   heuristic: "euclidean",
 * };
 * ```
 */
export interface PathfinderConfig {
  /**
   * The grid to pathfind over. Walkability is read from cells.
   */
  grid: Grid;
  /**
   * Allow 8-directional movement (including diagonals).
   *
   * @defaultValue `false`
   */
  allowDiagonal?: boolean;
  /**
   * Movement cost for diagonal steps. Only used when
   * `allowDiagonal` is `true`.
   *
   * @defaultValue `Math.SQRT2` (~1.414)
   */
  diagonalCost?: number;
  /**
   * Distance heuristic.
   *
   * @defaultValue `"manhattan"`
   */
  heuristic?: HeuristicName;
}
