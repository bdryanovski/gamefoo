/**
 * `localStorage`-style {@link StateBackend}: serialises the snapshot to JSON
 * under one key. The storage object is injectable, so the same backend runs
 * against the browser's `localStorage`, `sessionStorage`, or an in-memory
 * fake in Node tests.
 *
 * A corrupt or non-JSON stored value is treated as "nothing stored"
 * ({@link LocalStorageBackend.load} returns `null`) rather than throwing, so
 * a botched save can never wedge the game at startup.
 *
 * @category State
 * @since 0.5.0
 *
 * @see {@link StateStore}
 * @see {@link MemoryBackend}
 */

import type { StateBackend, StateData } from './types';

/**
 * The structural slice of the Web Storage API this backend needs. The real
 * `localStorage`/`sessionStorage` satisfy it; tests inject a fake.
 *
 * @category State
 * @since 0.5.0
 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Resolves the ambient `localStorage`, or throws when none exists. */
function ambientStorage(): StorageLike {
  const scope = globalThis as { localStorage?: StorageLike };
  if (scope.localStorage === undefined) {
    throw new Error('LocalStorageBackend: no ambient localStorage; pass a StorageLike explicitly.');
  }
  return scope.localStorage;
}

/**
 * @category State
 * @since 0.5.0
 *
 * @example Browser
 * ```ts
 * const store = new StateStore({
 *   backend: new LocalStorageBackend('save:slot1'),
 *   autoSave: true,
 * });
 * ```
 *
 * @example Node / tests (injected storage)
 * ```ts
 * const map = new Map<string, string>();
 * const fake: StorageLike = {
 *   getItem: (k) => map.get(k) ?? null,
 *   setItem: (k, v) => void map.set(k, v),
 *   removeItem: (k) => void map.delete(k),
 * };
 * const backend = new LocalStorageBackend('save', fake);
 * ```
 */
export class LocalStorageBackend implements StateBackend {
  /**
   * @param key     - Storage key the snapshot is written under.
   * @param storage - Storage implementation; defaults to the ambient
   *   `localStorage`.
   */
  constructor(
    private readonly key: string,
    private readonly storage: StorageLike = ambientStorage(),
  ) {}

  load(): StateData | null {
    const raw = this.storage.getItem(this.key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as StateData;
    } catch {
      return null;
    }
  }

  save(data: StateData): void {
    this.storage.setItem(this.key, JSON.stringify(data));
  }

  clear(): void {
    this.storage.removeItem(this.key);
  }
}
