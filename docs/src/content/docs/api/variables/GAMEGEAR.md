---
title: 'Variable: GAMEGEAR'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEGEAR

# Variable: GAMEGEAR

```ts
const GAMEGEAR: GeneratedPalette;
```

Defined in: [core/palettes/sega\_gamegear.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/sega_gamegear.ts#L45)

Sega Game Gear 12-bit RGB generated palette.

The Game Gear uses 4 bits per color channel (0-15), resulting in
4,096 possible colors. Use the `generate()` function to create
any color in the Game Gear color space.

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = GAMEGEAR.generate(15, 0, 0);    // Full red
const green = GAMEGEAR.generate(0, 15, 0);  // Full green
const blue = GAMEGEAR.generate(0, 0, 15);   // Full blue
const white = GAMEGEAR.generate(15, 15, 15); // White

// Medium brightness
const midRed = GAMEGEAR.generate(8, 0, 0);

// Random Game Gear color
const r = Math.floor(Math.random() * 16);
const g = Math.floor(Math.random() * 16);
const b = Math.floor(Math.random() * 16);
const random = GAMEGEAR.generate(r, g, b);
```
