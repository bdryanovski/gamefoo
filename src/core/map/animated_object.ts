import type Node from '@/entities/node';
import DrawNode from './draw_node';
import type { Clip, Frame, Transform } from './types';

/**
 * A live animation blitted at a fixed screen position — a decorative
 * placement (torches, fire, water), or one animated cell of a
 * {@link MapObject}'s state composition.
 *
 * Advances a {@link Clip} on its own timer and blits the current frame.
 * Carries no behaviours or collision of its own; a screen holds these
 * directly, or a {@link MapObject} holds them as {@link DrawNode} parts
 * anchored to itself.
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link DrawNode}  — the shared part contract
 * @see {@link MapObject} — stateful/interactable objects
 */
export default class AnimatedObject extends DrawNode {
  private readonly clip: Clip;
  private time = 0;
  private frameIndex = 0;

  /**
   * @param clip      - The resolved animation to play.
   * @param host      - The object this part hangs off, or `undefined` to
   *   anchor at the screen origin (see {@link AnimatedObject.at}).
   * @param ox        - Pixel offset from the anchor's X.
   * @param oy        - Pixel offset from the anchor's Y.
   * @param transform - Optional flip/rotation.
   */
  constructor(clip: Clip, host: Node | undefined, ox: number, oy: number, transform?: Transform) {
    super(host, ox, oy, transform);
    this.clip = clip;
    const first = clip.frames[0];
    if (first) {
      this.setSize(first.sw, first.sh);
    }
  }

  /**
   * An animation placed at an absolute screen position rather than offset
   * from a host — the form a {@link Screen} holds for decorative placements.
   *
   * @param clip      - The resolved animation to play.
   * @param x         - Pixel X within the screen.
   * @param y         - Pixel Y within the screen.
   * @param transform - Optional flip/rotation.
   */
  static at(clip: Clip, x: number, y: number, transform?: Transform): AnimatedObject {
    return new AnimatedObject(clip, undefined, x, y, transform);
  }

  /**
   * The frame currently displayed, or `undefined` for an empty clip.
   *
   * @since 0.5.0
   */
  override get frame(): Frame | undefined {
    return this.clip.frames[this.frameIndex];
  }

  /**
   * Advances the animation clock by `deltaTime` seconds.
   *
   * @since 0.5.0
   */
  override update(deltaTime: number): void {
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
}
