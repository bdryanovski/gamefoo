import type { RenderContext } from '../renderer/type';

/**
 * Minimal text-rendering contract used by engine UI (dialog boxes, map text).
 *
 * Implemented by bitmap fonts such as {@link FontSheet} so text can be drawn
 * pixel-perfect at integer scales, independent of the browser's canvas font
 * API (which anti-aliases and does not survive an integer upscale crisply).
 *
 * @category Fonts
 * @since 0.5.0
 *
 * @example
 * ```ts
 * function drawLabel(font: TextFont, ctx: RenderContext) {
 *   const scale = 2;
 *   font.render(ctx, 'GAME OVER', 40, 40, '#ffffff', scale);
 * }
 * ```
 */
export interface TextFont {
  /** Native glyph height in pixels at scale `1`. */
  readonly lineHeight: number;

  /** Native glyph cell width in pixels at scale `1`, excluding spacing. */
  readonly cellWidth: number;

  /**
   * Width in pixels of `text` rendered at the given integer `scale`.
   *
   * @param text  - The string to measure.
   * @param scale - Integer upscale factor. Default `1`.
   */
  measure(text: string, scale?: number): number;

  /**
   * Draws `text` with its top-left corner at `(x, y)`.
   *
   * @param ctx   - The rendering context to draw into.
   * @param text  - The string to render.
   * @param x     - Left edge in logical pixels.
   * @param y     - Top edge in logical pixels.
   * @param color - CSS fill colour.
   * @param scale - Integer upscale factor. Default `1`.
   */
  render(
    ctx: RenderContext,
    text: string,
    x: number,
    y: number,
    color: string,
    scale?: number,
  ): void;
}
