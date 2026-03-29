/**
 * Contract: World public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'bun:test';
import type { Collidable } from '../src/core/behaviours/collidable';
import World from '../src/core/world';

// Minimal stub satisfying the Collidable interface as seen by World
function makeCollidable(): Collidable {
  return {
    enabled: true,
    layer: 0,
    tags: new Set<string>(),
    collidesWith: new Set<string>(),
    solid: false,
    fixed: false,
    shape: { type: 'aabb', width: 32, height: 32 },
    getOwner: () => ({ x: 0, y: 0, id: 'stub' }) as unknown as ReturnType<Collidable['getOwner']>,
    getWorldBounds: () => ({ x: 0, y: 0, width: 32, height: 32 }),
    type: 'collidable',
    priority: 1,
    key: 'collidable',
    update: () => {},
  } as unknown as Collidable;
}

describe('World', () => {
  const world = new World();
  const collider = makeCollidable();

  test('register() — callable, returns void', () => {
    expect(typeof world.register).toBe('function');
    expect(world.register(collider)).toBeUndefined();
  });

  test('unregister() — callable, returns void', () => {
    expect(typeof world.unregister).toBe('function');
    expect(world.unregister(collider)).toBeUndefined();
  });

  test('getColliders() — returns a Set', () => {
    expect(world.getColliders()).toBeInstanceOf(Set);
  });

  test('detect() — callable, returns void', () => {
    expect(typeof world.detect).toBe('function');
    expect(world.detect()).toBeUndefined();
  });
});
