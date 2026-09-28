---
title: 'Variable: PLAYDATE'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PLAYDATE

# Variable: PLAYDATE

```ts
const PLAYDATE: NamedColorPalette<PlaydateColors>;
```

Defined in: [core/palettes/playdate.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/playdate.ts#L42)

Playdate 1-bit (2-color) palette.

The Playdate's display only shows black and white.
Grayscale effects are achieved through dithering.

## Since

0.5.0

## Example

```ts
// Simple black and white
ctx.fillRect(0, 0, 100, 100, PLAYDATE.named.BLACK);
ctx.fillRect(100, 0, 100, 100, PLAYDATE.named.WHITE);
```
