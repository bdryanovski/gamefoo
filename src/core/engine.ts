import type { SubSystem } from '../subsystems/types';
import type { LoopDriver } from './renderer/loops/loop';
import { RAFLoopDriver } from './renderer/loops/loop';
import type { RenderContext } from './renderer/type';

/**
 * Configuration options for the {@link Engine}.
 *
 * All properties are optional; sensible defaults are applied internally.
 *
 * @since 0.1.0
 *
 * @example
 * ```ts
 * const config: EngineConfig = {
 *   backgroundColor: "#1a1a2e",
 * };
 * const engine = new Engine(renderer, config);
 * ```
 */
interface EngineConfig {
  /**
   * The colour used to clear the screen at the start of each frame.
   *
   * Accepts any CSS colour string — hex (`#rrggbb`), `rgb()`, `hsl()`,
   * or named colours. On terminal renderers the colour is converted to the
   * nearest ANSI truecolour background.
   *
   * @defaultValue `"#000000"`
   */
  backgroundColor?: string;

  /**
   * The {@link LoopDriver} that drives the frame loop.
   *
   * - **Browser**: leave unset to use {@link RAFLoopDriver}
   *   (`requestAnimationFrame`).
   * - **Terminal / Bun**: pass `new IntervalLoopDriver(30)` for a
   *   `setInterval`-based 30 FPS loop.
   *
   * @defaultValue `new RAFLoopDriver()`
   *
   * @since 0.4.0
   */
  loopDriver?: LoopDriver;
}

/**
 * Core game engine: manages the frame loop, rendering pipeline, and
 * subsystem lifecycle.
 *
 * `Engine` is renderer-agnostic. Pass any {@link RenderContext} —
 * {@link WebRenderer} for browser canvas output, or
 * {@link TerminalRenderContext} for ANSI terminal output.
 *
 * ---
 *
 * ### Frame lifecycle (one tick)
 *
 * ```text
 * preUpdate  → update → postUpdate  (all registered subsystems)
 *   ↓
 * Engine.update()                   (override hook)
 *   ↓
 * clearScrean()                     (fill background colour)
 *   ↓
 * Engine.render(ctx)                (override hook)
 *   ↓
 * preRender → render → postRender   (all registered subsystems)
 *   ↓
 * ctx.flush()                       (terminal dirty-cell flush; no-op on canvas)
 * ```
 *
 * ---
 *
 * ### Browser usage
 *
 * ```ts
 * import { Engine, WebRenderer, ObjectSystem, Player } from "gamefoo";
 *
 * const renderer = new WebRenderer("game-canvas", 800, 600);
 * const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });
 *
 * const player = new Player("hero", 400, 300, 32, 32);
 * engine.use(new ObjectSystem([player]));
 *
 * engine.setup(() => console.log("Game started!"));
 * ```
 *
 * ### Terminal usage (Bun)
 *
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
 * ### Subclassing
 *
 * ```ts
 * class MyGame extends Engine {
 *   override update(dt: number) {
 *     // custom per-frame logic
 *   }
 *   override render(ctx: RenderContext) {
 *     // custom rendering on top of subsystems
 *   }
 * }
 * const game = new MyGame(new WebRenderer("game", 800, 600));
 * game.setup();
 * ```
 *
 * @since 0.1.0
 *
 * @see {@link WebRenderer}          — canvas adapter
 * @see {@link TerminalRenderContext} — ANSI terminal adapter
 * @see {@link SubSystem}            — subsystem interface
 * @see {@link RAFLoopDriver}        — default browser loop
 * @see {@link IntervalLoopDriver}   — terminal / server loop
 */
export default class Engine {
  /**
   * The active rendering context.
   *
   * All subsystem render hooks and the {@link Engine.render} override
   * receive this context.
   */
  private ctx: RenderContext;

  /**
   * Timestamp (in milliseconds) of the previous frame.
   * Used internally to derive `deltaTime`.
   *
   * Reset to `0` on {@link Engine.setup}.
   */
  private lastTime: number = 0;

  /**
   * Logical width of the game world in renderer units (pixels or cells).
   *
   * Read from the renderer's `width` property at construction time.
   */
  private width: number;

  /**
   * Logical height of the game world in renderer units (pixels or cells).
   *
   * Read from the renderer's `height` property at construction time.
   */
  private height: number;

