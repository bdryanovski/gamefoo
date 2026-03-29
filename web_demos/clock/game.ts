import type { RenderContext } from "../../src/core/renderer/type";
import {
  Engine,
  Entity,
  ObjectSystem,
  Text,
  WebRenderer,
} from "../../src/index";

const CANVAS_W = 250;
const CANVAS_H = 200;

const renderer = new WebRenderer("game", CANVAS_W, CANVAS_H);
const engine = new Engine(renderer, {
  backgroundColor: "#000000",
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

  constructor(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(name, x, y, width, height);
  }

  override update(delta: number) {
    this.angularSpeed = (Math.PI * 2) / this.duration;
    this.rotation += this.angularSpeed * delta;
  }

  override render(ctx: RenderContext) {
    const c = ctx.getCanvas?.();
    if (!c) return;
    c.save();

    c.translate(this.x, this.y);
    c.rotate(this.rotation);

    for (let i = 0; i < this.tickCount; i++) {
      const angle = (i / this.tickCount) * Math.PI * 2;
      const x1 = (Math.cos(angle) * this.size.width) / 2;
      const y1 = (Math.sin(angle) * this.size.width) / 2;

      const length =
        i % this.everyX === 0 ? this.tickLength - 5 : this.tickLength;

      const x2 = Math.cos(angle) * (this.size.width / 2 - length);
      const y2 = Math.sin(angle) * (this.size.width / 2 - length);

      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.strokeStyle = "#FFFFFF";
      c.lineWidth = this.lineWidth;
      c.stroke();
    }

    c.restore();
  }
}

class Seconds extends Circle {
  protected override tickLength = 10;
  protected override lineWidth = 1;
  constructor(x: number, y: number, radius: number) {
    super("seconds", x, y, radius, radius);
    this.rotation = new Date().getSeconds();
  }
}

class Minutes extends Circle {
  protected override duration = 3600;
  protected override everyX = 0;
  protected override lineWidth = 2;
  constructor(x: number, y: number, radius: number) {
    super("minutes", x, y, radius, radius);
    this.rotation = new Date().getMinutes();
  }
}

class Hours extends Circle {
  protected override duration = 86400;
  protected override everyX = 0;
  protected override tickLength = 20;
  protected override tickCount = 24;
  protected override lineWidth = 4;

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

  override update(_delta: number) {
    const time = new Date();
    const text = `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes(),
    ).padStart(2, "0")}:${String(time.getSeconds()).padStart(2, "0")}`;
    this.setText(text);
  }
}

// Second-hand axis line — drawn by overriding engine.render
class AxisLine extends Entity {
  constructor() {
    super("axis-line", 0, 0, CANVAS_W, CANVAS_H);
  }
  override update(_dt: number) {}
  override render(ctx: RenderContext) {
    const c = ctx.getCanvas?.();
    if (!c) return;
    const { height } = engine.dementions;
    c.save();
    c.beginPath();
    c.moveTo(0, height / 2);
    c.lineTo(110, height / 2);
    c.strokeStyle = "red";
    c.lineWidth = 2;
    c.stroke();
    c.restore();
  }
}

const x = 0;
const y = CANVAS_H / 2;

engine.use(
  new ObjectSystem([
    new AxisLine(),
    new Seconds(x, y, 200),
    new Minutes(x, y, 175),
    new Hours(x, y, 130),
    new ClockTime(120, y),
  ]),
);

engine.setup(() => {});
