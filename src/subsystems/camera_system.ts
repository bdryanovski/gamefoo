import type { EnhancedCameraConfig } from '../core/enhanced_camera';
import { EnhancedCamera } from '../core/enhanced_camera';
import type { IsometricProjection } from '../core/grid/isometric';
import type { RenderContext } from '../core/renderer/type';
import type { Vector2 } from '../generic_types';
import type { SubSystem } from './types';

/**
 * Camera subsystem with optional zoom, smooth follow, and isometric-aware
 * viewport transforms.
 *
 * `CameraSystem` manages an {@link EnhancedCamera} and applies the correct
 * canvas transform (translation + optional zoom scaling) every frame. It
 * works for both orthogonal (top-down) and isometric games.
 *
 * Defaults (`zoom=1`, `lerpSpeed=1`) produce instant-follow behaviour
 * identical to the original simple camera, so existing code requires
 * no changes.
 *
 * @since 0.2.0
 * @category SubSystems
 *
 * @example Basic orthogonal camera (no zoom, instant follow)
 * ```ts
 * engine.use(new CameraSystem(800, 600, () => player.getPosition()));
 * ```
 *
 * @example Smooth-follow with zoom
 * ```ts
 * engine.use(new CameraSystem(800, 600, () => player.getPosition(), undefined, {
 *   zoom: 2,
 *   lerpSpeed: 0.08,
 *   pixelPerfect: true,
 * }));
 * ```
 *
 * @example Isometric game with projection reference
 * ```ts
 * engine.use(new CameraSystem(800, 600, () => player.getPosition(), isoProjection, {
 *   zoom: 2,
 *   lerpSpeed: 0.05,
 * }));
 * ```
 */
export class CameraSystem implements SubSystem {
  /**
   * Subsystem identifier.
   */
  id = 'camera';

  /**
   * Execution order. `10` ensures the camera transform is applied
   * before tilemap (15) and entity (20) rendering.
   */
  order = 10;

  /**
   * The underlying enhanced camera. Exposed for external consumers.
   */
  camera: EnhancedCamera;

  /**
   * Optional isometric projection reference, stored for convenience.
   * `null` for orthogonal games.
   */
  projection: IsometricProjection | null;

  /**
   * Target position supplier. Returns `null` for free camera.
   */
  private target: () => Vector2 | null;

  /**
   * Creates a new camera subsystem.
   *
   * @param width      - Viewport width in pixels.
   * @param height     - Viewport height in pixels.
   * @param target     - Function returning the world-space position to follow.
   * @param projection - Optional isometric projection (stored for reference).
   * @param config     - Optional camera configuration (zoom, lerpSpeed, etc.).
   *
   * @since 0.2.0
   *
   * @example
   * ```ts
   * const camSys = new CameraSystem(800, 600, () => player.getPosition());
   * engine.use(camSys);
   * ```
   */
  constructor(
    width: number,
    height: number,
    target: () => Vector2 | null,
    projection?: IsometricProjection,
    config?: EnhancedCameraConfig,
  ) {
    this.camera = new EnhancedCamera(width, height, {
      lerpSpeed: 1,
      zoom: 1,
      ...config,
    });
    this.projection = projection ?? null;
    this.target = target;
  }

  /**
   * Updates the camera position each frame using smooth interpolation.
   *
   * @param deltaTime - Seconds since the last frame.
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
   * the camera viewport. Image smoothing is explicitly disabled when
   * zoom != 1 to preserve pixel-art crispness.
   *
   * @param ctx - Canvas 2D rendering context.
   */
  preRender(ctx: RenderContext): void {
    const view = this.camera.getViewRect();
    ctx.save();
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-view.x, -view.y);
    if (this.camera.zoom !== 1) {
      const raw = ctx.getCanvas?.();
      if (raw) {
        raw.imageSmoothingEnabled = false;
      }
    }
  }

  /**
   * Restores the context state after all rendering is complete.
   *
   * @param ctx - The active render context.
   */
  postRender(ctx: RenderContext): void {
    ctx.restore();
  }
}
