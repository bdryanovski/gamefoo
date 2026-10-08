/**
 * A prefixed view onto a {@link StateStore}. Every read, write, and
 * subscription is rewritten under a fixed path prefix, so a system can own
 * "everything related to one thing" — an object, a room, a save slot —
 * without repeating the prefix or being able to stray outside it.
 *
 * A scope is a thin, stateless lens: it stores no data of its own and holds
 * no listeners; it simply forwards to the underlying store. Reset, fork,
 * snapshot, and persistence stay the store's responsibility.
 *
 * @category State
 * @since 0.5.0
 *
 * @example Everything about one enemy
 * ```ts
 * const goblin = store.scope('enemies.goblin_3');
 * goblin.set('hp', 12);
 * goblin.set('dead', false);
 * goblin.subscribe('dead', ({ value }) => {
 *   if (value === true) removeFromScreen();
 * });
 * // The store sees "enemies.goblin_3.hp" / "enemies.goblin_3.dead".
 * ```
 */

import type { ScopeHost } from './state_store';
import type { StateListener, StateValue, SubscribeOptions } from './types';

/**
 * @category State
 * @since 0.5.0
 */
export class ScopedState {
  /**
   * @param store  - The backing store (or a parent scope).
   * @param prefix - Canonical dot prefix; `""` mirrors the whole store.
   *
   * @internal Prefer {@link StateStore.scope} / {@link ScopedState.scope}.
   */
  constructor(
    private readonly store: ScopeHost,
    private readonly prefix: string,
  ) {}

  /** Rewrites a scope-relative path to an absolute store path. */
  private absolute(path: string): string {
    if (this.prefix === '') {
      return path;
    }
    return path === '' ? this.prefix : `${this.prefix}.${path}`;
  }

  /** Reads the value at a scope-relative path (`""` reads the scope root). */
  get<T = StateValue>(path = ''): T | undefined {
    return this.store.get<T>(this.absolute(path));
  }

  /** Whether a scope-relative path is present. */
  has(path = ''): boolean {
    return this.store.has(this.absolute(path));
  }

  /** Writes a value at a scope-relative path. */
  set(path: string, value: StateValue): void {
    this.store.set(this.absolute(path), value);
  }

  /** Reads-modifies-writes the value at a scope-relative path. */
  update<T = StateValue>(path: string, updater: (previous: T | undefined) => StateValue): void {
    this.store.update<T>(this.absolute(path), updater);
  }

  /** Deletes a scope-relative path (`""` deletes the scope root). */
  delete(path = ''): void {
    this.store.delete(this.absolute(path));
  }

  /** Subscribes to a scope-relative path; returns an unsubscribe function. */
  subscribe(path: string, listener: StateListener, options?: SubscribeOptions): () => void {
    return this.store.subscribe(this.absolute(path), listener, options);
  }

  /** Narrows to a further-nested scope beneath this one. */
  scope(prefix: string): ScopedState {
    return this.store.scope(this.absolute(prefix));
  }
}
