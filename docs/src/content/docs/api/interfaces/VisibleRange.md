---
title: 'Interface: VisibleRange'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / VisibleRange

# Interface: VisibleRange

Defined in: [core/grid/isometric\_types.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L103)

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

for (let r = range.minRow; r <= range.maxRow; r++) {
  for (let c = range.minCol; c <= range.maxCol; c++) {
    // render tile at (c, r)
  }
}
```

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="maxcol"></a> `maxCol` | `number` | [core/grid/isometric\_types.ts:105](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L105) |
| <a id="maxrow"></a> `maxRow` | `number` | [core/grid/isometric\_types.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L107) |
| <a id="mincol"></a> `minCol` | `number` | [core/grid/isometric\_types.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L104) |
| <a id="minrow"></a> `minRow` | `number` | [core/grid/isometric\_types.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/grid/isometric_types.ts#L106) |
