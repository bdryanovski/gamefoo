/**
 * API contract tests for Camera
 *
 * Verifies the public surface: constructor, follow(), moveTo(),
 * getPosition(), getViewRect(), resize().
 */
import { describe, expect, test } from 'bun:test';
import Camera from '../src/core/camera';

describe('Camera', () => {
  describe('constructor', () => {
    test('instantiates without throwing', () => {
      expect(() => new Camera(800, 600)).not.toThrow();
    });
  });

  describe('follow()', () => {
    test('centres the camera on the given target', () => {
      const cam = new Camera(800, 600);
      cam.follow({ x: 100, y: 200 });
      expect(cam.getPosition()).toEqual({ x: 100, y: 200 });
    });
  });

  describe('moveTo()', () => {
    test('moves the camera to the given position', () => {
      const cam = new Camera(800, 600);
      cam.moveTo({ x: 500, y: 300 });
      expect(cam.getPosition()).toEqual({ x: 500, y: 300 });
    });

    test('is functionally equivalent to follow()', () => {
      const cam1 = new Camera(800, 600);
      const cam2 = new Camera(800, 600);
      cam1.follow({ x: 42, y: 13 });
      cam2.moveTo({ x: 42, y: 13 });
      expect(cam1.getPosition()).toEqual(cam2.getPosition());
    });
  });

  describe('getPosition()', () => {
    test('returns { x: 0, y: 0 } initially', () => {
      const cam = new Camera(800, 600);
      expect(cam.getPosition()).toEqual({ x: 0, y: 0 });
    });

    test('returns an object with x and y properties', () => {
      const cam = new Camera(800, 600);
      const pos = cam.getPosition();
      expect(pos).toHaveProperty('x');
      expect(pos).toHaveProperty('y');
    });
  });

  describe('getViewRect()', () => {
    test('returns an object with x, y, width, height', () => {
      const cam = new Camera(800, 600);
      const rect = cam.getViewRect();
      expect(rect).toHaveProperty('x');
      expect(rect).toHaveProperty('y');
      expect(rect).toHaveProperty('width');
      expect(rect).toHaveProperty('height');
    });

    test('rect is centred on the camera position', () => {
      const cam = new Camera(800, 600);
      cam.moveTo({ x: 400, y: 300 });
      const rect = cam.getViewRect();
      expect(rect.x).toBe(0);   // 400 - 400
      expect(rect.y).toBe(0);   // 300 - 300
    });

    test('rect width and height match the viewport dimensions', () => {
      const cam = new Camera(800, 600);
      const rect = cam.getViewRect();
      expect(rect.width).toBe(800);
      expect(rect.height).toBe(600);
    });

    test('top-left x = cameraX - width/2', () => {
      const cam = new Camera(800, 600);
      cam.moveTo({ x: 200, y: 100 });
      const rect = cam.getViewRect();
      expect(rect.x).toBe(200 - 400);
    });
  });

  describe('resize()', () => {
    test('updates the viewport dimensions used by getViewRect()', () => {
      const cam = new Camera(800, 600);
      cam.resize(1280, 720);
      const rect = cam.getViewRect();
      expect(rect.width).toBe(1280);
      expect(rect.height).toBe(720);
    });
  });
});
