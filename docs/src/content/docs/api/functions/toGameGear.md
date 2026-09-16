---
title: 'Function: toGameGear()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / toGameGear

# Function: toGameGear()

```ts
function toGameGear(hex: string): `#${string}`;
```

Defined in: [core/palettes/sega\_gamegear.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_gamegear.ts#L114)

Converts a hex color to the nearest Game Gear-compatible color.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | Hex color string |

## Returns

`` `#${string}` ``

Game Gear-compatible hex color

## Since

0.5.0

## Example

```ts
// Quantize any color to Game Gear palette
const ggColor = toGameGear('#7F3F1F');
```
