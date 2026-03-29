/**
 * API contract tests for World
 *
 * Verifies the public surface: constructor, register(), unregister(),
 * getColliders(), detect().
 *
 * Uses a minimal Collidable stand-in that exercises the public API
 * without requiring a real canvas or browser globals.
 */
import { describe, expect, test } from 'bun:test';
import type { Collidable } from '../src/core/behaviours/collidable';
import World from '../src/core/world';

// Minimal stub that satisfies enough of Collidable for World's public API
function makeCollidable(
  x: number,
  y: number,
  w: number,
  h: number,
  opts: Partial<{
    layer: number;
    tags: Set<string>;
    collidesWith: Set<string>;
    solid: boolean;
    fixed: boolean;
    enabled: boolean;
    onCollision: (info: unknown) => void;
  }> = {},
): Collidable {
  const owner = { x, y, id: String(Math.random()) };
  return {
    enabled: opts.enabled ?? true,
    layer: opts.layer ?? 0,
    tags: opts.tags ?? new Set<string>(),
    collidesWith: opts.collidesWith ?? new Set<string>(),
    solid: opts.solid ?? false,
    fixed: opts.fixed ?? false,
    shape: { type: 'aabb', width: w, height: h },
    onCollision: opts.onCollision,
    getOwner: () => owner as unknown as ReturnType<Collidable['getOwner']>,
    getWorldBounds: () => ({ x, y, width: w, height: h }),
    // satisfy abstract members not used in World
    type: 'collidable',
    priority: 1,
    key: 'collidable',
    update: () => {},
  } as unknown as Collidable;
}

describe('World', () => {
  describe('constructor', () => {
    test('instantiates without throwing', () => {
      expect(() => new World()).not.toThrow();
    });
  });

  describe('register() / getColliders()', () => {
    test('registers a collider and it appears in getColliders()', () => {
      const world = new World();
      const c = makeCollidable(0, 0, 32, 32);
      world.register(c);
      expect(world.getColliders().has(c)).toBe(true);
    });
  });

  describe('unregister()', () => {
    test('removes a registered collider', () => {
      const world = new World();
      const c = makeCollidable(0, 0, 32, 32);
      world.register(c);
      world.unregister(c);
      expect(world.getColliders().has(c)).toBe(false);
    });

    test('is a no-op for an unregistered collider', () => {
      const world = new World();
      const c = makeCollidable(0, 0, 32, 32);
      expect(() => world.unregister(c)).not.toThrow();
    });
  });

  describe('getColliders()', () => {
    test('returns a ReadonlySet', () => {
      const world = new World();
      const set = world.getColliders();
      expect(set).toBeInstanceOf(Set);
    });

    test('starts empty', () => {
      const world = new World();
      expect(world.getColliders().size).toBe(0);
    });
  });

  describe('detect()', () => {
    test('does not throw on an empty world', () => {
      const world = new World();
      expect(() => world.detect()).not.toThrow();
    });

    test('fires onCollision when two overlapping AABB colliders share a tag interest', () => {
      const world = new World();
      let firedA = false;
      let firedB = false;

      const a = makeCollidable(0, 0, 32, 32, {
        tags: new Set(['player']),
        collidesWith: new Set(['enemy']),
        onCollision: () => {
          firedA = true;
        },
      });
      const b = makeCollidable(10, 10, 32, 32, {
        tags: new Set(['enemy']),
        collidesWith: new Set(['player']),
        onCollision: () => {
          firedB = true;
        },
      });

      world.register(a);
      world.register(b);
      world.detect();

      expect(firedA).toBe(true);
      expect(firedB).toBe(true);
    });

    test('does not fire onCollision when colliders are on different layers', () => {
      const world = new World();
      let fired = false;

      const a = makeCollidable(0, 0, 32, 32, {
        layer: 0,
        tags: new Set(['x']),
        collidesWith: new Set(['y']),
        onCollision: () => {
          fired = true;
        },
      });
      const b = makeCollidable(0, 0, 32, 32, {
        layer: 1,
        tags: new Set(['y']),
        collidesWith: new Set(['x']),
      });

      world.register(a);
      world.register(b);
      world.detect();

      expect(fired).toBe(false);
    });

    test('does not fire onCollision for non-overlapping colliders', () => {
      const world = new World();
      let fired = false;

      const a = makeCollidable(0, 0, 32, 32, {
        tags: new Set(['x']),
        collidesWith: new Set(['y']),
        onCollision: () => {
          fired = true;
        },
      });
      const b = makeCollidable(1000, 1000, 32, 32, {
        tags: new Set(['y']),
        collidesWith: new Set(['x']),
      });

      world.register(a);
      world.register(b);
      world.detect();

      expect(fired).toBe(false);
    });

    test('skips disabled colliders', () => {
      const world = new World();
      let fired = false;

      const a = makeCollidable(0, 0, 32, 32, {
        enabled: false,
        tags: new Set(['x']),
        collidesWith: new Set(['y']),
        onCollision: () => {
          fired = true;
        },
      });
      const b = makeCollidable(0, 0, 32, 32, {
        tags: new Set(['y']),
        collidesWith: new Set(['x']),
      });

      world.register(a);
      world.register(b);
      world.detect();

      expect(fired).toBe(false);
    });
  });
});
