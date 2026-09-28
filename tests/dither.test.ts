/**
 * Contract: the dither fog stack.
 *
 * - `DitherPatterns` builds *correct* ordered-dither matrices: the classic
 *   Bayer 2×2 and all 16 distinct 4×4 thresholds, the outward-ranked
 *   cluster-dots rings, and seeded-deterministic noise.
 * - `DitherLight` clears to `1 - strength` inside `innerRadius`, back to
 *   ambient at `ditherRadius`, follows live targets, and flickers within
 *   bounds.
 * - `DitherFog` (fallback path, mock renderer) covers everything at ambient
 *   1, punches holes where a light reaches, dithers a partial ambient
 *   through the default pattern, and honours its lifecycle switches
 *   (`enabled`, `removeLight`, `clearLights`).
 */
import { describe, expect, test } from 'vitest';
import { DitherFog, DitherLight, DitherPatterns } from '../src/index';
import type { RenderContext } from '../src/index';

/** RenderContext mock that records `fillRect` runs (and has no canvas). */
class RecordingContext {
  width = 64;
  height = 64;
  gameScale = 1;
  rects: Array<[x: number, y: number, w: number, h: number, color: string]> = [];

  readGameScale(): number {
    return 1;
  }
  save(): void {}
  restore(): void {}
  translate(): void {}
  scale(): void {}
  clear(): void {}
  fill(): void {}
  fillRect(x: number, y: number, w: number, h: number, color: string): void {
    this.rects.push([x, y, w, h, color]);
  }
  strokeRect(): void {}
  drawText(): void {}
  drawChar(): void {}
  drawSprite(): void {}
  drawLine(): void {}
  drawCircle(): void {}
  getCanvas(): CanvasRenderingContext2D | null {
    return null; // forces the (canvas-free) fallback path
  }
  createRadialGradient(): unknown {
    return null;
  }
}

const context = (): RenderContext => new RecordingContext() as unknown as RenderContext;

/** Marks the fallback run-rects onto a cell grid; `true` = solid fog. */
function coveredCells(recorder: RecordingContext, cols: number, rows: number): boolean[][] {
  const grid = Array.from({ length: rows }, () => Array.from<boolean>({ length: cols }).fill(false));
  for (const [x, y, w, h, color] of recorder.rects) {
    expect(color).toBe('#08040f');
    const cellW = w / 8;
    const cellH = h / 8;
    expect(Number.isInteger(cellW)).toBe(true);
    expect(Number.isInteger(cellH)).toBe(true);
    for (let gy = y / 8; gy < y / 8 + cellH; gy++) {
      for (let gx = x / 8; gx < x / 8 + cellW; gx++) {
        grid[gy]![gx] = true;
      }
    }
  }
  return grid;
}

describe('DitherPatterns', () => {
  test('bayer2 is the classic 2×2 Bayer matrix', () => {
    const { matrix } = DitherPatterns.generateBayer(2);
    expect(matrix).toEqual([
      [0, 0.5],
      [0.75, 0.25],
    ]);
  });

  test('bayer4 contains all 16 distinct thresholds', () => {
    const { matrix, size } = DitherPatterns.generateBayer(4);
    expect(size).toBe(4);
    const values = matrix.flat().sort((a, b) => a - b);
    expect(new Set(values).size).toBe(16);
    expect(values[0]).toBe(0);
    expect(values[15]).toBe(15 / 16);
  });

  test('get resolves names and accepts custom matrices', () => {
    expect(DitherPatterns.get('bayer8').size).toBe(8);
    expect(DitherPatterns.get('dots4')).toEqual(DitherPatterns.generateClusterDots(4));
    expect(DitherPatterns.get('noise8').size).toBe(8);
    // Unknown names fall back to bayer4 rather than throwing.
    expect(DitherPatterns.get('nope')).toEqual(DitherPatterns.generateBayer(4));
    const custom = DitherPatterns.get([
      [0, 0.9],
      [0.4, 0.6],
    ]);
    expect(custom.size).toBe(2);
    expect(custom.matrix[1]![0]).toBe(0.4);
  });

  test('clusterDots ranks thresholds outward from the centre', () => {
    const { matrix, size } = DitherPatterns.generateClusterDots(4);
    expect(size).toBe(4);
    const flat = matrix.flat();
    // A full permutation of the 16 normalised ranks.
    expect([...flat].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 16 }, (_, i) => i / 16),
    );
    // The four centre-ish cells dissolve first (ranks 0..3), the corners last.
    for (const i of [5, 6, 9, 10]) {
      expect(flat[i]!).toBeLessThan(4 / 16);
    }
    for (const i of [0, 3, 12, 15]) {
      expect(flat[i]!).toBeGreaterThanOrEqual(12 / 16);
    }
  });

  test('noise is seeded-deterministic and bounded', () => {
    const a = DitherPatterns.generateNoise(8, 42);
    const again = DitherPatterns.generateNoise(8, 42);
    const other = DitherPatterns.generateNoise(8, 7);
    expect(a.size).toBe(8);
    expect(a.matrix).toEqual(again.matrix);
    expect(a.matrix).not.toEqual(other.matrix);
    for (const v of a.matrix.flat()) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test('matrices are cached per size/seed', () => {
    // Sharing (not rebuilding) identical matrices is what keeps many lights
    // on one pattern cheap — same call, same object.
    expect(DitherPatterns.generateBayer(4)).toBe(DitherPatterns.generateBayer(4));
    expect(DitherPatterns.generateClusterDots(8)).toBe(DitherPatterns.generateClusterDots(8));
    expect(DitherPatterns.generateNoise(8, 3)).toBe(DitherPatterns.generateNoise(8, 3));
  });
});

