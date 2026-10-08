---
title: 'Function: getConsole()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getConsole

# Function: getConsole()

```ts
function getConsole(name: 
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
  | "EGA_64"): ConsoleDefinition;
```

Defined in: [core/consoles/index.ts:253](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/index.ts#L253)

Gets a console definition by name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` \| `"ATARI_5200"` \| `"ATARI_7800"` \| `"N3DS"` \| `"SWITCH"` \| `"CGA"` \| `"EGA"` \| `"CGA_FULL"` \| `"EGA_64"` | Console name |

## Returns

[`ConsoleDefinition`](../interfaces/ConsoleDefinition.md)

Console definition with resolution and palette

## Since

0.5.0

## Example

```ts
const nes = getConsole('NES');
const { width, height } = nes.resolution;
const bgColor = nes.palette.colors[0];
```
