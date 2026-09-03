import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Base class for every screen effect ("shader").
 *
 * A shader draws an effect over a {@link ShaderRegion} each frame. Attach
 * instances to a game object (see {@link MapObject.attachShader}) to affect
 * that object's area, or register them with a {@link ShaderSystem} to affect
 * the whole screen. Time-based effects advance in {@link Shader.update}.
 *
 * Subclasses **must** implement:
 * - {@link Shader.type} — a unique string key used for look-ups.
 * - {@link Shader.render} — the per-frame draw.
 *
 * @category Shaders
 * @since 0.5.0
 *
 * @example A minimal tint shader
 * ```ts
 * class Tint extends Shader {
 *   readonly type = "tint";
 *   render(ctx: RenderContext, region: ShaderRegion): void {
 *     ctx.fillRect(region.x, region.y, region.width, region.height, "#ff000022");
 *   }
 * }
 * ```
 *
 * @see {@link ShaderStack}
 * @see {@link ShaderSystem}
 */
export abstract class Shader {
  /**
   * Unique key used by {@link ShaderStack.get} / {@link ShaderStack.detach}.
   */
  abstract readonly type: string;

  /**
   * When `false`, the stack skips this shader's update and render.
   */
  enabled: boolean;

  /**
   * @param config - Base options (currently just `enabled`). Subclasses
   *   extend {@link ShaderConfig} with their own tunables.
   */
  constructor(config: ShaderConfig = {}) {
    this.enabled = config.enabled ?? true;
  }

  /**
   * Advances any time-based state (pulses, particle simulation).
   *
   * The default is a no-op; override for animated effects.
   *
   * @param _deltaTime - Seconds since the previous frame.
   */
  update(_deltaTime: DeltaTime): void {}

  /**
   * Draws the effect for `region`.
   *
   * Canvas-backed effects should obtain the raw context via
   * {@link Shader.raw} and return early when it is `null`.
   *
   * @param ctx    - The active render context.
   * @param region - The area to affect (object box or full screen).
   */
  abstract render(ctx: RenderContext, region: ShaderRegion): void;

  /**
   * The raw `CanvasRenderingContext2D`, or `null` on non-canvas renderers.
   *
   * @param ctx - The active render context.
   */
  protected raw(ctx: RenderContext): CanvasRenderingContext2D | null {
    return ctx.getCanvas?.() ?? null;
  }

  /**
   * Centre point of a region, a common anchor for radial effects.
   */
  protected static center(region: ShaderRegion): { x: number; y: number } {
    return { x: region.x + region.width / 2, y: region.y + region.height / 2 };
  }
}
