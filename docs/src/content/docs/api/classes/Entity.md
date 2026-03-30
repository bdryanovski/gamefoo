---
title: 'Abstract Class: Entity'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Entity

# Abstract Class: Entity

Defined in: [entities/entity.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L54)

Abstract base class for every game entity in the GameFoo engine.

`Entity` provides:

- **Identity** — a unique string [id](#id).
- **Transform** — a 2-D [position](#position) and
  [size](#size) with convenient `x`/`y` accessors.
- **Behaviour system** — attach, detach, query, and bulk-update
  [Behaviour](Behaviour.md) instances that compose an entity's logic.

Subclasses must implement [Entity.update](#update) and
[Entity.render](#render).

## Since

0.1.0

## Examples

```ts
import { Entity } from "gamefoo";

class Wall extends Entity {
  constructor(x: number, y: number, w: number, h: number) {
    super("wall", x, y, w, h);
  }

  update(_dt: number) {}

  render(ctx: RenderContext) {
    ctx.fillStyle = "#888";
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
  }
}
```

```ts
const entity = new Wall(0, 0, 100, 20);
entity.attachBehaviour(new Collidable(entity, world, { ... }));

if (entity.hasBehaviour("collidable")) {
  console.log("Wall has collision!");
}
```

## See

 - [DynamicEntity](DynamicEntity.md) — extends Entity with velocity / speed
 - [Player](Player.md)        — concrete player entity
 - [Behaviour](Behaviour.md)     — composable logic units

## Extended by

- [`DynamicEntity`](DynamicEntity.md)
- [`Text`](Text.md)

## Constructors

### Constructor

```ts
new Entity(
   id: string, 
   x: number, 
   y: number, 
   width?: number, 
   height?: number): Entity;
```

Defined in: [entities/entity.ts:130](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L130)

Creates a new entity.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | Unique string identifier. |
| `x` | `number` | Initial X position in pixels. |
| `y` | `number` | Initial Y position in pixels. |
| `width?` | `number` | Width of the entity's bounding box in pixels. |
| `height?` | `number` | Height of the entity's bounding box in pixels. |

#### Returns

`Entity`

#### Example

```ts
class Crate extends Entity {
  constructor(x: number, y: number) {
    super("crate", x, y, 32, 32);
  }
  // ...
}
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [entities/entity.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L61) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the entity's origin (top-left corner). | [entities/entity.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L66) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the entity in pixels. | [entities/entity.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L71) |
| <a id="_sortedbehaviors"></a> `_sortedBehaviors` | `private` | [`Behaviour`](Behaviour.md)\<`Entity`\>[] \| `null` | `null` | Priority-sorted cache of behaviours. Invalidated (`null`) whenever a behaviour is attached or detached. | [entities/entity.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L83) |
| <a id="behaviormap"></a> `behaviorMap` | `private` | `Map`\<`string`, [`Behaviour`](Behaviour.md)\<`Entity`\>\> | `undefined` | Internal map from behaviour key (lowercased type) to [Behaviour](Behaviour.md) instance. | [entities/entity.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L77) |

## Accessors

### x

#### Get Signature

```ts
get x(): number;
```

Defined in: [entities/entity.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L89)

Horizontal position of the entity (shorthand for
`position.x`).

##### Returns

`number`

#### Set Signature

```ts
set x(value: number): void;
```

Defined in: [entities/entity.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L94)

Sets the horizontal position.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### y

#### Get Signature

```ts
get y(): number;
```

Defined in: [entities/entity.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L102)

Vertical position of the entity (shorthand for
`position.y`).

##### Returns

`number`

#### Set Signature

```ts
set y(value: number): void;
```

Defined in: [entities/entity.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L107)

Sets the vertical position.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### behaviors

#### Get Signature

```ts
get private behaviors(): Behaviour<Entity>[];
```

Defined in: [entities/entity.ts:293](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L293)

**`Internal`**

Returns all attached behaviours sorted by
[Behaviour.priority](Behaviour.md#priority) (ascending).  The result is cached and
only re-computed when behaviours are added or removed.

##### Returns

[`Behaviour`](Behaviour.md)\<`Entity`\>[]

## Methods

### attachBehaviour()

```ts
attachBehaviour<T>(behavior: T): T;
```

Defined in: [entities/entity.ts:253](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L253)

Attaches a behaviour to this entity.

If the behaviour defines an [onAttach](Behaviour.md#onattach)
hook, it is called immediately.  The sorted-behaviour cache is
invalidated.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> | The behaviour type being attached. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `behavior` | `T` | The behaviour instance to add. |

#### Returns

`T`

The same behaviour instance (for chaining).

#### Example

```ts
const hk = entity.attachBehaviour(new HealthKit(entity, 100));
hk.takeDamage(10);
```

***

### detachBehaviour()

```ts
detachBehaviour(key: string): void;
```

Defined in: [entities/entity.ts:275](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L275)

Detaches a behaviour by its key and calls
[onDetach](Behaviour.md#ondetach) if defined.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The behaviour's [type](Behaviour.md#type) string (case-insensitive). |

#### Returns

`void`

#### Example

```ts
entity.detachBehaviour("collidable");
```

***

### getBehaviour()

```ts
getBehaviour<T>(key: string): T | undefined;
```

Defined in: [entities/entity.ts:202](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L202)

Retrieves a behaviour by its key (case-insensitive).

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> | The expected concrete behaviour type. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The behaviour's [type](Behaviour.md#type) string. |

#### Returns

`T` \| `undefined`

The behaviour cast to `T`, or `undefined` if not found.

#### Example

```ts
const ctrl = entity.getBehaviour<Control>("control");
if (ctrl) ctrl.enabled = false;
```

***

### getBehavioursByType()

```ts
getBehavioursByType<T>(type: (...args: any[]) => T): T[];
```

Defined in: [entities/entity.ts:219](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L219)

Returns all attached behaviours that are instances of the given
class.

#### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`Behaviour`](Behaviour.md)\<`Entity`\> | The behaviour subclass to filter by. |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | (...`args`: `any`[]) => `T` | The constructor function to test with `instanceof`. |

#### Returns

`T`[]

An array of matching behaviours.

#### Example

```ts
const renderers = entity.getBehavioursByType(SpriteRender);
```

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [entities/entity.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L164)

Returns a **copy** of the entity's current position.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

A new [Vector2](../interfaces/Vector2.md) with the entity's `x` and `y`.

***

### getSize()

```ts
getSize(): Demension;
```

Defined in: [entities/entity.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L173)

Returns a **copy** of the entity's bounding dimensions.

#### Returns

[`Demension`](../interfaces/Demension.md)

An object with `width` and `height`.

***

### hasBehaviour()

```ts
hasBehaviour(key: string): boolean;
```

Defined in: [entities/entity.ts:232](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L232)

Checks whether a behaviour with the given key is attached.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The behaviour's [type](Behaviour.md#type) string (case-insensitive). |

#### Returns

`boolean`

`true` if the behaviour exists on this entity.

***

### render()

```ts
abstract render(ctx: RenderContext): void;
```

Defined in: [entities/entity.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L157)

Draws the entity .

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The 2-D rendering context. |

#### Returns

`void`

***

### update()

```ts
abstract update(deltaTime: number): void;
```

Defined in: [entities/entity.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L150)

Advances the entity's state by one frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

***

### renderBehaviours()

```ts
protected renderBehaviours(ctx: RenderContext): void;
```

Defined in: [entities/entity.ts:326](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L326)

Calls [render(ctx)](Behaviour.md#render) on every enabled
behaviour that defines a render method, in priority order.

Typically called from a subclass's `render` implementation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

***

### setSize()

```ts
protected setSize(width: number, height: number): void;
```

Defined in: [entities/entity.ts:184](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L184)

Set size of the entity

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |

#### Returns

`void`

void

#### Since

0.2.0

***

### updateBehaviours()

```ts
protected updateBehaviours(deltaTime: number): void;
```

Defined in: [entities/entity.ts:310](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L310)

Calls [update(deltaTime)](Behaviour.md#update) on every
enabled behaviour, in priority order.

Typically called from a subclass's `update` implementation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`
