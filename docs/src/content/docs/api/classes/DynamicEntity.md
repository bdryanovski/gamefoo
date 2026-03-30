---
title: 'Abstract Class: DynamicEntity'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / DynamicEntity

# Abstract Class: DynamicEntity

Defined in: [entities/dynamic\_entity.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L42)

Abstract entity with built-in velocity and speed, suitable for any
game object that moves (players, NPCs, projectiles, etc.).

`DynamicEntity` extends [Entity](Entity.md) with a [Vector2](../interfaces/Vector2.md)
velocity and a scalar speed, plus getter/setter pairs for each.
Subclasses are responsible for applying the velocity to position
inside their [update](Entity.md#update) implementation.

## Since

0.1.0

## Example

```ts
import { DynamicEntity } from "gamefoo";

class Bullet extends DynamicEntity {
  constructor(x: number, y: number) {
    super("bullet", x, y, 4, 4);
    this.setSpeed(600);
    this.setVelocity({ x: 1, y: 0 });
  }

  update(dt: number) {
    this.x += this.velocity.x * this.speed * dt;
    this.y += this.velocity.y * this.speed * dt;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ff0";
    ctx.fillRect(this.x, this.y, 4, 4);
  }
}
```

## See

 - [Entity](Entity.md) — parent class (identity, transform, behaviours)
 - [Player](Player.md) — concrete dynamic entity for the player

## Extends

- [`Entity`](Entity.md)

## Extended by

- [`Player`](Player.md)

## Constructors

### Constructor

```ts
new DynamicEntity(
   id: string, 
   x: number, 
   y: number, 
   width?: number, 
   height?: number): DynamicEntity;
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

`DynamicEntity`

#### Example

```ts
class Crate extends Entity {
  constructor(x: number, y: number) {
    super("crate", x, y, 32, 32);
  }
  // ...
}
```

#### Inherited from

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [`Entity`](Entity.md).[`id`](Entity.md#id) | [entities/entity.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L61) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the entity's origin (top-left corner). | [`Entity`](Entity.md).[`position`](Entity.md#position) | [entities/entity.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L66) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the entity in pixels. | [`Entity`](Entity.md).[`size`](Entity.md#size) | [entities/entity.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L71) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | Scalar movement speed in pixels per second. | - | [entities/dynamic\_entity.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L59) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `{ x: 0, y: 0 }` | Directional velocity vector. Represents the normalised (or raw) direction of movement. Multiply by [speed](#speed) and `deltaTime` to get the per-frame displacement. | - | [entities/dynamic\_entity.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L52) |

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

#### Inherited from

[`Text`](Text.md).[`x`](Text.md#x)

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

#### Inherited from

[`Text`](Text.md).[`y`](Text.md#y)

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

[`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\>[]

#### Inherited from

[`Entity`](Entity.md).[`behaviors`](Entity.md#behaviors)

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
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> | The behaviour type being attached. |

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

#### Inherited from

[`Entity`](Entity.md).[`attachBehaviour`](Entity.md#attachbehaviour)

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

#### Inherited from

[`Entity`](Entity.md).[`detachBehaviour`](Entity.md#detachbehaviour)

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
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> | The expected concrete behaviour type. |

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

#### Inherited from

[`Entity`](Entity.md).[`getBehaviour`](Entity.md#getbehaviour)

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
| `T` *extends* [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\> | The behaviour subclass to filter by. |

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

#### Inherited from

[`Entity`](Entity.md).[`getBehavioursByType`](Entity.md#getbehavioursbytype)

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

#### Inherited from

[`Entity`](Entity.md).[`getPosition`](Entity.md#getposition)

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

#### Inherited from

[`Entity`](Entity.md).[`getSize`](Entity.md#getsize)

***

### getSpeed()

```ts
getSpeed(): number;
```

Defined in: [entities/dynamic\_entity.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L103)

Returns the current movement speed.

#### Returns

`number`

Speed in pixels per second.

***

### getVelocity()

```ts
getVelocity(): Vector2;
```

Defined in: [entities/dynamic\_entity.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L80)

Returns a **copy** of the current velocity vector.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

A new [Vector2](../interfaces/Vector2.md).

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

#### Inherited from

[`Entity`](Entity.md).[`hasBehaviour`](Entity.md#hasbehaviour)

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

#### Inherited from

[`Entity`](Entity.md).[`render`](Entity.md#render)

***

### setSpeed()

```ts
setSpeed(speed: number): void;
```

Defined in: [entities/dynamic\_entity.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L94)

Sets the scalar movement speed.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `speed` | `number` | Speed in pixels per second. |

#### Returns

`void`

#### Example

```ts
entity.setSpeed(200);
```

***

### setVelocity()

```ts
setVelocity(velocity: Vector2): void;
```

Defined in: [entities/dynamic\_entity.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L71)

Replaces the current velocity vector.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `velocity` | [`Vector2`](../interfaces/Vector2.md) | The new velocity. |

#### Returns

`void`

#### Example

```ts
entity.setVelocity({ x: -1, y: 0 }); // moving left
```

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [entities/dynamic\_entity.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L118)

Applies the current velocity and speed to the entity's position,
then delegates to all attached behaviours.

Behaviours run first so that input (e.g. [Control](Control.md)) can set
velocity before it is integrated into position — no one-frame lag.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Since

0.5.0

#### Overrides

[`Entity`](Entity.md).[`update`](Entity.md#update)

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

#### Inherited from

[`Entity`](Entity.md).[`renderBehaviours`](Entity.md#renderbehaviours)

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

#### Inherited from

[`Entity`](Entity.md).[`setSize`](Entity.md#setsize)

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

#### Inherited from

[`Entity`](Entity.md).[`updateBehaviours`](Entity.md#updatebehaviours)
