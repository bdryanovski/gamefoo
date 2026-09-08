/**
 * Storage primitives shared by the keyed {@link StorageBackend}s: the
 * structural `Storage` slice they persist through, and an in-process
 * implementation of it.
 *
 * @category State
 * @since 0.5.0
 */

/**
 * The structural slice of the Web Storage API a {@link StorageBackend} needs.
 * The real `localStorage` / `sessionStorage` satisfy it; {@link MemoryStorage}
 * is the in-process stand-in used off the browser (and in tests).
 *
 * @category State
 * @since 0.5.0
 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * A {@link StorageLike} backed by an in-process `Map` — the storage
 * {@link MemoryBackend} uses by default. Share one instance across several
 * backends to mirror how `localStorage` is a single store addressed by
 * distinct keys.
 *
 * @category State
 * @since 0.5.0
 *
 * @example One store, several keyed slots
 * ```ts
 * const shared = new MemoryStorage();
 * const slot1 = new MemoryBackend('slot1', shared);
 * const slot2 = new MemoryBackend('slot2', shared); // same store, other key
 * ```
 */
export class MemoryStorage implements StorageLike {
  private readonly entries = new Map<string, string>();

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }

  removeItem(key: string): void {
    this.entries.delete(key);
  }
}
