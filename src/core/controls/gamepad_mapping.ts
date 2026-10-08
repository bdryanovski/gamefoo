/**
 * W3C Standard Gamepad API mapping reference.
 *
 * This module documents the standard gamepad button and axis indices
 * as defined by the W3C Gamepad API specification, and provides
 * constants for easy reference in control schemes.
 *
 * @category Controls
 * @module controls/gamepad_mapping
 * @since 0.5.0
 *
 * @see {@link https://w3c.github.io/gamepad/#remapping} W3C Gamepad Specification
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API} MDN Gamepad API
 */

/**
 * Standard Gamepad button indices.
 *
 * These indices correspond to the W3C Standard Gamepad layout,
 * which is based on common console controller designs (Xbox/PlayStation).
 *
 * ```
 *            [6]                               [7]
 *            [4]                               [5]
 *
 *                    [8]     [16]    [9]
 *
 *          [12]                             [3]
 *       [14]  [15]       [10]  [11]      [2]  [1]
 *          [13]                             [0]
 * ```
 *
 * @since 0.5.0
 */
export const GAMEPAD_BUTTON = {
  // ── Face Buttons (Right Side) ─────────────────────────────────────
  /**
   * A / Cross (×) - Bottom face button
   *
   * - Xbox: A (green)
   * - PlayStation: Cross (×)
   * - Nintendo: B
   */
  A: 0,

  /**
   * B / Circle (○) - Right face button
   *
   * - Xbox: B (red)
   * - PlayStation: Circle (○)
   * - Nintendo: A
   */
  B: 1,

  /**
   * X / Square (□) - Left face button
   *
   * - Xbox: X (blue)
   * - PlayStation: Square (□)
   * - Nintendo: Y
   */
  X: 2,

  /**
   * Y / Triangle (△) - Top face button
   *
   * - Xbox: Y (yellow)
   * - PlayStation: Triangle (△)
   * - Nintendo: X
   */
  Y: 3,

  // ── Shoulder Buttons ──────────────────────────────────────────────
  /**
   * Left Bumper / L1
   *
   * - Xbox: LB
   * - PlayStation: L1
   * - Nintendo: L
   */
  LB: 4,
  L1: 4,

  /**
   * Right Bumper / R1
   *
   * - Xbox: RB
   * - PlayStation: R1
   * - Nintendo: R
   */
  RB: 5,
  R1: 5,

  /**
   * Left Trigger / L2
   *
   * - Xbox: LT
   * - PlayStation: L2
   * - Nintendo: ZL
   */
  LT: 6,
  L2: 6,

  /**
   * Right Trigger / R2
   *
   * - Xbox: RT
   * - PlayStation: R2
   * - Nintendo: ZR
   */
  RT: 7,
  R2: 7,

  // ── Center Buttons ────────────────────────────────────────────────
  /**
   * Back / Select / Share
   *
   * - Xbox: Back / View
   * - PlayStation: Select / Share
   * - Nintendo: Minus (-)
   */
  BACK: 8,
  SELECT: 8,

  /**
   * Start / Options
   *
   * - Xbox: Start / Menu
   * - PlayStation: Start / Options
   * - Nintendo: Plus (+)
   */
  START: 9,

  // ── Stick Clicks ──────────────────────────────────────────────────
  /**
   * Left Stick Click / L3
   *
   * Press down on left analog stick.
   */
  L3: 10,
  LEFT_STICK: 10,

  /**
   * Right Stick Click / R3
   *
   * Press down on right analog stick.
   */
  R3: 11,
  RIGHT_STICK: 11,

  // ── D-Pad ─────────────────────────────────────────────────────────
  /**
   * D-Pad Up
   */
  DPAD_UP: 12,

  /**
   * D-Pad Down
   */
  DPAD_DOWN: 13,

  /**
   * D-Pad Left
   */
  DPAD_LEFT: 14,

  /**
   * D-Pad Right
   */
  DPAD_RIGHT: 15,

  // ── Special ───────────────────────────────────────────────────────
  /**
   * Home / Guide / PS Button
   *
   * - Xbox: Xbox button
   * - PlayStation: PS button
   * - Nintendo: Home
   *
   * Note: This button may not be accessible in browsers for security reasons.
   */
  HOME: 16,
  GUIDE: 16,
} as const;

/**
 * Standard Gamepad axis indices.
 *
 * Axes return values from -1.0 to 1.0.
 *
 * ```
 *   Left Stick          Right Stick
 *      (1-)                (3-)
 *       ↑                   ↑
 * (0-) ←─→ (0+)       (2-) ←─→ (2+)
 *       ↓                   ↓
 *      (1+)                (3+)
 * ```
 *
 * @since 0.5.0
 */
