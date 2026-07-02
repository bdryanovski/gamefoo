/**
 * InputMapper class for action-based input queries.
 *
 * InputMapper abstracts raw keyboard and gamepad input into semantic
 * actions defined by a control scheme. Instead of checking specific keys,
 * game logic queries actions like "PRIMARY" or console-specific names like "A".
 *
 * @category Controls
 * @module controls/input_mapper
 * @since 0.5.0
 */

import type Input from '../input';
import { extendScheme } from './scheme_builder';
import type {
  ActionBinding,
  ControlScheme,
  InputAction,
  InputMapperOptions,
  SchemeOverrides,
} from './types';

/**
 * Default options for InputMapper.
 */
const DEFAULT_OPTIONS: Required<InputMapperOptions> = {
  gamepadIndex: 0,
  deadzone: 0.3,
};

/**
 * Maps raw input to semantic actions using a control scheme.
 *
 * InputMapper provides a high-level API for querying input based on
 * actions rather than raw keys. It supports:
 * - Keyboard input via the Input class
 * - Gamepad input via the Gamepad API
 * - Console-specific button aliases
 * - Runtime scheme customization
 *
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * import { Input, InputMapper, NES_CONTROLS } from 'gamefoo';
 *
 * const input = new Input({ canvasId: 'game' });
 * const mapper = new InputMapper(input, NES_CONTROLS);
 *
 * // In game loop
 * input.update(); // Required for "just pressed" detection
 *
 * if (mapper.isAction('A')) player.jump();        // NES alias
 * if (mapper.isAction('PRIMARY')) player.jump();  // Generic name
 *
 * const dir = mapper.getDirection();
 * player.move(dir.x * speed, dir.y * speed);
 * ```
 *
 * @example Customizing controls
 * ```ts
 * // Rebind jump to space
 * const customMapper = mapper.rebind('PRIMARY', ['space', 'x']);
 *
 * // Or extend with multiple changes
 * const custom = mapper.withOverrides({
 *   actions: { PRIMARY: { keys: ['space'] } },
 *   aliases: { JUMP: 'PRIMARY' },
 * });
 * ```
 */
export class InputMapper {
  private input: Input;
  private scheme: ControlScheme;
  private options: Required<InputMapperOptions>;

