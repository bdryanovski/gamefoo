/**
 * Extended camera with zoom, smooth follow, and screen-to-world
 * coordinate conversion.
 *
 * `EnhancedCamera` inherits all functionality from {@link Camera} and
 * adds:
 *
 * - **Zoom** — configurable zoom level with clamping.
 * - **Smooth follow** — lerp-based camera movement for fluid tracking.
 * - **Screen ↔ World** — convert mouse/screen coordinates to world-space
 *   accounting for zoom and camera offset.
 * - **Pixel-perfect zoom** — optional restriction to integer zoom
 *   multiples for crisp pixel art.
 *
 * @category Core
 * @since 0.4.0
 *
 * @example Basic usage with smooth follow
 * ```ts
 * import { EnhancedCamera } from "gamefoo";
 *
 * const camera = new EnhancedCamera(800, 600, { lerpSpeed: 0.08 });
 *
 * // In your update loop:
 * camera.smoothFollow(player.getPosition(), deltaTime);
 * ```
 *
 * @example Zoom control
 * ```ts
 * const camera = new EnhancedCamera(800, 600, {
 *   zoom: 2,
 *   minZoom: 0.5,
 *   maxZoom: 4,
 * });
 *
 * // Zoom in/out on scroll
 * camera.zoom += 0.1;
 * ```
 *
 * @example Pixel-perfect zoom for retro games
 * ```ts
 * const camera = new EnhancedCamera(256, 224, {
 *   pixelPerfect: true,
 * });
 *
 * camera.zoom = 2.7; // automatically snapped to 3
 * ```
 *
 * @see {@link Camera}               — base camera class
 * @see {@link IsometricCameraSystem} — subsystem using this camera
 */

import type { Vector2 } from '../generic_types';
import Camera from './camera';

/**
 * Configuration options for {@link EnhancedCamera}.
 *
 * @category Core
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const opts: EnhancedCameraConfig = {
 *   zoom: 2,
 *   lerpSpeed: 0.1,
 *   pixelPerfect: true,
 * };
 * ```
 */
export interface EnhancedCameraConfig {
  /**
   * Initial zoom level.
   *
   * @defaultValue `1`
   */
  zoom?: number;

  /**
   * Minimum allowed zoom level.
   *
   * @defaultValue `0.25`
   */
  minZoom?: number;

  /**
   * Maximum allowed zoom level.
   *
   * @defaultValue `4`
   */
  maxZoom?: number;

  /**
   * Interpolation speed for {@link EnhancedCamera.smoothFollow}.
   * `0` = instant snap, closer to `1` = very slow approach.
   *
   * @defaultValue `0.1`
   */
  lerpSpeed?: number;

  /**
   * When `true`, zoom values are rounded to the nearest integer for
   * crisp pixel-art rendering (1×, 2×, 3×, 4×).
   *
   * @defaultValue `false`
   */
  pixelPerfect?: boolean;
}

export class EnhancedCamera extends Camera {
  private _zoom: number;
  private _minZoom: number;
  private _maxZoom: number;
  private _lerpSpeed: number;
  private _pixelPerfect: boolean;

  /** Cached view rect to avoid per-call allocation. */
  private _viewCache = { x: 0, y: 0, width: 0, height: 0 };

  /**
   * Creates an enhanced camera with the given viewport dimensions and
   * optional configuration.
   *
   * @param width   - Viewport width in pixels.
   * @param height  - Viewport height in pixels.
   * @param config  - Optional zoom, lerp, and pixel-perfect settings.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const camera = new EnhancedCamera(800, 600, {
   *   zoom: 2,
   *   lerpSpeed: 0.08,
   *   pixelPerfect: true,
   * });
   * ```
   */
  constructor(width: number, height: number, config?: EnhancedCameraConfig) {
    super(width, height);
    this._minZoom = config?.minZoom ?? 0.25;
    this._maxZoom = config?.maxZoom ?? 4;
    this._lerpSpeed = config?.lerpSpeed ?? 0.1;
    this._pixelPerfect = config?.pixelPerfect ?? false;
    this._zoom = this.clampZoom(config?.zoom ?? 1);
  }

