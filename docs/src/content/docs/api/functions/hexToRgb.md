---
title: 'Function: hexToRgb()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / hexToRgb

# Function: hexToRgb()

```ts
function hexToRgb(hex: string): [number, number, number];
```

Defined in: [core/palettes/utils.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L25)

Converts a hex color string to RGB tuple.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | Hex color string (with or without #) |

## Returns

\[`number`, `number`, `number`\]

RGB tuple [r, g, b] with values 0-255

## Since

0.5.0

## Example

```ts
hexToRgb('#FF0000'); // [255, 0, 0]
hexToRgb('00FF00');  // [0, 255, 0]
```
