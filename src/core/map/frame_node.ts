import type Node from '@/entities/node';
import DrawNode from './draw_node';
import type { Frame, Transform } from './types';

/**
 * A {@link DrawNode} holding one static {@link Frame} — the sprite cell of a
 * {@link MapObject}'s authored composition.
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link AnimatedObject} — the animated counterpart
 * @see {@link DrawNode}      — the shared part contract
 */
export default class FrameNode extends DrawNode {
  /**
   * @param host      - The object this part belongs to.
   * @param ox        - Pixel offset from the host's X.
   * @param oy        - Pixel offset from the host's Y.
   * @param frame     - The resolved frame to blit.
   * @param transform - Optional flip/rotation.
   */
  constructor(
    host: Node,
    ox: number,
    oy: number,
    override readonly frame: Frame,
    transform?: Transform,
  ) {
    super(host, ox, oy, transform);
    this.setSize(frame.sw, frame.sh);
  }
}
