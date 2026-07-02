/**
 * Atari 2600 (TIA) color palette.
 *
 * The Atari 2600 TIA chip generates 128 colors using a combination
 * of 16 hues and 8 luminance levels. This is the NTSC palette.
 *
 * @category Palettes
 * @module palettes/atari2600
 * @since 0.5.0
 *
 * @see {@link https://en.wikipedia.org/wiki/Television_Interface_Adaptor} Wikipedia
 */

import type { HexColor, NamedColorPalette } from './types';

/**
 * Named colors for common Atari 2600 palette entries.
 *
 * @since 0.5.0
 */
export interface Atari2600Colors {
  BLACK: HexColor;
  WHITE: HexColor;
  GRAY: HexColor;
  YELLOW: HexColor;
  ORANGE: HexColor;
  RED: HexColor;
  PINK: HexColor;
  PURPLE: HexColor;
  BLUE: HexColor;
  CYAN: HexColor;
  GREEN: HexColor;
  LIME: HexColor;
}

/**
 * Atari 2600 128-color NTSC palette.
 *
 * Colors are organized by hue (16 hues) × luminance (8 levels).
 * The first 8 colors are grayscale.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * // Array access
 * const color = ATARI_2600.colors[64];
 *
 * // Named access for common colors
 * const bg = ATARI_2600.named.BLACK;
 * ```
 */
export const ATARI_2600: NamedColorPalette<Atari2600Colors> = {
  name: 'Atari 2600',
  colors: [
    // Hue 0: Grayscale
    '#000000',
    '#404040',
    '#6C6C6C',
    '#909090',
    '#B0B0B0',
    '#C8C8C8',
    '#DCDCDC',
    '#ECECEC',
    // Hue 1: Gold/Yellow
    '#444400',
    '#646410',
    '#848424',
    '#A0A034',
    '#B8B840',
    '#D0D050',
    '#E8E85C',
    '#FCFC68',
    // Hue 2: Orange
    '#702800',
    '#844414',
    '#985C28',
    '#AC783C',
    '#BC8C4C',
    '#CCA05C',
    '#DCB468',
    '#ECC878',
    // Hue 3: Red-Orange
    '#841800',
    '#983418',
    '#AC5030',
    '#C06848',
    '#D0805C',
    '#E09470',
    '#ECA880',
    '#FCBC94',
    // Hue 4: Pink/Red
    '#880000',
    '#9C2020',
    '#B03C3C',
    '#C05858',
    '#D07070',
    '#E08888',
    '#ECA0A0',
    '#FCB4B4',
    // Hue 5: Purple
    '#78005C',
    '#8C2074',
    '#A03C88',
    '#B0589C',
    '#C070B0',
    '#D084C0',
    '#DC9CD0',
    '#ECB0E0',
    // Hue 6: Purple-Blue
    '#480078',
    '#602090',
    '#783CA4',
    '#8C58B8',
    '#A070CC',
    '#B484DC',
    '#C49CEC',
    '#D4B0FC',
    // Hue 7: Blue
    '#140084',
    '#302098',
    '#4C3CAC',
    '#6858C0',
    '#7C70D0',
    '#9488E0',
    '#A8A0EC',
    '#BCB4FC',
    // Hue 8: Blue
    '#000088',
    '#1C209C',
    '#3840B0',
    '#505CC0',
    '#6874D0',
    '#7C8CE0',
    '#90A4EC',
    '#A4B8FC',
    // Hue 9: Light Blue
    '#00187C',
    '#1C3890',
    '#3854A8',
    '#5070BC',
    '#6888CC',
    '#7C9CDC',
    '#90B4EC',
    '#A4C8FC',
    // Hue 10: Turquoise
    '#002C5C',
    '#1C4C78',
    '#386890',
    '#5084AC',
    '#689CC0',
    '#7CB4D4',
    '#90CCE8',
    '#A4E0FC',
    // Hue 11: Cyan-Green
    '#003C2C',
    '#1C5C48',
    '#387C64',
    '#509C80',
    '#68B494',
    '#7CD0AC',
    '#90E4C0',
    '#A4FCD4',
    // Hue 12: Green
    '#003C00',
    '#205C20',
    '#407C40',
    '#5C9C5C',
    '#74B474',
    '#8CD08C',
    '#A4E4A4',
    '#B8FCB8',
    // Hue 13: Yellow-Green
    '#143800',
    '#345C1C',
    '#507C38',
    '#6C9850',
    '#84B468',
    '#9CCC7C',
    '#B4E490',
    '#C8FCA4',
    // Hue 14: Yellow
    '#2C3000',
    '#4C501C',
    '#687034',
    '#848C4C',
    '#9CA864',
    '#B4C078',
    '#CCD488',
    '#E0EC9C',
    // Hue 15: Orange-Yellow
    '#442800',
    '#644818',
    '#846830',
    '#A08444',
    '#B89C58',
    '#D0B46C',
    '#E8CC7C',
    '#FCE08C',
  ] as const,
  named: {
    BLACK: '#000000',
    WHITE: '#ECECEC',
    GRAY: '#909090',
    YELLOW: '#FCFC68',
    ORANGE: '#ECC878',
    RED: '#FCB4B4',
    PINK: '#ECB0E0',
    PURPLE: '#D4B0FC',
    BLUE: '#A4B8FC',
    CYAN: '#A4E0FC',
    GREEN: '#B8FCB8',
    LIME: '#C8FCA4',
  },
} as const;
