/**
 * Small standalone input primitive for demos and experiments.
 *
 * `Input` tracks keyboard, mouse, and gamepad state and exposes polling
 * methods. It has no knowledge of control schemes or actions. For action-based
 * input, pair it with {@link InputMapper}; for engine integration, use
 * {@link InputSystem}.
 *
 * Keyboard keys are matched with {@link KeyboardEvent.key} values and stored
 * lowercased, so lookups are case-insensitive. The space bar is normalized
 * from `' '` to `'space'`.
 *
 * @category Input
 * @module input/input
 *
 * @example
 * ```ts
 * const input = new Input({ canvasId: 'game' });
 *
 * function update() {
 *   input.update();
 *   if (input.isKeyPressed('space')) player.jump();
 *   if (input.isKeyDown('a')) player.moveLeft();
 * }
 * ```
 */

import type { SubSystem } from '../subsystems/types';

/**
 * Options for {@link Input}.
 */
export interface InputOptions {
  /** Canvas element ID used to make mouse coordinates canvas-relative. */
  readonly canvasId?: string;

  /** Canvas scale factor used when converting mouse coordinates. Defaults to 1. */
  readonly gameScale?: number;

  /** Event target to listen on. Defaults to `window` when available. */
  readonly target?: EventTarget;
}

interface TrackedListener {
  readonly type: string;
  readonly handler: EventListener;
}

/**
 * Polling keyboard, mouse, and gamepad input.
 */
export default class Input implements SubSystem {
  readonly id = 'input';
  readonly order = 0;
  enabled = true;

  private readonly keys = new Set<string>();
  private keysLastFrame = new Set<string>();
  private keysJustPressed = new Set<string>();
  private keysJustReleased = new Set<string>();

  private readonly mouseButtons = new Set<number>();
  private mouseButtonsLastFrame = new Set<number>();
  private mouseButtonsJustPressed = new Set<number>();
  private mouseButtonsJustReleased = new Set<number>();
  private mousePosition = { x: 0, y: 0 };

  private readonly canvas: HTMLCanvasElement | null;
  private readonly gameScale: number;
  private readonly target: EventTarget | null;
  private readonly listeners: TrackedListener[] = [];

  private currentFrame = 0;

  constructor(options: InputOptions = {}) {
    this.target =
      options.target ?? (typeof window === 'undefined' ? null : (window as EventTarget));
    this.canvas =
      options.canvasId && typeof document !== 'undefined'
        ? (document.getElementById(options.canvasId) as HTMLCanvasElement | null)
        : null;
    this.gameScale = options.gameScale ?? 1;

    this.listen('keydown', this.onKeyDown);
    this.listen('keyup', this.onKeyUp);
    this.listen('mousedown', this.onMouseDown);
    this.listen('mouseup', this.onMouseUp);
    this.listen('mousemove', this.onMouseMove);
    this.listen('blur', this.onBlur);
  }

  /**
   * Number of completed input frames.
   *
   * Action mappers use this to synchronize press/release edges.
   */
  get frame(): number {
    return this.currentFrame;
  }

  /**
   * Advances edge detection by one frame.
   *
   * The engine calls this automatically when `Input` is registered as a
   * subsystem. Standalone users must call it once per game loop.
   */
  update(): void {
    this.keysJustPressed = difference(this.keys, this.keysLastFrame);
    this.keysJustReleased = difference(this.keysLastFrame, this.keys);
    this.keysLastFrame = new Set(this.keys);

    this.mouseButtonsJustPressed = difference(this.mouseButtons, this.mouseButtonsLastFrame);
    this.mouseButtonsJustReleased = difference(this.mouseButtonsLastFrame, this.mouseButtons);
    this.mouseButtonsLastFrame = new Set(this.mouseButtons);

    this.currentFrame += 1;
  }

  /** Returns whether a key is currently held. */
  isKeyDown(key: string): boolean {
    return this.keys.has(normalizeKey(key));
  }

  /** Returns whether a key was pressed this frame. */
  isKeyPressed(key: string): boolean {
    return this.keysJustPressed.has(normalizeKey(key));
  }

  /** Returns whether a key was released this frame. */
  isKeyReleased(key: string): boolean {
    return this.keysJustReleased.has(normalizeKey(key));
  }

  /** Returns a copy of all currently held keys. */
  getPressedKeys(): Set<string> {
    return new Set(this.keys);
  }

  /**
   * Consumes a key's press edge for the rest of the frame.
   *
   * The key remains `isKeyDown` until it is released.
   */
  consume(key: string): void {
    this.keysJustPressed.delete(normalizeKey(key));
  }

  /** Returns whether a mouse button is currently held. */
  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.has(button);
  }

  /** Returns whether a mouse button was pressed this frame. */
  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtonsJustPressed.has(button);
  }

  /** Returns whether a mouse button was released this frame. */
  isMouseButtonReleased(button: number): boolean {
    return this.mouseButtonsJustReleased.has(button);
  }

  /**
   * Returns the last known mouse position.
   *
   * Coordinates are canvas-relative and scale-adjusted when a canvas was
   * provided; otherwise they are viewport coordinates.
   */
  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  /** Returns a gamepad by index, or `null` when unavailable. */
  getGamepad(index: number = 0): Gamepad | null {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return null;
    }
    return navigator.getGamepads()[index] ?? null;
  }

  /** Clears all tracked input state. */
  reset(): void {
    this.keys.clear();
    this.keysLastFrame.clear();
    this.keysJustPressed.clear();
    this.keysJustReleased.clear();
    this.mouseButtons.clear();
    this.mouseButtonsLastFrame.clear();
    this.mouseButtonsJustPressed.clear();
    this.mouseButtonsJustReleased.clear();
    this.mousePosition = { x: 0, y: 0 };
    this.currentFrame += 1;
  }

  /** Removes event listeners. */
  destroy(): void {
    for (const { type, handler } of this.listeners) {
      this.target?.removeEventListener?.(type, handler);
    }
    this.listeners.length = 0;
  }

  private listen(type: string, handler: EventListener): void {
    if (!this.target) {
      return;
    }
    this.target.addEventListener(type, handler);
    this.listeners.push({ type, handler });
  }

  private readonly onKeyDown = (event: Event): void => {
    const { key } = event as KeyboardEvent;
    if (key) {
      this.keys.add(normalizeKey(key));
    }
  };

  private readonly onKeyUp = (event: Event): void => {
    const { key } = event as KeyboardEvent;
    if (key) {
      this.keys.delete(normalizeKey(key));
    }
  };

  private readonly onMouseDown = (event: Event): void => {
    this.mouseButtons.add((event as MouseEvent).button);
  };

  private readonly onMouseUp = (event: Event): void => {
    this.mouseButtons.delete((event as MouseEvent).button);
  };

  private readonly onMouseMove = (event: Event): void => {
    const mouse = event as MouseEvent;

    if (this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: (mouse.clientX - rect.left) / this.gameScale,
        y: (mouse.clientY - rect.top) / this.gameScale,
      };
      return;
    }

    this.mousePosition = { x: mouse.clientX, y: mouse.clientY };
  };

  private readonly onBlur = (): void => {
    this.reset();
  };
}

function normalizeKey(key: string): string {
  const normalized = key.toLowerCase();
  return normalized === ' ' || normalized === 'spacebar' ? 'space' : normalized;
}

function difference<T>(left: ReadonlySet<T>, right: ReadonlySet<T>): Set<T> {
  const result = new Set<T>();
  for (const value of left) {
    if (!right.has(value)) {
      result.add(value);
    }
  }
  return result;
}
