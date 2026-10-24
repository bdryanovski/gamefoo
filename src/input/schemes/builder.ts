/**
 * Helpers for defining and extending control schemes.
 *
 * @category Input
 * @module input/schemes/builder
 */

import type { ControlScheme, SchemeOverrides } from './types';

/**
 * Declares a control scheme and preserves its action-name types.
 *
 * The generic is optional when TypeScript can infer the action names from the
 * `actions` object. Pass it explicitly when a scheme has no actions yet or
 * when direction mappings should be checked against a larger action union.
 *
 * @example
 * ```ts
 * const controls = defineScheme({
 *   name: 'Default',
 *   actions: {
 *     UP: binding(['w', 'arrowup']),
 *     DOWN: binding(['s', 'arrowdown']),
 *     PRIMARY: binding(['space'], { button: 0 }),
 *   },
 *   directions: { up: 'UP', down: 'DOWN', left: 'UP', right: 'DOWN' },
 * });
 * ```
 */
export function defineScheme<TAction extends string>(
  scheme: ControlScheme<TAction>,
): ControlScheme<TAction> {
  return scheme;
}

/**
 * Creates a new scheme by merging overrides into an existing scheme.
 *
 * Bindings and aliases from the override replace their base counterparts.
 * Actions not mentioned in the override are kept unchanged.
 *
 * @example
 * ```ts
 * const custom = extendScheme(NES_CONTROLS, {
 *   name: 'NES (Jump on Space)',
 *   actions: {
 *     PRIMARY: binding(['space'], { button: 0 }),
 *   },
 *   aliases: { JUMP: 'PRIMARY' },
 * });
 * ```
 */
export function extendScheme<TAction extends string>(
  base: ControlScheme<TAction>,
  overrides: SchemeOverrides<TAction>,
): ControlScheme<TAction> {
  return {
    name: overrides.name ?? `${base.name} (Custom)`,
    actions: {
      ...base.actions,
      ...overrides.actions,
    },
    directions: overrides.directions ?? base.directions,
    aliases: {
      ...base.aliases,
      ...overrides.aliases,
    },
  };
}
