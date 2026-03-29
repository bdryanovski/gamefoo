/**
 * API contract tests for Grid
 *
 * Verifies the public surface: constructor, getCell(), setCell(),
 * setWalkable(), isInBounds(), cellToWorld(), worldToCell(),
 * forEach(), getNeighbours(), fill(), fillRect().
 */
import { describe, expect, test } from 'bun:test';
import { Grid } from '../src/core/grid/grid';

describe('Grid', () => {
  const makeGrid = () =>
    new Grid<number>(
      { cols: 10, rows: 8, cellWidth: 32, cellHeight: 32 },
      0,
    );

  describe('constructor', () => {
    test('exposes readonly cols, rows, cellWidth, cellHeight', () => {
      const g = makeGrid();
      expect(g.cols).toBe(10);
      expect(g.rows).toBe(8);
      expect(g.cellWidth).toBe(32);
      expect(g.cellHeight).toBe(32);
    });

    test('defaults origin to { x: 0, y: 0 } when not provided', () => {
      const g = makeGrid();
      expect(g.origin).toEqual({ x: 0, y: 0 });
    });

    test('uses provided origin', () => {
      const g = new Grid<number>(
        { cols: 4, rows: 4, cellWidth: 16, cellHeight: 16, origin: { x: 100, y: 200 } },
        0,
      );
      expect(g.origin).toEqual({ x: 100, y: 200 });
    });

    test('pre-fills every cell with the default value', () => {
      const g = makeGrid();
      g.forEach((cell) => {
        expect(cell.value).toBe(0);
      });
    });

    test('marks all cells as walkable by default', () => {
      const g = makeGrid();
      g.forEach((cell) => {
        expect(cell.walkable).toBe(true);
      });
    });
  });

  describe('getCell()', () => {
    test('returns a cell object for valid coordinates', () => {
      const g = makeGrid();
      const cell = g.getCell(0, 0);
      expect(cell).toBeDefined();
      expect(cell!.col).toBe(0);
      expect(cell!.row).toBe(0);
    });

    test('returns undefined for out-of-bounds column', () => {
      const g = makeGrid();
      expect(g.getCell(10, 0)).toBeUndefined();
    });

    test('returns undefined for out-of-bounds row', () => {
      const g = makeGrid();
      expect(g.getCell(0, 8)).toBeUndefined();
    });

    test('returns undefined for negative coordinates', () => {
      const g = makeGrid();
      expect(g.getCell(-1, 0)).toBeUndefined();
    });
  });

  describe('setCell()', () => {
    test('updates the value of a valid cell', () => {
      const g = makeGrid();
      g.setCell(3, 2, 99);
      expect(g.getCell(3, 2)!.value).toBe(99);
    });

    test('silently ignores out-of-bounds coordinates', () => {
      const g = makeGrid();
      expect(() => g.setCell(100, 100, 5)).not.toThrow();
    });
  });

  describe('setWalkable()', () => {
    test('marks a cell as non-walkable', () => {
      const g = makeGrid();
      g.setWalkable(5, 3, false);
      expect(g.getCell(5, 3)!.walkable).toBe(false);
    });

    test('re-marks a cell as walkable', () => {
      const g = makeGrid();
      g.setWalkable(5, 3, false);
      g.setWalkable(5, 3, true);
      expect(g.getCell(5, 3)!.walkable).toBe(true);
    });

    test('silently ignores out-of-bounds coordinates', () => {
      const g = makeGrid();
      expect(() => g.setWalkable(100, 100, false)).not.toThrow();
    });
  });

  describe('isInBounds()', () => {
    test('returns true for (0, 0)', () => {
      expect(makeGrid().isInBounds(0, 0)).toBe(true);
    });

    test('returns true for the last valid cell', () => {
      expect(makeGrid().isInBounds(9, 7)).toBe(true);
    });

    test('returns false for col === cols', () => {
      expect(makeGrid().isInBounds(10, 0)).toBe(false);
    });

    test('returns false for row === rows', () => {
      expect(makeGrid().isInBounds(0, 8)).toBe(false);
    });

    test('returns false for negative col', () => {
      expect(makeGrid().isInBounds(-1, 0)).toBe(false);
    });

    test('returns false for negative row', () => {
      expect(makeGrid().isInBounds(0, -1)).toBe(false);
    });
  });

  describe('cellToWorld()', () => {
    test('converts (0,0) to the origin', () => {
      const g = makeGrid();
      expect(g.cellToWorld(0, 0)).toEqual({ x: 0, y: 0 });
    });

    test('converts (col, row) to correct world coordinates', () => {
      const g = makeGrid();
      expect(g.cellToWorld(3, 2)).toEqual({ x: 96, y: 64 });
    });

    test('includes origin offset when provided', () => {
      const g = new Grid<number>(
        { cols: 4, rows: 4, cellWidth: 32, cellHeight: 32, origin: { x: 10, y: 20 } },
        0,
      );
      expect(g.cellToWorld(1, 1)).toEqual({ x: 42, y: 52 });
    });
  });

  describe('worldToCell()', () => {
    test('converts world (0,0) to cell (0,0)', () => {
      const g = makeGrid();
      expect(g.worldToCell(0, 0)).toEqual({ col: 0, row: 0 });
    });

    test('floors fractional coordinates', () => {
      const g = makeGrid();
      expect(g.worldToCell(31, 31)).toEqual({ col: 0, row: 0 });
    });

    test('correctly maps world coords to grid coords', () => {
      const g = makeGrid();
      expect(g.worldToCell(96, 64)).toEqual({ col: 3, row: 2 });
    });
  });

  describe('forEach()', () => {
    test('iterates all cols * rows cells', () => {
      const g = makeGrid();
      let count = 0;
      g.forEach(() => count++);
      expect(count).toBe(10 * 8);
    });

    test('provides correct col and row arguments', () => {
      const g = new Grid<number>({ cols: 2, rows: 2, cellWidth: 1, cellHeight: 1 }, 0);
      const visited: [number, number][] = [];
      g.forEach((_, col, row) => visited.push([col, row]));
      expect(visited).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('getNeighbours()', () => {
    test('returns up to 4 cardinal neighbours for an interior cell', () => {
      const g = makeGrid();
      expect(g.getNeighbours(5, 4)).toHaveLength(4);
    });

    test('returns fewer neighbours for a corner cell', () => {
      const g = makeGrid();
      expect(g.getNeighbours(0, 0)).toHaveLength(2);
    });

    test('returns up to 8 neighbours when includeDiagonals is true', () => {
      const g = makeGrid();
      expect(g.getNeighbours(5, 4, true)).toHaveLength(8);
    });

    test('only returns in-bounds cells', () => {
      const g = makeGrid();
      const neighbours = g.getNeighbours(0, 0, true);
      for (const cell of neighbours) {
        expect(g.isInBounds(cell.col, cell.row)).toBe(true);
      }
    });
  });

  describe('fill()', () => {
    test('sets every cell to the provided value', () => {
      const g = makeGrid();
      g.fill(7);
      g.forEach((cell) => {
        expect(cell.value).toBe(7);
      });
    });

    test('does not modify walkability', () => {
      const g = makeGrid();
      g.setWalkable(3, 3, false);
      g.fill(1);
      expect(g.getCell(3, 3)!.walkable).toBe(false);
    });
  });

  describe('fillRect()', () => {
    test('fills only the specified rectangular region', () => {
      const g = makeGrid();
      g.fillRect(1, 1, 3, 2, 5);

      // Inside the rect
      expect(g.getCell(1, 1)!.value).toBe(5);
      expect(g.getCell(3, 2)!.value).toBe(5);

      // Outside the rect
      expect(g.getCell(0, 0)!.value).toBe(0);
      expect(g.getCell(4, 3)!.value).toBe(0);
    });

    test('silently clips cells outside the grid boundary', () => {
      const g = makeGrid();
      expect(() => g.fillRect(8, 6, 10, 10, 1)).not.toThrow();
    });
  });
});
