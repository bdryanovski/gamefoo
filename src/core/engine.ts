import Monitor from "../debug/monitor";
import type { GameObject } from "../types";
import Camera from "./camera";
import GameObjectRegister from "./game_object_register";
import World from "./world";

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
  public gameScale: number = DEFAULT_GAME_SCALE;

  /**
   * Internal subsystem container holding the three pillars of the engine:
   *
   * | Subsystem    | Purpose                                      |
   * | ------------ | -------------------------------------------- |
   * | `camera`     | Viewport that tracks a target position        |
   * | `objects`    | Registry of all non-player game objects        |
   * | `collisions` | Spatial world that performs collision detection |
   */
  private engine: {
    /** Viewport camera; follows the player position each frame. */
    camera: Camera | null;
    /** Central registry for all {@link GameObject}. */
    objects: GameObjectRegister;
    /** Collision-detection world. Entities register their {@link Collidable} behaviour here. */
    collisions: World;

    /** Debug monitor for visualising performance **/
    monitor: Monitor;
  };

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
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = context;

    this.cnf = { ...this.cnf, ...config };

    this.engine = {
      camera: new Camera(this.width, this.height),
      objects: new GameObjectRegister(),
      collisions: new World(),
      monitor: new Monitor(),
    };

    this.gameScale = this.cnf.gameScale || DEFAULT_GAME_SCALE;

    /**
     * Make sure to always pixelate the canvas to preserve crisp edges for pixel art.
     */
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.style.imageRendering = "-moz-crisp-edges";
    this.canvas.style.imageRendering = "crisp-edges";

    this.canvas.style.width = `${this.width * this.gameScale}px`;
    this.canvas.style.height = `${this.height * this.gameScale}px`;
  }

  /**
   * Provides direct access to the engine's {@link Camera}.
   *
   * Use this to control viewport tracking, e.g. by calling `camera.follow`
   * with a custom target or adjusting the camera position manually.
   * The camera automatically follows the player position each frame when a
   * player is set, but you can override this behaviour by manipulating the
   * camera directly.
   *
   * @since 0.2.0
   *
   * @returns The active {@link Camera} instance managed by this engine.
   * Note that the camera is always present and never `null` in the current
   * implementation, but the return type allows for future flexibility (e.g. optional camera).
   *
   * @example
   * ```ts
   * // Manually set the camera to a specific position:
   * engine.camera?.moveTo({ x: 500, y: 300 });
   * ```
   * @example
   * ```ts
   * // Disable automatic camera follow by overriding the follow method:
   * if (engine.camera) {
   *  engine.camera.follow = () => {};
   *  }
   *
   *  // The camera will now ignore the player position and stay fixed.
   *  ```
   */
  get camera(): Camera | null {
    return this.engine.camera;
  }

  /**
   * Provides direct access to the engine's collision {@link World}.
   *
   * Use this to register {@link Collidable} behaviours so they participate
   * in the per-frame collision detection pass.
   *
   * @returns The active {@link World} instance managed by this engine.
   *
   * @example
   * ```ts
   * const collidable = new Collidable(entity, engine.collisions, {
   *   shape: { type: "aabb", width: 40, height: 40 },
   *   layer: 0,
   *   tags: new Set(["enemy"]),
   *   solid: true,
   *   collidesWith: new Set(["player"]),
   * });
   * entity.attachBehaviour(collidable);
   * ```
   */
  get collisions(): World {
    return this.engine.collisions;
  }

  /**
   * Registers a game object (entity) with the engine so it is automatically
   * updated and rendered each frame.
   *
   * @param objects - Any {@link GameObject} (`Entity` or `DynamicEntity`)
   *   to include in the game loop.
   *
   * @example
   * ```ts
   * class Tree extends DynamicEntity {
   *   constructor(x: number, y: number) {
   *     super("tree", x, y, 40, 60);
   *   }
   *   override update(_dt: number) {}
   *   override render(ctx: CanvasRenderingContext2D) {
   *     ctx.fillStyle = "#228822";
   *     ctx.fillRect(this.x, this.y, 40, 60);
   *   }
   * }
   *
   * engine.attachObjects(new Tree(300, 200));
   * ```
   */
  public attachObjects(objects: GameObject) {
    this.engine.objects.register(objects);
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
    if (!this.running) {
      return;
    }

    if (this.lastTime === 0) {
      this.lastTime = timestamp;
    }

    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(deltaTime);
    this.render();
    requestAnimationFrame((timestamp) => this.loop(timestamp));
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
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  /**
   * Advances the game state by one tick.
   *
   * Called automatically by the game loop, but is `public` so it can be
   * invoked manually for deterministic / test-driven updates.
   *
   * **Update order:**
   * 2. All registered game objects.
   * 3. Collision detection pass ({@link World.detect}).
   *
   * @param deltaTime - Time elapsed since the last frame, **in seconds**.
   *
   * @example
   * ```ts
   * // Manual update (useful for unit testing):
   * engine.update(1 / 60); // simulate a single 60 FPS tick
   * ```
   */
  public update(deltaTime: number) {
    if (this.engine.objects) {
      this.engine.objects.updateAll(deltaTime);
    }

    this.engine.collisions.detect();

    if (this.engine.monitor) {
      this.engine.monitor.update(deltaTime);
    }
  }

  /**
   * Draws one complete frame to the canvas.
   *
   * Called automatically after {@link Engine.update} in the game loop, but
   * is `public` for manual / debug rendering.
   *
   * **Render order:**
   * 1. Clear the entire canvas.
   * 2. Fill with the configured {@link EngineConfig.backgroundColor}.
   * 3. Draw the player (if set).
   * 4. Draw all registered game objects.
   *
   * @example
   * ```ts
   * // Force a single frame repaint:
   * engine.render();
   * ```
   */
  public render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.cnf.backgroundColor || "#000000";
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.engine.objects) {
      this.engine.objects.renderAll(this.ctx);
    }

    if (this.engine.monitor) {
      this.engine.monitor.render(this.ctx);
    }
  }

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
  }
}
