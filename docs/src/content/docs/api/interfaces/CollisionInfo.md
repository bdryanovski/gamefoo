---
title: 'Interface: CollisionInfo'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionInfo

# Interface: CollisionInfo

Defined in: [generic\_types.ts:146](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L146)

Payload delivered to a [Collidable.onCollision](../classes/Collidable.md#oncollision) callback when two
colliders overlap.

Provides references to both participating entities and their tag sets
so the callback can determine the nature of the collision.

## Since

0.1.0

## Example

**Handling a collision**

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
| <a id="other"></a> `other` | [`Entity`](../classes/Entity.md) | The other entity involved in the collision. | [generic\_types.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L154) |
| <a id="othertags"></a> `otherTags` | `Set`\<`string`\> | Tags belonging to [other](#other). | [generic\_types.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L162) |
| <a id="self"></a> `self` | [`Entity`](../classes/Entity.md) | The entity that *owns* this collision callback. | [generic\_types.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L150) |
| <a id="selftags"></a> `selfTags` | `Set`\<`string`\> | Tags belonging to [self](#self). | [generic\_types.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L158) |
