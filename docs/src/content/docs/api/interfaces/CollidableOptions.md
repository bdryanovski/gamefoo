---
title: 'Interface: CollidableOptions'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollidableOptions

# Interface: CollidableOptions

Defined in: [core/behaviours/collidable.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L34)

Options for constructing a [Collidable](../classes/Collidable.md) behaviour.

Every field except `shape` is optional and has a sensible default.

## Since

0.1.0

## Examples

**Minimal options**

```ts
const opts: CollidableOptions = {
  shape: { type: "aabb", width: 32, height: 32 },
};
```

**Full options**

```ts
const opts: CollidableOptions = {
  shape: { type: "circle", radius: 16 },
  layer: 0,
  tags: new Set(["enemy"]),
  solid: true,
  fixed: false,
  collidesWith: new Set(["player", "bullet"]),
  onCollision: (info) => console.log("hit!", info.other.id),
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="collideswith"></a> `collidesWith?` | `Set`\<`string`\> | empty `Set` | Tags this collider is **interested in**. The `onCollision` callback only fires when the other collider has at least one matching tag. | [core/behaviours/collidable.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L63) |
| <a id="fixed"></a> `fixed?` | `boolean` | `false` | If `true`, this collider is treated as immovable during overlap resolution — the other entity absorbs the full displacement. | [core/behaviours/collidable.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L79) |
| <a id="layer"></a> `layer?` | `number` | `0` | Collision layer index. Only colliders on the **same** layer are tested against each other. | [core/behaviours/collidable.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L48) |
| <a id="oncollision"></a> `onCollision?` | (`info`: [`CollisionInfo`](CollisionInfo.md)) => `void` | `undefined` | Callback invoked when a collision with a tag-matched collider is detected. **See** [CollisionInfo](CollisionInfo.md) | [core/behaviours/collidable.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L90) |
| <a id="shape"></a> `shape` | [`ColliderShape`](../type-aliases/ColliderShape.md) | `undefined` | The geometric shape used for intersection tests. **See** [ColliderShape](../type-aliases/ColliderShape.md) | [core/behaviours/collidable.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L40) |
| <a id="solid"></a> `solid?` | `boolean` | `false` | Whether overlap resolution should be applied when this collider intersects another solid collider. | [core/behaviours/collidable.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L71) |
| <a id="tags"></a> `tags?` | `Set`\<`string`\> | empty `Set` | Tags that identify *this* collider (e.g. `"player"`, `"bullet"`). | [core/behaviours/collidable.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L55) |
