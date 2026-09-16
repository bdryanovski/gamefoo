/**
 * Console-specific control schemes and input mapping.
 *
 * This module provides control schemes for various gaming platforms,
 * mapping physical inputs (keyboard, gamepad) to semantic actions.
 * Games can use console-specific button names or generic action names
 * for portable input handling.
 *
 * ## Gamepad Button Reference
 *
 * Standard Gamepad button indices (W3C Standard):
 *
 * ```
 * ┌───────┬────────────────┬────────────────┬────────────────┐
 * │ Index │     Xbox       │  PlayStation   │    Nintendo    │
 * ├───────┼────────────────┼────────────────┼────────────────┤
 * │   0   │ A (green)      │ × Cross        │ B              │
 * │   1   │ B (red)        │ ○ Circle       │ A              │
 * │   2   │ X (blue)       │ □ Square       │ Y              │
 * │   3   │ Y (yellow)     │ △ Triangle     │ X              │
 * │   4   │ LB             │ L1             │ L              │
 * │   5   │ RB             │ R1             │ R              │
 * │   6   │ LT             │ L2             │ ZL             │
 * │   7   │ RT             │ R2             │ ZR             │
 * │   8   │ Back/View      │ Share          │ − (Minus)      │
 * │   9   │ Start/Menu     │ Options        │ + (Plus)       │
 * │  10   │ Left Stick     │ L3             │ Left Stick     │
 * │  11   │ Right Stick    │ R3             │ Right Stick    │
 * │  12   │ D-pad Up       │ D-pad Up       │ D-pad Up       │
 * │  13   │ D-pad Down     │ D-pad Down     │ D-pad Down     │
 * │  14   │ D-pad Left     │ D-pad Left     │ D-pad Left     │
 * │  15   │ D-pad Right    │ D-pad Right    │ D-pad Right    │
 * │  16   │ Xbox Button    │ PS Button      │ Home           │
 * └───────┴────────────────┴────────────────┴────────────────┘
 * ```
 *
 * Axis indices:
 * - 0: Left Stick X (-1 left, +1 right)
 * - 1: Left Stick Y (-1 up, +1 down)
 * - 2: Right Stick X
 * - 3: Right Stick Y
 *
 * @see {@link ./gamepad_reference.ts} for detailed diagrams and visual layouts
 * @see {@link GAMEPAD_BUTTON} for button index constants
 * @see {@link GAMEPAD_AXIS} for axis index constants
 * @see {@link getButtonLabel} for human-readable button names
 *
 * @category Controls
 * @module controls
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * import { Input, InputMapper, CONTROL_SCHEMES } from 'gamefoo';
 *
 * const input = new Input({ canvasId: 'game' });
 * const mapper = new InputMapper(input, CONTROL_SCHEMES.NES);
 *
 * // In game loop
 * input.update();
 * if (mapper.isAction('A')) player.jump();
 * const dir = mapper.getDirection();
 * ```
 *
 * @example Customizing controls
 * ```ts
 * import { extendScheme, NES_CONTROLS } from 'gamefoo';
 *
 * const myControls = extendScheme(NES_CONTROLS, {
 *   actions: {
 *     PRIMARY: { keys: ['space', 'x'] },
 *   },
 *   aliases: {
 *     JUMP: 'PRIMARY',
 *   },
 * });
 * ```
 *
 * @example Using gamepad constants
 * ```ts
 * import { GAMEPAD_BUTTON, getButtonLabel } from 'gamefoo';
 *
 * // Use constants in bindings
 * const binding = { button: GAMEPAD_BUTTON.A };
 *
 * // Get human-readable labels for UI
 * const label = getButtonLabel(0, 'PLAYSTATION'); // "×"
 * ```
 */

export type { ButtonLabelStyle } from './gamepad_mapping';
// ── Gamepad Mapping Reference ───────────────────────────────────────
export {
  BUTTON_LABELS,
  CONTROLLER_LEGEND,
  GAMEPAD_AXIS,
  GAMEPAD_BUTTON,
  getButtonLabel,
} from './gamepad_mapping';
// ── Classes ─────────────────────────────────────────────────────────
export { InputMapper } from './input_mapper';
// ── Utilities ───────────────────────────────────────────────────────
export {
  binding,
  createScheme,
  extendScheme,
  mergeSchemes,
  rebindAction,
  unassignedBinding,
} from './scheme_builder';
// Atari
export { ATARI_2600_CONTROLS } from './schemes/atari2600';
// Home Computers
export { C64_CONTROLS } from './schemes/c64';
// ── Individual Schemes ──────────────────────────────────────────────
// Default
export { DEFAULT_CONTROLS } from './schemes/default';
export { DREAMCAST_CONTROLS } from './schemes/dreamcast';
export { FAMICOM_CONTROLS } from './schemes/famicom';
export { GAMEBOY_CONTROLS } from './schemes/gameboy';
export { GAMEGEAR_CONTROLS } from './schemes/gamegear';
export { GBA_CONTROLS } from './schemes/gba';
export { GBC_CONTROLS } from './schemes/gbc';
// Sega
export { GENESIS_CONTROLS } from './schemes/genesis';
export { N64_CONTROLS } from './schemes/n64';
export { NDS_CONTROLS } from './schemes/nds';
// SNK
export { NEO_GEO_CONTROLS } from './schemes/neo_geo';
// Nintendo
export { NES_CONTROLS } from './schemes/nes';
// Fantasy Consoles
export { PICO8_CONTROLS } from './schemes/pico8';
// Modern Handhelds
export { PLAYDATE_CONTROLS } from './schemes/playdate';

