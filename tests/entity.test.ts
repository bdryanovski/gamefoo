/**
 * Contract: Entity and Behaviour public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'vitest';
import { Behaviour } from '../src/core/behaviour';
import type { RenderContext } from '../src/core/renderer/type';
import Entity from '../src/entities/entity';

class StubEntity extends Entity {
  override update() {}
  override render(_ctx: RenderContext) {}
}

class StubBehaviour extends Behaviour<StubEntity> {
  readonly type = 'stub';
  override update(_dt: number) {}
}

describe('Entity', () => {
  const entity = new StubEntity('hero', 10, 20, 32, 64);
  const behaviour = new StubBehaviour(entity);
  entity.attachBehaviour(behaviour);

  test('id — string', () => {
    expect(typeof entity.id).toBe('string');
  });

  test('x — readable and writable number', () => {
    expect(typeof entity.x).toBe('number');
    entity.x = 5;
    expect(entity.x).toBe(5);
  });

  test('y — readable and writable number', () => {
    expect(typeof entity.y).toBe('number');
    entity.y = 15;
    expect(entity.y).toBe(15);
  });

  test('getPosition() — returns { x, y }', () => {
    const r = entity.getPosition();
    expect(typeof r.x).toBe('number');
    expect(typeof r.y).toBe('number');
  });

  test('getSize() — returns { width, height }', () => {
    const r = entity.getSize();
    expect(typeof r.width).toBe('number');
    expect(typeof r.height).toBe('number');
  });

  test('setSize() — callable, returns void', () => {
    expect(typeof entity.setSize).toBe('function');
    expect(entity.setSize(16, 16)).toBeUndefined();
  });

  test('attachBehaviour() — returns the behaviour', () => {
    const b = new StubBehaviour(entity);
    expect(entity.attachBehaviour(b)).toBe(b);
  });

  test('detachBehaviour() — callable, returns void', () => {
    expect(typeof entity.detachBehaviour).toBe('function');
    expect(entity.detachBehaviour('stub')).toBeUndefined();
  });

  test('getBehaviour() — returns the behaviour or undefined', () => {
    entity.attachBehaviour(behaviour);
    expect(entity.getBehaviour('stub')).toBe(behaviour);
    expect(entity.getBehaviour('missing')).toBeUndefined();
  });

  test('hasBehaviour() — returns boolean', () => {
    expect(typeof entity.hasBehaviour('stub')).toBe('boolean');
  });

  test('getBehavioursByType() — returns an array', () => {
    expect(Array.isArray(entity.getBehavioursByType(StubBehaviour))).toBe(true);
  });
});

describe('Behaviour', () => {
  const entity = new StubEntity('e', 0, 0);
  const b = new StubBehaviour(entity);

  test('type — string', () => {
    expect(typeof b.type).toBe('string');
  });

  test('key — string (lowercased type)', () => {
    expect(typeof b.key).toBe('string');
  });

  test('enabled — boolean', () => {
    expect(typeof b.enabled).toBe('boolean');
  });

  test('priority — number', () => {
    expect(typeof b.priority).toBe('number');
  });

  test('update() — callable', () => {
    expect(typeof b.update).toBe('function');
    expect(() => b.update(0.016)).not.toThrow();
  });
});
