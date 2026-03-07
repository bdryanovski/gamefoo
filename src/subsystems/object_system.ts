import GameObjectRegister from "@/core/game_object_register";
import type { GameObject } from "@/types";
import type { SubSystem } from "./types";

/**
 * ObjectSystem is responsible for managing all non-player game objects within the engine.
 * It maintains a central registry of game objects and delegates per-frame update and render calls to them.
 *
 * @since 0.2.0
 * @category SubSystems
 */
export class ObjectSystem implements SubSystem {
  id = "objects";

  order = 20;

  private objects: GameObjectRegister = new GameObjectRegister();

  constructor(objects: GameObject[] = []) {
    for (const obj of objects) {
      this.objects.register(obj);
    }
  }

  update(deltaTime: number) {
    if (this.objects) {
      console.time("ObjectSystem Update");
      this.objects.updateAll(deltaTime);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.objects) {
      this.objects.renderAll(ctx);
    }
  }
}