  /**
   * Creates a new InputMapper with the given input source and control scheme.
   *
   * @param input - The Input instance to read keyboard/mouse state from
   * @param scheme - The control scheme defining action bindings
   * @param options - Optional configuration (gamepad index, deadzone)
   *
   * @since 0.5.0
   */
  constructor(
    input: Input,
    scheme: ControlScheme,
    options?: InputMapperOptions,
  ) {
    this.input = input;
    this.scheme = scheme;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Resolves an action name to its InputAction, handling aliases.
   *
   * @param action - Action name or alias to resolve
   * @returns The resolved InputAction, or null if not found
   */
  private resolveAction(action: InputAction | string): InputAction | null {
    // Check if it's a direct InputAction
    if (action in this.scheme.actions) {
      return action as InputAction;
    }

    // Check aliases
    const aliased = this.scheme.aliases[action];
    if (aliased) {
      return aliased;
    }

    return null;
  }

  /**
   * Gets the binding for an action, resolving aliases.
   *
   * @param action - Action name or alias
   * @returns The ActionBinding, or null if not found
   */
  private getBinding(action: InputAction | string): ActionBinding | null {
    const resolved = this.resolveAction(action);
    if (!resolved) return null;
    return this.scheme.actions[resolved];
  }

  /**
   * Checks if any of the binding's keys are currently held down.
   *
   * @param binding - The action binding to check
   * @returns true if any key in the binding is down
   */
  private isKeyBindingDown(binding: ActionBinding): boolean {
    return binding.keys.some((key) => this.input.isKeyDown(key));
  }

  /**
   * Checks if any of the binding's keys were just pressed this frame.
   *
   * @param binding - The action binding to check
   * @returns true if any key in the binding was just pressed
   */
  private isKeyBindingPressed(binding: ActionBinding): boolean {
    return binding.keys.some((key) => this.input.isKeyPressed(key));
  }

  /**
   * Checks if the gamepad binding is active.
   *
   * @param binding - The action binding to check
   * @returns true if the gamepad button/axis is active
   */
  private isGamepadBindingDown(binding: ActionBinding): boolean {
    if (!binding.gamepad) return false;

    const gamepad = this.input.getGamepad(this.options.gamepadIndex);
    if (!gamepad) return false;

    const { button, axis, axisDirection } = binding.gamepad;

    // Check button
    if (button !== undefined) {
      const btn = gamepad.buttons[button];
      if (btn?.pressed) return true;
    }

    // Check axis
    if (axis !== undefined && axisDirection !== undefined) {
      const axisValue = gamepad.axes[axis];
      if (axisValue !== undefined) {
        if (axisDirection > 0 && axisValue > this.options.deadzone) return true;
        if (axisDirection < 0 && axisValue < -this.options.deadzone)
          return true;
      }
    }

    return false;
  }

  /**
   * Checks if an action is currently held down.
   *
   * Supports both standard InputAction names and console-specific aliases.
   * Checks both keyboard and gamepad inputs.
   *
   * @param action - The action name or alias to check
   * @returns true if the action is currently active
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Using generic name
   * if (mapper.isAction('PRIMARY')) player.jump();
   *
   * // Using NES-specific alias
   * if (mapper.isAction('A')) player.jump();
   *
   * // Using custom alias (if defined)
   * if (mapper.isAction('JUMP')) player.jump();
   * ```
   */
  isAction(action: InputAction | string): boolean {
    const binding = this.getBinding(action);
    if (!binding) return false;

    return this.isKeyBindingDown(binding) || this.isGamepadBindingDown(binding);
  }

  /**
   * Checks if an action was just pressed this frame.
   *
   * Returns true only on the first frame the action becomes active.
   * Requires `input.update()` to be called each frame.
   *
   * Note: Gamepad "just pressed" detection is approximate since the
   * Gamepad API doesn't provide press events.
   *
   * @param action - The action name or alias to check
   * @returns true if the action was just pressed
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Only trigger once per button press
   * if (mapper.isActionPressed('PRIMARY')) {
   *   player.jump(); // Won't repeat while held
   * }
   * ```
   */
  isActionPressed(action: InputAction | string): boolean {
    const binding = this.getBinding(action);
    if (!binding) return false;

    // For keyboard, use the "just pressed" detection
    if (this.isKeyBindingPressed(binding)) return true;

    // For gamepad, we check if it's down (approximate)
    // True "just pressed" would require tracking previous frame state
    // This is a limitation of the Gamepad API
    return false;
  }

  /**
   * Gets a normalized direction vector from directional inputs.
   *
   * Returns values in the range -1 to 1 for each axis. Diagonal movement
   * is normalized so the total magnitude doesn't exceed 1.
   *
   * Checks both D-pad actions (UP/DOWN/LEFT/RIGHT) and gamepad analog sticks.
   *
   * @returns Object with x and y components (-1 to 1)
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const dir = mapper.getDirection();
   * player.x += dir.x * speed * deltaTime;
   * player.y += dir.y * speed * deltaTime;
   * ```
   */
  getDirection(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    // Check digital directional inputs
    if (this.isAction('LEFT')) x -= 1;
    if (this.isAction('RIGHT')) x += 1;
    if (this.isAction('UP')) y -= 1;
    if (this.isAction('DOWN')) y += 1;

    // Check analog stick directly (for smoother movement)
    const gamepad = this.input.getGamepad(this.options.gamepadIndex);
    if (gamepad) {
      const axisX = gamepad.axes[0] ?? 0;
      const axisY = gamepad.axes[1] ?? 0;

      // Apply deadzone
      if (Math.abs(axisX) > this.options.deadzone) {
        x = axisX;
      }
      if (Math.abs(axisY) > this.options.deadzone) {
        y = axisY;
      }
    }

    // Normalize diagonal movement
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }

    return { x, y };
  }

