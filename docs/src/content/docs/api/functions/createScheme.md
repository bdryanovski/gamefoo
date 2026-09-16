---
title: 'Function: createScheme()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / createScheme

# Function: createScheme()

```ts
function createScheme(
   name: string, 
   actions: Partial<Record<InputAction, ActionBinding>>, 
   aliases?: Record<string, InputAction>
): ControlScheme;
```

Defined in: [core/controls/scheme\_builder.ts:233](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L233)

Creates a new control scheme from scratch with partial action definitions.

Actions not specified will have empty bindings (`{ keys: [] }`).
Use this for creating entirely new schemes rather than extending existing ones.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Display name for the scheme |
| `actions` | `Partial`\<`Record`\<[`InputAction`](../type-aliases/InputAction.md), [`ActionBinding`](../interfaces/ActionBinding.md)\>\> | Partial action bindings (unspecified actions get empty bindings) |
| `aliases` | `Record`\<`string`, [`InputAction`](../type-aliases/InputAction.md)\> | Optional console-specific aliases |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

A complete ControlScheme

## Since

0.5.0

## Example

**Minimal scheme**

```ts
const simple = createScheme('Simple', {
  UP: binding('arrowup'),
  DOWN: binding('arrowdown'),
  LEFT: binding('arrowleft'),
  RIGHT: binding('arrowright'),
  PRIMARY: binding('space'),
});
```
