/**
 * Deterministic 2-D Perlin noise generator with fractal Brownian motion
 * (fBm) support.
 *
 * Produces smooth, continuous noise suitable for terrain heightmaps,
 * cloud textures, procedural vegetation placement, and other organic
 * patterns. The output is fully reproducible for a given seed.
 *
 * The implementation uses a 256-entry permutation table shuffled by a
 * seeded linear congruential generator (LCG) and Ken Perlin's improved
 * 5th-order fade curve \( 6t^5 - 15t^4 + 10t^3 \).
 *
 * @category Utilities
 * @since 0.1.0
 *
 * @example Basic noise sampling
 * ```ts
 * import { PerlinNoise } from "gamefoo";
 *
 * const noise = new PerlinNoise(42);
 * const value = noise.noise2d(1.5, 2.3); // returns a value in [-1, 1]
 * ```
 *
 * @example Generating a heightmap with fBm
 * ```ts
 * const noise = new PerlinNoise(12345);
 * const map: number[][] = [];
 *
 * for (let y = 0; y < 128; y++) {
 *   map[y] = [];
 *   for (let x = 0; x < 128; x++) {
 *     map[y][x] = noise.fbm(x * 0.05, y * 0.05, 6, 2, 0.5);
 *   }
 * }
 * ```
 *
 * @example Seeded reproducibility
 * ```ts
 * const a = new PerlinNoise(7);
 * const b = new PerlinNoise(7);
 * console.log(a.noise2d(3, 4) === b.noise2d(3, 4)); // true
 * ```
 */
export class PerlinNoise {
  /**
   * Doubled permutation table (512 entries) used for gradient hashing.
   * Built from a 256-entry shuffle of `[0..255]` seeded by the LCG.
   */
  private perm: Uint8Array;

  /**
   * Creates a new noise generator with the given seed.
   *
   * @param seed - An integer seed for the internal LCG. Identical seeds
   *   produce identical noise fields.
   *
   * @defaultValue `0`
   */
  constructor(seed: number = 0) {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);

    for (let index = 0; index < 256; index += 1) {
      p[index] = index;
    }

    let s = seed >>> 0;
    for (let index = 255; index > 0; index -= 1) {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      const j = s % (index + 1);
      [p[index], p[j]] = [p[j]!, p[index]!];
    }

    for (let index = 0; index < 512; index += 1) {
      this.perm[index] = p[index & 255]!;
    }
  }

  /**
   * Ken Perlin's improved 5th-order fade (smoothstep) curve:
   * \( 6t^5 - 15t^4 + 10t^3 \).
   *
   * @param t - Value in `[0, 1]`.
   * @returns Smoothed value in `[0, 1]`.
   *
   * @internal
   */
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Standard linear interpolation.
   *
   * @param a - Start value.
   * @param b - End value.
   * @param t - Interpolant in `[0, 1]`.
   * @returns Interpolated value.
   *
   * @internal
   */
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  /**
   * Computes a pseudo-random gradient dot product from a hash and
   * 2-D offset.
   *
   * Uses the bottom 2 bits of `hash` to select one of four gradient
   * directions.
   *
   * @param hash - Permutation table entry.
   * @param x    - X offset from the grid point.
   * @param y    - Y offset from the grid point.
   * @returns Dot product of the gradient and offset vectors.
   *
   * @internal
   */
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  }

  /**
   * Samples 2-D Perlin noise at the given coordinates.
   *
   * @param x - X coordinate (any real number).
   * @param y - Y coordinate (any real number).
   * @returns A noise value in the range `[-1, 1]`.
   *
   * @example
   * ```ts
   * const n = noise.noise2d(0.5, 0.5);
   * // n is a smooth, deterministic value in [-1, 1]
   * ```
   */
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

  /**
   * Computes fractal Brownian motion (fBm) by layering multiple
   * octaves of {@link PerlinNoise.noise2d} with increasing frequency
   * and decreasing amplitude.
   *
   * The result is normalised to `[-1, 1]`.
   *
   * @param x           - X coordinate.
   * @param y           - Y coordinate.
   * @param octaves     - Number of noise layers to sum.
   * @param lacunarity  - Frequency multiplier per octave.
   * @param persistence - Amplitude multiplier per octave (controls
   *   roughness).
   * @returns A noise value in `[-1, 1]`.
   *
   * @defaultValue octaves = `4`
   * @defaultValue lacunarity = `2`
   * @defaultValue persistence = `0.5`
   *
   * @example
   * ```ts
   * // 6 octaves for high detail:
   * const height = noise.fbm(x * 0.01, y * 0.01, 6, 2.0, 0.5);
   * ```
   */
  fbm(x: number, y: number, octaves = 4, lacunarity = 2, persistence = 0.5): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let max = 0;

    for (let index = 0; index < octaves; index += 1) {
      value += this.noise2d(x * frequency, y * frequency) * amplitude;
      max += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / max;
  }
}
