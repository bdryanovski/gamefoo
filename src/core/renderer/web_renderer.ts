import type { RenderContext } from './type';

/**
 * Canvas-backed {@link RenderContext} implementation for browser games.
 *
 * `WebRenderer` wraps a `<canvas>` DOM element and its
 * `CanvasRenderingContext2D`, adapting the full Canvas 2D API surface to
 * the minimal {@link RenderContext} interface the engine requires.
 *
 * ### Scaling
 *
 * The `gameScale` parameter controls how large the game appears on screen:
 *
 * - `gameScale = 1`: 1:1 pixel mapping. A 200×75 game displays at 200×75 CSS pixels.
 * - `gameScale = 2`: 2× scale. A 200×75 game displays at 400×150 CSS pixels.
 * - `gameScale = 4`: 4× scale. A 200×75 game displays at 800×300 CSS pixels.
 *
 * Internally:
 *
 * - The canvas **backing buffer** is sized to `width × gameScale` ×
 *   `height × gameScale` so there is a physical pixel for each logical
 *   pixel in the up-scaled view.
 * - The canvas **CSS size** is also set to `width × gameScale` ×
 *   `height × gameScale` so the game appears at the scaled size.
 * - `ctx.scale(gameScale, gameScale)` is applied once at construction so
 *   all subsequent draw calls use logical (`width × height`) coordinates.
 * - `imageSmoothingEnabled` is disabled globally to preserve crisp
 *   pixel-art edges.
 *
 * @since 0.4.0
 *
 * @example Basic setup
 * ```ts
 * import { Engine, WebRenderer } from "gamefoo";
 *
 * const renderer = new WebRenderer("game-canvas", 800, 600);
 * const engine   = new Engine(renderer, { backgroundColor: "#1a1a2e" });
 * engine.setup();
 * ```
 *
 * @example Pixel-art game with 4× scale
 * ```ts
 * // Internal resolution 200×75, displayed at 800×300
 * const renderer = new WebRenderer("game", 200, 75, 4);
 * const engine   = new Engine(renderer, { backgroundColor: "#e0e0e0" });
 * engine.setup();
 * ```
 *
 * @see {@link RenderContext}         — the interface this class implements
 * @see {@link TerminalRenderContext} — ANSI terminal alternative
 */
export class WebRenderer implements RenderContext {
  /**
   * The underlying canvas 2-D rendering context.
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * The underlying canvas element.
   */
  private canvas: HTMLCanvasElement;

  /**
   * The logical width — coordinates supplied to draw calls should stay
   * within `0..width`.
   *
   * @since 0.4.0
   */
  public width: number;

  /**
   * The logical height — coordinates supplied to draw calls should stay
   * within `0..height`.
   *
   * @since 0.4.0
   */
  public height: number;

  /**
   * The pixel scale factor applied to the canvas backing buffer.
   * Stored so that `clear()` can reset the full buffer regardless of
   * accumulated transforms.
   */
  public gameScale: number;

  /**
   * Return the actual game scale
   *
   * @since 0.5.0
   */
  public readGameScale(): number {
    return this.gameScale;
  }

