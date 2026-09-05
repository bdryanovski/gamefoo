---
title: 'Function: isGeneratedPalette()'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / isGeneratedPalette

# Function: isGeneratedPalette()

```ts
function isGeneratedPalette(palette: 
  | ColorPalette
  | GeneratedPalette): palette is GeneratedPalette;
```

Defined in: [core/palettes/utils.ts:78](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/utils.ts#L78)

Type guard to check if a palette is a generated palette.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `palette` | \| [`ColorPalette`](../interfaces/ColorPalette.md) \| [`GeneratedPalette`](../interfaces/GeneratedPalette.md) | Palette to check |

## Returns

`palette is GeneratedPalette`

true if the palette is a GeneratedPalette

## Since

0.5.0

## Example

```ts
if (isGeneratedPalette(palette)) {
  const color = palette.generate(31, 0, 0);
}
```
