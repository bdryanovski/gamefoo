import {
  Engine,
  IntervalLoopDriver,
  ObjectSystem,
  TerminalRenderContext,
} from "../../src/index";

const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
const engine = new Engine(renderer, {
  loopDriver: new IntervalLoopDriver(30),
});

engine.render = (ctx) => {
  ctx.fillRect(0, 0, renderer.width, renderer.height, "#000000");

  ctx.strokeRect(10, 5, 60, 15, "#FFFFFF");

  ctx.drawLine(150, 20, 80, 100, "#FF0000");

  ctx.drawText("Hello World!", 40, 50, "#FFFFFF", "#444444");

  ctx.drawCircle(150, 150, 60, "#00FF00");
};

engine.use(new ObjectSystem([]));

engine.setup();

process.stdout.on("resize", () => {
  const cols = process.stdout.columns ?? 80;
  const rows = process.stdout.rows ?? 24;
  renderer.resize(cols, rows);
  engine.resize(renderer.width, renderer.height);
});

process.on("exit", () => renderer.destroy());