// Sony
export { PS1_CONTROLS } from './schemes/ps1';
export { PSP_CONTROLS } from './schemes/psp';
export { SNES_CONTROLS } from './schemes/snes';
export { TIC80_CONTROLS } from './schemes/tic80';
// ── Types ───────────────────────────────────────────────────────────
export type {
  ActionBinding,
  ControlScheme,
  GamepadBinding,
  InputAction,
  InputMapperOptions,
  SchemeOverrides,
} from './types';

// ── Re-imports for CONTROL_SCHEMES object ───────────────────────────
import { ATARI_2600_CONTROLS } from './schemes/atari2600';
import { C64_CONTROLS } from './schemes/c64';
import { DEFAULT_CONTROLS } from './schemes/default';
import { DREAMCAST_CONTROLS } from './schemes/dreamcast';
import { FAMICOM_CONTROLS } from './schemes/famicom';
import { GAMEBOY_CONTROLS } from './schemes/gameboy';
import { GAMEGEAR_CONTROLS } from './schemes/gamegear';
import { GBA_CONTROLS } from './schemes/gba';
import { GBC_CONTROLS } from './schemes/gbc';
import { GENESIS_CONTROLS } from './schemes/genesis';
import { N64_CONTROLS } from './schemes/n64';
import { NDS_CONTROLS } from './schemes/nds';
import { NEO_GEO_CONTROLS } from './schemes/neo_geo';
import { NES_CONTROLS } from './schemes/nes';
import { PICO8_CONTROLS } from './schemes/pico8';
import { PLAYDATE_CONTROLS } from './schemes/playdate';
import { PS1_CONTROLS } from './schemes/ps1';
import { PSP_CONTROLS } from './schemes/psp';
import { SNES_CONTROLS } from './schemes/snes';
import { TIC80_CONTROLS } from './schemes/tic80';
import type { ControlScheme } from './types';

/**
 * Collection of all control schemes for easy access.
 *
 * Use this object to access control schemes by console name.
 * Each scheme defines keyboard and gamepad bindings for that console's
 * standard controller layout.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { CONTROL_SCHEMES, InputMapper } from 'gamefoo';
 *
 * // Access by console name
 * const mapper = new InputMapper(input, CONTROL_SCHEMES.NES);
 *
 * // List all available schemes
 * console.log(Object.keys(CONTROL_SCHEMES));
 * ```
 */
export const CONTROL_SCHEMES = {
  // Default/Generic
  DEFAULT: DEFAULT_CONTROLS,

  // Fantasy Consoles
  PICO8: PICO8_CONTROLS,
  TIC80: TIC80_CONTROLS,

  // Atari
  ATARI_2600: ATARI_2600_CONTROLS,

  // Nintendo
  NES: NES_CONTROLS,
  FAMICOM: FAMICOM_CONTROLS,
  SNES: SNES_CONTROLS,
  GAMEBOY: GAMEBOY_CONTROLS,
  GBC: GBC_CONTROLS,
  GBA: GBA_CONTROLS,
  N64: N64_CONTROLS,
  NDS: NDS_CONTROLS,

  // Sega
  GENESIS: GENESIS_CONTROLS,
  MEGADRIVE: GENESIS_CONTROLS, // Alias
  GAMEGEAR: GAMEGEAR_CONTROLS,
  DREAMCAST: DREAMCAST_CONTROLS,

  // Sony
  PS1: PS1_CONTROLS,
  PSP: PSP_CONTROLS,

  // SNK
  NEO_GEO: NEO_GEO_CONTROLS,

  // Home Computers
  C64: C64_CONTROLS,

  // Modern Handhelds
  PLAYDATE: PLAYDATE_CONTROLS,
} as const satisfies Record<string, ControlScheme>;

/**
 * Type for valid control scheme names.
 *
 * @since 0.5.0
 */
export type ControlSchemeName = keyof typeof CONTROL_SCHEMES;

/**
 * Gets a control scheme by name.
 *
 * @param name - The scheme name
 * @returns The control scheme
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const scheme = getControlScheme('NES');
 * const mapper = new InputMapper(input, scheme);
 * ```
 */
export function getControlScheme(name: ControlSchemeName): ControlScheme {
  return CONTROL_SCHEMES[name];
}

/**
 * Lists all available control scheme names.
 *
 * @returns Array of scheme names
 *
 * @since 0.5.0
 */
export function listControlSchemes(): ControlSchemeName[] {
  return Object.keys(CONTROL_SCHEMES) as ControlSchemeName[];
}
