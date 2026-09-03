/**
 * Label widget for displaying text.
 *
 * @category UI
 * @module ui/display/Label
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { HorizontalAlign, UISize } from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Label.
 *
 * @since 0.5.0
 */
export interface LabelConfig extends UIWidgetConfig {
  /**
   * Text to display
   */
  text?: string;
  /**
   * Text alignment
   */
  align?: HorizontalAlign;
  /**
   * Custom text color (uses theme if not set)
   */
  color?: string;
  /**
   * Use muted color from theme
   */
  muted?: boolean;
  /**
   * Use accent color from theme
   */
  accent?: boolean;
  /**
   * Font size key: 'small', 'default', 'large'
   */
  fontSize?: 'small' | 'default' | 'large';
}

/**
 * Label widget for displaying static text.
 *
 * Labels are non-interactive and used to display text information.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const label = new Label({
 *   text: 'Hello World',
 *   align: 'center',
 * });
 *
 * const mutedLabel = new Label({
 *   text: 'Hint text',
 *   muted: true,
 *   fontSize: 'small',
 * });
 * ```
 */
export default class Label extends UIWidget {
  /**
   * Text content
   */
  protected _text: string = '';

  /**
   * Text alignment
   */
  protected _align: HorizontalAlign = 'left';

  /**
   * Custom color override
   */
  protected _color: string | null = null;

  /**
   * Use muted style
   */
  protected _muted: boolean = false;

  /**
   * Use accent style
   */
  protected _accent: boolean = false;

  /**
   * Font size key
   */
  protected _fontSize: 'small' | 'default' | 'large' = 'default';

  /**
   * Creates a new Label.
   *
   * @param config - Label configuration
   *
   * @since 0.5.0
   */
  constructor(config: LabelConfig = {}) {
    super(config);
    if (config.text !== undefined) {
      this._text = config.text;
    }
    if (config.align !== undefined) {
      this._align = config.align;
    }
    if (config.color !== undefined) {
      this._color = config.color;
    }
    if (config.muted !== undefined) {
      this._muted = config.muted;
    }
    if (config.accent !== undefined) {
      this._accent = config.accent;
    }
    if (config.fontSize !== undefined) {
      this._fontSize = config.fontSize;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Text content
   */
  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Text alignment
   */
  public get align(): HorizontalAlign {
    return this._align;
  }

  public set align(value: HorizontalAlign) {
    if (this._align !== value) {
      this._align = value;
    }
  }

  /**
   * Custom color
   */
  public get color(): string | null {
    return this._color;
  }

  public set color(value: string | null) {
    this._color = value;
  }

  /**
   * Muted style
   */
  public get muted(): boolean {
    return this._muted;
  }

  public set muted(value: boolean) {
    this._muted = value;
  }

  /**
   * Accent style
   */
  public get accent(): boolean {
    return this._accent;
  }

  public set accent(value: boolean) {
    this._accent = value;
  }

  /**
   * Font size key
   */
  public get fontSize(): 'small' | 'default' | 'large' {
    return this._fontSize;
  }

  public set fontSize(value: 'small' | 'default' | 'large') {
    if (this._fontSize !== value) {
      this._fontSize = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size based on text.
   *
   * @since 0.5.0
   */
  public override getPreferredSize(): UISize {
    try {
      const theme = this.getTheme();
      const font = theme.fonts[this._fontSize];
      const textWidth = font.getTextWidth(this._text);

      return {
        width: Math.max(this._width, textWidth + this._padding.left + this._padding.right),
        height: Math.max(this._height, font.height + this._padding.top + this._padding.bottom),
      };
    } catch {
      // No theme, return current size
      return { width: this._width, height: this._height };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the label text.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    if (!this._text) {
      return;
    }

    try {
      const theme = this.getTheme();
      const font = theme.fonts[this._fontSize];

      // Determine color
      let color: string;
      if (this._color) {
        color = this._color;
      } else if (this._accent) {
        color = theme.colors['label.textAccent'];
      } else if (this._muted) {
        color = theme.colors['label.textMuted'];
      } else {
        color = theme.colors['label.text'];
      }

      // Calculate text position
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

      // Render text
      const canvas = ctx.getCanvas?.();
      if (canvas) {
        canvas.fillStyle = color;
        font.renderText(this._text, x, y, ctx);
      } else {
        ctx.drawText(this._text, x, y, color);
      }
    } catch {
      // Fallback if no theme
      ctx.drawText(this._text, this._padding.left, this._padding.top, '#FFFFFF');
    }
  }
}
