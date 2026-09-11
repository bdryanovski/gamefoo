---
title: 'Interface: GameObjectDefinition'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GameObjectDefinition

# Interface: GameObjectDefinition

Defined in: [core/map/types.ts:153](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L153)

A prefab grouping sprites/animations behind a [StateMachineDefinition](StateMachineDefinition.md).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="animations"></a> `animations` | `string`[] | - | [core/map/types.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L157) |
| <a id="collisionsbystate"></a> `collisionsByState?` | `Record`\<`string`, [`CollisionDefinition`](CollisionDefinition.md)[]\> | Authored colliders per FSM state id — solidity can change with state. | [core/map/types.ts:163](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L163) |
| <a id="id"></a> `id` | `string` | - | [core/map/types.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L154) |
| <a id="machine"></a> `machine` | [`StateMachineDefinition`](StateMachineDefinition.md) | - | [core/map/types.ts:159](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L159) |
| <a id="meta"></a> `meta?` | \{ `category?`: `string`; `description?`: `string`; `tags?`: `string`[]; \} | - | [core/map/types.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L164) |
| `meta.category?` | `string` | - | [core/map/types.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L164) |
| `meta.description?` | `string` | - | [core/map/types.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L164) |
| `meta.tags?` | `string`[] | - | [core/map/types.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L164) |
| <a id="name"></a> `name` | `string` | - | [core/map/types.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L155) |
| <a id="properties"></a> `properties` | `Record`\<`string`, `string`\> | - | [core/map/types.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L158) |
| <a id="sprites"></a> `sprites` | `string`[] | - | [core/map/types.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L156) |
