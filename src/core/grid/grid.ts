/**
 * Projection-agnostic 2-D grid data structure.
 *
 * `Grid` stores {@link GridCell} instances in a rectangular layout and
 * provides spatial queries, coordinate conversion (world ↔ grid), and
 * neighbour lookups. It works identically for orthogonal (top-down) and
 * isometric games — the projection is handled externally by
 * {@link IsometricProjection} or by directly using the world-space
 * helpers here.
 *
 * @typeParam T - The type of data stored in each cell. Defaults to
 *   `number` (typically a tile ID).
 *
 * @category Grid
 * @since 0.4.0
 *
 * @example Create a 32×32 grid with 64×32 px cells
 * ```ts
 * import { Grid } from "gamefoo";
 *
 * const grid = new Grid<number>(
 *   { cols: 32, rows: 32, cellWidth: 64, cellHeight: 32 },
 *   0, // default tile ID
 * );
 *
 * grid.setCell(5, 3, 4);
 * console.log(grid.getCell(5, 3)?.value); // 4
 * ```
 *
 * @example Iterate all cells
 * ```ts
 * grid.forEach((cell, col, row) => {
 *   if (!cell.walkable) {
 *     console.log(`Wall at (${col}, ${row})`);
 *   }
 * });
 * ```
 *
 * @see {@link IsometricProjection} — screen-space conversion for iso grids
 * @see {@link Pathfinder}           — A* search over a Grid
 */
import type { Vector2 } from '../../generic_types';
import { DIR_4, DIR_8 } from './grid_constants';
import type { GridCell, GridConfig } from './grid_types';

export class Grid<T = number> {
  /**
   * Number of columns in the grid.
   */
  readonly cols: number;

  /**
   * Number of rows in the grid.
   */
  readonly rows: number;

  /**
   * Width of a single cell in world-space pixels.
   */
  readonly cellWidth: number;

  /**
   * Height of a single cell in world-space pixels.
   */
  readonly cellHeight: number;

  /**
   * World-space offset of cell (0, 0).
   */
  readonly origin: Vector2;

  /**
   * Internal 2-D array storing all cells, indexed `[row][col]`.
   */
  private cells: Array<Array<GridCell<T>>>;

  /**
   * Creates a new grid, pre-filling every cell with `defaultValue`.
   *
   * @param config       - Grid dimensions and cell sizing.
   * @param defaultValue - Initial value written to every cell.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const grid = new Grid<number>(
   *   { cols: 16, rows: 16, cellWidth: 32, cellHeight: 32 },
   *   0,
   * );
   * ```
   */
  constructor(config: GridConfig, defaultValue: T) {
    this.cols = config.cols;
    this.rows = config.rows;
    this.cellWidth = config.cellWidth;
    this.cellHeight = config.cellHeight;
    this.origin = config.origin ?? { x: 0, y: 0 };

    this.cells = [];
    for (let row = 0; row < this.rows; row++) {
      this.cells[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.cells[row]![col] = {
          col,
          row,
          value: defaultValue,
          walkable: true,
        };
      }
    }
  }

  // ── Cell access ──────────────────────────────────────────────────

  /**
   * Returns the cell at the given grid coordinates, or `undefined` if
   * the coordinates are out of bounds.
   *
   * @param col - Zero-based column index.
   * @param row - Zero-based row index.
   * @returns The cell, or `undefined` if out of range.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const cell = grid.getCell(3, 7);
   * if (cell) {
   *   console.log(cell.value, cell.walkable);
   * }
   * ```
   */
  getCell(col: number, row: number): GridCell<T> | undefined {
    if (!this.isInBounds(col, row)) {
      return undefined;
    }
    return this.cells[row]![col];
  }

  /**
   * Sets the value of a cell at the given grid coordinates.
   *
   * Does nothing if the coordinates are out of bounds.
   *
   * @param col   - Zero-based column index.
   * @param row   - Zero-based row index.
   * @param value - New value for the cell.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * grid.setCell(5, 3, 4); // set tile ID 4 at column 5, row 3
   * ```
   */
  setCell(col: number, row: number, value: T): void {
    if (!this.isInBounds(col, row)) {
      return;
    }
    this.cells[row]![col]!.value = value;
  }

  /**
   * Sets the walkability flag of a cell.
   *
   * This flag is consumed by the {@link Pathfinder} to determine
   * traversable terrain.
   *
   * @param col      - Zero-based column index.
   * @param row      - Zero-based row index.
   * @param walkable - `true` if entities can traverse this cell.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * grid.setWalkable(10, 5, false); // mark as impassable
   * ```
   */
  setWalkable(col: number, row: number, walkable: boolean): void {
    if (!this.isInBounds(col, row)) {
      return;
    }
    this.cells[row]![col]!.walkable = walkable;
  }

  /**
   * Checks whether a column/row pair falls within the grid boundaries.
   *
   * @param col - Column index to test.
   * @param row - Row index to test.
   * @returns `true` if `0 <= col < cols` and `0 <= row < rows`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * grid.isInBounds(0, 0);    // true
   * grid.isInBounds(-1, 0);   // false
   * grid.isInBounds(100, 0);  // false (if cols < 100)
   * ```
   */
  isInBounds(col: number, row: number): boolean {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }

