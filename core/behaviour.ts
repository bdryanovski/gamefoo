import type Entity from "../entities/entity";

export abstract class Behaviour<T extends Entity = Entity> {
  protected owner: T;

  abstract readonly type: string;

  public priority: number = 1;

  public enabled: boolean = true;

  constructor(owner: T) {
    this.owner = owner;
  }

  abstract update(deltaTime: number): void;

  render?(ctx: CanvasRenderingContext2D): void;
  onAttach?(): void;
}
