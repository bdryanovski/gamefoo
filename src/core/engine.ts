import type { SubSystem } from "../subsystems/types";

const DEFAULT_GAME_SCALE = 1;

/**
 * Configuration options for the {@link Engine}.
 *
 * Passed to the `Engine` constructor to customise visual defaults.
 * Every property is optional; sensible defaults are applied internally.
 *
 * @example
 * ```ts
 * const config: EngineConfig = {
 *   backgroundColor: "#1a1a2e",
 * };
 *
 * const engine = new Engine("game", 800, 600, config);
 * ```
 */
interface EngineConfig {
  /**
   * The CSS colour string used to clear the canvas each frame.
   *
   * Accepts any value valid for {@link CanvasRenderingContext2D.fillStyle}
   * (hex, `rgb()`, `hsl()`, named colours, etc.).
   *
   * @defaultValue `"#000000"`
   */
  backgroundColor?: string;

  /**
   * Global scale factor applied to the canvas via CSS transforms.
   *
   * @defaultValue `1` (no scaling)
   */
  gameScale?: number;
}

/**
 * Core game engine responsible for the game loop, rendering pipeline,
 * entity management, collision detection, and camera tracking.
 *
 * `Engine` owns a single HTML `<canvas>` element and drives a
 * `requestAnimationFrame`-based loop that, on every tick:
 *
 * 1. Computes **deltaTime** (seconds since the previous frame).
 * 2. Calls {@link Engine.update | update} — advances all entities and runs
 *    collision detection via the internal {@link World}.
 * 3. Calls {@link Engine.render | render} — clears the canvas and draws every
 *    registered entity.
 *
 * ---
 *
 * ### Lifecycle
 *
 * ```text
 * new Engine()          — creates canvas context, camera, object register, world
 *      │
 *      ▼
 *   setup(fn)           — runs the user-supplied initialiser, then starts the loop
 *      │
 *      ▼
 *  ┌─► loop(timestamp)  — called every frame via requestAnimationFrame
 *  │     ├─ update(dt)
 *  │     └─ render()
 *  │         │
 *  └─────────┘
 *      │
 *   pause() / clear() / destroy()  — stops or tears down the engine
 * ```
 *
 * ---
 *
 * ### Minimal example
 *
 * ```ts
 * import { Engine, Player } from "gamefoo";
 *
 * const engine = new Engine("game", 800, 600, {
 *   backgroundColor: "#1a1a2e",
 * });
 *
 * const player = new Player("hero", 400, 300, 50, 50);
 * engine.player = player;
 *
 * engine.setup(() => {
 *   console.log("Game started!");
 * });
 * ```
 *
 * ### Adding game objects
 *
 * ```ts
 * import { Engine, DynamicEntity } from "gamefoo";
 *
 * const engine = new Engine("game", 800, 600, {});
 *
 * class Crate extends DynamicEntity {
 *   constructor(x: number, y: number) {
 *     super("crate", x, y, 32, 32);
 *   }
 *   override update(_dt: number) {}
 *   override render(ctx: CanvasRenderingContext2D) {
 *     ctx.fillStyle = "#8B4513";
 *     ctx.fillRect(this.x, this.y, 32, 32);
 *   }
 * }
 *
 * engine.attachObjects(new Crate(200, 150));
 *
 * engine.setup(() => {
 *   console.log("Crate placed!");
 * });
 * ```
 *
 * @see {@link Camera}            — viewport tracking
 * @see {@link GameObjectRegister} — entity storage
 * @see {@link World}             — collision detection
 */
export default class Engine {
  /**
   * The underlying `<canvas>` DOM element retrieved by its `id` during
   * construction.
   */
  private canvas: HTMLCanvasElement;

  /**
   * The 2-D rendering context obtained from {@link Engine.canvas}.
   * Used by {@link Engine.render} and exposed indirectly to game objects.
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * Timestamp (in milliseconds) of the previous animation frame.
   * Used internally to calculate `deltaTime` between frames.
   *
   * Reset to `0` when the engine is set up via {@link Engine.setup}.
   */
  private lastTime: number = 0;

  /**
   * The logical width of the game world (and the canvas), in pixels.
   *
   * Set once during construction and also used by the {@link Camera}.
   */
  private width: number;

  /**
   * The logical height of the game world (and the canvas), in pixels.
   *
   * Set once during construction and also used by the {@link Camera}.
   */
  private height: number;

  /**
   * Guards against calling {@link Engine.setup} more than once.
   * Flipped to `true` after the first successful setup invocation.
   */
  private _initialized: boolean = false;