describe('DitherLight', () => {
  test('clears inside innerRadius and restores ambient at ditherRadius', () => {
    const light = new DitherLight({ x: 50, y: 50, innerRadius: 10, ditherRadius: 30, strength: 1 });
    expect(light.coverageAt(50, 50)).toBe(0);
    expect(light.coverageAt(52, 51)).toBe(0); // still inside inner
    expect(light.coverageAt(50, 90)).toBe(1); // beyond outer
    // Monotonic between the radii.
    let previous = 0;
    for (let d = 11; d < 30; d++) {
      const coverage = light.coverageAt(50 + d, 50);
      expect(coverage).toBeGreaterThanOrEqual(previous);
      expect(coverage).toBeLessThanOrEqual(1);
      previous = coverage;
    }
  });

  test('strength floors the clear depth', () => {
    const light = new DitherLight({ x: 0, y: 0, innerRadius: 5, ditherRadius: 20, strength: 0.5 });
    expect(light.coverageAt(0, 0)).toBeCloseTo(0.5);
  });

  test('disabled lights leave the fog untouched', () => {
    const light = new DitherLight({ x: 0, y: 0, innerRadius: 5, ditherRadius: 20, enabled: false });
    expect(light.coverageAt(0, 0)).toBe(1);
  });

  test('follows a live target with offsets', () => {
    const target = { x: 10, y: 20 };
    const light = new DitherLight({ followTarget: target, offsetX: 8, offsetY: 8 });
    light.updatePosition();
    expect(light.x).toBe(18);
    expect(light.y).toBe(28);
    target.x = 40;
    light.updatePosition();
    expect(light.x).toBe(48);
  });

  test('flicker keeps the radius within its bounds', () => {
    const light = new DitherLight({
      x: 0,
      y: 0,
      innerRadius: 10,
      ditherRadius: 60,
      flickerAmount: 0.3,
      flickerSpeed: 2,
    });
    for (let i = 0; i < 40; i++) {
      light.update(1 / 30);
      expect(light.effDitherRadius).toBeLessThanOrEqual(60);
      expect(light.effDitherRadius).toBeGreaterThanOrEqual(60 * (1 - 0.3));
    }
  });
});

