/**
 * A* pathfinder operating on a {@link Grid}.
 *
 * `Pathfinder` finds the shortest path between two grid cells,
 * respecting walkability flags. It supports 4-directional and
 * 8-directional movement with configurable heuristics and diagonal
 * costs.
 *
 * The implementation uses a binary-heap priority queue for the open
 * set (O(log n) insert/extract) and a flat boolean array for the
 * closed set (O(1) lookup).
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example Find a path (4-directional)
 * ```ts
 * import { Pathfinder } from "gamefoo";
 *
 * const pathfinder = new Pathfinder({ grid: myGrid });
 * const path = pathfinder.findPath(0, 0, 10, 10);
 *
 * if (path) {
 *   for (const step of path) {
 *     console.log(`Step: (${step.col}, ${step.row})`);
 *   }
 * } else {
 *   console.log("No path found!");
 * }
 * ```
 *
 * @example 8-directional with Euclidean heuristic
 * ```ts
 * const pathfinder = new Pathfinder({
 *   grid: myGrid,
 *   allowDiagonal: true,
 *   heuristic: "euclidean",
 * });
 *
 * const path = pathfinder.findPath(0, 0, 15, 12);
 * ```
 *
 * @see {@link Grid}           — the grid data structure
 * @see {@link PathFollower}   — behaviour that moves entities along a path
 * @see {@link PathfinderConfig} — configuration options
 */

import type { Grid } from '../grid/grid';
import { DIR_4, DIR_8 } from '../grid/grid_constants';
import type { HeuristicName, PathfinderConfig, PathNode } from './pathfinding_types';

/**
 * Binary min-heap for {@link PathNode} ordered by `f` cost.
 *
 * @internal
 */
class MinHeap {
  private items: PathNode[] = [];

  get size(): number {
    return this.items.length;
  }

  push(node: PathNode): void {
    this.items.push(node);
    this.bubbleUp(this.items.length - 1);
  }

  pop(): PathNode | undefined {
    if (this.items.length === 0) {
      return undefined;
    }
    const top = this.items[0]!;
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(start: number): void {
    let index = start;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.items[index]!.f >= this.items[parent]!.f) {
        break;
      }
      [this.items[index], this.items[parent]] = [this.items[parent]!, this.items[index]!];
      index = parent;
    }
  }

  private sinkDown(start: number): void {
    const len = this.items.length;
    let index = start;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      if (left < len && this.items[left]!.f < this.items[smallest]!.f) {
        smallest = left;
      }
      if (right < len && this.items[right]!.f < this.items[smallest]!.f) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      [this.items[index], this.items[smallest]] = [this.items[smallest]!, this.items[index]!];
      index = smallest;
    }
  }
}

/**
 * Mutable state of a single A* search.
 *
 * Bundled into one object so the search can be split across focused helpers
 * without threading six arguments through each of them.
 *
 * @internal
 */
interface SearchState {
  /** Grid width, used to flatten a `(col, row)` pair into an array index. */
  cols: number;
  /** `1` once a cell has been expanded, so it is never revisited. */
  closed: Uint8Array;
  /** Best known cost from the start to each cell. */
  gScores: Float64Array;
  /** Frontier of nodes still to expand, ordered by `f`. */
  openHeap: MinHeap;
  /** Destination cell, the target of the heuristic. */
  goal: { col: number; row: number };
  /** Step offsets to try from each cell: 4-way or 8-way. */
  offsets: ReadonlyArray<[number, number]>;
}

export class Pathfinder {
  private grid: Grid;
  private allowDiagonal: boolean;
  private diagonalCost: number;
  private heuristicFn: (a: { col: number; row: number }, b: { col: number; row: number }) => number;

  /**
   * Creates a new pathfinder bound to a grid.
   *
   * @param config - Grid, movement rules, and heuristic selection.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const pf = new Pathfinder({
   *   grid: myGrid,
   *   allowDiagonal: true,
   *   heuristic: "euclidean",
   * });
   * ```
   */
  constructor(config: PathfinderConfig) {
    this.grid = config.grid;
    this.allowDiagonal = config.allowDiagonal ?? false;
    this.diagonalCost = config.diagonalCost ?? Math.SQRT2;
    this.heuristicFn = Pathfinder.getHeuristic(config.heuristic ?? 'manhattan');
  }

  /**
   * Finds the shortest path between two grid cells.
   *
   * Returns an ordered array of `{ col, row }` waypoints from `start`
   * to `goal` (inclusive), or `null` if no path exists.
   *
   * @param startCol - Starting column.
   * @param startRow - Starting row.
   * @param goalCol  - Destination column.
   * @param goalRow  - Destination row.
   * @returns Ordered path waypoints, or `null` if unreachable.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const path = pathfinder.findPath(0, 0, 10, 10);
   * if (path) {
   *   console.log(`Path has ${path.length} steps`);
   * }
   * ```
   */
  findPath(
    startCol: number,
    startRow: number,
    goalCol: number,
    goalRow: number,
  ): Array<{ col: number; row: number }> | null {
    if (!this.grid.isInBounds(startCol, startRow) || !this.grid.isInBounds(goalCol, goalRow)) {
      return null;
    }

    const startCell = this.grid.getCell(startCol, startRow);
    const goalCell = this.grid.getCell(goalCol, goalRow);
    if (!startCell?.walkable || !goalCell?.walkable) {
      return null;
    }

    const state = this.initSearch(startCol, startRow, goalCol, goalRow);

    while (state.openHeap.size > 0) {
      const current = state.openHeap.pop()!;

      if (current.col === goalCol && current.row === goalRow) {
        return this.reconstructPath(current);
      }

      const idx = current.row * state.cols + current.col;
      if (state.closed[idx]) {
        continue;
      }
      state.closed[idx] = 1;

      this.expandNeighbors(current, state);
    }

    return null;
  }

