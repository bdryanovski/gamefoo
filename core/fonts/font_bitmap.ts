import { metadata as FONT_5x5_METADATA } from "./internal/font_5x5";

const Catalog = new Map<
  string,
  {
    name: string;
    width: number;
    height: number;
    chars: string;
    spacing: number;
    data: Record<string, number[]>;
  }
>();

Catalog.set(FONT_5x5_METADATA.name, FONT_5x5_METADATA);

export default class FontBitmap {
  public readonly name: string;

  private readonly data: Record<string, number[]>;

  private width: number = 0;
  private height: number = 0;
  private spacing: number = 0;

  constructor(name: string) {
    this.name = name;

    this.data = {};

    if (Catalog.has(name)) {
      this.data = Catalog.get(name)!.data;
    }

    this.width = this.metadata?.width || 0;
    this.height = this.metadata?.height || 0;
    this.spacing = this.metadata?.spacing || 0;
  }

  get metadata() {
    return Catalog.get(this.name) || null;
  }

  getChar(char: string): number[] | null {
    return this.data[char] || null;
  }

  getTextWidth(text: string): number {
    return text.length * this.width;
  }

  renderChar(
    char: string,
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
  ) {
    const charData = this.getChar(char);
    if (charData === null) {
      return;
    }
    for (let row = 0; row < charData.length; row++) {
      const bits = charData[row]!;
      for (let col = 0; col < this.width - this.spacing; col++) {
        if ((bits & (1 << (this.width - this.spacing - 1 - col))) !== 0) {
          ctx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }

  renderText(
    text: string,
    x: number,
    y: number,
    ctx: CanvasRenderingContext2D,
  ) {
    let offsetX = 0;
    for (const char of text) {
      this.renderChar(char, x + offsetX, y, ctx);
      offsetX += this.width;
    }
  }
}
