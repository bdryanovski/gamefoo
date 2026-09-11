---
title: 'Function: to4Bit()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / to4Bit

# Function: to4Bit()

```ts
function to4Bit(value: number): number;
```

Defined in: [core/palettes/sega\_gamegear.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_gamegear.ts#L96)

Converts an 8-bit RGB value (0-255) to Game Gear 4-bit format.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 8-bit color value (0-255) |

## Returns

`number`

4-bit color value (0-15)

## Since

0.5.0

## Example

```ts
// Convert standard RGB to Game Gear
const r = to4Bit(255); // 15
const g = to4Bit(128); // 8
const b = to4Bit(0);   // 0
const color = GAMEGEAR.generate(r, g, b);
```
