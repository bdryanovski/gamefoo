import World from "@/core/world";
import type { SubSystem } from "./types";

/**
 * CollisionSystem is responsible for detecting collisions between game objects.
 * It uses the World class to manage and detect collisions based on registered collidable objects.
 *
 * @since 0.2.0
 *
 * @category SubSystems
 */
export class CollisionSystem implements SubSystem {
  id = "collision";
  order = 30;

  private world = new World();

  update() {
    this.world.detect();
  }
}
