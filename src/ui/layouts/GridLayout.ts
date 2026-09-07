/**
 * Grid layout container that arranges children in a fixed grid.
 *
 * @category UI
 * @module ui/layouts/GridLayout
 * @since 0.5.0
 */

import Container, { type ContainerConfig } from '../core/Container';
import type { UISize } from '../core/types';
import type UIWidget from '../core/UIWidget';

/**
 * Configuration for GridLayout.
 *
 * @since 0.5.0
 */
export interface GridLayoutConfig extends ContainerConfig {
  /**
   * Number of columns
   */
  columns?: number;
  /**
   * Number of rows (optional, calculated from children if not set)
   */
  rows?: number;
  /**
   * Horizontal gap between cells
   */
  columnGap?: number;
  /**
   * Vertical gap between cells
   */
  rowGap?: number;
  /**
   * Cell width (optional, calculated from container width if not set)
   */
  cellWidth?: number;
  /**
   * Cell height (optional, calculated from container height if not set)
   */
  cellHeight?: number;
}

/**
 * Grid layout that arranges children in rows and columns.
 *
 * Useful for inventories, palette viewers, key binding grids, etc.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const grid = new GridLayout({
 *   columns: 4,
 *   columnGap: 2,
 *   rowGap: 2,
 *   cellWidth: 16,
 *   cellHeight: 16,
 * });
 *
 * // Add 16 color swatches
 * for (let i = 0; i < 16; i++) {
 *   grid.addChild(new ColorSwatch({ colorIndex: i }));
 * }
 * ```
 */
export default class GridLayout extends Container {
  /**
   * Number of columns
   */
  protected _columns: number = 4;

  /**
   * Number of rows (0 = auto)
   */
  protected _rows: number = 0;

  /**
   * Horizontal gap between cells
   */
  protected _columnGap: number = 0;

  /**
   * Vertical gap between cells
   */
  protected _rowGap: number = 0;

  /**
   * Cell width (0 = auto from container)
   */
  protected _cellWidth: number = 0;

  /**
   * Cell height (0 = auto from container)
   */
  protected _cellHeight: number = 0;

  /**
   * Creates a new GridLayout.
   *
   * @param config - Layout configuration
   *
   * @since 0.5.0
   */
  constructor(config: GridLayoutConfig = {}) {
    super(config);
    if (config.columns !== undefined) {
      this._columns = config.columns;
    }
    if (config.rows !== undefined) {
      this._rows = config.rows;
    }
    if (config.columnGap !== undefined) {
      this._columnGap = config.columnGap;
    }
    if (config.rowGap !== undefined) {
      this._rowGap = config.rowGap;
    }
    if (config.cellWidth !== undefined) {
      this._cellWidth = config.cellWidth;
    }
    if (config.cellHeight !== undefined) {
      this._cellHeight = config.cellHeight;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Number of columns
   */
  get columns(): number {
    return this._columns;
  }

  set columns(value: number) {
    if (this._columns !== value) {
      this._columns = Math.max(1, value);
      this.markLayoutDirty();
    }
  }

  /**
   * Number of rows
   */
  get rows(): number {
    return this._rows;
  }

  set rows(value: number) {
    if (this._rows !== value) {
      this._rows = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Horizontal gap between cells
   */
  get columnGap(): number {
    return this._columnGap;
  }

  set columnGap(value: number) {
    if (this._columnGap !== value) {
      this._columnGap = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Vertical gap between cells
   */
  get rowGap(): number {
    return this._rowGap;
  }

  set rowGap(value: number) {
    if (this._rowGap !== value) {
      this._rowGap = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Cell width
   */
  get cellWidth(): number {
    return this._cellWidth;
  }

  set cellWidth(value: number) {
    if (this._cellWidth !== value) {
      this._cellWidth = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Cell height
   */
  get cellHeight(): number {
    return this._cellHeight;
  }

  set cellHeight(value: number) {
    if (this._cellHeight !== value) {
      this._cellHeight = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Computed Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the actual number of rows based on children count.
   *
   * @since 0.5.0
   */
  get actualRows(): number {
    if (this._rows > 0) {
      return this._rows;
    }
    const visibleCount = this._children.filter((c) => c.visible).length;
    return Math.ceil(visibleCount / this._columns);
  }

  /**
   * Gets the computed cell width.
   *
   * @since 0.5.0
   */
  get computedCellWidth(): number {
    if (this._cellWidth > 0) {
      return this._cellWidth;
    }
    const available = this._width - this._padding.left - this._padding.right;
    const totalGaps = (this._columns - 1) * this._columnGap;
    return Math.floor((available - totalGaps) / this._columns);
  }

  /**
   * Gets the computed cell height.
   *
   * @since 0.5.0
   */
  get computedCellHeight(): number {
    if (this._cellHeight > 0) {
      return this._cellHeight;
    }
    const rows = this.actualRows;
    if (rows === 0) {
      return 0;
    }
    const available = this._height - this._padding.top - this._padding.bottom;
    const totalGaps = (rows - 1) * this._rowGap;
    return Math.floor((available - totalGaps) / rows);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates the preferred size based on cells.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    const rows = this.actualRows;
    const cellW = this._cellWidth > 0 ? this._cellWidth : 16; // Default cell size
    const cellH = this._cellHeight > 0 ? this._cellHeight : 16;

    const width =
      this._padding.left +
      this._columns * cellW +
      (this._columns - 1) * this._columnGap +
      this._padding.right;

    const height =
      this._padding.top +
      rows * cellH +
      Math.max(0, rows - 1) * this._rowGap +
      this._padding.bottom;

    return {
      width: Math.max(this._width, width),
      height: Math.max(this._height, height),
    };
  }

  /**
   * Layouts children in a grid.
   *
   * @since 0.5.0
   */
  override layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent.absoluteX + this._x;
      this._absoluteY = this._parent.absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    const cellW = this.computedCellWidth;
    const cellH = this.computedCellHeight;

    let col = 0;
    let row = 0;

    for (const child of this._children) {
      if (!child.visible) {
        continue;
      }

      // Calculate position
      const x = this._padding.left + col * (cellW + this._columnGap);
      const y = this._padding.top + row * (cellH + this._rowGap);

      // Position child
      child.x = x;
      child.y = y;
      child.width = cellW;
      child.height = cellH;

      // Layout child
      child.layout();

      // Move to next cell
      col++;
      if (col >= this._columns) {
        col = 0;
        row++;
      }
    }

    this._layoutDirty = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Utility Methods
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the child at a specific grid position.
   *
   * @param column - Column index
   * @param row - Row index
   * @returns The child widget or undefined
   *
   * @since 0.5.0
   */
  getChildAtCell(column: number, row: number): UIWidget | undefined {
    const index = row * this._columns + column;
    return this._children[index];
  }

  /**
   * Gets the grid position of a child.
   *
   * @param child - Child widget
   * @returns The grid position or null if not found
   *
   * @since 0.5.0
   */
  getCellOfChild(child: UIWidget): { column: number; row: number } | null {
    const index = this._children.indexOf(child);
    if (index === -1) {
      return null;
    }
    return {
      column: index % this._columns,
      row: Math.floor(index / this._columns),
    };
  }
}
