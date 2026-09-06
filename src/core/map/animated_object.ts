import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import { drawFrame } from './draw';
import type { Clip, Frame, Transform } from './types';

/**
 * A lightweight animated placement: advances a {@link Clip} on its own
 * timer and blits the current frame at a fixed screen position.
 *
 * Not an {@link Entity} — it carries no behaviours or collision. Screens
 * hold these directly for decorative animations (torches, fire, water).
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link MachineObject} — stateful/interactable objects
 */
export default class AnimatedObject {
  private time = 0;
  private frameIndex = 0;

  /**
   * @param clip      - The resolved animation to play.
   * @param x         - Pixel X within the screen.
   * @param y         - Pixel Y within the screen.
   * @param transform - Optional flip/rotation.
   */
  constructor(
    private readonly clip: Clip,
    public x: number,
    public y: number,
    private readonly transform?: Transform,
  ) {}

  /**
   * The frame currently displayed, or `undefined` for an empty clip.
   *
   * @since 0.5.0
   */
  public get frame(): Frame | undefined {
    return this.clip.frames[this.frameIndex];
  }

  /**
   * Advances the animation clock by `deltaTime` seconds.
   *
   * @since 0.5.0
   */
  public update(deltaTime: DeltaTime): void {
    const count = this.clip.frames.length;

    /**
     * When we don't have any frames defined we should quit or when
     * the duration of the animation frames is negative number (we could not
     * run in the past - yet) in this cases nothing could be done
     */
    if (count <= 1 || this.clip.duration <= 0) {
      return;
    }

    this.time += deltaTime;

    while (this.time >= this.clip.duration) {
      this.time -= this.clip.duration;
      this.frameIndex += 1;
      if (this.frameIndex >= count) {
        this.frameIndex = this.clip.loop ? 0 : count - 1;
      }
    }
  }

  /**
   * Draws the current frame.
   *
   * @since 0.5.0
   */
  public render(ctx: RenderContext): void {
    const frame = this.frame;
    if (frame) {
      drawFrame(ctx, frame, this.x, this.y, this.transform);
    }
  }
}
