/**
 * Built-in 8×8 pixel bitmap icon set.
 *
 * Each icon is an 8-pixel-wide, 8-pixel-tall sprite stored as an
 * array of eight integers. Each integer is a bitmask where bit 7
 * (MSB) corresponds to the leftmost pixel and bit 0 to the rightmost.
 *
 *   Bit layout per row  (width = 8)
 *   ┌─────────────────────────────┐
 *   │ b7 b6 b5 b4 b3 b2 b1 b0    │
 *   │ ◄── left          right ──► │
 *   └─────────────────────────────┘
 *
 * Icons are grouped into four categories:
 *   - Game UI  — heart, coin, star, gem, arrows, cross, checkmark …
 *   - Controls — dpad, buttons, key cap, mouse, cursor, gamepad …
 *   - Status   — shield, skull, mana drop, bars, lock, speech bubble …
 *   - Objects  — sword, key, potion, chest, bomb, scroll, flame …
 *
 * @category Icons
 * @since 0.4.0
 * @internal
 *
 * @example Reading an icon
 * ```ts
 * import ICONS_8x8 from "./icons_8x8";
 *
 * const heart = ICONS_8x8["heart_full"];
 * // [102, 255, 255, 126, 60, 24, 0, 0]
 * //
 * //  .##..##.   = 0b01100110 = 102
 * //  ########   = 0b11111111 = 255
 * //  ########   = 0b11111111 = 255
 * //  .######.   = 0b01111110 = 126
 * //  ..####..   = 0b00111100 =  60
 * //  ...##...   = 0b00011000 =  24
 * //  ........   = 0b00000000 =   0
 * //  ........   = 0b00000000 =   0
 * ```
 */

/** Catalogue name used by an IconBitmap renderer to look up this set. */
export const ICONS_8x8_NAME = 'icons_8x8';

/**
 * Icon width in pixels (excluding spacing).
 * @defaultValue `8`
 */
export const ICONS_8x8_WIDTH = 8;

/**
 * Icon height in pixels.
 * @defaultValue `8`
 */
export const ICONS_8x8_HEIGHT = 8;

/**
 * Recommended horizontal spacing between icons in pixels.
 * @defaultValue `2`
 */
export const ICONS_8x8_SPACING = 2;

/**
 * Complete list of supported icon keys.
 */
export const ICONS_8x8_KEYS: string[] = [
  // Game UI
  'heart_full',
  'heart_empty',
  'coin',
  'star',
  'gem',
  'arrow_up',
  'arrow_down',
  'arrow_left',
  'arrow_right',
  'cross',
  'checkmark',
  'exclaim',
  // Controls / Input
  'dpad',
  'button_round',
  'button_filled',
  'button_cross',
  'button_square',
  'key_cap',
  'mouse',
  'cursor',
  'gamepad',
  // Status / HUD
  'shield',
  'skull',
  'mana_drop',
  'bar_full',
  'bar_half',
  'bar_empty',
  'bubble',
  'lock',
  'map_pin',
  // Objects / Items
  'sword',
  'key_item',
  'potion',
  'chest',
  'bomb',
  'scroll',
  'fire',
] as const;

/**
 * Icon data keyed by name.
 *
 * Each value is an 8-element `number[]` where each entry is an 8-bit
 * row bitmask (bit 7 = leftmost pixel, bit 0 = rightmost pixel).
 *
 * @see {@link IconBitmap} — consumes this data for rendering
 */
