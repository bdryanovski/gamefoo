import type Behavior from "../core/behavior";
import type { Vector2 } from "../types";

export default abstract class Entity {
  protected position: Vector2 = { x: 0, y: 0 };
  protected size = { width: 0, height: 0 };

  private behaviors: Behavior[] = [];

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

  attachBehavior<T extends Behavior>(behavior: T): T {
    this.behaviors.push(behavior);
    this.behaviors.sort((a, b) => a.priority - b.priority);

    if (behavior.onAttach) {
      behavior.onAttach();
    }
    return behavior;
  }

  detachBehavior(behavior: Behavior): void {
    const index = this.behaviors.indexOf(behavior);
    if (index === -1) return;

    if (behavior.onDetach) {
      behavior.onDetach();
    }
    this.behaviors.splice(index, 1);
  }

  getBehaviors(): Behavior[] {
    return [...this.behaviors]; // make sure to make a copy to prevent external mutation;
  }

  getBehavior<T extends Behavior>(behaviorClass: new (...args: any[]) => T): T | undefined {
    return this.behaviors.find((b) => b instanceof behaviorClass) as T | undefined;
  }

  hasBehavior<T extends Behavior>(behaviorClass: new (...args: any[]) => T): boolean {
    return this.behaviors.some((b) => b instanceof behaviorClass);
  }

  protected updateBehaviors(deltaTime: number): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled) {
        behavior.update(deltaTime);
      }
    }
  }

  protected renderBehaviors(ctx: CanvasRenderingContext2D): void {
    for (const behavior of this.behaviors) {
      if (behavior.enabled && behavior.render) {
        behavior.render(ctx);
      }
    }
  }
}
