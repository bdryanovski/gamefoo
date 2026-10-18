import { describe, expect, test } from 'vite-plus/test';
import { GameFlow } from '../games/Experiment00/src/systems/flow';

describe('GameFlow', () => {
  test('world is active while the stack is empty', () => {
    const flow = new GameFlow();
    expect(flow.worldActive).toBe(true);
  });

  test('push/pop freeze and unfreeze; double-push is one modal; extra pop is a no-op', () => {
    const flow = new GameFlow();
    flow.push('dialog');
    flow.push('dialog');
    expect(flow.worldActive).toBe(false);
    flow.pop('dialog');
    expect(flow.worldActive).toBe(true);
    flow.pop('dialog');
    expect(flow.worldActive).toBe(true);
  });

  test('stacked modals unfreeze only when all close; has() is order-independent', () => {
    const flow = new GameFlow();
    flow.push('lock');
    flow.push('transition');
    expect(flow.worldActive).toBe(false);
    expect(flow.has('lock')).toBe(true);
    flow.pop('lock');
    expect(flow.worldActive).toBe(false);
    flow.pop('transition');
    expect(flow.worldActive).toBe(true);
  });
});
