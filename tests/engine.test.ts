/**
 * Contract: Engine public API
 *
 * Verifies that every public member exists with the correct type/shape.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'vitest';
import Engine from '../src/core/engine';
import type { LoopDriver } from '../src/core/renderer/loops/loop';
import type { RenderContext } from '../src/core/renderer/type';
import type { SubSystem } from '../src/subsystems/types';

function makeLoopDriver(): LoopDriver {
  return { start: () => {}, stop: () => {} };
}

function makeCtx(width = 800, height = 600): RenderContext {
  return {
    width,
    height,
    gameScale: 1,
    readGameScale: () => 1,
    clear: () => {},
    flush: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    drawText: () => {},
    drawChar: () => {},
    drawLine: () => {},
    drawCircle: () => {},
  } as unknown as RenderContext;
}

describe('Engine', () => {
  const engine = new Engine(makeCtx(), { loopDriver: makeLoopDriver() });

  test('dementions — returns { width, height }', () => {
    const r = engine.dementions;
    expect(typeof r.width).toBe('number');
    expect(typeof r.height).toBe('number');
  });

  test('use() — returns the engine (chainable)', () => {
    const sub: SubSystem = { id: 'test', order: 10 };
    expect(engine.use(sub)).toBe(engine);
  });

  test('resize() — callable, returns void', () => {
    expect(typeof engine.resize).toBe('function');
    expect(engine.resize(1280, 720)).toBeUndefined();
  });

  test('setup() — callable, returns a Promise', () => {
    const result = engine.setup();
    expect(result).toBeInstanceOf(Promise);
  });

  test('pause() — callable, returns void', () => {
    expect(typeof engine.pause).toBe('function');
    expect(engine.pause()).toBeUndefined();
  });

  test('clearScrean() — callable, returns void', () => {
    expect(typeof engine.clearScrean).toBe('function');
    expect(engine.clearScrean()).toBeUndefined();
  });

  test('update() — callable, returns void', () => {
    expect(typeof engine.update).toBe('function');
    expect(engine.update(0.016)).toBeUndefined();
  });

  test('render() — callable, returns void', () => {
    expect(typeof engine.render).toBe('function');
    expect(engine.render(makeCtx())).toBeUndefined();
  });

  test('destroy() — callable, returns void', () => {
    expect(typeof engine.destroy).toBe('function');
    expect(engine.destroy()).toBeUndefined();
  });
});
