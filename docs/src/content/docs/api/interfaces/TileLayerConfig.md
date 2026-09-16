---
title: 'Interface: TileLayerConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileLayerConfig

# Interface: TileLayerConfig

Defined in: [core/tilemap/tilemap\_types.ts:85](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L85)

Configuration for constructing a [TileLayer](../classes/TileLayer.md).

## Since

0.4.0

## Examples

```ts
const config: TileLayerConfig = {
  name: "ground",
  cols: 32,
  rows: 32,
  tileSet: myTileSet,
  data: new Array(32 * 32).fill(0),
};
```

**Semi-transparent overlay layer**

```ts
const config: TileLayerConfig = {
  name: "decorations",
  cols: 32,
  rows: 32,
  tileSet: decoTileSet,
  data: decoData,
  opacity: 0.8,
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cols"></a> `cols` | `number` | `undefined` | Number of tile columns in this layer. | [core/tilemap/tilemap\_types.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L93) |
| <a id="data"></a> `data` | `number`[] | `undefined` | Flat row-major tile data. Length must equal `cols × rows`. A value of `-1` means "empty / no tile". | [core/tilemap/tilemap\_types.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L106) |
| <a id="name"></a> `name` | `string` | `undefined` | Human-readable layer name (e.g. `"ground"`, `"collision"`). | [core/tilemap/tilemap\_types.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L89) |
| <a id="offsetx"></a> `offsetX?` | `number` | `0` | Horizontal pixel offset applied before rendering. Useful for parallax effects. | [core/tilemap/tilemap\_types.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L125) |
| <a id="offsety"></a> `offsetY?` | `number` | `0` | Vertical pixel offset applied before rendering. | [core/tilemap/tilemap\_types.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L131) |
| <a id="opacity"></a> `opacity?` | `number` | `1` | Layer opacity from `0` (fully transparent) to `1` (fully opaque). | [core/tilemap/tilemap\_types.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L118) |
| <a id="rows"></a> `rows` | `number` | `undefined` | Number of tile rows in this layer. | [core/tilemap/tilemap\_types.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L97) |
| <a id="tileset"></a> `tileSet` | [`TileSet`](../classes/TileSet.md) | `undefined` | The tileset that maps tile IDs to sprite frames. | [core/tilemap/tilemap\_types.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L101) |
| <a id="visible"></a> `visible?` | `boolean` | `true` | Whether this layer is drawn during rendering. | [core/tilemap/tilemap\_types.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L112) |
