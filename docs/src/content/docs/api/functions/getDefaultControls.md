---
title: 'Function: getDefaultControls()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getDefaultControls

# Function: getDefaultControls()

```ts
function getDefaultControls(consoleName: 
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
  | "EGA_64"): ControlScheme;
```

Defined in: [core/consoles/controls.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/core/consoles/controls.ts#L88)

Gets the default control scheme for a console.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `consoleName` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` \| `"ATARI_5200"` \| `"ATARI_7800"` \| `"N3DS"` \| `"SWITCH"` \| `"CGA"` \| `"EGA"` \| `"CGA_FULL"` \| `"EGA_64"` | The console name |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

The appropriate ControlScheme for that console

## Since

0.5.0

## Example

```ts
import { getDefaultControls, InputMapper, Input } from 'gamefoo';

const input = new Input();
const controls = getDefaultControls('NES');
const mapper = new InputMapper(input, controls);

if (mapper.isAction('A')) player.jump();
```
