/**
 * Base class for all UI widgets in the GameFoo UI Framework.
 *
 * UIWidget is a standalone base class (not extending Node or Entity)
 * that provides the foundation for all UI components. It shares the
 * same lifecycle pattern as Node (update/render) for consistency.
 *
 * @category UI
 * @module ui/core/UIWidget
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UITheme } from './Theme';
import type {
  Anchor,
  Insets,
  SizeConfig,
  UIEventHandlers,
  UIInputEvent,
  UIRect,
  UISize,
} from './types';
import { createInsets, pointInRect } from './types';
import type UIStateManager from './UIStateManager';

/**
 * Configuration options for UIWidget constructor.
 *
 * @since 0.5.0
 */
export interface UIWidgetConfig {
  /**
   * Initial x position
   */
  x?: number;
  /**
   * Initial y position
   */
  y?: number;
  /**
   * Initial width
   */
  width?: number;
  /**
   * Initial height
   */
  height?: number;
  /**
   * Padding inside the widget
   */
  padding?: number | [number, number] | [number, number, number, number] | Insets;
  /**
   * Margin outside the widget
   */
  margin?: number | [number, number] | [number, number, number, number] | Insets;
  /**
   * Anchor point for positioning
   */
  anchor?: Anchor;
  /**
   * Rendering order (higher = on top)
   */
  zIndex?: number;
  /**
   * Whether the widget is visible
   */
  visible?: boolean;
  /**
   * Whether the widget is enabled for interaction
   */
  enabled?: boolean;
  /**
   * Whether this widget can receive focus
   */
  focusable?: boolean;
  /**
   * Unique identifier for this widget
   */
  id?: string;
  /**
   * Width sizing configuration
   */
  widthConfig?: SizeConfig;
  /**
   * Height sizing configuration
   */
  heightConfig?: SizeConfig;
}

/**
 * Abstract base class for all UI widgets.
 *
 * @since 0.5.0
 *
 * @example Creating a custom widget
 * ```ts
 * class MyWidget extends UIWidget {
 *   protected drawSelf(ctx: RenderContext): void {
 *     const theme = this.getTheme();
 *     ctx.fillRect(0, 0, this.width, this.height, theme.colors['panel.background']);
 *   }
 * }
 * ```
 */
export default abstract class UIWidget {
  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Unique identifier for this widget
   */
  public readonly id: string;

  /**
   * Position relative to parent
   */
  protected _x: number = 0;
  protected _y: number = 0;

  /**
   * Dimensions
   */
  protected _width: number = 0;
  protected _height: number = 0;

  /**
   * Computed absolute position (set during layout)
   */
  protected _absoluteX: number = 0;
  protected _absoluteY: number = 0;

  /**
   * Padding inside the widget
   */
  protected _padding: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

  /**
   * Margin outside the widget
   */
  protected _margin: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

  /**
   * Anchor point for positioning
   */
  protected _anchor: Anchor = 'top-left';

  /**
   * Z-index for rendering order
   */
  protected _zIndex: number = 0;

  /**
   * Visibility flag
   */
  protected _visible: boolean = true;

  /**
   * Enabled flag (affects interaction)
   */
  protected _enabled: boolean = true;

  /**
   * Whether this widget can receive focus
   */
  protected _focusable: boolean = false;

  /**
   * Parent widget reference
   */
  protected _parent: UIWidget | null = null;

  /**
   * Child widgets
   */
  protected _children: UIWidget[] = [];

  /**
   * Layout dirty flag
   */
  protected _layoutDirty: boolean = true;

  /**
   * Theme reference (set by UISystem)
   */
  protected _theme: UITheme | null = null;

  /**
   * State manager reference (set by UISystem)
   */
  protected _stateManager: UIStateManager | null = null;

  /**
   * Sizing configuration
   */
  protected _widthConfig: SizeConfig = { mode: 'fixed' };
  protected _heightConfig: SizeConfig = { mode: 'fixed' };

  /**
   * Event handlers
   */
  protected _eventHandlers: UIEventHandlers = {};

