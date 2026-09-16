---
title: 'Function: to3Bit()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / to3Bit

# Function: to3Bit()

```ts
function to3Bit(value: number): number;
```

Defined in: [core/palettes/sega\_genesis.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_genesis.ts#L104)

Converts an 8-bit RGB value (0-255) to Genesis 3-bit format.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 8-bit color value (0-255) |

## Returns

`number`

3-bit color value (0-7)

## Since

0.5.0

## Example

```ts
// Convert standard RGB to Genesis
const r = to3Bit(255); // 7
const g = to3Bit(128); // 4
const b = to3Bit(0);   // 0
const color = GENESIS.generate(r, g, b);
```
