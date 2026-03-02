import FontBitmap from "../core/fonts/font_bitmap";

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

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    font.renderText(`FPS: ${this.fps.toFixed(1)}`, this.x, this.y, ctx);

    if (this.memory) {
      font.renderText(`MEM: ${this.memory.toFixed(1)} MB`, this.x, this.y + font.height + 3, ctx);
    }

    if (this.frames.length >= 1) {
      ctx.beginPath();
      this.frames.forEach((value, i) => {
        const x = this.x + i;
        const y = this.x + font.height * 2 + 80 - value;
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    ctx.restore();
  }
}
