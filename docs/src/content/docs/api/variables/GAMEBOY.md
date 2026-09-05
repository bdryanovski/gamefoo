---
title: 'Variable: GAMEBOY'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GAMEBOY

# Variable: GAMEBOY

```ts
const GAMEBOY: NamedColorPalette<GameBoyColors>;
```

Defined in: [core/palettes/gameboy.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/gameboy.ts#L47)

Original Game Boy (DMG) green-tinted palette.

This represents the classic green colors of the original
Game Boy's LCD display.

## Since

0.5.0

## Example

```ts
// Array access (darkest to lightest)
const darkest = GAMEBOY.colors[0];
const lightest = GAMEBOY.colors[3];

// Named access
const bg = GAMEBOY.named.LIGHTEST;
const fg = GAMEBOY.named.DARKEST;
```
