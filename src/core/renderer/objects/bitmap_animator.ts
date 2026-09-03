/**
 * Bitmap-based animation player.
 *
 * Plays named animations composed of {@link Bitmap} frames, with
 * configurable frame duration, looping, and playback control.
 *
 * @category Rendering
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * const animator = new BitmapAnimator(
 *   { x: 100, y: 100 },
 *   { width: 16, height: 16 },
 *   {
 *     idle: [frame1, frame2],
 *     walk: [frame3, frame4, frame5, frame6],
 *   }
 * );
 *
 * animator.state('walk');
 * animator.loop(true);
 * animator.setDuration(0.15); // 150ms per frame
 * ```
 */

import type { RenderContext } from '../type';
import Node from '../../../entities/node';
import type { Demension, Vector2 } from '@/generic_types';
import type { Bitmap } from './bitmap';

type BitmapAnimatorData = Record<string, Bitmap[]>;

export class BitmapAnimator extends Node {
  private animations: BitmapAnimatorData;

  /**
   * Whether the animation loops.
   */
  protected enableLoop = false;

  /**
   * Current animation name.
   */
  protected current: string | null = null;

  /**
   * Current frame index.
   */
  protected progress = 0;

  /**
   * Time elapsed since last frame change (seconds).
   */
  protected elapsed = 0;

  /**
   * Duration of each frame (seconds). Default 0.1 = 100ms.
   */
  protected duration = 0.1;

  /**
   * Creates a new BitmapAnimator.
   *
   * @param position - Position to render at.
   * @param size - Size of the animation.
   * @param animations - Map of animation names to Bitmap frame arrays.
   * @param duration - Seconds per frame (default: 0.1).
   *
   * @since 0.5.0
   */
  constructor(
    position: Vector2,
    size: Demension,
    animations: BitmapAnimatorData = {},
    duration = 0.1,
  ) {
    super(position, size);
    this.animations = animations;
    this.duration = duration;
  }

  /**
   * Sets the current animation by name.
   *
   * Resets playback to the first frame.
   *
   * @param name - Animation name (key in animations map).
   *
   * @since 0.5.0
   */
  public state(name: string): void {
    if (this.current !== name) {
      this.current = name;
      this.progress = 0;
      this.elapsed = 0;
    }
  }

  /**
   * Enables or disables looping.
   *
   * @param enabled - Whether to loop the animation.
   *
   * @since 0.5.0
   */
  public loop(enabled: boolean): void {
    this.enableLoop = enabled;
  }

  /**
   * Sets the frame duration.
   *
   * @param seconds - Seconds per frame (e.g., 0.1 = 100ms, 0.25 = 250ms).
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * animator.setDuration(0.5);  // 2 fps, Very slow
   * animator.setDuration(0.25); // 4 fps, slow retro feel
   * animator.setDuration(0.15); // 7 fps, Medium
   * animator.setDuration(0.1);  // 10 fps, smooth
   * animator.setDuration(0.05); // 20 fps, fast, smooth
   * ```
   */
  public setDuration(seconds: number): void {
    this.duration = seconds;
  }

  /**
   * Gets the current frame duration.
   *
   * @returns Seconds per frame.
   *
   * @since 0.5.0
   */
  public getDuration(): number {
    return this.duration;
  }

  /**
   * Renders the current animation frame.
   *
   * @param ctx - The rendering context.
   *
   * @since 0.5.0
   */
  public render(ctx: RenderContext): void {
    const frames = this.current ? this.animations[this.current] : undefined;
    const frame = frames?.[this.progress];

    if (!frame) {
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    const path = frame.render();
    if (path) {
      ctx.fill(path);
    }
    ctx.restore();
  }

  /**
   * Advances the animation based on elapsed time.
   *
   * @param dt - Seconds since last frame.
   *
   * @since 0.5.0
   */
  public update(dt: number): void {
    if (!this.current) {
      return;
    }

    const frames = this.animations[this.current];
    if (!frames || frames.length === 0) {
      return;
    }

    this.elapsed += dt;

    // Advance frame when duration elapsed
    if (this.elapsed >= this.duration) {
      this.elapsed -= this.duration;
      this.progress++;

      // Handle end of animation
      if (this.progress >= frames.length) {
        this.progress = this.enableLoop ? 0 : frames.length - 1;
      }
    }
  }
}
