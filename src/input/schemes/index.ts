/**
 * Built-in control schemes.
 *
 * @category Input
 * @module input/schemes
 */

import type { ControlScheme } from './types';

import { ATARI_2600_CONTROLS } from './presets/atari2600';
import { C64_CONTROLS } from './presets/c64';
import { DEFAULT_CONTROLS } from './presets/default';
import { DREAMCAST_CONTROLS } from './presets/dreamcast';
import { FAMICOM_CONTROLS } from './presets/famicom';
import { GAMEBOY_CONTROLS } from './presets/gameboy';
import { GAMEGEAR_CONTROLS } from './presets/gamegear';
import { GBA_CONTROLS } from './presets/gba';
import { GBC_CONTROLS } from './presets/gbc';
import { GENESIS_CONTROLS } from './presets/genesis';
import { N64_CONTROLS } from './presets/n64';
import { NDS_CONTROLS } from './presets/nds';
import { NEO_GEO_CONTROLS } from './presets/neo_geo';
import { NES_CONTROLS } from './presets/nes';
import { PICO8_CONTROLS } from './presets/pico8';
import { PLAYDATE_CONTROLS } from './presets/playdate';
import { PS1_CONTROLS } from './presets/ps1';
import { PSP_CONTROLS } from './presets/psp';
import { SNES_CONTROLS } from './presets/snes';
import { TIC80_CONTROLS } from './presets/tic80';

export { ATARI_2600_CONTROLS } from './presets/atari2600';
export { C64_CONTROLS } from './presets/c64';
export { DEFAULT_CONTROLS } from './presets/default';
export { DREAMCAST_CONTROLS } from './presets/dreamcast';
export { FAMICOM_CONTROLS } from './presets/famicom';
export { GAMEBOY_CONTROLS } from './presets/gameboy';
export { GAMEGEAR_CONTROLS } from './presets/gamegear';
export { GBA_CONTROLS } from './presets/gba';
export { GBC_CONTROLS } from './presets/gbc';
export { GENESIS_CONTROLS } from './presets/genesis';
export { N64_CONTROLS } from './presets/n64';
export { NDS_CONTROLS } from './presets/nds';
export { NEO_GEO_CONTROLS } from './presets/neo_geo';
export { NES_CONTROLS } from './presets/nes';
export { PICO8_CONTROLS } from './presets/pico8';
export { PLAYDATE_CONTROLS } from './presets/playdate';
export { PS1_CONTROLS } from './presets/ps1';
export { PSP_CONTROLS } from './presets/psp';
export { SNES_CONTROLS } from './presets/snes';
export { TIC80_CONTROLS } from './presets/tic80';
export { defineScheme, extendScheme } from './builder';
export type { ControlScheme, DirectionActions, SchemeOverrides } from './types';

/**
 * All built-in control schemes indexed by console name.
 */
export const CONTROL_SCHEMES = {
  DEFAULT: DEFAULT_CONTROLS,
  PICO8: PICO8_CONTROLS,
  TIC80: TIC80_CONTROLS,
  ATARI_2600: ATARI_2600_CONTROLS,
  NES: NES_CONTROLS,
  FAMICOM: FAMICOM_CONTROLS,
  SNES: SNES_CONTROLS,
  GAMEBOY: GAMEBOY_CONTROLS,
  GBC: GBC_CONTROLS,
  GBA: GBA_CONTROLS,
  N64: N64_CONTROLS,
  NDS: NDS_CONTROLS,
  GENESIS: GENESIS_CONTROLS,
  MEGADRIVE: GENESIS_CONTROLS,
  GAMEGEAR: GAMEGEAR_CONTROLS,
  DREAMCAST: DREAMCAST_CONTROLS,
  PS1: PS1_CONTROLS,
  PSP: PSP_CONTROLS,
  NEO_GEO: NEO_GEO_CONTROLS,
  C64: C64_CONTROLS,
  PLAYDATE: PLAYDATE_CONTROLS,
} as const satisfies Record<string, ControlScheme>;

/**
 * Valid built-in control scheme names.
 */
export type ControlSchemeName = keyof typeof CONTROL_SCHEMES;

/**
 * Returns a built-in control scheme by name.
 */
export function getControlScheme(name: ControlSchemeName): ControlScheme {
  return CONTROL_SCHEMES[name];
}

/**
 * Lists all built-in control scheme names.
 */
export function listControlSchemes(): ControlSchemeName[] {
  return Object.keys(CONTROL_SCHEMES) as ControlSchemeName[];
}
