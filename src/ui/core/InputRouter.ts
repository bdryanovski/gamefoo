/**
 * Input routing for the UI framework.
 *
 * Routes mouse, keyboard, and gamepad input to the appropriate widgets.
 * Handles hit testing, event propagation, and input capture.
 *
 * @category UI
 * @module ui/core/InputRouter
 * @since 0.5.0
 */

import type Input from '@/core/input';
import type FocusManager from './FocusManager';
import type {
  MouseButton,
  UICharInputEvent,
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UIMouseMoveEvent,
  UIMouseWheelEvent,
} from './types';
import { createUIEvent } from './types';
import type UIStateManager from './UIStateManager';
import type UIWidget from './UIWidget';

/**
 * Input router configuration.
 *
 * @since 0.5.0
 */
export interface InputRouterConfig {
  /** Whether to capture input when UI is active */
  captureInput?: boolean;
  /** Keys that trigger focus navigation */
  focusKeys?: {
    next?: string[]; // Default: ['Tab']
    previous?: string[]; // Default: ['Tab'] with shift
    up?: string[]; // Default: ['ArrowUp', 'w', 'W']
    down?: string[]; // Default: ['ArrowDown', 's', 'S']
    left?: string[]; // Default: ['ArrowLeft', 'a', 'A']
    right?: string[]; // Default: ['ArrowRight', 'd', 'D']
  };
  /** Keys that trigger action on focused widget */
  actionKeys?: string[]; // Default: ['Enter', ' ']
}

/**
 * Default key bindings for focus navigation.
 *
 * @internal
 */
const DEFAULT_FOCUS_KEYS = {
  next: ['Tab'],
  previous: ['Tab'], // with shift modifier
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
};

const DEFAULT_ACTION_KEYS = ['Enter', ' '];

/**
 * Routes input events to UI widgets.
 *
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * const router = new InputRouter(input, stateManager, focusManager);
 * router.setRoot(myUI);
 *
 * // In game loop
 * router.processInput();
 * ```
 */
export default class InputRouter {
  /** Engine input system */
  private _input: Input;

  /** UI state manager */
  private _stateManager: UIStateManager;

  /** Focus manager */
  private _focusManager: FocusManager;

  /** Root widget for input routing */
  private _root: UIWidget | null = null;

  /** Configuration */
  private _config: Required<InputRouterConfig>;

  /** Last mouse position */
  private _lastMouseX: number = 0;
  private _lastMouseY: number = 0;

  /** Currently captured widget (receives all input) */
  private _capturedWidget: UIWidget | null = null;

  /** Keys that were down last frame (for press detection) */
  private _lastKeysDown: Set<string> = new Set();

  /** Mouse buttons that were down last frame */
  private _lastMouseDown: Set<number> = new Set();

