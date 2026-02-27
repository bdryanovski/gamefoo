export default class Animate {
  private key: string;
  private frames: { col: number; row: number }[];
  private frameW: number;
  private frameH: number;
  private currentFrame: number = 0;
  private elapsed = 0;

  private interval: number;
  private fps: number;

  constructor(
    key: string,
    frames: { col: number; row: number }[],
    frameW: number,
    frameH: number,
    fps: number,
  ) {
    this.key = key;
    this.frames = frames;
    this.frameW = frameW;
    this.frameH = frameH;
    this.fps = fps;

    this.interval = 1000 / this.fps;
  }

  public update(delta: number) {
    this.elapsed += delta;

    if (this.elapsed >= this.interval) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.elapsed = 0;
    }
  }

  public draw(_ctx: CanvasRenderingContext2D, _destX: number, _destY: number) {
    const frame = this.frames[this.currentFrame];
    if (!frame) return;
    const { col, row } = frame;
    // Asset.drawFrame(ctx, key, col, row, frameW, frameH, destX, destY)
  }

  public reset() {
    this.currentFrame = 0;
    this.elapsed = 0;
  }
}