  /**
   * Guards against calling {@link Engine.setup} more than once.
   *
   * Flipped to `true` after the first successful setup invocation.
   */
  private _initialized: boolean = false;

  /**
   * Whether the frame loop is currently running.
   *
   * Set `true` by {@link Engine.setup}; `false` by {@link Engine.pause}
   * or {@link Engine.destroy}.
   */
  private running: boolean = false;

  /**
   * Merged configuration. Combines caller-supplied values with defaults.
   */
  private cnf: EngineConfig = {
    backgroundColor: '#000000',
  };

  /**
   * The {@link LoopDriver} responsible for invoking the game tick.
   *
   * Defaults to {@link RAFLoopDriver} (browser `requestAnimationFrame`).
   * Override via {@link EngineConfig.loopDriver} in the constructor.
   */
  private loopDriver: LoopDriver;

  /**
   * Registered subsystems, sorted ascending by their `order` property.
   */
  private subsystems: SubSystem[] = [];

  /**
   * Creates a new `Engine` instance bound to the given renderer.
   *
   * The renderer's `width` and `height` become the engine's logical
   * dimensions. If `gameScale` is set to a value other than `1`, the
   * renderer's `scale()` method is called once immediately.
   *
   * @param renderer - Any {@link RenderContext} implementation.
   * @param config   - Optional engine configuration.
   *
   * @since 0.1.0
   *
   * @example Browser
   * ```ts
   * const renderer = new WebRenderer("game-canvas", 800, 600);
   * const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });
   * ```
   *
   * @example Terminal
   * ```ts
   * const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
   * const engine   = new Engine(renderer, {
   *   loopDriver: new IntervalLoopDriver(30),
   * });
   * ```
   */
  constructor(renderer: RenderContext, config: EngineConfig = {}) {
    this.ctx = renderer;
    this.cnf = { ...this.cnf, ...config };
    this.width = renderer.width;
    this.height = renderer.height;
    this.loopDriver = config.loopDriver ?? new RAFLoopDriver();
  }

