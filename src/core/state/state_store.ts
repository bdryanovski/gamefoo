/**
 * A reactive, persistable state tree for the game — the engine's memory of
 * "what has happened": which doors are open, which enemies are dead (so they
 * do not respawn), which coins are collected, plus any per-object
 * configuration. It is a plain {@link MapManager}-style core object the game
 * owns; nothing in the render loop is required.
 *
 * ### Reads & writes
 *
 * State is a JSON tree addressed by dot paths. {@link StateStore.get} /
 * {@link StateStore.set} / {@link StateStore.update} / {@link StateStore.delete}
 * read and mutate leaves or whole subtrees; intermediate objects (and arrays,
 * for numeric segments) are created on demand.
 *
 * ### Reactivity
 *
 * {@link StateStore.subscribe} registers a listener against a path and returns
 * an unsubscribe function. A write wakes every subscriber whose path is equal
 * to, an ancestor of, or a descendant of the changed path — so a listener on
 * `"doors"` hears `set("doors.gate1.open", true)`, and a listener on
 * `"doors.gate1.open"` hears a wholesale `set("doors.gate1", …)`. Writes that
 * do not change the value fire nothing.
 *
 * ### Snapshots, reset & fork
 *
 * {@link StateStore.snapshot} / {@link StateStore.load} move whole trees in and
 * out; {@link StateStore.reset} restores the seed passed at construction;
 * {@link StateStore.fork} returns an independent copy (a new save slot, or a
 * speculative "what if" that can be discarded).
 *
 * ### Persistence
 *
 * An optional {@link StateBackend} (memory, `localStorage`, anything you
 * implement) is hydrated on construction and written by
 * {@link StateStore.persist} — automatically after every change when
 * `autoSave` is on.
 *
 * @category State
 * @since 0.5.0
 *
 * @example Doors, dead enemies, coins
 * ```ts
 * const state = new StateStore({
 *   backend: new LocalStorageBackend('save:slot1'),
 *   autoSave: true,
 * });
 *
 * // Persisted facts the game reads on load to avoid re-spawning / re-showing:
 * if (state.get<boolean>('enemies.boss.dead')) skipBossSpawn();
 * state.set('doors.gate1.open', true);
 * state.update<number>('coins', (n) => (n ?? 0) + 1);
 *
 * // React: play a sound the moment a door opens, from anywhere.
 * state.subscribe('doors.gate1.open', ({ value }) => {
 *   if (value === true) audio.playSound('door_open');
 * });
 * ```
 *
 * @see {@link StateBackend}
 * @see {@link ScopedState}
 */

import { clone, deleteIn, getIn, isRelated, sameValue, setIn, splitPath } from './path';
import { ScopedState } from './scoped_state';
import type {
  StateBackend,
  StateChange,
  StateData,
  StateListener,
  StateStoreOptions,
  StateValue,
  SubscribeOptions,
} from './types';

/**
 * The subset of {@link StateStore} a {@link ScopedState} forwards to.
 * Declaring it here lets `ScopedState` depend on an interface rather than the
 * concrete class, keeping the two files free of a runtime import cycle.
 *
 * @category State
 * @since 0.5.0
 */
export interface ScopeHost {
  get<T = StateValue>(path: string): T | undefined;
  has(path: string): boolean;
  set(path: string, value: StateValue): void;
  update<T = StateValue>(path: string, updater: (previous: T | undefined) => StateValue): void;
  delete(path: string): void;
  subscribe(path: string, listener: StateListener, options?: SubscribeOptions): () => void;
  scope(prefix: string): ScopedState;
}

/**
 * @category State
 * @since 0.5.0
 */
export class StateStore implements ScopeHost {
  /** The live state tree. Never handed out by reference — reads clone. */
  private data: StateData;
  /** Deep copy of the seed state; the target {@link StateStore.reset} restores. */
  private readonly initialSnapshot: StateData;
  private readonly backend: StateBackend | undefined;
  private autoSaveEnabled: boolean;
  /** Subscribers keyed by canonical path (`""` = root/all changes). */
  private readonly listeners = new Map<string, Set<StateListener>>();

  constructor(options: StateStoreOptions = {}) {
    this.initialSnapshot = clone(options.initial ?? {});
    this.data = clone(this.initialSnapshot);
    this.backend = options.backend;
    this.autoSaveEnabled = options.autoSave ?? false;
    const shouldHydrate = options.hydrate ?? this.backend !== undefined;
    if (shouldHydrate && this.backend !== undefined) {
      const loaded = this.backend.load();
      if (loaded !== null) {
        this.data = clone(loaded);
      }
    }
  }

  /**
   * Reads the value at `path` (deep-cloned), or `undefined` when absent. The
   * optional type parameter is an unchecked convenience cast for the caller.
   */
  get<T = StateValue>(path: string): T | undefined {
    const value = getIn(this.data, splitPath(path));
    return value === undefined ? undefined : (clone(value) as T);
  }

  /**
   * Whether `path` exists. A stored `null` counts as present; only a missing
   * key is absent.
   */
  has(path: string): boolean {
    return getIn(this.data, splitPath(path)) !== undefined;
  }

