---
title: 'Interface: VisibleRange'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / VisibleRange

# Interface: VisibleRange

Defined in: [core/grid/isometric\_types.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L107)

A range of grid cells visible within a viewport rectangle.

Returned by [IsometricProjection.getVisibleRange](../classes/IsometricProjection.md#getvisiblerange) for
frustum culling during rendering.

## Since

0.4.0

## Example

```ts
const range: VisibleRange = {
  minCol: 0, maxCol: 15,
  minRow: 0, maxRow: 15,
};

for (let row = range.minRow; row <= range.maxRow; row += 1) {
  for (let col = range.minCol; col <= range.maxCol; col += 1) {
    // render tile at (col, row)
  }
}
```

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="maxcol"></a> `maxCol` | `number` | [core/grid/isometric\_types.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L109) |
| <a id="maxrow"></a> `maxRow` | `number` | [core/grid/isometric\_types.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L111) |
| <a id="mincol"></a> `minCol` | `number` | [core/grid/isometric\_types.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L108) |
| <a id="minrow"></a> `minRow` | `number` | [core/grid/isometric\_types.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L110) |
