---
title: 'Variable: PICO8'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PICO8

# Variable: PICO8

```ts
const PICO8: NamedColorPalette<Pico8Colors>;
```

Defined in: [core/palettes/pico8.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/pico8.ts#L58)

PICO-8 16-color palette.

## Since

0.5.0

## Example

```ts
// Array access
const red = PICO8.colors[8];

// Named access
const red2 = PICO8.named.RED;

// Use in rendering
ctx.fillRect(0, 0, 10, 10, PICO8.named.DARK_BLUE);
```
