---
title: 'Interface: GeneratedPalette'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GeneratedPalette

# Interface: GeneratedPalette

Defined in: [core/palettes/types.ts:95](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L95)

A palette that generates colors programmatically.

Used for consoles with large color spaces (SNES, Genesis, etc.)
where defining all colors manually would be impractical.

## Since

0.5.0

## Example

```ts
const snes: GeneratedPalette = {
  name: 'SNES',
  totalColors: 32768,
  bitsPerChannel: 5,
  generate(r, g, b) {
    // Convert 5-bit RGB to hex
    return '#...';
  },
};

const red = snes.generate(31, 0, 0); // Full red
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="bitsperchannel"></a> `bitsPerChannel` | `readonly` | `number` | Bits per color channel (e.g., 5 for SNES 15-bit RGB). | [core/palettes/types.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L107) |
| <a id="commoncolors"></a> `commonColors?` | `readonly` | readonly `` `#${string}` ``[] | Optional subset of commonly used colors for quick access. | [core/palettes/types.ts:120](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L120) |
| <a id="name"></a> `name` | `readonly` | `string` | Display name of the palette. | [core/palettes/types.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L99) |
| <a id="totalcolors"></a> `totalColors` | `readonly` | `number` | Total number of possible colors. | [core/palettes/types.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L103) |

## Methods

### generate()

```ts
generate(
   r: number, 
   g: number, 
   b: number
): `#${string}`;
```

Defined in: [core/palettes/types.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L116)

Generates a hex color from channel values.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | Red channel value (0 to 2^bitsPerChannel - 1) |
| `g` | `number` | Green channel value (0 to 2^bitsPerChannel - 1) |
| `b` | `number` | Blue channel value (0 to 2^bitsPerChannel - 1) |

#### Returns

`` `#${string}` ``

Hex color string