  // ── Coordinate conversion (orthogonal) ───────────────────────────

  /**
   * Converts grid coordinates to world-space pixel position.
   *
   * For orthogonal (top-down) grids this is the top-left corner of
   * the cell. For isometric grids, use {@link IsometricProjection.gridToScreen}
   * instead.
   *
   * @param col - Column index.
   * @param row - Row index.
   * @returns World-space position of the cell's top-left corner.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const pos = grid.cellToWorld(3, 2);
   * // For a 32×32 grid with origin (0,0): { x: 96, y: 64 }
   * ```
   */
  cellToWorld(col: number, row: number): Vector2 {
    return {
      x: this.origin.x + col * this.cellWidth,
      y: this.origin.y + row * this.cellHeight,
    };
  }

  /**
   * Converts a world-space position to grid coordinates.
   *
   * The returned values are floored to integers. For isometric grids,
   * use {@link IsometricProjection.screenToGrid} instead.
   *
   * @param wx - World-space X coordinate.
   * @param wy - World-space Y coordinate.
   * @returns Grid column and row (may be out of bounds).
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const { col, row } = grid.worldToCell(100, 70);
   * if (grid.isInBounds(col, row)) {
   *   console.log("Valid cell:", col, row);
   * }
   * ```
   */
  worldToCell(wx: number, wy: number): { col: number; row: number } {
    return {
      col: Math.floor((wx - this.origin.x) / this.cellWidth),
      row: Math.floor((wy - this.origin.y) / this.cellHeight),
    };
  }

  // ── Iteration ────────────────────────────────────────────────────

  /**
   * Iterates every cell in the grid, calling `callback` for each.
   *
   * Iteration order is row-major: row 0 left-to-right, then row 1, etc.
   *
   * @param callback - Function invoked for each cell with the cell,
   *   its column, and its row.
   *
   * @since 0.4.0
   *
   * @example Count walls
   * ```ts
   * let walls = 0;
   * grid.forEach((cell) => {
   *   if (!cell.walkable) walls++;
   * });
   * ```
   */
  forEach(callback: (cell: GridCell<T>, col: number, row: number) => void): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        callback(this.cells[row]![col]!, col, row);
      }
    }
  }

  /**
   * Returns the direct neighbours of a cell.
   *
   * By default returns the 4 cardinal neighbours (up, down, left, right).
   * Pass `includeDiagonals = true` for all 8 surrounding cells.
   *
   * Only in-bounds cells are returned.
   *
   * @param col              - Column of the target cell.
   * @param row              - Row of the target cell.
   * @param includeDiagonals - Include the 4 diagonal neighbours.
   * @returns Array of neighbouring cells.
   *
   * @since 0.4.0
   *
   * @example Cardinal neighbours
   * ```ts
   * const neighbours = grid.getNeighbours(5, 5);
   * // Up to 4 cells: (4,5), (6,5), (5,4), (5,6)
   * ```
   *
   * @example Including diagonals
   * ```ts
   * const all = grid.getNeighbours(5, 5, true);
   * // Up to 8 cells
   * ```
   */
  getNeighbours(col: number, row: number, includeDiagonals = false): Array<GridCell<T>> {
    const offsets = includeDiagonals ? DIR_8 : DIR_4;
    const result: Array<GridCell<T>> = [];

    for (let index = 0; index < offsets.length; index += 1) {
      const [dc, dr] = offsets[index]!;
      const cell = this.getCell(col + dc!, row + dr!);
      if (cell) {
        result.push(cell);
      }
    }

    return result;
  }

  // ── Bulk operations ──────────────────────────────────────────────

  /**
   * Fills every cell in the grid with the given value.
   *
   * Walkability flags are **not** modified.
   *
   * @param value - Value to write into all cells.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * grid.fill(0); // reset all tiles to 0
   * ```
   */
  fill(value: T): void {
    this.forEach((cell) => {
      cell.value = value;
    });
  }

  /**
   * Fills a rectangular sub-region of the grid with the given value.
   *
   * Cells outside the grid bounds are silently skipped.
   * Walkability flags are **not** modified.
   *
   * @param col   - Starting column (top-left of the rectangle).
   * @param row   - Starting row (top-left of the rectangle).
   * @param w     - Width of the rectangle in cells.
   * @param h     - Height of the rectangle in cells.
   * @param value - Value to write.
   *
   * @since 0.4.0
   *
   * @example Fill a 4×3 area with tile ID 5
   * ```ts
   * grid.fillRect(2, 2, 4, 3, 5);
   * ```
   */
  fillRect(col: number, row: number, w: number, h: number, value: T): void {
    for (let currentRow = row; currentRow < row + h; currentRow += 1) {
      for (let currentCol = col; currentCol < col + w; currentCol += 1) {
        this.setCell(currentCol, currentRow, value);
      }
    }
  }
}
