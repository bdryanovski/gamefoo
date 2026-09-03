/**
 * Separator widget for visual division between sections.
 *
 * @category UI
 * @module ui/display/Separator
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UISize } from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Separator.
 *
 * @since 0.5.0
 */
export interface SeparatorConfig extends UIWidgetConfig {
  /**
   * Orientation: horizontal or vertical
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Line thickness in pixels
   */
  thickness?: number;
  /**
   * Custom color (uses theme if not set)
   */
  color?: string;
  /**
   * Length (for horizontal: width, for vertical: height)
   */
  length?: number;
}

/**
 * Separator widget for visual division between sections.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const verticalLayout = new VerticalLayout();
 * verticalLayout.addChild(new Label({ text: 'Section 1' }));
 * verticalLayout.addChild(new Separator({ orientation: 'horizontal', length: 100 }));
 * verticalLayout.addChild(new Label({ text: 'Section 2' }));
 * ```
 */
export default class Separator extends UIWidget {
  /**
   * Orientation
   */
  protected _orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Line thickness
   */
  protected _thickness: number = 1;

  /**
   * Custom color
   */
  protected _color: string | null = null;

  /**
   * Length
   */
  protected _length: number = 0;

  /**
   * Creates a new Separator.
   *
   * @param config - Separator configuration
   *
   * @since 0.5.0
   */
  constructor(config: SeparatorConfig = {}) {
    super(config);
    if (config.orientation !== undefined) {
      this._orientation = config.orientation;
    }
    if (config.thickness !== undefined) {
      this._thickness = config.thickness;
    }
    if (config.color !== undefined) {
      this._color = config.color;
    }
    if (config.length !== undefined) {
      this._length = config.length;
    }

    this.updateSize();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Orientation
   */
  get orientation(): 'horizontal' | 'vertical' {
    return this._orientation;
  }

  set orientation(value: 'horizontal' | 'vertical') {
    if (this._orientation !== value) {
      this._orientation = value;
      this.updateSize();
      this.markLayoutDirty();
    }
  }

  /**
   * Line thickness
   */
  get thickness(): number {
    return this._thickness;
  }

  set thickness(value: number) {
    if (this._thickness !== value) {
      this._thickness = value;
      this.updateSize();
      this.markLayoutDirty();
    }
  }

  /**
   * Custom color
   */
  get color(): string | null {
    return this._color;
  }

  set color(value: string | null) {
    this._color = value;
  }

  /**
   * Length
   */
  get length(): number {
    return this._length;
  }

  set length(value: number) {
    if (this._length !== value) {
      this._length = value;
      this.updateSize();
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Internal
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates the widget size based on orientation.
   *
   * @internal
   */
  private updateSize(): void {
    if (this._orientation === 'horizontal') {
      this._width = this._length || 100;
      this._height = this._thickness + this._padding.top + this._padding.bottom;
    } else {
      this._width = this._thickness + this._padding.left + this._padding.right;
      this._height = this._length || 100;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns the preferred size.
   * If length is 0, uses parent width (fill mode).
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    if (this._orientation === 'horizontal') {
      // If length not set, try to use parent width
      let width = this._length;
      if (width === 0 && this._parent) {
        width = this._parent.width - this._parent.padding.left - this._parent.padding.right;
      }
      return {
        width: width || 100,
        height: this._thickness + this._padding.top + this._padding.bottom,
      };
    } else {
      return {
        width: this._thickness + this._padding.left + this._padding.right,
        height: this._length || this._height,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the separator line.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    // Determine color
    let color = this._color;
    if (!color) {
      try {
        const theme = this.getTheme();
        color = theme.colors['separator.line'];
      } catch {
        color = '#444444';
      }
    }

    if (this._orientation === 'horizontal') {
      const x = this._padding.left;
      const y = this._padding.top + Math.floor(this._thickness / 2);
      const lineWidth = this._width - this._padding.left - this._padding.right;

      ctx.fillRect(x, y, lineWidth, this._thickness, color);
    } else {
      const x = this._padding.left + Math.floor(this._thickness / 2);
      const y = this._padding.top;
      const lineHeight = this._height - this._padding.top - this._padding.bottom;

      ctx.fillRect(x, y, this._thickness, lineHeight, color);
    }
  }
}
