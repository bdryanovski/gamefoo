/**
 * Contract: DialogRunner walks the exported dialog document — revealing each
 * message's segments with a typewriter, then presenting options. Following an
 * option jumps by id; a dead end (no options / null target) ends the dialog.
 */
import { describe, expect, test } from 'vitest';
import { DialogRunner } from '../src/core/dialog/dialog_runner';
import type { DialogDocument } from '../src/core/dialog/types';

const doc: DialogDocument = {
  meta: { version: '1.0' },
  trees: {
    Base: {
      id: 'dlg_base',
      name: 'Base',
      root: 'msg_root',
      messages: {
        msg_root: {
          title: 'Root',
          segments: ['Hello traveler!', 'Foo Bar'],
          options: [
            { label: 'Yes', target: 'msg_yes' },
            { label: 'No', target: 'msg_no' },
          ],
          meta: { portrait: 'elder' },
        },
        msg_yes: { title: 'Yes', segments: [''], options: [], meta: {} },
        msg_no: { title: 'No', segments: ['Tell me no'], options: [], meta: {} },
      },
    },
    'Dialog 2': {
      id: 'dlg_two',
      name: 'Dialog 2',
      root: 'msg_two',
      messages: { msg_two: { title: 'Start', segments: [''], options: [] } },
    },
  },
};

/** Fully reveal the current segment (one big tick exceeds any segment). */
function reveal(runner: DialogRunner): void {
  runner.update(10);
}

describe('DialogRunner.start resolution', () => {
  test('resolves a tree by keyed name', () => {
    expect(new DialogRunner(doc).start('Base')).toBe(true);
  });

  test('resolves a tree by id and by numeric index', () => {
    expect(new DialogRunner(doc).start('dlg_two')).toBe(true);
    expect(new DialogRunner(doc).start('0')).toBe(true); // first tree = Base
    expect(new DialogRunner(doc).start('1')).toBe(true); // second tree
  });

  test('returns false and stays inactive for an unknown tree', () => {
    const runner = new DialogRunner(doc);
    expect(runner.start('nope')).toBe(false);
    expect(runner.active).toBe(false);
  });

  test('resolves a message id and starts the dialog at that message', () => {
    const runner = new DialogRunner(doc);
    expect(runner.start('msg_no')).toBe(true);
    expect(runner.active).toBe(true);
    expect(runner.title).toBe('No');
    runner.update(10);
    expect(runner.visibleText).toBe('Tell me no');
  });
});

describe('DialogRunner typewriter + segments', () => {
  test('reveals characters over time and reports phase', () => {
    const runner = new DialogRunner(doc, { charsPerSecond: 10 });
    runner.start('Base');
    expect(runner.phase).toBe('typing');
    expect(runner.visibleText).toBe('');
    runner.update(0.5); // 5 chars
    expect(runner.visibleText).toBe('Hello');
    expect(runner.phase).toBe('typing');
    reveal(runner);
    expect(runner.visibleText).toBe('Hello traveler!');
    expect(runner.phase).toBe('ready'); // more segments remain
  });

  test('confirm while typing reveals the rest immediately', () => {
    const runner = new DialogRunner(doc, { charsPerSecond: 10 });
    runner.start('Base');
    runner.confirm();
    expect(runner.visibleText).toBe('Hello traveler!');
    expect(runner.phase).toBe('ready');
  });

  test('confirm advances through segments, then reaches choices', () => {
    const runner = new DialogRunner(doc);
    runner.start('Base');
    runner.confirm(); // reveal segment 0
    runner.confirm(); // advance to segment 1
    expect(runner.phase).toBe('typing');
    reveal(runner);
    expect(runner.visibleText).toBe('Foo Bar');
    expect(runner.phase).toBe('choosing');
    expect(runner.choices.map((c) => c.label)).toEqual(['Yes', 'No']);
  });
});

describe('DialogRunner choices', () => {
  function toChoices(runner: DialogRunner): DialogRunner {
    runner.start('Base');
    runner.confirm();
    runner.confirm();
    reveal(runner);
    return runner;
  }

  test('selection moves and wraps', () => {
    const runner = toChoices(new DialogRunner(doc));
    expect(runner.selectedIndex).toBe(0);
    runner.moveSelection(1);
    expect(runner.selectedIndex).toBe(1);
    runner.moveSelection(1); // wraps back to 0
    expect(runner.selectedIndex).toBe(0);
    runner.moveSelection(-1); // wraps to last
    expect(runner.selectedIndex).toBe(1);
  });

  test('choosing an option jumps to its target message', () => {
    const runner = toChoices(new DialogRunner(doc));
    runner.confirm(); // pick "Yes" → msg_yes (dead end)
    expect(runner.active).toBe(true);
    expect(runner.title).toBe('Yes');
    expect(runner.phase).toBe('choosing'); // empty dead-end segment
    expect(runner.choices).toEqual([{ label: 'Close', target: null }]);
  });

  test('a dead-end Close choice ends the dialog', () => {
    const runner = toChoices(new DialogRunner(doc));
    runner.confirm(); // → msg_yes
    runner.confirm(); // pick synthesized Close
    expect(runner.active).toBe(false);
  });

  test('meta and title track the current message', () => {
    const runner = new DialogRunner(doc);
    runner.start('Base');
    expect(runner.title).toBe('Root');
    expect(runner.meta).toEqual({ portrait: 'elder' });
  });
});
