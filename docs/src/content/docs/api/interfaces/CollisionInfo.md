---
title: 'Interface: CollisionInfo'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollisionInfo

# Interface: CollisionInfo

Defined in: [generic\_types.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L132)

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
| <a id="other"></a> `other` | [`Entity`](../classes/Entity.md) | The other entity involved in the collision. | [generic\_types.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L136) |
| <a id="othertags"></a> `otherTags` | `Set`\<`string`\> | Tags belonging to [other](#other). | [generic\_types.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L140) |
| <a id="self"></a> `self` | [`Entity`](../classes/Entity.md) | The entity that *owns* this collision callback. | [generic\_types.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L134) |
| <a id="selftags"></a> `selfTags` | `Set`\<`string`\> | Tags belonging to [self](#self). | [generic\_types.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/generic_types.ts#L138) |
