---
title: 'Interface: GridConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GridConfig

# Interface: GridConfig

Defined in: [core/grid/grid\_types.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L100)

Configuration object for constructing a [Grid](../classes/Grid.md).

## Since

0.4.0

## Examples

**Minimal config**

```ts
const config: GridConfig = {
  cols: 32,
  rows: 32,
  cellWidth: 64,
  cellHeight: 32,
};
```

**With world-space origin offset**

```ts
const config: GridConfig = {
  cols: 16,
  rows: 16,
  cellWidth: 32,
  cellHeight: 32,
  origin: { x: 100, y: 50 },
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cellheight"></a> `cellHeight` | `number` | `undefined` | Height of a single cell in world-space pixels. | [core/grid/grid\_types.ts:116](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L116) |
| <a id="cellwidth"></a> `cellWidth` | `number` | `undefined` | Width of a single cell in world-space pixels. | [core/grid/grid\_types.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L112) |
| <a id="cols"></a> `cols` | `number` | `undefined` | Number of columns in the grid. | [core/grid/grid\_types.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L104) |
| <a id="origin"></a> `origin?` | [`Vector2`](Vector2.md) | `{ x: 0, y: 0 }` | World-space offset of the grid origin (cell 0,0). | [core/grid/grid\_types.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L122) |
| <a id="rows"></a> `rows` | `number` | `undefined` | Number of rows in the grid. | [core/grid/grid\_types.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/grid_types.ts#L108) |
