import type { Vector2 } from "../types";
import { Behaviour } from "../core/behaviour";

export default abstract class Entity {
  protected position: Vector2 = { x: 0, y: 0 };
  protected size = { width: 0, height: 0 };

  private behaviors: Behaviour[] = [];

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

  getBehavioursByType<T extends Behaviour>(
    type: new (...args: any[]) => T,
  ): T[] {
    return this.behaviors.filter((b) => b instanceof type) as T[];
  }

  attachBehaviour<T extends Behaviour>(behavior: T): T {
    this.behaviors.push(behavior);
    this.behaviors.sort((a, b) => a.priority - b.priority);

    if (behavior.onAttach) {
      behavior.onAttach();
    }
    return behavior;
  }

  protected updateBehaviours(deltaTime: number): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled) {
        behavior.update(deltaTime);
      }
    }
  }

  protected renderBehaviours(ctx: CanvasRenderingContext2D): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled && behavior.render) {
        behavior.render(ctx);
      }
    }
  }
}
