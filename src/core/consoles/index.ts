/**
 * Unified console definitions with resolution and palette support.
 *
 * This module provides a single entry point for accessing console-specific
 * settings including screen resolution, color palette, and future extensions
 * like control schemes.
 *
 * @category Consoles
 * @module consoles
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { CONSOLES, getConsole } from 'gamefoo';
 *
 * // Access by unified name
 * const pico8 = CONSOLES.PICO8;
 * console.log(pico8.resolution); // { width: 128, height: 128 }
 * console.log(pico8.palette.name); // 'PICO-8'
 *
 * // Or use the helper
 * const nes = getConsole('NES');
 * ```
 */

// Import all palettes
import { ATARI_2600 } from '../palettes/atari2600';
import { CGA, CGA_FULL } from '../palettes/cga';
import { C64 } from '../palettes/commodore64';
import { EGA, EGA_64 } from '../palettes/ega';
import { GAMEBOY } from '../palettes/gameboy';
import { GBA } from '../palettes/gba';
import { GBC } from '../palettes/gbc';
import { NEO_GEO } from '../palettes/neogeo';
import { NES } from '../palettes/nes';
import { PICO8 } from '../palettes/pico8';
import { PLAYDATE } from '../palettes/playdate';
import { GAMEGEAR } from '../palettes/sega_gamegear';
import { GENESIS } from '../palettes/sega_genesis';
import { SNES } from '../palettes/snes';
import { TIC80 } from '../palettes/tic80';
import type { ColorPalette, GeneratedPalette } from '../palettes/types';
import type { ScreenResolution } from '../renderer/resolutions';

/**
 * Console definition with resolution and palette.
 *
 * @since 0.5.0
 */
export interface ConsoleDefinition {
  /**
   * Display name of the console.
   */
  readonly name: string;
  /**
   * Screen resolution.
   */
  readonly resolution: ScreenResolution;
  /**
   * Color palette (fixed or generated).
   */
  readonly palette: ColorPalette | GeneratedPalette;
}

/**
 * All supported console definitions.
 *
 * Console names are unified across resolution and palette access.
 * Names follow the pattern: BRAND_MODEL or just MODEL for fantasy consoles.
 *
 * @since 0.5.0
 */
