import type { RenderContext } from '../renderer/type';
import type { Frame, Transform } from './types';

/**
 * Blits a resolved {@link Frame} at `(dx, dy)` applying optional
 * flip/rotation from a {@link Transform}.
 *
 * The fast path (no transform) is a single `drawSprite`. Flips use
 * `scale(±1)`; rotation requires the canvas-backed context and is skipped
 * on renderers that cannot rotate (e.g. terminal).
 *
 * @category Map
 * @since 0.5.0
 */
export function drawFrame(
  ctx: RenderContext,
  frame: Frame,
  dx: number,
  dy: number,
  t?: Transform,
): void {
  if (!ctx.drawSprite) {
    return;
  }

  const flipVertical = t?.flipX ?? false;
  const flipHorizontal = t?.flipY ?? false;
  const rotateFrame = t?.rotation ?? 0;

  /**
   * If not need to do any frame transformation render and exit
   */
  if (!flipVertical && !flipHorizontal && !rotateFrame) {
    ctx.drawSprite(frame.image, frame.sx, frame.sy, frame.sw, frame.sh, dx, dy, frame.sw, frame.sh);
    return;
  }

  ctx.save();
  ctx.translate(dx + frame.sw / 2, dy + frame.sh / 2);

  /**
   * Rotate the canvas if needed
   */
  if (rotateFrame) {
    ctx.getCanvas?.()?.rotate((rotateFrame * Math.PI) / 180);
  }

  ctx.scale(flipVertical ? -1 : 1, flipHorizontal ? -1 : 1);

  ctx.drawSprite(
    frame.image,
    frame.sx,
    frame.sy,
    frame.sw,
    frame.sh,
    -frame.sw / 2,
    -frame.sh / 2,
    frame.sw,
    frame.sh,
  );

  ctx.restore();
}
