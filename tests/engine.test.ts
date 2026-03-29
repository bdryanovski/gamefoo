/**
 * API contract tests for Engine
 *
 * Verifies the public surface: constructor, dementions getter,
 * use(), resize(), setup(), pause(), destroy(), update() and render()
 * override hooks.
 *
 * Uses a stub RenderContext (no canvas) and a synchronous loop driver
 * so tests run without browser APIs or real timers.
 */
import { describe, expect, mock, test } from 'bun:test';
import Engine from '../src/core/engine';
import type { LoopDriver } from '../src/core/renderer/loops/loop';
import type { RenderContext } from '../src/core/renderer/type';
import type { SubSystem } from '../src/subsystems/types';

// ── Stubs ────────────────────────────────────────────────────────────────────

/** A no-op loop driver that never starts a real timer. */
function makeLoopDriver(autoTick = false): LoopDriver & { tick: () => void } {
  let _callback: ((dt: number) => void) | null = null;
  return {
    start(cb) {
      _callback = cb;
      if (autoTick) cb(0.016);
    },
    stop() {
      _callback = null;
    },
    tick() {
      _callback?.(0.016);
    },
  };
}

/** Minimal stub satisfying RenderContext. */
function makeCtx(width = 800, height = 600): RenderContext {
  return {
    width,
    height,
    clear: mock(() => {}),
    flush: mock(() => {}),
    save: mock(() => {}),
    restore: mock(() => {}),
    translate: mock(() => {}),
    scale: mock(() => {}),
    fillRect: mock(() => {}),
    strokeRect: mock(() => {}),
    drawText: mock(() => {}),
    drawChar: mock(() => {}),
    drawLine: mock(() => {}),
    drawCircle: mock(() => {}),
  } as unknown as RenderContext;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Engine', () => {
  describe('constructor', () => {
    test('instantiates with a renderer', () => {
      const loop = makeLoopDriver();
      expect(() => new Engine(makeCtx(), { loopDriver: loop })).not.toThrow();
    });

    test('accepts an optional config object', () => {
      const loop = makeLoopDriver();
      expect(
        () =>
          new Engine(makeCtx(), {
            backgroundColor: '#ff0000',
            loopDriver: loop,
          }),
      ).not.toThrow();
    });
  });

  describe('dementions', () => {
    test('returns the renderer dimensions at construction time', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(1024, 768), { loopDriver: loop });
      expect(engine.dementions).toEqual({ width: 1024, height: 768 });
    });

    test('returns an object with width and height properties', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      expect(engine.dementions).toHaveProperty('width');
      expect(engine.dementions).toHaveProperty('height');
    });
  });

  describe('resize()', () => {
    test('updates dementions', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      engine.resize(1280, 720);
      expect(engine.dementions).toEqual({ width: 1280, height: 720 });
    });
  });

  describe('use()', () => {
    test('returns the engine instance for fluent chaining', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      const subsystem: SubSystem = {
        id: 'test',
        order: 10,
        init: mock(() => {}),
        update: mock(() => {}),
        render: mock(() => {}),
        destroy: mock(() => {}),
      };
      expect(engine.use(subsystem)).toBe(engine);
    });

    test('calls init on the subsystem when attached', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      const initFn = mock(() => {});
      const subsystem: SubSystem = { id: 'test', order: 10, init: initFn };
      engine.use(subsystem);
      expect(initFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('setup()', () => {
    test('calls the provided setupFn', async () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      const setupFn = mock(() => {});
      await engine.setup(setupFn);
      expect(setupFn).toHaveBeenCalledTimes(1);
    });

    test('calling setup() a second time is a no-op', async () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      const setupFn = mock(() => {});
      await engine.setup(setupFn);
      await engine.setup(setupFn);
      expect(setupFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('pause()', () => {
    test('does not throw', async () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      await engine.setup();
      expect(() => engine.pause()).not.toThrow();
    });
  });

  describe('clearScrean()', () => {
    test('calls clear() on the render context', async () => {
      const ctx = makeCtx();
      const loop = makeLoopDriver();
      const engine = new Engine(ctx, { loopDriver: loop });
      engine.clearScrean();
      expect(ctx.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy()', () => {
    test('calls destroy on every subsystem', async () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      const destroyFn = mock(() => {});
      const subsystem: SubSystem = {
        id: 'test',
        order: 10,
        destroy: destroyFn,
      };
      engine.use(subsystem);
      await engine.setup();
      engine.destroy();
      expect(destroyFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('update() override hook', () => {
    test('is callable and is a no-op by default', () => {
      const loop = makeLoopDriver();
      const engine = new Engine(makeCtx(), { loopDriver: loop });
      expect(() => engine.update(0.016)).not.toThrow();
    });

    test('subclass can override update()', async () => {
      const loop = makeLoopDriver();
      let dt = 0;
      class MyGame extends Engine {
        override update(deltaTime: number) {
          dt = deltaTime;
        }
      }
      const game = new MyGame(makeCtx(), { loopDriver: loop });
      game.update(0.033);
      expect(dt).toBe(0.033);
    });
  });

  describe('render() override hook', () => {
    test('is callable and is a no-op by default', () => {
      const loop = makeLoopDriver();
      const ctx = makeCtx();
      const engine = new Engine(ctx, { loopDriver: loop });
      expect(() => engine.render(ctx)).not.toThrow();
    });

    test('subclass can override render()', () => {
      const loop = makeLoopDriver();
      const ctx = makeCtx();
      let renderCalled = false;
      class MyGame extends Engine {
        override render(_ctx: RenderContext) {
          renderCalled = true;
        }
      }
      const game = new MyGame(ctx, { loopDriver: loop });
      game.render(ctx);
      expect(renderCalled).toBe(true);
    });
  });
});
