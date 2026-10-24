import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import { Shader } from './shader';
import type { ShaderConfig, ShaderRegion } from './types';

/**
 * Options for {@link ScreenTransitionShader}.
 */
export interface ScreenTransitionConfig extends ShaderConfig {
  /**
   * Cover fill (any CSS colour) — the darkness the room collapses into.
   * @defaultValue `"#05060b"`
   */
  color?: string;
  /**
   * Ring colour at the collapsing edge — a torch-lit rim. @defaultValue `"#ff9c3c"`
   */
  edgeColor?: string;
  /**
   * Pixel-block size in logical px. Bigger = chunkier, more retro.
   * @defaultValue `18`
   */
  block?: number;
  /**
   * Focus point as `0..1` fractions of the surface — where the light
   * collapses to / reopens from. @defaultValue `{ x: 0.5, y: 0.5 }`
   */
  center?: { x: number; y: number };
}

/**
 * A blocky iris/torch wipe for room-to-room cuts. As {@link
 * ScreenTransitionShader.coverage} climbs `0 → 1`, the visible area collapses
 * to the focus point behind chunky black pixels ringed with a flickering torch
 * glow; running it back `1 → 0` reopens the new room. It draws nothing at
 * `coverage = 0`, so it is free when idle.
 *
 * The shader is a pure function of `coverage` (plus a tiny time-based flicker),
 * so the game owns the choreography — drive `coverage` from a transition
 * controller and swap screens at the covered midpoint:
 *
 * ```ts
 * const wipe = shaders.add(new ScreenTransitionShader({ block: 18 }));
 * // out: wipe.coverage 0→1, then swap the screen, then in: 1→0.
 * ```
 *
 * Register it **last** on the {@link ShaderSystem} so it covers every other
 * effect, the HUD, and any open dialog.
 *
 * @category Shaders
 * @since 0.5.0
 */
export class ScreenTransitionShader extends Shader {
  readonly type = 'screen-transition';

  /** `0` = fully clear (room visible), `1` = fully covered. Driven by the game. */
  coverage = 0;

  private readonly color: string;
  private readonly edgeColor: string;
  private readonly block: number;
  private readonly focus: { x: number; y: number };
  private time = 0;

  constructor(config: ScreenTransitionConfig = {}) {
    super(config);
    this.color = config.color ?? '#05060b';
    this.edgeColor = config.edgeColor ?? '#ff9c3c';
    this.block = Math.max(2, config.block ?? 18);
    this.focus = config.center ?? { x: 0.5, y: 0.5 };
  }

  override update(deltaTime: DeltaTime): void {
    this.time += deltaTime;
  }

  render(ctx: RenderContext, region: ShaderRegion): void {
    if (this.coverage <= 0) {
      return;
    }
    const b = this.block;
    const cx = region.x + region.width * this.focus.x;
    const cy = region.y + region.height * this.focus.y;
    // Full radius = distance to the farthest corner, so coverage 1 buries the
    // whole surface and coverage 0 clears it entirely.
    const maxR = Math.max(
      Math.hypot(region.x - cx, region.y - cy),
      Math.hypot(region.x + region.width - cx, region.y - cy),
      Math.hypot(region.x - cx, region.y + region.height - cy),
      Math.hypot(region.x + region.width - cx, region.y + region.height - cy),
    );
    // Mid-transition only: jitter the ring radius for a torch-flicker edge.
    const mid = this.coverage > 0 && this.coverage < 1;
    const flicker = mid ? (Math.sin(this.time * 23) + Math.sin(this.time * 8.5)) * (b * 0.18) : 0;
    const visR = (1 - this.coverage) * maxR + flicker;
    for (let y = region.y; y < region.y + region.height; y += b) {
      for (let x = region.x; x < region.x + region.width; x += b) {
        const dx = x + b / 2 - cx;
        const dy = y + b / 2 - cy;
        const d = Math.hypot(dx, dy);
        if (d >= visR) {
          ctx.fillRect(x, y, b, b, this.color);
        } else if (d >= visR - b) {
          ctx.fillRect(x, y, b, b, this.edgeColor);
        }
      }
    }
  }
}
