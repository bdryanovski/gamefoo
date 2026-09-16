import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Options for {@link FootstepTrailShader}.
 */
export interface FootstepTrailConfig extends ShaderConfig {
  /**
   * Mark colour (any CSS colour). @defaultValue `"#1a1a1a"`
   */
  color?: string;
  /**
   * Pixels of travel between successive prints. @defaultValue `6`
   */
  spacing?: number;
  /**
   * Seconds a print stays before it fades out. @defaultValue `1.1`
   */
  life?: number;
  /**
   * Print square size in logical px (kept integer for a pixelated mark).
   * @defaultValue `2`
   */
  size?: number;
  /**
   * Lateral left/right separation in px, perpendicular to travel — a gait.
   * `0` centres every print. @defaultValue `2`
   */
  offset?: number;
  /**
   * Peak opacity, `0`–`1`, fading to `0` over life. @defaultValue `0.5`
   */
  alpha?: number;
  /**
   * Hard cap on live prints. @defaultValue `80`
   */
  max?: number;
}

/**
 * One dropped mark at a fixed world position, fading over `life`.
 */
interface Footprint {
  x: number;
  y: number;
  age: number;
  life: number;
}

const EMPTY: ShaderRegion = { x: 0, y: 0, width: 0, height: 0 };

/**
 * A single-frame jump larger than this (logical px) is treated as a teleport
 * or screen change, not walking: the trail is reset instead of streaked
 * across the gap.
 */
const TELEPORT = 48;

/**
 * A pixelated footstep trail that drops small marks behind a moving object and
 * fades them out — dust, tracks, a ghosting afterimage.
 *
 * Attach it to a {@link MapObject}: the host's box is captured from the most
 * recent {@link FootstepTrailShader.render}, a print is dropped every
 * `spacing` pixels of travel from the box's bottom-centre (its "feet"),
 * alternating a lateral `offset` for a left/right gait, and each print fades
 * over `life`. Prints hold their world position, so they stay put as the
 * object walks away. Marks are snapped to integer pixels so they read crisp on
 * a pixel-art canvas.
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example A faint trail behind the player
 * ```ts
 * player.attachShader(
 *   new FootstepTrailShader({ color: "#1a1a1a", spacing: 6, life: 1.1 }),
 * );
 * ```
 */
export class FootstepTrailShader extends Shader {
  readonly type = 'footsteps';
  override readonly under = true;

  private readonly color: string;
  private readonly spacing: number;
  private readonly life: number;
  private readonly size: number;
  private readonly offset: number;
  private readonly alpha: number;
  private readonly max: number;

  private readonly prints: Footprint[] = [];
  private emit: ShaderRegion = EMPTY;
  private prevX = Number.NaN;
  private prevY = Number.NaN;
  private since = 0;
  private left = false;

  constructor(config: FootstepTrailConfig = {}) {
    super(config);
    this.color = config.color ?? '#1a1a1a';
    this.spacing = Math.max(1, config.spacing ?? 6);
    this.life = config.life ?? 1.1;
    this.size = Math.max(1, Math.round(config.size ?? 2));
    this.offset = config.offset ?? 2;
    this.alpha = Math.min(1, Math.max(0, config.alpha ?? 0.5));
    this.max = config.max ?? 80;
  }

  /**
   * Drops every live print — call on a teleport so the trail does not streak
   * from the old position to the new one.
   */
  clear(): void {
    this.prints.length = 0;
    this.since = 0;
    this.prevX = Number.NaN;
    this.prevY = Number.NaN;
  }

  /**
   * The host box's bottom-centre — where the object's feet meet the ground.
   */
  private foot(): { x: number; y: number } {
    const region = this.emit;
    return { x: region.x + region.width / 2, y: region.y + region.height - 2 };
  }

  override update(deltaTime: DeltaTime): void {
    if (this.emit.width > 0) {
      const { x, y } = this.foot();
      if (Number.isNaN(this.prevX)) {
        this.prevX = x;
        this.prevY = y;
      } else {
        const dx = x - this.prevX;
        const dy = y - this.prevY;
        const dist = Math.hypot(dx, dy);
        if (dist > TELEPORT) {
          this.clear();
          this.prevX = x;
          this.prevY = y;
        } else if (dist > 0) {
          const inv = 1 / dist;
          const px = -dy * inv;
          const py = dx * inv;
          this.since += dist;
          while (this.since >= this.spacing && this.prints.length < this.max) {
            this.since -= this.spacing;
            const s = this.left ? this.offset : -this.offset;
            this.left = !this.left;
            this.prints.push({ x: x + px * s, y: y + py * s, age: 0, life: this.life });
          }
          this.prevX = x;
          this.prevY = y;
        }
      }
    }

    let write = 0;
    for (const print of this.prints) {
      print.age += deltaTime;
      if (print.age < print.life) {
        this.prints[write++] = print;
      }
    }
    this.prints.length = write;
  }

  render(ctx: RenderContext, region: ShaderRegion): void {
    this.emit = region;
    const raw = this.raw(ctx);
    if (!raw) {
      return;
    }

    raw.save();
    raw.fillStyle = this.color;
    const half = this.size / 2;
    for (const print of this.prints) {
      const remaining = 1 - print.age / print.life;
      raw.globalAlpha = Math.max(0, remaining) * this.alpha;
      raw.fillRect(Math.round(print.x - half), Math.round(print.y - half), this.size, this.size);
    }
    raw.restore();
  }
}
