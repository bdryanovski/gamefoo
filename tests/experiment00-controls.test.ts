import { afterEach, describe, expect, test, vi } from 'vite-plus/test';
import { InputSystem } from '../src/index';
import {
  EXPERIMENT00_CONTROLS,
  GAME_ACTION,
  GAME_CONTROLS,
} from '../games/Experiment00/src/config/controls';
import { GAME_KEYS } from '../games/Experiment00/src/config/keymap';

type Handler = (event: Event) => void;

function stubWindow(): { emit: (type: string, event?: Record<string, unknown>) => void } {
  const handlers = new Map<string, Set<Handler>>();
  vi.stubGlobal('window', {
    addEventListener(type: string, handler: Handler) {
      const set = handlers.get(type) ?? new Set<Handler>();
      set.add(handler);
      handlers.set(type, set);
    },
    removeEventListener() {},
  });

  return {
    emit: (type, event = {}) => {
      for (const handler of handlers.get(type) ?? []) {
        handler(event as Event);
      }
    },
  };
}

function stubGamepad(pressed: Record<number, boolean>, axes: number[] = [0, 0, 0, 0]): void {
  const buttons = Array.from({ length: 17 }, (_, index) => ({
    get pressed() {
      return pressed[index] ?? false;
    },
    get touched() {
      return pressed[index] ?? false;
    },
    get value() {
      return pressed[index] ? 1 : 0;
    },
  }));
  vi.stubGlobal('navigator', {
    getGamepads: () => [{ buttons, axes } as unknown as Gamepad],
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Experiment00 controls', () => {
  test('uses the custom scheme by default and exposes game actions', () => {
    expect(GAME_CONTROLS).toBe(EXPERIMENT00_CONTROLS);
    for (const action of Object.values(GAME_ACTION)) {
      expect(Object.hasOwn(GAME_CONTROLS.actions, action)).toBe(true);
    }

    expect(GAME_KEYS.has('e')).toBe(true);
    expect(GAME_KEYS.has('escape')).toBe(true);
    expect(GAME_KEYS.has(' ')).toBe(true);
  });

  test('keyboard interact and inventory actions work', () => {
    const win = stubWindow();
    const input = new InputSystem({ scheme: GAME_CONTROLS });

    win.emit('keydown', { key: 'e' });
    input.update();
    expect(input.isActionPressed(GAME_ACTION.interact)).toBe(true);

    input.update();
    win.emit('keydown', { key: 'Escape' });
    input.update();
    expect(input.isActionPressed(GAME_ACTION.inventory)).toBe(true);
  });

  test('gamepad stick, D-pad, interact, and inventory buttons work', () => {
    stubWindow();
    const pressed: Record<number, boolean> = {};
    const axes = [0, 0, 0, 0];
    stubGamepad(pressed, axes);
    const input = new InputSystem({ scheme: GAME_CONTROLS });

    axes[0] = 0.8;
    input.update();
    expect(input.isAction(GAME_ACTION.right)).toBe(true);
    expect(input.getRawDirection()).toEqual({ x: 1, y: 0 });

    axes[0] = 0;
    pressed[0] = true;
    input.update();
    expect(input.isActionPressed(GAME_ACTION.interact)).toBe(true);

    pressed[0] = false;
    pressed[9] = true;
    input.update();
    expect(input.isAction(GAME_ACTION.inventory)).toBe(true);

    pressed[9] = false;
    pressed[12] = true;
    input.update();
    expect(input.isAction(GAME_ACTION.up)).toBe(true);
  });
});
