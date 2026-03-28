import type { Vector2 } from '../generic_types';

/**
 * A 2-D viewport camera that tracks a target position within the game
 * world.
 *
 * The camera stores its own `(x, y)` centre and viewport dimensions.
 * Each frame the {@link Engine} calls {@link Camera.follow} with the
 * player's position so the viewport stays centred on the action.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Basic usage inside the engine
 * ```ts
 * const camera = new Camera(800, 600);
 * camera.follow(player.getPosition());
 *
 * const view = camera.getViewRect();
 * // view → { x: px - 400, y: py - 300, width: 800, height: 600 }
 * ```
 *
 * @example Manual camera control
 * ```ts
 * const camera = new Camera(800, 600);
 * camera.moveTo({ x: 0, y: 0 });       // jump to origin
 * console.log(camera.getPosition());    // { x: 0, y: 0 }
 * ```
 *
 * @see {@link Engine} — owns and drives the camera each frame
 */
export default class Camera {
  /** Current X coordinate of the camera centre. */
  private x: number = 0;

  /** Current Y coordinate of the camera centre. */
  private y: number = 0;

  /** Viewport width in pixels. */
  private width: number;

  /** Viewport height in pixels. */
  private height: number;

  /**
   * Creates a camera with the given viewport dimensions.
   *
   * @param width  - Viewport width in pixels.
   * @param height - Viewport height in pixels.
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Centres the camera on a target position.
   *
   * Called by the engine every frame when a player is set.
   *
   * @param target - The world-space position to track.
   *
   * @example
   * ```ts
   * camera.follow(player.getPosition());
   * ```
   */
  follow(target: Vector2): void {
    this.x = target.x;
    this.y = target.y;
  }

  /**
   * Instantly teleports the camera to a specific position.
   *
   * Functionally identical to {@link Camera.follow} but communicates
   * intent more clearly for one-shot repositioning (e.g. scene
   * transitions).
   *
   * @param target - The world-space position to jump to.
   *
   * @example
   * ```ts
   * camera.moveTo({ x: 500, y: 300 });
   * ```
   */
  moveTo(target: Vector2): void {
    this.x = target.x;
    this.y = target.y;
  }

  /**
   * Returns the current centre position of the camera.
   *
   * @returns A new {@link Vector2} copy of the camera centre.
   */
  getPosition(): Vector2 {
    return { x: this.x, y: this.y };
  }

  /**
   * Computes the axis-aligned rectangle that represents the visible
   * area in world-space.
   *
   * The rectangle is centred on the camera's current position.
   *
   * @returns An object with `x` (left edge), `y` (top edge), `width`,
   *   and `height`.
   *
   * @example
   * ```ts
   * const rect = camera.getViewRect();
   * // Use rect to cull off-screen objects
   * if (entity.x < rect.x || entity.x > rect.x + rect.width) {
   *   return; // off-screen — skip rendering
   * }
   * ```
   */
  getViewRect(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Updates the viewport dimensions, e.g. after a window resize.
   *
   * @param width  - New viewport width in pixels.
   * @param height - New viewport height in pixels.
   *
   * @example
   * ```ts
   * window.addEventListener("resize", () => {
   *   camera.resize(window.innerWidth, window.innerHeight);
   * });
   * ```
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