  /**
   * Creates a new `WebRenderer` and configures the target canvas.
   *
   * @param canvasId  - `id` attribute of the `<canvas>` element in the DOM.
   * @param width     - Logical width in game-world pixels.
   * @param height    - Logical height in game-world pixels.
   * @param gameScale - Pixel scale factor. Sizes the backing buffer at
   *   `width × gameScale` × `height × gameScale` and applies
   *   `ctx.scale(gameScale, gameScale)` so all drawing uses logical
   *   coordinates. Default `1` (no scaling).
   *
   * @throws {Error} If no `<canvas>` element with `id === canvasId` is found,
   *   or if the browser cannot provide a 2-D context.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // HTML: <canvas id="game"></canvas>
   * const renderer = new WebRenderer("game", 800, 600);
   * ```
   *
   * @example Pixel-art 4× scale
   * ```ts
   * const renderer = new WebRenderer("game", 200, 75, 4);
   * ```
   */
  constructor(canvasId: string, width: number, height: number, gameScale: number = 1) {
    this.width = width;
    this.height = height;
    this.gameScale = gameScale;

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`WebRenderer: no canvas element found with id "${canvasId}"`);
    }
    this.canvas = canvas;

    // Size the backing buffer to hold `gameScale` physical pixels per logical pixel.
    canvas.width = width * gameScale;
    canvas.height = height * gameScale;

    // Display at scaled size so the game appears larger on screen.
    // A 200×75 game with gameScale=4 displays as 800×300 CSS pixels.
    canvas.style.width = `${width * gameScale}px`;
    canvas.style.height = `${height * gameScale}px`;

    // Prevent the browser compositor from blurring the canvas when it is
    // displayed at a non-native resolution.
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`WebRenderer: failed to get 2D context for canvas "${canvasId}"`);
    }
    this.ctx = context;

    // Disable sub-pixel interpolation for sprites and bitmap fonts.
    this.ctx.imageSmoothingEnabled = false;

    // Apply the permanent game-world → buffer-pixel transform.
    if (gameScale !== 1) {
      this.ctx.scale(gameScale, gameScale);
    }
  }

  /**
   * Resizes the canvas to new dimensions while preserving the scale factor.
   *
   * This method updates both the backing buffer size and the CSS display size.
   * After calling resize, you should also call `engine.resize(width, height)`
   * to keep the engine's dimensions in sync.
   *
   * @param width  - New logical width in game-world pixels.
   * @param height - New logical height in game-world pixels.
   * @param scale  - Optional new scale factor. If not provided, keeps current scale.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Change to Game Boy resolution
   * renderer.resize(160, 144);
   * engine.resize(160, 144);
   *
   * // Change resolution and scale
   * renderer.resize(256, 240, 3);
   * engine.resize(256, 240);
   * ```
   */
  public resize(width: number, height: number, scale?: number): void {
    this.width = width;
    this.height = height;
    if (scale !== undefined) {
      this.gameScale = scale;
    }

    const s = this.gameScale;

    // Reset transform before resizing
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Update backing buffer size
    this.canvas.width = width * s;
    this.canvas.height = height * s;

    // Update CSS display size
    this.canvas.style.width = `${width * s}px`;
    this.canvas.style.height = `${height * s}px`;

    // Re-apply settings that get reset when canvas size changes
    this.ctx.imageSmoothingEnabled = false;

    // Re-apply scale transform
    if (s !== 1) {
      this.ctx.scale(s, s);
    }
  }

  /**
   * Saves the current canvas state onto the state stack.
   *
   * After `save()`, transforms, clipping regions, and style properties
   * can be mutated and then rolled back with {@link WebRenderer.restore}.
   *
   * **Note:** `imageSmoothingEnabled` is part of the saved state, so
   * {@link WebRenderer.restore} automatically re-applies the `false`
   * value set at construction.
   *
   * @since 0.4.0
   */
  public save() {
    this.ctx.save();
  }

  /**
   * Restores the most recently saved canvas state.
   *
   * @since 0.4.0
   */
  public restore() {
    this.ctx.restore();
    // imageSmoothingEnabled is restored automatically from the saved state.
    // Explicitly re-disable it to guard against any external ctx.save/restore
    // that might have enabled it.
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Translates the canvas origin by `(x, y)` in logical coordinates.
   *
   * @param x - Horizontal offset in logical pixels.
   * @param y - Vertical offset in logical pixels.
   *
   * @since 0.4.0
   */
  public translate(x: number, y: number) {
    this.ctx.translate(x, y);
  }

  /**
   * Multiplies the current transform by a scale factor.
   *
   * This is an **additional** scale on top of the `gameScale` already
   * applied at construction. Use it for camera zoom, not for the base
   * pixel-art scale (that is handled by the constructor).
   *
   * @param x - Horizontal scale factor.
   * @param y - Vertical scale factor.
   *
   * @since 0.4.0
   */
  public scale(x: number, y: number) {
    this.ctx.scale(x, y);
  }

  /**
   * Clears the entire canvas and fills it with `color`.
   *
   * Uses `clearRect` over the **full buffer** (accounting for `gameScale`)
   * to ensure no residual pixels remain from the previous frame even when
   * a translate transform is active.
   *
   * @param color - CSS colour string. Default `"#000000"`.
   *
   * @since 0.4.0
   */
  public clear(color = '#000000') {
    // Reset transform to identity to clear the whole buffer, then restore.
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.width * this.gameScale, this.height * this.gameScale);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width * this.gameScale, this.height * this.gameScale);
    this.ctx.restore();
    this.ctx.imageSmoothingEnabled = false;
  }

  /**
   * Fills the current path or a provided Path2D.
   *
   * Mirrors the Canvas 2D `fill()` API.
   *
   * @param path - Optional Path2D to fill. If omitted, fills the current path.
   * @param fillRule - Optional fill rule: "nonzero" (default) or "evenodd".
   *
   * @since 0.5.0
   */
  public fill(path?: Path2D, fillRule?: CanvasFillRule): void {
    if (path === undefined) {
      this.ctx.fill();
    } else if (fillRule !== undefined) {
      this.ctx.fill(path, fillRule);
    } else {
      this.ctx.fill(path);
    }
  }

  /**
   * Draws a filled rectangle.
   *
   * @param x      - Left edge in logical pixels.
   * @param y      - Top edge in logical pixels.
   * @param w      - Width in logical pixels.
   * @param h      - Height in logical pixels.
   * @param color  - Fill colour (CSS colour string).
   *
   * @since 0.4.0
   */
  public fillRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  /**
   * Draws a stroked (outlined) rectangle.
   *
   * @param x      - Left edge in logical pixels.
   * @param y      - Top edge in logical pixels.
   * @param w      - Width in logical pixels.
   * @param h      - Height in logical pixels.
   * @param color  - Stroke colour (CSS colour string).
   *
   * @since 0.4.0
   */
  public strokeRect(x: number, y: number, w: number, h: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.strokeRect(x, y, w, h);
  }

  /**
   * Draws a text string using the canvas's current font setting.
   *
   * The `bgColor` parameter exists for {@link RenderContext} compatibility
   * but is ignored on canvas — set the background with a `fillRect` call
   * if needed.
   *
   * @param text    - The string to render.
   * @param x       - Left edge in logical pixels.
   * @param y       - Baseline Y in logical pixels.
   * @param color   - Fill colour. Default `"#ffffff"`.
   * @param _bgColor - Not used on canvas.
   *
   * @since 0.4.0
   */
  public drawText(text: string, x: number, y: number, color = '#ffffff', _bgColor?: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draws a single character at `(x, y)`.
   *
   * Delegates to {@link WebRenderer.drawText} with a one-character string.
   *
   * @param char  - A single character to draw.
   * @param x     - Left edge in logical pixels.
   * @param y     - Baseline Y in logical pixels.
   * @param color - Fill colour. Default `"#ffffff"`.
   *
   * @since 0.4.0
   */
  public drawChar(char: string, x: number, y: number, color = '#ffffff') {
    this.drawText(char, x, y, color);
  }

  /**
   * Draws an image region (sprite frame) onto the canvas.
   *
   * Delegates directly to `CanvasRenderingContext2D.drawImage`.
   *
   * @param source - The source `HTMLImageElement`.
   * @param sx - Source X in the sprite sheet.
   * @param sy - Source Y in the sprite sheet.
   * @param sw - Source region width.
   * @param sh - Source region height.
   * @param dx - Destination X in logical pixels.
   * @param dy - Destination Y in logical pixels.
   * @param dw - Rendered width in logical pixels.
   * @param dh - Rendered height in logical pixels.
   *
   * @since 0.4.0
   */
  public drawSprite(
    source: HTMLImageElement,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
  ) {
    this.ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  /**
   * Draws a straight line between two points.
   *
   * @param x1    - Start X in logical pixels.
   * @param y1    - Start Y in logical pixels.
   * @param x2    - End X in logical pixels.
   * @param y2    - End Y in logical pixels.
   * @param color - Stroke colour.
   *
   * @since 0.4.0
   */
  public drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  /**
   * Draws a circle (stroke or fill).
   *
   * @param x      - Centre X in logical pixels.
   * @param y      - Centre Y in logical pixels.
   * @param radius - Radius in logical pixels.
   * @param color  - Stroke or fill colour.
   * @param fill   - If `true`, fills the circle. Default `false` (stroke only).
   *
   * @since 0.4.0
   */
  public drawCircle(x: number, y: number, radius: number, color: string, fill = false) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  /**
   * No-op — canvas rendering is immediate-mode and requires no explicit flush.
   *
   * @since 0.4.0
   */
  public flush() {
    /* no-op — canvas is immediate mode */
  }

  /**
   * Returns the underlying `CanvasRenderingContext2D`.
   *
   * Use this to access canvas-specific APIs not exposed by the
   * {@link RenderContext} interface (e.g. `Path2D`, `globalAlpha`,
   * `arc`, `fill`, `beginPath`, etc.):
   *
   * ```ts
   * const raw = ctx.getCanvas?.();
   * if (raw) {
   *   raw.globalAlpha = 0.5;
   *   raw.beginPath();
   *   raw.arc(x, y, r, 0, Math.PI * 2);
   *   raw.fill();
   * }
   * ```
   *
   * @returns The raw 2-D canvas rendering context.
   *
   * @since 0.4.0
   */
  public getCanvas(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
