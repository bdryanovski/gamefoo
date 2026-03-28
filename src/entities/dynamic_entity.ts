import type { Vector2 } from '../generic_types';
import Entity from './entity';

/**
 * Abstract entity with built-in velocity and speed, suitable for any
 * game object that moves (players, NPCs, projectiles, etc.).
 *
 * `DynamicEntity` extends {@link Entity} with a {@link Vector2}
 * velocity and a scalar speed, plus getter/setter pairs for each.
 * Subclasses are responsible for applying the velocity to position
 * inside their {@link Entity.update | update} implementation.
 *
 * @category Entities
 * @since 0.1.0
 *
 * @example Subclassing
 * ```ts
 * import { DynamicEntity } from "gamefoo";
 *
 * class Bullet extends DynamicEntity {
 *   constructor(x: number, y: number) {
 *     super("bullet", x, y, 4, 4);
 *     this.setSpeed(600);
 *     this.setVelocity({ x: 1, y: 0 });
 *   }
 *
 *   update(dt: number) {
 *     this.x += this.velocity.x * this.speed * dt;
 *     this.y += this.velocity.y * this.speed * dt;
 *   }
 *
 *   render(ctx: CanvasRenderingContext2D) {
 *     ctx.fillStyle = "#ff0";
 *     ctx.fillRect(this.x, this.y, 4, 4);
 *   }
 * }
 * ```
 *
 * @see {@link Entity} — parent class (identity, transform, behaviours)
 * @see {@link Player} — concrete dynamic entity for the player
 */
export default abstract class DynamicEntity extends Entity {
  /**
   * Directional velocity vector.
   *
   * Represents the normalised (or raw) direction of movement. Multiply
   * by {@link DynamicEntity.speed | speed} and `deltaTime` to get the
   * per-frame displacement.
   *
   * @defaultValue `{ x: 0, y: 0 }`
   */
  protected velocity: Vector2 = { x: 0, y: 0 };

  /**
   * Scalar movement speed in pixels per second.
   *
   * @defaultValue `0`
   */
  protected speed: number = 0;

  /**
   * Replaces the current velocity vector.
   *
   * @param velocity - The new velocity.
   *
   * @example
   * ```ts
   * entity.setVelocity({ x: -1, y: 0 }); // moving left
   * ```
   */
  setVelocity(velocity: Vector2): void {
    this.velocity = velocity;
  }

  /**
   * Returns a **copy** of the current velocity vector.
   *
   * @returns A new {@link Vector2}.
   */
  getVelocity(): Vector2 {
    return { ...this.velocity };
  }

  /**
   * Sets the scalar movement speed.
   *
   * @param speed - Speed in pixels per second.
   *
   * @example
   * ```ts
   * entity.setSpeed(200);
   * ```
   */
  setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * Returns the current movement speed.
   *
   * @returns Speed in pixels per second.
   */
  getSpeed(): number {
    return this.speed;
  }
}
