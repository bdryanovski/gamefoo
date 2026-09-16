/**
 * Console color palettes for retro game development.
 *
 * This module provides authentic color palettes from classic gaming
 * platforms, including both fixed palettes (PICO-8, TIC-80, Game Boy, etc.)
 * and generated palettes for systems with large color spaces (SNES, Genesis).
 *
 * @category Palettes
 * @module palettes
 * @since 0.5.0
 *
 * @example
 * ```ts
 * import { CONSOLE_PALETTES, PICO8, GAMEBOY, SNES } from 'gamefoo';
 *
 * // Use a fixed palette
 * const red = PICO8.named.RED;
 *
 * // Use generated palette
 * const snesColor = SNES.generate(31, 16, 0);
 *
 * // Access all palettes
 * for (const [name, palette] of Object.entries(CONSOLE_PALETTES)) {
 *   console.log(name, paletteSize(palette));
 * }
 * ```
 */

export type { Atari2600Colors } from './atari2600';
// Fixed Palettes
export { ATARI_2600 } from './atari2600';
export type { CgaColors, CgaFullColors } from './cga';
export { CGA, CGA_FULL } from './cga';
export type { C64Colors } from './commodore64';
export { C64 } from './commodore64';
export type { EgaColors } from './ega';
export { EGA, EGA_64 } from './ega';
export type { GameBoyColors } from './gameboy';
export { createGameBoyPalette, GAMEBOY } from './gameboy';
export { GBA } from './gba';
export { GBC } from './gbc';
export { NEO_GEO } from './neogeo';
export type { NesColors } from './nes';
export { NES } from './nes';
export type { Pico8Colors } from './pico8';
export { PICO8 } from './pico8';
export type { PlaydateColors } from './playdate';

export { PLAYDATE } from './playdate';
export { GAMEGEAR, to4Bit, toGameGear } from './sega_gamegear';
export { GENESIS, MEGADRIVE, to3Bit, toGenesis } from './sega_genesis';
// Generated Palettes
export { SNES, to5Bit, toSNES } from './snes';
export type { Tic80Colors } from './tic80';
export { TIC80 } from './tic80';
// Types
export type { ColorPalette, GeneratedPalette, HexColor, NamedColorPalette } from './types';
// Utilities
export {
  getColor,
  hexToRgb,
  isGeneratedPalette,
  nearestColor,
  paletteGradient,
  paletteSize,
  quantize,
  randomColor,
  rgbToHex,
} from './utils';

// Re-import for CONSOLE_PALETTES object
import { ATARI_2600 } from './atari2600';
import { CGA, CGA_FULL } from './cga';
import { C64 } from './commodore64';
import { EGA, EGA_64 } from './ega';
import { GAMEBOY } from './gameboy';
import { GBA } from './gba';
import { GBC } from './gbc';
import { NEO_GEO } from './neogeo';
import { NES } from './nes';
import { PICO8 } from './pico8';
import { PLAYDATE } from './playdate';
import { GAMEGEAR } from './sega_gamegear';
import { GENESIS } from './sega_genesis';
import { SNES } from './snes';
import { TIC80 } from './tic80';
import type { ColorPalette, GeneratedPalette } from './types';

/**
 * Collection of all console palettes for easy access.
 *
 * @since 0.5.0
 * @deprecated Use {@link CONSOLES} from 'gamefoo' for unified console access.
 *
 * @example
 * ```ts
 * // Iterate over all palettes
 * for (const [name, palette] of Object.entries(CONSOLE_PALETTES)) {
 *   console.log(`${name}: ${paletteSize(palette)} colors`);
 * }
 *
 * // Access by key
 * const pico8 = CONSOLE_PALETTES.PICO8;
 * ```
 */
export const CONSOLE_PALETTES = {
  // Fantasy Consoles
  PICO8,
  TIC80,

  // Atari
  ATARI_2600,

  // Nintendo
  GAMEBOY,
  GBC,
  GBA,
  NES,
  SNES,

  // Sega
  GENESIS,
  GAMEGEAR,

  // SNK
  NEO_GEO,

  // Home Computers
  C64,
  CGA,
  CGA_FULL,
  EGA,
  EGA_64,

  // Modern Handhelds
  PLAYDATE,
} as const satisfies Record<string, ColorPalette | GeneratedPalette>;

/**
 * Type for the keys of CONSOLE_PALETTES.
 *
 * @since 0.5.0
 */
export type ConsolePaletteName = keyof typeof CONSOLE_PALETTES;
