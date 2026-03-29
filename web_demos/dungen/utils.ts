import type { Sprite } from "../../src";
import type { RenderContext } from "../../src/core/renderer/type";
import { TILE_SIZE } from "./constants";

export function drawTile(ctx: RenderContext, sprite: Sprite, frame: number, col: number, row: number) {
  ctx.drawSprite?.(
    sprite.image,
    sprite.getFrameRect(frame).x,
    sprite.getFrameRect(frame).y,
    sprite.getFrameRect(frame).width,
    sprite.getFrameRect(frame).height,
    col * TILE_SIZE,
    row * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
  );
}