export const ICONS_8x8: Record<string, number[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // GAME UI
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * heart_full — solid heart shape
   *
   *  .##..##.   102
   *  ########   255
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ...##...    24
   *  ........     0
   *  ........     0
   */
  heart_full: [102, 255, 255, 126, 60, 24, 0, 0],

  /**
   * heart_empty — heart outline
   *
   *  .##..##.   102
   *  #..##..#   153
   *  #......#   129
   *  .#....#.    66
   *  ..#..#..    36
   *  ...##...    24
   *  ........     0
   *  ........     0
   */
  heart_empty: [102, 153, 129, 66, 36, 24, 0, 0],

  /**
   * coin — circle with engraved centre stripe
   *
   *  ..####..    60
   *  .######.   126
   *  ########   255
   *  ###..###   231
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ........     0
   */
  coin: [60, 126, 255, 231, 255, 126, 60, 0],

  /**
   * star — 6-row diamond star with pointed tips
   *
   *  ...##...    24
   *  ..####..    60
   *  #.####.#   189
   *  ########   255
   *  #.####.#   189
   *  ..####..    60
   *  ...##...    24
   *  ........     0
   */
  star: [24, 60, 189, 255, 189, 60, 24, 0],

  /**
   * gem — cut diamond silhouette
   *
   *  ..####..    60
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ...##...    24
   *  ....#...     8
   *  ........     0
   *  ........     0
   */
  gem: [60, 255, 126, 60, 24, 8, 0, 0],

  /**
   * arrow_up — upward-pointing chevron with stem
   *
   *  ...##...    24
   *  ..####..    60
   *  .######.   126
   *  ########   255
   *  ...##...    24
   *  ...##...    24
   *  ...##...    24
   *  ........     0
   */
  arrow_up: [24, 60, 126, 255, 24, 24, 24, 0],

  /**
   * arrow_down — downward-pointing chevron with stem
   *
   *  ...##...    24
   *  ...##...    24
   *  ...##...    24
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ...##...    24
   *  ........     0
   */
  arrow_down: [24, 24, 24, 255, 126, 60, 24, 0],

  /**
   * arrow_left — left-pointing solid triangle (◄)
   *
   *  .......#     1
   *  ......##     3
   *  .....###     7
   *  ....####    15
   *  .....###     7
   *  ......##     3
   *  .......#     1
   *  ........     0
   */
  arrow_left: [1, 3, 7, 15, 7, 3, 1, 0],

  /**
   * arrow_right — right-pointing solid triangle (►)
   *
   *  #.......   128
   *  ##......   192
   *  ###.....   224
   *  ####....   240
   *  ###.....   224
   *  ##......   192
   *  #.......   128
   *  ........     0
   */
  arrow_right: [128, 192, 224, 240, 224, 192, 128, 0],

  /**
   * cross — X mark / close button
   *
   *  ##....##   195
   *  .##..##.   102
   *  ..####..    60
   *  ...##...    24
   *  ..####..    60
   *  .##..##.   102
   *  ##....##   195
   *  ........     0
   */
  cross: [195, 102, 60, 24, 60, 102, 195, 0],

  /**
   * checkmark — tick / confirm symbol
   *
   *  ........     0
   *  .......#     1
   *  ......##     3
   *  .#...##.    70
   *  .##.##..   108
   *  ..###...    56
   *  ........     0
   *  ........     0
   */
  checkmark: [0, 1, 3, 70, 108, 56, 0, 0],

  /**
   * exclaim — exclamation mark / alert
   *
   *  ...##...    24
   *  ...##...    24
   *  ...##...    24
   *  ...##...    24
   *  ........     0
   *  ...##...    24
   *  ........     0
   *  ........     0
   */
  exclaim: [24, 24, 24, 24, 0, 24, 0, 0],

  // ─────────────────────────────────────────────────────────────────────────
  // CONTROLS / INPUT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * dpad — directional pad / plus cross
   *
   *  ..####..    60
   *  ..####..    60
   *  ########   255
   *  ########   255
   *  ..####..    60
   *  ..####..    60
   *  ........     0
   *  ........     0
   */
  dpad: [60, 60, 255, 255, 60, 60, 0, 0],

  /**
   * button_round — hollow circle button (○)
   *
   *  ..####..    60
   *  .#....#.    66
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  .#....#.    66
   *  ..####..    60
   *  ........     0
   */
  button_round: [60, 66, 129, 129, 129, 66, 60, 0],

  /**
   * button_filled — solid circle button (●)
   *
   *  ..####..    60
   *  .######.   126
   *  ########   255
   *  ########   255
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ........     0
   */
  button_filled: [60, 126, 255, 255, 255, 126, 60, 0],

  /**
   * button_cross — ✕ face button
   *
   *  ##....##   195
   *  .##..##.   102
   *  ..####..    60
   *  ...##...    24
   *  ..####..    60
   *  .##..##.   102
   *  ##....##   195
   *  ........     0
   */
  button_cross: [195, 102, 60, 24, 60, 102, 195, 0],

  /**
   * button_square — □ face button outline
   *
   *  ########   255
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  ########   255
   *  ........     0
   */
  button_square: [255, 129, 129, 129, 129, 129, 255, 0],

  /**
   * key_cap — keyboard key silhouette
   *
   *  .######.   126
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  .######.   126
   *  ........     0
   *  ........     0
   */
  key_cap: [126, 129, 129, 129, 129, 126, 0, 0],

  /**
   * mouse — top-down mouse silhouette with click buttons
   *
   *  ..####..    60
   *  .######.   126
   *  .##.##..   108
   *  .######.   126
   *  .######.   126
   *  ..####..    60
   *  ..####..    60
   *  ...##...    24
   */
  mouse: [60, 126, 108, 126, 126, 60, 60, 24],

  /**
   * cursor — arrow cursor pointing top-left
   *
   *  #.......   128
   *  ##......   192
   *  ###.....   224
   *  ####....   240
   *  #####...   248
   *  ####....   240
   *  ##.##...   216
   *  #...#...   136
   */
  cursor: [128, 192, 224, 240, 248, 240, 216, 136],

  /**
   * gamepad — top-down game controller silhouette
   *
   *  ##....##   195
   *  ########   255
   *  ########   255
   *  .##..##.   102
   *  .##..##.   102
   *  ..####..    60
   *  ...##...    24
   *  ........     0
   */
  gamepad: [195, 255, 255, 102, 102, 60, 24, 0],

  // ─────────────────────────────────────────────────────────────────────────
  // STATUS / HUD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * shield — kite shield, pointed base
   *
   *  .######.   126
   *  ########   255
   *  ########   255
   *  .######.   126
   *  ..####..    60
   *  ...##...    24
   *  ........     0
   *  ........     0
   */
  shield: [126, 255, 255, 126, 60, 24, 0, 0],

  /**
   * skull — skull face with eye sockets and teeth
   *
   *  ..####..    60
   *  .######.   126
   *  #..##..#   153
   *  .######.   126
   *  ..####..    60
   *  .#.#.#..    84
   *  ........     0
   *  ........     0
   */
  skull: [60, 126, 153, 126, 60, 84, 0, 0],

  /**
   * mana_drop — mana / water teardrop
   *
   *  ...##...    24
   *  ..####..    60
   *  .######.   126
   *  .######.   126
   *  ..####..    60
   *  ...##...    24
   *  ....#...     8
   *  ........     0
   */
  mana_drop: [24, 60, 126, 126, 60, 24, 8, 0],

  /**
   * bar_full — progress / health bar, completely filled
   *
   *  ########   255
   *  #......#   129
   *  #######.   254
   *  #######.   254
   *  #######.   254
   *  #......#   129
   *  ########   255
   *  ........     0
   */
  bar_full: [255, 129, 254, 254, 254, 129, 255, 0],

  /**
   * bar_half — progress / health bar, half filled
   *
   *  ########   255
   *  #......#   129
   *  ####....   240
   *  ####....   240
   *  ####....   240
   *  #......#   129
   *  ########   255
   *  ........     0
   */
  bar_half: [255, 129, 240, 240, 240, 129, 255, 0],

  /**
   * bar_empty — progress / health bar, completely empty
   *
   *  ########   255
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  #......#   129
   *  ########   255
   *  ........     0
   */
  bar_empty: [255, 129, 129, 129, 129, 129, 255, 0],

  /**
   * bubble — speech bubble with ellipsis dots and tail
   *
   *  .######.   126
   *  #......#   129
   *  #..##..#   153
   *  #..##..#   153
   *  #......#   129
   *  #..##..#   153
   *  .######.   126
   *  ...##...    24
   */
  bubble: [126, 129, 153, 153, 129, 153, 126, 24],

  /**
   * lock — padlock with shackle arc
   *
   *  ..####..    60
   *  .#....#.    66
   *  .#....#.    66
   *  ########   255
   *  #......#   129
   *  #..##..#   153
   *  #..##..#   153
   *  ########   255
   */
  lock: [60, 66, 66, 255, 129, 153, 153, 255],

  /**
   * map_pin — hollow-circle location pin with pointed base
   *
   *  ..####..    60
   *  .#....#.    66
   *  #......#   129
   *  #......#   129
   *  .#....#.    66
   *  ..####..    60
   *  ...##...    24
   *  ....#...     8
   */
  map_pin: [60, 66, 129, 129, 66, 60, 24, 8],

  // ─────────────────────────────────────────────────────────────────────────
  // OBJECTS / ITEMS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * sword — vertical blade with crossguard and pommel
   *
   *  ...##...    24
   *  ...##...    24
   *  ...##...    24
   *  .######.   126
   *  ...##...    24
   *  ...##...    24
   *  ..####..    60
   *  ........     0
   */
  sword: [24, 24, 24, 126, 24, 24, 60, 0],

  /**
   * key_item — key with circular bow and teeth on shank
   *
   *  ..####..    60
   *  .#....#.    66
   *  .#....#.    66
   *  ..####..    60
   *  ...##...    24
   *  ...##.#.    26
   *  ...##.#.    26
   *  ...####.    30
   */
  key_item: [60, 66, 66, 60, 24, 26, 26, 30],

  /**
   * potion — flask with narrow neck, cap, and wide body
   *
   *  ..####..    60
   *  ...##...    24
   *  ..####..    60
   *  .######.   126
   *  ########   255
   *  ########   255
   *  .######.   126
   *  ..####..    60
   */
  potion: [60, 24, 60, 126, 255, 255, 126, 60],

  /**
   * chest — treasure chest with arched lid and keyhole
   *
   *  .######.   126
   *  ########   255
   *  ########   255
   *  ########   255
   *  #......#   129
   *  #..##..#   153
   *  #......#   129
   *  ########   255
   */
  chest: [126, 255, 255, 255, 129, 153, 129, 255],

  /**
   * bomb — round bomb with lit fuse at top
   *
   *  ....#...     8
   *  ...###..    28
   *  ..####..    60
   *  .######.   126
   *  ########   255
   *  ########   255
   *  .######.   126
   *  ..####..    60
   */
  bomb: [8, 28, 60, 126, 255, 255, 126, 60],

  /**
   * scroll — rolled parchment scroll with text area
   *
   *  ##....##   195
   *  ########   255
   *  #.####.#   189
   *  #.####.#   189
   *  #.####.#   189
   *  ########   255
   *  ##....##   195
   *  ........     0
   */
  scroll: [195, 255, 189, 189, 189, 255, 195, 0],

  /**
   * fire — asymmetric flame with tapered tip
   *
   *  ....#...    16
   *  ..##....    48
   *  .####...   120
   *  #.###...   184
   *  #######.   254
   *  .######.   126
   *  ..####..    60
   *  ........     0
   */
  fire: [16, 48, 120, 184, 254, 126, 60, 0],
};

/**
 * Complete metadata object for the 8×8 icon set, used by an
 * {@link IconBitmap} catalogue at module load time.
 *
 * @internal
 */
export const metadata = {
  /** Catalogue name. */
  name: ICONS_8x8_NAME,
  /** Cell width including spacing (8 + 2 = 10). */
  width: ICONS_8x8_WIDTH + ICONS_8x8_SPACING,
  /** Cell height (8). */
  height: ICONS_8x8_HEIGHT,
  /** Inter-icon spacing (2). */
  spacing: ICONS_8x8_SPACING,
  /** Supported icon keys. */
  keys: ICONS_8x8_KEYS,
  /** Icon bitmask data. */
  data: ICONS_8x8,
};

export default ICONS_8x8;
