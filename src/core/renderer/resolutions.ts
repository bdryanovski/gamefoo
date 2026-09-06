/**
 * Resolution definition object
 *
 * @since 0.4.0
 */
export interface ScreenResolution {
  width: number;
  height: number;
}

/**
 * Standard console resolutions.
 *
 * @since 0.4.0
 * @deprecated Use {@link CONSOLES} from 'gamefoo' for unified console access
 *             that includes both resolution and palette.
 *
 * @example
 * ```ts
 * // Old way (deprecated)
 * import { CONSOLE_RESOLUTION } from 'gamefoo';
 * const { width, height } = CONSOLE_RESOLUTION.PICO8;
 *
 * // New way (recommended)
 * import { CONSOLES } from 'gamefoo';
 * const { width, height } = CONSOLES.PICO8.resolution;
 * const palette = CONSOLES.PICO8.palette;
 * ```
 */
export const CONSOLE_RESOLUTION = {
  // ── Fantasy Consoles ──────────────────────────────────────────────
  PICO8: { width: 128, height: 128 },
  TIC80: { width: 240, height: 136 },

  // ── Atari ─────────────────────────────────────────────────────────
  ATARI_2600: { width: 160, height: 192 },
  ATARI_5200: { width: 320, height: 192 },
  ATARI_7800: { width: 320, height: 240 },

  // ── Nintendo ──────────────────────────────────────────────────────
  NES: { width: 256, height: 240 },
  FAMICOM: { width: 256, height: 240 },
  SNES: { width: 256, height: 224 },
  GAMEBOY: { width: 160, height: 144 },
  GBC: { width: 160, height: 144 },
  GBA: { width: 240, height: 160 },
  N64: { width: 320, height: 240 },
  NDS: { width: 256, height: 192 },
  N3DS: { width: 400, height: 240 },
  SWITCH: { width: 1280, height: 720 },

  // ── Sega ──────────────────────────────────────────────────────────
  GENESIS: { width: 320, height: 224 },
  MEGADRIVE: { width: 320, height: 224 },
  GAMEGEAR: { width: 160, height: 144 },
  DREAMCAST: { width: 640, height: 480 },

  // ── Sony ──────────────────────────────────────────────────────────
  PS1: { width: 320, height: 240 },
  PSP: { width: 480, height: 272 },

  // ── SNK ───────────────────────────────────────────────────────────
  NEO_GEO: { width: 320, height: 224 },

  // ── Home Computers ────────────────────────────────────────────────
  C64: { width: 320, height: 200 },
  CGA: { width: 320, height: 200 },
  EGA: { width: 640, height: 350 },

  // ── Modern Handhelds ──────────────────────────────────────────────
  PLAYDATE: { width: 400, height: 240 },

  // ── Legacy aliases (deprecated) ───────────────────────────────────
  /**
   * @deprecated Use NES instead
   */
  NINTENDO_NES: { width: 256, height: 240 },
  /**
   * @deprecated Use FAMICOM instead
   */
  NINTENDO_FEMICON: { width: 256, height: 240 },
  /**
   * @deprecated Use SNES instead
   */
  NINTENDO_SNES: { width: 256, height: 224 },
  /**
   * @deprecated Use GAMEBOY instead
   */
  NINTENDO_GAMEBOY: { width: 160, height: 144 },
  /**
   * @deprecated Use GBC instead
   */
  NINTENDO_GBC: { width: 160, height: 144 },
  /**
   * @deprecated Use GBA instead
   */
  NINTENDO_GBA: { width: 240, height: 160 },
  /**
   * @deprecated Use N64 instead
   */
  NINTENDO_64: { width: 320, height: 240 },
  /**
   * @deprecated Use NDS instead
   */
  NINTENDO_DS: { width: 256, height: 192 },
  /**
   * @deprecated Use N3DS instead
   */
  NINTENDO_3DS: { width: 400, height: 240 },
  /**
   * @deprecated Use SWITCH instead
   */
  NINTENDO_SWITCH: { width: 1280, height: 720 },
  /**
   * @deprecated Use GENESIS instead
   */
  SEGA_MEGADRIVE: { width: 320, height: 224 },
  /**
   * @deprecated Use GAMEGEAR instead
   */
  SEGA_GAMEGEAR: { width: 160, height: 144 },
  /**
   * @deprecated Use DREAMCAST instead
   */
  SEGA_DREAMCAST: { width: 640, height: 480 },
  /**
   * @deprecated Use PS1 instead
   */
  SONY_PLAYSTATION: { width: 320, height: 240 },
  /**
   * @deprecated Use PSP instead
   */
  SONY_PSP: { width: 480, height: 272 },
  /**
   * @deprecated Use ATARI_7800 instead
   */
  ATARI_7600: { width: 320, height: 240 },
} as const satisfies Record<string, ScreenResolution>;

/**
 * Predefined supported console resolutions.
 *
 * @deprecated Use ConsoleName from 'gamefoo/consoles' instead.
 */
export type ConsoleResolutionName = keyof typeof CONSOLE_RESOLUTION;