  /**
   * Creates a new InputRouter.
   *
   * @param input - Engine input system
   * @param stateManager - UI state manager
   * @param focusManager - Focus manager
   * @param config - Optional configuration
   *
   * @since 0.5.0
   */
  constructor(
    input: Input,
    stateManager: UIStateManager,
    focusManager: FocusManager,
    config?: InputRouterConfig,
  ) {
    this._input = input;
    this._stateManager = stateManager;
    this._focusManager = focusManager;
    this._config = {
      captureInput: config?.captureInput ?? true,
      focusKeys: { ...DEFAULT_FOCUS_KEYS, ...config?.focusKeys },
      actionKeys: config?.actionKeys ?? DEFAULT_ACTION_KEYS,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the root widget for input routing.
   *
   * @param root - Root widget
   *
   * @since 0.5.0
   */
  setRoot(root: UIWidget | null): void {
    this._root = root;
  }

  /**
   * Gets the root widget.
   *
   * @since 0.5.0
   */
  getRoot(): UIWidget | null {
    return this._root;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Input Capture
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Captures all input to a specific widget.
   * Used for dragging, text input, etc.
   *
   * @param widget - Widget to capture input to
   *
   * @since 0.5.0
   */
  captureInput(widget: UIWidget): void {
    this._capturedWidget = widget;
  }

  /**
   * Releases input capture.
   *
   * @since 0.5.0
   */
  releaseCapture(): void {
    this._capturedWidget = null;
  }

  /**
   * Gets the currently capturing widget.
   *
   * @since 0.5.0
   */
  getCapturedWidget(): UIWidget | null {
    return this._capturedWidget;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Input Processing
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Processes all input for the current frame.
   * Call this once per frame before widget updates.
   *
   * @returns True if any input was consumed by UI
   *
   * @since 0.5.0
   */
  processInput(): boolean {
    if (!this._root) return false;

    let consumed = false;

    // Process mouse movement
    consumed = this.processMouseMove() || consumed;

    // Process mouse buttons
    consumed = this.processMouseButtons() || consumed;

    // Process keyboard
    consumed = this.processKeyboard() || consumed;

    return consumed;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Mouse Input
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Processes mouse movement.
   *
   * @internal
   */
  private processMouseMove(): boolean {
    const pos = this._input.getMousePosition();
    const dx = pos.x - this._lastMouseX;
    const dy = pos.y - this._lastMouseY;

    // Skip if no movement
    if (dx === 0 && dy === 0) return false;

    this._lastMouseX = pos.x;
    this._lastMouseY = pos.y;

    // Create event
    const event = this.createMouseMoveEvent(pos.x, pos.y, dx, dy);

    // Update hover state
    if (this._capturedWidget) {
      // When captured, only the captured widget receives events
      this._capturedWidget.handleEvent(event);
    } else {
      // Normal hit testing
      const hit = this._root?.hitTest(pos.x, pos.y) ?? null;
      this._stateManager.setHover(hit);

      if (hit) {
        hit.handleEvent(event);
      }
    }

    return event.consumed;
  }

  /**
   * Processes mouse button events.
   *
   * @internal
   */
  private processMouseButtons(): boolean {
    const pos = this._input.getMousePosition();
    let consumed = false;

    // Check each button (0: left, 1: middle, 2: right)
    for (let button = 0; button < 3; button++) {
      const isDown = this._input.isMouseButtonDown(button);
      const wasDown = this._lastMouseDown.has(button);

      if (isDown && !wasDown) {
        // Button pressed
        consumed = this.handleMouseDown(pos.x, pos.y, button) || consumed;
        this._lastMouseDown.add(button);
      } else if (!isDown && wasDown) {
        // Button released
        consumed = this.handleMouseUp(pos.x, pos.y, button) || consumed;
        this._lastMouseDown.delete(button);
      }
    }

    return consumed;
  }

  /**
   * Handles mouse button press.
   *
   * @internal
   */
  private handleMouseDown(x: number, y: number, button: number): boolean {
    const event = this.createMouseButtonEvent('mousedown', x, y, button);

    if (this._capturedWidget) {
      this._capturedWidget.handleEvent(event);
      return event.consumed;
    }

    const hit = this._root?.hitTest(x, y) ?? null;

    if (hit) {
      // Update focus
      if (hit.focusable) {
        this._stateManager.setFocus(hit);
      }

      // Update pressed state
      this._stateManager.setPressed(hit);

      // Dispatch event
      hit.handleEvent(event);
    } else {
      // Clicked outside - clear focus
      this._stateManager.clearFocus();
    }

    return event.consumed || hit !== null;
  }

  /**
   * Handles mouse button release.
   *
   * @internal
   */
  private handleMouseUp(x: number, y: number, button: number): boolean {
    const event = this.createMouseButtonEvent('mouseup', x, y, button);

    // Clear pressed state
    const wasPressed = this._stateManager.getPressed();
    this._stateManager.clearPressed();

    if (this._capturedWidget) {
      this._capturedWidget.handleEvent(event);
      return event.consumed;
    }

    const hit = this._root?.hitTest(x, y) ?? null;

    if (hit) {
      hit.handleEvent(event);

      // Trigger click if released on same widget that was pressed
      if (wasPressed === hit && button === 0) {
        // onClick is handled by the widget itself in handleEvent
      }
    }

    return event.consumed || hit !== null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Keyboard Input
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Processes keyboard input.
   *
   * @internal
   */
  private processKeyboard(): boolean {
    let consumed = false;

    const pressedKeys = this._input.getPressedKeys();

    // Find newly pressed keys
    for (const key of pressedKeys) {
      if (!this._lastKeysDown.has(key)) {
        // Key just pressed
        consumed = this.handleKeyDown(key) || consumed;
      }
    }

    // Find released keys
    for (const key of this._lastKeysDown) {
      if (!pressedKeys.has(key)) {
        // Key just released
        consumed = this.handleKeyUp(key) || consumed;
      }
    }

    // Update last keys
    this._lastKeysDown = new Set(pressedKeys);

    return consumed;
  }

  /**
   * Handles key press.
   *
   * @internal
   */
  private handleKeyDown(key: string): boolean {
    const shift = this._input.isKeyDown('Shift');
    const ctrl = this._input.isKeyDown('Control');
    const alt = this._input.isKeyDown('Alt');
    const meta = this._input.isKeyDown('Meta');

    // Handle focus navigation first
    const focusKeys = this._config.focusKeys;

    if (key === 'Tab') {
      if (shift) {
        this._focusManager.focusPrevious();
      } else {
        this._focusManager.focusNext();
      }
      return true;
    }

    if (focusKeys.up?.includes(key)) {
      if (this._focusManager.focusDirection('up')) return true;
    }
    if (focusKeys.down?.includes(key)) {
      if (this._focusManager.focusDirection('down')) return true;
    }
    if (focusKeys.left?.includes(key)) {
      if (this._focusManager.focusDirection('left')) return true;
    }
    if (focusKeys.right?.includes(key)) {
      if (this._focusManager.focusDirection('right')) return true;
    }

    // Create and dispatch event to focused widget
    const event = this.createKeyEvent('keydown', key, shift, ctrl, alt, meta);

    const focused = this._stateManager.getFocused();
    if (focused) {
      focused.handleEvent(event);
    }

    return event.consumed;
  }

  /**
   * Handles key release.
   *
   * @internal
   */
  private handleKeyUp(key: string): boolean {
    const shift = this._input.isKeyDown('Shift');
    const ctrl = this._input.isKeyDown('Control');
    const alt = this._input.isKeyDown('Alt');
    const meta = this._input.isKeyDown('Meta');

    const event = this.createKeyEvent('keyup', key, shift, ctrl, alt, meta);

    const focused = this._stateManager.getFocused();
    if (focused) {
      focused.handleEvent(event);
    }

    return event.consumed;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Event Creation
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a mouse move event.
   *
   * @internal
   */
  private createMouseMoveEvent(
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
  ): UIMouseMoveEvent {
    const base = createUIEvent();
    return {
      ...base,
      type: 'mousemove',
      x,
      y,
      deltaX,
      deltaY,
    };
  }

  /**
   * Creates a mouse button event.
   *
   * @internal
   */
  private createMouseButtonEvent(
    type: 'mousedown' | 'mouseup',
    x: number,
    y: number,
    button: number,
  ): UIMouseButtonEvent {
    const base = createUIEvent();
    const buttonMap: Record<number, MouseButton> = {
      0: 'left',
      1: 'middle',
      2: 'right',
    };
    return {
      ...base,
      type,
      x,
      y,
      button: buttonMap[button] ?? 'left',
    };
  }

  /**
   * Creates a key event.
   *
   * @internal
   */
  private createKeyEvent(
    type: 'keydown' | 'keyup',
    key: string,
    shift: boolean,
    ctrl: boolean,
    alt: boolean,
    meta: boolean,
  ): UIKeyEvent {
    const base = createUIEvent();
    return {
      ...base,
      type,
      key,
      code: key, // Simplified - could map to actual key codes
      shift,
      ctrl,
      alt,
      meta,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Cleanup
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Resets the input router state.
   *
   * @since 0.5.0
   */
  reset(): void {
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._capturedWidget = null;
    this._lastKeysDown.clear();
    this._lastMouseDown.clear();
  }

  /**
   * Destroys the input router.
   *
   * @since 0.5.0
   */
  destroy(): void {
    this.reset();
    this._root = null;
  }
}
