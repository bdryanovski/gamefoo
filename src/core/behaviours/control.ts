import type Entity from '../../entities/entity';
import { Behaviour } from '../behaviour';
import type Input from '../input';

/**
 * Keyboard-driven movement behaviour for a {@link Entity}.
 *
 * `Control` reads the current keyboard state from an {@link Input}
 * instance every frame and translates WASD / arrow-key presses into
 * entity position changes. Diagonal movement is normalised so the
 * entity moves at a consistent speed in all directions.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Attaching to a player
 * ```ts
 * import { Control, Input, Player } from "gamefoo";
 *
 * const input  = new Input();
 * const player = new Player("hero", 400, 300, 50, 50);
 *
 * player.attachBehaviour(new Control(player, input));
 * ```
 *
 * @see {@link Input}     — the polling input manager consumed by this behaviour
 * @see {@link Behaviour} — abstract base class
 */
export class Control extends Behaviour<Entity> {
  /** @inheritDoc */
  readonly type = 'control';

  /** The input manager to poll each frame. */
  private input: Input;

  /**
   * Movement speed in pixels per second.
   *
   * @defaultValue `500`
   */
  private speed: number = 500;

  /**
   * Creates a new keyboard control behaviour.
   *
   * @param owner - The game object entity whose position will be updated.
   * @param input - The {@link Input} instance to read key state from.
   */
  constructor(owner: Entity, input: Input) {
    super(owner);
    this.input = input;
  }

  /**
   * Reads the current key state and moves the owner entity.
   *
   * Supported keys: `W` / `ArrowUp`, `S` / `ArrowDown`,
   * `A` / `ArrowLeft`, `D` / `ArrowRight`.
   *
   * Diagonal input is normalised so the effective speed remains
   * constant regardless of direction.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  update(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    if (this.input.isKeyDown('a') || this.input.isKeyDown('arrowleft')) dx -= 1;
    if (this.input.isKeyDown('d') || this.input.isKeyDown('arrowright'))
      dx += 1;
    if (this.input.isKeyDown('w') || this.input.isKeyDown('arrowup')) dy -= 1;
    if (this.input.isKeyDown('s') || this.input.isKeyDown('arrowdown')) dy += 1;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      this.owner.x += (dx / len) * this.speed * deltaTime;
      this.owner.y += (dy / len) * this.speed * deltaTime;
    }
  }
}
