import type { DeltaTime } from '../../../../src/generic_types';
import {
  type CollisionMap,
  GlowShader,
  Input,
  MapObject,
  type MapObjectContext,
  type Rect,
  type RenderContext,
} from '../../../../src/index';

const SIZE = 16;
const SPEED = 64; // px/s

type Facing = 'down' | 'up' | 'left' | 'right';

/**
 * The playable character, bound to the "player" object and driven by its
 * exported state machine. The class turns keyboard input into movement,
 * resolves collisions against solid {@link MapObject.colliders}, and drives
 * the FSM so the animation matches direction + moving/idle state.
 *
 * Unlike map placements, the player is owned by the game (not a
 * {@link Screen}) so it survives screen changes; the game repositions it on
 * transitions. Being a {@link MapObject} it already supports shaders — a
 * faint aura is attached in {@link Player.onSpawn} to show it off.
 *
 * State map (authored names): `Down/Up/Left/Right` = walking (Left mirrors
 * the right-walk art), `Idle` = idle facing down, `idle_up` = idle facing up.
 */
export class Player extends MapObject {
  static override readonly type = 'player';

  private readonly input: Input;
  private facing: Facing = 'down';
  private moving = false;

  constructor(ctx: MapObjectContext, input: Input) {
    super(ctx);
    this.input = input;
  }

  override onSpawn(): void {
    this.attachShader(
      new GlowShader({
        color: '#8fe9ff',
        radius: 12,
        intensity: 0.25,
        pulseSpeed: 1.2,
        pulseAmount: 0.4,
      }),
    );
    this.play('Idle');
  }

  /** The player's world-space collision/footprint box. */
  box(): Rect {
    return { x: this.x, y: this.y, width: SIZE, height: SIZE };
  }

  /** A slightly enlarged box used to reach nearby interactables. */
  interactionBox(): Rect {
    const reach = 6;
    return {
      x: this.x - reach,
      y: this.y - reach,
      width: SIZE + reach * 2,
      height: SIZE + reach * 2,
    };
  }

  /** Teleports the player (used by the game on screen transitions). */
  place(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /** Reads the current movement intent from the keyboard, `-1..1` per axis. */
  private readInput(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.input.isKeyDown('a') || this.input.isKeyDown('arrowleft')) x -= 1;
    if (this.input.isKeyDown('d') || this.input.isKeyDown('arrowright')) x += 1;
    if (this.input.isKeyDown('w') || this.input.isKeyDown('arrowup')) y -= 1;
    if (this.input.isKeyDown('s') || this.input.isKeyDown('arrowdown')) y += 1;
    return { x, y };
  }

  /** Centre-bottom "foot" point, used for ground/fall checks. */
  footPoint(): { x: number; y: number } {
    return { x: this.x + SIZE / 2, y: this.y + SIZE - 2 };
  }

  /** Picks the FSM state that matches the current facing + moving flag. */
  private desiredState(): string {
    if (this.moving) {
      if (this.facing === 'up') return 'Up';
      if (this.facing === 'down') return 'Down';
      return this.facing === 'left' ? 'Left' : 'Right';
    }
    return this.facing === 'up' ? 'idle_up' : 'Idle';
  }

  /**
   * Advances the player: input → movement (resolved against the shared
   * {@link CollisionMap} so it bumps solids and slides along walls) →
   * facing → animation state → base update (animation + shaders).
   *
   * @param deltaTime - Seconds since the previous frame.
   * @param collision - The current screen's collision world (optional).
   */
  override update(deltaTime: DeltaTime, collision?: CollisionMap): void {
    const dir = this.readInput();
    this.moving = dir.x !== 0 || dir.y !== 0;

    let vx = dir.x;
    let vy = dir.y;
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }
    const dx = vx * SPEED * deltaTime;
    const dy = vy * SPEED * deltaTime;
    if (collision) {
      const next = collision.resolve(this.box(), dx, dy, this);
      this.x = next.x;
      this.y = next.y;
    } else {
      this.x += dx;
      this.y += dy;
    }

    if (this.moving) {
      if (dir.x < 0) this.facing = 'left';
      else if (dir.x > 0) this.facing = 'right';
      else if (dir.y < 0) this.facing = 'up';
      else if (dir.y > 0) this.facing = 'down';
    }

    this.play(this.desiredState());
    super.update(deltaTime);
  }

  override render(ctx: RenderContext): void {
    if (this.facing === 'left') {
      // Mirror the right-walk art in place for leftward movement.
      ctx.save();
      ctx.translate(this.x * 2 + SIZE, 0);
      ctx.scale(-1, 1);
      super.render(ctx);
      ctx.restore();
    } else {
      super.render(ctx);
    }
  }
}
