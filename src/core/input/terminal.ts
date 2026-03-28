/**
 * Abstraction over platform-specific keyboard input.
 *
 * `InputDriver` mirrors the essential query methods of the browser
 * {@link Input} class so that entity behaviours written against it can
 * work unchanged in a terminal environment by swapping the driver.
 *
 * @since 0.4.0
 *
 * @see {@link TerminalInputDriver} — stdin-based implementation
 */
export interface InputDriver {
  /**
   * Returns `true` while the key is physically held down.
   *
   * In terminal raw mode a key is considered "held" from the moment a
   * data event arrives until the process processes another frame via
   * {@link InputDriver.update}. There is no reliable "key up" event in
   * raw TTY mode, so held keys are cleared on the next update cycle.
   *
   * @param key - The raw key string (e.g. `"w"`, `"\x1b[A"` for ↑).
   *
   * @since 0.4.0
   */
  isKeyDown(key: string): boolean;

  /**
   * Returns `true` only on the **first frame** a key is pressed.
   *
   * Subsequent frames return `false` until the key is released and
   * pressed again.
   *
   * @param key - The raw key string.
   *
   * @since 0.4.0
   */
  isKeyPressed(key: string): boolean;

  /**
   * Advances the input state by one frame.
   *
   * Call this once per frame (before reading key state) to move keys
   * from the "pressed this frame" set into the "held" state.
   *
   * The engine does **not** call this automatically — wire it into a
   * subsystem's `update` hook or your game loop.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // Inside an update subsystem or game loop:
   * inputDriver.update();
   * if (inputDriver.isKeyDown("w")) player.jump();
   * ```
   */
  update(): void;

  /**
   * Cleans up stdin raw mode and stops listening for input events.
   *
   * Call this when the game exits or the renderer is destroyed to
   * restore the terminal to its normal (cooked) mode.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * process.on("exit", () => inputDriver.destroy());
   * ```
   */
  destroy(): void;
}

/**
 * Terminal keyboard input driver using `process.stdin` in raw mode.
 *
 * In raw mode the OS delivers each keypress immediately as raw bytes —
 * no line buffering, no echo. Arrow keys arrive as multi-byte escape
 * sequences (e.g. `"\x1b[A"` for ↑).
 *
 * **`Ctrl+C`** always calls `process.exit()` to prevent the process from
 * hanging when the TTY is in raw mode.
 *
 * ### Common key strings
 *
 * | Key       | Raw string   |
 * |-----------|--------------|
 * | `w/a/s/d` | `"w"/"a"/"s"/"d"` |
 * | Arrow Up  | `"\x1b[A"`   |
 * | Arrow Down | `"\x1b[B"`  |
 * | Arrow Right | `"\x1b[C"` |
 * | Arrow Left  | `"\x1b[D"` |
 * | Enter     | `"\r"`       |
 * | Space     | `" "`        |
 * | Escape    | `"\x1b"`     |
 *
 * @since 0.4.0
 *
 * @example Basic usage in a Bun terminal game
 * ```ts
 * import { TerminalInputDriver, IntervalLoopDriver, TerminalRenderContext, Engine } from "gamefoo";
 *
 * const input    = new TerminalInputDriver();
 * const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
 * const engine   = new Engine(renderer, {
 *   loopDriver: new IntervalLoopDriver(30),
 * });
 *
 * engine.setup(() => {
 *   console.log("Use WASD to move, Ctrl+C to quit.");
 * });
 *
 * // In your entity update:
 * // input.update();
 * // if (input.isKeyDown("w")) player.moveUp();
 * ```
 *
 * @see {@link InputDriver} — the interface this class implements
 */
export class TerminalInputDriver implements InputDriver {
  /**
   * Keys currently considered held (received at least one data event
   * since the last {@link TerminalInputDriver.update} call).
   */
  private held = new Set<string>();

  /**
   * Keys that are "pressed" for the current frame only (set during the
   * previous update cycle).
   */
  private pressed = new Set<string>();

  /**
   * Keys that arrived from stdin since the last update. Promoted to
   * `pressed` on the next {@link TerminalInputDriver.update} call.
   */
  private nextPressed = new Set<string>();

  /**
   * Creates a new `TerminalInputDriver` and configures `process.stdin`.
   *
   * - Enables **raw mode** if `stdin` is a TTY (disables line buffering
   *   and character echo).
   * - Resumes the stdin stream so data events fire.
   * - Registers a `data` listener for key processing.
   * - Automatically exits the process on `Ctrl+C` (`\u0003`).
   *
   * @since 0.4.0
   */
  constructor() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key: string) => {
      if (key === '\u0003') process.exit(); // Ctrl+C
      this.held.add(key);
      this.nextPressed.add(key);
    });
  }

  /**
   * Returns `true` while the key string is in the held set.
   *
   * @param key - Raw key string (see class-level table).
   *
   * @since 0.4.0
   */
  isKeyDown(key: string) {
    return this.held.has(key);
  }

  /**
   * Returns `true` only on the frame a key first appears in the pressed
   * set.
   *
   * @param key - Raw key string.
   *
   * @since 0.4.0
   */
  isKeyPressed(key: string) {
    return this.pressed.has(key);
  }

  /**
   * Advances input state by one frame.
   *
   * Moves keys from `nextPressed` into `pressed` for one-frame detection,
   * then clears `nextPressed`. Note that "key up" detection is not
   * supported in raw TTY mode — held keys are not automatically cleared.
   *
   * @since 0.4.0
   */
  update() {
    this.pressed = new Set(this.nextPressed);
    this.nextPressed.clear();
  }

  /**
   * Disables raw mode and pauses stdin.
   *
   * Call on game exit to restore the terminal to normal (cooked) mode.
   *
   * @since 0.4.0
   */
  destroy() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }
}
