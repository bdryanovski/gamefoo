/**
 * Type definitions for the control scheme system.
 *
 * This module provides interfaces for defining console-specific control
 * schemes with keyboard and gamepad bindings. Control schemes map physical
 * inputs to semantic actions that game logic can query.
 *
 * @category Controls
 * @module controls/types
 * @since 0.5.0
 */

/**
 * Standard input actions used across all control schemes.
 *
 * These are semantic action names that abstract physical button/key presses.
 * Games should query these actions rather than raw keys for portability.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Instead of checking raw keys:
 * if (input.isKeyDown('x')) player.jump();
 *
 * // Check semantic actions:
 * if (mapper.isAction('PRIMARY')) player.jump();
 * // Or use console-specific alias:
 * if (mapper.isAction('A')) player.jump();
 * ```
 */
export type InputAction =
  // Directional inputs
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  // Face buttons (generic names)
  | 'PRIMARY' // Main action (jump, confirm) - A on Nintendo, X on PlayStation
  | 'SECONDARY' // Secondary action (cancel, attack) - B on Nintendo, O on PlayStation
  | 'TERTIARY' // Third button - X on Nintendo, Square on PlayStation
  | 'QUATERNARY' // Fourth button - Y on Nintendo, Triangle on PlayStation
  // System buttons
  | 'START'
  | 'SELECT'
  | 'MENU' // Pause/options menu (usually Escape)
  // Shoulder buttons and triggers
  | 'L1'
  | 'R1'
  | 'L2'
  | 'R2'
  // Analog stick clicks
  | 'L3'
  | 'R3'
  // N64 C-buttons (unique to N64 controller)
  | 'C_UP'
  | 'C_DOWN'
  | 'C_LEFT'
  | 'C_RIGHT';

/**
 * Gamepad button/axis binding configuration.
 *
 * Uses the W3C Standard Gamepad API mapping:
 * @see {@link https://w3c.github.io/gamepad/#remapping}
 *
 * @since 0.5.0
 *
 * @example Button binding
 * ```ts
 * // A button (index 0)
 * const aButton: GamepadBinding = { button: 0 };
 * ```
 *
 * @example Axis binding (for D-pad via analog stick)
 * ```ts
 * // Left stick up
 * const up: GamepadBinding = { axis: 1, axisDirection: -1 };
 * // Left stick right
 * const right: GamepadBinding = { axis: 0, axisDirection: 1 };
 * ```
 */
export interface GamepadBinding {
  /**
   * Button index (0-16 in standard mapping).
   *
   * Common indices:
   * - 0: A/Cross
   * - 1: B/Circle
   * - 2: X/Square
   * - 3: Y/Triangle
   * - 8: Select/Back
   * - 9: Start
   * - 12-15: D-pad (Up, Down, Left, Right)
   */
  button?: number;

  /**
   * Axis index (0-3 in standard mapping).
   *
   * Standard axes:
   * - 0: Left stick X (-1 left, +1 right)
   * - 1: Left stick Y (-1 up, +1 down)
   * - 2: Right stick X
   * - 3: Right stick Y
   */
  axis?: number;

  /**
   * Direction for axis-based inputs.
   *
   * - `1` for positive direction (right, down)
   * - `-1` for negative direction (left, up)
   */
  axisDirection?: 1 | -1;
}

/**
 * Complete binding for a single action, combining keyboard and gamepad inputs.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const jumpBinding: ActionBinding = {
 *   keys: ['x', 'space'],           // X or Space on keyboard
 *   gamepad: { button: 0 },         // A button on gamepad
 * };
 * ```
 */
export interface ActionBinding {
  /**
   * Keyboard keys that trigger this action.
   *
   * Uses {@link KeyboardEvent.key} values (lowercased).
   * Multiple keys allow alternative bindings.
   *
   * @example `['x', 'j', 'space']`
   */
  readonly keys: readonly string[];

  /**
   * Optional gamepad binding for this action.
   */
  readonly gamepad?: GamepadBinding;
}

/**
 * A complete control scheme with all action bindings and aliases.
 *
 * Control schemes define how physical inputs map to game actions for a
 * specific console or input style. Each scheme includes:
 * - Bindings for all standard {@link InputAction} values
 * - Console-specific aliases (e.g., 'A' -> 'PRIMARY' for NES)
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const myScheme: ControlScheme = {
 *   name: 'Custom',
 *   actions: {
 *     UP: { keys: ['w', 'arrowup'], gamepad: { button: 12 } },
 *     PRIMARY: { keys: ['space'], gamepad: { button: 0 } },
 *     // ... other actions
 *   },
 *   aliases: {
 *     JUMP: 'PRIMARY',
 *     FIRE: 'SECONDARY',
 *   },
 * };
 * ```
 */
export interface ControlScheme {
  /**
   * Display name of the control scheme.
   *
   * @example `'NES'`, `'PICO-8'`, `'Default (WASD)'`
   */
  readonly name: string;

  /**
   * Action bindings for all standard input actions.
   *
   * Every {@link InputAction} must have a binding, even if empty
   * (use `{ keys: [] }` for unsupported actions).
   */
  readonly actions: Readonly<Record<InputAction, ActionBinding>>;

  /**
   * Console-specific button name aliases.
   *
   * Maps custom names to standard {@link InputAction} values,
   * allowing games to use console-specific terminology.
   *
   * @example NES aliases
   * ```ts
   * aliases: {
   *   A: 'PRIMARY',      // NES A button
   *   B: 'SECONDARY',    // NES B button
   * }
   * ```
   *
   * @example PlayStation aliases
   * ```ts
   * aliases: {
   *   CROSS: 'PRIMARY',
   *   CIRCLE: 'SECONDARY',
   *   SQUARE: 'TERTIARY',
   *   TRIANGLE: 'QUATERNARY',
   * }
   * ```
   */
  readonly aliases: Readonly<Record<string, InputAction>>;
}

/**
 * Options for configuring an {@link InputMapper} instance.
 *
 * @since 0.5.0
 */
export interface InputMapperOptions {
  /**
   * Index of the gamepad to use (0-3).
   *
   * @defaultValue `0` (first connected gamepad)
   */
  gamepadIndex?: number;

  /**
   * Analog stick deadzone threshold (0.0 - 1.0).
   *
   * Axis values below this threshold are treated as zero.
   * Helps prevent drift from analog sticks at rest.
   *
   * @defaultValue `0.3`
   */
  deadzone?: number;
}

/**
 * Options for customizing or extending an existing control scheme.
 *
 * Used with {@link extendScheme} to create derived schemes with
 * modified bindings or additional aliases.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const overrides: SchemeOverrides = {
 *   name: 'NES (Custom)',
 *   actions: {
 *     PRIMARY: { keys: ['space', 'x'] },  // Override jump to include space
 *   },
 *   aliases: {
 *     JUMP: 'PRIMARY',  // Add custom alias
 *   },
 * };
 *
 * const customScheme = extendScheme(NES_CONTROLS, overrides);
 * ```
 */
export interface SchemeOverrides {
  /**
   * Partial action binding overrides.
   *
   * Only specified actions are modified; others remain unchanged.
   * Within an action, only specified properties are overridden.
   */
  actions?: Partial<Record<InputAction, Partial<ActionBinding>>>;

  /**
   * Additional or replacement aliases.
   *
   * Merged with existing aliases (new values override existing keys).
   */
  aliases?: Record<string, InputAction>;

  /**
   * New name for the derived scheme.
   *
   * If not provided, appends " (Custom)" to the base scheme name.
   */
  name?: string;
}
