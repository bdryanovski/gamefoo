import type { Vector2 } from "../types";

export default abstract class Node {
  protected position: Vector2 = { x: 0, y: 0 };
  protected size = { width: 0, height: 0 };

  get x(): number {
    return this.position.x;
  }

  set x(value: number) {
    this.position.x = value;
  }

  get y(): number {
    return this.position.y;
  }

  set y(value: number) {
    this.position.y = value;
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.position = { x, y };
    this.size = { width, height };
  }

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;

  getPosition(): Vector2 {
    return { ...this.position };
  }

  getSize(): { width: number; height: number } {
    return { ...this.size };
  }
}
