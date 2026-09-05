---
title: 'Interface: InputMapperOptions'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / InputMapperOptions

# Interface: InputMapperOptions

Defined in: [core/controls/types.ts:222](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L222)

Options for configuring an [InputMapper](../classes/InputMapper.md) instance.

## Since

0.5.0

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="deadzone"></a> `deadzone?` | `number` | `0.3` | Analog stick deadzone threshold (0.0 - 1.0). Axis values below this threshold are treated as zero. Helps prevent drift from analog sticks at rest. | [core/controls/types.ts:238](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L238) |
| <a id="gamepadindex"></a> `gamepadIndex?` | `number` | `0` (first connected gamepad) | Index of the gamepad to use (0-3). | [core/controls/types.ts:228](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L228) |
