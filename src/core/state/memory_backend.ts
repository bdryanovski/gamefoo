/**
 * In-memory {@link StateBackend}: a {@link StorageBackend} over a
 * {@link MemoryStorage}. Nothing survives a page reload — it exists for
 * runtime-only persistence (save slots kept in RAM, speculative forks) and as
 * a drop-in stand-in for {@link LocalStorageBackend} in tests.
 *
 * It shares the exact `(key, storage?)` constructor and `load` / `save` /
 * `clear` methods with {@link LocalStorageBackend}, so swapping one for the
 * other changes only the class name.
 *
 * @category State
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const backend = new MemoryBackend('save:slot1');
 * const store = new StateStore({ backend, autoSave: true });
 * store.set('coins', 3);
 * // Reuse the same instance to hydrate a fresh store from the same data:
 * const reloaded = new StateStore({ backend });
 * ```
 *
 * @see {@link LocalStorageBackend}
 * @see {@link StorageBackend}
 */

import { MemoryStorage, type StorageLike } from './storage';
import { StorageBackend } from './storage_backend';

/**
 * @category State
 * @since 0.5.0
 */
export class MemoryBackend extends StorageBackend {
  /**
   * @param key     - Storage key (namespace) the snapshot is written under.
   * @param storage - In-memory store; defaults to a fresh {@link MemoryStorage}.
   *   Pass a shared one so several backends address the same store.
   */
  constructor(key = 'state', storage: StorageLike = new MemoryStorage()) {
    super(key, storage);
  }
}
