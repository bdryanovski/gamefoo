---
title: 'Interface: CollisionDefinition'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionDefinition

# Interface: CollisionDefinition

Defined in: [core/map/types.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L140)

One authored collider, tagged with a collision layer (solid, trigger, …).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled?` | `boolean` | - | [core/map/types.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L146) |
| <a id="id"></a> `id?` | `string` | - | [core/map/types.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L141) |
| <a id="layerid"></a> `layerId` | `string` | Collision layer id, e.g. "solid", "trigger", "activation". | [core/map/types.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L145) |
| <a id="shape"></a> `shape` | [`CollisionShape`](../type-aliases/CollisionShape.md) | - | [core/map/types.ts:147](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/types.ts#L147) |
