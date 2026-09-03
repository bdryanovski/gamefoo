/**
 * Centralized state manager for UI widget states.
 *
 * Tracks focus, hover, and pressed states across all widgets.
 * Widgets query this manager instead of storing state internally.
 *
 * @category UI
 * @module ui/core/UIStateManager
 * @since 0.5.0
 */

import type UIWidget from './UIWidget';

/**
 * Widget state flags.
 *
 * @since 0.5.0
 */
export interface WidgetState {
  /**
   * Whether the widget is currently focused
   */
  focused: boolean;
  /**
   * Whether the mouse is over the widget
   */
  hovered: boolean;
  /**
   * Whether the widget is being pressed
   */
  pressed: boolean;
}

/**
 * Event types emitted by the state manager.
 *
 * @since 0.5.0
 */
export type StateChangeEvent =
  | { type: 'focus'; widget: UIWidget | null; previous: UIWidget | null }
  | { type: 'hover'; widget: UIWidget | null; previous: UIWidget | null }
  | { type: 'pressed'; widget: UIWidget | null; previous: UIWidget | null };

/**
 * Callback type for state change listeners.
 *
 * @since 0.5.0
 */
export type StateChangeListener = (event: StateChangeEvent) => void;

/**
 * Centralized manager for tracking UI widget states.
 *
 * @since 0.5.0
 *
 * @example Using the state manager
 * ```ts
 * const stateManager = new UIStateManager();
 *
 * // Set focus
 * stateManager.setFocus(myButton);
 *
 * // Query state
 * if (stateManager.isFocused(myButton)) {
 *   // Draw focus ring
 * }
 *
 * // Listen for changes
 * stateManager.addListener((event) => {
 *   if (event.type === 'focus') {
 *     console.log('Focus changed to:', event.widget?.id);
 *   }
 * });
 * ```
 */
export default class UIStateManager {
  /**
   * Currently focused widget
   */
  private _focused: UIWidget | null = null;

  /**
   * Currently hovered widget
   */
  private _hovered: UIWidget | null = null;

  /**
   * Currently pressed widget
   */
  private _pressed: UIWidget | null = null;

  /**
   * State change listeners
   */
  private _listeners: StateChangeListener[] = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // Focus Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the currently focused widget.
   *
   * @returns The focused widget, or null
   *
   * @since 0.5.0
   */
  public getFocused(): UIWidget | null {
    return this._focused;
  }

  /**
   * Sets the focused widget.
   *
   * @param widget - Widget to focus, or null to clear focus
   *
   * @since 0.5.0
   */
  public setFocus(widget: UIWidget | null): void {
    if (widget === this._focused) {
      return;
    }

    // Check if widget is focusable
    if (widget && (!widget.focusable || !widget.enabled || !widget.visible)) {
      return;
    }

    const previous = this._focused;
    this._focused = widget;

    this.emit({ type: 'focus', widget, previous });
  }

  /**
   * Checks if a widget is currently focused.
   *
   * @param widget - Widget to check
   * @returns True if the widget is focused
   *
   * @since 0.5.0
   */
  public isFocused(widget: UIWidget): boolean {
    return this._focused === widget;
  }

  /**
   * Clears focus from all widgets.
   *
   * @since 0.5.0
   */
  public clearFocus(): void {
    this.setFocus(null);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Hover Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the currently hovered widget.
   *
   * @returns The hovered widget, or null
   *
   * @since 0.5.0
   */
  public getHovered(): UIWidget | null {
    return this._hovered;
  }

  /**
   * Sets the hovered widget.
   *
   * @param widget - Widget being hovered, or null
   *
   * @since 0.5.0
   */
  public setHover(widget: UIWidget | null): void {
    if (widget === this._hovered) {
      return;
    }

    const previous = this._hovered;
    this._hovered = widget;

    this.emit({ type: 'hover', widget, previous });
  }

  /**
   * Checks if a widget is currently hovered.
   *
   * @param widget - Widget to check
   * @returns True if the widget is hovered
   *
   * @since 0.5.0
   */
  public isHovered(widget: UIWidget): boolean {
    return this._hovered === widget;
  }

  /**
   * Clears hover state.
   *
   * @since 0.5.0
   */
  public clearHover(): void {
    this.setHover(null);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pressed Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the currently pressed widget.
   *
   * @returns The pressed widget, or null
   *
   * @since 0.5.0
   */
  public getPressed(): UIWidget | null {
    return this._pressed;
  }

  /**
   * Sets the pressed widget.
   *
   * @param widget - Widget being pressed, or null
   *
   * @since 0.5.0
   */
  public setPressed(widget: UIWidget | null): void {
    if (widget === this._pressed) {
      return;
    }

    // Only enabled widgets can be pressed
    if (widget && (!widget.enabled || !widget.visible)) {
      return;
    }

    const previous = this._pressed;
    this._pressed = widget;

    this.emit({ type: 'pressed', widget, previous });
  }

  /**
   * Checks if a widget is currently pressed.
   *
   * @param widget - Widget to check
   * @returns True if the widget is pressed
   *
   * @since 0.5.0
   */
  public isPressed(widget: UIWidget): boolean {
    return this._pressed === widget;
  }

  /**
   * Clears pressed state.
   *
   * @since 0.5.0
   */
  public clearPressed(): void {
    this.setPressed(null);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Combined State
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets all state flags for a widget.
   *
   * @param widget - Widget to get state for
   * @returns Object with all state flags
   *
   * @since 0.5.0
   */
  public getState(widget: UIWidget): WidgetState {
    return {
      focused: this._focused === widget,
      hovered: this._hovered === widget,
      pressed: this._pressed === widget,
    };
  }

  /**
   * Resets all state (focus, hover, pressed).
   *
   * @since 0.5.0
   */
  public resetAll(): void {
    this.clearFocus();
    this.clearHover();
    this.clearPressed();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Event Listeners
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Adds a state change listener.
   *
   * @param listener - Callback to invoke on state changes
   * @returns Function to remove the listener
   *
   * @since 0.5.0
   */
  public addListener(listener: StateChangeListener): () => void {
    this._listeners.push(listener);
    return () => {
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
  }

  /**
   * Removes a state change listener.
   *
   * @param listener - Listener to remove
   *
   * @since 0.5.0
   */
  public removeListener(listener: StateChangeListener): void {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Emits a state change event to all listeners.
   *
   * @param event - Event to emit
   *
   * @internal
   */
  private emit(event: StateChangeEvent): void {
    for (const listener of this._listeners) {
      listener(event);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Cleanup
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Cleans up state when a widget is destroyed.
   * Call this when removing widgets from the UI tree.
   *
   * @param widget - Widget being destroyed
   *
   * @since 0.5.0
   */
  public onWidgetDestroyed(widget: UIWidget): void {
    if (this._focused === widget) {
      this.clearFocus();
    }
    if (this._hovered === widget) {
      this.clearHover();
    }
    if (this._pressed === widget) {
      this.clearPressed();
    }
  }

  /**
   * Destroys the state manager and clears all listeners.
   *
   * @since 0.5.0
   */
  public destroy(): void {
    this.resetAll();
    this._listeners = [];
  }
}
