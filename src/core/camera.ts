import type { Vector2 } from "../types";

export default class Camera {
  private x: number = 0;
  private y: number = 0;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  follow(target: Vector2): void {
    this.x = target.x;
    this.y = target.y;
  }

  moveTo(target: Vector2): void {
    this.x = target.x;
    this.y = target.y;
  }

  getPosition(): Vector2 {
    return { x: this.x, y: this.y };
  }

  getViewRect(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    };
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
