---
title: 'Function: getControlSchemeName()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getControlSchemeName

# Function: getControlSchemeName()

```ts
function getControlSchemeName(consoleName: 
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
  | "N64"
  | "NES"
  | "PSP"
  | "SNES"
  | "DEFAULT"
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
  | "PLAYDATE";
```

Defined in: [core/consoles/controls.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/controls.ts#L101)

Gets the control scheme name for a console.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `consoleName` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` \| `"ATARI_5200"` \| `"ATARI_7800"` \| `"N3DS"` \| `"SWITCH"` \| `"CGA"` \| `"EGA"` \| `"CGA_FULL"` \| `"EGA_64"` | The console name |

## Returns

  \| `"N64"`
  \| `"NES"`
  \| `"PSP"`
  \| `"SNES"`
  \| `"DEFAULT"`
  \| `"PICO8"`
  \| `"TIC80"`
  \| `"ATARI_2600"`
  \| `"FAMICOM"`
  \| `"GAMEBOY"`
  \| `"GBC"`
  \| `"GBA"`
  \| `"NDS"`
  \| `"GENESIS"`
  \| `"MEGADRIVE"`
  \| `"GAMEGEAR"`
  \| `"DREAMCAST"`
  \| `"PS1"`
  \| `"NEO_GEO"`
  \| `"C64"`
  \| `"PLAYDATE"`

The ControlSchemeName for that console

## Since

0.5.0
