/**
 * Console-to-control-scheme mapping.
 *
 * Maps console names from the unified CONSOLES object to their default
 * control schemes, allowing easy setup of console-authentic input handling.
 *
 * @category Consoles
 * @module consoles/controls
 * @since 0.5.0
 */

import type { ControlScheme, ControlSchemeName } from '../controls';
import { CONTROL_SCHEMES } from '../controls';
import type { ConsoleName } from './index';

/**
 * Maps console names to their default control scheme.
 *
 * Consoles not in this map will use the DEFAULT scheme.
 *
 * @since 0.5.0
 */
export const CONSOLE_DEFAULT_CONTROLS: Record<ConsoleName, ControlSchemeName> =
  {
    // Fantasy Consoles
    PICO8: 'PICO8',
    TIC80: 'TIC80',

    // Atari
    ATARI_2600: 'ATARI_2600',
    ATARI_5200: 'ATARI_2600',
    ATARI_7800: 'ATARI_2600',

    // Nintendo
    NES: 'NES',
    FAMICOM: 'FAMICOM',
    SNES: 'SNES',
    GAMEBOY: 'GAMEBOY',
    GBC: 'GBC',
    GBA: 'GBA',
    N64: 'N64',
    NDS: 'NDS',
    N3DS: 'NDS', // 3DS uses similar layout to DS
    SWITCH: 'SNES', // Switch Pro Controller is SNES-like

    // Sega
    GENESIS: 'GENESIS',
    MEGADRIVE: 'GENESIS',
    GAMEGEAR: 'GAMEGEAR',
    DREAMCAST: 'DREAMCAST',

    // Sony
    PS1: 'PS1',
    PSP: 'PSP',

    // SNK
    NEO_GEO: 'NEO_GEO',

    // Home Computers
    C64: 'C64',
    CGA: 'DEFAULT',
    CGA_FULL: 'DEFAULT',
    EGA: 'DEFAULT',
    EGA_64: 'DEFAULT',

    // Modern Handhelds
    PLAYDATE: 'PLAYDATE',
  };

/**
 * Gets the default control scheme for a console.
 *
 * @param consoleName - The console name
 * @returns The appropriate ControlScheme for that console
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { getDefaultControls, InputMapper, Input } from 'gamefoo';
 *
 * const input = new Input();
 * const controls = getDefaultControls('NES');
 * const mapper = new InputMapper(input, controls);
 *
 * if (mapper.isAction('A')) player.jump();
 * ```
 */
export function getDefaultControls(consoleName: ConsoleName): ControlScheme {
  const schemeName = CONSOLE_DEFAULT_CONTROLS[consoleName];
  return CONTROL_SCHEMES[schemeName];
}

/**
 * Gets the control scheme name for a console.
 *
 * @param consoleName - The console name
 * @returns The ControlSchemeName for that console
 *
 * @since 0.5.0
 */
export function getControlSchemeName(
  consoleName: ConsoleName,
): ControlSchemeName {
  return CONSOLE_DEFAULT_CONTROLS[consoleName];
}
