/**
 * Scrollable container that clips content and provides scrolling.
 *
 * @category UI
 * @module ui/layouts/ScrollView
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type { UIInputEvent, UIKeyEvent, UIMouseWheelEvent } from '../core/types';
import type UIWidget from '../core/UIWidget';

/**
 * Configuration for ScrollView.
 *
 * @since 0.5.0
 */
export interface ScrollViewConfig extends ContainerConfig {
  /**
   * Content widget
   */
  content?: UIWidget;
  /**
   * Enable horizontal scrolling
   */
  horizontalScroll?: boolean;
  /**
   * Enable vertical scrolling
   */
  verticalScroll?: boolean;
  /**
   * Scroll speed multiplier
   */
  scrollSpeed?: number;
  /**
   * Show scrollbars
   */
  showScrollbars?: boolean;
  /**
   * Scrollbar width
   */
  scrollbarWidth?: number;
}

/**
 * Scrollable container with clipping and scrollbar support.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const scrollView = new ScrollView({
 *   width: 200,
 *   height: 100,
 *   verticalScroll: true,
 *   showScrollbars: true,
 * });
 *
 * const content = new VerticalLayout();
 * for (let i = 0; i < 20; i++) {
 *   content.addChild(new Label({ text: `Item ${i}` }));
 * }
 * scrollView.setContent(content);
 * ```
 */
export default class ScrollView extends Container {
  /**
   * Content widget
   */
  protected _content: UIWidget | null = null;

  /**
   * Enable horizontal scrolling
   */
  protected _horizontalScroll: boolean = false;

  /**
   * Enable vertical scrolling
   */
  protected _verticalScroll: boolean = true;

  /**
   * Scroll position X
   */
  protected _scrollX: number = 0;

  /**
   * Scroll position Y
   */
  protected _scrollY: number = 0;

  /**
   * Scroll speed multiplier
   */
  protected _scrollSpeed: number = 20;

  /**
   * Show scrollbars
   */
  protected _showScrollbars: boolean = true;

  /**
   * Scrollbar width
   */
  protected _scrollbarWidth: number = 6;

  /**
   * Creates a new ScrollView.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: ScrollViewConfig = {}) {
    super({ ...config, clip: true });
    if (config.content) {
      this.setContent(config.content);
    }
    if (config.horizontalScroll !== undefined) {
      this._horizontalScroll = config.horizontalScroll;
    }
    if (config.verticalScroll !== undefined) {
      this._verticalScroll = config.verticalScroll;
    }
    if (config.scrollSpeed !== undefined) {
      this._scrollSpeed = config.scrollSpeed;
    }
    if (config.showScrollbars !== undefined) {
      this._showScrollbars = config.showScrollbars;
    }
    if (config.scrollbarWidth !== undefined) {
      this._scrollbarWidth = config.scrollbarWidth;
    }

    this._focusable = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Current scroll position X
   */
  public get scrollX(): number {
    return this._scrollX;
  }

  public set scrollX(value: number) {
    const max = this.maxScrollX;
    this._scrollX = Math.max(0, Math.min(max, value));
    this.markLayoutDirty();
  }

  /**
   * Current scroll position Y
   */
  public get scrollY(): number {
    return this._scrollY;
  }

  public set scrollY(value: number) {
    const max = this.maxScrollY;
    this._scrollY = Math.max(0, Math.min(max, value));
    this.markLayoutDirty();
  }

  /**
   * Maximum scroll X
   */
  public get maxScrollX(): number {
    if (!this._content) {
      return 0;
    }
    const contentSize = this._content.getPreferredSize();
    const viewWidth = this._width - this._padding.left - this._padding.right;
    if (this._showScrollbars && this._verticalScroll) {
      return Math.max(0, contentSize.width - viewWidth + this._scrollbarWidth);
    }
    return Math.max(0, contentSize.width - viewWidth);
  }