  /**
   * Allocates the per-search arrays and seeds the open set with the start node.
   */
  private initSearch(
    startCol: number,
    startRow: number,
    goalCol: number,
    goalRow: number,
  ): SearchState {
    const cols = this.grid.cols;
    const goal = { col: goalCol, row: goalRow };

    const closed = new Uint8Array(cols * this.grid.rows);
    const gScores = new Float64Array(cols * this.grid.rows).fill(Infinity);
    const openHeap = new MinHeap();

    const h0 = this.heuristicFn({ col: startCol, row: startRow }, goal);
    const startNode: PathNode = {
      col: startCol,
      row: startRow,
      g: 0,
      h: h0,
      f: h0,
      parent: null,
    };

    openHeap.push(startNode);
    gScores[startRow * cols + startCol] = 0;

    return {
      cols,
      closed,
      gScores,
      openHeap,
      goal,
      offsets: this.allowDiagonal ? DIR_8 : DIR_4,
    };
  }

  /** Offers every in-reach neighbour of `current` to the open set. */
  private expandNeighbors(current: PathNode, state: SearchState): void {
    for (const [dc, dr] of state.offsets) {
      this.relaxNeighbor(current, dc, dr, state);
    }
  }

  /**
   * Index of a walkable, not-yet-closed cell, or `null` when it is not a
   * candidate. Note that index `0` is a valid result — callers must compare
   * against `null` rather than testing truthiness.
   */
  private candidateIndex(
    col: number,
    row: number,
    closed: Uint8Array,
    cols: number,
  ): number | null {
    if (!this.grid.isInBounds(col, row)) {
      return null;
    }
    const idx = row * cols + col;
    if (closed[idx]) {
      return null;
    }
    const cell = this.grid.getCell(col, row);
    if (!cell?.walkable) {
      return null;
    }
    return idx;
  }

  /**
   * Whether a diagonal step is clear: both orthogonal cells it passes between
   * must be walkable, so a path cannot cut the corner of a wall.
   */
  private diagonalIsOpen(col: number, row: number, dc: number, dr: number): boolean {
    const adj1 = this.grid.getCell(col + dc, row);
    const adj2 = this.grid.getCell(col, row + dr);
    return Boolean(adj1?.walkable && adj2?.walkable);
  }

  /**
   * Relaxes the cost of stepping one cell from `current` in direction
   * `(dc, dr)`, pushing an improved node onto the open set.
   */
  private relaxNeighbor(current: PathNode, dc: number, dr: number, state: SearchState): void {
    const { cols, closed, gScores, openHeap, goal } = state;
    const nc = current.col + dc;
    const nr = current.row + dr;

    const nIdx = this.candidateIndex(nc, nr, closed, cols);
    if (nIdx === null) {
      return;
    }

    const isDiag = dc !== 0 && dr !== 0;
    if (isDiag && this.allowDiagonal && !this.diagonalIsOpen(current.col, current.row, dc, dr)) {
      return;
    }

    const moveCost = isDiag ? this.diagonalCost : 1;
    const tentativeG = current.g + moveCost;

    if (tentativeG >= gScores[nIdx]!) {
      return;
    }

    gScores[nIdx] = tentativeG;

    const h = this.heuristicFn({ col: nc, row: nr }, goal);
    const node: PathNode = {
      col: nc,
      row: nr,
      g: tentativeG,
      h,
      f: tentativeG + h,
      parent: current,
    };

    openHeap.push(node);
  }

  /**
   * Checks whether a cell is reachable from another.
   *
   * Equivalent to `findPath() !== null` but communicates intent more
   * clearly.
   *
   * @param startCol - Starting column.
   * @param startRow - Starting row.
   * @param goalCol  - Destination column.
   * @param goalRow  - Destination row.
   * @returns `true` if a path exists.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * if (pathfinder.isReachable(0, 0, 10, 10)) {
   *   npc.walkTo(10, 10);
   * }
   * ```
   */
  isReachable(startCol: number, startRow: number, goalCol: number, goalRow: number): boolean {
    return this.findPath(startCol, startRow, goalCol, goalRow) !== null;
  }

  /**
   * Reconstructs the path from goal node back to start by following
   * parent pointers.
   *
   * @internal
   */
  private reconstructPath(node: PathNode): Array<{ col: number; row: number }> {
    const path: Array<{ col: number; row: number }> = [];
    let current: PathNode | null = node;
    while (current) {
      path.push({ col: current.col, row: current.row });
      current = current.parent;
    }
    path.reverse();
    return path;
  }

  /**
   * Returns a heuristic function by name.
   *
   * @param name - Heuristic identifier.
   * @returns Distance estimation function.
   *
   * @internal
   */
  private static getHeuristic(
    name: HeuristicName,
  ): (a: { col: number; row: number }, b: { col: number; row: number }) => number {
    switch (name) {
      case 'euclidean':
        return (a, b) => {
          const dx = a.col - b.col;
          const dy = a.row - b.row;
          return Math.sqrt(dx * dx + dy * dy);
        };
      case 'chebyshev':
        return (a, b) => Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
      default:
        return (a, b) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
    }
  }
}
