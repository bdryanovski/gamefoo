/**
 * Vertical layout container that stacks children vertically.
 *
 * @category UI
 * @module ui/layouts/VerticalLayout
 * @since 0.5.0
 */

import Container, { type ContainerConfig } from '../core/Container';
import type { HorizontalAlign, JustifyContent, UISize } from '../core/types';

/**
 * Configuration for VerticalLayout.
 *
 * @since 0.5.0
 */
export interface VerticalLayoutConfig extends ContainerConfig {
  /**
   * Space between children in pixels
   */
  spacing?: number;
  /**
   * Horizontal alignment of children
   */
  align?: HorizontalAlign;
  /**
   * Vertical distribution of children
   */
  justify?: JustifyContent;
  /**
   * If true, children fill the available width
   */
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
  /**
   * Space between children
   */
  protected _spacing: number = 0;

  /**
   * Horizontal alignment
   */
  protected _align: HorizontalAlign = 'left';

  /**
   * Vertical justify
   */
  protected _justify: JustifyContent = 'start';

  /**
   * Fill width mode
   */
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
    if (config.spacing !== undefined) {
      this._spacing = config.spacing;
    }
    if (config.align !== undefined) {
      this._align = config.align;
    }
    if (config.justify !== undefined) {
      this._justify = config.justify;
    }
    if (config.fillWidth !== undefined) {
      this._fillWidth = config.fillWidth;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Space between children
   */
  public get spacing(): number {
    return this._spacing;
  }

  public set spacing(value: number) {
    if (this._spacing !== value) {
      this._spacing = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Horizontal alignment
   */
  public get align(): HorizontalAlign {
    return this._align;
  }

  public set align(value: HorizontalAlign) {
    if (this._align !== value) {
      this._align = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Fill width mode
   */
  public get fillWidth(): boolean {
    return this._fillWidth;
  }

  public set fillWidth(value: boolean) {
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
  public override getPreferredSize(): UISize {
    let totalHeight = this._padding.top + this._padding.bottom;
    let maxWidth = 0;

    const visibleChildren = this._children.filter((c) => c.visible);

    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = child.getPreferredSize();

      totalHeight += child.margin.top + childSize.height + child.margin.bottom;
      if (index < visibleChildren.length - 1) {
        totalHeight += this._spacing;
      }

      const childWidth = child.margin.left + childSize.width + child.margin.right;
      maxWidth = Math.max(maxWidth, childWidth);
    }

    return {
      width: Math.max(this._width, maxWidth + this._padding.left + this._padding.right),
      height: Math.max(this._height, totalHeight),
    };
  }

  /**
   * Layouts children vertically.
   *
   * @since 0.5.0
   */
  public override layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent.absoluteX + this._x;
      this._absoluteY = this._parent.absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    // Available dimensions for children (minus padding)
    const availableWidth = this._width - this._padding.left - this._padding.right;
    const availableHeight = this._height - this._padding.top - this._padding.bottom;

    const visibleChildren = this._children.filter((c) => c.visible);

    // Calculate total children height
    let totalChildrenHeight = 0;
    const childSizes: Array<{ width: number; height: number }> = [];

    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = child.getPreferredSize();
      childSizes.push(childSize);
      totalChildrenHeight += child.margin.top + childSize.height + child.margin.bottom;
      if (index < visibleChildren.length - 1 && this._justify !== 'space-between') {
        totalChildrenHeight += this._spacing;
      }
    }

    // Calculate starting Y and spacing based on justify
    let y = this._padding.top;
    let effectiveSpacing = this._spacing;

    switch (this._justify) {
      case 'start':
        y = this._padding.top;
        break;
      case 'center':
        y = this._padding.top + (availableHeight - totalChildrenHeight) / 2;
        break;
      case 'end':
        y = this._padding.top + availableHeight - totalChildrenHeight;
        break;
      case 'space-between':
        y = this._padding.top;
        if (visibleChildren.length > 1) {
          let contentHeight = 0;
          for (let index = 0; index < visibleChildren.length; index += 1) {
            const child = visibleChildren[index]!;
            contentHeight += child.margin.top + childSizes[index]!.height + child.margin.bottom;
          }
          effectiveSpacing = (availableHeight - contentHeight) / (visibleChildren.length - 1);
        }
        break;
    }

    // Layout children
    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = childSizes[index]!;

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
            x = this._padding.left + availableWidth - childWidth - child.margin.right;
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
      y += childSize.height + child.margin.bottom + effectiveSpacing;
    }

    this._layoutDirty = false;
  }
}