  /**
   * Writes `value` at `path`, creating intermediate containers as needed. A
   * write equal to the current value is a no-op (no notification, no save).
   *
   * @throws {Error} When `path` is empty — use {@link StateStore.load} to
   *   replace the whole tree.
   */
  set(path: string, value: StateValue): void {
    const segments = splitPath(path);
    if (segments.length === 0) {
      throw new Error('StateStore.set requires a non-empty path; use load() to replace all state.');
    }
    const previous = getIn(this.data, segments);
    if (sameValue(previous, value)) {
      return;
    }
    const stored = clone(value);
    setIn(this.data, segments, stored);
    this.commit({
      path: segments.join('.'),
      value: clone(stored),
      previous: previous === undefined ? undefined : clone(previous),
    });
  }

  /**
   * Reads the current value, passes it through `updater`, and writes the
   * result. Ideal for counters and toggles:
   * `update('coins', (n) => (n ?? 0) + 1)`.
   */
  update<T = StateValue>(path: string, updater: (previous: T | undefined) => StateValue): void {
    this.set(path, updater(this.get<T>(path)));
  }

  /**
   * Removes `path`. An empty path clears the whole tree
   * ({@link StateStore.clear}). Deleting an absent path is a no-op.
   */
  delete(path: string): void {
    const segments = splitPath(path);
    if (segments.length === 0) {
      this.clear();
      return;
    }
    const previous = getIn(this.data, segments);
    if (previous === undefined) {
      return;
    }
    deleteIn(this.data, segments);
    this.commit({ path: segments.join('.'), value: undefined, previous: clone(previous) });
  }

  /**
   * Registers `listener` for `path` and returns an unsubscribe function. The
   * listener fires for equal, ancestor, and descendant changes. Pass
   * `path` `""` to hear every change.
   *
   * @param options - `immediate: true` also fires once now with the current
   *   value.
   */
  subscribe(path: string, listener: StateListener, options: SubscribeOptions = {}): () => void {
    const key = splitPath(path).join('.');
    let bucket = this.listeners.get(key);
    if (bucket === undefined) {
      bucket = new Set<StateListener>();
      this.listeners.set(key, bucket);
    }
    bucket.add(listener);
    if (options.immediate === true) {
      listener({ path: key, value: this.get(key), previous: undefined });
    }
    return () => {
      const current = this.listeners.get(key);
      if (current === undefined) {
        return;
      }
      current.delete(listener);
      if (current.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  /** A prefixed view onto this store (see {@link ScopedState}). */
  scope(prefix: string): ScopedState {
    return new ScopedState(this, splitPath(prefix).join('.'));
  }

  /** A deep, detached copy of the entire state tree. */
  snapshot(): StateData {
    return clone(this.data);
  }

  /**
   * Replaces the entire state tree with a deep copy of `data` and notifies
   * every subscriber (a root change). Does not change the reset target.
   */
  load(data: StateData): void {
    const previous = this.data;
    this.data = clone(data);
    this.commit({ path: '', value: clone(this.data), previous: clone(previous) });
  }

  /** Restores the seed state passed at construction. */
  reset(): void {
    this.load(clone(this.initialSnapshot));
  }

  /** Empties the entire state tree. */
  clear(): void {
    this.load({});
  }

  /**
   * Returns an independent store seeded with a deep copy of the current
   * state — a save slot, or a speculative branch that can be discarded
   * without touching this one. The fork shares no data, no listeners, and
   * (unless given its own `backend`) no persistence. Its reset target is
   * this store's original seed.
   */
  fork(options: { backend?: StateBackend } = {}): StateStore {
    const forked = new StateStore({
      initial: clone(this.initialSnapshot),
      backend: options.backend,
      hydrate: false,
      autoSave: options.backend !== undefined ? this.autoSaveEnabled : false,
    });
    forked.data = clone(this.data);
    return forked;
  }

  /** Whether writes are persisted to the backend automatically. */
  get autoSave(): boolean {
    return this.autoSaveEnabled;
  }

  set autoSave(enabled: boolean) {
    this.autoSaveEnabled = enabled;
  }

  /** Writes the current snapshot to the backend, if one is configured. */
  persist(): void {
    this.backend?.save(this.snapshot());
  }

  /**
   * Reloads state from the backend, replacing the current tree and notifying
   * subscribers. Returns `false` when there is no backend or nothing stored.
   */
  hydrate(): boolean {
    const loaded = this.backend?.load() ?? null;
    if (loaded === null) {
      return false;
    }
    this.load(loaded);
    return true;
  }

  /** Removes the persisted snapshot from the backend, if any. */
  clearPersisted(): void {
    this.backend?.clear();
  }

  /** Drops all subscribers. Call when the store is no longer needed. */
  destroy(): void {
    this.listeners.clear();
  }

  /** Emits a change and, when `autoSave` is on, persists. */
  private commit(change: StateChange): void {
    this.emit(change);
    if (this.autoSaveEnabled) {
      this.persist();
    }
  }

  /** Wakes every related subscriber, snapshotting each bucket for re-entrancy. */
  private emit(change: StateChange): void {
    for (const [key, bucket] of this.listeners) {
      if (!isRelated(key, change.path)) {
        continue;
      }
      // Snapshot the bucket: a listener may subscribe/unsubscribe mid-emit.
      for (const listener of Array.from(bucket)) {
        listener(change);
      }
    }
  }
}
