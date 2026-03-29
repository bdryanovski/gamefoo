/**
 * Contract: Camera public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import Camera from '../src/core/camera';

describe('Camera', () => {
  const cam = new Camera(800, 600);

  test('follow() — callable, returns void', () => {
    expect(typeof cam.follow).toBe('function');
    expect(cam.follow({ x: 0, y: 0 })).toBeUndefined();
  });

  test('moveTo() — callable, returns void', () => {
    expect(typeof cam.moveTo).toBe('function');
    expect(cam.moveTo({ x: 0, y: 0 })).toBeUndefined();
  });

  test('getPosition() — returns { x, y }', () => {
    const r = cam.getPosition();
    expect(typeof r.x).toBe('number');
    expect(typeof r.y).toBe('number');
  });

  test('getViewRect() — returns { x, y, width, height }', () => {
    const r = cam.getViewRect();
    expect(typeof r.x).toBe('number');
    expect(typeof r.y).toBe('number');
    expect(typeof r.width).toBe('number');
    expect(typeof r.height).toBe('number');
  });

  test('resize() — callable, returns void', () => {
    expect(typeof cam.resize).toBe('function');
    expect(cam.resize(1280, 720)).toBeUndefined();
  });
});
