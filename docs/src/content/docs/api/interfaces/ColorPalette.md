---
title: 'Interface: ColorPalette'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ColorPalette

# Interface: ColorPalette

Defined in: [core/palettes/types.ts:29](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L29)

A basic color palette with a name and array of colors.

## Since

0.5.0

## Example

```ts
const myPalette: ColorPalette = {
  name: 'My Palette',
  colors: ['#000000', '#FFFFFF'],
};
```

## Extended by

- [`NamedColorPalette`](NamedColorPalette.md)

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="colors"></a> `colors` | `readonly` | readonly `` `#${string}` ``[] | Array of hex color values. | [core/palettes/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L37) |
| <a id="name"></a> `name` | `readonly` | `string` | Display name of the palette. | [core/palettes/types.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L33) |
