---
title: 'Class: TileSet'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileSet

# Class: TileSet

Defined in: [core/tilemap/tileset.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L53)

## Constructors

### Constructor

```ts
new TileSet(config: TileSetConfig): TileSet;
```

Defined in: [core/tilemap/tileset.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L82)

Creates a new tileset from the given config.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`TileSetConfig`](../interfaces/TileSetConfig.md) | Sprite, first GID, and optional tile properties. |

#### Returns

`TileSet`

#### Since

0.4.0

#### Example

```ts
const tileSet = new TileSet({
  sprite: mySprite,
  firstGid: 1,
});
```

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="firstgid"></a> `firstGid` | `readonly` | `number` | First global tile ID for this tileset. Tile IDs in layer data that fall in `[firstGid, firstGid + frameCount)` belong to this set. | [core/tilemap/tileset.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L62) |
| <a id="properties"></a> `properties` | `readonly` | `Map`\<`number`, `Record`\<`string`, `unknown`\>\> | Per-tile custom properties indexed by **local** tile index. | [core/tilemap/tileset.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L65) |
| <a id="sprite"></a> `sprite` | `readonly` | [`Sprite`](Sprite.md) | The sprite sheet containing all tile frames. | [core/tilemap/tileset.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L55) |

## Methods

### containsTile()

```ts
containsTile(tileId: number): boolean;
```

Defined in: [core/tilemap/tileset.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L137)

Checks whether a global tile ID belongs to this tileset.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileId` | `number` | Global tile ID. |

#### Returns

`boolean`

`true` if this tileset contains the tile.

#### Since

0.4.0

#### Example

```ts
if (tileSet.containsTile(7)) {
  // tile 7 is in this set
}
```

***

### getFrame()

```ts
getFrame(tileId: number): SpriteFrame | undefined;
```

Defined in: [core/tilemap/tileset.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L112)

Returns the SpriteFrame for a **global** tile ID.

The global ID is offset by [TileSet.firstGid](#firstgid) to obtain the
local frame index used by the sprite sheet.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tileId` | `number` | Global tile ID from layer data. |

#### Returns

`SpriteFrame` \| `undefined`

The source rectangle, or `undefined` if the ID does not
  belong to this tileset.

#### Since

0.4.0

#### Example

```ts
const frame = tileSet.getFrame(5);
if (frame) {
  ctx.drawImage(
    tileSet.sprite.image,
    frame.x, frame.y, frame.width, frame.height,
    dx, dy, frame.width, frame.height,
  );
}
```

***

### getProperties()

```ts
getProperties(localIndex: number): Record<string, unknown> | undefined;
```

Defined in: [core/tilemap/tileset.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tileset.ts#L157)

Returns custom properties for a **local** tile index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `localIndex` | `number` | Zero-based index within the sprite sheet. |

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

Property record, or `undefined` if none were defined.

#### Since

0.4.0

#### Example

```ts
const props = tileSet.getProperties(0);
if (props?.walkable === false) {
  console.log("This tile blocks movement");
}
```
