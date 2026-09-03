import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Options for {@link ParticleShader}.
 */
export interface ParticleConfig extends ShaderConfig {
  /**
   * Particle colour (any CSS colour). @defaultValue `"#ffb347"`
   */
  color?: string;
  /**
   * Particles spawned per second. @defaultValue `18`
   */
  rate?: number;
  /**
   * Particle lifetime in seconds (± 40% jitter). @defaultValue `0.8`
   */
  lifetime?: number;
  /**
   * Initial upward speed in px/s (± 40% jitter). @defaultValue `20`
   */
  speed?: number;
  /**
   * Horizontal velocity spread in px/s. @defaultValue `6`
   */
  spread?: number;
  /**
   * Vertical acceleration in px/s² (positive = downward). @defaultValue `10`
   */
  gravity?: number;
  /**
   * Particle square size in logical px. @defaultValue `1`
   */
  size?: number;
  /**
   * Peak opacity, `0`–`1`, fading to `0` over life. @defaultValue `0.9`
   */
  alpha?: number;
  /**
   * Hard cap on live particles. @defaultValue `120`
   */
  max?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
}

const EMPTY: ShaderRegion = { x: 0, y: 0, width: 0, height: 0 };

/**
 * A lightweight additive particle emitter — embers rising from a fire,
 * sparks, dust, bubbles. Particles spawn across the region's width near its
 * vertical middle, drift under `gravity`, and fade out over their lifetime.
 *
 * The simulation advances in {@link ParticleShader.update}; the emit region
 * is captured from the most recent {@link ParticleShader.render}.
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example Embers rising from a campfire
 * ```ts
 * campfire.attachShader(
 *   new ParticleShader({ color: "#ffcc55", rate: 24, speed: 22, gravity: 8 }),
 * );
 * ```
 */
export class ParticleShader extends Shader {
  readonly type = 'particles';

  private readonly color: string;
  private readonly rate: number;
  private readonly lifetime: number;
  private readonly speed: number;
  private readonly spread: number;
  private readonly gravity: number;
  private readonly size: number;
  private readonly alpha: number;
  private readonly max: number;

  private readonly particles: Particle[] = [];
  private pending = 0;
  private emit: ShaderRegion = EMPTY;

  constructor(config: ParticleConfig = {}) {
    super(config);
    this.color = config.color ?? '#ffb347';
    this.rate = config.rate ?? 18;
    this.lifetime = config.lifetime ?? 0.8;
    this.speed = config.speed ?? 20;
    this.spread = config.spread ?? 6;
    this.gravity = config.gravity ?? 10;
    this.size = config.size ?? 1;
    this.alpha = config.alpha ?? 0.9;
    this.max = config.max ?? 120;
  }

  private spawn(): void {
    const region = this.emit;
    const jitter = 0.6 + Math.random() * 0.4;
    this.particles.push({
      x: region.x + Math.random() * region.width,
      y: region.y + region.height * 0.4,
      vx: (Math.random() * 2 - 1) * this.spread,
      vy: -this.speed * jitter,
      age: 0,
      life: this.lifetime * jitter,
    });
  }

  override update(deltaTime: number): void {
    if (this.emit.width > 0) {
      this.pending += this.rate * deltaTime;
      while (this.pending >= 1 && this.particles.length < this.max) {
        this.pending -= 1;
        this.spawn();
      }
    }

    let write = 0;
    for (const particle of this.particles) {
      particle.age += deltaTime;
      if (particle.age >= particle.life) {
        continue;
      }
      particle.vy += this.gravity * deltaTime;
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      this.particles[write++] = particle;
    }
    this.particles.length = write;
  }

  render(ctx: RenderContext, region: ShaderRegion): void {
    this.emit = region;
    const raw = this.raw(ctx);
    if (!raw) {
      return;
    }

    raw.save();
    raw.globalCompositeOperation = 'lighter';
    raw.fillStyle = this.color;
    const half = this.size / 2;
    for (const particle of this.particles) {
      const remaining = 1 - particle.age / particle.life;
      raw.globalAlpha = Math.max(0, remaining) * this.alpha;
      raw.fillRect(particle.x - half, particle.y - half, this.size, this.size);
    }
    raw.restore();
  }
}
