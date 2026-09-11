---
title: 'Function: binding()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / binding

# Function: binding()

```ts
function binding(keys: string | readonly string[], gamepad?: GamepadBinding): ActionBinding;
```

Defined in: [core/controls/scheme\_builder.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L79)

Creates an [ActionBinding](../interfaces/ActionBinding.md) from keys and optional gamepad config.

This is a convenience helper for defining action bindings with less
boilerplate. Accepts a single key string or array of keys.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keys` | `string` \| readonly `string`[] | Key(s) that trigger this action (single string or array) |
| `gamepad?` | [`GamepadBinding`](../interfaces/GamepadBinding.md) | Optional gamepad binding configuration |

## Returns

[`ActionBinding`](../interfaces/ActionBinding.md)

A complete ActionBinding object

## Since

0.5.0

## Examples

**Single key**

```ts
binding('space');
// => { keys: ['space'], gamepad: undefined }
```

**Multiple keys with gamepad**

```ts
binding(['x', 'j', 'space'], { button: 0 });
// => { keys: ['x', 'j', 'space'], gamepad: { button: 0 } }
```

**Empty binding (for unsupported actions)**

```ts
binding([]);
// => { keys: [], gamepad: undefined }
```
