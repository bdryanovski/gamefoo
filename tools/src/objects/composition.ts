import type {
  SpriteRegion,
  AnimationDef,
  ObjectCellSource,
  ObjectLayer,
} from "../types";

/** The sprite a cell draws: its sprite, or an animation's first frame. */
export function cellSprite(
  source: ObjectCellSource,
  spriteById: Map<string, SpriteRegion>,
  animById: Map<string, AnimationDef>,
): SpriteRegion | undefined {
  if (source.kind === "sprite") return spriteById.get(source.spriteId);
  const a = animById.get(source.animationId);
  const first = a?.frames[0];
  return first ? spriteById.get(first) : undefined;
}

/**
 * Draw composition layers into a canvas context at `scale` (device px per
 * object px), placing cells on a `cell`-px grid at their sprite's native
 * size. `opacityOf` sets per-layer alpha (0 skips).
 */
export function drawObjectLayers(
  ctx: CanvasRenderingContext2D,
  layers: ObjectLayer[],
  cell: number,
  spriteById: Map<string, SpriteRegion>,
  animById: Map<string, AnimationDef>,
  imageMap: Map<string, HTMLImageElement>,
  scale: number,
  opacityOf: (layerId: string) => number,
): void {
  ctx.imageSmoothingEnabled = false;
  for (const layer of layers) {
    const op = opacityOf(layer.id);
    if (op <= 0) continue;
    ctx.globalAlpha = op;
    for (const c of layer.cells) {
      const s = cellSprite(c.source, spriteById, animById);
      if (!s) continue;
      const img = imageMap.get(s.imageId);
      if (!img) continue;
      const dw = s.width * scale;
      const dh = s.height * scale;
      const dx = c.col * cell * scale;
      const dy = c.row * cell * scale;
      if (c.flipX || c.flipY || c.rotation) {
        ctx.save();
        ctx.translate(dx + dw / 2, dy + dh / 2);
        if (c.rotation) ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.scale(c.flipX ? -1 : 1, c.flipY ? -1 : 1);
        ctx.drawImage(img, s.x, s.y, s.width, s.height, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      } else {
        ctx.drawImage(img, s.x, s.y, s.width, s.height, dx, dy, dw, dh);
      }
    }
  }
  ctx.globalAlpha = 1;
}
