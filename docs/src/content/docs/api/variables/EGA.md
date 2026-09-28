---
title: 'Variable: EGA'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / EGA

# Variable: EGA

```ts
const EGA: NamedColorPalette<EgaColors>;
```

Defined in: [core/palettes/ega.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/ega.ts#L57)

EGA default 16-color palette.

This is the standard EGA palette that matches CGA colors.
EGA could display any 16 colors from its 64-color space,
but this default was used for CGA compatibility.

## Since

0.5.0

## Example

```ts
// Draw with EGA colors
ctx.fillRect(0, 0, 10, 10, EGA.named.LIGHT_BLUE);
ctx.fillRect(10, 0, 10, 10, EGA.named.YELLOW);
```
