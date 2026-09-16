---
title: 'Interface: MapData'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapData

# Interface: MapData

Defined in: [core/map/types.ts:215](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L215)

The map: grid dimensions plus every screen keyed by `"x,y"`.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="blocksize"></a> `blockSize` | `number` | Pixels per tile cell. | [core/map/types.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L219) |
| <a id="defaultspriteid"></a> `defaultSpriteId?` | `string` \| `null` | Fallback fill sprite id when a screen omits its own. | [core/map/types.ts:231](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L231) |
| <a id="screencols"></a> `screenCols` | `number` | Tile columns per screen. | [core/map/types.ts:223](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L223) |
| <a id="screenrows"></a> `screenRows` | `number` | Tile rows per screen. | [core/map/types.ts:227](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L227) |
| <a id="screens"></a> `screens` | `Record`\<[`ScreenName`](../type-aliases/ScreenName.md), [`ScreenData`](ScreenData.md)\> | - | [core/map/types.ts:232](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L232) |
