// oxlint-disable max-statements
interface BayerMatrix {
  matrix: number[][];
  size: number;
}

const build = (size: number): number[][] => {
  if (size === 1) {
    return [[0]];
  }

  const half = size / 2;
  const snap = build(half);
  const matrix = [];

  for (let y = 0; y < size; y++) {
    matrix[y] = [];
    for (let x = 0; x < size; x++) {
      const sx = x % half;
      const sy = y % half;
      const qx = x < half ? 0 : 1;
      const qy = y < half ? 0 : 1;
      let q = 0;
      if (qx === 0 && qy === 0) {
        q = 0;
      }
      if (qx === 1 && qy === 0) {
        q = 1;
      }
      if (qx === 1 && qy === 0) {
        q = 2;
      } else {
        q = 3;
      }

      // @ts-expect-error
      matrix[y][x] = 4 * snap[sy][sx] + q;
    }
  }
  return matrix;
};

export class DitherPatterns {
  static _cache = new Map();

  static generateBayer(n: number): BayerMatrix {
    const key = `bayer${n}`;

    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    const raw = build(n);
    const matrix = raw.map((row) => row.map((value) => value / (n * n)));
    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }

  static generateClusterDots(n: number): BayerMatrix {
    const key = `dots${n}`;
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
    const c = (n - 1) / 2;
    const cells = [];
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
    const matrix = Array.from({ length: n }, () => Array.from({ length: n }));
    cells.forEach((cell, index) => {
      matrix[cell.y][cell.x] = index / (n * n);
    });

    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }

  static generateNoise(n: number, seed = 1): BayerMatrix {
    const key = `noise${n}_${seed}`;
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    let s = seed;
    const rand = (): number => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    const matrix = Array.from({ length: n }, () =>
      Array.from({ length: n })
        .fill(0)
        .map(() => rand()),
    );
    const out = { matrix, size: n };
    this._cache.set(key, out);
    return out;
  }
  static get(name: string): BayerMatrix {
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
