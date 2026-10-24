import { describe, expect, test } from 'vite-plus/test';
import { DialogRunner, InputSystem, type DialogDocument } from '../src/index';
import type { GameContext } from '../games/Experiment00/src/context';
import { DialogSystem } from '../games/Experiment00/src/systems/dialog';
import { GameFlow } from '../games/Experiment00/src/systems/flow';
import { GAME_CONTROLS } from '../games/Experiment00/src/config/controls';

const DOC: DialogDocument = {
  trees: {
    t: {
      id: 't',
      name: 't',
      root: 'm1',
      messages: { m1: { segments: ['hi'], options: [] } },
    },
  },
};

/** A `window` stand-in that captures the keydown listeners Input attaches. */
function stubWindow(): { press: (key: string) => void } {
  const listeners: Array<(e: { key: string }) => void> = [];
  (globalThis as { window?: unknown }).window = {
    addEventListener: (type: string, fn: (e: { key: string }) => void) => {
      if (type === 'keydown') listeners.push(fn);
    },
  };
  return {
    press: (key) => {
      for (const fn of listeners) fn({ key });
    },
  };
}

function makeSystem(): {
  dialog: DialogSystem;
  flow: GameFlow;
  input: InputSystem;
  win: { press: (k: string) => void };
} {
  const win = stubWindow();
  const flow = new GameFlow();
  const input = new InputSystem({ scheme: GAME_CONTROLS });
  const telemetry = { dialogOpen: () => {}, dialogAdvance: () => {} };
  const ctx = { input, flow, telemetry } as unknown as GameContext;
  const dialog = new DialogSystem(ctx);
  dialog.useRunner(new DialogRunner(DOC, { charsPerSecond: 1000 }));
  return { dialog, flow, input, win };
}

describe('DialogSystem freeze + continuation', () => {
  test('a dialog started by another system freezes the world', () => {
    const { dialog, flow } = makeSystem();
    // InteractSystem (order 40) starts the dialog before DialogSystem.update (85).
    expect(dialog.start('m1', 'test')).toBe(true);
    expect(dialog.active).toBe(true);
    // Before the system's own update runs, the flow has not been touched.
    expect(flow.has('dialog')).toBe(false);
    dialog.update(0);
    expect(flow.has('dialog')).toBe(true);
    expect(flow.worldActive).toBe(false);
  });

  test('confirming the dialog through closes it and runs onClosed exactly once', () => {
    const { dialog, flow, input, win } = makeSystem();
    let closed = 0;
    dialog.start('m1', 'test', () => {
      closed += 1;
    });
    dialog.update(1); // reveal the segment → phase 'choosing'
    expect(flow.has('dialog')).toBe(true);

    win.press('e');
    input.update(); // populate the just-pressed edge
    dialog.update(0); // confirm → runner closes
    expect(dialog.active).toBe(false);
    // The freeze is reconciled on the frame after the close flips.
    dialog.update(0);
    expect(flow.has('dialog')).toBe(false);
    expect(flow.worldActive).toBe(true);
    expect(closed).toBe(1);

    // A further frame must not re-run the continuation.
    dialog.update(0);
    expect(closed).toBe(1);
  });
});
