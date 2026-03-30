---
title: 'Type Alias: CollidableOptions'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CollidableOptions

# Type Alias: CollidableOptions

```ts
type CollidableOptions = {
  collidesWith?: Set<string>;
  fixed?: boolean;
  layer?: number;
  onCollision?: (info: CollisionInfo) => void;
  shape: ColliderShape;
  solid?: boolean;
  tags?: Set<string>;
};
```

Defined in: [core/behaviours/collidable.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L39)

Options for constructing a [Collidable](../classes/Collidable.md) behaviour.

Every field except `shape` is optional and has a sensible default.

## Since

0.1.0

## Examples

```ts
const opts: CollidableOptions = {
  shape: { type: "aabb", width: 32, height: 32 },
};
```

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
| <a id="collideswith"></a> `collidesWith?` | `Set`\<`string`\> | empty `Set` | Tags this collider is **interested in**. The `onCollision` callback only fires when the other collider has at least one matching tag. | [core/behaviours/collidable.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L68) |
| <a id="fixed"></a> `fixed?` | `boolean` | `false` | If `true`, this collider is treated as immovable during overlap resolution — the other entity absorbs the full displacement. | [core/behaviours/collidable.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L84) |
| <a id="layer"></a> `layer?` | `number` | `0` | Collision layer index. Only colliders on the **same** layer are tested against each other. | [core/behaviours/collidable.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L53) |
| <a id="oncollision"></a> `onCollision?` | (`info`: [`CollisionInfo`](../interfaces/CollisionInfo.md)) => `void` | `undefined` | Callback invoked when a collision with a tag-matched collider is detected. **See** [CollisionInfo](../interfaces/CollisionInfo.md) | [core/behaviours/collidable.ts:95](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L95) |
| <a id="shape"></a> `shape` | [`ColliderShape`](ColliderShape.md) | `undefined` | The geometric shape used for intersection tests. **See** [ColliderShape](ColliderShape.md) | [core/behaviours/collidable.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L45) |
| <a id="solid"></a> `solid?` | `boolean` | `false` | Whether overlap resolution should be applied when this collider intersects another solid collider. | [core/behaviours/collidable.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L76) |
| <a id="tags"></a> `tags?` | `Set`\<`string`\> | empty `Set` | Tags that identify *this* collider (e.g. `"player"`, `"bullet"`). | [core/behaviours/collidable.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L60) |
