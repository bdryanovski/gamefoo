/**
 * Focus navigation manager for the UI framework.
 *
 * Handles keyboard and gamepad navigation between focusable widgets.
 * Supports tab order, arrow key navigation, and focus trapping for modals.
 *
 * @category UI
 * @module ui/core/FocusManager
 * @since 0.5.0
 */

import type UIStateManager from './UIStateManager';
import type UIWidget from './UIWidget';

/**
 * Navigation direction for arrow key/d-pad navigation.
 *
 * @since 0.5.0
 */
export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Focus navigation configuration.
 *
 * @since 0.5.0
 */
export interface FocusConfig {
  /**
   * Whether to wrap around when reaching the end of focusable widgets
   */
  wrap?: boolean;
  /**
   * Whether to allow arrow key navigation
   */
  arrowNavigation?: boolean;
  /**
   * Whether to allow tab navigation
   */
  tabNavigation?: boolean;
}

/**
 * Manages focus navigation between UI widgets.
 *
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * const focusManager = new FocusManager(stateManager);
 * focusManager.setRoot(myPanel);
 *
 * // Navigate with keyboard
 * focusManager.focusNext();     // Tab
 * focusManager.focusPrevious(); // Shift+Tab
 * focusManager.focusDirection('down'); // Arrow down
 * ```
 */
export default class FocusManager {
  /**
   * Reference to the state manager
   */
  private _stateManager: UIStateManager;

  /**
   * Root widget for focus navigation
   */
  private _root: UIWidget | null = null;

  /**
   * Focus trap stack (for modal dialogs)
   */
  private _trapStack: UIWidget[] = [];

  /**
   * Navigation configuration
   */
  private _config: Required<FocusConfig> = {
    wrap: true,
    arrowNavigation: true,
    tabNavigation: true,
  };

