/**
 * The unified rendering surface interface used throughout the engine.
 *
 * Every place that previously accepted `CanvasRenderingContext2D` now
 * accepts `RenderContext`. This decouples game logic from the specific
 * rendering backend so the same entities and subsystems can run under:
 *
 * - **{@link WebRenderer}** — wraps the browser's `CanvasRenderingContext2D`.
 *
 * ---
 *
 * ### Coordinate space
 *
 * - **Canvas mode**: logical units are CSS pixels (floating-point).
 *
 * ### Optional methods
 *
 * `drawSprite` and `flush` are optional because:
 * - Canvas renderers are immediate-mode and do not need flushing.
 *
 * @since 0.4.0
 *
 * @example Implementing a custom renderer
 * ```ts
 * import type { RenderContext } from "gamefoo";
 *
 * class NullRenderer implements RenderContext {
 *   readonly width = 800;
 *   readonly height = 600;
 *   save() {}
 *   restore() {}
 *   translate(_x: number, _y: number) {}
 *   scale(_x: number, _y: number) {}
 *   clear(_color?: string) {}
 *   fillRect(_x: number, _y: number, _w: number, _h: number, _color: string) {}
 *   strokeRect(_x: number, _y: number, _w: number, _h: number, _color: string) {}
 *   drawText(_text: string, _x: number, _y: number) {}
 *   drawChar(_char: string, _x: number, _y: number) {}
 *   drawLine(_x1: number, _y1: number, _x2: number, _y2: number, _color: string) {}
 *   drawCircle(_x: number, _y: number, _radius: number, _color: string) {}
 * }
 * ```
 *
 * @see {@link WebRenderer}          — canvas implementation
 */
export interface RenderContext {
  /**
   * Logical width of the rendering surface.
   *
   * - Canvas: pixel width of the `<canvas>` element.
   *
   * @since 0.4.0
   */
  readonly width: number;

  /**
   * Logical height of the rendering surface.
   *
   * - Canvas: pixel height of the `<canvas>` element.
   *
   * @since 0.4.0
   */
  readonly height: number;

  /**
   * Rendered scalling factor
   *
   * @since 0.5.0
   */
  readonly gameScale: number;

  /**
   * Read the rendering scale factor
   *
   * @since 0.5.0
   */
  readGameScale(): number;

  // ── Transform stack ─────────────────────────────────────────────────────

  /**
   * Saves the current transform state onto a stack.
   *
   * Use together with {@link RenderContext.restore} to isolate transforms.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * ctx.save();
   * ctx.translate(entity.x, entity.y);
   * // ... draw ...
   * ctx.restore();
   * ```
   */
  save(): void;

  /**
   * Restores the most recently saved transform state.
   *
   * @since 0.4.0
   */
  restore(): void;

  /**
   * Applies a translation to the current transform.
   *
   * Subsequent draw calls are offset by `(x, y)`.
   *
   * @param x - Horizontal offset in logical units.
   * @param y - Vertical offset in logical units.
   *
   * @since 0.4.0
   */
  translate(x: number, y: number): void;

  /**
   * Applies a scale factor to the current transform.
   *
   * @param x - Horizontal scale factor.
   * @param y - Vertical scale factor.
   *
   * @since 0.4.0
   */
  scale(x: number, y: number): void;

  // ── Drawing ──────────────────────────────────────────────────────────────

  /**
   * Clears the entire surface, optionally filling it with a background
   * colour.
   *
   * @param color - Fill colour (CSS colour string). Defaults to black.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * ctx.clear("#1a1a2e");
   * ```
   */
  clear(color?: string): void;

  /**
   * Fills the current path or a provided Path2D.
   *
   * Mirrors the Canvas 2D `fill()` API.
   *
   * @param path - Optional Path2D to fill. If omitted, fills the current path.
   *
   * @since 0.5.0
   *
   * @example Fill current path
   * ```ts
   * ctx.beginPath();
   * ctx.moveTo(10, 10);
   * ctx.lineTo(50, 50);
   * ctx.lineTo(10, 50);
   * ctx.closePath();
   * ctx.fill();
   * ```
   *
   * @example Fill a Path2D
   * ```ts
   * const path = new Path2D();
   * path.rect(10, 10, 50, 50);
   * ctx.fill(path);
   * ```
   *
   * @example Fill a Bitmap (call render() to get Path2D)
   * ```ts
   * const bitmap = new Bitmap('icon', [0b11111, 0b10001, 0b11111], { width: 5, height: 3 });
   * ctx.translate(100, 100);
   * ctx.fill(bitmap.render());
   * ```
   */
  fill(path?: Path2D): void;

