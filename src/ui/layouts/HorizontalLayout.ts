/**
 * Horizontal layout container that stacks children horizontally.
 *
 * @category UI
 * @module ui/layouts/HorizontalLayout
 * @since 0.5.0
 */

import Container, { type ContainerConfig } from '../core/Container';
import type { JustifyContent, UISize, VerticalAlign } from '../core/types';

/**
 * Configuration for HorizontalLayout.
 *
 * @since 0.5.0
 */
export interface HorizontalLayoutConfig extends ContainerConfig {
  /**
   * Space between children in pixels
   */
  spacing?: number;
  /**
   * Vertical alignment of children
   */
  align?: VerticalAlign;
  /**
   * Horizontal distribution of children
   */
  justify?: JustifyContent;
}

/**
 * Horizontal layout that stacks children from left to right.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const layout = new HorizontalLayout({
 *   spacing: 8,
 *   align: 'center',
 *   padding: 10,
 * });
 *
 * layout.addChild(new Button({ text: 'A' }));
 * layout.addChild(new Button({ text: 'B' }));
 * layout.addChild(new Button({ text: 'C' }));
 * ```
 */
export default class HorizontalLayout extends Container {
  /**
   * Space between children
   */
  protected _spacing: number = 0;

  /**
   * Vertical alignment
   */
  protected _align: VerticalAlign = 'top';

  /**
   * Horizontal justify
   */
  protected _justify: JustifyContent = 'start';

  /**
   * Creates a new HorizontalLayout.
   *
   * @param config - Layout configuration
   *
   * @since 0.5.0
   */
  constructor(config: HorizontalLayoutConfig = {}) {
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
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Space between children
   */
  get spacing(): number {
    return this._spacing;
  }

  set spacing(value: number) {
    if (this._spacing !== value) {
      this._spacing = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Vertical alignment
   */
  get align(): VerticalAlign {
    return this._align;
  }

  set align(value: VerticalAlign) {
    if (this._align !== value) {
      this._align = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Horizontal justify
   */
  get justify(): JustifyContent {
    return this._justify;
  }

  set justify(value: JustifyContent) {
    if (this._justify !== value) {
      this._justify = value;
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
    let totalWidth = this._padding.left + this._padding.right;
    let maxHeight = 0;

    const visibleChildren = this._children.filter((c) => c.visible);

    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = child.getPreferredSize();

      totalWidth += child.margin.left + childSize.width + child.margin.right;
      if (index < visibleChildren.length - 1) {
        totalWidth += this._spacing;
      }

      const childHeight = child.margin.top + childSize.height + child.margin.bottom;
      maxHeight = Math.max(maxHeight, childHeight);
    }

    return {
      width: Math.max(this._width, totalWidth),
      height: Math.max(this._height, maxHeight + this._padding.top + this._padding.bottom),
    };
  }

  /**
   * Layouts children horizontally.
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

    // Available dimensions for children (minus padding)
    const availableWidth = this._width - this._padding.left - this._padding.right;
    const availableHeight = this._height - this._padding.top - this._padding.bottom;

    const visibleChildren = this._children.filter((c) => c.visible);

    // Calculate total children width
    let totalChildrenWidth = 0;
    const childSizes: UISize[] = [];

    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = child.getPreferredSize();
      childSizes.push(childSize);
      totalChildrenWidth += child.margin.left + childSize.width + child.margin.right;
      if (index < visibleChildren.length - 1 && this._justify !== 'space-between') {
        totalChildrenWidth += this._spacing;
      }
    }

    // Calculate starting X and spacing based on justify
    let x = this._padding.left;
    let effectiveSpacing = this._spacing;

    switch (this._justify) {
      case 'start':
        x = this._padding.left;
        break;
      case 'center':
        x = this._padding.left + (availableWidth - totalChildrenWidth) / 2;
        break;
      case 'end':
        x = this._padding.left + availableWidth - totalChildrenWidth;
        break;
      case 'space-between':
        x = this._padding.left;
        if (visibleChildren.length > 1) {
          // Calculate total content width (just children, no spacing)
          let contentWidth = 0;
          for (let index = 0; index < visibleChildren.length; index += 1) {
            const child = visibleChildren[index]!;
            contentWidth += child.margin.left + childSizes[index]!.width + child.margin.right;
          }
          effectiveSpacing = (availableWidth - contentWidth) / (visibleChildren.length - 1);
        }
        break;
    }

    // Layout children
    for (let index = 0; index < visibleChildren.length; index += 1) {
      const child = visibleChildren[index]!;
      const childSize = childSizes[index]!;

      // Apply margin
      x += child.margin.left;

      // Calculate y based on alignment
      let y = this._padding.top + child.margin.top;

      switch (this._align) {
        case 'center':
          y = this._padding.top + (availableHeight - childSize.height) / 2;
          break;
        case 'bottom':
          y = this._padding.top + availableHeight - childSize.height - child.margin.bottom;
          break;
      }

      // Position child
      child.x = x;
      child.y = y;

      // Update child size
      child.width = childSize.width;
      child.height = childSize.height;

      // Layout child
      child.layout();

      // Move to next position
      x += childSize.width + child.margin.right + effectiveSpacing;
    }

    this._layoutDirty = false;
  }
}