  /**
   * Whether the game loop is actively requesting new frames.
   *
   * - Set to `true` inside {@link Engine.setup}.
   * - Set to `false` by {@link Engine.pause} or {@link Engine.clear}.
   */
  private running: boolean = false;

  /**
   * Merged engine configuration. Combines user-supplied values with internal
   * defaults (`backgroundColor: "#000000"`).
   */
  private cnf: EngineConfig = {
    backgroundColor: "#000000",

    /**
     * Global scale factor applied to the canvas via CSS transforms.
     */
    gameScale: 1,
  };

  /**
   * Global scale factor applied to the canvas via CSS transforms.
   *
   * This does not affect the internal resolution (`width` / `height`) or the
   * camera viewport, but simply scales the rendered output for display.
   *
   */
  public scale: number = DEFAULT_GAME_SCALE;

  /**
   * The main subsystems of the engine, responsible for core functionalities
   * like rendering, object management, collision detection, and monitoring.
   *
   * Subsystems are executed in a specific order determined by their `order` property
   */
  private subsystems: SubSystem[] = [];

  /**
   * Creates a new `Engine` instance, binds it to a `<canvas>` element,
   * and initialises the camera, object register, and collision world.
   *
   * @param canvasId - The DOM `id` attribute of the `<canvas>` element to
   *   render into. Must already exist in the document.
   * @param width    - Logical width of the game area in pixels. Sets both
   *   `canvas.width` and the camera viewport width.
   * @param height   - Logical height of the game area in pixels. Sets both
   *   `canvas.height` and the camera viewport height.
   * @param config   - Optional overrides for engine-level settings.
   *   See {@link EngineConfig}.
   *
   * @throws {Error} If no 2-D rendering context can be obtained from the
   *   canvas (e.g. the browser does not support Canvas 2D).
   *
   * @example
   * ```ts
   * const engine = new Engine("game", 800, 600, {
   *   backgroundColor: "#1a1a2e",
   * });
   * ```
   */
  constructor(canvasId: string, width: number, height: number, config: EngineConfig) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.height = height;
    this.width = width;

    this.scale = this.cnf.gameScale || DEFAULT_GAME_SCALE;

    this.canvas.width = width * this.scale;
    this.canvas.height = height * this.scale;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;

    this.cnf = { ...this.cnf, ...config };

