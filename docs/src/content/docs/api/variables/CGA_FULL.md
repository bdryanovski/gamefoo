---
title: 'Variable: CGA_FULL'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CGA\_FULL

# Variable: CGA\_FULL

```ts
const CGA_FULL: NamedColorPalette<CgaFullColors>;
```

Defined in: [core/palettes/cga.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/cga.ts#L101)

Full CGA 16-color palette.

## Since

0.5.0

## Example

```ts
// Access all 16 CGA colors
for (let i = 0; i < CGA_FULL.colors.length; i++) {
  ctx.fillRect(i * 20, 0, 20, 20, CGA_FULL.colors[i]);
}
```
