/**
 * API contract tests for GameObjectRegister
 *
 * Verifies the public surface: constructor, register(), get(), has(),
 * toArray(), getAll(), updateAll(), sort(), renderAll().
 *
 * Uses a minimal concrete Entity subclass (no browser APIs required).
 */
import { describe, expect, mock, test } from 'bun:test';
import GameObjectRegister from '../src/core/game_object_register';
import type { RenderContext } from '../src/core/renderer/type';
import Entity from '../src/entities/entity';

// Minimal concrete Entity for testing
class TestEntity extends Entity {
  updateCount = 0;
  renderCount = 0;

  constructor(id: string, x = 0, y = 0) {
    super(id, x, y, 10, 10);
  }

  override update(_dt: number) {
    this.updateCount++;
  }

  override render(_ctx: RenderContext) {
    this.renderCount++;
  }
}

// Minimal stub RenderContext
const stubCtx = {} as RenderContext;

describe('GameObjectRegister', () => {
  describe('constructor', () => {
    test('instantiates without throwing', () => {
      expect(() => new GameObjectRegister()).not.toThrow();
    });
  });

  describe('register()', () => {
    test('adds an object to the registry', () => {
      const reg = new GameObjectRegister();
      reg.register(new TestEntity('a'));
      expect(reg.has('a')).toBe(true);
    });

    test('overwrites an existing object with the same id', () => {
      const reg = new GameObjectRegister();
      const e1 = new TestEntity('x');
      const e2 = new TestEntity('x');
      reg.register(e1);
      reg.register(e2);
      expect(reg.get('x')).toBe(e2);
    });
  });

  describe('get()', () => {
    test('returns the registered object by id', () => {
      const reg = new GameObjectRegister();
      const e = new TestEntity('foo');
      reg.register(e);
      expect(reg.get('foo')).toBe(e);
    });

    test('returns undefined for an unknown id', () => {
      const reg = new GameObjectRegister();
      expect(reg.get('unknown')).toBeUndefined();
    });
  });

  describe('has()', () => {
    test('returns true for a registered id', () => {
      const reg = new GameObjectRegister();
      reg.register(new TestEntity('z'));
      expect(reg.has('z')).toBe(true);
    });

    test('returns false for an unregistered id', () => {
      const reg = new GameObjectRegister();
      expect(reg.has('missing')).toBe(false);
    });
  });

  describe('toArray()', () => {
    test('returns all registered objects as an array', () => {
      const reg = new GameObjectRegister();
      reg.register(new TestEntity('a'));
      reg.register(new TestEntity('b'));
      expect(reg.toArray()).toHaveLength(2);
    });

    test('returns an empty array when nothing is registered', () => {
      const reg = new GameObjectRegister();
      expect(reg.toArray()).toEqual([]);
    });
  });

  describe('getAll()', () => {
    test('returns all objects when no filter is provided', () => {
      const reg = new GameObjectRegister();
      reg.register(new TestEntity('a'));
      reg.register(new TestEntity('b'));
      expect(reg.getAll()).toHaveLength(2);
    });
  });

  describe('updateAll()', () => {
    test('calls update on every registered object', () => {
      const reg = new GameObjectRegister();
      const a = new TestEntity('a');
      const b = new TestEntity('b');
      reg.register(a);
      reg.register(b);
      reg.updateAll(0.016);
      expect(a.updateCount).toBe(1);
      expect(b.updateCount).toBe(1);
    });
  });

  describe('renderAll()', () => {
    test('calls render on every registered object', () => {
      const reg = new GameObjectRegister();
      const a = new TestEntity('a');
      const b = new TestEntity('b');
      reg.register(a);
      reg.register(b);
      reg.renderAll(stubCtx);
      expect(a.renderCount).toBe(1);
      expect(b.renderCount).toBe(1);
    });
  });

  describe('sort()', () => {
    test('reorders objects according to the comparator', () => {
      const reg = new GameObjectRegister();
      reg.register(new TestEntity('c', 0, 30));
      reg.register(new TestEntity('a', 0, 10));
      reg.register(new TestEntity('b', 0, 20));
      reg.sort((a, b) => a.y - b.y);
      const ids = reg.toArray().map((o) => o.id);
      expect(ids).toEqual(['a', 'b', 'c']);
    });
  });
});
