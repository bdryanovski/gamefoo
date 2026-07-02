/**
 * Resolution definition object
 *
 * @since 0.4.0
 */
export type ScreenResolution = { width: number; height: number };

/**
 * Standart Console resolution
 *
 * @since 0.4.0
 */
export const CONSOLE_RESOLUTION = {
  ATARI_2600: { width: 160, height: 192 },
  ATARI_5200: { width: 320, height: 192 },
  ATARI_7600: { width: 320, height: 240 },

  NINTENDO_GAMEBOY: { width: 160, height: 144 },
  NINTENDO_GBA: { width: 240, height: 160 },
  NINTENDO_GBC: { width: 240, height: 144 },
  NINTENDO_SNES: { width: 256, height: 224 },
  NINTENDO_3DS: { width: 800, height: 240 },
  NINTENDO_64: { width: 320, height: 240 },
  NINTENDO_DS: { width: 256, height: 192 },
  NINTENDO_FEMICON: { width: 256, height: 240 },
  NINTENDO_NES: { width: 256, height: 240 },
  NINTENDO_SWITCH: { width: 1280, height: 720 },

  PLAYDATE: { width: 400, height: 240 },

  PICO8: { width: 128, height: 128 },

  TIC80: { width: 240, height: 136 },

  SEGA_DREAMCAST: { width: 640, height: 480 },
  SEGA_GAMEGEAR: { width: 260, height: 144 },
  SEGA_MEGADRIVE: { width: 320, height: 240 },

  SONY_PLAYSTATION: { width: 640, height: 480 },
  SONY_PSP: { width: 480, height: 272 },

  NEO_GEO: { width: 320, height: 224 },
} as const satisfies Record<string, ScreenResolution>;

/**
 * Predefined supported console resolutions
 */
export type ConsoleName = keyof typeof CONSOLE_RESOLUTION;