  /**
   * Creates a new FocusManager.
   *
   * @param stateManager - The UI state manager
   * @param config - Optional configuration
   *
   * @since 0.5.0
   */
  constructor(stateManager: UIStateManager, config?: FocusConfig) {
    this._stateManager = stateManager;
    if (config) {
      this._config = { ...this._config, ...config };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the current configuration.
   *
   * @since 0.5.0
   */
  public get config(): Readonly<Required<FocusConfig>> {
    return this._config;
  }

  /**
   * Updates the configuration.
   *
   * @param config - Configuration options to update
   *
   * @since 0.5.0
   */
  public setConfig(config: FocusConfig): void {
    this._config = { ...this._config, ...config };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Root Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the root widget for focus navigation.
   *
   * @param root - The root widget
   *
   * @since 0.5.0
   */
  public setRoot(root: UIWidget | null): void {
    this._root = root;
  }

  /**
   * Gets the current root widget.
   *
   * @since 0.5.0
   */
  public getRoot(): UIWidget | null {
    return this._root;
  }

  /**
   * Gets the effective root for focus navigation.
   * Returns the top of the trap stack if trapping is active.
   *
   * @since 0.5.0
   */
  private getEffectiveRoot(): UIWidget | null {
    if (this._trapStack.length > 0) {
      return this._trapStack[this._trapStack.length - 1]!;
    }
    return this._root;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Focus Trapping (for modals)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Pushes a widget onto the focus trap stack.
   * Focus navigation will be constrained to this widget and its children.
   *
   * @param widget - Widget to trap focus within
   *
   * @since 0.5.0
   */
  public pushTrap(widget: UIWidget): void {
    this._trapStack.push(widget);
    // Focus first focusable in the trapped area
    const focusable = this.getFocusableWidgets();
    if (focusable.length > 0) {
      this._stateManager.setFocus(focusable[0]!);
    }
  }

  /**
   * Pops the top widget from the focus trap stack.
   *
   * @returns The popped widget, or undefined if stack was empty
   *
   * @since 0.5.0
   */
  public popTrap(): UIWidget | undefined {
    return this._trapStack.pop();
  }

  /**
   * Clears the entire focus trap stack.
   *
   * @since 0.5.0
   */
  public clearTraps(): void {
    this._trapStack = [];
  }

  /**
   * Checks if focus trapping is currently active.
   *
   * @since 0.5.0
   */
  public isTrapping(): boolean {
    return this._trapStack.length > 0;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Focusable Widget Collection
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Collects all focusable widgets under a root widget.
   *
   * @param root - Root to search from (defaults to effective root)
   * @returns Array of focusable widgets in tree order
   *
   * @since 0.5.0
   */
  public getFocusableWidgets(root?: UIWidget): UIWidget[] {
    const effectiveRoot = root ?? this.getEffectiveRoot();
    if (!effectiveRoot) {
      return [];
    }

    const result: UIWidget[] = [];
    this.collectFocusable(effectiveRoot, result);
    return result;
  }

  /**
   * Recursively collects focusable widgets.
   *
   * @internal
   */
  private collectFocusable(widget: UIWidget, result: UIWidget[]): void {
    if (!widget.visible) {
      return;
    }

    if (widget.focusable && widget.enabled) {
      result.push(widget);
    }

    for (const child of widget.children) {
      this.collectFocusable(child, result);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Sequential Navigation (Tab)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Moves focus to the next focusable widget.
   *
   * @returns True if focus was moved
   *
   * @since 0.5.0
   */
  public focusNext(): boolean {
    if (!this._config.tabNavigation) {
      return false;
    }

    const focusable = this.getFocusableWidgets();
    if (focusable.length === 0) {
      return false;
    }

    const current = this._stateManager.getFocused();
    if (!current) {
      this._stateManager.setFocus(focusable[0]!);
      return true;
    }

    const currentIndex = focusable.indexOf(current);
    if (currentIndex === -1) {
      this._stateManager.setFocus(focusable[0]!);
      return true;
    }

    let nextIndex = currentIndex + 1;
    if (nextIndex >= focusable.length) {
      if (this._config.wrap) {
        nextIndex = 0;
      } else {
        return false;
      }
    }

    this._stateManager.setFocus(focusable[nextIndex]!);
    return true;
  }

  /**
   * Moves focus to the previous focusable widget.
   *
   * @returns True if focus was moved
   *
   * @since 0.5.0
   */
  public focusPrevious(): boolean {
    if (!this._config.tabNavigation) {
      return false;
    }

    const focusable = this.getFocusableWidgets();
    if (focusable.length === 0) {
      return false;
    }

    const current = this._stateManager.getFocused();
    if (!current) {
      this._stateManager.setFocus(focusable[focusable.length - 1]!);
      return true;
    }

    const currentIndex = focusable.indexOf(current);
    if (currentIndex === -1) {
      this._stateManager.setFocus(focusable[focusable.length - 1]!);
      return true;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (this._config.wrap) {
        prevIndex = focusable.length - 1;
      } else {
        return false;
      }
    }

    this._stateManager.setFocus(focusable[prevIndex]!);
    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Directional Navigation (Arrow keys / D-pad)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Moves focus in a direction.
   *
   * @param direction - Direction to move
   * @returns True if focus was moved
   *
   * @since 0.5.0
   */
  public focusDirection(direction: NavigationDirection): boolean {
    if (!this._config.arrowNavigation) {
      return false;
    }

    const current = this._stateManager.getFocused();
    if (!current) {
      // No current focus, focus first widget
      const focusable = this.getFocusableWidgets();
      if (focusable.length > 0) {
        this._stateManager.setFocus(focusable[0]!);
        return true;
      }
      return false;
    }

    const focusable = this.getFocusableWidgets();
    if (focusable.length <= 1) {
      return false;
    }

    const nearest = this.findNearestInDirection(current, focusable, direction);
    if (nearest) {
      this._stateManager.setFocus(nearest);
      return true;
    }

    // If wrap is enabled and no widget found, wrap to opposite edge
    if (this._config.wrap) {
      const wrapped = this.findWrappedWidget(current, focusable, direction);
      if (wrapped) {
        this._stateManager.setFocus(wrapped);
        return true;
      }
    }

    return false;
  }

  /**
   * Finds the nearest focusable widget in a direction.
   *
   * @internal
   */
  private findNearestInDirection(
    from: UIWidget,
    candidates: UIWidget[],
    direction: NavigationDirection,
  ): UIWidget | null {
    const fromBounds = from.getBounds();
    const fromCenterX = fromBounds.x + fromBounds.width / 2;
    const fromCenterY = fromBounds.y + fromBounds.height / 2;

    let best: UIWidget | null = null;
    let bestScore = Infinity;

    for (const candidate of candidates) {
      if (candidate === from) {
        continue;
      }

      const bounds = candidate.getBounds();
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;

      // Check if candidate is in the right direction
      let inDirection = false;
      switch (direction) {
        case 'up':
          inDirection = centerY < fromCenterY;
          break;
        case 'down':
          inDirection = centerY > fromCenterY;
          break;
        case 'left':
          inDirection = centerX < fromCenterX;
          break;
        case 'right':
          inDirection = centerX > fromCenterX;
          break;
      }

      if (!inDirection) {
        continue;
      }

      // Calculate score (prefer widgets more aligned with direction)
      const dx = centerX - fromCenterX;
      const dy = centerY - fromCenterY;

      let score: number;
      if (direction === 'up' || direction === 'down') {
        // Vertical movement: prioritize vertical distance, penalize horizontal offset
        score = Math.abs(dy) + Math.abs(dx) * 2;
      } else {
        // Horizontal movement: prioritize horizontal distance, penalize vertical offset
        score = Math.abs(dx) + Math.abs(dy) * 2;
      }

      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  /**
   * Finds a widget when wrapping around the edge.
   *
   * @internal
   */
  private findWrappedWidget(
    from: UIWidget,
    candidates: UIWidget[],
    direction: NavigationDirection,
  ): UIWidget | null {
    const fromBounds = from.getBounds();
    const fromCenterX = fromBounds.x + fromBounds.width / 2;
    const fromCenterY = fromBounds.y + fromBounds.height / 2;

    // Find widget at the opposite edge, aligned with current widget
    let best: UIWidget | null = null;
    let bestPrimaryDist = -Infinity;
    let bestSecondaryDist = Infinity;

    for (const candidate of candidates) {
      if (candidate === from) {
        continue;
      }

      const bounds = candidate.getBounds();
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;

      let primaryDist: number;
      let secondaryDist: number;

      switch (direction) {
        case 'up':
          // Wrap to bottom - find highest Y
          primaryDist = centerY;
          secondaryDist = Math.abs(centerX - fromCenterX);
          break;
        case 'down':
          // Wrap to top - find lowest Y
          primaryDist = -centerY;
          secondaryDist = Math.abs(centerX - fromCenterX);
          break;
        case 'left':
          // Wrap to right - find highest X
          primaryDist = centerX;
          secondaryDist = Math.abs(centerY - fromCenterY);
          break;
        case 'right':
          // Wrap to left - find lowest X
          primaryDist = -centerX;
          secondaryDist = Math.abs(centerY - fromCenterY);
          break;
      }

      // Prefer furthest in primary direction, then closest in secondary
      if (
        primaryDist > bestPrimaryDist ||
        (primaryDist === bestPrimaryDist && secondaryDist < bestSecondaryDist)
      ) {
        bestPrimaryDist = primaryDist;
        bestSecondaryDist = secondaryDist;
        best = candidate;
      }
    }

    return best;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Direct Focus
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Focuses a specific widget directly.
   *
   * @param widget - Widget to focus
   * @returns True if the widget was focused
   *
   * @since 0.5.0
   */
  public focus(widget: UIWidget): boolean {
    if (!widget.focusable || !widget.enabled || !widget.visible) {
      return false;
    }
    this._stateManager.setFocus(widget);
    return true;
  }

  /**
   * Focuses the first focusable widget.
   *
   * @returns True if a widget was focused
   *
   * @since 0.5.0
   */
  public focusFirst(): boolean {
    const focusable = this.getFocusableWidgets();
    if (focusable.length > 0) {
      this._stateManager.setFocus(focusable[0]!);
      return true;
    }
    return false;
  }

  /**
   * Focuses the last focusable widget.
   *
   * @returns True if a widget was focused
   *
   * @since 0.5.0
   */
  public focusLast(): boolean {
    const focusable = this.getFocusableWidgets();
    if (focusable.length > 0) {
      this._stateManager.setFocus(focusable[focusable.length - 1]!);
      return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Cleanup
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Destroys the focus manager.
   *
   * @since 0.5.0
   */
  public destroy(): void {
    this._root = null;
    this._trapStack = [];
  }
}
