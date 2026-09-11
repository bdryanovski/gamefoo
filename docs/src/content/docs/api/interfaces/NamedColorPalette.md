---
title: 'Interface: NamedColorPalette<T = `Record`<`string`, [`HexColor`](../type-aliases/HexColor.md)>>'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / NamedColorPalette

# Interface: NamedColorPalette\<T = `Record`\<`string`, [`HexColor`](../type-aliases/HexColor.md)\>\>

Defined in: [core/palettes/types.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L65)

A color palette with both array access and named color access.

## Since

0.5.0

## Example

```ts
const palette: NamedColorPalette<{ BLACK: HexColor; WHITE: HexColor }> = {
  name: 'Simple',
  colors: ['#000000', '#FFFFFF'],
  named: {
    BLACK: '#000000',
    WHITE: '#FFFFFF',
  },
};

// Array access
palette.colors[0]; // '#000000'

// Named access
palette.named.BLACK; // '#000000'
```

## Extends

- [`ColorPalette`](ColorPalette.md)

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` | `Record`\<`string`, [`HexColor`](../type-aliases/HexColor.md)\> | Record of named colors mapping names to hex values. |

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="colors"></a> `colors` | `readonly` | readonly `` `#${string}` ``[] | Array of hex color values. | [`ColorPalette`](ColorPalette.md).[`colors`](ColorPalette.md#colors) | [core/palettes/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L37) |
| <a id="name"></a> `name` | `readonly` | `string` | Display name of the palette. | [`ColorPalette`](ColorPalette.md).[`name`](ColorPalette.md#name) | [core/palettes/types.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L33) |
| <a id="named"></a> `named` | `readonly` | `T` | Named color access. | - | [core/palettes/types.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/core/palettes/types.ts#L69) |
