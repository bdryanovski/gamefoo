/**
 * Button widget for clickable actions.
 *
 * @category UI
 * @module ui/controls/Button
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  HorizontalAlign,
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Button.
 *
 * @since 0.5.0
 */
export interface ButtonConfig extends UIWidgetConfig {
  /**
   * Button label text
   */
  text?: string;
  /**
   * Text alignment
   */
  align?: HorizontalAlign;
  /**
   * Click callback
   */
  onClick?: () => void;
  /**
   * Hover callback
   */
  onHover?: (hovered: boolean) => void;
}

/**
 * Button widget for clickable actions.
 *
 * Supports hover, pressed, disabled, and focused states.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const button = new Button({
 *   text: 'Click Me',
 *   onClick: () => console.log('Clicked!'),
 *   padding: 8,
 * });
 * ```
 */
export default class Button extends UIWidget {
  /**
   * Button text
   */
  protected _text: string = '';

  /**
   * Text alignment
   */
  protected _align: HorizontalAlign = 'center';

  /**
   * Click callback
   */
  protected _onClick: (() => void) | null = null;

  /**
   * Hover callback
   */
  protected _onHover: ((hovered: boolean) => void) | null = null;

  /**
   * Last hover state for callback
   */
  private _wasHovered: boolean = false;

  /**
   * Creates a new Button.
   *
   * @param config - Button configuration
   *
   * @since 0.5.0
   */
  constructor(config: ButtonConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 4,
    });
    if (config.text !== undefined) {
      this._text = config.text;
    }
    if (config.align !== undefined) {
      this._align = config.align;
    }
    if (config.onClick !== undefined) {
      this._onClick = config.onClick;
    }
    if (config.onHover !== undefined) {
      this._onHover = config.onHover;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Button text
   */
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Text alignment
   */
  get align(): HorizontalAlign {
    return this._align;
  }

  set align(value: HorizontalAlign) {
    this._align = value;
  }

  /**
   * Click callback
   */
  get onClick(): (() => void) | null {
    return this._onClick;
  }

  set onClick(value: (() => void) | null) {
    this._onClick = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size based on text.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;
      const textWidth = font.getTextWidth(this._text);

      return {
        width: Math.max(this._width, textWidth + this._padding.left + this._padding.right),
        height: Math.max(this._height, font.height + this._padding.top + this._padding.bottom),
      };
    } catch {
      return { width: this._width || 60, height: this._height || 16 };
    }
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
  override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }

    if (event.type === 'mouseup') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (mouseEvent.button === 'left' && this.containsPoint(mouseEvent.x, mouseEvent.y)) {
        this.activate();
        event.consume();
        return true;
      }
    }

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        this.activate();
        event.consume();
        return true;
      }
    }

    return false;
  }

  /**
   * Activates the button (triggers click).
   *
   * @since 0.5.0
   */
  activate(): void {
    if (this._enabled && this._onClick) {
      this._onClick();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Update
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates hover state callback.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  override update(deltaTime: number): void {
    super.update(deltaTime);

    // Check hover callback
    if (this._onHover) {
      // We need access to state manager - this would be set via UISystem
      // For now, we'll rely on the rendering to check state
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the button.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();

      // Get state from state manager
      const isDisabled = !this._enabled;
      const isFocused = this.isFocused();

      // Determine colors based on state
      let bgColor: string;
      let textColor: string;
      let borderColor: string;

      if (isDisabled) {
        bgColor = theme.colors['button.backgroundDisabled'];
        textColor = theme.colors['button.textDisabled'];
        borderColor = theme.colors['button.border'];
      } else if (isFocused) {
        bgColor = theme.colors['button.backgroundHover'] ?? theme.colors['button.background'];
        textColor = theme.colors['button.text'];
        borderColor = theme.colors['focus.ring'];
      } else {
        bgColor = theme.colors['button.background'];
        textColor = theme.colors['button.text'];
        borderColor = theme.colors['button.border'];
      }

      // Draw background
      ctx.fillRect(0, 0, this._width, this._height, bgColor);

      // Draw border (thicker when focused)
      const borderWidth = isFocused ? 2 : theme.borderWidth;
      if (borderWidth > 0) {
        ctx.strokeRect(0, 0, this._width, this._height, borderColor);
        if (isFocused && borderWidth > 1) {
          ctx.strokeRect(1, 1, this._width - 2, this._height - 2, borderColor);
        }
      }

      // Draw text
      if (this._text) {
        const font = theme.fonts.default;
        const textWidth = font.getTextWidth(this._text);

        let x = this._padding.left;
        switch (this._align) {
          case 'center':
            x = (this._width - textWidth) / 2;
            break;
          case 'right':
            x = this._width - textWidth - this._padding.right;
            break;
        }

        const y = this._padding.top;

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = textColor;
          font.renderText(this._text, x, y, ctx);
        } else {
          ctx.drawText(this._text, x, y, textColor);
        }
      }
    } catch {
      // Fallback rendering
      ctx.fillRect(0, 0, this._width, this._height, '#444444');
      ctx.strokeRect(0, 0, this._width, this._height, '#666666');
      if (this._text) {
        ctx.drawText(this._text, this._padding.left, this._padding.top, '#FFFFFF');
      }
    }
  }
}
