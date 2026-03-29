/**
 * API contract tests for IsometricProjection
 *
 * Verifies the public surface: constructor, gridToScreen(), screenToGrid(),
 * gridToScreenFast(), screenToGridFast(), snapToGrid(),
 * getTileDiamond(), getVisibleRange() — for both diamond and staggered layouts.
 */
import { describe, expect, test } from 'bun:test';
import { IsometricProjection } from '../src/core/grid/isometric';

describe('IsometricProjection', () => {
  const diamond = new IsometricProjection({ tileWidth: 64, tileHeight: 32 });
  const staggered = new IsometricProjection({
    tileWidth: 64,
    tileHeight: 32,
    layout: 'staggered',
  });
  const withOrigin = new IsometricProjection({
    tileWidth: 64,
    tileHeight: 32,
    origin: { x: 100, y: 50 },
  });

  describe('constructor', () => {
    test('exposes tileWidth and tileHeight', () => {
      expect(diamond.tileWidth).toBe(64);
      expect(diamond.tileHeight).toBe(32);
    });

    test('defaults layout to "diamond"', () => {
      expect(diamond.layout).toBe('diamond');
    });

    test('uses provided layout', () => {
      expect(staggered.layout).toBe('staggered');
    });

    test('defaults origin to { x: 0, y: 0 }', () => {
      expect(diamond.origin).toEqual({ x: 0, y: 0 });
    });

    test('uses provided origin', () => {
      expect(withOrigin.origin).toEqual({ x: 100, y: 50 });
    });
  });

  describe('gridToScreen() — diamond', () => {
    test('(0,0) maps to origin', () => {
      expect(diamond.gridToScreen(0, 0)).toEqual({ x: 0, y: 0 });
    });

    test('produces correct screen position for non-zero coordinates', () => {
      // screenX = (col - row) * hw = (2 - 1) * 32 = 32
      // screenY = (col + row) * hh = (2 + 1) * 16 = 48
      expect(diamond.gridToScreen(2, 1)).toEqual({ x: 32, y: 48 });
    });

    test('accounts for origin offset', () => {
      const pos = withOrigin.gridToScreen(0, 0);
      expect(pos).toEqual({ x: 100, y: 50 });
    });

    test('returns a new Vector2 object each call', () => {
      const a = diamond.gridToScreen(1, 1);
      const b = diamond.gridToScreen(1, 1);
      expect(a).not.toBe(b);
    });
  });

  describe('gridToScreen() — staggered', () => {
    test('(0,0) maps to origin', () => {
      expect(staggered.gridToScreen(0, 0)).toEqual({ x: 0, y: 0 });
    });

    test('even row has no x offset', () => {
      const pos = staggered.gridToScreen(1, 0);
      expect(pos.x).toBe(64); // col * tileWidth
    });

    test('odd row is offset by half tile width', () => {
      const pos = staggered.gridToScreen(0, 1);
      expect(pos.x).toBe(32); // half tileWidth offset
    });
  });

  describe('screenToGrid()', () => {
    test('round-trips with gridToScreen (diamond)', () => {
      const screen = diamond.gridToScreen(3, 2);
      const grid = diamond.screenToGrid(screen.x, screen.y);
      expect(grid.col).toBe(3);
      expect(grid.row).toBe(2);
    });

    test('round-trips with gridToScreen (staggered)', () => {
      const screen = staggered.gridToScreen(2, 2);
      const grid = staggered.screenToGrid(screen.x, screen.y);
      expect(grid.col).toBe(2);
      expect(grid.row).toBe(2);
    });

    test('returns an object with col and row properties', () => {
      const result = diamond.screenToGrid(0, 0);
      expect(result).toHaveProperty('col');
      expect(result).toHaveProperty('row');
    });
  });

  describe('gridToScreenFast()', () => {
    test('returns the same coordinates as gridToScreen (diamond)', () => {
      const normal = diamond.gridToScreen(3, 5);
      const fast = diamond.gridToScreenFast(3, 5);
      expect(fast.x).toBe(normal.x);
      expect(fast.y).toBe(normal.y);
    });

    test('returns the same coordinates as gridToScreen (staggered)', () => {
      const normal = staggered.gridToScreen(2, 3);
      const fast = staggered.gridToScreenFast(2, 3);
      expect(fast.x).toBe(normal.x);
      expect(fast.y).toBe(normal.y);
    });

    test('returns a shared object reference (no allocation)', () => {
      const a = diamond.gridToScreenFast(1, 1);
      const b = diamond.gridToScreenFast(1, 1);
      expect(a).toBe(b);
    });
  });

  describe('screenToGridFast()', () => {
    test('returns the same result as screenToGrid (diamond)', () => {
      const normal = diamond.screenToGrid(64, 32);
      const fast = diamond.screenToGridFast(64, 32);
      expect(fast.col).toBe(normal.col);
      expect(fast.row).toBe(normal.row);
    });

    test('returns a shared object reference (no allocation)', () => {
      const a = diamond.screenToGridFast(0, 0);
      const b = diamond.screenToGridFast(0, 0);
      expect(a).toBe(b);
    });
  });

  describe('snapToGrid()', () => {
    test('returns an object with col and row', () => {
      const result = diamond.snapToGrid(50, 20);
      expect(result).toHaveProperty('col');
      expect(result).toHaveProperty('row');
    });

    test('is equivalent to screenToGrid', () => {
      const snap = diamond.snapToGrid(96, 48);
      const grid = diamond.screenToGrid(96, 48);
      expect(snap).toEqual(grid);
    });
  });

  describe('getTileDiamond()', () => {
    test('returns exactly 4 vertices', () => {
      const vertices = diamond.getTileDiamond(0, 0);
      expect(vertices).toHaveLength(4);
    });

    test('each vertex has x and y properties', () => {
      const vertices = diamond.getTileDiamond(1, 1);
      for (const v of vertices) {
        expect(v).toHaveProperty('x');
        expect(v).toHaveProperty('y');
      }
    });
  });

  describe('getVisibleRange()', () => {
    test('returns an object with minCol, maxCol, minRow, maxRow', () => {
      const range = diamond.getVisibleRange(0, 0, 800, 600, 20, 20);
      expect(range).toHaveProperty('minCol');
      expect(range).toHaveProperty('maxCol');
      expect(range).toHaveProperty('minRow');
      expect(range).toHaveProperty('maxRow');
    });

    test('minCol is always >= 0', () => {
      const range = diamond.getVisibleRange(-100, -100, 200, 200, 10, 10);
      expect(range.minCol).toBeGreaterThanOrEqual(0);
    });

    test('maxCol is always <= gridCols - 1', () => {
      const range = diamond.getVisibleRange(0, 0, 10000, 10000, 10, 10);
      expect(range.maxCol).toBeLessThanOrEqual(9);
    });

    test('minRow is always >= 0', () => {
      const range = diamond.getVisibleRange(-100, -100, 200, 200, 10, 10);
      expect(range.minRow).toBeGreaterThanOrEqual(0);
    });

    test('maxRow is always <= gridRows - 1', () => {
      const range = diamond.getVisibleRange(0, 0, 10000, 10000, 10, 10);
      expect(range.maxRow).toBeLessThanOrEqual(9);
    });
  });
});
