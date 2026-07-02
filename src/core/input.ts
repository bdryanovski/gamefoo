/**
 * Unified keyboard and mouse input manager.
 *
 * `Input` listens to `keydown`, `keyup`, `mousedown`, `mouseup`, and
 * `mousemove` events on the `window` and exposes a polling API so game
 * logic can query the current state at any point during a frame rather
 * than relying on event callbacks.
 *
 * All keyboard keys are stored **lowercased** for case-insensitive
 * look-ups.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Polling keys
 * ```ts
 * const input = new Input();
 *
 * function update() {
 *   if (input.isKeyDown("w")) {
 *     player.y -= speed;
 *   }
 * }
 * ```
 *
 * @example Checking mouse state (canvas-relative)
 * ```ts
 * const input = new Input({ canvasId: "game", gameScale: 2 });
 *
 * if (input.isMouseButtonDown(0)) {           // left-click
 *   const { x, y } = input.getMousePosition();
 *   shoot(x, y); // coordinates are in game-world space
 * }
 * ```
 *
 * @see {@link Control} — behaviour that consumes `Input` for player movement
 */
export default class Input {
  /**
   * Set of currently-pressed keyboard keys (lowercased).
   *
   * Populated on `keydown`, cleared on `keyup`.
   */
  private keys: Set<string> = new Set();

  /**
   * Set of currently-pressed mouse button indices.
   *
   * Standard mapping: `0` = left, `1` = middle, `2` = right.
   */
  private mouseButtons: Set<number> = new Set();

  /**
   * Last known mouse position in game-world coordinates (canvas-relative
   * and scale-adjusted when a canvas is provided).
   *
   * @defaultValue `{ x: 0, y: 0 }`
   */
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };

  /**
   * Reference to the canvas element for coordinate conversion.
   *
   * @since 0.4.0
   */
  private canvas: HTMLCanvasElement | null = null;

  /**
   * Scale factor to convert from CSS pixels to game-world coordinates.
   *
   * @since 0.4.0
   */
  private gameScale: number = 1;

  /**
   * Creates a new `Input` instance and attaches global event listeners
   * to the `window`.
   *
   * @param options - Optional configuration for canvas-relative mouse tracking.
   * @param options.canvasId - The `id` of the canvas element. When provided,
   *   mouse positions are returned relative to the canvas.
   * @param options.gameScale - The pixel scale factor (default: 1). Use this
   *   when your game uses a scaled canvas (e.g., pixel-art games).
   *
   * @remarks
   * Only one `Input` instance should exist at a time to avoid
   * duplicate listeners. If you need to tear down, call {@link Input.reset}
   * to clear tracked state.
   *
   * @example Window coordinates (default)
   * ```ts
   * const input = new Input();
   * ```
   *
   * @example Canvas-relative coordinates
   * ```ts
   * const input = new Input({ canvasId: "game" });
   * ```
   *
   * @example Canvas-relative with scale factor
   * ```ts
   * const input = new Input({ canvasId: "game", gameScale: 4 });
   * ```
   */
  constructor(options?: { canvasId?: string; gameScale?: number }) {
    if (options?.canvasId) {
      this.canvas = document.getElementById(
        options.canvasId,
      ) as HTMLCanvasElement | null;
    }
    if (options?.gameScale) {
      this.gameScale = options.gameScale;
    }

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('mousedown', (e) => {
      this.mouseButtons.add(e.button);
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseButtons.delete(e.button);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.canvas) {
        // Get canvas position on the page
        const rect = this.canvas.getBoundingClientRect();
        // Convert to canvas-relative and scale-adjusted coordinates
        this.mousePosition.x = (e.clientX - rect.left) / this.gameScale;
        this.mousePosition.y = (e.clientY - rect.top) / this.gameScale;
      } else {
        // Fallback to window coordinates
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
      }
    });
  }

  /**
   * Checks whether a specific key is currently held down.
   *
   * @param key - The key name to check (case-insensitive).
   *   Uses the standard {@link KeyboardEvent.key} values (e.g. `"a"`,
   *   `"ArrowLeft"`, `"Shift"`).
   * @returns `true` if the key is currently pressed.
   *
   * @example
   * ```ts
   * if (input.isKeyDown("space")) {
   *   player.jump();
   * }
   * ```
   */
  isKeyDown(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  /**
   * Returns a snapshot of all keys that are currently held down.
   *
   * The returned `Set` is a **copy** — mutating it does not affect
   * the internal state.
   *
   * @returns A new `Set<string>` of pressed key names (lowercased).
   *
   * @example
   * ```ts
   * const pressed = input.getPressedKeys();
   * console.log([...pressed]); // e.g. ["w", "shift"]
   * ```
   */
  getPressedKeys(): Set<string> {
    return new Set(this.keys);
  }

  /**
   * Checks whether a specific mouse button is currently held down.
   *
   * @param button - The mouse button index (`0` = left, `1` = middle,
   *   `2` = right).
   * @returns `true` if the button is currently pressed.
   *
   * @example
   * ```ts
   * if (input.isMouseButtonDown(2)) {
   *   openContextMenu();
   * }
   * ```
   */
  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  /**
   * Returns the last known mouse position.
   *
   * When a canvas was provided in the constructor, coordinates are
   * relative to the canvas and adjusted for `gameScale`. Otherwise,
   * coordinates are in client (viewport) space.
   *
   * The returned object is a **copy** — mutating it does not affect
   * the internal state.
   *
   * @returns An `{ x, y }` object with the mouse coordinates in game-world space.
   *
   * @example
   * ```ts
   * const input = new Input({ canvasId: "game", gameScale: 2 });
   * const pos = input.getMousePosition();
   * // pos.x and pos.y are now in game-world coordinates
   * ctx.fillRect(pos.x, pos.y, 4, 4); // draw cursor dot at mouse position
   * ```
   */
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /**
   * Clears all tracked key and mouse-button state.
   *
   * Useful when pausing the game or switching scenes to prevent stale
   * input from carrying over.
   *
   * @example
   * ```ts
   * engine.pause();
   * input.reset();
   * ```
   */
  reset(): void {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}
