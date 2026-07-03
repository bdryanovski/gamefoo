import type { SubSystem } from '../subsystems/types';

/**
 * Unified keyboard, mouse, and gamepad input manager.
 *
 * `Input` listens to `keydown`, `keyup`, `mousedown`, `mouseup`, and
 * `mousemove` events on the `window` and exposes a polling API so game
 * logic can query the current state at any point during a frame rather
 * than relying on event callbacks.
 *
 * All keyboard keys are stored **lowercased** for case-insensitive
 * look-ups.
 *
 * Implements {@link SubSystem} so it can be registered with the Engine
 * via `engine.use(input)` for automatic updates each frame.
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
 * @example Using as a subsystem (recommended)
 * ```ts
 * const input = new Input({ canvasId: "game" });
 * const mapper = new InputMapper(input, NES_CONTROLS);
 *
 * engine.use(input); // Auto-updates each frame
 *
 * // In game logic:
 * if (mapper.isActionPressed('A')) player.jump();
 * ```
 *
 * @example Manual update (without Engine)
 * ```ts
 * const input = new Input({ canvasId: "game" });
 * const mapper = new InputMapper(input, NES_CONTROLS);
 *
 * function gameLoop() {
 *   input.update(); // Required for "just pressed" detection
 *   if (mapper.isActionPressed('A')) player.jump();
 * }
 * ```
 *
 * @see {@link Control} — behaviour that consumes `Input` for player movement
 * @see {@link InputMapper} — action-based input mapping using control schemes
 */
export default class Input implements SubSystem {
  /**
   * Subsystem identifier.
   *
   * @since 0.5.0
   */
  readonly id = 'input';

  /**
   * Subsystem execution order. Runs early (order 0) so input state
   * is available to all other subsystems.
   *
   * @since 0.5.0
   */
  readonly order = 0;

  /**
   * Whether the subsystem is enabled.
   *
   * @since 0.5.0
   */
  enabled = true;
  /**
   * Set of currently-pressed keyboard keys (lowercased).
   *
   * Populated on `keydown`, cleared on `keyup`.
   */
  private keys: Set<string> = new Set();

  /**
   * Set of keys that were pressed in the previous frame.
   *
   * Used to detect "just pressed" state.
   *
   * @since 0.5.0
   */
  private keysLastFrame: Set<string> = new Set();

  /**
   * Set of keys that were just pressed this frame.
   *
   * Populated by {@link Input.update}, contains keys that are
   * down this frame but weren't down last frame.
   *
   * @since 0.5.0
   */
  private keysJustPressed: Set<string> = new Set();

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
   * Analog stick deadzone threshold.
   *
   * Axis values below this threshold are treated as zero.
   *
   * @since 0.5.0
   */
  private gamepadDeadzone: number = 0.3;

  /**
   * Creates a new `Input` instance and attaches global event listeners
   * to the `window`.
   *
   * @param options - Optional configuration for canvas-relative mouse tracking.
   * @param options.canvasId - The `id` of the canvas element. When provided,
   *   mouse positions are returned relative to the canvas.
   * @param options.gameScale - The pixel scale factor (default: 1). Use this
   *   when your game uses a scaled canvas (e.g., pixel-art games).
   * @param options.deadzone - Gamepad analog stick deadzone (default: 0.3).
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
   *
   * @example With custom deadzone
   * ```ts
   * const input = new Input({ canvasId: "game", deadzone: 0.2 });
   * ```
   */
  constructor(options?: {
    canvasId?: string;
    gameScale?: number;
    deadzone?: number;
  }) {
    if (options?.canvasId) {
      this.canvas = document.getElementById(
        options.canvasId,
      ) as HTMLCanvasElement | null;
    }
    if (options?.gameScale) {
      this.gameScale = options.gameScale;
    }
    if (options?.deadzone !== undefined) {
      this.gamepadDeadzone = options.deadzone;
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
   * SubSystem hook: called at the start of each frame.
   *
   * When registered with the Engine via `engine.use(input)`, this method
   * is called automatically, ensuring "just pressed" detection works.
   *
   * @param _deltaTime - Seconds since last frame (unused).
   *
   * @since 0.5.0
   */
  preUpdate(_deltaTime: number): void {
    this.update();
  }

  /**
   * Updates the input state for the current frame.
   *
   * Call this once at the beginning of each frame to enable "just pressed"
   * detection via {@link Input.isKeyPressed}. Without calling this method,
   * `isKeyPressed` will always return `false`.
   *
   * When using Input as a subsystem via `engine.use(input)`, this is
   * called automatically and you don't need to call it manually.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Manual usage (without Engine)
   * function gameLoop() {
   *   input.update(); // Call first thing each frame
   *
   *   if (input.isKeyPressed('space')) {
   *     player.jump(); // Only triggers once per press
   *   }
   * }
   * ```
   */
  update(): void {
    // Find keys that are down now but weren't last frame
    this.keysJustPressed.clear();
    for (const key of this.keys) {
      if (!this.keysLastFrame.has(key)) {
        this.keysJustPressed.add(key);
      }
    }

    // Save current keys for next frame comparison
    this.keysLastFrame = new Set(this.keys);
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
   * Checks whether a specific key was just pressed this frame.
   *
   * Returns `true` only on the first frame a key is pressed, then
   * `false` on subsequent frames even if the key is still held.
   *
   * **Requires {@link Input.update} to be called each frame.**
   *
   * @param key - The key name to check (case-insensitive).
   * @returns `true` if the key was just pressed this frame.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // In game loop (after calling input.update())
   * if (input.isKeyPressed("space")) {
   *   player.jump(); // Only triggers once per press
   * }
   * ```
   */
  isKeyPressed(key: string): boolean {
    return this.keysJustPressed.has(key.toLowerCase());
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
   * Gets a gamepad by index using the Gamepad API.
   *
   * Returns `null` if no gamepad is connected at the given index or
   * if the Gamepad API is not available.
   *
   * @param index - Gamepad index (0-3, default: 0)
   * @returns The Gamepad object or null if not available
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const gamepad = input.getGamepad(0);
   * if (gamepad) {
   *   // Check A button (standard mapping)
   *   if (gamepad.buttons[0].pressed) {
   *     player.jump();
   *   }
   *
   *   // Check left stick
   *   const stickX = gamepad.axes[0];
   *   const stickY = gamepad.axes[1];
   * }
   * ```
   */
  getGamepad(index: number = 0): Gamepad | null {
    if (typeof navigator === 'undefined' || !navigator.getGamepads) {
      return null;
    }
    return navigator.getGamepads()[index] ?? null;
  }

  /**
   * Gets the current gamepad deadzone threshold.
   *
   * @returns The deadzone value (0.0 - 1.0)
   *
   * @since 0.5.0
   */
  getDeadzone(): number {
    return this.gamepadDeadzone;
  }

  /**
   * Sets the gamepad analog stick deadzone.
   *
   * Axis values below this threshold are treated as zero, helping
   * prevent drift from analog sticks at rest.
   *
   * @param value - Deadzone threshold (0.0 - 1.0)
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * input.setDeadzone(0.2); // Lower deadzone for more sensitivity
   * input.setDeadzone(0.4); // Higher deadzone for less sensitivity
   * ```
   */
  setDeadzone(value: number): void {
    this.gamepadDeadzone = Math.max(0, Math.min(1, value));
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
    this.keysLastFrame.clear();
    this.keysJustPressed.clear();
    this.mouseButtons.clear();
  }
}
