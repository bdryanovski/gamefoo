import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

const TAU = Math.PI * 2;

/**
 * Options for {@link GlowShader}.
 */
export interface GlowConfig extends ShaderConfig {
  /**
   * Glow colour (any CSS colour). @defaultValue `"#ff7a1a"`
   */
  color?: string;
  /**
   * Glow radius in logical pixels from the region centre. @defaultValue `24`
   */
  radius?: number;
  /**
   * Peak opacity, `0`–`1`. @defaultValue `0.6`
   */
  intensity?: number;
  /**
   * Pulse frequency in Hz; `0` disables pulsing. @defaultValue `0`
   */
  pulseSpeed?: number;
  /**
   * Fraction of `intensity` that the pulse swings, `0`–`1`. @defaultValue `0`
   */
  pulseAmount?: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * An additive radial glow centred on the region — a cheap bloom for fire,
 * lamps, portals, pickups. Uses the `lighter` composite so it brightens
 * whatever is underneath rather than painting over it.
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example Pulsing fire glow attached to an object
 * ```ts
 * campfire.attachShader(
 *   new GlowShader({ color: "#ff7a1a", radius: 28, intensity: 0.7,
 *                    pulseSpeed: 2, pulseAmount: 0.3 }),
 * );
 * ```
 */
export class GlowShader extends Shader {
  readonly type = 'glow';

  private readonly color: string;
  private readonly radius: number;
  private readonly intensity: number;
  private readonly pulseSpeed: number;
  private readonly pulseAmount: number;
  private time = 0;

  constructor(config: GlowConfig = {}) {
    super(config);
    this.color = config.color ?? '#ff7a1a';
    this.radius = config.radius ?? 24;
    this.intensity = clamp01(config.intensity ?? 0.6);
    this.pulseSpeed = config.pulseSpeed ?? 0;
    this.pulseAmount = clamp01(config.pulseAmount ?? 0);
  }

  override update(deltaTime: number): void {
    this.time += deltaTime;
  }

  /**
   * Current opacity, folding in the optional sine pulse.
   */
  private alpha(): number {
    if (this.pulseSpeed <= 0 || this.pulseAmount <= 0) {
      return this.intensity;
    }
    const wave = Math.sin(this.time * this.pulseSpeed * TAU) * 0.5 + 0.5;
    return this.intensity * (1 - this.pulseAmount + this.pulseAmount * wave);
  }

  render(ctx: RenderContext, region: ShaderRegion): void {
    const raw = this.raw(ctx);
    if (!raw || this.radius <= 0) {
      return;
    }

    const alpha = this.alpha();
    if (alpha <= 0) {
      return;
    }

    const { x, y } = Shader.center(region);
    const gradient = raw.createRadialGradient(x, y, 0, x, y, this.radius);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');

    raw.save();
    raw.globalCompositeOperation = 'lighter';
    raw.globalAlpha = alpha;
    raw.fillStyle = gradient;
    raw.beginPath();
    raw.arc(x, y, this.radius, 0, TAU);
    raw.fill();
    raw.restore();
  }
}
