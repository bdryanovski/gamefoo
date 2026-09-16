---
title: 'Variable: CGA'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CGA

# Variable: CGA

```ts
const CGA: NamedColorPalette<CgaColors>;
```

Defined in: [core/palettes/cga.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/cga.ts#L44)

CGA Mode 4, Palette 1, High Intensity (4 colors).

This is the iconic CGA palette used in many classic DOS games.

## Since

0.5.0

## Example

```ts
// Classic CGA look
ctx.fillRect(0, 0, 320, 200, CGA.named.BLACK);
ctx.fillRect(10, 10, 50, 50, CGA.named.CYAN);
ctx.fillRect(70, 10, 50, 50, CGA.named.MAGENTA);
```
