---
title: 'Variable: EGA_64'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / EGA\_64

# Variable: EGA\_64

```ts
const EGA_64: NamedColorPalette<EgaColors>;
```

Defined in: [core/palettes/ega.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/ega.ts#L115)

Full EGA 64-color palette.

EGA uses 2 bits per channel (RGB), allowing 4 levels per channel
and 64 total colors. Colors are ordered by RGB value.

## Since

0.5.0

## Example

```ts
// Show all 64 EGA colors
for (let i = 0; i < EGA_64.colors.length; i++) {
  const x = (i % 8) * 20;
  const y = Math.floor(i / 8) * 20;
  ctx.fillRect(x, y, 20, 20, EGA_64.colors[i]);
}
```
