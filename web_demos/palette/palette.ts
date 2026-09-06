import {
  Engine,
  Entity,
  ObjectSystem,
  RenderContext,
  WebRenderer,
  CONSOLES,
  ConsoleName,
  listConsoles,
  ColorPalette,
  GeneratedPalette,
  FontBitmap,
  isGeneratedPalette,
} from '../../src/index';

const CANVAS_W = 800;
const CANVAS_H = 700;

const BOX = { width: 12, height: 16 };
const ROW_HEIGHT = 38;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H, 1);
const text = new FontBitmap('4x6');

const engine = new Engine(renderer, {
  backgroundColor: '#1a1a2e',
});

class ConsoleDemo extends Entity {
  private consoleDef: (typeof CONSOLES)[ConsoleName];
  private palette: ColorPalette | GeneratedPalette;

  constructor(consoleName: ConsoleName, x: number, y: number) {
    super(consoleName, x, y);
    this.consoleDef = CONSOLES[consoleName];
    this.palette = this.consoleDef.palette;
  }

  override update(_dt: number) {}

  override render(ctx: RenderContext) {
    // Draw console name and resolution
    const res = this.consoleDef.resolution;
    const label = `${this.palette.name} (${res.width}x${res.height})`;
    text.renderText(label, this.x, this.y, ctx);

    // Draw palette colors
    if (isGeneratedPalette(this.palette)) {
      // For generated palettes, show common colors or a sample gradient
      const colors = this.palette.commonColors || [];
      for (let i = 0; i < colors.length; i++) {
        ctx.fillRect(
          this.x + BOX.width * i,
          this.y + 10,
          BOX.width,
          BOX.height,
          colors[i],
        );
      }
      // Show total color count
      text.renderText(
        `(${this.palette.totalColors} total)`,
        this.x + BOX.width * colors.length + 5,
        this.y + 14,
        ctx,
      );
    } else {
      // For fixed palettes, show all colors
      for (let i = 0; i < this.palette.colors.length; i++) {
        ctx.fillRect(
          this.x + BOX.width * i,
          this.y + 10,
          BOX.width,
          BOX.height,
          this.palette.colors[i],
        );
      }
    }
  }
}

// Get all unique consoles (skip aliases like MEGADRIVE which equals GENESIS)
const consoleNames: ConsoleName[] = [
  'PICO8',
  'TIC80',
  'ATARI_2600',
  'NES',
  'SNES',
  'GAMEBOY',
  'GBC',
  'GBA',
  'GENESIS',
  'GAMEGEAR',
  'NEO_GEO',
  'C64',
  'CGA',
  'CGA_FULL',
  'EGA',
  'EGA_64',
  'PLAYDATE',
];

engine.use(
  new ObjectSystem(
    consoleNames.map((name, index) => {
      return new ConsoleDemo(name, 20, ROW_HEIGHT * index + 10);
    }),
  ),
);

engine.setup(() => {
  console.log(`Displaying ${consoleNames.length} console palettes`);
  console.log(`Available consoles: ${listConsoles().join(', ')}`);
});
