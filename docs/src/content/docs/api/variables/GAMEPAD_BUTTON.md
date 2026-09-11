---
title: 'Variable: GAMEPAD_BUTTON'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEPAD\_BUTTON

# Variable: GAMEPAD\_BUTTON

```ts
const GAMEPAD_BUTTON: {
  A: 0;
  B: 1;
  BACK: 8;
  DPAD_DOWN: 13;
  DPAD_LEFT: 14;
  DPAD_RIGHT: 15;
  DPAD_UP: 12;
  GUIDE: 16;
  HOME: 16;
  L1: 4;
  L2: 6;
  L3: 10;
  LB: 4;
  LEFT_STICK: 10;
  LT: 6;
  R1: 5;
  R2: 7;
  R3: 11;
  RB: 5;
  RIGHT_STICK: 11;
  RT: 7;
  SELECT: 8;
  START: 9;
  X: 2;
  Y: 3;
};
```

Defined in: [core/controls/gamepad\_mapping.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L35)

Standard Gamepad button indices.

These indices correspond to the W3C Standard Gamepad layout,
which is based on common console controller designs (Xbox/PlayStation).

```
           [6]                               [7]
           [4]                               [5]

                   [8]     [16]    [9]

         [12]                             [3]
      [14]  [15]       [10]  [11]      [2]  [1]
         [13]                             [0]
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-a"></a> `A` | `0` | `0` | A / Cross (×) - Bottom face button - Xbox: A (green) - PlayStation: Cross (×) - Nintendo: B | [core/controls/gamepad\_mapping.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L44) |
| <a id="property-b"></a> `B` | `1` | `1` | B / Circle (○) - Right face button - Xbox: B (red) - PlayStation: Circle (○) - Nintendo: A | [core/controls/gamepad\_mapping.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L53) |
| <a id="property-back"></a> `BACK` | `8` | `8` | Back / Select / Share - Xbox: Back / View - PlayStation: Select / Share - Nintendo: Minus (-) | [core/controls/gamepad\_mapping.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L122) |
| <a id="property-dpad_down"></a> `DPAD_DOWN` | `13` | `13` | D-Pad Down | [core/controls/gamepad\_mapping.ts:160](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L160) |
| <a id="property-dpad_left"></a> `DPAD_LEFT` | `14` | `14` | D-Pad Left | [core/controls/gamepad\_mapping.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L165) |
| <a id="property-dpad_right"></a> `DPAD_RIGHT` | `15` | `15` | D-Pad Right | [core/controls/gamepad\_mapping.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L170) |
| <a id="property-dpad_up"></a> `DPAD_UP` | `12` | `12` | D-Pad Up | [core/controls/gamepad\_mapping.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L155) |
| <a id="property-guide"></a> `GUIDE` | `16` | `16` | - | [core/controls/gamepad\_mapping.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L183) |
| <a id="property-home"></a> `HOME` | `16` | `16` | Home / Guide / PS Button - Xbox: Xbox button - PlayStation: PS button - Nintendo: Home Note: This button may not be accessible in browsers for security reasons. | [core/controls/gamepad\_mapping.ts:182](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L182) |
| <a id="property-l1"></a> `L1` | `4` | `4` | - | [core/controls/gamepad\_mapping.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L82) |
| <a id="property-l2"></a> `L2` | `6` | `6` | - | [core/controls/gamepad\_mapping.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L102) |
| <a id="property-l3"></a> `L3` | `10` | `10` | Left Stick Click / L3 Press down on left analog stick. | [core/controls/gamepad\_mapping.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L140) |
| <a id="property-lb"></a> `LB` | `4` | `4` | Left Bumper / L1 - Xbox: LB - PlayStation: L1 - Nintendo: L | [core/controls/gamepad\_mapping.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L81) |
| <a id="property-left_stick"></a> `LEFT_STICK` | `10` | `10` | - | [core/controls/gamepad\_mapping.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L141) |
| <a id="property-lt"></a> `LT` | `6` | `6` | Left Trigger / L2 - Xbox: LT - PlayStation: L2 - Nintendo: ZL | [core/controls/gamepad\_mapping.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L101) |
| <a id="property-r1"></a> `R1` | `5` | `5` | - | [core/controls/gamepad\_mapping.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L92) |
| <a id="property-r2"></a> `R2` | `7` | `7` | - | [core/controls/gamepad\_mapping.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L112) |
| <a id="property-r3"></a> `R3` | `11` | `11` | Right Stick Click / R3 Press down on right analog stick. | [core/controls/gamepad\_mapping.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L148) |
| <a id="property-rb"></a> `RB` | `5` | `5` | Right Bumper / R1 - Xbox: RB - PlayStation: R1 - Nintendo: R | [core/controls/gamepad\_mapping.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L91) |
| <a id="property-right_stick"></a> `RIGHT_STICK` | `11` | `11` | - | [core/controls/gamepad\_mapping.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L149) |
| <a id="property-rt"></a> `RT` | `7` | `7` | Right Trigger / R2 - Xbox: RT - PlayStation: R2 - Nintendo: ZR | [core/controls/gamepad\_mapping.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L111) |
| <a id="property-select"></a> `SELECT` | `8` | `8` | - | [core/controls/gamepad\_mapping.ts:123](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L123) |
| <a id="property-start"></a> `START` | `9` | `9` | Start / Options - Xbox: Start / Menu - PlayStation: Start / Options - Nintendo: Plus (+) | [core/controls/gamepad\_mapping.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L132) |
| <a id="property-x"></a> `X` | `2` | `2` | X / Square (□) - Left face button - Xbox: X (blue) - PlayStation: Square (□) - Nintendo: Y | [core/controls/gamepad\_mapping.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L62) |
| <a id="property-y"></a> `Y` | `3` | `3` | Y / Triangle (△) - Top face button - Xbox: Y (yellow) - PlayStation: Triangle (△) - Nintendo: X | [core/controls/gamepad\_mapping.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L71) |

## Since

0.5.0
