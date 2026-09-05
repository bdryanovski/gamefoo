---
title: 'Function: toGenesis()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / toGenesis

# Function: toGenesis()

```ts
function toGenesis(hex: string): `#${string}`;
```

Defined in: [core/palettes/sega\_genesis.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_genesis.ts#L122)

Converts a hex color to the nearest Genesis-compatible color.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | Hex color string |

## Returns

`` `#${string}` ``

Genesis-compatible hex color

## Since

0.5.0

## Example

```ts
// Quantize any color to Genesis palette
const genesisColor = toGenesis('#7F3F1F');
```
