/**
 * Contract: StateStore public API + reactivity + persistence
 *
 * Covers path reads/writes (nested + array), update/delete, the
 * ancestor/exact/descendant subscription semantics, no-op suppression,
 * immediate + re-entrant subscribers, snapshot immutability, reset/clear,
 * fork independence, the MemoryBackend and LocalStorageBackend adapters
 * (hydrate/autoSave/corrupt-value), and prefixed scopes.
 */
import { describe, expect, test, vi } from 'vitest';
import { LocalStorageBackend } from '../src/core/state/local_storage_backend';
import { MemoryBackend } from '../src/core/state/memory_backend';
import type { StorageLike } from '../src/core/state/local_storage_backend';
import { StateStore } from '../src/core/state/state_store';
import type { StateChange } from '../src/core/state/types';

/** A Map-backed StorageLike for exercising LocalStorageBackend in Node. */
function fakeStorage(seed: Record<string, string> = {}): StorageLike & { map: Map<string, string> } {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  };
}

describe('StateStore — reads & writes', () => {
  test('sets and gets a leaf, creating intermediate objects', () => {
    const store = new StateStore();
    store.set('doors.gate1.open', true);
    expect(store.get('doors.gate1.open')).toBe(true);
    expect(store.get('doors.gate1')).toEqual({ open: true });
  });

  test('has distinguishes a stored null from a missing key', () => {
    const store = new StateStore({ initial: { a: null } });
    expect(store.has('a')).toBe(true);
    expect(store.has('b')).toBe(false);
    expect(store.get('b')).toBeUndefined();
  });

  test('numeric segments index into an existing array', () => {
    const store = new StateStore({ initial: { inv: ['sword', 'shield'] } });
    expect(store.get('inv.1')).toBe('shield');
    store.set('inv.0', 'axe');
    expect(store.get('inv')).toEqual(['axe', 'shield']);
  });

  test('update reads-modifies-writes', () => {
    const store = new StateStore();
    store.update<number>('coins', (n) => (n ?? 0) + 1);
    store.update<number>('coins', (n) => (n ?? 0) + 1);
    expect(store.get('coins')).toBe(2);
  });

  test('delete removes a key; empty path clears everything', () => {
    const store = new StateStore({ initial: { a: 1, b: 2 } });
    store.delete('a');
    expect(store.has('a')).toBe(false);
    expect(store.get('b')).toBe(2);
    store.delete('');
    expect(store.snapshot()).toEqual({});
  });

  test('set rejects an empty path', () => {
    const store = new StateStore();
    expect(() => store.set('', 1)).toThrow(/non-empty path/);
  });

  test('reads and snapshots are detached copies', () => {
    const store = new StateStore({ initial: { nested: { count: 1 } } });
    const read = store.get<{ count: number }>('nested')!;
    read.count = 99;
    expect(store.get('nested.count')).toBe(1);
    const nested = store.snapshot().nested;
    if (nested !== null && typeof nested === 'object' && !Array.isArray(nested)) {
      nested.count = 42;
    }
    expect(store.get('nested.count')).toBe(1);
  });
});

