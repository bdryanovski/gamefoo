/**
 * Maps raw input state to semantic actions.
 *
 * @category Input
 * @module input/mapper
 */

import type Input from './input';
import type { ActionBinding, GamepadBinding, StandardAction } from './actions';
import type { ControlScheme, DirectionActions } from './schemes/types';

/**
 * Options for {@link InputMapper}.
 */
export interface InputMapperOptions {
  /** Gamepad index to read (0-3). Defaults to 0. */
  readonly gamepadIndex?: number;

  /** Analog stick deadzone (0-1). Defaults to 0.3. */
  readonly deadzone?: number;
}

interface MapperOptions {
  gamepadIndex: number;
  deadzone: number;
}

const DEFAULT_OPTIONS: MapperOptions = {
  gamepadIndex: 0,
  deadzone: 0.3,
};

const STANDARD_DIRECTIONS: DirectionActions<StandardAction> = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
};

type DirectionName = keyof DirectionActions<string>;

/**
 * Provides action-based queries over an {@link Input}.
 *
 * Action edges are synchronized once per input frame, so keyboard, mouse, and
 * gamepad presses all share the same `pressed` and `released` semantics.
 *
 * @example
 * ```ts
 * const actions = defineActions({
 *   left: { keys: ['a', 'arrowleft'] },
 *   right: { keys: ['d', 'arrowright'] },
 *   jump: { keys: ['space'], gamepad: { button: 0 } },
 * });
 *
 * const mapper = new InputMapper(input, {
 *   name: 'Platformer',
 *   actions,
 *   directions: { up: 'jump', down: 'jump', left: 'left', right: 'right' },
 * });
 *
 * input.update();
 * if (mapper.isActionPressed('jump')) player.jump();
 * ```
 */
export class InputMapper<TAction extends string = StandardAction> {
  private readonly input: Input;
  private readonly scheme: ControlScheme<TAction>;
  private readonly options: MapperOptions;

  private frame = -1;
  private active: Map<TAction, boolean> = new Map();
  private previousActive: Map<TAction, boolean> = new Map();
  private consumed: Set<TAction> = new Set();

  constructor(input: Input, scheme: ControlScheme<TAction>, options?: InputMapperOptions) {
    this.input = input;
    this.scheme = scheme;
    this.options = {
      gamepadIndex: options?.gamepadIndex ?? DEFAULT_OPTIONS.gamepadIndex,
      deadzone: options?.deadzone ?? DEFAULT_OPTIONS.deadzone,
    };
  }

  /**
   * Resolves a standard action name or alias to a scheme action.
   */
  private resolve(action: TAction | string): TAction | null {
    if (Object.hasOwn(this.scheme.actions, action)) {
      return action as TAction;
    }
    return this.scheme.aliases?.[action] ?? null;
  }

  /**
   * Reads one action from the current physical input state.
   */
  private read(binding: ActionBinding | undefined): boolean {
    if (!binding) {
      return false;
    }

    if (binding.keys.some((key) => this.input.isKeyDown(key))) {
      return true;
    }

    if (binding.mouse?.some((button) => this.input.isMouseButtonDown(button))) {
      return true;
    }

    return binding.gamepad ? this.readGamepad(binding.gamepad) : false;
  }

  /**
   * Reads a gamepad button or axis binding.
   */
  private readGamepad(binding: GamepadBinding): boolean {
    const gamepad = this.input.getGamepad(this.options.gamepadIndex);
    if (!gamepad) {
      return false;
    }

    if (binding.button !== undefined && gamepad.buttons[binding.button]?.pressed) {
      return true;
    }

    if (binding.axis !== undefined && binding.axisDirection !== undefined) {
      const value = gamepad.axes[binding.axis];
      if (value === undefined) {
        return false;
      }
      return binding.axisDirection > 0
        ? value > this.options.deadzone
        : value < -this.options.deadzone;
    }

    return false;
  }

  /**
   * Refreshes action edges when the input frame advances.
   */
  private syncFrame(): void {
    if (this.frame === this.input.frame) {
      return;
    }

    this.previousActive = this.active;
    this.active = new Map();
    this.consumed.clear();
    this.frame = this.input.frame;

    for (const action of Object.keys(this.scheme.actions) as TAction[]) {
      this.active.set(action, this.read(this.scheme.actions[action]));
    }
  }

