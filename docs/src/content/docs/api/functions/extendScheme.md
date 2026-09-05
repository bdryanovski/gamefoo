---
title: 'Function: extendScheme()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / extendScheme

# Function: extendScheme()

```ts
function extendScheme(base: ControlScheme, overrides: SchemeOverrides): ControlScheme;
```

Defined in: [core/controls/scheme\_builder.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/scheme_builder.ts#L146)

Creates a new control scheme by extending an existing one with overrides.

This is the primary way to customize control schemes. The base scheme
is cloned and modified according to the overrides:
- Action bindings are merged (override only specified properties)
- Aliases are merged (new aliases override existing ones)
- Name is replaced if provided, otherwise " (Custom)" is appended

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | [`ControlScheme`](../interfaces/ControlScheme.md) | The scheme to extend |
| `overrides` | [`SchemeOverrides`](../interfaces/SchemeOverrides.md) | Modifications to apply |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

A new ControlScheme with the overrides applied

## Since

0.5.0

## Examples

**Override specific keys**

```ts
const custom = extendScheme(NES_CONTROLS, {
  actions: {
    PRIMARY: { keys: ['space', 'x'] },  // Add space for jump
  },
});
```

**Add custom aliases**

```ts
const custom = extendScheme(NES_CONTROLS, {
  name: 'NES (Platformer)',
  aliases: {
    JUMP: 'PRIMARY',
    ATTACK: 'SECONDARY',
  },
});
```
