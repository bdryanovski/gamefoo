import type { Control } from '../core/behaviours/control';
import type { HealthKit } from '../core/behaviours/healtkit';
import DynamicEntity from './dynamic_entity';

/**
 * Default player entity with convenience accessors for common
 * behaviours.
 *
 * `Player` extends {@link DynamicEntity} and automatically delegates
 * its {@link Player.update | update} and {@link Player.render | render}
 * calls to all attached {@link Behaviour | behaviours}. It also
 * provides typed getters for the {@link Control} and
 * {@link HealthKit} behaviours so game code can access them without
 * manual casting.
 *
 * Subclass `Player` and implement {@link Entity.render | render} to provide
 * custom visuals. The {@link Entity.update | update} lifecycle (apply velocity,
 * tick behaviours) is handled automatically by {@link DynamicEntity}.
 *
 * @category Entities
 * @since 0.1.0
 *
 * @example Subclassing (required — Player is abstract)
 * ```ts
 * import { Player, Control, HealthKit, Input, SpriteRender } from "gamefoo";
 *
 * class Hero extends Player {
 *   render(ctx: RenderContext) {
 *     this.renderBehaviours(ctx); // SpriteRender handles drawing
 *   }
 * }
 *
 * const hero = new Hero("hero", 400, 300, 50, 50);
 * hero.attachBehaviour(new Control(hero, new Input()));
 * hero.attachBehaviour(new HealthKit(hero, 100));
 * ```
 *
 * @example Subclassing for custom rendering
 * ```ts
 * class Knight extends Player {
 *   constructor(x: number, y: number) {
 *     super("knight", x, y, 48, 48);
 *   }
 *
 *   override render(ctx: CanvasRenderingContext2D) {
 *     ctx.fillStyle = "#c0c0c0";
 *     ctx.fillRect(this.x, this.y, 48, 48);
 *     this.renderBehaviours(ctx);
 *   }
 * }
 * ```
 *
 * @see {@link DynamicEntity} — parent class (velocity, speed)
 * @see {@link Control}       — keyboard movement behaviour
 * @see {@link HealthKit}     — health-tracking behaviour
 */
export default abstract class Player extends DynamicEntity {
  /**
   * Convenience getter for the attached {@link Control} behaviour.
   *
   * @returns The `Control` instance, or `undefined` if not attached.
   */
  public get control(): Control | undefined {
    return this.getBehaviour<Control>('control');
  }

  /**
   * Convenience getter for the attached {@link HealthKit} behaviour.
   *
   * @returns The `HealthKit` instance, or `undefined` if not attached.
   */
  public get healthkit(): HealthKit | undefined {
    return this.getBehaviour<HealthKit>('healthkit');
  }

  /**
   * Advances all attached behaviours.
   *
   * @inheritDoc
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  public override update(deltaTime: number): void {
    this.updateBehaviours(deltaTime);
  }
}
