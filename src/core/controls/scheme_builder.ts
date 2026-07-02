/**
 * Utility functions for creating and modifying control schemes.
 *
 * These helpers make it easy to define new schemes, extend existing ones,
 * and rebind individual actions at runtime.
 *
 * @category Controls
 * @module controls/scheme_builder
 * @since 0.5.0
 */

import type {
  ActionBinding,
  ControlScheme,
  GamepadBinding,
  InputAction,
  SchemeOverrides,
} from './types';

/**
 * All standard input actions that must be defined in a complete scheme.
 *
 * @internal
 */
const ALL_ACTIONS: readonly InputAction[] = [
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
 * Creates an {@link ActionBinding} from keys and optional gamepad config.
 *
 * This is a convenience helper for defining action bindings with less
 * boilerplate. Accepts a single key string or array of keys.
 *
 * @param keys - Key(s) that trigger this action (single string or array)
 * @param gamepad - Optional gamepad binding configuration
 * @returns A complete ActionBinding object
 *
 * @since 0.5.0
 *
 * @example Single key
 * ```ts
 * binding('space');
 * // => { keys: ['space'], gamepad: undefined }
 * ```
 *
 * @example Multiple keys with gamepad
 * ```ts
 * binding(['x', 'j', 'space'], { button: 0 });
 * // => { keys: ['x', 'j', 'space'], gamepad: { button: 0 } }
 * ```
 *
 * @example Empty binding (for unsupported actions)
 * ```ts
 * binding([]);
 * // => { keys: [], gamepad: undefined }
 * ```
 */
export function binding(
  keys: string | readonly string[],
  gamepad?: GamepadBinding,
): ActionBinding {
  const keyArray = typeof keys === 'string' ? [keys] : keys;
  return {
    keys: keyArray,
    gamepad,
  };
}

/**
 * Creates an unassigned binding for actions not supported by a console.
 *
 * Use this for buttons/actions that don't exist on a particular controller.
 * Convenience alias for `binding([])`.
 *
 * @returns An ActionBinding with empty keys and no gamepad binding
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // NES doesn't have shoulder buttons
 * const scheme = {
 *   L1: unassignedBinding(),
 *   R1: unassignedBinding(),
 *   // ...
 * };
 * ```
 */
export function unassignedBinding(): ActionBinding {
  return { keys: [] };
}

/**
 * Creates a new control scheme by extending an existing one with overrides.
 *
 * This is the primary way to customize control schemes. The base scheme
 * is cloned and modified according to the overrides:
 * - Action bindings are merged (override only specified properties)
 * - Aliases are merged (new aliases override existing ones)
 * - Name is replaced if provided, otherwise " (Custom)" is appended
 *
 * @param base - The scheme to extend
 * @param overrides - Modifications to apply
 * @returns A new ControlScheme with the overrides applied
 *
 * @since 0.5.0
 *
 * @example Override specific keys
 * ```ts
 * const custom = extendScheme(NES_CONTROLS, {
 *   actions: {
 *     PRIMARY: { keys: ['space', 'x'] },  // Add space for jump
 *   },
 * });
 * ```
 *
 * @example Add custom aliases
 * ```ts
 * const custom = extendScheme(NES_CONTROLS, {
 *   name: 'NES (Platformer)',
 *   aliases: {
 *     JUMP: 'PRIMARY',
 *     ATTACK: 'SECONDARY',
 *   },
 * });
 * ```
 */
export function extendScheme(
  base: ControlScheme,
  overrides: SchemeOverrides,
): ControlScheme {
  // Deep clone base actions
  const newActions = { ...base.actions } as Record<InputAction, ActionBinding>;

  // Apply action overrides
  if (overrides.actions) {
    for (const [action, actionOverride] of Object.entries(overrides.actions)) {
      const inputAction = action as InputAction;
      const baseAction = newActions[inputAction];

      if (baseAction && actionOverride) {
        newActions[inputAction] = {
          keys: actionOverride.keys ?? baseAction.keys,
          gamepad: actionOverride.gamepad ?? baseAction.gamepad,
        };
      }
    }
  }

  // Merge aliases
  const newAliases = {
    ...base.aliases,
    ...overrides.aliases,
  };

  return {
    name: overrides.name ?? `${base.name} (Custom)`,
    actions: newActions,
    aliases: newAliases,
  };
}

/**
 * Creates a new scheme with a single action's keys rebound.
 *
 * This is a convenience wrapper around {@link extendScheme} for the
 * common case of rebinding just one action's keyboard keys.
 *
 * @param scheme - The scheme to modify
 * @param action - The action to rebind
 * @param keys - New keyboard keys for the action
 * @returns A new ControlScheme with the action rebound
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Rebind jump to space only
 * const custom = rebindAction(NES_CONTROLS, 'PRIMARY', ['space']);
 * ```
 */
export function rebindAction(
  scheme: ControlScheme,
  action: InputAction,
  keys: string[],
): ControlScheme {
  return extendScheme(scheme, {
    actions: {
      [action]: { keys },
    },
  });
}

/**
 * Creates a new control scheme from scratch with partial action definitions.
 *
 * Actions not specified will have empty bindings (`{ keys: [] }`).
 * Use this for creating entirely new schemes rather than extending existing ones.
 *
 * @param name - Display name for the scheme
 * @param actions - Partial action bindings (unspecified actions get empty bindings)
 * @param aliases - Optional console-specific aliases
 * @returns A complete ControlScheme
 *
 * @since 0.5.0
 *
 * @example Minimal scheme
 * ```ts
 * const simple = createScheme('Simple', {
 *   UP: binding('arrowup'),
 *   DOWN: binding('arrowdown'),
 *   LEFT: binding('arrowleft'),
 *   RIGHT: binding('arrowright'),
 *   PRIMARY: binding('space'),
 * });
 * ```
 */
export function createScheme(
  name: string,
  actions: Partial<Record<InputAction, ActionBinding>>,
  aliases: Record<string, InputAction> = {},
): ControlScheme {
  // Start with empty bindings for all actions
  const fullActions = {} as Record<InputAction, ActionBinding>;

  for (const action of ALL_ACTIONS) {
    fullActions[action] = actions[action] ?? unassignedBinding();
  }

  return {
    name,
    actions: fullActions,
    aliases,
  };
}

/**
 * Merges multiple partial schemes into one complete scheme.
 *
 * Later schemes override earlier ones. Useful for composing schemes
 * from reusable parts (e.g., base directional + console-specific buttons).
 *
 * @param name - Display name for the merged scheme
 * @param schemes - Partial schemes to merge (later overrides earlier)
 * @returns A complete ControlScheme
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const directional = { UP: binding('w'), DOWN: binding('s'), ... };
 * const buttons = { PRIMARY: binding('x'), SECONDARY: binding('z') };
 *
 * const combined = mergeSchemes('Combined', directional, buttons);
 * ```
 */
export function mergeSchemes(
  name: string,
  ...schemes: Partial<Record<InputAction, ActionBinding>>[]
): ControlScheme {
  const merged: Partial<Record<InputAction, ActionBinding>> = {};

  for (const scheme of schemes) {
    Object.assign(merged, scheme);
  }

  return createScheme(name, merged);
}
