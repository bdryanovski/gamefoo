/**
 * `localStorage`-style {@link StateBackend}: a {@link StorageBackend} over the
 * ambient `localStorage` (or any injected {@link StorageLike}). It persists to
 * Web Storage, so state survives a page reload.
 *
 * Interchangeable with {@link MemoryBackend} — same `(key, storage?)`
 * constructor and `load` / `save` / `clear` methods — so a game can switch
 * between them by changing only the class name.
 *
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
 * const backend = new LocalStorageBackend('save', new MemoryStorage());
 * ```
 *
 * @see {@link MemoryBackend}
 * @see {@link StorageBackend}
 */

import type { StorageLike } from './storage';
import { StorageBackend } from './storage_backend';

/** Resolves the ambient `localStorage`, or throws when none exists. */
function ambientLocalStorage(): StorageLike {
  const scope = globalThis as { localStorage?: StorageLike };
  if (scope.localStorage === undefined) {
    throw new Error('LocalStorageBackend: no ambient localStorage; pass a StorageLike explicitly.');
  }
  return scope.localStorage;
}

/**
 * @category State
 * @since 0.5.0
 */
export class LocalStorageBackend extends StorageBackend {
  /**
   * @param key     - Storage key the snapshot is written under.
   * @param storage - Web Storage to use; defaults to the ambient `localStorage`.
   */
  constructor(key = 'state', storage: StorageLike = ambientLocalStorage()) {
    super(key, storage);
  }
}