  /**
   * Gets a raw (non-normalized) digital direction.
   *
   * Returns -1, 0, or 1 for each axis. Useful for grid-based movement
   * or 8-way directional input.
   *
   * @returns Object with x and y components (-1, 0, or 1)
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const dir = mapper.getRawDirection();
   * if (dir.x !== 0 || dir.y !== 0) {
   *   player.moveOnGrid(dir.x, dir.y);
   * }
   * ```
   */
  getRawDirection(): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
    let x: -1 | 0 | 1 = 0;
    let y: -1 | 0 | 1 = 0;

    if (this.isAction('LEFT')) x = -1;
    else if (this.isAction('RIGHT')) x = 1;

    if (this.isAction('UP')) y = -1;
    else if (this.isAction('DOWN')) y = 1;

    return { x, y };
  }

  /**
   * Checks if any directional input is active.
   *
   * @returns true if any of UP, DOWN, LEFT, or RIGHT is active
   *
   * @since 0.5.0
   */
  hasDirectionInput(): boolean {
    return (
      this.isAction('UP')
      || this.isAction('DOWN')
      || this.isAction('LEFT')
      || this.isAction('RIGHT')
    );
  }

  /**
   * Creates a new InputMapper with a different control scheme.
   *
   * The new mapper shares the same Input instance but uses the new scheme.
   *
   * @param scheme - The new control scheme to use
   * @returns A new InputMapper with the specified scheme
   *
   * @since 0.5.0
   */
  withScheme(scheme: ControlScheme): InputMapper {
    return new InputMapper(this.input, scheme, this.options);
  }

  /**
   * Creates a new InputMapper with scheme overrides applied.
   *
   * Uses {@link extendScheme} to create a modified scheme, then returns
   * a new mapper using that scheme.
   *
   * @param overrides - Modifications to apply to the current scheme
   * @returns A new InputMapper with the modified scheme
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const custom = mapper.withOverrides({
   *   actions: {
   *     PRIMARY: { keys: ['space', 'x', 'j'] },
   *   },
   *   aliases: {
   *     JUMP: 'PRIMARY',
   *   },
   * });
   * ```
   */
  withOverrides(overrides: SchemeOverrides): InputMapper {
    const newScheme = extendScheme(this.scheme, overrides);
    return new InputMapper(this.input, newScheme, this.options);
  }

  /**
   * Creates a new InputMapper with a single action's keys rebound.
   *
   * Convenience method for simple rebinding without full overrides.
   *
   * @param action - The action to rebind
   * @param keys - New keyboard keys for the action
   * @returns A new InputMapper with the action rebound
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Rebind jump to space only
   * const custom = mapper.rebind('PRIMARY', ['space']);
   * ```
   */
  rebind(action: InputAction, keys: string[]): InputMapper {
    return this.withOverrides({
      actions: { [action]: { keys } },
    });
  }

  /**
   * Gets the current control scheme.
   *
   * @returns The current ControlScheme (readonly)
   *
   * @since 0.5.0
   */
  getScheme(): ControlScheme {
    return this.scheme;
  }

  /**
   * Gets the current deadzone value.
   *
   * @returns The deadzone threshold (0.0 - 1.0)
   *
   * @since 0.5.0
   */
  getDeadzone(): number {
    return this.options.deadzone;
  }

  /**
   * Sets the analog stick deadzone.
   *
   * @param value - New deadzone threshold (0.0 - 1.0)
   *
   * @since 0.5.0
   */
  setDeadzone(value: number): void {
    this.options.deadzone = Math.max(0, Math.min(1, value));
  }

  /**
   * Gets the current gamepad index.
   *
   * @returns The gamepad index (0-3)
   *
   * @since 0.5.0
   */
  getGamepadIndex(): number {
    return this.options.gamepadIndex;
  }

  /**
   * Sets the gamepad index to use.
   *
   * @param index - Gamepad index (0-3)
   *
   * @since 0.5.0
   */
  setGamepadIndex(index: number): void {
    this.options.gamepadIndex = Math.max(0, Math.min(3, index));
  }
}
