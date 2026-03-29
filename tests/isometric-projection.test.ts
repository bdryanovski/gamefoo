/**
 * Contract: IsometricProjection public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import { IsometricProjection } from '../src/core/grid/isometric';

describe('IsometricProjection', () => {
  const iso = new IsometricProjection({ tileWidth: 64, tileHeight: 32 });

  test('tileWidth — readonly number', () => {
    expect(typeof iso.tileWidth).toBe('number');
  });

  test('tileHeight — readonly number', () => {
    expect(typeof iso.tileHeight).toBe('number');
  });

  test('origin — has numeric x and y', () => {
    expect(typeof iso.origin.x).toBe('number');
    expect(typeof iso.origin.y).toBe('number');
  });

  test('layout — is a string', () => {
    expect(typeof iso.layout).toBe('string');
  });

  test('gridToScreen() — returns { x, y }', () => {
    const r = iso.gridToScreen(1, 1);
    expect(typeof r.x).toBe('number');
    expect(typeof r.y).toBe('number');
  });

  test('screenToGrid() — returns { col, row }', () => {
    const r = iso.screenToGrid(64, 32);
    expect(typeof r.col).toBe('number');
    expect(typeof r.row).toBe('number');
  });

  test('gridToScreenFast() — returns { x, y }', () => {
    const r = iso.gridToScreenFast(1, 1);
    expect(typeof r.x).toBe('number');
    expect(typeof r.y).toBe('number');
  });

  test('screenToGridFast() — returns { col, row }', () => {
    const r = iso.screenToGridFast(64, 32);
    expect(typeof r.col).toBe('number');
    expect(typeof r.row).toBe('number');
  });

  test('snapToGrid() — returns { col, row }', () => {
    const r = iso.snapToGrid(64, 32);
    expect(typeof r.col).toBe('number');
    expect(typeof r.row).toBe('number');
  });

  test('getTileDiamond() — returns array of 4 { x, y } vertices', () => {
    const verts = iso.getTileDiamond(1, 1);
    expect(verts).toHaveLength(4);
    for (const v of verts) {
      expect(typeof v.x).toBe('number');
      expect(typeof v.y).toBe('number');
    }
  });

  test('getVisibleRange() — returns { minCol, maxCol, minRow, maxRow }', () => {
    const r = iso.getVisibleRange(0, 0, 800, 600, 10, 10);
    expect(typeof r.minCol).toBe('number');
    expect(typeof r.maxCol).toBe('number');
    expect(typeof r.minRow).toBe('number');
    expect(typeof r.maxRow).toBe('number');
  });
});
