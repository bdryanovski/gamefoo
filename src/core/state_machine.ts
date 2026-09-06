/**
 * Generic, type-safe finite state machine.
 *
 * `StateMachine` tracks a current state of type `S` (typically a string
 * enum), provides convenience checks, and fires lifecycle hooks on
 * every transition.
 *
 * @typeParam S - The state type. Usually a string enum, but any type
 *   that can be used as a `Map` key works.
 *
 * @category Core
 * @since 0.3.0
 *
 * @example Basic usage with a string enum
 * ```ts
 * enum Phase { Menu = "menu", Playing = "playing", GameOver = "gameover" }
 *
 * const fsm = new StateMachine(Phase.Menu);
 *
 * fsm.onEnter(Phase.GameOver, () => {
 *   console.log("Game over!");
 * });
 *
 * fsm.transition(Phase.Playing);   // true
 * fsm.is(Phase.Playing);           // true
 * fsm.transition(Phase.Playing);   // false — already there
 * fsm.transition(Phase.GameOver);  // true, logs "Game over!"
 * fsm.previous;                    // Phase.Playing
 * ```
 *
 * @example Unsubscribing a hook
 * ```ts
 * const unsub = fsm.onEnter(Phase.Playing, () => startMusic());
 * // later…
 * unsub(); // hook will no longer fire
 * ```
 */
export default class StateMachine<S> {
  private _current: S;
  private _previous: S | null = null;

  private enterHooks: Map<S, Set<() => void>> = new Map();
  private exitHooks: Map<S, Set<() => void>> = new Map();

  /**
   * Creates a new state machine starting in the given state.
   *
   * No enter hooks fire for the initial state — it is treated as the
   * starting point, not a transition.
   *
   * @param initial - The state the machine begins in.
   */
  constructor(initial: S) {
    this._current = initial;
  }

  /**
   * The current state.
   */
  public get current(): S {
    return this._current;
  }

  /**
   * The state that was active before the most recent transition,
   * or `null` if no transition has occurred yet.
   */
  public get previous(): S | null {
    return this._previous;
  }

  /**
   * Returns `true` if the current state is exactly `state`.
   */
  public is(state: S): boolean {
    return this._current === state;
  }

  /**
   * Returns `true` if the current state matches any of the given states.
   *
   * @example
   * ```ts
   * if (fsm.isAny(Phase.Playing, Phase.Paused)) {
   *   // game is active
   * }
   * ```
   */
  public isAny(...states: S[]): boolean {
    return states.includes(this._current);
  }

  /**
   * Transitions to a new state.
   *
   * If the machine is already in `next`, this is a no-op and returns
   * `false`. Otherwise it runs exit hooks for the old state, updates
   * the current state, then runs enter hooks for the new state.
   *
   * @param next - The state to transition to.
   * @returns `true` if the transition occurred, `false` if suppressed.
   */
  public transition(next: S): boolean {
    if (this._current === next) {
      return false;
    }

    const prev = this._current;

    const exits = this.exitHooks.get(prev);
    if (exits) {
      for (const fn of exits) {
        fn();
      }
    }

    this._previous = prev;
    this._current = next;

    const enters = this.enterHooks.get(next);
    if (enters) {
      for (const fn of enters) {
        fn();
      }
    }

    return true;
  }

  /**
   * Registers a callback that fires whenever the machine enters `state`.
   *
   * @param state - The state to listen for.
   * @param fn    - The callback to invoke on entry.
   * @returns An unsubscribe function that removes this hook.
   */
  public onEnter(state: S, fn: () => void): () => void {
    if (!this.enterHooks.has(state)) {
      this.enterHooks.set(state, new Set());
    }
    this.enterHooks.get(state)!.add(fn);

    return () => {
      this.enterHooks.get(state)?.delete(fn);
    };
  }

  /**
   * Registers a callback that fires whenever the machine exits `state`.
   *
   * @param state - The state to listen for.
   * @param fn    - The callback to invoke on exit.
   * @returns An unsubscribe function that removes this hook.
   */
  public onExit(state: S, fn: () => void): () => void {
    if (!this.exitHooks.has(state)) {
      this.exitHooks.set(state, new Set());
    }
    this.exitHooks.get(state)!.add(fn);

    return () => {
      this.exitHooks.get(state)?.delete(fn);
    };
  }

  /**
   * Removes all registered hooks. Call this when the state machine is
   * no longer needed to avoid stale references.
   */
  public destroy(): void {
    this.enterHooks.clear();
    this.exitHooks.clear();
  }
}
