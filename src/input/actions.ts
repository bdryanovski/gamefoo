/**
 * Action bindings shared by the input primitive and control schemes.
 *
 * An action is a semantic name such as `jump` or `PRIMARY`. A binding
 * describes which physical inputs trigger that action. Games can use the
 * standard actions below or define their own string-based action names.
 *
 * @category Input
 * @module input/actions
 */

/**
 * Standard action names used by the built-in control schemes.
 *
 * Games are not limited to these names. Use {@link defineActions} with any
 * string keys when a game needs its own action vocabulary.
 */
export const STANDARD_ACTIONS = [
  'UP',
  'DOWN',
  'LEFT',
  'RIGHT',
  'PRIMARY',
  'SECONDARY',
  'TERTIARY',
  'QUATERNARY',
  'START',
  'SELECT',
  'MENU',
  'L1',
  'R1',
  'L2',
  'R2',
  'L3',
  'R3',
  'C_UP',
  'C_DOWN',
  'C_LEFT',
  'C_RIGHT',
] as const;

/**
 * Union of the standard action names.
 */
export type StandardAction = (typeof STANDARD_ACTIONS)[number];

/**
 * Gamepad button or analog-axis binding.
 *
 * Uses the W3C Standard Gamepad layout. A binding is either a button or an
 * axis direction:
 *
 * ```ts
 * { button: 0 }                         // bottom face button
 * { axis: 0, axisDirection: 1 }         // left stick right
 * { axis: 1, axisDirection: -1 }        // left stick up
 * ```
 */
export interface GamepadBinding {
  /** Standard Gamepad button index (0-16). */
  readonly button?: number;

  /** Standard Gamepad axis index (0-3). */
  readonly axis?: number;

  /** Direction required on the axis: `1` positive, `-1` negative. */
  readonly axisDirection?: 1 | -1;
}

/**
 * Physical inputs that trigger an action.
 *
 * Keyboard keys use {@link KeyboardEvent.key} values and are matched
 * case-insensitively. Use an empty `keys` array for an action that only has
 * a gamepad or mouse binding.
 */
export interface ActionBinding {
  /** Keyboard keys that trigger the action. */
  readonly keys: readonly string[];

  /** Optional gamepad button or axis binding. */
  readonly gamepad?: GamepadBinding;

  /** Optional mouse button indices (0 = left, 1 = middle, 2 = right). */
  readonly mouse?: readonly number[];
}

/**
 * A complete map of action names to bindings.
 */
export type ActionMap<TAction extends string = StandardAction> = Readonly<
  Record<TAction, ActionBinding>
>;

/**
 * Creates a binding with no physical inputs.
 *
 * Use it to make unsupported actions explicit in a scheme.
 *
 * @example
 * ```ts
 * const nes = defineScheme({
 *   name: 'NES',
 *   actions: {
 *     PRIMARY: binding(['x', 'j'], { button: 0 }),
 *     L1: unassignedBinding(),
 *     R1: unassignedBinding(),
 *   },
 * });
 * ```
 */
export function unassignedBinding(): ActionBinding {
  return { keys: [] };
}

/**
 * Creates an action binding.
 *
 * @param keys - One key or an array of keys.
 * @param gamepad - Optional gamepad binding.
 * @param mouse - Optional mouse button indices.
 *
 * @example
 * ```ts
 * binding('space');
 * binding(['x', 'j'], { button: 0 });
 * binding([], { axis: 0, axisDirection: 1 }, [0]);
 * ```
 */
export function binding(
  keys: string | readonly string[],
  gamepad?: GamepadBinding,
  mouse?: readonly number[],
): ActionBinding {
  return {
    keys: typeof keys === 'string' ? [keys] : keys,
    gamepad,
    mouse,
  };
}

/**
 * Types an action map without changing it at runtime.
 *
 * @example
 * ```ts
 * const actions = defineActions({
 *   moveUp: { keys: ['w', 'arrowup'] },
 *   jump: { keys: ['space'], gamepad: { button: 0 } },
 * });
 *
 * type GameAction = keyof typeof actions; // 'moveUp' | 'jump'
 * ```
 */
export function defineActions<TAction extends string>(
  actions: ActionMap<TAction>,
): ActionMap<TAction> {
  return actions;
}