describe('StateStore — reactivity', () => {
  test('exact, ancestor, and descendant subscribers all fire; unrelated does not', () => {
    const store = new StateStore();
    const exact = vi.fn();
    const ancestor = vi.fn();
    const descendant = vi.fn();
    const unrelated = vi.fn();
    store.subscribe('doors.gate1.open', exact);
    store.subscribe('doors', ancestor);
    store.subscribe('doors.gate1.open.reason', descendant);
    store.subscribe('coins', unrelated);

    store.set('doors.gate1.open', true);

    expect(exact).toHaveBeenCalledTimes(1);
    expect(ancestor).toHaveBeenCalledTimes(1);
    expect(descendant).toHaveBeenCalledTimes(1);
    expect(unrelated).not.toHaveBeenCalled();
    expect(exact.mock.calls[0]![0]).toEqual<StateChange>({
      path: 'doors.gate1.open',
      value: true,
      previous: undefined,
    });
  });

  test('a write equal to the current value fires nothing', () => {
    const store = new StateStore({ initial: { hp: 10 } });
    const listener = vi.fn();
    store.subscribe('hp', listener);
    store.set('hp', 10);
    expect(listener).not.toHaveBeenCalled();
    store.set('hp', 11);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('delete reports the removed value as previous', () => {
    const store = new StateStore({ initial: { flag: true } });
    const listener = vi.fn();
    store.subscribe('flag', listener);
    store.delete('flag');
    expect(listener.mock.calls[0]![0]).toEqual<StateChange>({
      path: 'flag',
      value: undefined,
      previous: true,
    });
  });

  test('unsubscribe stops delivery', () => {
    const store = new StateStore();
    const listener = vi.fn();
    const off = store.subscribe('x', listener);
    store.set('x', 1);
    off();
    store.set('x', 2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('immediate fires once with the current value', () => {
    const store = new StateStore({ initial: { hp: 7 } });
    const listener = vi.fn();
    store.subscribe('hp', listener, { immediate: true });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0]![0]).toEqual<StateChange>({
      path: 'hp',
      value: 7,
      previous: undefined,
    });
  });

  test('root subscriber hears every change', () => {
    const store = new StateStore();
    const listener = vi.fn();
    store.subscribe('', listener);
    store.set('a', 1);
    store.set('b.c', 2);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('subscribing during emit does not fire for the in-flight change', () => {
    const store = new StateStore();
    const late = vi.fn();
    store.subscribe('x', () => store.subscribe('x', late));
    store.set('x', 1);
    expect(late).not.toHaveBeenCalled();
    store.set('x', 2);
    expect(late).toHaveBeenCalledTimes(1);
  });
});

describe('StateStore — reset, clear & fork', () => {
  test('reset restores the initial seed and notifies', () => {
    const store = new StateStore({ initial: { lives: 3 } });
    store.set('lives', 0);
    const listener = vi.fn();
    store.subscribe('lives', listener);
    store.reset();
    expect(store.get('lives')).toBe(3);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('fork is independent in both directions', () => {
    const store = new StateStore({ initial: { coins: 0 } });
    store.set('coins', 5);
    const branch = store.fork();
    branch.set('coins', 99);
    expect(store.get('coins')).toBe(5);
    store.set('coins', 6);
    expect(branch.get('coins')).toBe(99);
  });

  test('fork keeps the original seed as its reset target', () => {
    const store = new StateStore({ initial: { coins: 0 } });
    store.set('coins', 5);
    const branch = store.fork();
    branch.reset();
    expect(branch.get('coins')).toBe(0);
  });

  test('fork does not inherit the parent listeners', () => {
    const store = new StateStore();
    const listener = vi.fn();
    store.subscribe('x', listener);
    const branch = store.fork();
    branch.set('x', 1);
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('StateStore — persistence', () => {
  test('MemoryBackend round-trips via persist / hydrate', () => {
    const backend = new MemoryBackend();
    const store = new StateStore({ backend });
    store.set('coins', 3);
    expect(backend.load()).toBeNull(); // not auto-saved
    store.persist();
    const reloaded = new StateStore({ backend });
    expect(reloaded.get('coins')).toBe(3);
  });

  test('autoSave writes after every mutation', () => {
    const backend = new MemoryBackend();
    const store = new StateStore({ backend, autoSave: true });
    store.set('a.b', 1);
    expect(backend.load()).toEqual({ a: { b: 1 } });
  });

  test('constructor hydrates from a backend that already has data', () => {
    const backend = new MemoryBackend({ coins: 10 });
    const store = new StateStore({ backend, initial: { coins: 0 } });
    expect(store.get('coins')).toBe(10);
  });

  test('hydrate:false ignores stored data and uses the seed', () => {
    const backend = new MemoryBackend({ coins: 10 });
    const store = new StateStore({ backend, initial: { coins: 0 }, hydrate: false });
    expect(store.get('coins')).toBe(0);
  });

  test('hydrate returns false when nothing is stored', () => {
    const store = new StateStore({ backend: new MemoryBackend() });
    expect(store.hydrate()).toBe(false);
  });

  test('LocalStorageBackend serialises JSON under its key and clears', () => {
    const storage = fakeStorage();
    const backend = new LocalStorageBackend('save:slot1', storage);
    const store = new StateStore({ backend, autoSave: true });
    store.set('doors.gate1.open', true);
    expect(JSON.parse(storage.map.get('save:slot1')!)).toEqual({ doors: { gate1: { open: true } } });
    store.clearPersisted();
    expect(storage.map.has('save:slot1')).toBe(false);
  });

  test('LocalStorageBackend hydrates an existing value and tolerates corruption', () => {
    const good = fakeStorage({ save: JSON.stringify({ coins: 4 }) });
    expect(new StateStore({ backend: new LocalStorageBackend('save', good) }).get('coins')).toBe(4);

    const bad = fakeStorage({ save: '{not json' });
    expect(new LocalStorageBackend('save', bad).load()).toBeNull();
  });
});

describe('ScopedState', () => {
  test('reads and writes are rewritten under the prefix', () => {
    const store = new StateStore();
    const goblin = store.scope('enemies.goblin_3');
    goblin.set('hp', 12);
    expect(store.get('enemies.goblin_3.hp')).toBe(12);
    expect(goblin.get('hp')).toBe(12);
  });

  test('scoped subscribe fires on the underlying absolute write', () => {
    const store = new StateStore();
    const room = store.scope('rooms.crypt');
    const listener = vi.fn();
    room.subscribe('cleared', listener);
    store.set('rooms.crypt.cleared', true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('nested scope composes prefixes', () => {
    const store = new StateStore();
    store.scope('a').scope('b').set('c', 1);
    expect(store.get('a.b.c')).toBe(1);
  });
});
