import { Engine, Entity, FontBitmap, Text, type Vector2 } from "../../src/index";

const CANVAS_W = 800;
const CANVAS_H = 600;

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#000000",
  gameScale: 1,
});

const font3x5 = new FontBitmap("3x5");
const font4x6 = new FontBitmap("4x6");
const font5x5 = new FontBitmap("5x5");
const font6x8 = new FontBitmap("6x8");
const font8x13 = new FontBitmap("8x13");
const font8x8 = new FontBitmap("8x8");

class ShakyText extends Text {
  constructor() {
    super("ShakyText", "8x8");

    this.setText("Shaky Text go up and down");
    this.x = 50;
    this.y = CANVAS_H - 200;
  }

  override update(_dt: number): void {
    /**
     * make the title bounce up and down by modifying its position.y with a sine wave
     */
    const time = Date.now() / 1000; // get current time in seconds
    const amplitude = 2;
    const frequency = 0.5; // 1 oscillation per second
    this.y = this.y + amplitude * Math.sin(2 * Math.PI * frequency * time);
  }

  override render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

class TypeWriter extends Text {
  constructor() {
    super("RotatingText", "6x8");
    this.setText("Typewriter Effect text ...");
    this.copyOfText = this.getText();
    this.x = CANVAS_W / 2;
    this.y = CANVAS_H / 2;
  }

  private ticks = 0;
  private copyOfText = "";

  override update(_dt: number): void {
    /**
     * typewriter effect by revealing one more character every 0.1 second
     */
    const typingSpeed = 0.1; // seconds per character
    this.ticks += _dt / typingSpeed;

    const charsToShow = Math.min(Math.floor(this.ticks), this.copyOfText.length);
    this.setText(
      this.copyOfText.substring(0, charsToShow) + (charsToShow < this.copyOfText.length ? "|" : ""),
    ); // add cursor if not finished

    if (charsToShow === this.copyOfText.length) {
      this.ticks = 0; // reset ticks to loop the effect
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}

class KeyboardLayoutText extends Text {
  constructor(font: string, position: Vector2) {
    super("KeyboardLayoutText" + font, font);
    this.x = position.x;
    this.y = position.y;
  }

  override update(_dt: number): void {
    // No dynamic behavior needed for this text, so we can leave it empty.
  }

  override render(ctx: CanvasRenderingContext2D): void {
    const chars = this.font.metadata?.chars || "";
    const charsPerRow = 10;
    const charWidth = this.font.width;
    const charHeight = this.font.height;

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const row = Math.floor(i / charsPerRow);
      const col = i % charsPerRow;
      const x = this.x + col * charWidth;
      const y = this.y + row * charHeight;
      this.font.renderText(char, x, y, ctx);
    }
  }
}

class HUD extends Entity {
  constructor() {
    super("hud", 0, 0, CANVAS_W, CANVAS_H);
  }

  override update(_dt: number): void {}

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#FFFFFF";
    font3x5.renderText(font3x5.metadata?.chars + "", 10, 200, ctx);
    font5x5.renderText(font5x5.metadata?.chars + "", 10, 210, ctx);
    font4x6.renderText(font4x6.metadata?.chars + "", 10, 220, ctx);
    font6x8.renderText(font6x8.metadata?.chars + "", 10, 230, ctx);
    font8x13.renderText(font8x13.metadata?.chars + "", 10, 240, ctx);
    font8x8.renderText(font8x8.metadata?.chars + "", 10, 260, ctx);
  }
}

engine.attachObjects(new HUD());

engine.attachObjects(new ShakyText());
engine.attachObjects(new TypeWriter());
engine.attachObjects(new KeyboardLayoutText("3x5", { x: 10, y: 30 }));
engine.attachObjects(new KeyboardLayoutText("5x5", { x: 60, y: 30 }));
engine.attachObjects(new KeyboardLayoutText("4x6", { x: 130, y: 30 }));
engine.attachObjects(new KeyboardLayoutText("6x8", { x: 190, y: 30 }));
engine.attachObjects(new KeyboardLayoutText("8x13", { x: 270, y: 30 }));
engine.attachObjects(new KeyboardLayoutText("8x8", { x: 370, y: 30 }));

engine.setup(() => {});
