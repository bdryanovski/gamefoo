---
title: 'Interface: MapObjectContext'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapObjectContext

# Interface: MapObjectContext

Defined in: [core/map/types.ts:280](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L280)

Everything a [MapObject](../classes/MapObject.md) needs, assembled by the loader and
injected once at construction. Custom classes read from this instead of
reaching into the loader.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="assets"></a> `assets` | [`AssetManager`](../classes/AssetManager.md) | Shared catalog for resolving frames/clips on demand. | [core/map/types.ts:284](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L284) |
| <a id="def"></a> `def` | [`GameObjectDefinition`](GameObjectDefinition.md) | The full object prefab (name, sprites, animations, meta). | [core/map/types.ts:292](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L292) |
| <a id="level"></a> `level` | `number` | Z-layer this object lives on. | [core/map/types.ts:305](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L305) |
| <a id="machine"></a> `machine` | [`StateMachineDefinition`](StateMachineDefinition.md) | The finite state machine definition backing this object. | [core/map/types.ts:288](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L288) |
| <a id="properties"></a> `properties` | `Record`\<`string`, `string`\> | Free-form key/value config authored on the object. | [core/map/types.ts:296](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L296) |
| <a id="startstateid"></a> `startStateId?` | `string` | Initial state id (resolved from a placement's `stateName`, if any). | [core/map/types.ts:313](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L313) |
| <a id="transform"></a> `transform?` | [`Transform`](Transform.md) | Optional flip/rotation. | [core/map/types.ts:309](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L309) |
| <a id="x"></a> `x` | `number` | Pixel offset within the screen. | [core/map/types.ts:300](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L300) |
| <a id="y"></a> `y` | `number` | - | [core/map/types.ts:301](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L301) |
