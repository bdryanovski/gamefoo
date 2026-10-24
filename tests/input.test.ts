import { afterEach, describe, expect, test, vi } from 'vite-plus/test';
import { Input } from '../src/index';

type Handler = (event: Event) => void;

function stubWindow(): {
  emit: (type: string, event?: Record<string, unknown>) => void;
  listenerCount: (type: string) => number;
} {
  const handlers = new Map<string, Set<Handler>>();

  const target = {
    addEventListener(type: string, handler: Handler) {
      const set = handlers.get(type) ?? new Set<Handler>();
      set.add(handler);
      handlers.set(type, set);
    },
    removeEventListener(type: string, handler: Handler) {
      handlers.get(type)?.delete(handler);
    },
  };

  vi.stubGlobal('window', target);

  return {
    emit: (type, event = {}) => {
      for (const handler of handlers.get(type) ?? []) {
        handler(event as Event);
      }
    },
    listenerCount: (type) => handlers.get(type)?.size ?? 0,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Input', () => {
  test('tracks down, pressed, released, and consumed edges', () => {
    const win = stubWindow();
    const input = new Input();

    input.update();
    win.emit('keydown', { key: 'E' });
    input.update();

    expect(input.isKeyDown('e')).toBe(true);
    expect(input.isKeyPressed('e')).toBe(true);

    input.consume('E');
    expect(input.isKeyPressed('e')).toBe(false);
    expect(input.isKeyDown('e')).toBe(true);

    input.update();
    expect(input.isKeyPressed('e')).toBe(false);
    expect(input.isKeyDown('e')).toBe(true);

    win.emit('keyup', { key: 'e' });
    input.update();
    expect(input.isKeyDown('e')).toBe(false);
    expect(input.isKeyReleased('e')).toBe(true);
  });

  test('tracks mouse buttons and viewport coordinates', () => {
    const win = stubWindow();
    const input = new Input();

    win.emit('mousemove', { clientX: 12, clientY: 34 });
    win.emit('mousedown', { button: 0 });
    input.update();

    expect(input.getMousePosition()).toEqual({ x: 12, y: 34 });
    expect(input.isMouseButtonDown(0)).toBe(true);
    expect(input.isMouseButtonPressed(0)).toBe(true);

    win.emit('mouseup', { button: 0 });
    input.update();
    expect(input.isMouseButtonDown(0)).toBe(false);
    expect(input.isMouseButtonReleased(0)).toBe(true);
  });

  test('reset and blur clear held input', () => {
    const win = stubWindow();
    const input = new Input();

    win.emit('keydown', { key: 'a' });
    input.update();
    expect(input.isKeyDown('a')).toBe(true);

    win.emit('blur');
    expect(input.isKeyDown('a')).toBe(false);
    expect(input.getPressedKeys().size).toBe(0);
  });

  test('destroy removes all event listeners', () => {
    const win = stubWindow();
    const input = new Input();

    expect(win.listenerCount('keydown')).toBe(1);
    input.destroy();
    expect(win.listenerCount('keydown')).toBe(0);
    expect(win.listenerCount('mousemove')).toBe(0);
  });
});
