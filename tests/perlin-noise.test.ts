/**
 * Contract: PerlinNoise public API
 *
 * Verifies that every public member exists with the correct type.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import { PerlinNoise } from '../src/core/utils/perlin_noise';

describe('PerlinNoise', () => {
  const noise = new PerlinNoise(42);

  test('noise2d() — returns a number', () => {
    expect(typeof noise.noise2d(0.5, 0.5)).toBe('number');
  });

  test('fbm() — returns a number', () => {
    expect(typeof noise.fbm(0.5, 0.5)).toBe('number');
  });
});
