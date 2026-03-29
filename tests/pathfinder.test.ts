/**
 * Contract: Pathfinder public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import { Grid } from '../src/core/grid/grid';
import { Pathfinder } from '../src/core/utils/pathfinding';

describe('Pathfinder', () => {
  const grid = new Grid<number>({ cols: 10, rows: 10, cellWidth: 32, cellHeight: 32 }, 0);
  const pf = new Pathfinder({ grid });

  test('findPath() — returns an array of { col, row } or null', () => {
    const result = pf.findPath(0, 0, 3, 3);
    expect(result).not.toBeNull();
    expect(Array.isArray(result)).toBe(true);
    const step = result![0]!;
    expect(typeof step.col).toBe('number');
    expect(typeof step.row).toBe('number');
  });

  test('findPath() — returns null when no path exists', () => {
    expect(pf.findPath(0, 0, 999, 999)).toBeNull();
  });

  test('isReachable() — returns boolean', () => {
    expect(typeof pf.isReachable(0, 0, 3, 3)).toBe('boolean');
  });
});
