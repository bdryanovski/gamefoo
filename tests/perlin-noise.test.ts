/**
 * API contract tests for PerlinNoise
 *
 * Verifies the public surface: constructor, noise2d(), fbm().
 */
import { describe, expect, test } from 'bun:test';
import { PerlinNoise } from '../src/core/utils/perlin_noise';

describe('PerlinNoise', () => {
  describe('constructor', () => {
    test('instantiates with a seed', () => {
      expect(() => new PerlinNoise(42)).not.toThrow();
    });

    test('instantiates with default seed (no argument)', () => {
      expect(() => new PerlinNoise()).not.toThrow();
    });
  });

  describe('noise2d()', () => {
    test('returns a number', () => {
      const n = new PerlinNoise(1);
      expect(typeof n.noise2d(0.5, 0.5)).toBe('number');
    });

    test('output is within [-1, 1]', () => {
      const n = new PerlinNoise(7);
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          const v = n.noise2d(x * 0.3, y * 0.3);
          expect(v).toBeGreaterThanOrEqual(-1);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    });

    test('is deterministic — same seed and coordinates produce the same value', () => {
      const a = new PerlinNoise(123);
      const b = new PerlinNoise(123);
      expect(a.noise2d(1.5, 2.3)).toBe(b.noise2d(1.5, 2.3));
    });

    test('different seeds produce different values', () => {
      const a = new PerlinNoise(1);
      const b = new PerlinNoise(2);
      // Not guaranteed in all edge cases but true in practice
      expect(a.noise2d(1.5, 2.3)).not.toBe(b.noise2d(1.5, 2.3));
    });
  });

  describe('fbm()', () => {
    test('returns a number', () => {
      const n = new PerlinNoise(1);
      expect(typeof n.fbm(0.5, 0.5)).toBe('number');
    });

    test('output is within [-1, 1]', () => {
      const n = new PerlinNoise(42);
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          const v = n.fbm(x * 0.1, y * 0.1, 4, 2, 0.5);
          expect(v).toBeGreaterThanOrEqual(-1);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    });

    test('is deterministic — same inputs produce the same value', () => {
      const a = new PerlinNoise(99);
      const b = new PerlinNoise(99);
      expect(a.fbm(1.0, 2.0, 4, 2, 0.5)).toBe(b.fbm(1.0, 2.0, 4, 2, 0.5));
    });

    test('accepts custom octaves, lacunarity, persistence', () => {
      const n = new PerlinNoise(1);
      expect(() => n.fbm(0.5, 0.5, 6, 2.5, 0.4)).not.toThrow();
    });
  });
});
