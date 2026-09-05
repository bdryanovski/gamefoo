---
title: 'Function: nearestColor()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / nearestColor

# Function: nearestColor()

```ts
function nearestColor(palette: ColorPalette, targetHex: string): `#${string}`;
```

Defined in: [core/palettes/utils.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L193)

Finds the nearest color in a palette to a target color.
Uses Euclidean distance in RGB space.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | [`ColorPalette`](../interfaces/ColorPalette.md) | The palette to search |
| `targetHex` | `string` | Target color to match |

## Returns

`` `#${string}` ``

The closest color from the palette

## Since

0.5.0

## Example

```ts
// Find closest PICO-8 color to pure red
const closest = nearestColor(PICO8, '#FF0000');
// Returns '#FF004D' (PICO-8 red)
```
