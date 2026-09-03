import type Entity from '../../entities/entity';
import type { Vector2 } from '../../generic_types';
import { Behaviour } from '../behaviour';
import type { RenderContext } from '../renderer/type';
import type Sprite from '../sprite';

/**
 * Sprite animation renderer that can be attached to any {@link Entity}.
 *
 * `SpriteRender` plays named animations defined in a {@link Sprite}
 * sheet, advancing frames based on each animation's `duration` and
 * `loop` settings. It supports horizontal flipping for left/right
 * facing and an optional pixel offset for fine-tuning draw position.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Attaching and playing an animation
 * ```ts
 * import { Asset, Sprite, SpriteRender, Player } from "gamefoo";
 *
 * const image  = await Asset.load("hero.png");
 * const sheet  = new Sprite(image, 32, 32, {
 *   idle: { frames: [0, 1], duration: 0.25, loop: true },
 *   run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
 * });
 *
 * const player = new Player("hero", 100, 100, 32, 32);
 * const sr     = new SpriteRender(player, sheet);
 * player.attachBehaviour(sr);
 *
 * sr.play("idle");
 * ```
 *
 * @example Flipping for directional facing
 * ```ts
 * if (velocity.x < 0) {
 *   spriteRender.setFlipX(true);
 * } else if (velocity.x > 0) {
 *   spriteRender.setFlipX(false);
 * }
 * ```
 *
 * @see {@link Sprite}    — spritesheet metadata
 * @see {@link Asset}     — image loader
 * @see {@link Behaviour} — abstract base class
 */
export class SpriteRender extends Behaviour<Entity> {
  /**
   * @inheritDoc
   */
  readonly type = 'sprite';

  /**
   * The spritesheet this renderer draws from.
   */
  private sheet: Sprite;

  /**
   * Name of the currently playing animation, or `null` if stopped.
   *
   * @defaultValue `null`
   */
  private currentFrame: string | null = null;

  /**
   * Index into the current animation's `frames` array.
   *
   * @defaultValue `0`
   */
  private currentFrameIndex: number = 0;

  /**
   * Seconds accumulated towards the next frame advance.
   *
   * @defaultValue `0`
   */
  private elapsedTime: number = 0;

  /**
   * Whether the sprite is drawn mirrored horizontally.
   *
   * @defaultValue `false`
   */
  private flipX: boolean = false;

  /**
   * Pixel offset applied to the draw position, relative to the
   * entity's origin.
   *
   * @defaultValue `{ x: 0, y: 0 }`
   */
  public offset: Vector2 = { x: 0, y: 0 };

  /**
   * Creates a sprite renderer bound to the given entity and sheet.
   *
   * @param owner - The entity whose position determines where the
   *   sprite is drawn.
   * @param sheet - A {@link Sprite} containing the image and animation
   *   definitions.
   */
  constructor(owner: Entity, sheet: Sprite) {
    super(owner);
    this.sheet = sheet;
  }

  /**
   * Starts (or switches to) the named animation.
   *
   * If the requested animation is already playing, the call is a no-op
   * so the current playback position is preserved.
   *
   * @param animation - Name matching a key in
   *   {@link Sprite.animations}.
   *
   * @example
   * ```ts
   * spriteRender.play("run");
   * ```
   */
  play(animation: string): void {
    if (this.currentFrame === animation) {
      return;
    }
    this.currentFrame = animation;
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;
  }

  /**
   * Stops the current animation and resets playback state.
   *
   * After calling `stop`, nothing is drawn until {@link SpriteRender.play}
   * is called again.
   */
  stop(): void {
    this.currentFrame = null;
    this.currentFrameIndex = 0;
    this.elapsedTime = 0;
  }

  /**
   * Enables or disables horizontal flipping.
   *
   * Useful for mirroring a character sprite when facing left.
   *
   * @param flip - `true` to mirror horizontally, `false` for normal.
   */
  setFlipX(flip: boolean): void {
    this.flipX = flip;
  }

  /**
   * Advances the animation clock and moves to the next frame when the
   * animation's `duration` has elapsed.
   *
   * If the animation does not loop, it holds on the last frame.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  override update(deltaTime: number): void {
    if (!this.currentFrame) {
      return;
    }

    const animation = this.sheet.animations.get(this.currentFrame);

    if (!animation) {
      console.warn(`Animation "${this.currentFrame}" not found in sprite sheet.`);
      return;
    }

    this.elapsedTime += deltaTime;

    if (this.elapsedTime >= animation.duration) {
      this.elapsedTime -= animation.duration;
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= animation.frames.length) {
        this.currentFrameIndex = animation.loop ? 0 : animation.frames.length - 1;
      }
    }
  }

  /**
   * Draws the current animation frame to the canvas.
   *
   * Respects {@link SpriteRender.flipX} by temporarily mirroring the
   * canvas transform, and applies {@link SpriteRender.offset} to the
   * draw position.
   *
   * @param ctx - The canvas 2-D rendering context.
   */
  override render(ctx: RenderContext): void {
    if (!this.currentFrame) {
      return;
    }

    const animation = this.sheet.animations.get(this.currentFrame);

    if (!animation) {
      return;
    }
    const frameKey = animation.frames[this.currentFrameIndex]!;
    const { x, y, width, height } = this.sheet.getFrameRect(frameKey);
    const pos = this.owner.getPosition();
    const drawX = pos.x + this.offset.x;
    const drawY = pos.y + this.offset.y;
    const size = this.owner.getSize();

    if (this.flipX) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawSprite?.(
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
      ctx.drawSprite?.(
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