export const GAMEPAD_AXIS = {
  /**
   * Left Stick Horizontal
   *
   * - Negative (-1): Left
   * - Positive (+1): Right
   */
  LEFT_STICK_X: 0,

  /**
   * Left Stick Vertical
   *
   * - Negative (-1): Up
   * - Positive (+1): Down
   */
  LEFT_STICK_Y: 1,

  /**
   * Right Stick Horizontal
   *
   * - Negative (-1): Left
   * - Positive (+1): Right
   */
  RIGHT_STICK_X: 2,

  /**
   * Right Stick Vertical
   *
   * - Negative (-1): Up
   * - Positive (+1): Down
   */
  RIGHT_STICK_Y: 3,
} as const;

/**
 * Console controller to Standard Gamepad mapping legend.
 *
 * This documents how physical buttons on various console controllers
 * map to the W3C Standard Gamepad indices.
 *
 * @since 0.5.0
 */
export const CONTROLLER_LEGEND = {
  /**
   * Xbox Controller (Standard Reference)
   *
   * The W3C Standard Gamepad is based on Xbox layout.
   *
   * ```
   *            [LT:6]                          [RT:7]
   *            [LB:4]                          [RB:5]
   *
   *                  [Back:8] [Guide:16] [Start:9]
   *
   *          [↑:12]                            [Y:3]
   *       [←:14][→:15]   [L3:10] [R3:11]    [X:2] [B:1]
   *          [↓:13]                            [A:0]
   *
   *              [Left Stick]    [Right Stick]
   *               Axes: 0,1       Axes: 2,3
   * ```
   */
  XBOX: {
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    LB: 4,
    RB: 5,
    LT: 6,
    RT: 7,
    BACK: 8,
    START: 9,
    LEFT_STICK_CLICK: 10,
    RIGHT_STICK_CLICK: 11,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
    GUIDE: 16,
  },

  /**
   * PlayStation Controller (DualShock / DualSense)
   *
   * ```
   *            [L2:6]                          [R2:7]
   *            [L1:4]                          [R1:5]
   *
   *                [Share:8] [PS:16] [Options:9]
   *
   *          [↑:12]                            [△:3]
   *       [←:14][→:15]   [L3:10] [R3:11]    [□:2] [○:1]
   *          [↓:13]                            [×:0]
   *
   *              [Left Stick]    [Right Stick]
   *               Axes: 0,1       Axes: 2,3
   * ```
   */
  PLAYSTATION: {
    CROSS: 0, // ×
    CIRCLE: 1, // ○
    SQUARE: 2, // □
    TRIANGLE: 3, // △
    L1: 4,
    R1: 5,
    L2: 6,
    R2: 7,
    SHARE: 8, // or SELECT
    OPTIONS: 9, // or START
    L3: 10,
    R3: 11,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
    PS_BUTTON: 16,
  },

  /**
   * Nintendo Switch Pro Controller
   *
   * Note: Nintendo uses opposite A/B and X/Y positions compared to Xbox.
   * The Standard Gamepad maps positionally, so Nintendo's A is button 1.
   *
   * ```
   *            [ZL:6]                          [ZR:7]
   *            [L:4]                           [R:5]
   *
   *                 [-:8]  [Home:16]  [+:9]
   *
   *          [↑:12]                            [X:3]
   *       [←:14][→:15]   [L3:10] [R3:11]    [Y:2] [A:1]
   *          [↓:13]                            [B:0]
   *
   *              [Left Stick]    [Right Stick]
   *               Axes: 0,1       Axes: 2,3
   * ```
   *
   * Physical to Standard mapping:
   * - Nintendo B (bottom) → Standard 0 (A position)
   * - Nintendo A (right) → Standard 1 (B position)
   * - Nintendo Y (left) → Standard 2 (X position)
   * - Nintendo X (top) → Standard 3 (Y position)
   */
  NINTENDO: {
    B: 0, // Bottom position (A on Xbox)
    A: 1, // Right position (B on Xbox)
    Y: 2, // Left position (X on Xbox)
    X: 3, // Top position (Y on Xbox)
    L: 4,
    R: 5,
    ZL: 6,
    ZR: 7,
    MINUS: 8,
    PLUS: 9,
    LEFT_STICK_CLICK: 10,
    RIGHT_STICK_CLICK: 11,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
    HOME: 16,
  },

  /**
   * Generic / 8BitDo style controllers
   *
   * Many retro-style USB controllers follow the SNES layout
   * mapped to standard gamepad positions.
   *
   * ```
   *            [L:4]                           [R:5]
   *
   *                  [Select:8]  [Start:9]
   *
   *          [↑:12]                            [X:3]
   *       [←:14][→:15]                      [Y:2] [A:1]
   *          [↓:13]                            [B:0]
   * ```
   */
  GENERIC_RETRO: {
    B: 0, // Right-bottom (like SNES B)
    A: 1, // Right-right (like SNES A)
    Y: 2, // Right-left (like SNES Y)
    X: 3, // Right-top (like SNES X)
    L: 4,
    R: 5,
    SELECT: 8,
    START: 9,
    DPAD_UP: 12,
    DPAD_DOWN: 13,
    DPAD_LEFT: 14,
    DPAD_RIGHT: 15,
  },
} as const;

