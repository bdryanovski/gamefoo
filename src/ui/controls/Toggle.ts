/**
 * Toggle switch widget for boolean values.
 *
 * @category UI
 * @module ui/controls/Toggle
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Toggle.
 *
 * @since 0.5.0
 */
export interface ToggleConfig extends UIWidgetConfig {
  /** Label text */
  label?: string;
  /** Toggle state */
  value?: boolean;
  /** Change callback */
  onChange?: (value: boolean) => void;
  /** Track width */
  trackWidth?: number;
  /** Track height */
  trackHeight?: number;
  /** Gap between toggle and label */
  gap?: number;
  /** Show ON/OFF text */
  showText?: boolean;
}

/**
 * Toggle switch widget for boolean values.
 *
 * Visual switch style alternative to checkbox.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const toggle = new Toggle({
 *   label: 'Dark Mode',
 *   value: false,
 *   onChange: (value) => {
 *     settings.darkMode = value;
 *   },
 * });
 * ```
 */
export default class Toggle extends UIWidget {
  /** Label text */
  protected _label: string = '';

  /** Toggle value */
  protected _value: boolean = false;

  /** Change callback */
  protected _onChange: ((value: boolean) => void) | null = null;

  /** Track width */
  protected _trackWidth: number = 20;

  /** Track height */
  protected _trackHeight: number = 10;

  /** Gap between toggle and label */
  protected _gap: number = 6;

  /** Show ON/OFF text */
  protected _showText: boolean = false;

  /**
   * Creates a new Toggle.
   *
   * @param config - Toggle configuration
   *
   * @since 0.5.0
   */
  constructor(config: ToggleConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 2,
    });
    if (config.label !== undefined) this._label = config.label;
    if (config.value !== undefined) this._value = config.value;
    if (config.onChange !== undefined) this._onChange = config.onChange;
    if (config.trackWidth !== undefined) this._trackWidth = config.trackWidth;
    if (config.trackHeight !== undefined)
      this._trackHeight = config.trackHeight;
    if (config.gap !== undefined) this._gap = config.gap;
    if (config.showText !== undefined) this._showText = config.showText;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Label text */
  get label(): string {
    return this._label;
  }

  set label(value: string) {
    if (this._label !== value) {
      this._label = value;
      this.markLayoutDirty();
    }
  }

  /** Toggle value */
  get value(): boolean {
    return this._value;
  }

  set value(val: boolean) {
    if (this._value !== val) {
      this._value = val;
      if (this._onChange) {
        this._onChange(val);
      }
    }
  }

  /** Change callback */
  get onChange(): ((value: boolean) => void) | null {
    return this._onChange;
  }

  set onChange(value: ((value: boolean) => void) | null) {
    this._onChange = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    let labelWidth = 0;
    let labelHeight = 0;

    if (this._label) {
      try {
        const theme = this.getTheme();
        const font = theme.fonts.default;
        labelWidth = font.getTextWidth(this._label);
        labelHeight = font.height;
      } catch {
        labelWidth = this._label.length * 6;
        labelHeight = 8;
      }
    }

    let textWidth = 0;
    if (this._showText) {
      try {
        const theme = this.getTheme();
        const font = theme.fonts.small;
        textWidth = font.getTextWidth('OFF') + 4;
      } catch {
        textWidth = 20;
      }
    }

    const width =
      this._padding.left
      + this._trackWidth
      + textWidth
      + (this._label ? this._gap + labelWidth : 0)
      + this._padding.right;

    const height =
      this._padding.top
      + Math.max(this._trackHeight, labelHeight)
      + this._padding.bottom;

    return {
      width: Math.max(this._width, width),
      height: Math.max(this._height, height),
    };
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
    if (!this._visible || !this._enabled) return false;

    if (event.type === 'mouseup') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (
        mouseEvent.button === 'left'
        && this.containsPoint(mouseEvent.x, mouseEvent.y)
      ) {
        this.toggle();
        event.consume();
        return true;
      }
    }

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;
      if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
        this.toggle();
        event.consume();
        return true;
      }
    }

    return false;
  }

  /**
   * Toggles the value.
   *
   * @since 0.5.0
   */
  toggle(): void {
    this.value = !this._value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the toggle switch.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();
      const isFocused = this.isFocused();

      // Draw focus indicator
      if (isFocused) {
        const focusColor = theme.colors['focus.ring'];
        ctx.strokeRect(0, 0, this._width, this._height, focusColor);
      }

      const trackY =
        this._padding.top
        + (this._height
          - this._padding.top
          - this._padding.bottom
          - this._trackHeight)
          / 2;

      // Draw label on left
      if (this._label) {
        const font = theme.fonts.default;
        const labelX = this._padding.left;
        const labelY =
          this._padding.top
          + (this._height
            - this._padding.top
            - this._padding.bottom
            - font.height)
            / 2;
        const labelColor = isFocused
          ? theme.colors['focus.ring']
          : theme.colors['label.text'];

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = labelColor;
          font.renderText(this._label, labelX, labelY, ctx);
        } else {
          ctx.drawText(this._label, labelX, labelY, labelColor);
        }
      }

      // Draw track on right
      const trackX = this._width - this._padding.right - this._trackWidth;
      if (this._showText) {
        // Account for ON/OFF text width
        const font = theme.fonts.small;
        const textWidth = font.getTextWidth('OFF') + 4;
      }

      const trackColor = this._value
        ? theme.colors['checkbox.backgroundChecked']
        : theme.colors['slider.track'];

      ctx.fillRect(
        trackX,
        trackY,
        this._trackWidth,
        this._trackHeight,
        trackColor,
      );

      // Draw thumb
      const thumbSize = this._trackHeight - 2;
      const thumbX = this._value
        ? trackX + this._trackWidth - thumbSize - 1
        : trackX + 1;
      const thumbY = trackY + 1;

      const thumbColor = isFocused
        ? theme.colors['focus.ring']
        : theme.colors['slider.thumb'];
      ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize, thumbColor);

      // Draw ON/OFF text after track
      if (this._showText) {
        const font = theme.fonts.small;
        const text = this._value ? 'ON' : 'OFF';
        const textX = trackX + this._trackWidth + 2;
        const textY = trackY + (this._trackHeight - font.height) / 2;
        const textColor = isFocused
          ? theme.colors['focus.ring']
          : theme.colors['label.text'];

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = textColor;
          font.renderText(text, textX, textY, ctx);
        } else {
          ctx.drawText(text, textX, textY, textColor);
        }
      }
    } catch {
      // Fallback rendering
      const trackX = this._width - this._padding.right - this._trackWidth;
      const trackY = this._padding.top;

      // Label on left
      if (this._label) {
        ctx.drawText(this._label, this._padding.left, trackY, '#FFFFFF');
      }

      // Track on right
      ctx.fillRect(
        trackX,
        trackY,
        this._trackWidth,
        this._trackHeight,
        this._value ? '#00FF00' : '#333333',
      );

      const thumbSize = this._trackHeight - 2;
      const thumbX = this._value
        ? trackX + this._trackWidth - thumbSize - 1
        : trackX + 1;
      ctx.fillRect(thumbX, trackY + 1, thumbSize, thumbSize, '#FFFFFF');
    }
  }
}
