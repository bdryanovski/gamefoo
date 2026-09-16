/**
 * Types for the reactive {@link StateStore}: the JSON-shaped state tree,
 * change notifications delivered to subscribers, the pluggable persistence
 * backend, and the store's construction options.
 *
 * State is deliberately JSON-serialisable so any backend (memory,
 * `localStorage`, a file, a server) can round-trip it losslessly.
 *
 * @category State
 * @since 0.5.0
 */

/**
 * A JSON-serialisable value the store can hold — primitives, arrays, and
 * plain objects nested arbitrarily. Non-JSON values (functions, class
 * instances, `Map`, `Date`) are intentionally excluded so snapshots survive
 * a `JSON.stringify` round-trip through any {@link StateBackend}.
 *
 * @category State
 * @since 0.5.0
 */
export type StateValue =
  | string
  | number
  | boolean
  | null
  | StateValue[]
  | { [key: string]: StateValue };

/**
 * The root state object — top-level keys mapped to {@link StateValue}s.
 *
 * @category State
 * @since 0.5.0
 */
export type StateData = Record<string, StateValue>;

/**
 * One mutation delivered to subscribers. `path` is the canonical dot path
 * that was written; a whole-state replacement ({@link StateStore.load},
 * {@link StateStore.reset}, {@link StateStore.clear}) reports the empty
 * root path `""`.
 *
 * @category State
 * @since 0.5.0
 */
export interface StateChange {
  /**
   * Canonical dot path that changed (e.g. `"doors.gate1.open"`), or `""`
   * for a whole-state replacement.
   */
  path: string;
  /**
   * The value now at `path` — `undefined` after a delete.
   */
  value: StateValue | undefined;
  /**
   * The value at `path` before the write — `undefined` if it was absent.
   */
  previous: StateValue | undefined;
}

/**
 * A subscriber invoked with the {@link StateChange} that woke it.
 *
 * @category State
 * @since 0.5.0
 */
export type StateListener = (change: StateChange) => void;

/**
 * Options for {@link StateStore.subscribe}.
 *
 * @category State
 * @since 0.5.0
 */
export interface SubscribeOptions {
  /**
   * Fire the listener once immediately with the current value at the
   * subscribed path (its `previous` is `undefined`). Handy for binding a
   * view to state without a separate initial read.
   *
   * @defaultValue `false`
   */
  immediate?: boolean;
}

/**
 * Pluggable persistence adapter — the predefined contract any storage must
 * satisfy. Implement it to persist snapshots anywhere: in memory, the
 * browser's `localStorage`, a save file, or a remote server.
 *
 * All three methods are synchronous; an asynchronous store (IndexedDB, a
 * network endpoint) should buffer the latest snapshot in memory here and
 * flush it out-of-band.
 *
 * @category State
 * @since 0.5.0
 *
 * @example A trivial file-backed adapter
 * ```ts
 * class FileBackend implements StateBackend {
 *   constructor(private readonly path: string) {}
 *   load() {
 *     return existsSync(this.path)
 *       ? (JSON.parse(readFileSync(this.path, 'utf8')) as StateData)
 *       : null;
 *   }
 *   save(data: StateData) { writeFileSync(this.path, JSON.stringify(data)); }
 *   clear() { rmSync(this.path, { force: true }); }
 * }
 * ```
 */
export interface StateBackend {
  /**
   * Reads the persisted snapshot, or `null` when nothing is stored.
   */
  load(): StateData | null;
  /**
   * Writes the snapshot, replacing any previous one.
   */
  save(data: StateData): void;
  /**
   * Removes the persisted snapshot entirely.
   */
  clear(): void;
}

/**
 * Options for the {@link StateStore} constructor.
 *
 * @category State
 * @since 0.5.0
 */
export interface StateStoreOptions {
  /**
   * Seed state and the target that {@link StateStore.reset} restores to.
   * Deep-cloned on construction, so the caller's object is never aliased.
   */
  initial?: StateData;
  /**
   * Persistence adapter. When present the store hydrates from it on
   * construction (unless {@link StateStoreOptions.hydrate} is `false`).
   */
  backend?: StateBackend;
  /**
   * Load the persisted snapshot from `backend` during construction.
   *
   * @defaultValue `true` when a `backend` is supplied, otherwise `false`
   */
  hydrate?: boolean;
  /**
   * Persist to `backend` after every mutation. Leave `false` and call
   * {@link StateStore.persist} at checkpoints to avoid thrashing a slow
   * store on rapid writes.
   *
   * @defaultValue `false`
   */
  autoSave?: boolean;
}
