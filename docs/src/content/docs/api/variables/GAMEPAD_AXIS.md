---
title: 'Variable: GAMEPAD_AXIS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEPAD\_AXIS

# Variable: GAMEPAD\_AXIS

```ts
const GAMEPAD_AXIS: {
  LEFT_STICK_X: 0;
  LEFT_STICK_Y: 1;
  RIGHT_STICK_X: 2;
  RIGHT_STICK_Y: 3;
};
```

Defined in: [core/controls/gamepad\_mapping.ts:202](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L202)

Standard Gamepad axis indices.

Axes return values from -1.0 to 1.0.

```
  Left Stick          Right Stick
     (1-)                (3-)
      ↑                   ↑
(0-) ←─→ (0+)       (2-) ←─→ (2+)
      ↓                   ↓
     (1+)                (3+)
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-left_stick_x"></a> `LEFT_STICK_X` | `0` | `0` | Left Stick Horizontal - Negative (-1): Left - Positive (+1): Right | [core/controls/gamepad\_mapping.ts:209](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L209) |
| <a id="property-left_stick_y"></a> `LEFT_STICK_Y` | `1` | `1` | Left Stick Vertical - Negative (-1): Up - Positive (+1): Down | [core/controls/gamepad\_mapping.ts:217](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L217) |
| <a id="property-right_stick_x"></a> `RIGHT_STICK_X` | `2` | `2` | Right Stick Horizontal - Negative (-1): Left - Positive (+1): Right | [core/controls/gamepad\_mapping.ts:225](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L225) |
| <a id="property-right_stick_y"></a> `RIGHT_STICK_Y` | `3` | `3` | Right Stick Vertical - Negative (-1): Up - Positive (+1): Down | [core/controls/gamepad\_mapping.ts:233](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/gamepad_mapping.ts#L233) |

## Since

0.5.0