  /**
   * Resolves a direction action, falling back to the standard action names.
   */
  private directionAction(name: DirectionName): TAction | null {
    const directions = this.scheme.directions ?? (STANDARD_DIRECTIONS as DirectionActions<TAction>);
    const action = directions[name];
    return Object.hasOwn(this.scheme.actions, action) ? action : null;
  }

  /**
   * Checks whether an action is currently active.
   */
  isAction(action: TAction | string): boolean {
    this.syncFrame();
    const resolved = this.resolve(action);
    return resolved ? (this.active.get(resolved) ?? false) : false;
  }

  /**
   * Checks whether an action became active this frame.
   */
  isActionPressed(action: TAction | string): boolean {
    this.syncFrame();
    const resolved = this.resolve(action);
    if (!resolved || this.consumed.has(resolved)) {
      return false;
    }
    return (this.active.get(resolved) ?? false) && !(this.previousActive.get(resolved) ?? false);
  }

  /**
   * Checks whether an action stopped being active this frame.
   */
  isActionReleased(action: TAction | string): boolean {
    this.syncFrame();
    const resolved = this.resolve(action);
    return resolved
      ? !(this.active.get(resolved) ?? false) && (this.previousActive.get(resolved) ?? false)
      : false;
  }

  /**
   * Consumes an action's press edge for the rest of the current frame.
   *
   * Level queries (`isAction`) still report the action as active until it is
   * released.
   */
  consume(action: TAction | string): void {
    this.syncFrame();
    const resolved = this.resolve(action);
    if (resolved) {
      this.consumed.add(resolved);
    }
  }

  /**
   * Returns the normalized direction from keyboard, gamepad buttons, and the
   * left analog stick.
   */
  getDirection(): { x: number; y: number } {
    const digital = this.getRawDirection();
    const steered = this.applyAnalogStick(digital);
    return normalizeDirection(steered.x, steered.y);
  }

  /**
   * Returns a digital direction with each component set to -1, 0, or 1.
   */
  getRawDirection(): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
    let x: -1 | 0 | 1 = 0;
    let y: -1 | 0 | 1 = 0;

    const left = this.directionAction('left');
    const right = this.directionAction('right');
    const up = this.directionAction('up');
    const down = this.directionAction('down');

    if (left && this.isAction(left)) {
      x = -1;
    } else if (right && this.isAction(right)) {
      x = 1;
    }

    if (up && this.isAction(up)) {
      y = -1;
    } else if (down && this.isAction(down)) {
      y = 1;
    }

    return { x, y };
  }

  /**
   * Checks whether any direction action is active.
   */
  hasDirectionInput(): boolean {
    const names: readonly DirectionName[] = ['up', 'down', 'left', 'right'];
    return names.some((name) => {
      const action = this.directionAction(name);
      return action !== null && this.isAction(action);
    });
  }

  /**
   * Returns the current scheme.
   */
  getScheme(): ControlScheme<TAction> {
    return this.scheme;
  }

  /**
   * Returns the analog stick deadzone.
   */
  getDeadzone(): number {
    return this.options.deadzone;
  }

  /**
   * Updates the analog stick deadzone.
   */
  setDeadzone(value: number): void {
    this.options.deadzone = clamp(value);
  }

  /**
   * Returns the gamepad index used by this mapper.
   */
  getGamepadIndex(): number {
    return this.options.gamepadIndex;
  }

  /**
   * Updates the gamepad index.
   */
  setGamepadIndex(index: number): void {
    this.options.gamepadIndex = Math.max(0, Math.min(3, Math.trunc(index)));
  }

  private applyAnalogStick(digital: { x: number; y: number }): { x: number; y: number } {
    const gamepad = this.input.getGamepad(this.options.gamepadIndex);
    if (!gamepad) {
      return digital;
    }

    const axisX = gamepad.axes[0] ?? 0;
    const axisY = gamepad.axes[1] ?? 0;

    return {
      x: Math.abs(axisX) > this.options.deadzone ? axisX : digital.x,
      y: Math.abs(axisY) > this.options.deadzone ? axisY : digital.y,
    };
  }
}

/**
 * Clamps a deadzone to the valid 0-1 range.
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Scales a direction down when its magnitude would exceed 1.
 */
function normalizeDirection(x: number, y: number): { x: number; y: number } {
  const magnitude = Math.sqrt(x * x + y * y);
  return magnitude > 1 ? { x: x / magnitude, y: y / magnitude } : { x, y };
}
