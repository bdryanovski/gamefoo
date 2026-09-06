---
title: 'Variable: GENESIS'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GENESIS

# Variable: GENESIS

```ts
const GENESIS: GeneratedPalette;
```

Defined in: [core/palettes/sega\_genesis.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_genesis.ts#L45)

Sega Genesis / Mega Drive 9-bit RGB generated palette.

The Genesis uses 3 bits per color channel (0-7), resulting in
512 possible colors. Use the `generate()` function to create
any color in the Genesis color space.

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = GENESIS.generate(7, 0, 0);    // Full red
const green = GENESIS.generate(0, 7, 0);  // Full green
const blue = GENESIS.generate(0, 0, 7);   // Full blue
const white = GENESIS.generate(7, 7, 7);  // White

// Sonic blue
const sonicBlue = GENESIS.generate(0, 4, 7);

// Random Genesis color
const r = Math.floor(Math.random() * 8);
const g = Math.floor(Math.random() * 8);
const b = Math.floor(Math.random() * 8);
const random = GENESIS.generate(r, g, b);
```
