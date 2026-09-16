---
title: 'Interface: WorldCollider'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / WorldCollider

# Interface: WorldCollider

Defined in: [core/map/collision\_map.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L9)

A collision shape resolved into world (screen) pixels, tagged with its
layer and — for object/character colliders — the [MapObject](../classes/MapObject.md) that
owns it (so a query can turn "what did I bump/touch" into "which object").

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bounds"></a> `bounds` | [`Rect`](Rect.md) | Axis-aligned bounds of [WorldCollider.shape](#shape), cached for queries. | [core/map/collision\_map.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L21) |
| <a id="layer"></a> `layer` | `string` | Collision layer id, e.g. `"solid"`, `"trigger"`, `"activation"`. | [core/map/collision\_map.ts:13](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L13) |
| <a id="owner"></a> `owner?` | [`MapObject`](../classes/MapObject.md) | Owning object, when the collider comes from a placed object/character. | [core/map/collision\_map.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L25) |
| <a id="shape"></a> `shape` | [`CollisionShape`](../type-aliases/CollisionShape.md) | The shape in world space (rect x/y absolute, circle cx/cy absolute). | [core/map/collision\_map.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/collision_map.ts#L17) |
