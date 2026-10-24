/**
 * Control scheme types.
 *
 * A control scheme maps action names to keyboard, mouse, and gamepad
 * bindings. Schemes are generic over their action names, so a game can use
 * the built-in `StandardAction` vocabulary or define its own.
 *
 * @category Input
 * @module input/schemes/types
 */

import type { ActionBinding, StandardAction } from '../actions';

/**
 * Actions used by direction queries such as `getDirection()`.
 *
 * Schemes that use non-standard action names should provide these mappings.
 * Built-in presets map them to `UP`, `DOWN`, `LEFT`, and `RIGHT`.
 */
export interface DirectionActions<TAction extends string = StandardAction> {
  readonly up: TAction;
  readonly down: TAction;
  readonly left: TAction;
  readonly right: TAction;
}

/**
 * A named set of action bindings.
 *
 * Actions omitted from `actions` are treated as unassigned and always return
 * `false`. Built-in presets list every standard action explicitly and use
 * {@link unassignedBinding} where a console has no matching input.
 *
 * @example
 * ```ts
 * const platformer = defineScheme<'moveLeft' | 'moveRight' | 'jump'>({
 *   name: 'Platformer',
 *   actions: {
 *     moveLeft: binding(['a', 'arrowleft']),
 *     moveRight: binding(['d', 'arrowright']),
 *     jump: binding(['space'], { button: 0 }),
 *   },
 *   directions: {
 *     up: 'jump',
 *     down: 'jump',
 *     left: 'moveLeft',
 *     right: 'moveRight',
 *   },
 * });
 * ```
 */
export interface ControlScheme<TAction extends string = StandardAction> {
  /** Display name of the scheme. */
  readonly name: string;

  /** Bindings for the actions supported by this scheme. */
  readonly actions: Readonly<Partial<Record<TAction, ActionBinding>>>;

  /** Actions used by direction queries. */
  readonly directions?: DirectionActions<TAction>;

  /** Alternative action names, such as console-specific button labels. */
  readonly aliases?: Readonly<Record<string, TAction>>;
}

/**
 * Changes applied when extending a control scheme.
 */
export interface SchemeOverrides<TAction extends string = StandardAction> {
  /** New scheme name. Defaults to `<base name> (Custom)`. */
  readonly name?: string;

  /** Action bindings to add or replace. */
  readonly actions?: Readonly<Partial<Record<TAction, ActionBinding>>>;

  /** Replacement direction mappings. */
  readonly directions?: DirectionActions<TAction>;

  /** Aliases to add or replace. */
  readonly aliases?: Readonly<Record<string, TAction>>;
}
