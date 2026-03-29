/**
 * Contract: Grid public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import { Grid } from '../src/core/grid/grid';

describe('Grid', () => {
  const g = new Grid<number>({ cols: 4, rows: 4, cellWidth: 32, cellHeight: 32 }, 0);

  test('cols — readonly number', () => {
    expect(typeof g.cols).toBe('number');
  });

  test('rows — readonly number', () => {
    expect(typeof g.rows).toBe('number');
  });

  test('cellWidth — readonly number', () => {
    expect(typeof g.cellWidth).toBe('number');
  });

  test('cellHeight — readonly number', () => {
    expect(typeof g.cellHeight).toBe('number');
  });

  test('origin — has x and y', () => {
    expect(typeof g.origin.x).toBe('number');
    expect(typeof g.origin.y).toBe('number');
  });

  test('getCell() — returns cell with col, row, value, walkable or undefined', () => {
    const cell = g.getCell(0, 0);
    expect(typeof cell!.col).toBe('number');
    expect(typeof cell!.row).toBe('number');
    expect('value' in cell!).toBe(true);
    expect(typeof cell!.walkable).toBe('boolean');
    expect(g.getCell(999, 999)).toBeUndefined();
  });

  test('setCell() — callable, returns void', () => {
    expect(typeof g.setCell).toBe('function');
    expect(g.setCell(0, 0, 1)).toBeUndefined();
  });

  test('setWalkable() — callable, returns void', () => {
    expect(typeof g.setWalkable).toBe('function');
    expect(g.setWalkable(0, 0, false)).toBeUndefined();
  });

  test('isInBounds() — returns boolean', () => {
    expect(typeof g.isInBounds(0, 0)).toBe('boolean');
  });

  test('cellToWorld() — returns { x, y }', () => {
    const result = g.cellToWorld(0, 0);
    expect(typeof result.x).toBe('number');
    expect(typeof result.y).toBe('number');
  });

  test('worldToCell() — returns { col, row }', () => {
    const result = g.worldToCell(0, 0);
    expect(typeof result.col).toBe('number');
    expect(typeof result.row).toBe('number');
  });

  test('forEach() — callable', () => {
    expect(typeof g.forEach).toBe('function');
    expect(() => g.forEach(() => {})).not.toThrow();
  });

  test('getNeighbours() — returns an array', () => {
    expect(Array.isArray(g.getNeighbours(1, 1))).toBe(true);
  });

  test('fill() — callable, returns void', () => {
    expect(typeof g.fill).toBe('function');
    expect(g.fill(0)).toBeUndefined();
  });

  test('fillRect() — callable, returns void', () => {
    expect(typeof g.fillRect).toBe('function');
    expect(g.fillRect(0, 0, 2, 2, 1)).toBeUndefined();
  });
});
