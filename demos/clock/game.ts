import { Engine, Entity, ObjectSystem, Text } from "../../src/index";

const CANVAS_W = 250;
const CANVAS_H = 200;

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#000000",
  gameScale: 1,
});

class Circle extends Entity {
  protected radius = 0;
  protected tickLength = 20;
  protected tickCount = 60;
  protected lineWidth = 2;

  protected angularSpeed = 0;
  protected duration = 60; // seconds for a full rotation

  protected rotation = 0;

  protected everyX = 5;

  constructor(name: string, x: number, y: number, width: number, height: number) {
    super(name, x, y, width, height);
  }

  override update(delta: number) {
    this.angularSpeed = (Math.PI * 2) / this.duration;
    this.rotation += this.angularSpeed * delta;
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    for (let i = 0; i < this.tickCount; i++) {
      const angle = (i / this.tickCount) * Math.PI * 2;
      const x1 = (Math.cos(angle) * this.size.width) / 2;
      const y1 = (Math.sin(angle) * this.size.width) / 2;

      const length = i % this.everyX === 0 ? this.tickLength - 5 : this.tickLength;

      const x2 = Math.cos(angle) * (this.size.width / 2 - length);
      const y2 = Math.sin(angle) * (this.size.width / 2 - length);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}
class Seconds extends Circle {
  protected tickLength = 10;
  protected lineWidth = 1;
  constructor(x: number, y: number, radius: number) {
    super("seconds", x, y, radius, radius);

    this.rotation = new Date().getSeconds();
  }
}

class Minutes extends Circle {
  protected duration = 3600; // seconds for a full rotation
  protected everyX = 0;
  protected lineWidth = 2;
  constructor(x: number, y: number, radius: number) {
    super("minutes", x, y, radius, radius);

    this.rotation = new Date().getMinutes();
  }
}

class Hours extends Circle {
  protected duration = 86400; // seconds for a full rotation
  protected everyX = 0;
  protected tickLength = 20;
  protected tickCount = 24;
  protected lineWidth = 4;

  constructor(x: number, y: number, radius: number) {
    super("hours", x, y, radius, radius);

    this.rotation = new Date().getHours();
  }
}

class ClockTime extends Text {
  constructor(x: number, y: number) {
    super("clockTime", "8x8");

    this.x = x;
    this.y = y - this.font.height / 2;
  }

  override update(delta: number) {
    const time = new Date();
    const text = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(
      2,
      "0",
    )}:${String(time.getSeconds()).padStart(2, "0")}`;

    this.setText(text);
  }
}

const x = 0;
const y = CANVAS_H / 2;

engine.use(
  new ObjectSystem([
    new Seconds(x, y, 200),
    new Minutes(x, y, 175),
    new Hours(x, y, 130),
    new ClockTime(120, y),
  ]),
);

engine.setup(() => {});

engine.render = (ctx) => {
  const { height } = engine.dementions;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(110, height / 2);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
};
