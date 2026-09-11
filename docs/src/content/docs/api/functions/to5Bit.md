---
title: 'Function: to5Bit()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / to5Bit

# Function: to5Bit()

```ts
function to5Bit(value: number): number;
```

Defined in: [core/palettes/snes.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/snes.ts#L96)

Converts an 8-bit RGB value (0-255) to SNES 5-bit format.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 8-bit color value (0-255) |

## Returns

`number`

5-bit color value (0-31)

## Since

0.5.0

## Example

```ts
// Convert standard RGB to SNES
const r = to5Bit(255); // 31
const g = to5Bit(128); // 16
const b = to5Bit(0);   // 0
const color = SNES.generate(r, g, b);
```
