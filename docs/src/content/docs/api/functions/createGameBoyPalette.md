---
title: 'Function: createGameBoyPalette()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / createGameBoyPalette

# Function: createGameBoyPalette()

```ts
function createGameBoyPalette(tint: `#${string}`): NamedColorPalette<GameBoyColors>;
```

Defined in: [core/palettes/gameboy.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/gameboy.ts#L89)

Creates a custom Game Boy-style 4-color palette from a tint color.

Generates 4 shades from darkest (10% brightness) to lightest (95% brightness)
based on the provided tint color.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tint` | `` `#${string}` `` | Base color to create shades from |

## Returns

[`NamedColorPalette`](../interfaces/NamedColorPalette.md)\<[`GameBoyColors`](../interfaces/GameBoyColors.md)\>

A 4-color palette with named access

## Since

0.5.0

## Example

```ts
// Sepia/brown tint
const sepia = createGameBoyPalette('#D4A574');

// Blue tint
const blue = createGameBoyPalette('#4488FF');

// Grayscale
const gray = createGameBoyPalette('#AAAAAA');

// Use the palette
ctx.fillRect(0, 0, 10, 10, sepia.named.DARKEST);
```
