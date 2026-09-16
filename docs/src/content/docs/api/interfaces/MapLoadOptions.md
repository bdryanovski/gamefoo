---
title: 'Interface: MapLoadOptions'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapLoadOptions

# Interface: MapLoadOptions

Defined in: [core/map/map\_manager.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L18)

Options for [MapManager.load](../classes/MapManager.md#load) / [MapManager.fromUrl](../classes/MapManager.md#fromurl).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="registry"></a> `registry?` | [`MapObjectRegistry`](../classes/MapObjectRegistry.md) | Custom-class registry used to instantiate machine placements. | [core/map/map\_manager.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L26) |
| <a id="resolve"></a> `resolve?` | [`ImageResolver`](../type-aliases/ImageResolver.md) | Maps each `ImageDefinition` to the URL to fetch (see [AssetManager.load](../classes/AssetManager.md#load)). | [core/map/map\_manager.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L22) |
| <a id="screens"></a> `screens?` | [`ScreenRegistry`](../classes/ScreenRegistry.md) | Custom-class registry used to instantiate specific screens. | [core/map/map\_manager.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/map_manager.ts#L30) |
