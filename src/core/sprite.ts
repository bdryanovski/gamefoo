/**
 * Describes a single named animation within a {@link Sprite} sheet.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example
 * ```ts
 * const walkAnim: AnimationDefinition = {
 *   frames: [0, 1, 2, 3],
 *   duration: 0.15,
 *   loop: true,
 * };
 * ```
 */
interface AnimationDefinition {
  /** Ordered frame indices into the spritesheet grid. */
  frames: number[];
  /** Time in seconds each frame is displayed before advancing. */
  duration: number;
  /** Whether the animation restarts from frame 0 after the last frame. */
  loop: boolean;
}

/**
 * Metadata wrapper around an {@link HTMLImageElement} that describes how
 * it is sliced into a uniform grid of frames and what named animations
 * are available.
 *
 * `Sprite` does **not** handle rendering itself — use
 * {@link SpriteRender} to play animations on an entity.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Loading and creating a sprite
 * ```ts
 * import { Asset } from "gamefoo";
 *
 * const image = await Asset.load("hero.png");
 * const sprite = new Sprite(image, 32, 32, {
 *   idle: { frames: [0, 1], duration: 0.25, loop: true },
 *   run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
 * });
 * ```
 *
 * @example Querying frame coordinates
 * ```ts
 * const rect = sprite.getFrameRect(5);
 * ctx.drawImage(
 *   sprite.image,
 *   rect.x, rect.y, rect.width, rect.height,
 *   destX, destY, rect.width, rect.height,
 * );
 * ```
 *
 * @see {@link SpriteRender} — behaviour that plays sprite animations
 * @see {@link Asset}        — image loading utility
 */
export default class Sprite {
  /** The underlying image element containing the full spritesheet. */
  readonly image: HTMLImageElement;

  /** Width of a single frame cell in pixels. */
  readonly width: number;

  /** Height of a single frame cell in pixels. */
  readonly height: number;

  /**
   * Number of frame columns in the spritesheet, computed as
   * `Math.floor(image.width / width)`.
   */
  readonly columns: number;

  /**
   * Number of frame rows in the spritesheet, computed as
   * `Math.floor(image.height / height)`.
   */
  readonly rows: number;

  /**
   * Named animation definitions keyed by animation name.
   *
   * Populated from the optional `animations` parameter passed to the
   * constructor.
   */
  readonly animations: Map<string, AnimationDefinition>;

  /**
   * Creates a new spritesheet descriptor.
   *
   * @param image      - A fully-loaded `HTMLImageElement` containing the
   *   spritesheet texture.
   * @param width      - Width of each individual frame in pixels.
   * @param height     - Height of each individual frame in pixels.
   * @param animations - Optional map of named animation definitions.
   *   Keys are animation names (e.g. `"idle"`, `"run"`).
   *
   * @example
   * ```ts
   * const sprite = new Sprite(img, 64, 64, {
   *   idle: { frames: [0], duration: 1, loop: false },
   * });
   * ```
   */
  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    animations?: Record<string, AnimationDefinition>,
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.columns = Math.floor(image.width / width);
    this.rows = Math.floor(image.height / height);
    this.animations = new Map(Object.entries(animations || {}));
  }

  /**
   * Computes the source rectangle for a given frame index within the
   * spritesheet.
   *
   * Frame indices are zero-based and laid out left-to-right,
   * top-to-bottom.
   *
   * @param frame - Zero-based frame index.
   * @returns An `{ x, y, width, height }` rectangle in pixel coordinates
   *   relative to the top-left corner of the source image.
   *
   * @example
   * ```ts
   * // For a 4-column sheet, frame 5 → col 1, row 1
   * const rect = sprite.getFrameRect(5);
   * ```
   */
  getFrameRect(frame: number): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const column = frame % this.columns;
    const row = Math.floor(frame / this.columns);
    return {
      x: column * this.width,
      y: row * this.height,
      width: this.width,
      height: this.height,
    };
  }
}
