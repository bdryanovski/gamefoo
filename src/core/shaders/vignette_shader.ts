import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Options for {@link VignetteShader}.
 */
export interface VignetteConfig extends ShaderConfig {
  /**
   * Edge colour (any CSS colour). @defaultValue `"#000000"`
   */
  color?: string;
  /**
   * Edge opacity, `0`–`1`. @defaultValue `0.5`
   */
  intensity?: number;
  /**
   * Radius (as a fraction of the half-diagonal, `0`–`1`) at which the
   * darkening begins; the centre stays clear. @defaultValue `0.55`
   */
  inner?: number;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * A full-screen vignette: transparent at the centre, darkening toward the
 * edges. Register it with a {@link ShaderSystem} for an engine-wide mood
 * effect (dungeon gloom, focus framing, damage flash when animated).
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example Engine-wide dungeon gloom
 * ```ts
 * const shaders = new ShaderSystem();
 * shaders.add(new VignetteShader({ intensity: 0.45 }));
 * engine.use(shaders);
 * ```
 */
export class VignetteShader extends Shader {
  public readonly type = 'vignette';

  private readonly color: string;
  private readonly intensity: number;
  private readonly inner: number;

  constructor(config: VignetteConfig = {}) {
    super(config);
    this.color = config.color ?? '#000000';
    this.intensity = clamp01(config.intensity ?? 0.5);
    this.inner = clamp01(config.inner ?? 0.55);
  }

  public render(ctx: RenderContext, region: ShaderRegion): void {
    const raw = this.raw(ctx);
    if (!raw || this.intensity <= 0) {
      return;
    }

    const { x, y } = Shader.center(region);
    const outer = Math.hypot(region.width, region.height) / 2;
    if (outer <= 0) {
      return;
    }

    const gradient = raw.createRadialGradient(x, y, outer * this.inner, x, y, outer);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, this.color);

    raw.save();
    raw.globalAlpha = this.intensity;
    raw.fillStyle = gradient;
    raw.fillRect(region.x, region.y, region.width, region.height);
    raw.restore();
  }
}
