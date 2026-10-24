/**
 * Contract: Input registered as an Engine subsystem.
 *
 * The engine must compute just-pressed edges exactly once per frame, early
 * enough that later systems still read the edge. Regression: Input used to
 * expose both `preUpdate` (which called `update`) and `update`, so the engine
 * ran the edge computation twice and cleared the edge before any other system
 * saw it — pressing E on the splash screen did nothing.
 */
import { describe, expect, test } from 'vite-plus/test';
import { Engine, Input, InputSystem, NES_CONTROLS } from '../src/index';
import type { LoopDriver } from '../src/core/renderer/loops/loop';
import type { RenderContext } from '../src/core/renderer/type';
import type { SubSystem } from '../src/subsystems/types';

function makeCtx(): RenderContext {
  return {
    width: 800,
    height: 600,
    readGameScale: () => 1,
    clear: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    fillRect: () => {},
  } as unknown as RenderContext;
}

function stubbedWindow() {
  const handlers: Record<string, Array<(event: unknown) => void>> = {};
  return {
    win: {
      addEventListener: (type: string, cb: (event: unknown) => void) => {
        (handlers[type] ??= []).push(cb);
      },
      removeEventListener: () => {},
    },
    handlers,
  };
}

describe('Input as an Engine subsystem', () => {
  test('a press edge survives to later systems in the same frame', async () => {
    const savedWindow = (globalThis as { window?: unknown }).window;
    const { win, handlers } = stubbedWindow();
    (globalThis as { window?: unknown }).window = win;

    try {
      let tick: ((dt: number) => void) | undefined;
      const driver: LoopDriver = {
        start: (cb) => {
          tick = cb;
        },
        stop: () => {},
      };
      const engine = new Engine(makeCtx(), { loopDriver: driver });
      const input = new Input();
      const seen: boolean[] = [];
      const probe: SubSystem = {
        id: 'probe',
        order: 50,
        update: () => {
          seen.push(input.isKeyPressed('e'));
        },
      };
      engine.use(input).use(probe);
      await engine.setup();

      for (const handler of handlers.keydown ?? []) {
        handler({ key: 'e' });
      }
      tick?.(0.016);

      expect(seen).toEqual([true]);
    } finally {
      (globalThis as { window?: unknown }).window = savedWindow;
    }
  });

  test('InputSystem updates actions before later systems in the same frame', async () => {
    const savedWindow = (globalThis as { window?: unknown }).window;
    const { win, handlers } = stubbedWindow();
    (globalThis as { window?: unknown }).window = win;

    try {
      let tick: ((dt: number) => void) | undefined;
      const driver: LoopDriver = {
        start: (cb) => {
          tick = cb;
        },
        stop: () => {},
      };
      const engine = new Engine(makeCtx(), { loopDriver: driver });
      const input = new InputSystem({ scheme: NES_CONTROLS });
      const seen: boolean[] = [];
      const probe: SubSystem = {
        id: 'probe',
        order: 50,
        update: () => {
          seen.push(input.isActionPressed('A'));
        },
      };
      engine.use(input).use(probe);
      await engine.setup();

      for (const handler of handlers.keydown ?? []) {
        handler({ key: 'x' });
      }
      tick?.(0.016);

      expect(seen).toEqual([true]);
    } finally {
      (globalThis as { window?: unknown }).window = savedWindow;
    }
  });

  test('Input exposes no preUpdate hook (would re-run the frame twice)', () => {
    const savedWindow = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: unknown }).window = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };

    try {
      const input = new Input();
      expect((input as unknown as { preUpdate?: unknown }).preUpdate).toBeUndefined();
    } finally {
      (globalThis as { window?: unknown }).window = savedWindow;
    }
  });
});
