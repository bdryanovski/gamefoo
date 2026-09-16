---
title: 'Function: getResolution()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getResolution

# Function: getResolution()

```ts
function getResolution(name: 
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
  | "EGA_64"): ScreenResolution;
```

Defined in: [core/consoles/index.ts:265](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L265)

Gets just the resolution for a console.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` \| `"ATARI_5200"` \| `"ATARI_7800"` \| `"N3DS"` \| `"SWITCH"` \| `"CGA"` \| `"EGA"` \| `"CGA_FULL"` \| `"EGA_64"` | Console name |

## Returns

[`ScreenResolution`](../interfaces/ScreenResolution.md)

Screen resolution

## Since

0.5.0
