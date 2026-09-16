---
title: 'Function: getControlScheme()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / getControlScheme

# Function: getControlScheme()

```ts
function getControlScheme(name: 
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
  | "PLAYDATE"): ControlScheme;
```

Defined in: [core/controls/index.ts:257](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/index.ts#L257)

Gets a control scheme by name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | \| `"N64"` \| `"NES"` \| `"PSP"` \| `"SNES"` \| `"DEFAULT"` \| `"PICO8"` \| `"TIC80"` \| `"ATARI_2600"` \| `"FAMICOM"` \| `"GAMEBOY"` \| `"GBC"` \| `"GBA"` \| `"NDS"` \| `"GENESIS"` \| `"MEGADRIVE"` \| `"GAMEGEAR"` \| `"DREAMCAST"` \| `"PS1"` \| `"NEO_GEO"` \| `"C64"` \| `"PLAYDATE"` | The scheme name |

## Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

The control scheme

## Since

0.5.0

## Example

```ts
const scheme = getControlScheme('NES');
const mapper = new InputMapper(input, scheme);
```
