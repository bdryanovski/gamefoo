import type DynamicEntity from "../entities/dynamic_entity";
import type Entity from "../entities/entity";

type GameObject = Entity | DynamicEntity;

export default class GameObjectRegister {
  private objects: Map<string, GameObject> = new Map();

  register(object: GameObject) {
    this.objects.set(object.id, object);
  }

  get(id: string): GameObject | undefined {
    return this.objects.get(id);
  }

  has(id: string): boolean {
    return this.objects.has(id);
  }

  getAll(_filter: () => true): GameObject[] {
    return Array.from(this.objects.values()).filter(_filter);
  }

  updateAll(deltaTime: number): void {
    this.getAll(() => true).forEach((obj) => {
      obj.update(deltaTime);
    });
  }

  renderAll(ctx: CanvasRenderingContext2D): void {
    this.getAll(() => true).forEach((obj) => {
      obj.render(ctx);
    });
  }
}
