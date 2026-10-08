---
title: 'Function: rebindAction()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / rebindAction

# Function: rebindAction()

```ts
function rebindAction(
   scheme: ControlScheme, 
   action: InputAction, 
   keys: string[]
): ControlScheme;
```

Defined in: [core/controls/scheme\_builder.ts:197](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L197)

Creates a new scheme with a single action's keys rebound.

This is a convenience wrapper around [extendScheme](extendScheme.md) for the
common case of rebinding just one action's keyboard keys.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scheme` | [`ControlScheme`](../interfaces/ControlScheme.md) | The scheme to modify |
| `action` | [`InputAction`](../type-aliases/InputAction.md) | The action to rebind |
| `keys` | `string`[] | New keyboard keys for the action |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

A new ControlScheme with the action rebound

## Since

0.5.0

## Example

```ts
// Rebind jump to space only
const custom = rebindAction(NES_CONTROLS, 'PRIMARY', ['space']);
```
