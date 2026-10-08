---
title: 'Function: randomColor()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / randomColor

# Function: randomColor()

```ts
function randomColor(palette: 
  | ColorPalette
  | GeneratedPalette): `#${string}`;
```

Defined in: [core/palettes/utils.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L119)

Gets a random color from a palette.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | \| [`ColorPalette`](../interfaces/ColorPalette.md) \| [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | The palette to pick from |

## Returns

`` `#${string}` ``

A random hex color from the palette

## Since

0.5.0

## Example

```ts
const color = randomColor(PICO8);
ctx.fillStyle = color;
```
