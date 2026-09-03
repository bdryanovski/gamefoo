/**
 * Abstraction over the mechanism that drives the game loop.
 *
 * The engine delegates frame scheduling to a `LoopDriver` so that the
 * same `Engine` class can run in both browser (`requestAnimationFrame`)
 * and terminal / server (`setInterval` / Bun timer) environments.
 *
 * Pass a driver via {@link EngineConfig.loopDriver}:
 *
 * ```ts
 * // Browser (default — no need to pass):
 * const engine = new Engine(renderer);
 *
 * // Terminal:
 * const engine = new Engine(renderer, {
 *   loopDriver: new IntervalLoopDriver(30),
 * });
 * ```
 *
 * @since 0.4.0
 *
 * @see {@link RAFLoopDriver}      — browser `requestAnimationFrame` driver
 * @see {@link IntervalLoopDriver} — `setInterval`-based driver for terminals
 */
export interface LoopDriver {
  /**
   * Starts the frame loop.
   *
   * The provided `tick` callback is called once per frame with the
   * elapsed time in seconds since the previous frame.
   *
   * @param tick - Frame callback. Receives `deltaTime` in seconds.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * driver.start((dt) => {
   *   console.log(`Frame: ${dt.toFixed(4)}s`);
   * });
   * ```
   */
  start(tick: (dt: number) => void): void;

  /**
   * Stops the frame loop.
   *
   * After calling `stop`, no further `tick` invocations occur until
   * `start` is called again.
   *
   * @since 0.4.0
   */
  stop(): void;
}

/**
 * Browser game loop driver using `requestAnimationFrame`.
 *
 * This is the **default** loop driver used by {@link Engine} when no
 * explicit driver is supplied. It synchronises with the browser's
 * display refresh rate (typically 60 Hz or the monitor's native rate).
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * // Explicit (normally not needed — it is the default):
 * const engine = new Engine(renderer, {
 *   loopDriver: new RAFLoopDriver(),
 * });
 * ```
 *
 * @see {@link IntervalLoopDriver} — alternative for terminal / server
 */
export class RAFLoopDriver implements LoopDriver {
  /**
   * The handle returned by `requestAnimationFrame`.
   */
  private handle = 0;

  /**
   * Timestamp of the previous frame in milliseconds.
   */
  private lastTime = 0;

  /**
   * Starts the `requestAnimationFrame` loop.
   *
   * On the very first frame `deltaTime` is `0` to avoid a spurious large
   * delta on initialisation.
   *
   * @param tick - Frame callback, invoked with `deltaTime` in seconds.
   *
   * @since 0.4.0
   */
  start(tick: (dt: number) => void) {
    const loop = (ts: number) => {
      const dt = (ts - this.lastTime) / 1000;
      this.lastTime = ts;
      tick(dt);
      this.handle = requestAnimationFrame(loop);
    };
    this.handle = requestAnimationFrame(loop);
  }

  /**
   * Cancels the pending `requestAnimationFrame` call.
   *
   * @since 0.4.0
   */
  stop() {
    cancelAnimationFrame(this.handle);
  }
}

/**
 * Terminal / server game loop driver using `setInterval`.
 *
 * Runs the game tick at a fixed target frame rate (default **30 FPS**).
 * Suitable for Bun / Node terminal games, headless simulations, and
 * server-side game logic.
 *
 * For higher-precision frame timing in Bun, see `createBunLoop` in
 * `terminal_loop.ts`.
 *
 * @since 0.4.0
 *
 * @example
 * ```ts
 * import { Engine, IntervalLoopDriver, TerminalRenderContext } from "gamefoo";
 *
 * const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
 * const engine   = new Engine(renderer, {
 *   loopDriver: new IntervalLoopDriver(30),
 * });
 * engine.setup();
 * ```
 *
 * @see {@link RAFLoopDriver} — browser alternative
 */
export class IntervalLoopDriver implements LoopDriver {
  /**
   * The handle returned by `setInterval`, or `null` if not running.
   */
  private handle: ReturnType<typeof setInterval> | null = null;

  /**
   * Creates a new interval-based loop driver.
   *
   * @param fps - Target frames per second. Default `30`.
   *
   * @since 0.4.0
   */
  constructor(private fps = 30) {}

  /**
   * Starts the `setInterval` loop at the configured FPS.
   *
   * `deltaTime` is computed from `Date.now()` differences and will
   * drift slightly from the target interval under system load.
   *
   * @param tick - Frame callback, invoked with `deltaTime` in seconds.
   *
   * @since 0.4.0
   */
  start(tick: (dt: number) => void) {
    let last = Date.now();
    this.handle = setInterval(() => {
      const now = Date.now();
      tick((now - last) / 1000);
      last = now;
    }, 1000 / this.fps);
  }

  /**
   * Clears the `setInterval` handle, stopping the loop.
   *
   * @since 0.4.0
   */
  stop() {
    if (this.handle) {
      clearInterval(this.handle);
    }
  }
}
