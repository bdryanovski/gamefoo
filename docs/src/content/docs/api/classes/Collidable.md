---
title: 'Class: Collidable'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Collidable

# Class: Collidable

Defined in: [core/behaviours/collidable.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L141)

Collision behaviour that can be attached to any [DynamicEntity](DynamicEntity.md).

When attached, the `Collidable` automatically registers itself with
the engine's [World](World.md) (via [Collidable.onAttach](#onattach)) and
unregisters on detach. Each frame the `World` queries the collider's
shape, bounds, and tags to determine intersections.

## Since

0.1.0

## Examples

```ts
import { Collidable, DynamicEntity, type CollisionInfo } from "gamefoo";

const entity = new Enemy("goblin", 100, 200, 30, 30);

entity.attachBehaviour(
  new Collidable(entity, engine.collisions, {
    shape: { type: "aabb", width: 30, height: 30 },
    layer: 0,
    tags: new Set(["enemy"]),
    solid: true,
    collidesWith: new Set(["player"]),
    onCollision: (info: CollisionInfo) => {
      console.log(`${info.self.id} hit ${info.other.id}`);
    },
  }),
);
```

```ts
entity.attachBehaviour(
  new Collidable(bullet, engine.collisions, {
    shape: { type: "circle", radius: 4 },
    tags: new Set(["bullet"]),
    collidesWith: new Set(["enemy"]),
  }),
);
```

## See

 - [World](World.md)          — the collision detection system
 - [ColliderShape](../type-aliases/ColliderShape.md)  — supported shape types
 - [CollisionInfo](../interfaces/CollisionInfo.md)  — payload delivered to callbacks
 - [Behaviour](Behaviour.md)      — abstract base class

## Extends

- [`Behaviour`](Behaviour.md)\<[`DynamicEntity`](DynamicEntity.md)\>

## Constructors

### Constructor

```ts
new Collidable(
   owner: DynamicEntity, 
   world: World, 
   options: CollidableOptions): Collidable;
```

Defined in: [core/behaviours/collidable.ts:205](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L205)

Creates a new collidable behaviour.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | [`DynamicEntity`](DynamicEntity.md) | The dynamic entity that owns this collider. |
| `world` | [`World`](World.md) | The collision [World](World.md) to register with. |
| `options` | `CollidableOptions` | Configuration for shape, tags, solidity, and callbacks. See CollidableOptions. |

#### Returns

`Collidable`

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="collideswith"></a> `collidesWith` | `public` | `Set`\<`string`\> | empty `Set` | Tags this collider wants to be notified about. | - | - | [core/behaviours/collidable.ts:172](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L172) |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L91) |
| <a id="fixed"></a> `fixed` | `public` | `boolean` | `false` | Whether the owning entity is immovable during overlap resolution. | - | - | [core/behaviours/collidable.ts:186](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L186) |
| <a id="layer"></a> `layer` | `public` | `number` | `0` | Collision layer. Only colliders sharing the same layer value are tested. | - | - | [core/behaviours/collidable.ts:158](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L158) |
| <a id="oncollision"></a> `onCollision` | `public` | (`info`: [`CollisionInfo`](../interfaces/CollisionInfo.md)) => `void` | `undefined` | User-supplied callback invoked when a tag-matched collision is detected. | - | - | [core/behaviours/collidable.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L192) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L81) |
| <a id="shape"></a> `shape` | `public` | [`ColliderShape`](../type-aliases/ColliderShape.md) | `undefined` | Geometric shape used for intersection tests. **See** [ColliderShape](../type-aliases/ColliderShape.md) | - | - | [core/behaviours/collidable.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L150) |
| <a id="solid"></a> `solid` | `public` | `boolean` | `false` | Whether this collider participates in overlap resolution. | - | - | [core/behaviours/collidable.ts:179](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L179) |
| <a id="tags"></a> `tags` | `public` | `Set`\<`string`\> | empty `Set` | Tags identifying this collider (e.g. `"player"`, `"enemy"`). | - | - | [core/behaviours/collidable.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L165) |
| <a id="type"></a> `type` | `readonly` | `"collidable"` | `"collidable"` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/collidable.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L143) |
| <a id="owner"></a> `owner` | `protected` | [`DynamicEntity`](DynamicEntity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L54) |
| <a id="world"></a> `world` | `private` | [`World`](World.md) | `undefined` | Reference to the [World](World.md) this collider is registered with. | - | - | [core/behaviours/collidable.ts:195](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L195) |

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [core/behaviour.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L99)

Derived look-up key, equal to [Behaviour.type](Behaviour.md#type) in lowercase.

Used internally by the entity's behaviour map so that look-ups are
case-insensitive.

##### Returns

`string`

#### Inherited from

[`Behaviour`](Behaviour.md).[`key`](Behaviour.md#key)

## Methods

### getOwner()

```ts
getOwner(): Entity;
```

Defined in: [core/behaviours/collidable.ts:261](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L261)

Returns the [Entity](Entity.md) that owns this behaviour.

Used by the [World](World.md) to read and mutate entity position
during overlap resolution.

#### Returns

[`Entity`](Entity.md)

The owning entity.

***

### getWorldBounds()

```ts
getWorldBounds(): WorldBounds;
```

Defined in: [core/behaviours/collidable.ts:277](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L277)

Computes this collider's axis-aligned bounding rectangle in
world-space, accounting for the shape's optional offset.

#### Returns

`WorldBounds`

A WorldBounds rectangle.

#### Example

```ts
const bounds = collidable.getWorldBounds();
// { x: 100, y: 200, width: 30, height: 30 }
```

***

### onAttach()

```ts
onAttach(): void;
```

Defined in: [core/behaviours/collidable.ts:239](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L239)

Lifecycle hook: registers this collider with the [World](World.md)
when the behaviour is attached to an entity.

#### Returns

`void`

#### See

[Behaviour.onAttach](Behaviour.md#onattach)

#### Overrides

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()

```ts
onDetach(): void;
```

Defined in: [core/behaviours/collidable.ts:249](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L249)

Lifecycle hook: removes this collider from the [World](World.md)
when the behaviour is detached.

#### Returns

`void`

#### See

[Behaviour.onDetach](Behaviour.md#ondetach)

#### Overrides

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### render()?

```ts
optional render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/behaviour.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L127)

Optional rendering hook invoked after the entity's own
[Entity.render](Entity.md#render) call.

Override this to draw debug shapes, health bars, status effects, etc.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` | The canvas 2-D rendering context. |

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/behaviours/collidable.ts:231](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/collidable.ts#L231)

No-op — collision logic lives in [World.detect](World.md#detect).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Unused. |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
