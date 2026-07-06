/**
 * Image widget for displaying bitmap images.
 *
 * @category UI
 * @module ui/display/Image
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type { UISize } from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for Image.
 *
 * @since 0.5.0
 */
export interface ImageConfig extends UIWidgetConfig {
  /** Image source (HTMLImageElement or image URL) */
  source?: HTMLImageElement | string | null;
  /** Image width (if not set, uses natural width) */
  imageWidth?: number;
  /** Image height (if not set, uses natural height) */
  imageHeight?: number;
  /** Whether to preserve aspect ratio */
  preserveAspect?: boolean;
  /** Scale factor */
  scale?: number;
}

/**
 * Image widget for displaying bitmap images.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const image = new Image({
 *   source: myImageElement,
 *   scale: 2,
 * });
 * ```
 */
export default class Image extends UIWidget {
  /** Image source */
  protected _source: HTMLImageElement | string | null = null;

  /** Loaded image element */
  protected _imageElement: HTMLImageElement | null = null;

  /** Image width */
  protected _imageWidth: number = 0;

  /** Image height */
  protected _imageHeight: number = 0;

  /** Preserve aspect ratio */
  protected _preserveAspect: boolean = true;

  /** Scale factor */
  protected _scale: number = 1;

  /** Whether image is loaded */
  protected _loaded: boolean = false;

  /**
   * Creates a new Image.
   *
   * @param config - Image configuration
   *
   * @since 0.5.0
   */
  constructor(config: ImageConfig = {}) {
    super(config);
    if (config.imageWidth !== undefined) this._imageWidth = config.imageWidth;
    if (config.imageHeight !== undefined)
      this._imageHeight = config.imageHeight;
    if (config.preserveAspect !== undefined)
      this._preserveAspect = config.preserveAspect;
    if (config.scale !== undefined) this._scale = config.scale;
    if (config.source !== undefined) this.setSource(config.source);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Image source */
  get source(): HTMLImageElement | string | null {
    return this._source;
  }

  /**
   * Sets the image source.
   *
   * @param value - Image element or URL
   *
   * @since 0.5.0
   */
  setSource(value: HTMLImageElement | string | null): void {
    this._source = value;
    this._loaded = false;

    if (!value) {
      this._imageElement = null;
      return;
    }

    if (typeof value === 'string') {
      // Load image from URL
      const img = new globalThis.Image();
      img.onload = () => {
        this._imageElement = img;
        this._loaded = true;
        if (this._imageWidth === 0) this._imageWidth = img.naturalWidth;
        if (this._imageHeight === 0) this._imageHeight = img.naturalHeight;
        this.markLayoutDirty();
      };
      img.src = value;
    } else {
      this._imageElement = value;
      this._loaded = value.complete;
      if (this._imageWidth === 0) this._imageWidth = value.naturalWidth;
      if (this._imageHeight === 0) this._imageHeight = value.naturalHeight;
    }

    this.markLayoutDirty();
  }

  /** Image width */
  get imageWidth(): number {
    return this._imageWidth;
  }

  set imageWidth(value: number) {
    if (this._imageWidth !== value) {
      this._imageWidth = value;
      this.markLayoutDirty();
    }
  }

  /** Image height */
  get imageHeight(): number {
    return this._imageHeight;
  }

  set imageHeight(value: number) {
    if (this._imageHeight !== value) {
      this._imageHeight = value;
      this.markLayoutDirty();
    }
  }

  /** Preserve aspect ratio */
  get preserveAspect(): boolean {
    return this._preserveAspect;
  }

  set preserveAspect(value: boolean) {
    this._preserveAspect = value;
  }

  /** Scale factor */
  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    if (this._scale !== value) {
      this._scale = value;
      this.markLayoutDirty();
    }
  }

  /** Whether the image is loaded */
  get loaded(): boolean {
    return this._loaded;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns the preferred size.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    return {
      width: Math.max(
        this._width,
        this._imageWidth * this._scale
          + this._padding.left
          + this._padding.right,
      ),
      height: Math.max(
        this._height,
        this._imageHeight * this._scale
          + this._padding.top
          + this._padding.bottom,
      ),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the image.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    if (!this._imageElement || !this._loaded) return;

    const canvas = ctx.getCanvas?.();
    if (!canvas) return;

    const x = this._padding.left;
    const y = this._padding.top;
    let drawWidth = this._imageWidth * this._scale;
    let drawHeight = this._imageHeight * this._scale;

    // Preserve aspect ratio if needed
    if (this._preserveAspect && this._width > 0 && this._height > 0) {
      const availWidth = this._width - this._padding.left - this._padding.right;
      const availHeight =
        this._height - this._padding.top - this._padding.bottom;

      const scaleX = availWidth / this._imageWidth;
      const scaleY = availHeight / this._imageHeight;
      const scale = Math.min(scaleX, scaleY);

      drawWidth = this._imageWidth * scale;
      drawHeight = this._imageHeight * scale;
    }

    canvas.drawImage(
      this._imageElement,
      0,
      0,
      this._imageElement.naturalWidth,
      this._imageElement.naturalHeight,
      x,
      y,
      drawWidth,
      drawHeight,
    );
  }
}
