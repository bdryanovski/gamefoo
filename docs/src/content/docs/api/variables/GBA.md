---
title: 'Variable: GBA'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GBA

# Variable: GBA

```ts
const GBA: GeneratedPalette;
```

Defined in: [core/palettes/gba.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/gba.ts#L34)

GBA 15-bit RGB generated palette.

The GBA uses 5 bits per color channel (0-31), resulting in
32,768 possible colors (same as SNES).

## Since

0.5.0

## Example

```ts
// Generate specific colors
const red = GBA.generate(31, 0, 0);
const green = GBA.generate(0, 31, 0);

// GBA screen has slightly different gamma
// Colors appear more washed out on real hardware
```