  /**
   * The logical dimensions of the game area.
   *
   * These reflect the renderer's `width` / `height` at construction time
   * and are updated by {@link Engine.resize} if the viewport changes.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const { width, height } = engine.dementions;
   * console.log(`Game area: ${width}×${height}`);
   * ```
   */
  get dementions(): { width: number; height: number } {
    return {
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Attaches a subsystem to the engine and calls its `init` hook.
   *
   * Subsystems are sorted by their `order` property (lower = earlier).
   * The default order is `100` when not specified.
   *
   * Returns `this` for fluent chaining.
   *
   * @param subsystem - The subsystem to register.
   *
   * @since 0.2.0
   *
   * @example
   * ```ts
   * engine
   *   .use(new CameraSystem(800, 600, () => player.getPosition()))
   *   .use(new ObjectSystem([player, enemy]))
   *   .use(new CollisionSystem(world));
   * ```
   */
  use(subsystem: SubSystem): this {
    this.subsystems.push(subsystem);
    this.subsystems.sort((a, b) => (a.order || 100) - (b.order || 100));
    subsystem.init?.(this);
    return this;
  }

  /**
   * Invokes a named lifecycle hook on every enabled subsystem that
   * implements it.
   *
   * @param hook - The lifecycle method name (e.g. `"update"`, `"render"`).
   * @param args - Arguments forwarded to the hook.
   *
   * @internal
   */
  private run<K extends keyof SubSystem>(hook: K, ...args: any[]): void {
    for (const subsystem of this.subsystems) {
      if (subsystem.enabled === false) continue;
      const fun = subsystem[hook];
      if (typeof fun === 'function') {
        // @ts-expect-error
        fun.apply(subsystem, args);
      }
    }
  }

  /**
   * Updates the engine's logical dimensions.
   *
   * Call this after a terminal resize event (or canvas resize) to keep
   * subsystems that depend on `engine.dementions` consistent.
   *
   * @param width  - New logical width in renderer units.
   * @param height - New logical height in renderer units.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * process.stdout.on("resize", () => {
   *   const { cols, rows } = getTerminalSize();
   *   renderer.resize(cols, rows);
   *   engine.resize(renderer.width, renderer.height);
   * });
   * ```
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /**
   * The internal frame tick, called once per frame by the
   * {@link LoopDriver}.
   *
   * Executes the full update → render pipeline including all subsystem
   * hooks and the {@link Engine.update} / {@link Engine.render} overrides.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   *
   * @internal
   */
  private tick(deltaTime: number): void {
    if (!this.running) return;

    this.run('preUpdate', deltaTime);
    this.run('update', deltaTime);
    this.run('postUpdate', deltaTime);

    this.update(deltaTime);

    this.clearScrean();

    this.render(this.ctx);

    this.run('preRender', this.ctx);
    this.run('render', this.ctx);
    this.run('postRender', this.ctx);

    // Flush buffered output (terminal dirty-cell diff; no-op on canvas).
    this.ctx.flush?.();
  }

  /**
   * Initialises the engine and starts the frame loop.
   *
   * The optional `setupFn` callback is invoked **synchronously** before
   * the first frame. Use it to create entities, configure subsystems, or
   * load initial assets.
   *
   * Calling `setup` more than once on the same instance is a no-op — a
   * warning is emitted and the method returns immediately.
   *
   * @param setupFn - Optional one-time initialisation callback.
   *
   * @since 0.1.0
   *
   * @example Simple setup
   * ```ts
   * engine.setup(() => {
   *   console.log("Engine ready — first frame incoming!");
   * });
   * ```
   *
   * @example Async setup (asset loading)
   * ```ts
   * engine.setup(async () => {
   *   const image = await Asset.load("hero.png");
   *   // attach sprite renders, etc.
   * });
   * ```
   */
  public async setup(setupFn?: () => void) {
    if (this._initialized) {
      console.warn('Engine is already initialized.');
      return;
    }

    this.lastTime = 0;
    this.clearScrean();

    if (typeof setupFn === 'function') {
      setupFn();
    }

    this._initialized = true;
    this.running = true;
    this.loopDriver.start((dt) => this.tick(dt));
  }

  /**
   * Override hook called once per frame **before** subsystem render
   * hooks.
   *
   * The default implementation is a no-op. Subclasses override this to
   * add per-frame game logic that does not belong to any specific
   * subsystem.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   *
   * @since 0.1.0
   *
   * @example
   * ```ts
   * class MyGame extends Engine {
   *   override update(dt: number) {
   *     score += 10 * dt;
   *   }
   * }
   * ```
   */
  public update(_deltaTime: number) {}

  /**
   * Override hook called once per frame **after** `clearScrean()` and
   * **before** subsystem render hooks.
   *
   * The default implementation is a no-op. Subclasses override this to
   * draw custom content that should appear below all subsystems.
   *
   * @param ctx - The active {@link RenderContext}.
   *
   * @since 0.1.0
   *
   * @example
   * ```ts
   * class MyGame extends Engine {
   *   override render(ctx: RenderContext) {
   *     ctx.drawText("Hello!", 10, 10, "#ffffff");
   *   }
   * }
   * ```
   */
  public render(_ctx: RenderContext) {}

  /**
   * Pauses the frame loop.
   *
   * The current frame completes normally; no further frames are
   * scheduled. The rendered output remains on screen.
   *
   * @since 0.1.0
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
    this.loopDriver.stop();
  }

  /**
   * Clears the screen with the configured {@link EngineConfig.backgroundColor}.
   *
   * Called automatically at the start of every frame. Can also be
   * called manually for a one-shot screen clear.
   *
   * @since 0.1.0
   *
   * @example
   * ```ts
   * // Force a blank frame before showing a transition:
   * engine.clearScrean();
   * ```
   */
  public clearScrean() {
    this.ctx.clear(this.cnf.backgroundColor ?? '#000000');
  }

  /**
   * Tears down the engine and releases resources.
   *
   * Pauses the loop and calls `destroy()` on every registered subsystem
   * in reverse registration order (last-in, first-out).
   *
   * @since 0.1.0
   *
   * @example
   * ```ts
   * // When navigating away from the game screen:
   * engine.destroy();
   * ```
   */
  public destroy() {
    this.pause();
    for (let i = this.subsystems.length - 1; i >= 0; i--) {
      this.subsystems[i]?.destroy?.();
    }
  }
}
