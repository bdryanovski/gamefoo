---
title: 'Function: paletteGradient()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / paletteGradient

# Function: paletteGradient()

```ts
function paletteGradient(
   palette: ColorPalette, 
   startIndex: number, 
   endIndex: number, 
   steps: number
): `#${string}`[];
```

Defined in: [core/palettes/utils.ts:245](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L245)

Creates a gradient of colors between two palette indices.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | [`ColorPalette`](../interfaces/ColorPalette.md) | Source palette |
| `startIndex` | `number` | Starting color index |
| `endIndex` | `number` | Ending color index |
| `steps` | `number` | Number of colors in the gradient |

## Returns

`` `#${string}` ``[]

Array of interpolated hex colors

## Since

0.5.0

## Example

```ts
// Create 5-step gradient from black to white in PICO-8
const gradient = paletteGradient(PICO8, 0, 7, 5);
```
