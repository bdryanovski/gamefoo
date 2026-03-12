/**
 * Camera subsystem with zoom, smooth follow, and isometric-aware
 * viewport transforms.
 *
 * `IsometricCameraSystem` is a drop-in replacement for
 * {@link CameraSystem} that uses {@link EnhancedCamera} internally.
 * It applies zoom scaling and translation in `preRender`, and
 * **disables image smoothing** after every scale change to preserve
 * pixel-art crispness.
 *
 * Works for both orthogonal and isometric games — the `projection`
 * parameter is optional and stored for external consumers (e.g.
 * the debug system) to reference.
 *
 * @category SubSystems
 * @since 0.4.0
 *
 * @example Basic setup with smooth follow
 * ```ts
 * import { Engine } from "gamefoo";
 * import { IsometricCameraSystem } from "gamefoo";
 *
 * const camSys = new IsometricCameraSystem(
 *   800, 600,
 *   () => player.getPosition(),
 * );
 *
 * engine.use(camSys);
 * engine.setup();
 * ```
 *
 * @example Isometric with custom zoom
 * ```ts
 * const camSys = new IsometricCameraSystem(
 *   512, 384,
 *   () => player.getPosition(),
 *   isoProjection,
 *   { zoom: 2, lerpSpeed: 0.05, pixelPerfect: true },
 * );
 *
 * engine.use(camSys);
 * ```
 *
 * @see {@link EnhancedCamera} — the camera implementation
 * @see {@link CameraSystem}   — the simpler base camera subsystem
 */
import { EnhancedCamera } from "../core/enhanced_camera";
import type { EnhancedCameraConfig } from "../core/enhanced_camera";
import type { IsometricProjection } from "../core/grid/isometric";
import type { Vector2 } from "../generic_types";
import type { SubSystem } from "./types";

export class IsometricCameraSystem implements SubSystem {
  /** Subsystem identifier. */
  id = "camera";

  /**
   * Execution order. `10` ensures the camera transform is applied
   * before tilemap (15) and entity (20) rendering.
   */
  order = 10;

  /** The enhanced camera instance. Exposed for external use. */
  camera: EnhancedCamera;

  /**
   * Isometric projection reference, stored for convenience. `null`
   * when used for orthogonal games.
   */
  projection: IsometricProjection | null;

  /** Target position supplier. Returns `null` for free camera. */
  private target: () => Vector2 | null;

  /**
   * Creates a new isometric camera subsystem.
   *
   * @param width      - Viewport width in pixels.
   * @param height     - Viewport height in pixels.
   * @param target     - Function returning the world-space position to
   *   follow, or `null` for free camera.
   * @param projection - Optional isometric projection. Stored for
   *   reference by other systems.
   * @param config     - Optional camera configuration (zoom, lerp, etc.).
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const system = new IsometricCameraSystem(
   *   800, 600,
   *   () => player.getPosition(),
   *   isoProjection,
   *   { zoom: 2, lerpSpeed: 0.08 },
   * );
   * ```
   */
  constructor(
    width: number,
    height: number,
    target: () => Vector2 | null,
    projection?: IsometricProjection,
    config?: EnhancedCameraConfig,
  ) {
    this.camera = new EnhancedCamera(width, height, config);
    this.projection = projection ?? null;
    this.target = target;
  }

  /**
   * Updates the camera position each frame using smooth interpolation.
   *
   * @param deltaTime - Seconds since the last frame.
   *
   * @since 0.4.0
   */
  update(deltaTime: number): void {
    const t = this.target();
    if (t) {
      this.camera.smoothFollow(t, deltaTime);
    }
  }

  /**
   * Applies the camera transform before rendering.
   *
   * Saves the context state, applies zoom scaling and translates to
   * the camera viewport. Image smoothing is explicitly disabled to
   * preserve pixel-art crispness after the scale operation.
   *
   * @param ctx - Canvas 2D rendering context.
   *
   * @since 0.4.0
   */
  preRender(ctx: CanvasRenderingContext2D): void {
    const view = this.camera.getViewRect();
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-view.x, -view.y);
    ctx.imageSmoothingEnabled = false;
  }

  /**
   * Restores the context state after all rendering is complete.
   *
   * @param ctx - Canvas 2D rendering context.
   *
   * @since 0.4.0
   */
  postRender(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }
}
