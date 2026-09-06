/**
 * Icon widget for displaying bitmap icons.
 *
 * @category UI
 * @module ui/display/Icon
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UISize } from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Icon.
 *
 * @since 0.5.0
 */
export interface IconConfig extends UIWidgetConfig {
  /**
   * Icon bitmap data (array of row values)
   */
  data?: number[];
  /**
   * Icon width in pixels
   */
  iconWidth?: number;
  /**
   * Icon height in pixels
   */
  iconHeight?: number;
  /**
   * Custom color (uses theme if not set)
   */
  color?: string;
  /**
   * Scale factor
   */
  scale?: number;
}

/**
 * Icon widget for displaying bitmap icons.
 *
 * @since 0.5.0
 *
 * @example Using with icons_8x8
 * ```ts
 * import { icons_8x8 } from 'gamefoo';
 *
 * const icon = new Icon({
 *   data: icons_8x8.get('arrow_right'),
 *   iconWidth: 8,
 *   iconHeight: 8,
 * });
 * ```
 */
export default class Icon extends UIWidget {
  /**
   * Icon bitmap data
   */
  protected _data: number[] = [];

  /**
   * Icon width in pixels
   */
  protected _iconWidth: number = 8;

  /**
   * Icon height in pixels
   */
  protected _iconHeight: number = 8;

  /**
   * Custom color
   */
  protected _color: string | null = null;

  /**
   * Scale factor
   */
  protected _scale: number = 1;

  /**
   * Cached Path2D
   */
  private _cachedPath: Path2D | null = null;

  /**
   * Creates a new Icon.
   *
   * @param config - Icon configuration
   *
   * @since 0.5.0
   */
  constructor(config: IconConfig = {}) {
    super(config);
    if (config.data !== undefined) {
      this.setData(config.data);
    }
    if (config.iconWidth !== undefined) {
      this._iconWidth = config.iconWidth;
    }
    if (config.iconHeight !== undefined) {
      this._iconHeight = config.iconHeight;
    }
    if (config.color !== undefined) {
      this._color = config.color;
    }
    if (config.scale !== undefined) {
      this._scale = config.scale;
    }

    this.updateSize();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Icon bitmap data
   */
  public get data(): number[] {
    return this._data;
  }

  /**
   * Sets icon data and rebuilds the path.
   *
   * @param value - Icon bitmap data
   *
   * @since 0.5.0
   */
  public setData(value: number[]): void {
    this._data = value;
    this._cachedPath = null;
    this.buildPath();
    this.markLayoutDirty();
  }

  /**
   * Icon width
   */
  public get iconWidth(): number {
    return this._iconWidth;
  }

  public set iconWidth(value: number) {
    if (this._iconWidth !== value) {
      this._iconWidth = value;
      this._cachedPath = null;
      this.updateSize();
      this.markLayoutDirty();
    }
  }

  /**
   * Icon height
   */
  public get iconHeight(): number {
    return this._iconHeight;
  }

  public set iconHeight(value: number) {
    if (this._iconHeight !== value) {
      this._iconHeight = value;
      this._cachedPath = null;
      this.updateSize();
      this.markLayoutDirty();
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
   * Scale factor
   */
  public get scale(): number {
    return this._scale;
  }

  public set scale(value: number) {
    if (this._scale !== value) {
      this._scale = value;
      this.updateSize();
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Internal
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates the widget size based on icon dimensions and scale.
   *
   * @internal
   */
  private updateSize(): void {
    this._width = this._iconWidth * this._scale + this._padding.left + this._padding.right;
    this._height = this._iconHeight * this._scale + this._padding.top + this._padding.bottom;
  }

  /**
   * Builds the Path2D for the icon.
   *
   * @internal
   */
  private buildPath(): void {
    if (this._data.length === 0) {
      this._cachedPath = null;
      return;
    }

    const path = new Path2D();

    for (let row = 0; row < this._data.length && row < this._iconHeight; row++) {
      const bits = this._data[row]!;
      for (let col = 0; col < this._iconWidth; col++) {
        if ((bits & (1 << (this._iconWidth - 1 - col))) !== 0) {
          path.rect(col * this._scale, row * this._scale, this._scale, this._scale);
        }
      }
    }

    this._cachedPath = path;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns the preferred size.
   *
   * @since 0.5.0
   */
  public override getPreferredSize(): UISize {
    return {
      width: this._iconWidth * this._scale + this._padding.left + this._padding.right,
      height: this._iconHeight * this._scale + this._padding.top + this._padding.bottom,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the icon.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    if (!this._cachedPath) {
      this.buildPath();
    }

    if (!this._cachedPath) {
      return;
    }

    // Determine color
    let color = this._color;
    if (!color) {
      try {
        const theme = this.getTheme();
        color = theme.colors['label.text'];
      } catch {
        color = '#FFFFFF';
      }
    }

    const canvas = ctx.getCanvas?.();
    if (canvas) {
      canvas.save();
      canvas.translate(this._padding.left, this._padding.top);
      canvas.fillStyle = color;
      canvas.fill(this._cachedPath);
      canvas.restore();
    } else {
      // Fallback for non-canvas renderers
      for (let row = 0; row < this._data.length && row < this._iconHeight; row++) {
        const bits = this._data[row]!;
        for (let col = 0; col < this._iconWidth; col++) {
          if ((bits & (1 << (this._iconWidth - 1 - col))) !== 0) {
            ctx.fillRect(
              this._padding.left + col * this._scale,
              this._padding.top + row * this._scale,
              this._scale,
              this._scale,
              color,
            );
          }
        }
      }
    }
  }
}
