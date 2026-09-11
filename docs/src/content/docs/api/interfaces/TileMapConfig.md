---
title: 'Interface: TileMapConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileMapConfig

# Interface: TileMapConfig

Defined in: [core/tilemap/tilemap\_types.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L158)

Configuration for constructing a [TileMap](../classes/TileMap.md).

## Since

0.4.0

## Examples

**Orthogonal tilemap**

```ts
const config: TileMapConfig = {
  grid: myGrid,
  layers: [groundLayer, decorLayer],
};
```

**Isometric tilemap with collision**

```ts
const config: TileMapConfig = {
  grid: myGrid,
  layers: [groundLayer],
  projection: myIsoProjection,
  collisionLayerName: "ground",
};
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="collisionlayername"></a> `collisionLayerName?` | `string` | Name of the layer whose non-empty, non-walkable tiles should generate collision entities via [TileMap.buildColliders](../classes/TileMap.md#buildcolliders). | [core/tilemap/tilemap\_types.ts:176](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L176) |
| <a id="grid"></a> `grid` | [`Grid`](../classes/Grid.md) | The grid that defines map dimensions and cell walkability. | [core/tilemap/tilemap\_types.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L162) |
| <a id="layers"></a> `layers` | [`TileLayer`](../classes/TileLayer.md)[] | Ordered list of tile layers (rendered back-to-front). | [core/tilemap/tilemap\_types.ts:166](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L166) |
| <a id="projection"></a> `projection?` | [`IsometricProjection`](../classes/IsometricProjection.md) | Isometric projection. When omitted the map renders in orthogonal (top-down) mode. | [core/tilemap/tilemap\_types.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L171) |
