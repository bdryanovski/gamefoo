/**
 * Slider widget for numeric value selection.
 *
 * @category UI
 * @module ui/controls/Slider
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UIMouseMoveEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Slider.
 *
 * @since 0.5.0
 */
export interface SliderConfig extends UIWidgetConfig {
  /**
   * Label text
   */
  label?: string;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Step size
   */
  step?: number;
  /**
   * Current value
   */
  value?: number;
  /**
   * Change callback
   */
  onChange?: (value: number) => void;
  /**
   * Track height
   */
  trackHeight?: number;
  /**
   * Thumb width
   */
  thumbWidth?: number;
  /**
   * Show value text
   */
  showValue?: boolean;
}

/**
 * Slider widget for numeric value selection.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const volumeSlider = new Slider({
 *   label: 'Volume',
 *   min: 0,
 *   max: 100,
 *   step: 5,
 *   value: 75,
 *   showValue: true,
 *   onChange: (value) => {
 *     audio.volume = value / 100;
 *   },
 * });
 * ```
 */
export default class Slider extends UIWidget {
  /**
   * Label text
   */
  protected _label: string = '';

  /**
   * Minimum value
   */
  protected _min: number = 0;

  /**
   * Maximum value
   */
  protected _max: number = 100;

  /**
   * Step size
   */
  protected _step: number = 1;

  /**
   * Current value
   */
  protected _value: number = 0;

  /**
   * Change callback
   */
  protected _onChange: ((value: number) => void) | null = null;

  /**
   * Track height
   */
  protected _trackHeight: number = 4;

  /**
   * Thumb width
   */
  protected _thumbWidth: number = 6;

  /**
   * Show value text
   */
  protected _showValue: boolean = false;

  /**
   * Whether dragging
   */
  private _dragging: boolean = false;