  /**
   * Current zoom level. Setting this value automatically clamps it
   * within [{@link EnhancedCameraConfig.minZoom},
   * {@link EnhancedCameraConfig.maxZoom}] and applies pixel-perfect
   * rounding if enabled.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * camera.zoom = 3;
   * console.log(camera.zoom); // 3
   *
   * camera.zoom = 10; // clamped to maxZoom
   * console.log(camera.zoom); // 4 (default max)
   * ```
   */
  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = this.clampZoom(value);
  }

  /**
   * Interpolation speed for smooth follow. A value of `0.1` means
   * the camera covers 10% of the remaining distance each frame.
   *
   * @since 0.4.0
   */
  get lerpSpeed(): number {
    return this._lerpSpeed;
  }

  set lerpSpeed(value: number) {
    this._lerpSpeed = Math.max(0, Math.min(1, value));
  }

  /**
   * Smoothly moves the camera toward a target position using linear
   * interpolation.
   *
   * Call this every frame instead of {@link Camera.follow} for fluid
   * camera movement.
   *
   * @param target    - World-space position to track.
   * @param deltaTime - Seconds since last frame. Used for
   *   frame-rate independent interpolation.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // In your update loop:
   * camera.smoothFollow(player.getPosition(), deltaTime);
   * ```
   */
  smoothFollow(target: Vector2, deltaTime: number): void {
    const pos = this.getPosition();
    const t = 1 - (1 - this._lerpSpeed) ** (deltaTime * 60);
    const newX = pos.x + (target.x - pos.x) * t;
    const newY = pos.y + (target.y - pos.y) * t;
    this.moveTo({ x: newX, y: newY });
  }

  /**
   * Returns the visible viewport rectangle in world-space, adjusted
   * for the current zoom level.
   *
   * At zoom 2× the visible area is half the size; at zoom 0.5× it is
   * double.
   *
   * @returns An `{ x, y, width, height }` rectangle in world-space.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const view = camera.getViewRect();
   * // Use for viewport culling or coordinate conversion
   * ```
   */
  override getViewRect(): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const base = super.getViewRect();
    const invZoom = 1 / this._zoom;
    const w = base.width * invZoom;
    const h = base.height * invZoom;
    this._viewCache.x = base.x + (base.width - w) / 2;
    this._viewCache.y = base.y + (base.height - h) / 2;
    this._viewCache.width = w;
    this._viewCache.height = h;
    return this._viewCache;
  }

  /**
   * Converts a screen-space position (e.g. mouse coordinates on the
   * canvas) to world-space coordinates, accounting for camera offset
   * and zoom.
   *
   * @param screenX - X coordinate on the canvas.
   * @param screenY - Y coordinate on the canvas.
   * @returns World-space position.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * canvas.addEventListener("click", (e) => {
   *   const world = camera.screenToWorld(e.offsetX, e.offsetY);
   *   console.log("Clicked at world:", world.x, world.y);
   * });
   * ```
   */
  screenToWorld(screenX: number, screenY: number): Vector2 {
    const view = this.getViewRect();
    return {
      x: view.x + screenX / this._zoom,
      y: view.y + screenY / this._zoom,
    };
  }

  /**
   * Converts a world-space position to screen-space canvas coordinates.
   *
   * @param worldX - World-space X coordinate.
   * @param worldY - World-space Y coordinate.
   * @returns Screen-space position.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const screen = camera.worldToScreen(entity.x, entity.y);
   * // Draw a UI element at the entity's screen position
   * ctx.fillText("!", screen.x, screen.y);
   * ```
   */
  worldToScreen(worldX: number, worldY: number): Vector2 {
    const view = this.getViewRect();
    return {
      x: (worldX - view.x) * this._zoom,
      y: (worldY - view.y) * this._zoom,
    };
  }

  /**
   * Clamps and optionally rounds a zoom value.
   *
   * @internal
   */
  private clampZoom(value: number): number {
    let z = Math.max(this._minZoom, Math.min(this._maxZoom, value));
    if (this._pixelPerfect) {
      z = Math.round(z);
      z = Math.max(1, z);
    }
    return z;
  }
}
