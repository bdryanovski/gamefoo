---
title: 'Variable: ATARI_2600'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ATARI\_2600

# Variable: ATARI\_2600

```ts
const ATARI_2600: NamedColorPalette<Atari2600Colors>;
```

Defined in: [core/palettes/atari2600.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/atari2600.ts#L53)

Atari 2600 128-color NTSC palette.

Colors are organized by hue (16 hues) × luminance (8 levels).
The first 8 colors are grayscale.

## Since

0.5.0

## Example

```ts
// Array access
const color = ATARI_2600.colors[64];

// Named access for common colors
const bg = ATARI_2600.named.BLACK;
```
