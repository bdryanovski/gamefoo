---
title: 'Interface: ActionBinding'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ActionBinding

# Interface: ActionBinding

Defined in: [core/controls/types.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L131)

Complete binding for a single action, combining keyboard and gamepad inputs.

## Since

0.5.0

## Example

```ts
const jumpBinding: ActionBinding = {
  keys: ['x', 'space'],           // X or Space on keyboard
  gamepad: { button: 0 },         // A button on gamepad
};
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="gamepad"></a> `gamepad?` | `readonly` | [`GamepadBinding`](GamepadBinding.md) | Optional gamepad binding for this action. | [core/controls/types.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L145) |
| <a id="keys"></a> `keys` | `readonly` | readonly `string`[] | Keyboard keys that trigger this action. Uses KeyboardEvent.key values (lowercased). Multiple keys allow alternative bindings. **Example** ``['x', 'j', 'space']`` | [core/controls/types.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/types.ts#L140) |
