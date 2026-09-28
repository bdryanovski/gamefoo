import React from "react";
import type { SpriteRegion } from "../types";

/** Default preview box edge in px. */
export const PREVIEW_SIZE = 40;

/** A flip/rotation applied to a preview. */
export interface PreviewTransform {
  flipX?: boolean;
  flipY?: boolean;
  rotation?: number;
}

/** Draw a sprite region centred and fitted into a size×size box. */
export function drawSpriteFitted(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteRegion,
  img: HTMLImageElement | undefined,
  size: number = PREVIEW_SIZE,
  transform?: PreviewTransform,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);
  if (!img || !img.complete || sprite.width <= 0 || sprite.height <= 0) return;
  const scale = Math.min(size / sprite.width, size / sprite.height);
  const dw = sprite.width * scale;
  const dh = sprite.height * scale;
  if (transform && (transform.flipX || transform.flipY || transform.rotation)) {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    if (transform.rotation) ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
    ctx.drawImage(img, sprite.x, sprite.y, sprite.width, sprite.height, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.drawImage(
      img,
      sprite.x, sprite.y, sprite.width, sprite.height,
      (size - dw) / 2, (size - dh) / 2, dw, dh,
    );
  }
}

/**
 * A bare canvas that renders a sprite-id sequence. A single-frame list
 * draws a static sprite; multi-frame lists play back at `duration`
 * seconds per frame. Callers own any surrounding chrome (border/badge).
 */
export function AnimatedSpritePreview({
  frames,
  duration,
  spriteById,
  imageMap,
  size = PREVIEW_SIZE,
  transform,
}: {
  frames: string[];
  duration: number;
  spriteById: Map<string, SpriteRegion>;
  imageMap: Map<string, HTMLImageElement>;
  size?: number;
  transform?: PreviewTransform;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = React.useState(0);
  const animated = frames.length > 1;

  React.useEffect(() => {
    setFrame(0);
    if (!animated) return;
    const ms = Math.max(60, (duration || 0.12) * 1000);
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), ms);
    return () => clearInterval(id);
  }, [animated, frames.length, duration]);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    const spriteId = frames[frame] ?? frames[0];
    const sprite = spriteId ? spriteById.get(spriteId) : undefined;
    if (!sprite) {
      ctx.clearRect(0, 0, size, size);
      return;
    }
    drawSpriteFitted(ctx, sprite, imageMap.get(sprite.imageId), size, transform);
  }, [frame, frames, spriteById, imageMap, size, transform]);

  return <canvas ref={ref} />;
}
