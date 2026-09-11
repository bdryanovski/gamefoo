---
title: 'Variable: NES'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NES

# Variable: NES

```ts
const NES: NamedColorPalette<NesColors>;
```

Defined in: [core/palettes/nes.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/nes.ts#L83)

NES 54-color palette (FCEUX-based).

Colors are organized by hue and brightness level.
The full 64-entry PPU palette includes duplicates and
"blacker than black" colors that are omitted here.

## Since

0.5.0

## Example

```ts
// Array access
const marioRed = NES.colors[6];

// Named access for common colors
const sky = NES.named.LIGHT_BLUE;
const grass = NES.named.GREEN;
```
