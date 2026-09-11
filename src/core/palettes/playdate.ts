/**
 * Playdate handheld color palette.
 *
 * The Playdate is a modern handheld with a 1-bit (black and white)
 * reflective LCD display. Games use dithering patterns to simulate
 * grayscale.
 *
 * @category Palettes
 * @module palettes/playdate
 * @since 0.5.0
 *
 * @see {@link https://play.date/} Playdate Official Site
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for the Playdate palette.
 *
 * @since 0.5.0
 */
export interface PlaydateColors {
  BLACK: HexColor;
  WHITE: HexColor;
}

/**
 * Playdate 1-bit (2-color) palette.
 *
 * The Playdate's display only shows black and white.
 * Grayscale effects are achieved through dithering.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Simple black and white
 * ctx.fillRect(0, 0, 100, 100, PLAYDATE.named.BLACK);
 * ctx.fillRect(100, 0, 100, 100, PLAYDATE.named.WHITE);
 * ```
 */
export const PLAYDATE: NamedColorPalette<PlaydateColors> = {
  name: 'Playdate',
  colors: [
    '#000000', // Black
    '#FFFFFF', // White
  ] as const,
  named: {
    BLACK: '#000000',
    WHITE: '#FFFFFF',
  },
} as const;
