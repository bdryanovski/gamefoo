---
title: 'Interface: ScreenContext'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ScreenContext

# Interface: ScreenContext

Defined in: [core/map/screen.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L60)

Everything a [Screen](../classes/Screen.md) needs to build itself, bundled so custom
screen subclasses only need a single `super(context)` call.

## Since

0.5.0

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="assets"></a> `assets` | [`AssetManager`](../classes/AssetManager.md) | [core/map/screen.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L62) |
| <a id="data"></a> `data` | [`ScreenData`](ScreenData.md) | [core/map/screen.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L61) |
| <a id="map"></a> `map` | [`MapData`](MapData.md) | [core/map/screen.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L63) |
| <a id="registry"></a> `registry?` | [`MapObjectRegistry`](../classes/MapObjectRegistry.md) | [core/map/screen.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/screen.ts#L64) |
