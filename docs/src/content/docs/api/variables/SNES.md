---
title: 'Variable: SNES'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SNES

# Variable: SNES

```ts
const SNES: GeneratedPalette;
```

Defined in: [core/palettes/snes.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/snes.ts#L45)

SNES 15-bit RGB generated palette.

The SNES uses 5 bits per color channel (0-31), resulting in
32,768 possible colors. Use the `generate()` function to create
any color in the SNES color space.

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = SNES.generate(31, 0, 0);      // Full red
const green = SNES.generate(0, 31, 0);    // Full green
const blue = SNES.generate(0, 0, 31);     // Full blue
const white = SNES.generate(31, 31, 31);  // White

// Medium gray
const gray = SNES.generate(16, 16, 16);

// Random SNES color
const r = Math.floor(Math.random() * 32);
const g = Math.floor(Math.random() * 32);
const b = Math.floor(Math.random() * 32);
const random = SNES.generate(r, g, b);
```
