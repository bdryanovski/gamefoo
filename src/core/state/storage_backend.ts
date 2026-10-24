/**
 * A {@link StateBackend} that serialises the snapshot to JSON and persists it
 * under one key in a {@link StorageLike}. It is the shared implementation
 * behind {@link MemoryBackend} and {@link LocalStorageBackend}, which differ
 * only in the storage they default to — so any of the three is a drop-in
 * replacement for another: identical `(key, storage?)` constructor, identical
 * `load` / `save` / `clear`.
 *
 * A corrupt or non-JSON stored value is treated as "nothing stored"
 * ({@link StorageBackend.load} returns `null`) rather than throwing, so a
 * botched write can never wedge the game at startup.
 *
 * @category State
 * @since 0.5.0
 *
 * @example Any Web Storage (here, `sessionStorage`)
 * ```ts
 * const backend = new StorageBackend('save:slot1', sessionStorage);
 * const store = new StateStore({ backend, autoSave: true });
 * ```
 *
 * @see {@link MemoryBackend}
 * @see {@link LocalStorageBackend}
 */

import type { StorageLike } from './storage';
import type { StateBackend, StateData } from './types';

/**
 * @category State
 * @since 0.5.0
 */
export class StorageBackend implements StateBackend {
  /**
   * @param key     - Storage key the snapshot is written under.
   * @param storage - Where to read/write; any {@link StorageLike}.
   */
  constructor(
    protected readonly key: string,
    protected readonly storage: StorageLike,
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
