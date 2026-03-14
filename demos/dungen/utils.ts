import { Sprite } from "../../src";
import { TILE_SIZE } from "./constants";

export function drawTile(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  frame: number,
  col: number,
  row: number,
) {
  const rect = sprite.getFrameRect(frame);
  ctx.drawImage(
    sprite.image,
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    col * TILE_SIZE,
    row * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
  );
}