  /**
   * Counter for generating unique IDs
   */
  private static _idCounter: number = 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // Constructor
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a new UIWidget.
   *
   * @param config - Widget configuration options
   *
   * @since 0.5.0
   */
  constructor(config: UIWidgetConfig = {}) {
    this.id = config.id ?? `widget_${UIWidget._idCounter++}`;

    if (config.x !== undefined) {
      this._x = config.x;
    }
    if (config.y !== undefined) {
      this._y = config.y;
    }
    if (config.width !== undefined) {
      this._width = config.width;
    }
    if (config.height !== undefined) {
      this._height = config.height;
    }
    if (config.padding !== undefined) {
      this._padding = createInsets(config.padding);
    }
    if (config.margin !== undefined) {
      this._margin = createInsets(config.margin);
    }
    if (config.anchor !== undefined) {
      this._anchor = config.anchor;
    }
    if (config.zIndex !== undefined) {
      this._zIndex = config.zIndex;
    }
    if (config.visible !== undefined) {
      this._visible = config.visible;
    }
    if (config.enabled !== undefined) {
      this._enabled = config.enabled;
    }
    if (config.focusable !== undefined) {
      this._focusable = config.focusable;
    }
    if (config.widthConfig !== undefined) {
      this._widthConfig = config.widthConfig;
    }
    if (config.heightConfig !== undefined) {
      this._heightConfig = config.heightConfig;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Position & Size Accessors
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Horizontal position relative to parent
   */
  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    if (this._x !== value) {
      this._x = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Vertical position relative to parent
   */
  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    if (this._y !== value) {
      this._y = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Widget width
   */
  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    if (this._width !== value) {
      this._width = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Widget height
   */
  public get height(): number {
    return this._height;
  }

  public set height(value: number) {
    if (this._height !== value) {
      this._height = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Absolute X position in screen coordinates
   */
  public get absoluteX(): number {
    return this._absoluteX;
  }

  /**
   * Absolute Y position in screen coordinates
   */
  public get absoluteY(): number {
    return this._absoluteY;
  }

  /**
   * Padding
   */
  public get padding(): Insets {
    return this._padding;
  }

  public set padding(value: Insets) {
    this._padding = value;
    this.markLayoutDirty();
  }

  /**
   * Margin
   */
  public get margin(): Insets {
    return this._margin;
  }

  public set margin(value: Insets) {
    this._margin = value;
    this.markLayoutDirty();
  }

  /**
   * Anchor point
   */
  public get anchor(): Anchor {
    return this._anchor;
  }

  public set anchor(value: Anchor) {
    this._anchor = value;
    this.markLayoutDirty();
  }

  /**
   * Z-index
   */
  public get zIndex(): number {
    return this._zIndex;
  }

  public set zIndex(value: number) {
    this._zIndex = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // State Accessors
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Whether the widget is visible
   */
  public get visible(): boolean {
    return this._visible;
  }

  public set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Whether the widget is enabled
   */
  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
  }

  /**
   * Whether the widget can receive focus
   */
  public get focusable(): boolean {
    return this._focusable;
  }

  public set focusable(value: boolean) {
    this._focusable = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Hierarchy
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Parent widget
   */
  public get parent(): UIWidget | null {
    return this._parent;
  }

  /**
   * Child widgets (read-only copy)
   */
  public get children(): readonly UIWidget[] {
    return this._children;
  }

  /**
   * Adds a child widget.
   *
   * @param child - Widget to add
   * @returns This widget for chaining
   *
   * @since 0.5.0
   */
  public addChild(child: UIWidget): this {
    if (child._parent) {
      child._parent.removeChild(child);
    }
    child._parent = this;
    // Propagate theme and state manager recursively to child and all its descendants
    if (this._theme) {
      child.setTheme(this._theme);
    }
    if (this._stateManager) {
      child.setStateManager(this._stateManager);
    }
    this._children.push(child);
    this.markLayoutDirty();
    return this;
  }

  /**
   * Removes a child widget.
   *
   * @param child - Widget to remove
   * @returns True if the child was found and removed
   *
   * @since 0.5.0
   */
  public removeChild(child: UIWidget): boolean {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
      child._parent = null;
      this.markLayoutDirty();
      return true;
    }
    return false;
  }

  /**
   * Removes all child widgets.
   *
   * @since 0.5.0
   */
  public clearChildren(): void {
    for (const child of this._children) {
      child._parent = null;
    }
    this._children = [];
    this.markLayoutDirty();
  }

  /**
   * Finds a widget by ID in this widget's subtree.
   *
   * @param id - Widget ID to find
   * @returns The widget if found, null otherwise
   *
   * @since 0.5.0
   */
  public findById(id: string): UIWidget | null {
    if (this.id === id) {
      return this;
    }
    for (const child of this._children) {
      const found = child.findById(id);
      if (found) {
        return found;
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Theme
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the active theme.
   *
   * @returns The theme, or throws if no theme is set
   *
   * @since 0.5.0
   */
  public getTheme(): UITheme {
    if (this._theme) {
      return this._theme;
    }
    if (this._parent) {
      return this._parent.getTheme();
    }
    throw new Error('No theme set for UIWidget');
  }

  /**
   * Sets the theme for this widget and all children.
   *
   * @param theme - Theme to set
   *
   * @since 0.5.0
   */
  public setTheme(theme: UITheme): void {
    this._theme = theme;
    for (const child of this._children) {
      child.setTheme(theme);
    }
  }

  /**
   * Sets the state manager for this widget and all children.
   *
   * @param stateManager - State manager to set
   *
   * @since 0.5.0
   */
  public setStateManager(stateManager: UIStateManager | null): void {
    this._stateManager = stateManager;
    for (const child of this._children) {
      child.setStateManager(stateManager);
    }
  }

  /**
   * Returns whether this widget currently has focus.
   *
   * @returns True if focused
   *
   * @since 0.5.0
   */
  public isFocused(): boolean {
    return this._stateManager?.isFocused(this) ?? false;
  }

  /**
   * Returns whether this widget is currently hovered.
   *
   * @returns True if hovered
   *
   * @since 0.5.0
   */
  public isHovered(): boolean {
    return this._stateManager?.isHovered(this) ?? false;
  }

  /**
   * Returns whether this widget is currently pressed.
   *
   * @returns True if pressed
   *
   * @since 0.5.0
   */
  public isPressed(): boolean {
    return this._stateManager?.isPressed(this) ?? false;
  }

  /**
   * Returns whether this widget wants to capture vertical navigation
   * (UP/DOWN keys) instead of letting the focus manager handle them.
   *
   * Override in widgets like Dropdown that need internal navigation
   * when in an expanded/active state.
   *
   * @returns True if widget wants to handle UP/DOWN itself
   *
   * @since 0.5.0
   */
  public wantsCaptureNavigation(): boolean {
    return false;
  }

  /**
   * Returns whether this widget wants to capture horizontal navigation
   * (LEFT/RIGHT keys) instead of letting the system handle them.
   *
   * Override in widgets like scheme selectors that need LEFT/RIGHT
   * for value changes when focused.
   *
   * @returns True if widget wants to handle LEFT/RIGHT itself
   *
   * @since 0.5.0
   */
  public wantsCaptureHorizontalNav(): boolean {
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Marks this widget's layout as needing recalculation.
   *
   * @since 0.5.0
   */
  public markLayoutDirty(): void {
    this._layoutDirty = true;
    // Propagate to parent
    if (this._parent) {
      this._parent.markLayoutDirty();
    }
  }

  /**
   * Whether the layout needs recalculation.
   *
   * @since 0.5.0
   */
  public get layoutDirty(): boolean {
    return this._layoutDirty;
  }

  /**
   * Calculates the widget's layout.
   * Override in subclasses for custom layout behavior.
   *
   * @since 0.5.0
   */
  public layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent._absoluteX + this._x;
      this._absoluteY = this._parent._absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    // Layout children
    for (const child of this._children) {
      child.layout();
    }

    this._layoutDirty = false;
  }

  /**
   * Returns the bounding rectangle of this widget in absolute coordinates.
   *
   * @returns The widget's bounds
   *
   * @since 0.5.0
   */
  public getBounds(): UIRect {
    return {
      x: this._absoluteX,
      y: this._absoluteY,
      width: this._width,
      height: this._height,
    };
  }

  /**
   * Returns the inner bounds (minus padding) in absolute coordinates.
   *
   * @returns The widget's inner bounds
   *
   * @since 0.5.0
   */
  public getInnerBounds(): UIRect {
    return {
      x: this._absoluteX + this._padding.left,
      y: this._absoluteY + this._padding.top,
      width: this._width - this._padding.left - this._padding.right,
      height: this._height - this._padding.top - this._padding.bottom,
    };
  }

  /**
   * Calculates the preferred/intrinsic size of this widget.
   * Override in subclasses that have content-based sizing.
   *
   * @returns The preferred size
   *
   * @since 0.5.0
   */
  public getPreferredSize(): UISize {
    return { width: this._width, height: this._height };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Hit Testing
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Tests if a point (in absolute coordinates) is inside this widget.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if the point is inside
   *
   * @since 0.5.0
   */
  public containsPoint(x: number, y: number): boolean {
    return pointInRect(x, y, this.getBounds());
  }

  /**
   * Finds the deepest widget at the given point.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns The widget at the point, or null
   *
   * @since 0.5.0
   */
  public hitTest(x: number, y: number): UIWidget | null {
    if (!this._visible || !this.containsPoint(x, y)) {
      return null;
    }

    // Check children in reverse order (top-most first)
    for (let childIndex = this._children.length - 1; childIndex >= 0; childIndex -= 1) {
      const child = this._children[childIndex]!;
      const hit = child.hitTest(x, y);
      if (hit) {
        return hit;
      }
    }

    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Events
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets event handlers.
   *
   * @param handlers - Event handlers to set
   *
   * @since 0.5.0
   */
  public setEventHandlers(handlers: UIEventHandlers): void {
    this._eventHandlers = { ...this._eventHandlers, ...handlers };
  }

  /**
   * Handles an input event.
   * Override in subclasses for custom event handling.
   *
   * @param event - The event to handle
   * @returns True if the event was consumed
   *
   * @since 0.5.0
   */
  public handleEvent(_event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates the widget state.
   * Called once per frame.
   *
   * @param deltaTime - Seconds since last frame
   *
   * @since 0.5.0
   */
  public update(deltaTime: number): void {
    if (!this._visible) {
      return;
    }

    // Update children
    for (const child of this._children) {
      child.update(deltaTime);
    }
  }

  /**
   * Renders the widget.
   * Called once per frame after update.
   *
   * @param ctx - The render context
   *
   * @since 0.5.0
   */
  public render(ctx: RenderContext): void {
    if (!this._visible) {
      return;
    }

    // Layout if dirty
    if (this._layoutDirty) {
      this.layout();
    }

    ctx.save();
    ctx.translate(this._absoluteX, this._absoluteY);

    // Draw self
    this.drawSelf(ctx);

    ctx.restore();

    // Render children (sorted by z-index)
    const sortedChildren = [...this._children].sort((a, b) => a._zIndex - b._zIndex);
    for (const child of sortedChildren) {
      child.render(ctx);
    }
  }

  /**
   * Draws this widget's visual content.
   * Override in subclasses to implement custom rendering.
   *
   * @param ctx - The render context (already translated to widget position)
   *
   * @since 0.5.0
   */
  protected abstract drawSelf(ctx: RenderContext): void;

  /**
   * Renders overlay content that should appear on top of all widgets.
   * Called after the main render pass.
   *
   * Override in widgets like Dropdown that have popups.
   *
   * @param ctx - The render context
   *
   * @since 0.5.0
   */
  public renderOverlay(ctx: RenderContext): void {
    // Render children's overlays
    for (const child of this._children) {
      child.renderOverlay(ctx);
    }
  }

  /**
   * Called when the widget is being destroyed.
   * Override for cleanup.
   *
   * @since 0.5.0
   */
  public destroy(): void {
    for (const child of this._children) {
      child.destroy();
    }
    this._children = [];
    this._parent = null;
  }
}
