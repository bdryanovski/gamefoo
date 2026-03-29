/**
 * API contract tests for Entity and Behaviour
 *
 * Verifies the Entity public surface: constructor, id, x/y getters+setters,
 * getPosition(), getSize(), setSize(), attachBehaviour(), detachBehaviour(),
 * getBehaviour(), hasBehaviour(), getBehavioursByType().
 *
 * Also verifies Behaviour public surface: type, key, enabled, priority,
 * onAttach, onDetach lifecycle hooks.
 */
import { describe, expect, mock, test } from 'bun:test';
import { Behaviour } from '../src/core/behaviour';
import type { RenderContext } from '../src/core/renderer/type';
import Entity from '../src/entities/entity';

// ── Concrete stubs ────────────────────────────────────────────────────────────

class ConcreteEntity extends Entity {
  override update(_dt: number) {}
  override render(_ctx: RenderContext) {}
}

class HealthBehaviour extends Behaviour<ConcreteEntity> {
  readonly type = 'health';
  hp = 100;
  override update(_dt: number) {}
}

class SpeedBehaviour extends Behaviour<ConcreteEntity> {
  readonly type = 'speed';
  override update(_dt: number) {}
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Entity', () => {
  describe('constructor', () => {
    test('sets id, x, y', () => {
      const e = new ConcreteEntity('hero', 100, 200);
      expect(e.id).toBe('hero');
      expect(e.x).toBe(100);
      expect(e.y).toBe(200);
    });

    test('sets size when width and height are provided', () => {
      const e = new ConcreteEntity('box', 0, 0, 32, 64);
      expect(e.getSize()).toEqual({ width: 32, height: 64 });
    });

    test('defaults size to { width: 0, height: 0 } when not provided', () => {
      const e = new ConcreteEntity('point', 10, 20);
      expect(e.getSize()).toEqual({ width: 0, height: 0 });
    });
  });

  describe('x / y getters and setters', () => {
    test('x getter returns current x', () => {
      const e = new ConcreteEntity('e', 5, 10);
      expect(e.x).toBe(5);
    });

    test('x setter updates x', () => {
      const e = new ConcreteEntity('e', 0, 0);
      e.x = 42;
      expect(e.x).toBe(42);
    });

    test('y getter returns current y', () => {
      const e = new ConcreteEntity('e', 5, 10);
      expect(e.y).toBe(10);
    });

    test('y setter updates y', () => {
      const e = new ConcreteEntity('e', 0, 0);
      e.y = 77;
      expect(e.y).toBe(77);
    });
  });

  describe('getPosition()', () => {
    test('returns an object with x and y', () => {
      const e = new ConcreteEntity('e', 3, 7);
      expect(e.getPosition()).toEqual({ x: 3, y: 7 });
    });
  });

  describe('getSize()', () => {
    test('returns an object with width and height', () => {
      const e = new ConcreteEntity('e', 0, 0, 16, 24);
      expect(e.getSize()).toEqual({ width: 16, height: 24 });
    });
  });

  describe('setSize()', () => {
    test('updates width and height', () => {
      const e = new ConcreteEntity('e', 0, 0, 10, 10);
      e.setSize(50, 80);
      expect(e.getSize()).toEqual({ width: 50, height: 80 });
    });
  });

  describe('attachBehaviour()', () => {
    test('returns the behaviour instance', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      expect(e.attachBehaviour(b)).toBe(b);
    });

    test('makes the behaviour retrievable via getBehaviour()', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      e.attachBehaviour(b);
      expect(e.getBehaviour('health')).toBe(b);
    });

    test('calls onAttach hook when defined', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      const onAttach = mock(() => {});
      b.onAttach = onAttach;
      e.attachBehaviour(b);
      expect(onAttach).toHaveBeenCalledTimes(1);
    });
  });

  describe('detachBehaviour()', () => {
    test('removes the behaviour', () => {
      const e = new ConcreteEntity('e', 0, 0);
      e.attachBehaviour(new HealthBehaviour(e));
      e.detachBehaviour('health');
      expect(e.hasBehaviour('health')).toBe(false);
    });

    test('calls onDetach hook when defined', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      const onDetach = mock(() => {});
      b.onDetach = onDetach;
      e.attachBehaviour(b);
      e.detachBehaviour('health');
      expect(onDetach).toHaveBeenCalledTimes(1);
    });

    test('is a no-op for a key that does not exist', () => {
      const e = new ConcreteEntity('e', 0, 0);
      expect(() => e.detachBehaviour('nonexistent')).not.toThrow();
    });
  });

  describe('getBehaviour()', () => {
    test('returns the behaviour when attached', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      e.attachBehaviour(b);
      expect(e.getBehaviour('health')).toBe(b);
    });

    test('returns undefined when not attached', () => {
      const e = new ConcreteEntity('e', 0, 0);
      expect(e.getBehaviour('health')).toBeUndefined();
    });

    test('lookup is case-insensitive', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      e.attachBehaviour(b);
      expect(e.getBehaviour('HEALTH')).toBe(b);
    });
  });

  describe('hasBehaviour()', () => {
    test('returns true when the behaviour is attached', () => {
      const e = new ConcreteEntity('e', 0, 0);
      e.attachBehaviour(new HealthBehaviour(e));
      expect(e.hasBehaviour('health')).toBe(true);
    });

    test('returns false when the behaviour is not attached', () => {
      const e = new ConcreteEntity('e', 0, 0);
      expect(e.hasBehaviour('health')).toBe(false);
    });
  });

  describe('getBehavioursByType()', () => {
    test('returns all behaviours of the given class', () => {
      const e = new ConcreteEntity('e', 0, 0);
      e.attachBehaviour(new HealthBehaviour(e));
      e.attachBehaviour(new SpeedBehaviour(e));
      const healths = e.getBehavioursByType(HealthBehaviour);
      expect(healths).toHaveLength(1);
      expect(healths[0]).toBeInstanceOf(HealthBehaviour);
    });

    test('returns an empty array when no match', () => {
      const e = new ConcreteEntity('e', 0, 0);
      expect(e.getBehavioursByType(HealthBehaviour)).toHaveLength(0);
    });
  });
});

describe('Behaviour', () => {
  describe('key', () => {
    test('is the lowercase of type', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      expect(b.key).toBe('health');
    });
  });

  describe('enabled', () => {
    test('defaults to true', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      expect(b.enabled).toBe(true);
    });

    test('can be set to false', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      b.enabled = false;
      expect(b.enabled).toBe(false);
    });
  });

  describe('priority', () => {
    test('defaults to 1', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      expect(b.priority).toBe(1);
    });

    test('can be set to a custom value', () => {
      const e = new ConcreteEntity('e', 0, 0);
      const b = new HealthBehaviour(e);
      b.priority = 5;
      expect(b.priority).toBe(5);
    });
  });
});
