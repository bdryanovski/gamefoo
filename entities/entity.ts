import type { Vector2 } from "../types";
import { Behaviour } from "../core/behaviour";

export default abstract class Entity {
  public id: string = "";
  protected position: Vector2 = { x: 0, y: 0 };
  protected size = { width: 0, height: 0 };

  private behaviorMap: Map<string, Behaviour> = new Map();
  private _sortedBehaviors: Behaviour[] | null = null;

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

  constructor(id: string, x: number, y: number, width: number, height: number) {
    this.id = id;
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

  getBehaviour<T extends Behaviour>(key: string): T | undefined {
    return this.behaviorMap.get(key.toLowerCase()) as T | undefined;
  }

  getBehavioursByType<T extends Behaviour>(
    type: new (...args: any[]) => T,
  ): T[] {
    return this.behaviors.filter((b) => b instanceof type) as T[];
  }

  hasBehaviour(key: string): boolean {
    return this.behaviorMap.has(key.toLowerCase());
  }

  attachBehaviour<T extends Behaviour>(behavior: T): T {
    this.behaviorMap.set(behavior.key, behavior);
    this._sortedBehaviors = null; // Invalidate sorted cache

    if (behavior.onAttach) {
      behavior.onAttach();
    }
    return behavior;
  }

  detachBehaviour(key: string): void {
    const behavior = this.behaviorMap.get(key.toLowerCase());
    if (!behavior) return;

    if (behavior.onDetach) {
      behavior.onDetach();
    }
    this.behaviorMap.delete(key.toLowerCase());
    this._sortedBehaviors = null; // Invalidate sorted cache
  }

  private get behaviors(): Behaviour[] {
    if (!this._sortedBehaviors) {
      this._sortedBehaviors = Array.from(this.behaviorMap.values()).sort(
        (a, b) => a.priority - b.priority,
      );
    }
    return this._sortedBehaviors;
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
