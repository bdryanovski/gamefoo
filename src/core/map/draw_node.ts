import Node from '../../entities/node';
import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import { drawFrame } from './draw';
import type { Frame, Transform } from './types';

/**
 * A single blittable piece of art: a static {@link FrameNode} or a live
 * {@link AnimatedObject}.
 *
 * A part is placed at `anchor.x + ox` / `anchor.y + oy`, where the anchor is
 * its **host** — one cell of a {@link MapObject}'s state composition — or the
 * screen origin when it stands alone. Because a part tracks its anchor rather
 * than an absolute position, moving the host moves its art:
 * {@link DrawNode.sync} re-derives `x`/`y` before every draw, so a host's
 * per-frame loop stays a plain `part.update(dt)` / `part.render(ctx)` with no
 * per-part bookkeeping.
 *
 * `ox`/`oy`/`frame`/`transform` make every part a {@link ShaderPart}, so a
 * host can hand its parts straight to shaders that trace its silhouette
 * (e.g. {@link OutlineShader}).
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link FrameNode}      — a static frame
 * @see {@link AnimatedObject} — a live clip
 * @see {@link MapObject}      — the host that composes parts
 */
export default abstract class DrawNode extends Node {
  /**
   * The frame this part currently shows, or `undefined` while it has none
   * (an empty clip, or a cell whose sprite did not resolve).
   */
  abstract readonly frame: Frame | undefined;

  /**
   * Pixel offset from the anchor's X.
   */
  readonly ox: number;

  /**
   * Pixel offset from the anchor's Y.
   */
  readonly oy: number;

  /**
   * Optional flip/rotation applied when blitting the frame.
   */
  readonly transform?: Transform;

  /**
   * @param host      - The object this part hangs off, or `undefined` to
   *   anchor at the screen origin (a standalone decoration).
   * @param ox        - Pixel offset from the anchor's X.
   * @param oy        - Pixel offset from the anchor's Y.
   * @param transform - Optional flip/rotation.
   */
  constructor(
    protected readonly host: Node | undefined,
    ox: number,
    oy: number,
    transform?: Transform,
  ) {
    super({ x: ox, y: oy });
    this.ox = ox;
    this.oy = oy;
    this.transform = transform;
  }

  /**
   * Advances the part's own animation, if it has one. Static parts do
   * nothing.
   *
   * @param _deltaTime - Seconds since the previous frame.
   */
  override update(_deltaTime: DeltaTime): void {}

  /**
   * Re-anchors the part, then blits the current frame.
   */
  override render(ctx: RenderContext): void {
    this.sync();
    const frame = this.frame;
    if (frame) {
      drawFrame(ctx, frame, this.x, this.y, this.transform);
    }
  }

  /**
   * Re-derives this part's position from its anchor plus its own offset, so a
   * host that moved since the last frame still draws its art in the right
   * place. A part with no host keeps the position it was given.
   */
  protected sync(): void {
    if (this.host) {
      this.x = this.host.x + this.ox;
      this.y = this.host.y + this.oy;
    }
  }
}
