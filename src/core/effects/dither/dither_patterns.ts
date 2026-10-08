/**
 * Ordered-dither threshold matrices shared by {@link DitherFog} and
 * {@link DitherLight}.
 *
 * A pattern is an `n × n` matrix of thresholds in `0..1` (exclusive): a cell
 * whose fog coverage exceeds the threshold at its grid position stays solid,
 * otherwise it is punched out. The classic ordered-dither "look" comes from
 * the matrix's spatial ordering, so correct construction matters as much as
 * performance.
 *
 * @category Effects
 * @since 0.5.0
 */

interface BayerMatrix {
  matrix: number[][];
  size: number;
}

/**
 * Standard Bayer quadrant offsets for growing an `n` matrix into a `2n` one:
 * top-left `0`, top-right `2`, bottom-left `3`, bottom-right `1` — the
 * recursive definition of an ordered dither. Indexed `[quadrantY][quadrantX]`.
 */
const QUADRANT_OFFSETS: readonly [readonly [number, number], readonly [number, number]] = [
  [0, 2],
  [3, 1],
];

/** Builds an unnormalised Bayer matrix of `size × size` (values `0..size²-1`). */
const build = (size: number): number[][] => {
  if (size === 1) {
    return [[0]];
  }

  const half = size / 2;
  const snap = build(half);
  const matrix: number[][] = [];

  for (let y = 0; y < size; y++) {
    matrix[y] = [];
    for (let x = 0; x < size; x++) {
      const snapValue = snap[y % half]?.[x % half] ?? 0;
      const offset = QUADRANT_OFFSETS[y < half ? 0 : 1]![x < half ? 0 : 1]!;
      matrix[y]![x] = 4 * snapValue + offset;
    }
  }
  return matrix;
};

export class DitherPatterns {
  private static readonly _cache = new Map<string, BayerMatrix>();

  /**
   * Generates the `n × n` Bayer ordered-dither matrix (e.g. `n = 4` gives the
   * classic 4×4 Bayer), thresholds normalised to `0..1`. Cached per size.
   */
  static generateBayer(n: number): BayerMatrix {
    const key = `bayer${n}`;

    const cached = this._cache.get(key);
    if (cached) {
      return cached;
    }

    const raw = build(n);
    const matrix = raw.map((row) => row.map((value) => value / (n * n)));
    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }

  /**
   * Generates an `n × n` "clustered dots" matrix (a spiral-dither): cells are
   * ranked by distance from the centre with a faint per-position jitter, so
   * thresholds grow outwards in rings — the soft, blobby alternative to Bayer.
   * Cached per size.
   */
  static generateClusterDots(n: number): BayerMatrix {
    const key = `dots${n}`;

    const cached = this._cache.get(key);
    if (cached) {
      return cached;
    }
    const c = (n - 1) / 2;
    const cells: Array<{ x: number; y: number; d: number }> = [];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const dx = x - c;
        const dy = y - c;
        cells.push({
          x,
          y,
          d: Math.hypot(dx, dy) + (((x * 928371 + y * 12197) % 97) / 97) * 1e-4,
        });
      }
    }

    cells.sort((a, b) => a.d - b.d);
    const matrix = Array.from({ length: n }, () => Array.from<number>({ length: n }).fill(0));
    cells.forEach((cell, index) => {
      matrix[cell.y]![cell.x] = index / (n * n);
    });

    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }

  /**
   * Generates an `n × n` white-noise matrix from a seeded LCG — thresholds in
   * random spatial order, for a grainy dissolve. Cached per size + seed.
   */
  static generateNoise(n: number, seed = 1): BayerMatrix {
    const key = `noise${n}_${seed}`;

    const cached = this._cache.get(key);
    if (cached) {
      return cached;
    }

    let s = seed;
    const rand = (): number => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => rand()));
    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }

  /**
   * Resolves a pattern by name (`'bayer2' | 'bayer4' | 'bayer8' | 'dots4' |
   * 'dots8' | 'noise8'`) or accepts a custom 2-D threshold matrix directly
   * (values `0..1`, square). Unknown names fall back to `bayer4`.
   */
  static get(name: string | number[][]): BayerMatrix {
    if (Array.isArray(name)) {
      return { matrix: name, size: name.length };
    }
    if (name === 'bayer2') {
      return this.generateBayer(2);
    }
    if (name === 'bayer4') {
      return this.generateBayer(4);
    }
    if (name === 'bayer8') {
      return this.generateBayer(8);
    }
    if (name === 'dots4') {
      return this.generateClusterDots(4);
    }
    if (name === 'dots8') {
      return this.generateClusterDots(8);
    }
    if (name === 'noise8') {
      return this.generateNoise(8);
    }
    return this.generateBayer(4);
  }
}
