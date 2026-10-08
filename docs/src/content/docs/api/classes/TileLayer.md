---
title: 'Class: TileLayer'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileLayer

# Class: TileLayer

Defined in: [core/tilemap/tile\_layer.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L38)

## Constructors

### Constructor

```ts
new TileLayer(config: TileLayerConfig): TileLayer;
```

Defined in: [core/tilemap/tile\_layer.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L102)

Creates a new tile layer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`TileLayerConfig`](../interfaces/TileLayerConfig.md) | Layer dimensions, tileset reference, and tile data. |

#### Returns

`TileLayer`

#### Since

0.4.0

#### Example

```ts
const layer = new TileLayer({
  name: "ground",
  cols: 16,
  rows: 16,
  tileSet: myTileSet,
  data: new Array(16 * 16).fill(0),
});
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cols"></a> `cols` | `readonly` | `number` | Number of tile columns. | [core/tilemap/tile\_layer.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L47) |
| <a id="name"></a> `name` | `readonly` | `string` | Human-readable name of this layer. | [core/tilemap/tile\_layer.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L42) |
| <a id="offsetx"></a> `offsetX` | `public` | `number` | Horizontal pixel offset (parallax). | [core/tilemap/tile\_layer.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L72) |
| <a id="offsety"></a> `offsetY` | `public` | `number` | Vertical pixel offset (parallax). | [core/tilemap/tile\_layer.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L77) |
| <a id="opacity"></a> `opacity` | `public` | `number` | Layer opacity in `[0, 1]`. | [core/tilemap/tile\_layer.ts:67](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L67) |
| <a id="rows"></a> `rows` | `readonly` | `number` | Number of tile rows. | [core/tilemap/tile\_layer.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L52) |
| <a id="tileset"></a> `tileSet` | `public` | [`TileSet`](TileSet.md) | The tileset used to resolve tile IDs to sprite frames. | [core/tilemap/tile\_layer.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L57) |
| <a id="visible"></a> `visible` | `public` | `boolean` | Whether this layer is rendered. | [core/tilemap/tile\_layer.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L62) |
| <a id="data"></a> `data` | `private` | `number`[] | Flat row-major tile data. `-1` means empty. | [core/tilemap/tile\_layer.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L82) |

## Methods

### getTile()

```ts
getTile(col: number, row: number): number;
```

Defined in: [core/tilemap/tile\_layer.ts:131](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L131)

Returns the tile ID at the given grid position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Column index. |
| `row` | `number` | Row index. |

#### Returns

`number`

Tile ID, or `-1` if out of bounds.

#### Since

0.4.0

#### Example

```ts
const id = layer.getTile(5, 3);
if (id !== -1) {
  console.log("Tile ID:", id);
}
```

***

### renderIsometric()

```ts
renderIsometric(
   ctx: RenderContext, 
   projection: IsometricProjection, 
   viewport: {
  height: number;
  width: number;
  x: number;
  y: number;
}, 
   gridCols: number, 
   gridRows: number
): void;
```

Defined in: [core/tilemap/tile\_layer.ts:275](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L275)

Renders visible tiles in **isometric** mode using the given
projection for coordinate conversion.

Tiles are rendered back-to-front (painters algorithm) by
iterating rows from low to high, then columns from low to high.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Canvas 2D rendering context. |
| `projection` | [`IsometricProjection`](IsometricProjection.md) | Isometric projection for grid → screen conversion. |
| `viewport` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | Visible viewport rectangle in screen-space. |
| `viewport.height` | `number` | - |
| `viewport.width` | `number` | - |
| `viewport.x` | `number` | - |
| `viewport.y` | `number` | - |
| `gridCols` | `number` | Total columns in the grid (for culling). |
| `gridRows` | `number` | Total rows in the grid (for culling). |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
layer.renderIsometric(ctx, projection, camera.getViewRect(), 32, 32);
```

***

### renderOrthogonal()

```ts
renderOrthogonal(
   ctx: RenderContext, 
   cellWidth: number, 
   cellHeight: number, 
   viewport: {
  height: number;
  width: number;
  x: number;
  y: number;
}
): void;
```

Defined in: [core/tilemap/tile\_layer.ts:199](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L199)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |
| `cellWidth` | `number` |
| `cellHeight` | `number` |
| `viewport` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} |
| `viewport.height` | `number` |
| `viewport.width` | `number` |
| `viewport.x` | `number` |
| `viewport.y` | `number` |

#### Returns

`void`

***

### setTile()

```ts
setTile(
   col: number, 
   row: number, 
   tileId: number
): void;
```

Defined in: [core/tilemap/tile\_layer.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L155)

Sets the tile ID at the given grid position.

Does nothing if the coordinates are out of bounds.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `col` | `number` | Column index. |
| `row` | `number` | Row index. |
| `tileId` | `number` | New tile ID to write. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
layer.setTile(5, 3, 2); // place grass tile
layer.setTile(5, 4, -1); // clear tile
```

***

### withOpacity()

```ts
private withOpacity(ctx: RenderContext, fn: () => void): void;
```

Defined in: [core/tilemap/tile\_layer.ts:187](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tile_layer.ts#L187)

**`Internal`**

Applies layer opacity around a render callback.
Saves and restores globalAlpha on canvas contexts.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |
| `fn` | () => `void` |

#### Returns

`void`
