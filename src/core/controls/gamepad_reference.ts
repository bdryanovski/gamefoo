/**
 * Gamepad Controller Reference Guide
 *
 * This file documents the W3C Standard Gamepad API button and axis mappings,
 * with visual diagrams showing how different controller types map to the
 * standard indices.
 *
 * @category Controls
 * @module controls/gamepad_reference
 * @since 0.5.0
 *
 * @see {@link https://w3c.github.io/gamepad/#remapping} W3C Gamepad Specification
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * W3C STANDARD GAMEPAD BUTTON INDICES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The W3C Standard Gamepad defines 17 buttons (indices 0-16) and 4 axes (0-3).
 * All modern controllers map to this standard layout.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                        STANDARD GAMEPAD LAYOUT                              │
 * │                                                                             │
 * │            ┌─────┐                                   ┌─────┐                │
 * │            │  6  │ Left Trigger          Right Trigger│  7  │               │
 * │            └─────┘                                   └─────┘                │
 * │            ┌─────┐                                   ┌─────┐                │
 * │            │  4  │ Left Bumper          Right Bumper │  5  │                │
 * │            └─────┘                                   └─────┘                │
 * │                                                                             │
 * │                    ┌───┐         ┌───┐         ┌───┐                        │
 * │                    │ 8 │  Back   │16 │  Guide  │ 9 │  Start                 │
 * │                    └───┘         └───┘         └───┘                        │
 * │                                                                             │
 * │         ┌───┐                                              ┌───┐            │
 * │         │12 │  D-Up                                  Y/△   │ 3 │            │
 * │      ┌──┴───┴──┐                                        ┌──┴───┴──┐         │
 * │      │14 │ │15 │  D-Left/Right      ┌───┐  ┌───┐  X/□   │ 2 │ │ 1 │  B/○    │
 * │      └──┬───┬──┘                    │10 │  │11 │        └──┬───┬──┘         │
 * │         │13 │  D-Down               └───┘  └───┘           │ 0 │  A/×       │
 * │         └───┘                       L3      R3             └───┘            │
 * │                                                                             │
 * │              ┌─────────┐                      ┌─────────┐                    │
 * │              │ L.Stick │                      │ R.Stick │                    │
 * │              │ Axis 0,1│                      │ Axis 2,3│                    │
 * │              └─────────┘                      └─────────┘                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * BUTTON INDEX TABLE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ┌───────┬────────────────┬────────────────┬────────────────┬─────────────────┐
 * │ Index │     Xbox       │  PlayStation   │    Nintendo    │    Generic      │
 * ├───────┼────────────────┼────────────────┼────────────────┼─────────────────┤
 * │   0   │ A (green)      │ × Cross        │ B              │ Bottom button   │
 * │   1   │ B (red)        │ ○ Circle       │ A              │ Right button    │
 * │   2   │ X (blue)       │ □ Square       │ Y              │ Left button     │
 * │   3   │ Y (yellow)     │ △ Triangle     │ X              │ Top button      │
 * ├───────┼────────────────┼────────────────┼────────────────┼─────────────────┤
 * │   4   │ LB             │ L1             │ L              │ Left Bumper     │
 * │   5   │ RB             │ R1             │ R              │ Right Bumper    │
 * │   6   │ LT             │ L2             │ ZL             │ Left Trigger    │
 * │   7   │ RT             │ R2             │ ZR             │ Right Trigger   │
 * ├───────┼────────────────┼────────────────┼────────────────┼─────────────────┤
 * │   8   │ Back/View      │ Share          │ − (Minus)      │ Select/Back     │
 * │   9   │ Start/Menu     │ Options        │ + (Plus)       │ Start           │
 * │  10   │ Left Stick     │ L3             │ Left Stick     │ L3              │
 * │  11   │ Right Stick    │ R3             │ Right Stick    │ R3              │
 * ├───────┼────────────────┼────────────────┼────────────────┼─────────────────┤
 * │  12   │ D-pad Up       │ D-pad Up       │ D-pad Up       │ D-pad Up        │
 * │  13   │ D-pad Down     │ D-pad Down     │ D-pad Down     │ D-pad Down      │
 * │  14   │ D-pad Left     │ D-pad Left     │ D-pad Left     │ D-pad Left      │
 * │  15   │ D-pad Right    │ D-pad Right    │ D-pad Right    │ D-pad Right     │
 * ├───────┼────────────────┼────────────────┼────────────────┼─────────────────┤
 * │  16   │ Xbox Button    │ PS Button      │ Home           │ Guide/Home      │
 * └───────┴────────────────┴────────────────┴────────────────┴─────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * AXIS INDEX TABLE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ┌───────┬─────────────────────┬──────────────────────────────────────────────┐
 * │ Index │       Axis          │                  Range                       │
 * ├───────┼─────────────────────┼──────────────────────────────────────────────┤
 * │   0   │ Left Stick X        │ -1.0 (left) ←───────→ +1.0 (right)           │
 * │   1   │ Left Stick Y        │ -1.0 (up)   ↑───────↓ +1.0 (down)            │
 * │   2   │ Right Stick X       │ -1.0 (left) ←───────→ +1.0 (right)           │
 * │   3   │ Right Stick Y       │ -1.0 (up)   ↑───────↓ +1.0 (down)            │
 * └───────┴─────────────────────┴──────────────────────────────────────────────┘
 *
 * Note: A deadzone of 0.1-0.3 is recommended to prevent stick drift.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * XBOX CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │            XBOX CONTROLLER              │
 *                    │                                         │
 *                    │    [LT:6]                   [RT:7]      │
 *                    │    [LB:4]                   [RB:5]      │
 *                    │                                         │
 *                    │              ≡        ⊕        ☰        │
 *                    │           [8:Back] [16:Xbox] [9:Start]  │
 *                    │                                         │
 *                    │    (Ↄ)                          [Y:3]   │
 *                    │   L.Stick                    [X:2] [B:1]│
 *                    │  [10:L3]     [12]              [A:0]    │
 *                    │           [14]  [15]                    │
 *                    │              [13]         (Ↄ)           │
 *                    │                          R.Stick        │
 *                    │                          [11:R3]        │
 *                    │                                         │
 *                    └─────────────────────────────────────────┘
 *
 *   Face Buttons:  A=0 (green), B=1 (red), X=2 (blue), Y=3 (yellow)
 *   Shoulders:     LB=4, RB=5, LT=6, RT=7
 *   System:        Back=8, Start=9, Xbox=16
 *   Sticks:        L3=10, R3=11
 *   D-Pad:         Up=12, Down=13, Left=14, Right=15
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLAYSTATION CONTROLLER (DualShock / DualSense)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │         PLAYSTATION CONTROLLER          │
 *                    │                                         │
 *                    │    [L2:6]                   [R2:7]      │
 *                    │    [L1:4]                   [R1:5]      │
 *                    │                                         │
 *                    │           Share     PS    Options       │
 *                    │            [8]     [16]     [9]         │
 *                    │                                         │
 *                    │    (Ↄ)                          [△:3]   │
 *                    │   L.Stick                    [□:2] [○:1]│
 *                    │  [10:L3]     [12]              [×:0]    │
 *                    │           [14]  [15]                    │
 *                    │              [13]         (Ↄ)           │
 *                    │                          R.Stick        │
 *                    │                          [11:R3]        │
 *                    │                                         │
 *                    └─────────────────────────────────────────┘
 *
 *   Face Buttons:  × Cross=0, ○ Circle=1, □ Square=2, △ Triangle=3
 *   Shoulders:     L1=4, R1=5, L2=6, R2=7
 *   System:        Share=8, Options=9, PS=16
 *   Sticks:        L3=10, R3=11
 *   D-Pad:         Up=12, Down=13, Left=14, Right=15
 *
 *   Regional Note: In Japan, ○ is confirm and × is cancel.
 *                  In the West, × is confirm and ○ is cancel.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * NINTENDO SWITCH PRO CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │      NINTENDO SWITCH PRO CONTROLLER     │
 *                    │                                         │
 *                    │    [ZL:6]                   [ZR:7]      │
 *                    │    [L:4]                    [R:5]       │
 *                    │                                         │
 *                    │            −       ⌂        +           │
 *                    │           [8]    [16:Home] [9]          │
 *                    │                                         │
 *                    │    (Ↄ)                          [X:3]   │
 *                    │   L.Stick                    [Y:2] [A:1]│
 *                    │  [10:L3]     [12]              [B:0]    │
 *                    │           [14]  [15]                    │
 *                    │              [13]         (Ↄ)           │
 *                    │                          R.Stick        │
 *                    │                          [11:R3]        │
 *                    │                                         │
 *                    └─────────────────────────────────────────┘
 *
 *   Face Buttons:  B=0, A=1, Y=2, X=3  (NOTE: Opposite positions from Xbox!)
 *   Shoulders:     L=4, R=5, ZL=6, ZR=7
 *   System:        −=8, +=9, Home=16
 *   Sticks:        L3=10, R3=11
 *   D-Pad:         Up=12, Down=13, Left=14, Right=15
 *
 *   IMPORTANT: Nintendo buttons are mapped by POSITION, not by LABEL!
 *   - Nintendo B (bottom) → Index 0 (same position as Xbox A)
 *   - Nintendo A (right)  → Index 1 (same position as Xbox B)
 *   - Nintendo Y (left)   → Index 2 (same position as Xbox X)
 *   - Nintendo X (top)    → Index 3 (same position as Xbox Y)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * RETRO / 8BITDO STYLE CONTROLLER (SNES Layout)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *                    ┌─────────────────────────────────────────┐
 *                    │       RETRO CONTROLLER (SNES Style)     │
 *                    │                                         │
 *                    │    [L:4]                    [R:5]       │
 *                    │                                         │
 *                    │            Select    Start              │
 *                    │             [8]       [9]               │
 *                    │                                         │
 *                    │                                 [X:3]   │
 *                    │      [12]                    [Y:2] [A:1]│
 *                    │   [14]  [15]                   [B:0]    │
 *                    │      [13]                               │
 *                    │                                         │
 *                    └─────────────────────────────────────────┘
 *
 *   Face Buttons:  B=0, A=1, Y=2, X=3 (SNES layout)
 *   Shoulders:     L=4, R=5
 *   System:        Select=8, Start=9
 *   D-Pad:         Up=12, Down=13, Left=14, Right=15
 *   No Sticks:     No analog sticks on classic controllers
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE CARD
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *   FACE BUTTONS (by position):
 *   ┌─────────────┬───────┬───────┬───────┬───────┐
 *   │  Position   │ Index │ Xbox  │  PS   │ Nintn │
 *   ├─────────────┼───────┼───────┼───────┼───────┤
 *   │   Bottom    │   0   │   A   │   ×   │   B   │
 *   │   Right     │   1   │   B   │   ○   │   A   │
 *   │   Left      │   2   │   X   │   □   │   Y   │
 *   │   Top       │   3   │   Y   │   △   │   X   │
 *   └─────────────┴───────┴───────┴───────┴───────┘
 *
 *   SHOULDERS & TRIGGERS:
 *   ┌─────────────┬───────┬───────┬───────┬───────┐
 *   │  Position   │ Index │ Xbox  │  PS   │ Nintn │
 *   ├─────────────┼───────┼───────┼───────┼───────┤
 *   │ Left Bump   │   4   │  LB   │  L1   │   L   │
 *   │ Right Bump  │   5   │  RB   │  R1   │   R   │
 *   │ Left Trig   │   6   │  LT   │  L2   │  ZL   │
 *   │ Right Trig  │   7   │  RT   │  R2   │  ZR   │
 *   └─────────────┴───────┴───────┴───────┴───────┘
 *
 *   SYSTEM BUTTONS:
 *   ┌─────────────┬───────┬───────┬─────────┬───────┐
 *   │  Function   │ Index │ Xbox  │   PS    │ Nintn │
 *   ├─────────────┼───────┼───────┼─────────┼───────┤
 *   │ Select/Back │   8   │ Back  │ Share   │   −   │
 *   │ Start/Menu  │   9   │ Start │ Options │   +   │
 *   │ L Stick Clk │  10   │  LS   │   L3    │  LS   │
 *   │ R Stick Clk │  11   │  RS   │   R3    │  RS   │
 *   │ Guide/Home  │  16   │ Xbox  │   PS    │ Home  │
 *   └─────────────┴───────┴───────┴─────────┴───────┘
 *
 *   D-PAD:
 *   ┌─────────────┬───────┐
 *   │  Direction  │ Index │
 *   ├─────────────┼───────┤
 *   │     Up      │  12   │
 *   │    Down     │  13   │
 *   │    Left     │  14   │
 *   │   Right     │  15   │
 *   └─────────────┴───────┘
 *
 *   ANALOG AXES:
 *   ┌─────────────────────┬───────┬─────────────────────┐
 *   │        Axis         │ Index │       Range         │
 *   ├─────────────────────┼───────┼─────────────────────┤
 *   │ Left Stick X        │   0   │ -1 (L) to +1 (R)    │
 *   │ Left Stick Y        │   1   │ -1 (U) to +1 (D)    │
 *   │ Right Stick X       │   2   │ -1 (L) to +1 (R)    │
 *   │ Right Stick Y       │   3   │ -1 (U) to +1 (D)    │
 *   └─────────────────────┴───────┴─────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * USAGE EXAMPLES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @example Reading gamepad input directly
 * ```ts
 * const gamepad = navigator.getGamepads()[0];
 * if (gamepad) {
 *   // Check A button (index 0)
 *   if (gamepad.buttons[0].pressed) {
 *     player.jump();
 *   }
 *
 *   // Check left stick
 *   const stickX = gamepad.axes[0];
 *   const stickY = gamepad.axes[1];
 *   if (Math.abs(stickX) > 0.3) { // Apply deadzone
 *     player.moveX(stickX);
 *   }
 * }
 * ```
 *
 * @example Using GAMEPAD_BUTTON constants
 * ```ts
 * import { GAMEPAD_BUTTON, GAMEPAD_AXIS } from 'gamefoo';
 *
 * const gamepad = navigator.getGamepads()[0];
 * if (gamepad) {
 *   if (gamepad.buttons[GAMEPAD_BUTTON.A].pressed) player.jump();
 *   if (gamepad.buttons[GAMEPAD_BUTTON.DPAD_UP].pressed) player.moveUp();
 *
 *   const moveX = gamepad.axes[GAMEPAD_AXIS.LEFT_STICK_X];
 *   const moveY = gamepad.axes[GAMEPAD_AXIS.LEFT_STICK_Y];
 * }
 * ```
 *
 * @example Displaying button prompts
 * ```ts
 * import { getButtonLabel } from 'gamefoo';
 *
 * // Detect controller type (simplified)
 * const controllerType = detectControllerType(gamepad.id);
 *
 * // Show appropriate prompt
 * const jumpButton = getButtonLabel(0, controllerType);
 * ui.showPrompt(`Press ${jumpButton} to jump`);
 * // Xbox: "Press A to jump"
 * // PlayStation: "Press × to jump"
 * // Nintendo: "Press B to jump"
 * ```
 */

// This file is documentation-only.
// See gamepad_mapping.ts for the actual exports.

export {};
