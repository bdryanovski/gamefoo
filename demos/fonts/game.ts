import { Engine, Entity, FontBitmap, type Vector2 } from '../../src/index';

const CANVAS_W = 800;
const CANVAS_H = 600;

const engine = new Engine('game', CANVAS_W, CANVAS_H, {
  backgroundColor: '#000000',
  gameScale: 1,
});

const font3x5 = new FontBitmap('3x5');
const font4x6 = new FontBitmap('4x6');
const font5x5 = new FontBitmap('5x5');
const font6x8 = new FontBitmap('6x8');
const font8x13 = new FontBitmap('8x13');
const font8x8 = new FontBitmap('8x8');

class HUD extends Entity {
  constructor() {
    super('hud', 0, 0, CANVAS_W, CANVAS_H);
  }

  override update(_dt: number): void {}

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFFFFF';
    font3x5.renderText(font3x5.metadata?.chars + '', 10, 100, ctx);
    font5x5.renderText(font5x5.metadata?.chars + '', 10, 110, ctx);
    font4x6.renderText(font4x6.metadata?.chars + '', 10, 120, ctx);
    font6x8.renderText(font6x8.metadata?.chars + '', 10, 130, ctx);
    font8x13.renderText(font8x13.metadata?.chars + '', 10, 140, ctx);
    font8x8.renderText(font8x8.metadata?.chars + '', 10, 160, ctx);
  }
}

engine.attachObjects(new HUD());

engine.setup(() => {});
