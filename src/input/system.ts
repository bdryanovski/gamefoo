/**
 * Engine subsystem combining raw input with action mapping.
 *
 * @category Input
 * @module input/system
 */

import type { SubSystem } from '../subsystems/types';
import Input, { type InputOptions } from './input';
import { InputMapper, type InputMapperOptions } from './mapper';
import type { StandardAction } from './actions';
import type { ControlScheme } from './schemes/types';

/**
 * Options for {@link InputSystem}.
 */
export interface InputSystemOptions<TAction extends string = StandardAction>
  extends InputOptions, InputMapperOptions {
  /** Control scheme used to map physical input to actions. */
  readonly scheme: ControlScheme<TAction>;
}

/**
 * The recommended input system for games.
 *
 * `InputSystem` owns an {@link Input} primitive and an {@link InputMapper}.
 * Register it with the engine once; it updates early each frame and exposes
 * action-based queries.
 *
 * @example
 * ```ts
 * const input = new InputSystem({
 *   scheme: NES_CONTROLS,
 *   canvasId: 'game',
 * });
 *
 * engine.use(input);
 *
 * if (input.isActionPressed('A')) player.jump();
 * const direction = input.getDirection();
 * ```
 */
export class InputSystem<TAction extends string = StandardAction> implements SubSystem {
  readonly id = 'input';
  readonly order = 0;
  enabled = true;

  /** Raw input state, useful for mouse coordinates or direct key checks. */
  readonly input: Input;

  private actionMapper: InputMapper<TAction>;

  constructor(options: InputSystemOptions<TAction>) {
    const { scheme, gamepadIndex, deadzone, ...inputOptions } = options;
    this.input = new Input(inputOptions);
    this.actionMapper = new InputMapper(this.input, scheme, { gamepadIndex, deadzone });
  }

  /** The current action mapper. */
  get mapper(): InputMapper<TAction> {
    return this.actionMapper;
  }

  /** Advances raw input state for the current frame. */
  update(): void {
    this.input.update();
  }

  /** Checks whether an action is currently active. */
  isAction(action: TAction | string): boolean {
    return this.actionMapper.isAction(action);
  }

  /** Checks whether an action became active this frame. */
  isActionPressed(action: TAction | string): boolean {
    return this.actionMapper.isActionPressed(action);
  }

  /** Checks whether an action stopped being active this frame. */
  isActionReleased(action: TAction | string): boolean {
    return this.actionMapper.isActionReleased(action);
  }

  /** Consumes an action's press edge for the rest of the frame. */
  consume(action: TAction | string): void {
    this.actionMapper.consume(action);
  }

  /** Returns the normalized direction from the current action scheme. */
  getDirection(): { x: number; y: number } {
    return this.actionMapper.getDirection();
  }

  /** Returns a digital direction with components of -1, 0, or 1. */
  getRawDirection(): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
    return this.actionMapper.getRawDirection();
  }

  /** Checks whether any direction action is active. */
  hasDirectionInput(): boolean {
    return this.actionMapper.hasDirectionInput();
  }

  /** Returns the active control scheme. */
  getScheme(): ControlScheme<TAction> {
    return this.actionMapper.getScheme();
  }

  /** Switches to another control scheme. */
  setScheme(scheme: ControlScheme<TAction>): void {
    this.actionMapper = new InputMapper(this.input, scheme, {
      gamepadIndex: this.actionMapper.getGamepadIndex(),
      deadzone: this.actionMapper.getDeadzone(),
    });
  }

  /** Returns the analog stick deadzone. */
  getDeadzone(): number {
    return this.actionMapper.getDeadzone();
  }

  /** Updates the analog stick deadzone. */
  setDeadzone(value: number): void {
    this.actionMapper.setDeadzone(value);
  }

  /** Returns the gamepad index used by this system. */
  getGamepadIndex(): number {
    return this.actionMapper.getGamepadIndex();
  }

  /** Updates the gamepad index. */
  setGamepadIndex(index: number): void {
    this.actionMapper.setGamepadIndex(index);
  }

  /** Removes input listeners. */
  destroy(): void {
    this.input.destroy();
  }
}
