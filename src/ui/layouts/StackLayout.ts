/**
 * Stack layout container where all children occupy the same space.
 *
 * @category UI
 * @module ui/layouts/StackLayout
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type { HorizontalAlign, UISize, VerticalAlign } from '../core/types';

/**
 * Configuration for StackLayout.
 *
 * @since 0.5.0
 */
export interface StackLayoutConfig extends ContainerConfig {
  /** Horizontal alignment of children */
  horizontalAlign?: HorizontalAlign;
  /** Vertical alignment of children */
  verticalAlign?: VerticalAlign;
}

/**
 * Stack layout where all children occupy the same rectangle.
 *
 * Useful for overlays, loading indicators, modal backgrounds,
 * and switchable content panels.
 *
 * @since 0.5.0
 *
 * @example Loading overlay
 * ```ts
 * const stack = new StackLayout();
 *
 * // Content (always visible)
 * stack.addChild(gameContent);
 *
 * // Loading overlay (toggle visibility)
 * const loadingOverlay = new Panel({ visible: false });
 * loadingOverlay.addChild(new Label({ text: 'Loading...' }));
 * stack.addChild(loadingOverlay);
 * ```
 */
export default class StackLayout extends Container {
  /** Horizontal alignment */
  protected _horizontalAlign: HorizontalAlign = 'center';

  /** Vertical alignment */
  protected _verticalAlign: VerticalAlign = 'center';

  /**
   * Creates a new StackLayout.
   *
   * @param config - Layout configuration
   *
   * @since 0.5.0
   */
  constructor(config: StackLayoutConfig = {}) {
    super(config);
    if (config.horizontalAlign !== undefined)
      this._horizontalAlign = config.horizontalAlign;
    if (config.verticalAlign !== undefined)
      this._verticalAlign = config.verticalAlign;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Horizontal alignment */
  get horizontalAlign(): HorizontalAlign {
    return this._horizontalAlign;
  }

  set horizontalAlign(value: HorizontalAlign) {
    if (this._horizontalAlign !== value) {
      this._horizontalAlign = value;
      this.markLayoutDirty();
    }
  }

  /** Vertical alignment */
  get verticalAlign(): VerticalAlign {
    return this._verticalAlign;
  }

  set verticalAlign(value: VerticalAlign) {
    if (this._verticalAlign !== value) {
      this._verticalAlign = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates the preferred size (largest child size).
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    let maxWidth = 0;
    let maxHeight = 0;

    for (const child of this._children) {
      if (!child.visible) continue;

      const childSize = child.getPreferredSize();
      const width = child.margin.left + childSize.width + child.margin.right;
      const height = child.margin.top + childSize.height + child.margin.bottom;

      maxWidth = Math.max(maxWidth, width);
      maxHeight = Math.max(maxHeight, height);
    }

    return {
      width: Math.max(
        this._width,
        maxWidth + this._padding.left + this._padding.right,
      ),
      height: Math.max(
        this._height,
        maxHeight + this._padding.top + this._padding.bottom,
      ),
    };
  }

  /**
   * Layouts all children at the same position.
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

    // Available space
    const availableWidth =
      this._width - this._padding.left - this._padding.right;
    const availableHeight =
      this._height - this._padding.top - this._padding.bottom;

    for (const child of this._children) {
      if (!child.visible) continue;

      const childSize = child.getPreferredSize();

      // Calculate x based on horizontal alignment
      let x = this._padding.left + child.margin.left;
      switch (this._horizontalAlign) {
        case 'center':
          x = this._padding.left + (availableWidth - childSize.width) / 2;
          break;
        case 'right':
          x =
            this._padding.left
            + availableWidth
            - childSize.width
            - child.margin.right;
          break;
      }

      // Calculate y based on vertical alignment
      let y = this._padding.top + child.margin.top;
      switch (this._verticalAlign) {
        case 'center':
          y = this._padding.top + (availableHeight - childSize.height) / 2;
          break;
        case 'bottom':
          y =
            this._padding.top
            + availableHeight
            - childSize.height
            - child.margin.bottom;
          break;
      }

      // Position child
      child.x = x;
      child.y = y;
      child.width = childSize.width;
      child.height = childSize.height;

      // Layout child
      child.layout();
    }

    this._layoutDirty = false;
  }
}
