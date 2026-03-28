import FontBitmap from "../core/fonts/font_bitmap";
import type { RenderContext } from "../core/renderer/type";

const font = new FontBitmap("5x5");

export default class Monitor {
  private fps: number = 0;
  private timer: number = 0;
  private frameCount: number = 0;
  private memory: number = 0;

  private frames: number[] = [0];

  public x: number = 8;
  public y: number = 8;

  update(delta: number): void {
    this.frameCount++;
    this.timer += delta;

    if (this.timer >= 1.0) {
      this.fps = this.frameCount / this.timer;
      this.frameCount = 0;
      this.timer = 0;

      this.frames.push(this.fps);
      if (this.frames.length > 60) {
        this.frames.shift();
      }
    }

    if ((performance as any).memory) {
      const mem = (performance as any).memory;
      this.memory = mem.usedJSHeapSize / 1048576;
    }
  }

  render(ctx: RenderContext): void {
    ctx.save();

    // Set white fill for canvas-backed renderers before using Path2D fonts
    const raw = ctx.getCanvas?.();
    if (raw) raw.fillStyle = "#ffffff";

    font.renderText(`FPS: ${this.fps.toFixed(1)}`, this.x, this.y, ctx);

    if (this.memory) {
      font.renderText(`MEM: ${this.memory.toFixed(1)} MB`, this.x, this.y + font.height + 3, ctx);
    }

    // Frame graph is canvas-only (uses beginPath/lineTo/stroke)
    const _canvasForGraph = ctx.getCanvas?.();
    if (_canvasForGraph && this.frames.length >= 1) {
      const canvasCtx = _canvasForGraph;
      canvasCtx.strokeStyle = "#fff";
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
