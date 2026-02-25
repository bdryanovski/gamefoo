

export default class Animate {
  private key: string;
  private frames: unknown[];
  private frameW: number;
  private frameH: number;
  private currentFrame: number = 0
  private elapsed = 0;

  private interval: number
  private fps: number

  constructor(key: string, frames: unknown[], frameW: number, frameH: number, fps: number) {
    this.key = key;
    this.frames = frames;
    this.frameW = frameW;
    this.frameH = frameH;
    this.fps = fps

    this.interval = 1000 / this.fps
  }

  public update(delta: number) {
    this.elapsed += delta;

    if (this.elapsed >= this.interval) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length
      this.elapsed = 0
    }
  }

  public draw(ctx, destX, destY) {
    const { col, row } = this.frames[this.currentFrame]
    // Asset.drawFrame(ctx, key, col, row, frameW, frameH, destX, destY)
  }

  public reset() {
    this.currentFrame = 0;
    this.elapsed = 0
  }
}
