---
title: 'Interface: GamepadBinding'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GamepadBinding

# Interface: GamepadBinding

Defined in: [core/controls/types.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L83)

Gamepad button/axis binding configuration.

Uses the W3C Standard Gamepad API mapping:

## See

[https://w3c.github.io/gamepad/#remapping](https://w3c.github.io/gamepad/#remapping)

## Since

0.5.0

## Examples

**Button binding**

```ts
// A button (index 0)
const aButton: GamepadBinding = { button: 0 };
```

**Axis binding (for D-pad via analog stick)**

```ts
// Left stick up
const up: GamepadBinding = { axis: 1, axisDirection: -1 };
// Left stick right
const right: GamepadBinding = { axis: 0, axisDirection: 1 };
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="axis"></a> `axis?` | `number` | Axis index (0-3 in standard mapping). Standard axes: - 0: Left stick X (-1 left, +1 right) - 1: Left stick Y (-1 up, +1 down) - 2: Right stick X - 3: Right stick Y | [core/controls/types.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L107) |
| <a id="axisdirection"></a> `axisDirection?` | `1` \| `-1` | Direction for axis-based inputs. - `1` for positive direction (right, down) - `-1` for negative direction (left, up) | [core/controls/types.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L115) |
| <a id="button"></a> `button?` | `number` | Button index (0-16 in standard mapping). Common indices: - 0: A/Cross - 1: B/Circle - 2: X/Square - 3: Y/Triangle - 8: Select/Back - 9: Start - 12-15: D-pad (Up, Down, Left, Right) | [core/controls/types.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L96) |
