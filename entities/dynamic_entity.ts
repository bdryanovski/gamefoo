import type { Vector2 } from "../types";
import Entity from "./entity";

export default abstract class DynamicEntity extends Entity {
  protected velocity: Vector2 = { x: 0, y: 0 };
  protected speed: number = 0;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  setVelocity(velocity: Vector2): void {
    this.velocity = velocity;
  }

  getVelocity(): Vector2 {
    return { ...this.velocity };
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  getSpeed(): number {
    return this.speed;
  }
}
