/**
 * Checkbox widget for boolean values.
 *
 * @category UI
 * @module ui/controls/Checkbox
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UIInputEvent, UIKeyEvent, UIMouseButtonEvent, UISize } from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Checkbox.
 *
 * @since 0.5.0
 */
export interface CheckboxConfig extends UIWidgetConfig {
  /**
   * Label text
   */
  label?: string;
  /**
   * Checked state
   */
  checked?: boolean;
  /**
   * Change callback
   */
  onChange?: (checked: boolean) => void;
  /**
   * Box size in pixels
   */
  boxSize?: number;
  /**
   * Gap between box and label
   */
  gap?: number;
}

/**
 * Checkbox widget for boolean values.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const checkbox = new Checkbox({
 *   label: 'Enable feature',
 *   checked: true,
 *   onChange: (checked) => {
 *     settings.feature = checked;
 *   },
 * });
 * ```
 */
export default class Checkbox extends UIWidget {
  /**
   * Label text
   */
  protected _label: string = '';

  /**
   * Checked state
   */
  protected _checked: boolean = false;

  /**
   * Change callback
   */
  protected _onChange: ((checked: boolean) => void) | null = null;

  /**
   * Box size
   */
  protected _boxSize: number = 8;

  /**
   * Gap between box and label
   */
  protected _gap: number = 4;

  /**
   * Creates a new Checkbox.
   *
   * @param config - Checkbox configuration
   *
   * @since 0.5.0
   */
  constructor(config: CheckboxConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 2,
    });
    if (config.label !== undefined) {
      this._label = config.label;
    }
    if (config.checked !== undefined) {
      this._checked = config.checked;
    }
    if (config.onChange !== undefined) {
      this._onChange = config.onChange;
    }
    if (config.boxSize !== undefined) {
      this._boxSize = config.boxSize;
    }
    if (config.gap !== undefined) {
      this._gap = config.gap;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Label text
   */
  public get label(): string {
    return this._label;
  }

  public set label(value: string) {
    if (this._label !== value) {
      this._label = value;
      this.markLayoutDirty();
    }
  }

  /**
   * Checked state
   */
  public get checked(): boolean {
    return this._checked;
  }

  public set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      if (this._onChange) {
        this._onChange(value);
      }
    }
  }

  /**
   * Change callback
   */
  public get onChange(): ((checked: boolean) => void) | null {
    return this._onChange;
  }

  public set onChange(value: ((checked: boolean) => void) | null) {
    this._onChange = value;
  }

  /**
   * Box size
   */
  public get boxSize(): number {
    return this._boxSize;
  }

  public set boxSize(value: number) {
    if (this._boxSize !== value) {
      this._boxSize = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size.
   *
   * @since 0.5.0
   */
  public override getPreferredSize(): UISize {
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

    const width =
      this._padding.left +
      this._boxSize +
      (this._label ? this._gap + labelWidth : 0) +
      this._padding.right;

    const height = this._padding.top + Math.max(this._boxSize, labelHeight) + this._padding.bottom;

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
  public override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }

    if (event.type === 'mouseup') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (mouseEvent.button === 'left' && this.containsPoint(mouseEvent.x, mouseEvent.y)) {
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
   * Toggles the checked state.
   *
   * @since 0.5.0
   */
  public toggle(): void {
    this.checked = !this._checked;
  }

  /**
   * Activates the checkbox (toggles it).
   * Called by UISystem when PRIMARY action is pressed.
   *
   * @since 0.5.0
   */
  public activate(): void {
    this.toggle();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the checkbox.
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

      // Draw box
      const boxX = this._padding.left;
      const boxY =
        this._padding.top +
        (this._height - this._padding.top - this._padding.bottom - this._boxSize) / 2;

      const boxBgColor = this._checked
        ? theme.colors['checkbox.backgroundChecked']
        : theme.colors['checkbox.background'];
      const boxBorderColor = isFocused
        ? theme.colors['focus.ring']
        : theme.colors['checkbox.border'];

      ctx.fillRect(boxX, boxY, this._boxSize, this._boxSize, boxBgColor);
      ctx.strokeRect(boxX, boxY, this._boxSize, this._boxSize, boxBorderColor);

      // Draw checkmark if checked
      if (this._checked) {
        const checkColor = theme.colors['checkbox.check'];
        const inset = 2;

        // Simple checkmark as two lines
        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.strokeStyle = checkColor;
          canvas.lineWidth = 1;
          canvas.beginPath();
          // Draw a simple X or checkmark
          canvas.moveTo(boxX + inset, boxY + this._boxSize / 2);
          canvas.lineTo(boxX + this._boxSize / 2, boxY + this._boxSize - inset);
          canvas.lineTo(boxX + this._boxSize - inset, boxY + inset);
          canvas.stroke();
        } else {
          // Fallback - fill inner area
          ctx.fillRect(
            boxX + inset,
            boxY + inset,
            this._boxSize - inset * 2,
            this._boxSize - inset * 2,
            checkColor,
          );
        }
      }

      // Draw label
      if (this._label) {
        const font = theme.fonts.default;
        const labelX = boxX + this._boxSize + this._gap;
        const labelY =
          this._padding.top +
          (this._height - this._padding.top - this._padding.bottom - font.height) / 2;
        const labelColor = isFocused ? theme.colors['focus.ring'] : theme.colors['label.text'];

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = labelColor;
          font.renderText(this._label, labelX, labelY, ctx);
        } else {
          ctx.drawText(this._label, labelX, labelY, labelColor);
        }
      }
    } catch {
      // Fallback rendering
      ctx.fillRect(
        this._padding.left,
        this._padding.top,
        this._boxSize,
        this._boxSize,
        this._checked ? '#FFFFFF' : '#333333',
      );
      ctx.strokeRect(
        this._padding.left,
        this._padding.top,
        this._boxSize,
        this._boxSize,
        '#666666',
      );
      if (this._label) {
        ctx.drawText(
          this._label,
          this._padding.left + this._boxSize + this._gap,
          this._padding.top,
          '#FFFFFF',
        );
      }
    }
  }
}