describe('DitherFog (fallback path)', () => {
  test('ambient 1 with no lights covers every cell', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 1,
    });
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    expect(grid.every((row) => row.every((cell) => cell))).toBe(true);
  });

  test('a light punches a hole; distant cells stay solid', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 1,
    });
    fog.addLight({ x: 32, y: 32, innerRadius: 8, ditherRadius: 16, strength: 1 });
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    // Cell (3,3) — centre (28,28), ~5.7px from the light → fully cleared.
    expect(grid[3]![3]).toBe(false);
    // Cell (4,4) — centre (36,36), also inside the inner radius.
    expect(grid[4]![4]).toBe(false);
    // Corner cell (0,0) — 45px away, far beyond the outer radius.
    expect(grid[0]![0]).toBe(true);
    // Not everything cleared: the fog still exists away from the light.
    expect(grid.flat().filter(Boolean).length).toBeGreaterThan(0);
  });

  test('partial ambient dithers through the default pattern', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 0.5,
      defaultPattern: 'noise8',
    });
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    // Half-covered: strictly some solid cells, strictly some punched out.
    const filled = grid.flat().filter(Boolean).length;
    expect(filled).toBeGreaterThan(0);
    expect(filled).toBeLessThan(64);
  });

  test('out-of-reach lights leave cells at pure ambient', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 0.98,
      // 1×1 custom ambient pattern: every ambient cell sits at threshold
      // 0.95 — above the dip an out-of-reach light's blend used to cause.
      defaultPattern: [[0.95]],
    });
    // A 12px circle around (4,4): its box covers cells 0..2 × 0..2, but the
    // circle itself misses the box's edges and corners.
    fog.addLight({ x: 4, y: 4, innerRadius: 4, ditherRadius: 12, strength: 1, pattern: 'bayer8' });
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    // Cell (0,0) — centre (4,4): inside the inner radius → cleared.
    expect(grid[0]![0]).toBe(false);
    // Cell (2,0) — centre (20,4): 16px away, beyond the circle but inside
    // the box → exactly the ambient dither (0.98 > 0.95).
    expect(grid[2]![0]).toBe(true);
    // Cell (2,2) — box corner, ~28px away → pure ambient as well.
    expect(grid[2]![2]).toBe(true);
    // Far outside the box: ambient.
    expect(grid[5]![5]).toBe(true);
  });

  test('enabled=false renders nothing; lights can be removed', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 1,
      enabled: false,
    });
    fog.render();
    expect(recorder.rects).toHaveLength(0);

    fog.enabled = true;
    const light = fog.addLight({ x: 32, y: 32, innerRadius: 8, ditherRadius: 16 });
    fog.render();
    expect(recorder.rects.length).toBeGreaterThan(0);

    recorder.rects.length = 0;
    fog.removeLight(light);
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    expect(grid.every((row) => row.every((cell) => cell))).toBe(true);

    recorder.rects.length = 0;
    fog.clearLights();
    expect(fog.lights).toHaveLength(0);
  });

  test('disabled lights are ignored by render', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 1,
    });
    fog.addLight({ x: 32, y: 32, innerRadius: 8, ditherRadius: 16, enabled: false });
    fog.render();
    const grid = coveredCells(recorder, 8, 8);
    expect(grid.every((row) => row.every((cell) => cell))).toBe(true);
  });

  test('update advances every light without throwing', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
    });
    const light = fog.addLight({ x: 32, y: 32, flickerAmount: 0.2, flickerSpeed: 3 });
    const target = { x: 1, y: 2 };
    const follower = fog.addLight({ followTarget: target, offsetX: 4, offsetY: 4 });
    fog.update(1 / 60);
    expect(light.effDitherRadius).toBeLessThanOrEqual(light.ditherRadius);
    expect(follower.x).toBe(5);
    expect(follower.y).toBe(6);
  });

  test('smoothMin is min for k=0 and never above min', () => {
    expect(DitherFog.smoothMin(0.4, 0.9, 0)).toBe(0.4);
    expect(DitherFog.smoothMin(0.4, 0.9, 0.5)).toBeLessThanOrEqual(0.4);
  });

  test('coverageFrom eases from the floor to ambient across the radii', () => {
    // strength 1 → floor 0 inside, ambient 1 at/past the outer radius.
    expect(DitherLight.coverageFrom(0, 10, 30, 1, 1)).toBe(0);
    expect(DitherLight.coverageFrom(30, 10, 30, 1, 1)).toBe(1);
    expect(DitherLight.coverageFrom(40, 10, 30, 1, 1)).toBe(1);
    // Halfway (softness 1) is the smoothstep midpoint: 0.5 → 0.75 with
    // floor 0.5 and strength 0.5.
    expect(DitherLight.coverageFrom(20, 10, 30, 0.5, 1)).toBeCloseTo(0.75);
    // Degenerate (equal) radii form a hard disc, never dividing by zero.
    expect(DitherLight.coverageFrom(5, 10, 10, 1, 1)).toBe(0);
    expect(DitherLight.coverageFrom(15, 10, 10, 1, 1)).toBe(1);
  });

  test('headless render falls back to batched runs for both paths', () => {
    const recorder = new RecordingContext();
    const fog = new DitherFog(recorder as unknown as RenderContext, {
      width: 64,
      height: 64,
      cellSize: 8,
      color: '#08040f',
      ambientCoverage: 1,
    });
    fog.render(); // node has no canvas → batched fallback, fully covered
    const grid = coveredCells(recorder, 8, 8);
    expect(grid.every((row) => row.every((cell) => cell))).toBe(true);

    recorder.rects.length = 0;
    fog.render(); // repeated renders stay on the fallback path
    expect(recorder.rects.length).toBeGreaterThan(0);
  });
});