export const CONSOLES = {
  // ── Fantasy Consoles ──────────────────────────────────────────────
  PICO8: {
    name: 'PICO-8',
    resolution: { width: 128, height: 128 },
    palette: PICO8,
  },
  TIC80: {
    name: 'TIC-80',
    resolution: { width: 240, height: 136 },
    palette: TIC80,
  },

  // ── Atari ─────────────────────────────────────────────────────────
  ATARI_2600: {
    name: 'Atari 2600',
    resolution: { width: 160, height: 192 },
    palette: ATARI_2600,
  },
  ATARI_5200: {
    name: 'Atari 5200',
    resolution: { width: 320, height: 192 },
    palette: ATARI_2600, // Uses same TIA-derived palette
  },
  ATARI_7800: {
    name: 'Atari 7800',
    resolution: { width: 320, height: 240 },
    palette: ATARI_2600, // Compatible with 2600 palette
  },

  // ── Nintendo ──────────────────────────────────────────────────────
  NES: {
    name: 'Nintendo Entertainment System',
    resolution: { width: 256, height: 240 },
    palette: NES,
  },
  FAMICOM: {
    name: 'Nintendo Famicom',
    resolution: { width: 256, height: 240 },
    palette: NES, // Same as NES
  },
  SNES: {
    name: 'Super Nintendo',
    resolution: { width: 256, height: 224 },
    palette: SNES,
  },
  GAMEBOY: {
    name: 'Game Boy',
    resolution: { width: 160, height: 144 },
    palette: GAMEBOY,
  },
  GBC: {
    name: 'Game Boy Color',
    resolution: { width: 160, height: 144 },
    palette: GBC,
  },
  GBA: {
    name: 'Game Boy Advance',
    resolution: { width: 240, height: 160 },
    palette: GBA,
  },
  N64: {
    name: 'Nintendo 64',
    resolution: { width: 320, height: 240 },
    palette: SNES, // N64 uses 16-bit color, SNES palette as approximation
  },
  NDS: {
    name: 'Nintendo DS',
    resolution: { width: 256, height: 192 },
    palette: GBA, // DS uses similar color depth
  },
  N3DS: {
    name: 'Nintendo 3DS',
    resolution: { width: 400, height: 240 }, // Top screen
    palette: GBA,
  },
  SWITCH: {
    name: 'Nintendo Switch',
    resolution: { width: 1280, height: 720 },
    palette: SNES, // Modern, but SNES for retro style
  },

  // ── Sega ──────────────────────────────────────────────────────────
  GENESIS: {
    name: 'Sega Genesis / Mega Drive',
    resolution: { width: 320, height: 224 },
    palette: GENESIS,
  },
  MEGADRIVE: {
    name: 'Sega Mega Drive',
    resolution: { width: 320, height: 224 },
    palette: GENESIS, // Alias for Genesis
  },
  GAMEGEAR: {
    name: 'Sega Game Gear',
    resolution: { width: 160, height: 144 },
    palette: GAMEGEAR,
  },
  DREAMCAST: {
    name: 'Sega Dreamcast',
    resolution: { width: 640, height: 480 },
    palette: GENESIS, // Use Genesis as base for retro style
  },

  // ── Sony ──────────────────────────────────────────────────────────
  PS1: {
    name: 'Sony PlayStation',
    resolution: { width: 320, height: 240 },
    palette: SNES, // PS1 uses 15/24-bit color
  },
  PSP: {
    name: 'Sony PSP',
    resolution: { width: 480, height: 272 },
    palette: SNES,
  },

  // ── SNK ───────────────────────────────────────────────────────────
  NEO_GEO: {
    name: 'SNK Neo Geo',
    resolution: { width: 320, height: 224 },
    palette: NEO_GEO,
  },

  // ── Home Computers ────────────────────────────────────────────────
  C64: {
    name: 'Commodore 64',
    resolution: { width: 320, height: 200 },
    palette: C64,
  },
  CGA: {
    name: 'IBM CGA',
    resolution: { width: 320, height: 200 },
    palette: CGA,
  },
  CGA_FULL: {
    name: 'IBM CGA (Full)',
    resolution: { width: 320, height: 200 },
    palette: CGA_FULL,
  },
  EGA: {
    name: 'IBM EGA',
    resolution: { width: 640, height: 350 },
    palette: EGA,
  },
  EGA_64: {
    name: 'IBM EGA (64-color)',
    resolution: { width: 640, height: 350 },
    palette: EGA_64,
  },

  // ── Modern Handhelds ──────────────────────────────────────────────
  PLAYDATE: {
    name: 'Playdate',
    resolution: { width: 400, height: 240 },
    palette: PLAYDATE,
  },
} as const satisfies Record<string, ConsoleDefinition>;

/**
 * Type for valid console names.
 *
 * @since 0.5.0
 */
export type ConsoleName = keyof typeof CONSOLES;

/**
 * Gets a console definition by name.
 *
 * @param name - Console name
 * @returns Console definition with resolution and palette
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const nes = getConsole('NES');
 * const { width, height } = nes.resolution;
 * const bgColor = nes.palette.colors[0];
 * ```
 */
export function getConsole(name: ConsoleName): ConsoleDefinition {
  return CONSOLES[name];
}

/**
 * Gets just the resolution for a console.
 *
 * @param name - Console name
 * @returns Screen resolution
 *
 * @since 0.5.0
 */
export function getResolution(name: ConsoleName): ScreenResolution {
  return CONSOLES[name].resolution;
}

/**
 * Gets just the palette for a console.
 *
 * @param name - Console name
 * @returns Color palette
 *
 * @since 0.5.0
 */
export function getPalette(name: ConsoleName): ColorPalette | GeneratedPalette {
  return CONSOLES[name].palette;
}

/**
 * Lists all available console names.
 *
 * @returns Array of console names
 *
 * @since 0.5.0
 */
export function listConsoles(): ConsoleName[] {
  return Object.keys(CONSOLES) as ConsoleName[];
}

// ── Controls Integration ────────────────────────────────────────────
export { CONSOLE_DEFAULT_CONTROLS, getControlSchemeName, getDefaultControls } from './controls';
