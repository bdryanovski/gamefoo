import type { RenderContext } from "../../src/core/renderer/type";
import {
  Engine,
  Entity,
  IconBitmap,
  type InternalBitmapIconName,
  ObjectSystem,
  type Vector2,
  WebRenderer,
} from "../../src/index";

const CANVAS_W = 800;
const CANVAS_H = 600;

const renderer = new WebRenderer("game", CANVAS_W, CANVAS_H);
const engine = new Engine(renderer, {
  backgroundColor: "#000000",
  gameScale: 1,
});

class KeyboardLayoutText extends Entity {
  private icon: IconBitmap;

  constructor(iconName: InternalBitmapIconName, position: Vector2) {
    super("KeyboardLayoutText" + iconName, position.x, position.y, 0, 0);
    this.x = position.x;
    this.y = position.y;

    this.icon = new IconBitmap(iconName);
    console.log(this.icon.metadata);
  }

  override update(_dt: number): void {
    // No dynamic behavior needed for this text, so we can leave it empty.
  }

  override render(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    c.fillStyle = "#ffffff";
    const chars = this.icon.metadata?.keys || "";
    const charsPerRow = 10;
    const charWidth = this.icon.width + 5;
    const charHeight = this.icon.height + 5;

    for (let i = 0; i < chars.length; i++) {
      const icon = chars[i] ?? "";
      const row = Math.floor(i / charsPerRow);
      const col = i % charsPerRow;
      const x = this.x + col * charWidth;
      const y = this.y + row * charHeight;
      this.icon.renderIcon(icon, x, y, ctx);
    }
  }
}

engine.use(
  new ObjectSystem([
    new KeyboardLayoutText("icons_8x8", { x: 10, y: 10 }),
    new KeyboardLayoutText("icons_16x16", { x: 10, y: 200 }),
    // new KeyboardLayoutText("icons_32x32", { x: 10, y: 300 }),
  ]),
);

engine.setup(() => {});
