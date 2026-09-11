---
title: 'Function: toSNES()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / toSNES

# Function: toSNES()

```ts
function toSNES(hex: string): `#${string}`;
```

Defined in: [core/palettes/snes.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/snes.ts#L114)

Converts a hex color to the nearest SNES-compatible color.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | Hex color string |

## Returns

`` `#${string}` ``

SNES-compatible hex color

## Since

0.5.0

## Example

```ts
// Quantize any color to SNES palette
const snesColor = toSNES('#7F3F1F');
```
