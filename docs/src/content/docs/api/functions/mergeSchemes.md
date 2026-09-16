---
title: 'Function: mergeSchemes()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / mergeSchemes

# Function: mergeSchemes()

```ts
function mergeSchemes(name: string, ...schemes: Partial<Record<InputAction, ActionBinding>>[]): ControlScheme;
```

Defined in: [core/controls/scheme\_builder.ts:272](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L272)

Merges multiple partial schemes into one complete scheme.

Later schemes override earlier ones. Useful for composing schemes
from reusable parts (e.g., base directional + console-specific buttons).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Display name for the merged scheme |
| ...`schemes` | `Partial`\<`Record`\<[`InputAction`](../type-aliases/InputAction.md), [`ActionBinding`](../interfaces/ActionBinding.md)\>\>[] | Partial schemes to merge (later overrides earlier) |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

A complete ControlScheme

## Since

0.5.0

## Example

```ts
const directional = { UP: binding('w'), DOWN: binding('s'), ... };
const buttons = { PRIMARY: binding('x'), SECONDARY: binding('z') };

const combined = mergeSchemes('Combined', directional, buttons);
```
