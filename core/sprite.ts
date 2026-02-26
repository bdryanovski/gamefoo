interface AnimationDefinition {
  frames: number[];
  duration: number;
  loop: boolean;
}

export default class Sprite {
  readonly image: HTMLImageElement;
  readonly width: number;
  readonly height: number;
  readonly columns: number;
  readonly rows: number;
  readonly animations: Map<string, AnimationDefinition>;

  constructor(
    image: HTMLImageElement,
    width: number,
    height: number,
    animations?: Record<string, AnimationDefinition>,
  ) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.columns = Math.floor(image.width / width);
    this.rows = Math.floor(image.height / height);
    this.animations = new Map(Object.entries(animations || {}));
  }

  getFrameRect(frame: number): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const column = frame % this.columns;
    const row = Math.floor(frame / this.columns);
    return {
      x: column * this.width,
      y: row * this.height,
      width: this.width,
      height: this.height,
    };
  }
}
