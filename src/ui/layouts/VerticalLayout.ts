/**
 * Vertical layout container that stacks children vertically.
 *
 * @category UI
 * @module ui/layouts/VerticalLayout
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type { HorizontalAlign, UISize } from '../core/types';

/**
 * Configuration for VerticalLayout.
 *
 * @since 0.5.0
 */
export interface VerticalLayoutConfig extends ContainerConfig {
  /** Space between children in pixels */
  spacing?: number;
  /** Horizontal alignment of children */
  align?: HorizontalAlign;
  /** If true, children fill the available width */
  fillWidth?: boolean;
}

/**
 * Vertical layout that stacks children from top to bottom.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const layout = new VerticalLayout({
 *   spacing: 8,
 *   align: 'center',
 *   padding: 10,
 * });
 *
 * layout.addChild(new Button({ text: 'Option 1' }));
 * layout.addChild(new Button({ text: 'Option 2' }));
 * layout.addChild(new Button({ text: 'Option 3' }));
 * ```
 */
export default class VerticalLayout extends Container {
  /** Space between children */
  protected _spacing: number = 0;

  /** Horizontal alignment */
  protected _align: HorizontalAlign = 'left';

  /** Fill width mode */
  protected _fillWidth: boolean = false;

  /**
   * Creates a new VerticalLayout.
   *
   * @param config - Layout configuration
   *
   * @since 0.5.0
   */
  constructor(config: VerticalLayoutConfig = {}) {
    super(config);
    if (config.spacing !== undefined) this._spacing = config.spacing;
    if (config.align !== undefined) this._align = config.align;
    if (config.fillWidth !== undefined) this._fillWidth = config.fillWidth;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Space between children */
  get spacing(): number {
    return this._spacing;
  }

  set spacing(value: number) {
    if (this._spacing !== value) {
      this._spacing = value;
      this.markLayoutDirty();
    }
  }

  /** Horizontal alignment */
  get align(): HorizontalAlign {
    return this._align;
  }

  set align(value: HorizontalAlign) {
    if (this._align !== value) {
      this._align = value;
      this.markLayoutDirty();
    }
  }

  /** Fill width mode */
  get fillWidth(): boolean {
    return this._fillWidth;
  }

  set fillWidth(value: boolean) {
    if (this._fillWidth !== value) {
      this._fillWidth = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates the preferred size based on children.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    let totalHeight = this._padding.top + this._padding.bottom;
    let maxWidth = 0;

    const visibleChildren = this._children.filter((c) => c.visible);

    for (let i = 0; i < visibleChildren.length; i++) {
      const child = visibleChildren[i]!;
      const childSize = child.getPreferredSize();

      totalHeight += child.margin.top + childSize.height + child.margin.bottom;
      if (i < visibleChildren.length - 1) {
        totalHeight += this._spacing;
      }

      const childWidth =
        child.margin.left + childSize.width + child.margin.right;
      maxWidth = Math.max(maxWidth, childWidth);
    }

    return {
      width: Math.max(
        this._width,
        maxWidth + this._padding.left + this._padding.right,
      ),
      height: Math.max(this._height, totalHeight),
    };
  }

  /**
   * Layouts children vertically.
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

    // Available width for children (minus padding)
    const availableWidth =
      this._width - this._padding.left - this._padding.right;

    // Layout children
    let y = this._padding.top;

    for (const child of this._children) {
      if (!child.visible) continue;

      const childSize = child.getPreferredSize();

      // Apply margin
      y += child.margin.top;

      // Determine child width
      let childWidth = childSize.width;
      if (this._fillWidth) {
        childWidth = availableWidth - child.margin.left - child.margin.right;
      }

      // Calculate x based on alignment
      let x = this._padding.left + child.margin.left;

      if (!this._fillWidth) {
        switch (this._align) {
          case 'center':
            x = this._padding.left + (availableWidth - childWidth) / 2;
            break;
          case 'right':
            x =
              this._padding.left
              + availableWidth
              - childWidth
              - child.margin.right;
            break;
        }
      }

      // Position child
      child.x = x;
      child.y = y;

      // Update child size
      child.width = childWidth;
      child.height = childSize.height;

      // Layout child
      child.layout();

      // Move to next position
      y += childSize.height + child.margin.bottom + this._spacing;
    }

    this._layoutDirty = false;
  }
}
