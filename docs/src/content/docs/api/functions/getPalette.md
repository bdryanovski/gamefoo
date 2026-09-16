---
title: 'Function: getPalette()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getPalette

# Function: getPalette()

```ts
function getPalette(name: 
  | "N64"
  | "NES"
  | "PSP"
  | "SNES"
  | "PICO8"
  | "TIC80"
  | "ATARI_2600"
  | "FAMICOM"
  | "GAMEBOY"
  | "GBC"
  | "GBA"
  | "NDS"
  | "GENESIS"
  | "MEGADRIVE"
  | "GAMEGEAR"
  | "DREAMCAST"
  | "PS1"
  | "NEO_GEO"
  | "C64"
  | "PLAYDATE"
  | "ATARI_5200"
  | "ATARI_7800"
  | "N3DS"
  | "SWITCH"
  | "CGA"
  | "EGA"
  | "CGA_FULL"
  | "EGA_64"): 
  | ColorPalette
  | GeneratedPalette;
```

Defined in: [core/consoles/index.ts:277](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L277)

Gets just the palette for a console.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` \| `"ATARI_5200"` \| `"ATARI_7800"` \| `"N3DS"` \| `"SWITCH"` \| `"CGA"` \| `"EGA"` \| `"CGA_FULL"` \| `"EGA_64"` | Console name |

## Returns

  \| [`ColorPalette`](../interfaces/ColorPalette.md)
  \| [`GeneratedPalette`](../interfaces/GeneratedPalette.md)

Color palette

## Since

0.5.0
