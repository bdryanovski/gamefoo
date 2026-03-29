/**
 * API contract tests for Pathfinder
 *
 * Verifies the public surface: constructor, findPath(), isReachable().
 */
import { describe, expect, test } from 'bun:test';
import { Grid } from '../src/core/grid/grid';
import { Pathfinder } from '../src/core/utils/pathfinding';

const makeOpenGrid = (cols = 10, rows = 10) =>
  new Grid<number>({ cols, rows, cellWidth: 32, cellHeight: 32 }, 0);

describe('Pathfinder', () => {
  describe('constructor', () => {
    test('instantiates with a grid config', () => {
      expect(
        () => new Pathfinder({ grid: makeOpenGrid() }),
      ).not.toThrow();
    });

    test('accepts allowDiagonal option', () => {
      expect(
        () => new Pathfinder({ grid: makeOpenGrid(), allowDiagonal: true }),
      ).not.toThrow();
    });

    test('accepts heuristic option', () => {
      const heuristics = ['manhattan', 'euclidean', 'chebyshev'] as const;
      for (const h of heuristics) {
        expect(
          () => new Pathfinder({ grid: makeOpenGrid(), heuristic: h }),
        ).not.toThrow();
      }
    });
  });

  describe('findPath()', () => {
    test('returns an array of waypoints for a reachable path', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      const path = pf.findPath(0, 0, 5, 5);
      expect(Array.isArray(path)).toBe(true);
      expect(path).not.toBeNull();
    });

    test('path starts at the start cell', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      const path = pf.findPath(0, 0, 5, 5)!;
      expect(path[0]).toEqual({ col: 0, row: 0 });
    });

    test('path ends at the goal cell', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      const path = pf.findPath(0, 0, 5, 5)!;
      expect(path[path.length - 1]).toEqual({ col: 5, row: 5 });
    });

    test('each waypoint has col and row properties', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      const path = pf.findPath(0, 0, 3, 3)!;
      for (const step of path) {
        expect(step).toHaveProperty('col');
        expect(step).toHaveProperty('row');
      }
    });

    test('returns null when start is out of bounds', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      expect(pf.findPath(-1, 0, 5, 5)).toBeNull();
    });

    test('returns null when goal is out of bounds', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      expect(pf.findPath(0, 0, 100, 100)).toBeNull();
    });

    test('returns null when path is blocked by walls', () => {
      const g = makeOpenGrid(5, 1);
      // Block the entire middle column
      g.setWalkable(1, 0, false);
      g.setWalkable(2, 0, false);
      g.setWalkable(3, 0, false);
      const pf = new Pathfinder({ grid: g });
      expect(pf.findPath(0, 0, 4, 0)).toBeNull();
    });

    test('returns null when start cell is not walkable', () => {
      const g = makeOpenGrid();
      g.setWalkable(0, 0, false);
      const pf = new Pathfinder({ grid: g });
      expect(pf.findPath(0, 0, 5, 5)).toBeNull();
    });

    test('returns null when goal cell is not walkable', () => {
      const g = makeOpenGrid();
      g.setWalkable(5, 5, false);
      const pf = new Pathfinder({ grid: g });
      expect(pf.findPath(0, 0, 5, 5)).toBeNull();
    });

    test('returns a single-element path when start equals goal', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      const path = pf.findPath(3, 3, 3, 3)!;
      expect(path).not.toBeNull();
      expect(path).toHaveLength(1);
      expect(path[0]).toEqual({ col: 3, row: 3 });
    });

    test('finds path with diagonal movement enabled', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid(), allowDiagonal: true });
      const path = pf.findPath(0, 0, 3, 3)!;
      expect(path).not.toBeNull();
      // Diagonal path should be shorter than cardinal-only
      const cardinalPf = new Pathfinder({ grid: makeOpenGrid() });
      const cardinalPath = cardinalPf.findPath(0, 0, 3, 3)!;
      expect(path.length).toBeLessThanOrEqual(cardinalPath.length);
    });
  });

  describe('isReachable()', () => {
    test('returns true when a path exists', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      expect(pf.isReachable(0, 0, 9, 9)).toBe(true);
    });

    test('returns false when no path exists', () => {
      const g = makeOpenGrid(5, 1);
      g.setWalkable(1, 0, false);
      g.setWalkable(2, 0, false);
      g.setWalkable(3, 0, false);
      const pf = new Pathfinder({ grid: g });
      expect(pf.isReachable(0, 0, 4, 0)).toBe(false);
    });

    test('returns false for out-of-bounds destination', () => {
      const pf = new Pathfinder({ grid: makeOpenGrid() });
      expect(pf.isReachable(0, 0, 99, 99)).toBe(false);
    });
  });
});
