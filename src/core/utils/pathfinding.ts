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
import type {
  HeuristicName,
  PathfinderConfig,
  PathNode,
} from './pathfinding_types';

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
    if (this.items.length === 0) return undefined;
    const top = this.items[0]!;
    const last = this.items.pop()!;
    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[i]!.f >= this.items[parent]!.f) break;
      [this.items[i], this.items[parent]] = [
        this.items[parent]!,
        this.items[i]!,
      ];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const len = this.items.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < len && this.items[left]!.f < this.items[smallest]!.f)
        smallest = left;
      if (right < len && this.items[right]!.f < this.items[smallest]!.f)
        smallest = right;
      if (smallest === i) break;
      [this.items[i], this.items[smallest]] = [
        this.items[smallest]!,
        this.items[i]!,
      ];
      i = smallest;
    }
  }
}

export class Pathfinder {
  private grid: Grid;
  private allowDiagonal: boolean;
  private diagonalCost: number;
  private heuristicFn: (
    a: { col: number; row: number },
    b: { col: number; row: number },
  ) => number;

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
  ): { col: number; row: number }[] | null {
    if (
      !this.grid.isInBounds(startCol, startRow)
      || !this.grid.isInBounds(goalCol, goalRow)
    ) {
      return null;
    }

    const startCell = this.grid.getCell(startCol, startRow);
    const goalCell = this.grid.getCell(goalCol, goalRow);
    if (!startCell?.walkable || !goalCell?.walkable) return null;

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

    const offsets = this.allowDiagonal ? DIR_8 : DIR_4;

    while (openHeap.size > 0) {
      const current = openHeap.pop()!;

      if (current.col === goalCol && current.row === goalRow) {
        return this.reconstructPath(current);
      }

      const idx = current.row * cols + current.col;
      if (closed[idx]) continue;
      closed[idx] = 1;

      for (const [dc, dr] of offsets) {
        const nc = current.col + dc;
        const nr = current.row + dr;

        if (!this.grid.isInBounds(nc, nr)) continue;

        const nIdx = nr * cols + nc;
        if (closed[nIdx]) continue;

        const neighbor = this.grid.getCell(nc, nr);
        if (!neighbor || !neighbor.walkable) continue;

        if (this.allowDiagonal && dc !== 0 && dr !== 0) {
          const adj1 = this.grid.getCell(current.col + dc, current.row);
          const adj2 = this.grid.getCell(current.col, current.row + dr);
          if (!adj1?.walkable || !adj2?.walkable) continue;
        }

        const isDiag = dc !== 0 && dr !== 0;
        const moveCost = isDiag ? this.diagonalCost : 1;
        const tentativeG = current.g + moveCost;

        if (tentativeG >= gScores[nIdx]!) continue;

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
    }

    return null;
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
  isReachable(
    startCol: number,
    startRow: number,
    goalCol: number,
    goalRow: number,
  ): boolean {
    return this.findPath(startCol, startRow, goalCol, goalRow) !== null;
  }

  /**
   * Reconstructs the path from goal node back to start by following
   * parent pointers.
   *
   * @internal
   */
  private reconstructPath(node: PathNode): { col: number; row: number }[] {
    const path: { col: number; row: number }[] = [];
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
  ): (
    a: { col: number; row: number },
    b: { col: number; row: number },
  ) => number {
    switch (name) {
      case 'euclidean':
        return (a, b) => {
          const dx = a.col - b.col;
          const dy = a.row - b.row;
          return Math.sqrt(dx * dx + dy * dy);
        };
      case 'chebyshev':
        return (a, b) =>
          Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
      default:
        return (a, b) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
    }
  }
}
