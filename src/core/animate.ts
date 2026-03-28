/**
 * Frame-based sprite animation controller.
 *
 * `Animate` steps through a sequence of spritesheet cells at a given
 * frame rate. It tracks elapsed time internally and advances the
 * current frame index each time the interval elapses.
 *
 * > **Note:** The {@link Animate.draw} method is currently a stub —
 * > it resolves the correct frame but does not yet perform the actual
 * > `drawImage` call.  Use {@link SpriteRender} for production
 * > sprite rendering.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Creating a walk animation
 * ```ts
 * const walkFrames = [
 *   { col: 0, row: 0 },
 *   { col: 1, row: 0 },
 *   { col: 2, row: 0 },
 *   { col: 3, row: 0 },
 * ];
 *
 * const anim = new Animate("walk", walkFrames, 32, 32, 12);
 * ```
 *
 * @example Updating in a game loop
 * ```ts
 * function update(delta: number) {
 *   anim.update(delta);
 *   anim.draw(ctx, entity.x, entity.y);
 * }
 * ```
 *
 * @see {@link SpriteRender} — behaviour-based alternative for entity rendering
 * @see {@link Sprite}       — spritesheet metadata container
 */
export default class Animate {
  /** Identifier for this animation (e.g. `"walk"`, `"idle"`). */
  private key: string;

  /** Ordered list of spritesheet cells that make up the animation. */
  private frames: { col: number; row: number }[];

  /** Width of a single frame in pixels. */
  private frameW: number;

  /** Height of a single frame in pixels. */
  private frameH: number;

  /**
   * Index into {@link Animate.frames} of the frame currently being
   * displayed.
   *
   * @defaultValue `0`
   */
  private currentFrame: number = 0;

  /**
   * Milliseconds accumulated since the last frame advance.
   *
   * @defaultValue `0`
   */
  private elapsed = 0;

  /** Computed time between frames in milliseconds (`1000 / fps`). */
  private interval: number;

  /** Playback speed in frames per second. */
  private fps: number;

  /**
   * Creates a new animation sequence.
   *
   * @param key    - A unique name for this animation (used as a look-up key).
   * @param frames - An ordered array of `{ col, row }` cells from the
   *   spritesheet.
   * @param frameW - Width of each frame in pixels.
   * @param frameH - Height of each frame in pixels.
   * @param fps    - Playback speed in frames per second.
   *
   * @example
   * ```ts
   * const idle = new Animate(
   *   "idle",
   *   [{ col: 0, row: 1 }, { col: 1, row: 1 }],
   *   64, 64,
   *   8,
   * );
   * ```
   */
  constructor(
    key: string,
    frames: { col: number; row: number }[],
    frameW: number,
    frameH: number,
    fps: number,
  ) {
    this.key = key;
    this.frames = frames;
    this.frameW = frameW;
    this.frameH = frameH;
    this.fps = fps;

    this.interval = 1000 / this.fps;
  }

  /**
   * Advances the animation clock and moves to the next frame when the
   * interval has elapsed.
   *
   * @param delta - Time elapsed since the last call, **in milliseconds**.
   *
   * @example
   * ```ts
   * // Inside a requestAnimationFrame loop:
   * anim.update(deltaMs);
   * ```
   */
  public update(delta: number) {
    this.elapsed += delta;

    if (this.elapsed >= this.interval) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.elapsed = 0;
    }
  }

  /**
   * Draws the current animation frame to the canvas.
   *
   * @remarks
   * This method is currently a **stub**. It resolves the correct
   * `{ col, row }` cell but does not perform the actual
   * `ctx.drawImage()` call. Wire it to {@link Asset} or use
   * {@link SpriteRender} for full rendering.
   *
   * @param _ctx   - The canvas 2-D rendering context.
   * @param _destX - Destination X coordinate on the canvas.
   * @param _destY - Destination Y coordinate on the canvas.
   */
  public draw(_ctx: CanvasRenderingContext2D, _destX: number, _destY: number) {
    const frame = this.frames[this.currentFrame];
    if (!frame) return;
    const { col: _col, row: _row } = frame;
    // Asset.drawFrame(ctx, key, col, row, frameW, frameH, destX, destY)
  }

  /**
   * Resets the animation to its first frame.
   *
   * Call this when switching animations or restarting a sequence.
   *
   * @example
   * ```ts
   * anim.reset();
   * anim.update(0); // ensures frame 0 is active
   * ```
   */
  public reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
  }
}
