import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Options for {@link AmbientSporeShader}.
 */
export interface AmbientSporeConfig extends ShaderConfig {
  /**
   * Mote colour (any CSS colour). A pale, cold glow reads as "Upside Down".
   * @defaultValue `"#cdd6ff"`
   */
  color?: string;
  /**
   * Motes per 10,000 screen px² — the field's density. Ignored when
   * {@link AmbientSporeConfig.count} is set. @defaultValue `1.4`
   */
  density?: number;
  /**
   * Exact mote count, overriding {@link AmbientSporeConfig.density}.
   */
  count?: number;
  /**
   * Base drift speed in px/s (downward, ± jitter). @defaultValue `7`
   */
  speed?: number;
  /**
   * Horizontal sway amplitude in px/s — the lazy side-to-side float.
   * @defaultValue `5`
   */
  drift?: number;
  /**
   * Core mote size in logical px (± jitter). @defaultValue `1.5`
   */
  size?: number;
  /**
   * Soft-glow radius as a multiple of {@link AmbientSporeConfig.size}.
   * @defaultValue `3`
   */
  glow?: number;
  /**
   * Peak opacity, `0`–`1`. Keep it low so the field stays a whisper.
   * @defaultValue `0.28`
   */
  alpha?: number;
  /**
   * Twinkle depth, `0`–`1` — how far opacity dips as each mote breathes.
   * @defaultValue `0.5`
   */
  twinkle?: number;
}

interface Spore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  swayPhase: number;
  swayRate: number;
  twinklePhase: number;
  twinkleRate: number;
}

const EMPTY: ShaderRegion = { x: 0, y: 0, width: 0, height: 0 };

/**
 * A whisper-quiet field of drifting motes for an ambient, "Stranger Things"
 * Upside-Down mood: soft spores that hang in the air, sway sideways, sink
 * slowly, and twinkle. Unlike {@link ParticleShader} (a directional emitter
 * that spawns and kills particles), this keeps a fixed pool that **wraps**
 * around the screen edges, so the field is seamless and never empties.
 *
 * Register it with a {@link ShaderSystem} so it composites over the whole
 * finished frame:
 *
 * ```ts
 * const shaders = new ShaderSystem();
 * shaders.add(new AmbientSporeShader({ density: 1.2, alpha: 0.22 }));
 * engine.use(shaders);
 * ```
 *
 * Motes glow additively, so the effect is strongest over the dark parts of
 * the scene and all but vanishes over bright ones — exactly the settled,
 * atmospheric feel wanted here.
 *
 * @category Shaders
 * @since 0.5.0
 */
export class AmbientSporeShader extends Shader {
  readonly type = 'ambient-spores';

  private readonly color: string;
  private readonly density: number;
  private readonly count: number | undefined;
  private readonly speed: number;
  private readonly drift: number;
  private readonly size: number;
  private readonly glow: number;
  private readonly alpha: number;
  private readonly twinkle: number;

  private readonly spores: Spore[] = [];
  private region: ShaderRegion = EMPTY;
  private time = 0;

  constructor(config: AmbientSporeConfig = {}) {
    super(config);
    this.color = config.color ?? '#cdd6ff';
    this.density = config.density ?? 1.4;
    this.count = config.count;
    this.speed = config.speed ?? 7;
    this.drift = config.drift ?? 5;
    this.size = config.size ?? 1.5;
    this.glow = config.glow ?? 3;
    this.alpha = config.alpha ?? 0.28;
    this.twinkle = config.twinkle ?? 0.5;
  }

  /** Margin (px) motes travel past an edge before wrapping — hides the pop. */
  private get margin(): number {
    return this.size * this.glow + 2;
  }

  /** Seeds the pool spread across `region`, sized to its area. */
  private seed(region: ShaderRegion): void {
    this.region = region;
    this.spores.length = 0;
    const area = region.width * region.height;
    const target =
      this.count ?? Math.min(200, Math.max(12, Math.round((area / 10_000) * this.density)));
    for (let i = 0; i < target; i++) {
      const jitter = 0.7 + Math.random() * 0.8;
      this.spores.push({
        x: region.x + Math.random() * region.width,
        y: region.y + Math.random() * region.height,
        vx: (Math.random() * 2 - 1) * this.drift * 0.3,
        vy: this.speed * (0.4 + Math.random() * 0.8),
        size: this.size * jitter,
        swayPhase: Math.random() * Math.PI * 2,
        swayRate: 0.25 + Math.random() * 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleRate: 0.5 + Math.random() * 0.9,
      });
    }
  }

  /** Wraps `v` into `[min - margin, min + span + margin)`. */
  private wrap(v: number, min: number, span: number): number {
    const lo = min - this.margin;
    const full = span + this.margin * 2;
    let r = (v - lo) % full;
    if (r < 0) {r += full;}
    return lo + r;
  }

  override update(deltaTime: DeltaTime): void {
    this.time += deltaTime;
    const region = this.region;
    if (region.width === 0) {
      return;
    }
    for (const spore of this.spores) {
      const sway = Math.sin(this.time * spore.swayRate + spore.swayPhase) * this.drift;
      spore.x = this.wrap(spore.x + (spore.vx + sway) * deltaTime, region.x, region.width);
      spore.y = this.wrap(spore.y + spore.vy * deltaTime, region.y, region.height);
    }
  }

  render(ctx: RenderContext, region: ShaderRegion): void {
    if (region.width !== this.region.width || region.height !== this.region.height) {
      this.seed(region);
    }
    const raw = this.raw(ctx);
    if (!raw) {
      return;
    }
    raw.save();
    raw.globalCompositeOperation = 'lighter';
    for (const spore of this.spores) {
      const breath = 0.5 + 0.5 * Math.sin(this.time * spore.twinkleRate + spore.twinklePhase);
      const alpha = this.alpha * (1 - this.twinkle + this.twinkle * breath);
      if (alpha <= 0) {
        continue;
      }
      const radius = spore.size * this.glow;
      const gradient = raw.createRadialGradient(spore.x, spore.y, 0, spore.x, spore.y, radius);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'transparent');
      raw.globalAlpha = alpha;
      raw.fillStyle = gradient;
      raw.fillRect(spore.x - radius, spore.y - radius, radius * 2, radius * 2);
    }
    raw.restore();
  }
}
