import { describe, expect, test } from 'vite-plus/test';
import { Input } from '../src/index';

describe('Input', () => {
  test('consume() - clears a just pressed edge, keeps level state', () => {
    const savedWindow = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: unknown }).window = {
      addEventListener: () => {},
    };

    try {
      const input = new Input();
      input.update();

      (input as unknown as { keys: Set<string> }).keys.add('e');
      input.update();
      expect(input.isKeyPressed('e')).toBe(true);
      expect(input.isKeyDown('e')).toBe(true);

      input.consume('E');
      expect(input.isKeyPressed('e')).toBe(false);
      expect(input.isKeyDown('e')).toBe(true);
    } finally {
      (globalThis as { window?: unknown }).window = savedWindow;
    }
  });
});
