/**
 * Keyboard and gamepad driven movement behaviour for entities.
 *
 * `Control` uses an {@link InputMapper} to read input from a
 * {@link ControlScheme} and translates directional inputs into
 * entity position changes. Diagonal movement is normalised so the
 * entity moves at a consistent speed in all directions.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Basic usage with default controls
 * ```ts
 * import { Control, Input, Player, CONTROL_SCHEMES } from "gamefoo";
 *
 * const input = new Input();
 * const player = new Player("hero", 400, 300, 50, 50);
 *
 * player.attachBehaviour(new Control(player, input));
 * ```
 *
 * @example Using a specific control scheme
 * ```ts
 * import { Control, Input, Player, CONTROL_SCHEMES } from "gamefoo";
 *
 * const input = new Input();
 * const player = new Player("hero", 400, 300, 50, 50);
 *
 * // Use NES-style controls
 * player.attachBehaviour(new Control(player, input, CONTROL_SCHEMES.NES));
 * ```
 *
 * @see {@link Input} — the polling input manager
 * @see {@link InputMapper} — action-based input mapping
 * @see {@link ControlScheme} — control scheme type
 * @see {@link Behaviour} — abstract base class
 */

import type DynamicEntity from '../../entities/dynamic_entity';
import { Behaviour } from '../behaviour';
import { CONTROL_SCHEMES, InputMapper } from '../controls';
import type { ControlScheme } from '../controls/types';
import type Input from '../input';

/**
 * Keyboard and gamepad driven movement behaviour.
 *
 * @since 0.1.0
 */
export class Control extends Behaviour<DynamicEntity> {
  /** @inheritDoc */
  readonly type = 'control';

  /**
   * Input mapper for action-based queries.
   *
   * @since 0.5.0
   */
  private mapper: InputMapper;

  /**
   * Movement speed in pixels per second.
   *
   * @defaultValue `500`
   */
  private speed: number = 500;

  /**
   * Creates a new control behaviour.
   *
   * @param owner - The dynamic entity whose velocity will be updated.
   * @param input - The {@link Input} instance to read input from.
   * @param scheme - The control scheme to use (default: DEFAULT).
   *
   * @since 0.1.0 (scheme parameter added in 0.5.0)
   *
   * @example
   * ```ts
   * // Default controls (WASD + arrows)
   * player.attachBehaviour(new Control(player, input));
   *
   * // NES-style controls
   * player.attachBehaviour(new Control(player, input, CONTROL_SCHEMES.NES));
   *
   * // PICO-8 controls
   * player.attachBehaviour(new Control(player, input, CONTROL_SCHEMES.PICO8));
   * ```
   */
  constructor(
    owner: DynamicEntity,
    input: Input,
    scheme: ControlScheme = CONTROL_SCHEMES.DEFAULT,
  ) {
    super(owner);
    this.mapper = new InputMapper(input, scheme);

    if (owner?.getSpeed()) {
      this.speed = owner.getSpeed();
    }
  }

  /**
   * Reads the current input state and moves the owner entity.
   *
   * Uses the control scheme's directional actions (UP, DOWN, LEFT, RIGHT)
   * to determine movement. Supports both keyboard and gamepad input.
   *
   * Diagonal input is normalised so the effective speed remains
   * constant regardless of direction.
   *
   * @param _deltaTime - Seconds elapsed since the previous frame (unused).
   *
   * @since 0.1.0
   */
  override update(_deltaTime: number): void {
    const dir = this.mapper.getDirection();

    if (dir.x !== 0 || dir.y !== 0) {
      // Direction is already normalized by InputMapper
      this.owner.setVelocity({ x: dir.x, y: dir.y });
      this.owner.setSpeed(this.speed);
    } else {
      // No input — zero out velocity so the entity stops
      this.owner.setVelocity({ x: 0, y: 0 });
    }
  }

  /**
   * Gets the InputMapper for advanced input queries.
   *
   * Use this to check action buttons or access the control scheme.
   *
   * @returns The InputMapper instance
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const control = player.getBehaviour('control') as Control;
   * const mapper = control.getMapper();
   *
   * if (mapper.isAction('PRIMARY')) {
   *   player.jump();
   * }
   * ```
   */
  getMapper(): InputMapper {
    return this.mapper;
  }

  /**
   * Changes the control scheme.
   *
   * @param scheme - The new control scheme to use
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Switch to SNES controls
   * control.setScheme(CONTROL_SCHEMES.SNES);
   * ```
   */
  setScheme(scheme: ControlScheme): void {
    this.mapper = this.mapper.withScheme(scheme);
  }

  /**
   * Gets the current control scheme.
   *
   * @returns The current ControlScheme
   *
   * @since 0.5.0
   */
  getScheme(): ControlScheme {
    return this.mapper.getScheme();
  }

  /**
   * Sets the movement speed.
   *
   * @param speed - Speed in pixels per second
   *
   * @since 0.5.0
   */
  setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * Gets the current movement speed.
   *
   * @returns Speed in pixels per second
   *
   * @since 0.5.0
   */
  getSpeed(): number {
    return this.speed;
  }
}