  /**
   * Draws a filled rectangle.
   *
   * @param x      - Left edge in logical units.
   * @param y      - Top edge in logical units.
   * @param width  - Rectangle width.
   * @param height - Rectangle height.
   * @param color  - Fill colour (CSS colour string).
   *
   * @since 0.4.0
   */
  fillRect(x: number, y: number, width: number, height: number, color: string): void;

  /**
   * Draws a stroked (outlined) rectangle.
   *
   * @param x      - Left edge in logical units.
   * @param y      - Top edge in logical units.
   * @param width  - Rectangle width.
   * @param height - Rectangle height.
   * @param color  - Stroke colour (CSS colour string).
   *
   * @since 0.4.0
   */
  strokeRect(x: number, y: number, width: number, height: number, color: string): void;

  /**
   * Draws a text string at the specified position.
   *
   * - **Canvas**: delegates to `CanvasRenderingContext2D.fillText`.
   *
   * @param text        - The string to render.
   * @param x           - Left edge in logical units.
   * @param y           - Top edge (baseline) in logical units.
   * @param color       - Foreground colour. Defaults to white.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * ctx.drawText("SCORE: 100", 8, 8, "#ffff00");
   * ```
   */
  drawText(text: string, x: number, y: number, color?: string): void;

  /**
   * Draws a single character at the specified position.
   *
   * @param character - A single character.
   * @param x         - Left edge in logical units.
   * @param y         - Top edge in logical units.
   * @param color     - Foreground colour. Defaults to white.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * ctx.drawChar("@", player.x, player.y, "#00ff00");
   * ```
   */
  drawChar(character: string, x: number, y: number, color?: string): void;

  /**
   * Draws a sprite (image region) onto the surface. **Optional.**
   *
   * @param source           - The source image or `null`.
   * @param sourceX          - X offset inside the source image.
   * @param sourceY          - Y offset inside the source image.
   * @param sourceWidth      - Width of the source region.
   * @param sourceHeight     - Height of the source region.
   * @param destinationX     - X position on the canvas.
   * @param destinationY     - Y position on the canvas.
   * @param destinationWidth - Rendered width.
   * @param destinationHeight- Rendered height.
   *
   * @since 0.4.0
   */
  drawSprite?(
    source: HTMLImageElement | string | null,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destinationX: number,
    destinationY: number,
    destinationWidth: number,
    destinationHeight: number,
  ): void;

  /**
   * Draws a straight line between two points.
   *
   * @param x1    - Start X.
   * @param y1    - Start Y.
   * @param x2    - End X.
   * @param y2    - End Y.
   * @param color - Line colour.
   *
   * @since 0.4.0
   */
  drawLine(x1: number, y1: number, x2: number, y2: number, color: string): void;

  /**
   * Draws a circle outline (or filled circle).
   *
   * @param x      - Centre X.
   * @param y      - Centre Y.
   * @param radius - Radius in logical units.
   * @param color  - Stroke / fill colour.
   * @param fill   - If `true`, fill the circle. Default `false`.
   *
   * @since 0.4.0
   */
  drawCircle(x: number, y: number, radius: number, color: string, fill?: boolean): void;

  /**
   * Returns the raw `CanvasRenderingContext2D` if this renderer is
   * canvas-backed, or `null` for non-canvas renderers.
   *
   * Use this to access canvas-specific APIs (Path2D, globalAlpha, etc.)
   * that are not part of the `RenderContext` surface:
   *
   * ```ts
   * const raw = ctx.getCanvas?.();
   * if (raw) {
   *   raw.globalAlpha = 0.5;
   *   raw.fill(path);
   * }
   * ```
   *
   * @since 0.4.0
   */
  getCanvas?(): CanvasRenderingContext2D | null;
}
