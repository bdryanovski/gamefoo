/**
 * In-memory {@link StateBackend}: holds one snapshot in a field. Nothing
 * survives a page reload — it exists for runtime-only persistence (save
 * slots kept in RAM, speculative forks) and as a drop-in backend in tests.
 *
 * @category State
 * @since 0.5.0
 *
 * @see {@link StateStore}
 * @see {@link LocalStorageBackend}
 */

import { clone } from './path';
import type { StateBackend, StateData } from './types';

/**
 * @category State
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const backend = new MemoryBackend();
 * const store = new StateStore({ backend, autoSave: true });
 * store.set('coins', 3);          // written straight into the backend
 * const reloaded = new StateStore({ backend }); // hydrates the same snapshot
 * ```
 */
export class MemoryBackend implements StateBackend {
  private snapshot: StateData | null;

  /**
   * @param initial - Seed snapshot to serve from {@link MemoryBackend.load}
   *   until the first {@link MemoryBackend.save}. Deep-cloned on the way in.
   */
  constructor(initial: StateData | null = null) {
    this.snapshot = initial === null ? null : clone(initial);
  }

  load(): StateData | null {
    return this.snapshot === null ? null : clone(this.snapshot);
  }

  save(data: StateData): void {
    this.snapshot = clone(data);
  }

  clear(): void {
    this.snapshot = null;
  }
}
