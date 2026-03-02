---
title: 'Interface: CollisionInfo'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionInfo

# Interface: CollisionInfo

Defined in: [types.ts:148](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L148)

Payload delivered to a [Collidable.onCollision](../classes/Collidable.md#oncollision) callback when two
colliders overlap.

Provides references to both participating entities and their tag sets
so the callback can determine the nature of the collision.

## Since

0.1.0

## Example

```ts
function handleHit(info: CollisionInfo) {
  if (info.otherTags.has("enemy")) {
    console.log(`${info.self.id} was hit by ${info.other.id}`);
  }
}
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="other"></a> `other` | [`Entity`](../classes/Entity.md) | The other entity involved in the collision. | [types.ts:152](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L152) |
| <a id="othertags"></a> `otherTags` | `Set`\<`string`\> | Tags belonging to [other](#other). | [types.ts:156](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L156) |
| <a id="self"></a> `self` | [`Entity`](../classes/Entity.md) | The entity that *owns* this collision callback. | [types.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L150) |
| <a id="selftags"></a> `selfTags` | `Set`\<`string`\> | Tags belonging to [self](#self). | [types.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/types.ts#L154) |
