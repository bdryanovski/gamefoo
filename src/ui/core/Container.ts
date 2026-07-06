/**
 * Base class for container widgets that hold child widgets.
 *
 * Containers manage child widgets and provide layout functionality.
 * They can optionally clip children to their bounds.
 *
 * @category UI
 * @module ui/core/Container
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UISize } from './types';
import UIWidget, { type UIWidgetConfig } from './UIWidget';

/**
 * Container-specific configuration options.
 *
 * @since 0.5.0
 */
export interface ContainerConfig extends UIWidgetConfig {
  /** Whether to clip children to container bounds */
  clip?: boolean;
  /** Background color (uses theme if not specified) */
  background?: string | null;
}

/**
 * Base class for container widgets.
 *
 * @since 0.5.0
 *
 * @example Creating a simple container
 * ```ts
 * const container = new Container({
 *   x: 10,
 *   y: 10,
 *   width: 200,
 *   height: 150,
 *   clip: true,
 * });
 *
 * container.addChild(new Label({ text: 'Hello' }));
 * container.addChild(new Button({ text: 'Click me' }));
 * ```
 */
export default class Container extends UIWidget {
  /** Whether to clip children to bounds */
  protected _clip: boolean = false;

  /** Optional background color */
  protected _background: string | null = null;

  /**
   * Creates a new Container.
   *
   * @param config - Container configuration
   *
   * @since 0.5.0
   */
  constructor(config: ContainerConfig = {}) {
    super(config);
    if (config.clip !== undefined) this._clip = config.clip;
    if (config.background !== undefined) this._background = config.background;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Whether clipping is enabled */
  get clip(): boolean {
    return this._clip;
  }

  set clip(value: boolean) {
    this._clip = value;
  }

  /** Background color */
  get background(): string | null {
    return this._background;
  }

  set background(value: string | null) {
    this._background = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates the preferred size based on children.
   *
   * @returns The preferred size
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    if (this._children.length === 0) {
      return { width: this._width, height: this._height };
    }

    let maxRight = 0;
    let maxBottom = 0;

    for (const child of this._children) {
      if (!child.visible) continue;

      const childSize = child.getPreferredSize();
      const right =
        child.x + child.margin.left + childSize.width + child.margin.right;
      const bottom =
        child.y + child.margin.top + childSize.height + child.margin.bottom;

      maxRight = Math.max(maxRight, right);
      maxBottom = Math.max(maxBottom, bottom);
    }

    return {
      width: Math.max(
        this._width,
        maxRight + this._padding.left + this._padding.right,
      ),
      height: Math.max(
        this._height,
        maxBottom + this._padding.top + this._padding.bottom,
      ),
    };
  }

  /**
   * Default layout implementation - positions children at their specified positions.
   * Override in subclasses for custom layout behavior (VerticalLayout, etc.)
   *
   * @since 0.5.0
   */
  override layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent.absoluteX + this._x;
      this._absoluteY = this._parent.absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    // Available inner size (minus padding)
    const innerWidth = this._width - this._padding.left - this._padding.right;
    const innerHeight = this._height - this._padding.top - this._padding.bottom;

    // Layout children - propagate size to children that don't have explicit size
    for (const child of this._children) {
      // If child has no explicit width/height, give it the available space
      if (child.width === 0) {
        child.width = innerWidth;
      }
      if (child.height === 0) {
        child.height = innerHeight;
      }
      child.layout();
    }

    this._layoutDirty = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Renders the container and its children.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  override render(ctx: RenderContext): void {
    if (!this._visible) return;

    // Layout if dirty
    if (this._layoutDirty) {
      this.layout();
    }

    ctx.save();

    // Draw self (background, border, etc.)
    ctx.translate(this._absoluteX, this._absoluteY);
    this.drawSelf(ctx);
    ctx.restore();

    // Set up clipping if enabled
    if (this._clip) {
      const canvas = ctx.getCanvas?.();
      if (canvas) {
        canvas.save();
        canvas.beginPath();
        canvas.rect(
          this._absoluteX + this._padding.left,
          this._absoluteY + this._padding.top,
          this._width - this._padding.left - this._padding.right,
          this._height - this._padding.top - this._padding.bottom,
        );
        canvas.clip();
      }
    }

    // Render children sorted by z-index
    const sortedChildren = [...this._children].sort(
      (a, b) => a.zIndex - b.zIndex,
    );
    for (const child of sortedChildren) {
      child.render(ctx);
    }

    // Restore clipping
    if (this._clip) {
      const canvas = ctx.getCanvas?.();
      canvas?.restore();
    }
  }

  /**
   * Draws the container's visual content (background, border).
   *
   * @param ctx - Render context (translated to widget position)
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    // Draw background if specified
    if (this._background) {
      ctx.fillRect(0, 0, this._width, this._height, this._background);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Child Management Helpers
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Adds multiple children at once.
   *
   * @param children - Children to add
   * @returns This container for chaining
   *
   * @since 0.5.0
   */
  addChildren(...children: UIWidget[]): this {
    for (const child of children) {
      this.addChild(child);
    }
    return this;
  }

  /**
   * Gets a child by index.
   *
   * @param index - Child index
   * @returns The child or undefined
   *
   * @since 0.5.0
   */
  getChildAt(index: number): UIWidget | undefined {
    return this._children[index];
  }

  /**
   * Gets the number of children.
   *
   * @since 0.5.0
   */
  get childCount(): number {
    return this._children.length;
  }

  /**
   * Checks if the container has any children.
   *
   * @since 0.5.0
   */
  get hasChildren(): boolean {
    return this._children.length > 0;
  }

  /**
   * Iterates over children.
   *
   * @param callback - Function to call for each child
   *
   * @since 0.5.0
   */
  forEachChild(callback: (child: UIWidget, index: number) => void): void {
    this._children.forEach(callback);
  }
}