    /**
     * Make sure to always pixelate the canvas to preserve crisp edges for pixel art.
     */
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.imageRendering = "-moz-crisp-edges";
    this.canvas.style.imageRendering = "crisp-edges";
    //
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.scale, this.scale);
  }

  /**
   * Returns the current logical dimensions of the game area.
   *
   * These dimensions are set during construction and do not change with CSS scaling.
   * They represent the internal resolution of the canvas and the camera viewport.
   *
   * @since 0.4.0
   *
   * @returns An object containing the `width` and `height` in pixels.
   *
   * @example
   * ```ts
   * const { width, height } = engine.dementions;
   * console.log(`Game area is ${width}x${height} pixels.`);
   * ```
   */
  get dementions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Attaches a subsystem to the engine, making it part of the update and render cycles.
   *
   * Subsystems are executed in a specific order determined by their `order` property (lower values run first).
   *
   * @since 0.2.0
   *
   * @param subsystem - The subsystem instance to attach. Must implement the {@link SubSystem} interface.
   *
   * @returns The engine instance, allowing for method chaining.
   *
   * @example
   * ```ts
   * engine.use(new ObjectSystem());
   * engine.use(new CollisionSystem());
   * ```
   */
  use(subsystem: SubSystem): this {
    this.subsystems.push(subsystem);
    /**
     * Sort subsystems by their `order` property (defaulting to `100` if not specified) to ensure they run in the correct sequence.
     */
    this.subsystems.sort((a, b) => (a.order || 100) - (b.order || 100));

    /**
     * Call the `init` method of the subsystem if it exists, passing the engine instance.
     * This allows subsystems to perform any necessary setup that depends on the engine
     * being available.
     */
    subsystem.init?.(this);
    return this;
  }

  /**
   * Runs a specific lifecycle hook on all enabled subsystems that implement it.
   *
   * This method is used internally by the game loop to delegate update and render calls to subsystems.
   *
   * @param hook - The name of the lifecycle method to invoke (e.g. "update", "render").
   * @param args - Arguments to pass to the subsystem methods (e.g. `deltaTime` for updates, `ctx` for rendering).
   *
   * @remarks
   * The method iterates over all subsystems, checks if they are enabled, and if they implement the specified hook. If so, it calls the hook method with the provided arguments.
   * This allows for a flexible and modular architecture where subsystems can independently implement the lifecycle methods they need without being tightly coupled to the engine's core logic.
   *
   * @example
   * ```ts
   * // During the update phase of the game loop:
   * this.run("update", deltaTime);
   *
   * // During the render phase of the game loop:
   * this.run("render", ctx);
   * ```
   */
  private run<K extends keyof SubSystem>(hook: K, ...args: any[]): void {
    for (const subsystem of this.subsystems) {
      /**
       * Check if the subsystem is enabled before attempting to call the hook method. If `enabled` is explicitly set to `false`, skip this subsystem.
       */
      if (subsystem.enabled === false) continue;
      const fun = subsystem[hook];

      if (typeof fun === "function") {
        // @ts-expect-error
        fun.apply(subsystem, args);
      }
    }
  }

  /**
   * Resizes the canvas via CSS transforms so it fits within its parent
   * container while preserving the original aspect ratio.
   *
   * Call this in a `window` `resize` event listener to keep the game
   * centred and properly scaled in responsive layouts.
   *
   * @remarks
   * The method calculates the uniform scale factor from the container
   * dimensions and centres the canvas with a CSS `translate + scale`
   * transform. The internal resolution (`width` / `height`) remains
   * unchanged.
   *
   * @example
   * ```ts
   * window.addEventListener("resize", () => engine.handleResize());
   * ```
   */
  handleResize() {
    if (!this.canvas) return;

    const container = this.canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaleX = containerWidth / this.width;
    const scaleY = containerHeight / this.height;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (containerWidth - this.width * scale) / 2;
    const offsetY = (containerHeight - this.height * scale) / 2;

    this.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  /**
   * Directly sets the canvas pixel dimensions.
   *
   * Unlike {@link Engine.handleResize}, this changes the **actual**
   * resolution of the canvas (clearing its contents in the process).
   *
   * @param width  - New canvas width in pixels.
   * @param height - New canvas height in pixels.
   *
   * @example
   * ```ts
   * engine.resize(1024, 768);
   * ```
   */
  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Binds the `loop` method to the current `this` context so it can be passed directly to
   * `requestAnimationFrame` without losing the correct reference to the engine instance.
   *
   * Also prevent the need of GC to create a new function on each frame, which could lead to performance issues over time.
   */
  private boundLoop = this.loop.bind(this);

  /**
   * The core animation loop driven by `requestAnimationFrame`.
   *
   * Each iteration:
   * 1. Computes **deltaTime** (seconds since the last frame).
   * 2. Delegates to {@link Engine.update} and {@link Engine.render}.
   * 3. Schedules itself for the next frame (unless `running` is `false`).
   *
   * @param timestamp - The high-resolution timestamp provided by
   *   `requestAnimationFrame`, in milliseconds.
   *
   * @internal
   */
  private loop(timestamp: number) {
    /**
     * Prevent the loop from running if the engine is paused or cleared. The loop
     * is only restarted by calling {@link Engine.setup} on a new engine instance.
     */
    if (!this.running) {
      return;
    }

    /**
     * Calculate deltaTime (in seconds) since the last frame. On the first frame,
     * `lastTime` is `0`, so we set it to the current timestamp to avoid a large
     * delta on the first update.
     */
    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    /**
     * @remarks
     *   - `timestamp` is provided by `requestAnimationFrame` and is in milliseconds. Dividing by `1000`
     *   converts it to seconds, which is a more common unit for game logic.
     *   - The first frame is handled specially to avoid a large deltaTime value that would occur if we calculated it as `(timestamp - 0) / 1000`.
     *   - This allows the game loop to adapt to varying frame rates, ensuring that game logic runs at a consistent pace regardless of how fast or slow the frames are rendered.
     *   - In summary, this block of code is crucial for maintaining smooth and consistent game updates by accurately tracking the time elapsed between frames and providing that information to the update logic.
     */
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.run("preUpdate", deltaTime);
    this.run("update", deltaTime);
    this.run("postUpdate", deltaTime);

    /**
     * Call the main `update` method of the engine, which can be overridden by subclasses to
     * implement custom update logic that runs every frame.
     * This is where you would put any global game logic that needs to run independently of
     * individual game objects.
     */
    this.update(deltaTime);

    /**
     * Clear the canvas at the start of each frame to prepare for fresh rendering.
     */
    this.clearScrean();

    /**
     * Call the main `render` method of the engine, which can be overridden by subclasses to
     * implement custom rendering logic that runs every frame.
     */
    this.render(this.ctx);

    this.run("preRender", this.ctx);
    this.run("render", this.ctx);
    this.run("postRender", this.ctx);

    /**
     * Schedule the next frame by calling `requestAnimationFrame` with the `loop` method as the callback.
     * This creates a continuous animation loop that keeps the game running until `running` is set to `false`.
     */
    requestAnimationFrame(this.boundLoop);
  }

  /**
   * Initialises the engine and starts the game loop.
   *
   * The supplied `setupFn` callback is invoked **synchronously** before the
   * first frame. Use it to perform any last-minute setup that depends on
   * the engine being ready (e.g. spawning initial entities, binding UI).
   *
   * Calling `setup` more than once is a no-op — a warning is logged to the
   * console and the method returns immediately.
   *
   * @param setupFn - (optional) A synchronous callback executed once before the loop
   *   begins. Typically used for scene initialisation.
   *
   * @example
   * ```ts
   * engine.setup(() => {
   *   console.log("Engine initialised — first frame incoming!");
   * });
   * ```
   *
   * @example
   * ```ts
   * // Attempting a second setup is safely ignored:
   * engine.setup(() => {}); // warns: "Engine is already initialized."
   * ```
   */
  public async setup(setupFn?: () => void) {
    if (this._initialized) {
      console.warn("Engine is already initialized.");
      return;
    }

    /**
     * Handle automatically the resize of the viewport
     */
    if (window && typeof window.addEventListener === "function") {
      window.addEventListener("resize", () => this.handleResize());
    }

    this.lastTime = 0;
    this.clearScrean();

    /**
     * Setup function is optional and can be used
     * to perform any last-minute initialisation that depends on the
     * engine being ready (e.g. spawning initial entities, binding UI).
     */
    if (typeof setupFn === "function") {
      setupFn();
    }

    this._initialized = true;
    this.running = true;
    requestAnimationFrame(this.boundLoop);
  }

  /**
   * Advances the game state by one tick.
   *
   * Called automatically by the game loop, but is `public` so it can be
   * invoked manually for deterministic / test-driven updates.
   *
   *
   * @param deltaTime - Time elapsed since the last frame, **in seconds**.
   *
   * @example
   * ```ts
   * // Manual update (useful for unit testing):
   * engine.update(1 / 60); // simulate a single 60 FPS tick
   * ```
   */
  public update(_deltaTime: number) {}

  /**
   * Draws one complete frame to the canvas.
   *
   * Called automatically after {@link Engine.update} in the game loop, but
   * is `public` for manual / debug rendering.
   *
   * @example
   * ```ts
   * // Force a single frame repaint:
   * engine.render((ctx) => {
   *   ctx.fillStyle = "red";
   * });
   * ```
   */
  public render(_ctx: CanvasRenderingContext2D) {}

  /**
   * Pauses the game loop.
   *
   * The current frame finishes, but no further frames are scheduled.
   * The canvas retains its last rendered state.
   *
   * Resume by calling {@link Engine.setup} on a **new** engine instance
   * (the current instance cannot be restarted after pausing because
   * `_initialized` remains `true`).
   *
   * @example
   * ```ts
   * document.addEventListener("visibilitychange", () => {
   *   if (document.hidden) engine.pause();
   * });
   * ```
   */
  public pause() {
    this.running = false;
  }

  /**
   * Clear the screen and set default background colour.
   *
   * @example
   * ```ts
   * engine.clearScrean();
   * // Canvas is now blank; loop is stopped.
   * ```
   */
  public clearScrean() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.cnf.backgroundColor || "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * Tears down the engine and releases resources.
   *
   * Use this to perform any cleanup such as removing event listeners or
   * releasing external references when the engine is no longer needed.
   *
   * @remarks
   * Currently a no-op placeholder. Extend this method when the engine
   * acquires resources that need explicit cleanup (e.g. `ResizeObserver`,
   * `WebSocket`, audio contexts).
   *
   * @example
   * ```ts
   * // When leaving the game screen:
   * engine.destroy();
   * ```
   */
  public destroy() {
    // Clean up resources, event listeners, etc. if needed.
    this.pause();

    for (let i = this.subsystems.length - 1; i >= 0; i--) {
      this.subsystems[i]?.destroy?.();
    }
  }
}
