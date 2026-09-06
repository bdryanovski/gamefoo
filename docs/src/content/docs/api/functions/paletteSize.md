---
title: 'Function: paletteSize()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / paletteSize

# Function: paletteSize()

```ts
function paletteSize(palette: 
  | ColorPalette
  | GeneratedPalette): number;
```

Defined in: [core/palettes/utils.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L98)

Gets the number of colors in a palette.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | \| [`ColorPalette`](../interfaces/ColorPalette.md) \| [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | The palette to measure |

## Returns

`number`

Number of colors (or totalColors for generated palettes)

## Since

0.5.0

## Example

```ts
paletteSize(PICO8);        // 16
paletteSize(SNES);         // 32768
```
