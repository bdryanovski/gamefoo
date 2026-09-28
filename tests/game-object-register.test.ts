/**
 * Contract: GameObjectRegister public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'vitest';
import GameObjectRegister from '../src/core/game_object_register';
import type { RenderContext } from '../src/core/renderer/type';
import Entity from '../src/entities/entity';

class StubEntity extends Entity {
  override update() {}
  override render(_ctx: RenderContext) {}
}

const stubCtx = {} as RenderContext;

describe('GameObjectRegister', () => {
  const reg = new GameObjectRegister();
  const entity = new StubEntity('a', 0, 0);
  reg.register(entity);

  test('register() — callable, returns void', () => {
    expect(typeof reg.register).toBe('function');
    expect(reg.register(new StubEntity('b', 0, 0))).toBeUndefined();
  });

  test('get() — returns the registered object or undefined', () => {
    expect(reg.get('a')).toBe(entity);
    expect(reg.get('missing')).toBeUndefined();
  });

  test('has() — returns boolean', () => {
    expect(typeof reg.has('a')).toBe('boolean');
  });

  test('toArray() — returns an array', () => {
    expect(Array.isArray(reg.toArray())).toBe(true);
  });

  test('getAll() — returns an array', () => {
    expect(Array.isArray(reg.getAll())).toBe(true);
  });

  test('updateAll() — callable, returns void', () => {
    expect(typeof reg.updateAll).toBe('function');
    expect(reg.updateAll(0.016)).toBeUndefined();
  });

  test('renderAll() — callable, returns void', () => {
    expect(typeof reg.renderAll).toBe('function');
    expect(reg.renderAll(stubCtx)).toBeUndefined();
  });

  test('sort() — callable, returns void', () => {
    expect(typeof reg.sort).toBe('function');
    expect(reg.sort((a, b) => a.y - b.y)).toBeUndefined();
  });
});
