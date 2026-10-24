import { afterEach, describe, expect, test, vi } from 'vite-plus/test';
import { Input, InputMapper, binding, defineScheme } from '../src/index';

type Handler = (event: Event) => void;

function stubWindow(): { emit: (type: string, event?: Record<string, unknown>) => void } {
  const handlers = new Map<string, Set<Handler>>();
  const target = {
    addEventListener(type: string, handler: Handler) {
      const set = handlers.get(type) ?? new Set<Handler>();
      set.add(handler);
      handlers.set(type, set);
    },
    removeEventListener() {},
  };

  vi.stubGlobal('window', target);

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
    pressed: pressed[index] ?? false,
    touched: pressed[index] ?? false,
    value: pressed[index] ? 1 : 0,
  }));
  const gamepad = { buttons, axes } as unknown as Gamepad;
  vi.stubGlobal('navigator', { getGamepads: () => [gamepad] });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('InputMapper', () => {
  test('supports custom actions, aliases, directions, edges, and consume', () => {
    const win = stubWindow();
    const input = new Input();

    type Action = 'left' | 'right' | 'jump';
    const scheme = defineScheme<Action>({
      name: 'Runner',
      actions: {
        left: binding(['a']),
        right: binding(['d']),
        jump: binding(['space']),
      },
      directions: { up: 'jump', down: 'jump', left: 'left', right: 'right' },
      aliases: { DASH: 'jump' },
    });
    const mapper = new InputMapper(input, scheme);

    input.update();
    expect(mapper.isAction('left')).toBe(false);
    expect(mapper.isActionPressed('left')).toBe(false);

    win.emit('keydown', { key: 'a' });
    input.update();
    expect(mapper.isAction('left')).toBe(true);
    expect(mapper.isActionPressed('left')).toBe(true);
    expect(mapper.getRawDirection()).toEqual({ x: -1, y: 0 });

    input.update();
    expect(mapper.isActionPressed('left')).toBe(false);
    expect(mapper.isAction('left')).toBe(true);

    win.emit('keydown', { key: ' ' });
    input.update();
    expect(mapper.isAction('DASH')).toBe(true);
    expect(mapper.isActionPressed('jump')).toBe(true);
    mapper.consume('jump');
    expect(mapper.isActionPressed('jump')).toBe(false);
    expect(mapper.isAction('jump')).toBe(true);

    win.emit('keyup', { key: 'a' });
    input.update();
    expect(mapper.isActionReleased('left')).toBe(true);
  });

  test('tracks gamepad button and axis edges', () => {
    stubWindow();
    const pressed = { 0: false };
    stubGamepad(pressed);
    const input = new Input();

    type Action = 'jump' | 'right';
    const scheme = defineScheme<Action>({
      name: 'Pad',
      actions: {
        jump: binding([], { button: 0 }),
        right: binding([], { axis: 0, axisDirection: 1 }),
      },
      directions: { up: 'jump', down: 'jump', left: 'jump', right: 'right' },
    });
    const mapper = new InputMapper(input, scheme, { deadzone: 0.4 });

    input.update();
    expect(mapper.isAction('jump')).toBe(false);

    pressed[0] = true;
    stubGamepad(pressed);
    input.update();
    expect(mapper.isAction('jump')).toBe(true);
    expect(mapper.isActionPressed('jump')).toBe(true);

    input.update();
    expect(mapper.isActionPressed('jump')).toBe(false);
    expect(mapper.isAction('jump')).toBe(true);

    pressed[0] = false;
    stubGamepad(pressed);
    input.update();
    expect(mapper.isActionReleased('jump')).toBe(true);

    stubGamepad(pressed, [0.5, 0, 0, 0]);
    input.update();
    expect(mapper.isAction('right')).toBe(true);
    expect(mapper.getRawDirection()).toEqual({ x: 1, y: 0 });
    expect(mapper.getDirection().x).toBeCloseTo(0.5);
  });
});
