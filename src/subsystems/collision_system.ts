import World from '../core/world';
import type { SubSystem } from './types';

/**
 * CollisionSystem is responsible for detecting collisions between game objects.
 * It uses the World class to manage and detect collisions based on registered collidable objects.
 *
 * @since 0.2.0
 *
 * @category SubSystems
 */
export class CollisionSystem implements SubSystem {
  id = 'collision';
  order = 30;

  private world: World;

  /**
   * Creates a collision subsystem.
   *
   * @param world - Optional external {@link World} instance. When
   *   provided, this world is used for all collision detection.
   *   When omitted, an internal empty world is created (legacy
   *   behaviour for demos that register colliders via the world
   *   returned by this system).
   *
   * @since 0.4.0
   *
   * @example Using a shared world
   * ```ts
   * const world = new World();
   * // Register colliders on `world`, then:
   * engine.use(new CollisionSystem(world));
   * ```
   *
   * @example Legacy (internal world)
   * ```ts
   * engine.use(new CollisionSystem());
   * ```
   */
  constructor(world?: World) {
    this.world = world ?? new World();
  }

  /**
   * Returns the {@link World} instance used by this subsystem.
   *
   * Useful when no external world was provided and callers need to
   * register colliders on the internal world.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const sys = new CollisionSystem();
   * const world = sys.getWorld();
   * entity.attachBehaviour(new Collidable(entity, world, { ... }));
   * ```
   */
  getWorld(): World {
    return this.world;
  }

  update() {
    this.world.detect();
  }
}