/**
 * Console-specific button labels for UI display.
 *
 * Use these labels when showing controller prompts to users.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const label = BUTTON_LABELS.PLAYSTATION[0]; // "×"
 * const prompt = `Press ${label} to jump`;
 * ```
 */
export const BUTTON_LABELS = {
  /**
   * Xbox button labels
   */
  XBOX: {
    0: 'A',
    1: 'B',
    2: 'X',
    3: 'Y',
    4: 'LB',
    5: 'RB',
    6: 'LT',
    7: 'RT',
    8: 'Back',
    9: 'Start',
    10: 'LS',
    11: 'RS',
    12: '↑',
    13: '↓',
    14: '←',
    15: '→',
    16: 'Guide',
  } as Record<number, string>,

  /**
   * PlayStation button labels (using symbols)
   */
  PLAYSTATION: {
    0: '×',
    1: '○',
    2: '□',
    3: '△',
    4: 'L1',
    5: 'R1',
    6: 'L2',
    7: 'R2',
    8: 'Share',
    9: 'Options',
    10: 'L3',
    11: 'R3',
    12: '↑',
    13: '↓',
    14: '←',
    15: '→',
    16: 'PS',
  } as Record<number, string>,

  /**
   * PlayStation button labels (using names)
   */
  PLAYSTATION_NAMES: {
    0: 'Cross',
    1: 'Circle',
    2: 'Square',
    3: 'Triangle',
    4: 'L1',
    5: 'R1',
    6: 'L2',
    7: 'R2',
    8: 'Share',
    9: 'Options',
    10: 'L3',
    11: 'R3',
    12: 'Up',
    13: 'Down',
    14: 'Left',
    15: 'Right',
    16: 'PS',
  } as Record<number, string>,

  /**
   * Nintendo button labels
   */
  NINTENDO: {
    0: 'B',
    1: 'A',
    2: 'Y',
    3: 'X',
    4: 'L',
    5: 'R',
    6: 'ZL',
    7: 'ZR',
    8: '−',
    9: '+',
    10: 'LS',
    11: 'RS',
    12: '↑',
    13: '↓',
    14: '←',
    15: '→',
    16: 'Home',
  } as Record<number, string>,

  /**
   * Generic labels (positional)
   */
  GENERIC: {
    0: 'Button 1',
    1: 'Button 2',
    2: 'Button 3',
    3: 'Button 4',
    4: 'L1',
    5: 'R1',
    6: 'L2',
    7: 'R2',
    8: 'Select',
    9: 'Start',
    10: 'L3',
    11: 'R3',
    12: 'Up',
    13: 'Down',
    14: 'Left',
    15: 'Right',
    16: 'Home',
  } as Record<number, string>,
} as const;

/**
 * Type for button label style.
 *
 * @since 0.5.0
 */
export type ButtonLabelStyle = keyof typeof BUTTON_LABELS;

/**
 * Gets a human-readable label for a gamepad button.
 *
 * @param buttonIndex - Standard Gamepad button index (0-16)
 * @param style - Label style (XBOX, PLAYSTATION, NINTENDO, GENERIC)
 * @returns Human-readable button label
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * getButtonLabel(0, 'XBOX');        // "A"
 * getButtonLabel(0, 'PLAYSTATION'); // "×"
 * getButtonLabel(0, 'NINTENDO');    // "B"
 * ```
 */
export function getButtonLabel(buttonIndex: number, style: ButtonLabelStyle = 'GENERIC'): string {
  return BUTTON_LABELS[style][buttonIndex] ?? `Button ${buttonIndex}`;
}
