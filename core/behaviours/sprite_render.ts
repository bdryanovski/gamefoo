import type Entity from "../../entities/entity";
import type { Vector2 } from "../../types";
import { Behaviour } from "../behaviour";
import type Sprite from "../sprite";

export default class SpriteRender extends Behaviour<Entity> {
  readonly type = "sprite";

  private sheet: Sprite;
  private currentFrame: string | null = null;
  private currentFrameIndex: number = 0;
  private elapsedTime: number = 0;
  private flipX: boolean = false;

  public offset: Vector2 = { x: 0, y: 0 };

  constructor(owner: Entity, sheet: Sprite) {
    super(owner);
    this.sheet = sheet;
  }

  play(animation: string): void {
    if (this.currentFrame === animation) {
      return;
    }
    this.currentFrame = animation;
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;
  }

  stop(): void {
    this.currentFrame = null;
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;
  }

  setFlipX(flip: boolean): void {
    this.flipX = flip;
  }

  update(deltaTime: number): void {
    if (!this.currentFrame) {
      return;
    }

    const animation = this.sheet.animations.get(this.currentFrame);

    if (!animation) {
      console.warn(
        `Animation "${this.currentFrame}" not found in sprite sheet.`,
      );
      return;
    }

    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= animation.duration) {
      this.elapsedTime -= animation.duration;
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= animation.frames.length) {
        this.currentFrameIndex = animation.loop
          ? 0
          : animation.frames.length - 1;
      }
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    if (!this.currentFrame) {
      return;
    }

    const animation = this.sheet.animations.get(this.currentFrame);

    if (!animation) {
      return;
    }
    const frameIndex = animation.frames[this.currentFrameIndex]!;
    const { x, y, width, height } = this.sheet.getFrameRect(frameIndex);
    const pos = this.owner.getPosition();
    const drawX = pos.x + this.offset.x;
    const drawY = pos.y + this.offset.y;
    const size = this.owner.getSize();

    if (this.flipX) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.sheet.image,
        x,
        y,
        width,
        height,
        -(drawX + size.width),
        drawY,
        size.width,
        size.height,
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        this.sheet.image,
        x,
        y,
        width,
        height,
        drawX,
        drawY,
        size.width,
        size.height,
      );
    }
  }
}
