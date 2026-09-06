---
title: 'Function: rgbToHex()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / rgbToHex

# Function: rgbToHex()

```ts
function rgbToHex(
   r: number, 
   g: number, 
   b: number
): `#${string}`;
```

Defined in: [core/palettes/utils.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L53)

Converts RGB values to a hex color string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | Red channel (0-255) |
| `g` | `number` | Green channel (0-255) |
| `b` | `number` | Blue channel (0-255) |

## Returns

`` `#${string}` ``

Hex color string in format #RRGGBB

## Since

0.5.0

## Example

```ts
rgbToHex(255, 0, 0);   // '#FF0000'
rgbToHex(0, 255, 128); // '#00FF80'
```
