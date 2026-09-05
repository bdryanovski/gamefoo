---
title: 'Interface: TileSetConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TileSetConfig

# Interface: TileSetConfig

Defined in: [core/tilemap/tilemap\_types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L37)

Configuration for constructing a [TileSet](../classes/TileSet.md).

## Since

0.4.0

## Example

```ts
const config: TileSetConfig = {
  sprite: mySprite,
  firstGid: 1,
  tileProperties: new Map([
    [0, { walkable: false }],       // water
    [1, { walkable: true }],        // grass
  ]),
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="firstgid"></a> `firstGid?` | `number` | `0` | First global tile ID for this tileset. When combining multiple tilesets in a single map, each set has a unique starting ID. | [core/tilemap/tilemap\_types.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L48) |
| <a id="sprite"></a> `sprite` | [`Sprite`](../classes/Sprite.md) | `undefined` | The sprite sheet containing all tile frames. | [core/tilemap/tilemap\_types.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L41) |
| <a id="tileproperties"></a> `tileProperties?` | `Map`\<`number`, `Record`\<`string`, `unknown`\>\> | `undefined` | Per-tile custom properties. Keys are **local** tile indices (relative to the sprite sheet, starting at 0). | [core/tilemap/tilemap\_types.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_types.ts#L53) |
