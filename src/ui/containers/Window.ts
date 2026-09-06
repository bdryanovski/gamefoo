/**
 * Window widget with title bar, optional close button, and dragging.
 *
 * @category UI
 * @module ui/containers/Window
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type { UIInputEvent, UIMouseButtonEvent, UIMouseMoveEvent } from '../core/types';

/**
 * Configuration for Window.
 *
 * @since 0.5.0
 */
export interface WindowConfig extends ContainerConfig {
  /**
   * Window title
   */
  title?: string;
  /**
   * Whether window is closable
   */
  closable?: boolean;
  /**
   * Whether window is draggable
   */
  draggable?: boolean;
  /**
   * Title bar height
   */
  titleHeight?: number;
  /**
   * Close callback
   */
  onClose?: () => void;
}

/**
 * Window container with title bar and optional close button.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const window = new Window({
 *   title: 'Options',
 *   width: 250,
 *   height: 200,
 *   closable: true,
 *   draggable: true,
 *   onClose: () => window.visible = false,
 * });
 * ```
 */
export default class Window extends Container {
  /**
   * Window title
   */
  protected _title: string = 'Window';

  /**
   * Whether closable
   */
  protected _closable: boolean = true;

  /**
   * Whether draggable
   */
  protected _draggable: boolean = false;

  /**
   * Title bar height
   */
  protected _titleHeight: number = 14;

  /**
   * Close callback
   */
  protected _onClose: (() => void) | null = null;

  /**
   * Whether currently dragging
   */
  private _dragging: boolean = false;

  /**
   * Drag offset
   */
  private _dragOffsetX: number = 0;
  private _dragOffsetY: number = 0;

  /**
   * Close button size
   */
  private readonly CLOSE_BUTTON_SIZE = 10;

  /**
   * Creates a new Window.
   *
   * @param config - Window configuration
   *
   * @since 0.5.0
   */
  constructor(config: WindowConfig = {}) {
    super({
      ...config,
      padding: config.padding ?? 6,
      clip: config.clip ?? true,
    });
    if (config.title !== undefined) {
      this._title = config.title;
    }
    if (config.closable !== undefined) {
      this._closable = config.closable;
    }
    if (config.draggable !== undefined) {
      this._draggable = config.draggable;
    }
    if (config.titleHeight !== undefined) {
      this._titleHeight = config.titleHeight;
    }
    if (config.onClose !== undefined) {
      this._onClose = config.onClose;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Window title
   */
  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  /**
   * Whether closable
   */
  public get closable(): boolean {
    return this._closable;
  }

  public set closable(value: boolean) {
    this._closable = value;
  }

  /**
   * Whether draggable
   */
  public get draggable(): boolean {
    return this._draggable;
  }

  public set draggable(value: boolean) {
    this._draggable = value;
  }

  /**
   * Title height
   */
  public get titleHeight(): number {
    return this._titleHeight;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Methods
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Closes the window.
   *
   * @since 0.5.0
   */
  public close(): void {
    if (this._onClose) {
      this._onClose();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Layouts children accounting for title bar.
   *
   * @since 0.5.0
   */
  public override layout(): void {
    // Adjust effective padding for title bar
    const originalPaddingTop = this._padding.top;
    this._padding.top += this._titleHeight;

    super.layout();

    // Restore padding
    this._padding.top = originalPaddingTop;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Events
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

    if (event.type === 'mousedown') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (mouseEvent.button === 'left') {
        // Check close button
        if (this._closable && this.isInCloseButton(mouseEvent.x, mouseEvent.y)) {
          this.close();
          event.consume();
          return true;
        }

        // Check title bar for dragging
        if (this._draggable && this.isInTitleBar(mouseEvent.x, mouseEvent.y)) {
          this._dragging = true;
          this._dragOffsetX = mouseEvent.x - this._absoluteX;
          this._dragOffsetY = mouseEvent.y - this._absoluteY;
          event.consume();
          return true;
        }
      }
    }

    if (event.type === 'mousemove' && this._dragging) {
      const mouseEvent = event as UIMouseMoveEvent;
      this._x = mouseEvent.x - this._dragOffsetX;
      this._y = mouseEvent.y - this._dragOffsetY;
      this.markLayoutDirty();
      event.consume();
      return true;
    }

    if (event.type === 'mouseup') {
      if (this._dragging) {
        this._dragging = false;
        event.consume();
        return true;
      }
    }

    return super.handleEvent(event);
  }

  /**
   * Checks if a point is in the title bar.
   *
   * @internal
   */
  private isInTitleBar(x: number, y: number): boolean {
    return (
      x >= this._absoluteX &&
      x < this._absoluteX + this._width &&
      y >= this._absoluteY &&
      y < this._absoluteY + this._titleHeight
    );
  }

  /**
   * Checks if a point is in the close button.
   *
   * @internal
   */
  private isInCloseButton(x: number, y: number): boolean {
    const btnX = this._absoluteX + this._width - this._padding.right - this.CLOSE_BUTTON_SIZE;
    const btnY = this._absoluteY + (this._titleHeight - this.CLOSE_BUTTON_SIZE) / 2;

    return (
      x >= btnX &&
      x < btnX + this.CLOSE_BUTTON_SIZE &&
      y >= btnY &&
      y < btnY + this.CLOSE_BUTTON_SIZE
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the window.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected override drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();

      // Draw window background
      ctx.fillRect(0, 0, this._width, this._height, theme.colors['panel.background']);

      // Draw border
      ctx.strokeRect(0, 0, this._width, this._height, theme.colors['panel.border']);

      // Draw title bar
      ctx.fillRect(0, 0, this._width, this._titleHeight, theme.colors['panel.header']);
      ctx.fillRect(0, this._titleHeight - 1, this._width, 1, theme.colors['panel.border']);

      // Draw title text
      const font = theme.fonts.default;
      const textX = this._padding.left;
      const textY = (this._titleHeight - font.height) / 2;

      const canvas = ctx.getCanvas?.();
      if (canvas) {
        canvas.fillStyle = theme.colors['label.text'];
        font.renderText(this._title, textX, textY, ctx);
      } else {
        ctx.drawText(this._title, textX, textY, theme.colors['label.text']);
      }

      // Draw close button
      if (this._closable) {
        const btnX = this._width - this._padding.right - this.CLOSE_BUTTON_SIZE;
        const btnY = (this._titleHeight - this.CLOSE_BUTTON_SIZE) / 2;

        // X mark
        const xColor = theme.colors['label.text'];
        ctx.drawLine(
          btnX + 2,
          btnY + 2,
          btnX + this.CLOSE_BUTTON_SIZE - 2,
          btnY + this.CLOSE_BUTTON_SIZE - 2,
          xColor,
        );
        ctx.drawLine(
          btnX + this.CLOSE_BUTTON_SIZE - 2,
          btnY + 2,
          btnX + 2,
          btnY + this.CLOSE_BUTTON_SIZE - 2,
          xColor,
        );
      }
    } catch {
      // Fallback rendering
      ctx.fillRect(0, 0, this._width, this._height, '#1a1a1a');
      ctx.strokeRect(0, 0, this._width, this._height, '#444444');

      ctx.fillRect(0, 0, this._width, this._titleHeight, '#333333');
      ctx.drawText(this._title, this._padding.left, 2, '#FFFFFF');

      if (this._closable) {
        const btnX = this._width - this._padding.right - this.CLOSE_BUTTON_SIZE;
        const btnY = (this._titleHeight - this.CLOSE_BUTTON_SIZE) / 2;
        ctx.drawText('X', btnX + 2, btnY, '#FFFFFF');
      }
    }
  }
}
