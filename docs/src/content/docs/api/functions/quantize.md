---
title: 'Function: quantize()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / quantize

# Function: quantize()

```ts
function quantize(color: string, palette: ColorPalette): `#${string}`;
```

Defined in: [core/palettes/utils.ts:224](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L224)

Alias for nearestColor. Quantizes any color to the nearest palette color.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `color` | `string` | Color to quantize |
| `palette` | [`ColorPalette`](../interfaces/ColorPalette.md) | Target palette |

## Returns

`` `#${string}` ``

Nearest color from the palette

## Since

0.5.0

## Example

```ts
// Snap any color to Game Boy palette
const gbColor = quantize('#7F7F7F', GAMEBOY);
```