  /**
   * Creates a new Slider.
   *
   * @param config - Slider configuration
   *
   * @since 0.5.0
   */
  constructor(config: SliderConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 2,
    });
    if (config.label !== undefined) {
      this._label = config.label;
    }
    if (config.min !== undefined) {
      this._min = config.min;
    }
    if (config.max !== undefined) {
      this._max = config.max;
    }
    if (config.step !== undefined) {
      this._step = config.step;
    }
    if (config.value !== undefined) {
      this._value = config.value;
    }
    if (config.onChange !== undefined) {
      this._onChange = config.onChange;
    }
    if (config.trackHeight !== undefined) {
      this._trackHeight = config.trackHeight;
    }
    if (config.thumbWidth !== undefined) {
      this._thumbWidth = config.thumbWidth;
    }
    if (config.showValue !== undefined) {
      this._showValue = config.showValue;
    }

    // Clamp initial value
    this._value = this.clampValue(this._value);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Label text
   */
  get label(): string {
    return this._label;
  }

  set label(value: string) {
    if (this._label !== value) {
      this._label = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Minimum value
   */
  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
    this._value = this.clampValue(this._value);
  }

  /**
   * Maximum value
   */
  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
    this._value = this.clampValue(this._value);
  }

  /**
   * Step size
   */
  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
    this._value = this.clampValue(this._value);
  }

  /**
   * Current value
   */
  get value(): number {
    return this._value;
  }

  set value(val: number) {
    const clamped = this.clampValue(val);
    if (this._value !== clamped) {
      this._value = clamped;
      if (this._onChange) {
        this._onChange(clamped);
      }
    }
  }

  /**
   * Change callback
   */
  get onChange(): ((value: number) => void) | null {
    return this._onChange;
  }

  set onChange(value: ((value: number) => void) | null) {
    this._onChange = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Horizontal Navigation Capture
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Slider wants to capture LEFT/RIGHT for value adjustment.
   *
   * @returns Always true when focused
   *
   * @since 0.5.0
   */
  override wantsCaptureHorizontalNav(): boolean {
    return this.isFocused();
  }

  /**
   * Handles horizontal navigation (LEFT/RIGHT).
   *
   * @param direction - 'left' or 'right'
   *
   * @since 0.5.0
   */
  handleHorizontalNav(direction: 'left' | 'right'): void {
    if (direction === 'left') {
      this.value -= this._step;
    } else {
      this.value += this._step;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Internal
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Clamps and steps a value.
   *
   * @internal
   */
  private clampValue(value: number): number {
    // Clamp to range
    let result = Math.max(this._min, Math.min(this._max, value));
    // Snap to step
    if (this._step > 0) {
      result = Math.round((result - this._min) / this._step) * this._step + this._min;
    }
    return result;
  }

  /**
   * Gets the track bounds.
   *
   * @internal
   */
  private getTrackBounds(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const trackX = this._padding.left + this._thumbWidth / 2;
    const trackY =
      this._padding.top +
      (this._height - this._padding.top - this._padding.bottom - this._trackHeight) / 2;
    const trackWidth = this._width - this._padding.left - this._padding.right - this._thumbWidth;
    return {
      x: trackX,
      y: trackY,
      width: trackWidth,
      height: this._trackHeight,
    };
  }

  /**
   * Converts screen X to value.
   *
   * @internal
   */
  private screenToValue(screenX: number): number {
    const track = this.getTrackBounds();
    const localX = screenX - this._absoluteX;
    const t = Math.max(0, Math.min(1, (localX - track.x) / track.width));
    return this._min + t * (this._max - this._min);
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
    let labelHeight = 0;
    if (this._label || this._showValue) {
      try {
        const theme = this.getTheme();
        labelHeight = theme.fonts.default.height + 2;
      } catch {
        labelHeight = 10;
      }
    }

    return {
      width: Math.max(this._width, 60),
      height: Math.max(
        this._height,
        this._padding.top + labelHeight + this._trackHeight + 4 + this._padding.bottom,
      ),
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
    if (!this._visible || !this._enabled) {
      return false;
    }

    if (event.type === 'mousedown') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (mouseEvent.button === 'left' && this.containsPoint(mouseEvent.x, mouseEvent.y)) {
        this._dragging = true;
        this.value = this.screenToValue(mouseEvent.x);
        event.consume();
        return true;
      }
    }

    if (event.type === 'mousemove' && this._dragging) {
      const mouseEvent = event as UIMouseMoveEvent;
      this.value = this.screenToValue(mouseEvent.x);
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

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;
      switch (keyEvent.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          this.value -= this._step;
          event.consume();
          return true;
        case 'ArrowRight':
        case 'ArrowUp':
          this.value += this._step;
          event.consume();
          return true;
        case 'Home':
          this.value = this._min;
          event.consume();
          return true;
        case 'End':
          this.value = this._max;
          event.consume();
          return true;
      }
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the slider.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;
      const isFocused = this.isFocused();

      // Draw focus indicator
      if (isFocused) {
        const focusColor = theme.colors['focus.ring'];
        ctx.strokeRect(0, 0, this._width, this._height, focusColor);
      }

      let labelHeight = 0;

      // Draw label and value
      if (this._label || this._showValue) {
        const labelY = this._padding.top;
        const labelColor = isFocused ? theme.colors['focus.ring'] : theme.colors['label.text'];

        if (this._label) {
          const canvas = ctx.getCanvas?.();
          if (canvas) {
            canvas.fillStyle = labelColor;
            font.renderText(this._label, this._padding.left, labelY, ctx);
          } else {
            ctx.drawText(this._label, this._padding.left, labelY, labelColor);
          }
        }

        if (this._showValue) {
          const valueText = String(Math.round(this._value));
          const valueWidth = font.getTextWidth(valueText);
          const valueX = this._width - this._padding.right - valueWidth;

          const canvas = ctx.getCanvas?.();
          if (canvas) {
            canvas.fillStyle = labelColor;
            font.renderText(valueText, valueX, labelY, ctx);
          } else {
            ctx.drawText(valueText, valueX, labelY, labelColor);
          }
        }

        labelHeight = font.height + 2;
      }

      // Draw track
      const track = this.getTrackBounds();
      const adjustedTrackY =
        this._padding.top +
        labelHeight +
        (this._height -
          this._padding.top -
          labelHeight -
          this._padding.bottom -
          this._trackHeight) /
          2;

      ctx.fillRect(
        track.x,
        adjustedTrackY,
        track.width,
        this._trackHeight,
        theme.colors['slider.track'],
      );

      // Draw fill
      const fillRatio = (this._value - this._min) / (this._max - this._min);
      const fillWidth = track.width * fillRatio;
      ctx.fillRect(
        track.x,
        adjustedTrackY,
        fillWidth,
        this._trackHeight,
        theme.colors['slider.trackFill'],
      );

      // Draw thumb (highlight when focused)
      const thumbX = track.x + fillWidth - this._thumbWidth / 2;
      const thumbY = adjustedTrackY - 2;
      const thumbHeight = this._trackHeight + 4;
      const thumbColor = isFocused ? theme.colors['focus.ring'] : theme.colors['slider.thumb'];

      ctx.fillRect(thumbX, thumbY, this._thumbWidth, thumbHeight, thumbColor);
    } catch {
      // Fallback rendering
      const track = this.getTrackBounds();
      ctx.fillRect(track.x, track.y, track.width, track.height, '#333333');

      const fillRatio = (this._value - this._min) / (this._max - this._min);
      const fillWidth = track.width * fillRatio;
      ctx.fillRect(track.x, track.y, fillWidth, track.height, '#00AAFF');

      const thumbX = track.x + fillWidth - this._thumbWidth / 2;
      ctx.fillRect(thumbX, track.y - 2, this._thumbWidth, track.height + 4, '#FFFFFF');
    }
  }
}
