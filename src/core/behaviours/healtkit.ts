import type DynamicEntity from "../../entities/dynamic_entity";
import { Behaviour } from "../behaviour";

/**
 * Health-tracking behaviour for a {@link DynamicEntity}.
 *
 * `HealthKit` manages a current and maximum HP value, provides damage
 * and healing methods, and exposes queries for health percentage and
 * death state.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Attaching to a player
 * ```ts
 * import { HealthKit, Player } from "gamefoo";
 *
 * const player = new Player("hero", 400, 300, 50, 50);
 * player.attachBehaviour(new HealthKit(player, 100));
 *
 * player.healthkit?.takeDamage(25);
 * console.log(player.healthkit?.getHealth());        // 75
 * console.log(player.healthkit?.getHealthPercent());  // 0.75
 * ```
 *
 * @example Custom max HP
 * ```ts
 * const hk = new HealthKit(entity, 50, 200);
 * // starts at 50 HP, max is 200
 * hk.heal(999);
 * console.log(hk.getHealth()); // 200 (clamped to max)
 * ```
 *
 * @see {@link Behaviour} — abstract base class
 * @see {@link Player}    — has a convenience getter for this behaviour
 */
export class HealthKit extends Behaviour<DynamicEntity> {
  /** @inheritDoc */
  readonly type = "healthkit";

  /** Current health points. */
  private health: number;

  /** Maximum health points (healing cap). */
  private maxHP: number;

  /**
   * Creates a new health behaviour.
   *
   * @param owner  - The entity this behaviour is attached to.
   * @param health - Starting health value.
   * @param maxHP  - Maximum health cap. If omitted, defaults to the
   *   initial `health` value.
   */
  constructor(owner: DynamicEntity, health: number, maxHP?: number) {
    super(owner);
    this.health = health;
    this.maxHP = maxHP || health;
  }

  /**
   * No-op — health does not change passively each frame.
   *
   * @param _deltaTime - Unused.
   */
  update(_deltaTime: number): void {}

  /**
   * Reduces health by the given amount, clamping at zero.
   *
   * @param amount - Damage to apply (positive number).
   *
   * @example
   * ```ts
   * healthkit.takeDamage(30);
   * ```
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  /**
   * Increases health by the given amount, clamping at
   * {@link HealthKit.maxHP}.
   *
   * @param amount - Health to restore (positive number).
   *
   * @example
   * ```ts
   * healthkit.heal(50);
   * ```
   */
  heal(amount: number): void {
    this.health = Math.min(this.maxHP, this.health + amount);
  }

  /**
   * Returns the current health value.
   *
   * @returns Current HP.
   */
  getHealth(): number {
    return this.health;
  }

  /**
   * Returns the maximum health cap.
   *
   * @returns Maximum HP.
   */
  getMaxHealth(): number {
    return this.maxHP;
  }

  /**
   * Updates the maximum health cap.
   *
   * If the current health exceeds the new cap it is clamped down.
   *
   * @param value - The new maximum HP.
   *
   * @example
   * ```ts
   * healthkit.setMaxHealth(150);
   * ```
   */
  setMaxHealth(value: number): void {
    this.maxHP = value;
    if (this.health > this.maxHP) {
      this.health = this.maxHP;
    }
  }

  /**
   * Whether the entity is dead (health is zero or below).
   *
   * @returns `true` if `health <= 0`.
   *
   * @example
   * ```ts
   * if (healthkit.isDead()) {
   *   entity.destroy();
   * }
   * ```
   */
  isDead(): boolean {
    return this.health <= 0;
  }

  /**
   * Returns health as a normalised ratio in the range `[0, 1]`.
   *
   * Useful for rendering health bars.
   *
   * @returns `health / maxHP`, or `0` if `maxHP` is zero.
   *
   * @example
   * ```ts
   * const barWidth = 100 * healthkit.getHealthPercent();
   * ctx.fillRect(x, y, barWidth, 8);
   * ```
   */
  getHealthPercent(): number {
    return this.maxHP > 0 ? this.health / this.maxHP : 0;
  }
}
