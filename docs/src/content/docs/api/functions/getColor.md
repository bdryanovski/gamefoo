---
title: 'Function: getColor()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getColor

# Function: getColor()

```ts
function getColor(palette: ColorPalette, index: number): `#${string}`;
```

Defined in: [core/palettes/utils.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L148)

Gets a color by index with wrapping (modulo).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | [`ColorPalette`](../interfaces/ColorPalette.md) | The palette to pick from |
| `index` | `number` | Color index (wraps if out of bounds) |

## Returns

`` `#${string}` ``

The hex color at the wrapped index

## Since

0.5.0

## Example

```ts
getColor(PICO8, 0);  // First color
getColor(PICO8, 16); // Wraps to first color
getColor(PICO8, -1); // Last color
```
