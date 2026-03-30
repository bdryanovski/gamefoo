/**
 * Subsystem that renders a performance debug overlay.
 *
 * Tracks FPS and memory usage, and draws a frame-rate graph.
 * Runs at order `100` — last of all subsystems.
 *
 * @since 0.2.0
 * @category SubSystems
 *
 * @example
 * ```ts
 * engine.use(new MonitorSystem());
 * ```
 */
import FontBitmap from '../core/fonts/font_bitmap';
import type { RenderContext } from '../core/renderer/type';
import type { SubSystem } from './types';

/**
 * Chrome-only non-standard extension to the Performance API.
 * @internal
 */
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/** @internal */
declare const performance: Performance & { memory?: MemoryInfo };

const font = new FontBitmap('5x5');

export class MonitorSystem implements SubSystem {
  id = 'monitor';
  order = 100;

  private fps: number = 0;
  private timer: number = 0;
  private frameCount: number = 0;
  private memory: number = 0;
  private frames: number[] = [];

  /** X position of the overlay in pixels. @defaultValue `8` */
  public x: number = 8;
  /** Y position of the overlay in pixels. @defaultValue `8` */
  public y: number = 8;

  update(deltaTime: number): void {
    this.frameCount++;
    this.timer += deltaTime;

    if (this.timer >= 1.0) {
      this.fps = this.frameCount / this.timer;
      this.frameCount = 0;
      this.timer = 0;

      this.frames.push(this.fps);
      if (this.frames.length > 60) {
        this.frames.shift();
      }
    }

    if (performance.memory) {
      this.memory = performance.memory.usedJSHeapSize / 1048576;
    }
  }

  render(ctx: RenderContext): void {
    ctx.save();

    const raw = ctx.getCanvas?.();
    if (raw) raw.fillStyle = '#ffffff';

    font.renderText(`FPS: ${this.fps.toFixed(1)}`, this.x, this.y, ctx);

    if (this.memory) {
      font.renderText(
        `MEM: ${this.memory.toFixed(1)} MB`,
        this.x,
        this.y + font.height + 3,
        ctx,
      );
    }

    const canvasCtx = ctx.getCanvas?.();
    if (canvasCtx && this.frames.length >= 1) {
      canvasCtx.strokeStyle = '#fff';
      canvasCtx.beginPath();
      for (let i = 0; i < this.frames.length; i++) {
        const x = this.x + i;
        const y = this.x + font.height * 2 + 80 - (this.frames[i] ?? 0);
        canvasCtx.lineTo(x, y);
      }
      canvasCtx.stroke();
    }

    ctx.restore();
  }
}
