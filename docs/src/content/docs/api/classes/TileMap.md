---
title: 'Class: TileMap'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileMap

# Class: TileMap

Defined in: [core/tilemap/tilemap.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L84)

## Constructors

### Constructor

```ts
new TileMap(config: TileMapConfig): TileMap;
```

Defined in: [core/tilemap/tilemap.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L118)

Creates a new tilemap.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`TileMapConfig`](../interfaces/TileMapConfig.md) | Grid, layers, projection, and collision settings. |

#### Returns

`TileMap`

#### Since

0.4.0

#### Example

```ts
const tilemap = new TileMap({
  grid: myGrid,
  layers: [groundLayer],
  projection: isoProjection,
  collisionLayerName: "ground",
});
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="grid"></a> `grid` | `readonly` | [`Grid`](Grid.md) | The underlying grid storing cell data and walkability. | [core/tilemap/tilemap.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L86) |
| <a id="layers"></a> `layers` | `readonly` | [`TileLayer`](TileLayer.md)[] | Ordered list of tile layers (rendered back-to-front). | [core/tilemap/tilemap.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L89) |
| <a id="projection"></a> `projection` | `public` | [`IsometricProjection`](IsometricProjection.md) \| `null` | Isometric projection. `null` means orthogonal (top-down) mode. Can be reassigned at runtime to change the isometric angle. | [core/tilemap/tilemap.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L96) |
| <a id="collisionlayername"></a> `collisionLayerName` | `private` | `string` \| `null` | Name of the collision layer, if any. | [core/tilemap/tilemap.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L99) |

## Methods

### buildColliders()

```ts
buildColliders(world: World): Entity[];
```

Defined in: [core/tilemap/tilemap.ts:233](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L233)

Generates static [Entity](Entity.md) instances with [Collidable](Collidable.md)
behaviours for all non-walkable tiles in the collision layer.

Each wall entity is `fixed` and `solid`, tagged with `"wall"`,
and set to collide with `"player"`, `"enemy"`, and `"npc"`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `world` | [`World`](World.md) | The collision [World](World.md) to register colliders in. |

#### Returns

[`Entity`](Entity.md)[]

Array of wall entities. The caller should add them to an
  [ObjectSystem](ObjectSystem.md) or manage them directly.

#### Since

0.4.0

#### Example

```ts
const world = new World();
const walls = tilemap.buildColliders(world);
// Add to ObjectSystem for update/render lifecycle
engine.use(new ObjectSystem([player, ...walls]));
```

***

### getLayer()

```ts
getLayer(name: string): TileLayer | undefined;
```

Defined in: [core/tilemap/tilemap.ts:310](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L310)

Returns a layer by name, or `undefined` if not found.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Layer name to look up. |

#### Returns

[`TileLayer`](TileLayer.md) \| `undefined`

The matching layer, or `undefined`.

#### Since

0.4.0

#### Example

```ts
const ground = tilemap.getLayer("ground");
if (ground) {
  ground.opacity = 0.5;
}
```

***

### getTileAtScreen()

```ts
getTileAtScreen(
   screenX: number, 
   screenY: number, 
   layerName: string): number;
```

Defined in: [core/tilemap/tilemap.ts:191](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L191)

Returns the tile ID at a screen-space position within a named
layer.

Handles both orthogonal and isometric coordinate conversion
automatically.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate. |
| `screenY` | `number` | Screen Y coordinate. |
| `layerName` | `string` | Name of the layer to query. |

#### Returns

`number`

Tile ID at the position, or `-1` if empty/out of bounds.

#### Since

0.4.0

#### Example

```ts
const tileId = tilemap.getTileAtScreen(mouseX, mouseY, "ground");
if (tileId >= 0) {
  console.log("Clicked tile:", tileId);
}
```

***

### render()

```ts
render(ctx: RenderContext, viewport: {
  height: number;
  width: number;
  x: number;
  y: number;
}): void;
```

Defined in: [core/tilemap/tilemap.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap.ts#L143)

Renders all visible layers in order (back-to-front).

Automatically selects orthogonal or isometric rendering based on
whether a projection is configured.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Canvas 2D rendering context. |
| `viewport` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | Visible viewport rectangle (world-space for orthogonal, screen-space for isometric). |
| `viewport.height` | `number` | - |
| `viewport.width` | `number` | - |
| `viewport.x` | `number` | - |
| `viewport.y` | `number` | - |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
// In a SubSystem.render():
tilemap.render(ctx, camera.getViewRect());
```
