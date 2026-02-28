import type { Control } from "../core/behaviours/control";
import type { HealthKit } from "../core/behaviours/healtkit";
import DynamicEntity from "./dynamic_entity";

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
 * Subclass `Player` to customise rendering, add game-specific logic,
 * or bind additional behaviours.
 *
 * @category Entities
 * @since 0.1.0
 *
 * @example Basic usage
 * ```ts
 * import { Player, Control, HealthKit, Input } from "gamefoo";
 *
 * const player = new Player("hero", 400, 300, 50, 50);
 *
 * player.attachBehaviour(new Control(player, new Input()));
 * player.attachBehaviour(new HealthKit(player, 100));
 *
 * player.control?.enabled;           // true
 * player.healthkit?.getHealth();      // 100
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
export default class Player extends DynamicEntity {
  /**
   * Convenience getter for the attached {@link Control} behaviour.
   *
   * @returns The `Control` instance, or `undefined` if not attached.
   */
  get control(): Control | undefined {
    return this.getBehaviour<Control>("control");
  }

  /**
   * Convenience getter for the attached {@link HealthKit} behaviour.
   *
   * @returns The `HealthKit` instance, or `undefined` if not attached.
   */
  get healthkit(): HealthKit | undefined {
    return this.getBehaviour<HealthKit>("healthkit");
  }

  /**
   * Advances all attached behaviours.
   *
   * @inheritDoc
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  update(deltaTime: number): void {
    this.updateBehaviours(deltaTime);
  }

  /**
   * Draws a default blue rectangle and then renders all attached
   * behaviours (e.g. sprite overlays, health bars).
   *
   * Override this in a subclass for custom visuals.
   *
   * @inheritDoc
   * @param ctx - The canvas 2-D rendering context.
   */
  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
    this.renderBehaviours(ctx);
  }
}
