export class PerlinNoise {
  private perm: Uint8Array;

  constructor(seed: number = 0) {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);

    // Fill 0..255
    for (let i = 0; i < 256; i++) p[i] = i;

    // Shuffle with a seeded LCG
    let s = seed >>> 0;
    for (let i = 255; i > 0; i--) {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j]!, p[i]!];
    }

    // Double the table to avoid modulo everywhere
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255]!;
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    // 4 gradient directions
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  }

  /** Returns a value in [-1, 1] */
  noise2d(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.perm[this.perm[xi]! + yi]!;
    const ab = this.perm[this.perm[xi]! + yi + 1]!;
    const ba = this.perm[this.perm[xi + 1]! + yi]!;
    const bb = this.perm[this.perm[xi + 1]! + yi + 1]!;

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);

    return this.lerp(x1, x2, v);
  }

  fbm(x: number, y: number, octaves = 4, lacunarity = 2, persistence = 0.5): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.noise2d(x * frequency, y * frequency) * amplitude;
      max += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / max; // Normalise to [-1, 1]
  }
}