  /**
   * Maximum scroll Y
   */
  public get maxScrollY(): number {
    if (!this._content) {
      return 0;
    }
    const contentSize = this._content.getPreferredSize();
    const viewHeight = this._height - this._padding.top - this._padding.bottom;
    if (this._showScrollbars && this._horizontalScroll) {
      return Math.max(0, contentSize.height - viewHeight + this._scrollbarWidth);
    }
    return Math.max(0, contentSize.height - viewHeight);
  }

  /**
   * Scroll speed
   */
  public get scrollSpeed(): number {
    return this._scrollSpeed;
  }

  public set scrollSpeed(value: number) {
    this._scrollSpeed = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Content Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the content widget.
   *
   * @param content - Content widget
   *
   * @since 0.5.0
   */
  public setContent(content: UIWidget | null): void {
    if (this._content) {
      this.removeChild(this._content);
    }
    this._content = content;
    if (content) {
      this.addChild(content);
    }
    this._scrollX = 0;
    this._scrollY = 0;
    this.markLayoutDirty();
  }

  /**
   * Gets the content widget.
   *
   * @since 0.5.0
   */
  public getContent(): UIWidget | null {
    return this._content;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Scrolling
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Scrolls by a delta amount.
   *
   * @param dx - Horizontal delta
   * @param dy - Vertical delta
   *
   * @since 0.5.0
   */
  public scrollBy(dx: number, dy: number): void {
    if (this._horizontalScroll) {
      this.scrollX += dx;
    }
    if (this._verticalScroll) {
      this.scrollY += dy;
    }
  }

  /**
   * Scrolls to a specific position.
   *
   * @param x - X position
   * @param y - Y position
   *
   * @since 0.5.0
   */
  public scrollTo(x: number, y: number): void {
    this.scrollX = x;
    this.scrollY = y;
  }

  /**
   * Scrolls to make a child widget visible.
   *
   * @param widget - Widget to scroll to
   *
   * @since 0.5.0
   */
  public scrollToWidget(widget: UIWidget): void {
    const viewWidth = this._width - this._padding.left - this._padding.right;
    const viewHeight = this._height - this._padding.top - this._padding.bottom;

    const widgetLeft = widget.x;
    const widgetRight = widget.x + widget.width;
    const widgetTop = widget.y;
    const widgetBottom = widget.y + widget.height;

    // Scroll horizontally if needed
    if (this._horizontalScroll) {
      if (widgetLeft < this._scrollX) {
        this.scrollX = widgetLeft;
      } else if (widgetRight > this._scrollX + viewWidth) {
        this.scrollX = widgetRight - viewWidth;
      }
    }

    // Scroll vertically if needed
    if (this._verticalScroll) {
      if (widgetTop < this._scrollY) {
        this.scrollY = widgetTop;
      } else if (widgetBottom > this._scrollY + viewHeight) {
        this.scrollY = widgetBottom - viewHeight;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Event Handling
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handles input events.
   *
   * @param event - Input event
   * @returns True if consumed
   *
   * @since 0.5.0
   */
  public override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }

    if (event.type === 'mousewheel') {
      return this.handleMouseWheel(event as UIMouseWheelEvent);
    }

    if (event.type === 'keydown') {
      return this.handleKeyDown(event as UIKeyEvent);
    }

    return false;
  }

  /**
   * Handles mouse wheel scrolling.
   *
   * @internal
   */
  private handleMouseWheel(event: UIMouseWheelEvent): boolean {
    if (this._verticalScroll && event.deltaY !== 0) {
      this.scrollBy(0, event.deltaY * this._scrollSpeed);
      event.consume();
      return true;
    }
    if (this._horizontalScroll && event.deltaX !== 0) {
      this.scrollBy(event.deltaX * this._scrollSpeed, 0);
      event.consume();
      return true;
    }
    return false;
  }

  /**
   * Handles keyboard scrolling.
   *
   * @internal
   */
  private handleKeyDown(event: UIKeyEvent): boolean {
    switch (event.key) {
      case 'ArrowUp':
        if (this._verticalScroll) {
          this.scrollBy(0, -this._scrollSpeed);
          event.consume();
          return true;
        }
        break;
      case 'ArrowDown':
        if (this._verticalScroll) {
          this.scrollBy(0, this._scrollSpeed);
          event.consume();
          return true;
        }
        break;
      case 'ArrowLeft':
        if (this._horizontalScroll) {
          this.scrollBy(-this._scrollSpeed, 0);
          event.consume();
          return true;
        }
        break;
      case 'ArrowRight':
        if (this._horizontalScroll) {
          this.scrollBy(this._scrollSpeed, 0);
          event.consume();
          return true;
        }
        break;
      case 'PageUp':
        if (this._verticalScroll) {
          this.scrollBy(0, -(this._height - this._padding.top - this._padding.bottom));
          event.consume();
          return true;
        }
        break;
      case 'PageDown':
        if (this._verticalScroll) {
          this.scrollBy(0, this._height - this._padding.top - this._padding.bottom);
          event.consume();
          return true;
        }
        break;
      case 'Home':
        this.scrollTo(0, 0);
        event.consume();
        return true;
      case 'End':
        this.scrollTo(this.maxScrollX, this.maxScrollY);
        event.consume();
        return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Layouts the content with scroll offset.
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

    if (this._content) {
      // Position content with scroll offset
      this._content.x = this._padding.left - this._scrollX;
      this._content.y = this._padding.top - this._scrollY;

      // Let content calculate its size
      const contentSize = this._content.getPreferredSize();
      this._content.width = contentSize.width;
      this._content.height = contentSize.height;

      this._content.layout();
    }

    this._layoutDirty = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the scroll view and scrollbars.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected override drawSelf(ctx: RenderContext): void {
    super.drawSelf(ctx);

    if (!this._showScrollbars) {
      return;
    }

    try {
      const theme = this.getTheme();
      const trackColor = theme.colors['scrollbar.track'];
      const thumbColor = theme.colors['scrollbar.thumb'];

      // Draw vertical scrollbar
      if (this._verticalScroll && this.maxScrollY > 0) {
        const scrollbarX = this._width - this._scrollbarWidth - 1;
        const scrollbarHeight = this._height - this._padding.top - this._padding.bottom;
        const contentHeight = this._content?.getPreferredSize().height ?? this._height;

        // Track
        ctx.fillRect(
          scrollbarX,
          this._padding.top,
          this._scrollbarWidth,
          scrollbarHeight,
          trackColor,
        );

        // Thumb
        const thumbHeight = Math.max(10, (scrollbarHeight / contentHeight) * scrollbarHeight);
        const thumbY =
          this._padding.top + (this._scrollY / this.maxScrollY) * (scrollbarHeight - thumbHeight);

        ctx.fillRect(scrollbarX, thumbY, this._scrollbarWidth, thumbHeight, thumbColor);
      }

      // Draw horizontal scrollbar
      if (this._horizontalScroll && this.maxScrollX > 0) {
        const scrollbarY = this._height - this._scrollbarWidth - 1;
        const scrollbarWidth = this._width - this._padding.left - this._padding.right;
        const contentWidth = this._content?.getPreferredSize().width ?? this._width;

        // Track
        ctx.fillRect(
          this._padding.left,
          scrollbarY,
          scrollbarWidth,
          this._scrollbarWidth,
          trackColor,
        );

        // Thumb
        const thumbWidth = Math.max(10, (scrollbarWidth / contentWidth) * scrollbarWidth);
        const thumbX =
          this._padding.left + (this._scrollX / this.maxScrollX) * (scrollbarWidth - thumbWidth);

        ctx.fillRect(thumbX, scrollbarY, thumbWidth, this._scrollbarWidth, thumbColor);
      }
    } catch {
      // No theme set, skip scrollbars
    }
  }
}
