---
title: 'Abstract Class: DynamicEntity'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

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

**Subclassing**

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
   height?: number
): DynamicEntity;
```

Defined in: [entities/entity.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L104)

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
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [`Entity`](Entity.md).[`id`](Entity.md#id) | [entities/entity.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L64) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | [`Entity`](Entity.md).[`position`](Entity.md#position) | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | [`Entity`](Entity.md).[`size`](Entity.md#size) | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | Scalar movement speed in pixels per second. | - | [entities/dynamic\_entity.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L59) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `{ x: 0, y: 0 }` | Directional velocity vector. Represents the normalised (or raw) direction of movement. Multiply by [speed](#speed) and `deltaTime` to get the per-frame displacement. | - | [entities/dynamic\_entity.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L52) |

## Accessors

### x

#### Get Signature

```ts
get x(): number;
```

Defined in: [entities/node.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L90)

Horizontal position of the node (shorthand for `position.x`).

##### Since

0.5.0

##### Returns

`number`

#### Set Signature

```ts
set x(value: number): void;
```

Defined in: [entities/node.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L99)

Sets the horizontal position.

##### Since

0.5.0

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Bitmap`](Bitmap.md).[`x`](Bitmap.md#x)

***

### y

#### Get Signature

```ts
get y(): number;
```

Defined in: [entities/node.ts:108](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L108)

Vertical position of the node (shorthand for `position.y`).

##### Since

0.5.0

##### Returns

`number`

#### Set Signature

```ts
set y(value: number): void;
```

Defined in: [entities/node.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L117)

Sets the vertical position.

##### Since

0.5.0

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Bitmap`](Bitmap.md).[`y`](Bitmap.md#y)

***

### behaviors

#### Get Signature

```ts
get private behaviors(): Behaviour<Entity>[];
```

Defined in: [entities/entity.ts:213](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L213)

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
attachBehaviour<T extends Behaviour<Entity>>(behavior: T): T;
```

Defined in: [entities/entity.ts:171](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L171)

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

### attachShader()

```ts
attachShader<T extends Shader>(shader: T): T;
```

Defined in: [entities/entity.ts:263](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L263)

Attaches a screen shader to this entity and returns it.

Effects render when the subclass calls [Entity.renderShaders](Entity.md#rendershaders) and
advance when it calls [Entity.updateShaders](Entity.md#updateshaders) — mirroring the
behaviour update/render hooks.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shader` | `T` | The shader to attach. |

#### Returns

`T`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`attachShader`](Entity.md#attachshader)

***

### detachBehaviour()

```ts
detachBehaviour(key: string): void;
```

Defined in: [entities/entity.ts:193](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L193)

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

### detachShader()

```ts
detachShader(type: string): void;
```

Defined in: [entities/entity.ts:290](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L290)

Detaches the shader with `type`, if present.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`void`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`detachShader`](Entity.md#detachshader)

***

### getBehaviour()

```ts
getBehaviour<T extends Behaviour<Entity>>(key: string): T | undefined;
```

Defined in: [entities/entity.ts:122](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L122)

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
getBehavioursByType<T extends Behaviour<Entity>>(type: (...args: any[]) => T): T[];
```

Defined in: [entities/entity.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L139)

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

Defined in: [entities/node.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L134)

Returns the node's current position.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

The internal [Vector2](../interfaces/Vector2.md) reference with `x` and `y`.

#### Since

0.5.0

#### Example

```ts
const pos = node.getPosition();
console.log(`Node at (${pos.x}, ${pos.y})`);
```

#### Inherited from

[`Entity`](Entity.md).[`getPosition`](Entity.md#getposition)

***

### getShader()

```ts
getShader<T extends Shader>(type: string): T | undefined;
```

Defined in: [entities/entity.ts:272](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L272)

The attached shader with `type`, or `undefined`.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`T` \| `undefined`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`getShader`](Entity.md#getshader)

***

### getSize()

```ts
getSize(): Demension;
```

Defined in: [entities/node.ts:151](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L151)

Returns the node's bounding dimensions.

#### Returns

[`Demension`](../interfaces/Demension.md)

The internal [Demension](../interfaces/Demension.md) reference with `width` and `height`.

#### Since

0.5.0

#### Example

```ts
const size = node.getSize();
console.log(`Node is ${size.width}×${size.height} pixels`);
```

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

Defined in: [entities/entity.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L150)

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

### hasShader()

```ts
hasShader(type: string): boolean;
```

Defined in: [entities/entity.ts:281](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L281)

Whether a shader with `type` is attached.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`boolean`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`hasShader`](Entity.md#hasshader)

***

### render()

```ts
abstract render(ctx: RenderContext): void;
```

Defined in: [entities/node.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L212)

Draws the node to the screen.

Called once per frame after [update](Entity.md#update). Subclasses
must implement this method to render sprites, shapes, text, or any
other visual representation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context . |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
render(ctx: RenderContext) {
  ctx.fillRect(this.x, this.y, this.size.width, this.size.height, "#ff0000");
}
```

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

0.4.0

#### Overrides

[`Entity`](Entity.md).[`update`](Entity.md#update)

***

### renderBehaviours()

```ts
protected renderBehaviours(ctx: RenderContext): void;
```

Defined in: [entities/entity.ts:244](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L244)

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

### renderShaders()

```ts
protected renderShaders(ctx: RenderContext): void;
```

Defined in: [entities/entity.ts:314](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L314)

Renders every enabled shader over this entity's bounding box. Call from
a subclass's `render`, next to [Entity.renderBehaviours](Entity.md#renderbehaviours).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`renderShaders`](Entity.md#rendershaders)

***

### setSize()

```ts
protected setSize(width: number, height: number): void;
```

Defined in: [entities/node.ts:168](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L168)

Sets the node's bounding dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | New width in pixels. |
| `height` | `number` | New height in pixels. |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
this.setSize(64, 64); // Resize to 64×64
```

#### Inherited from

[`Entity`](Entity.md).[`setSize`](Entity.md#setsize)

***

### updateBehaviours()

```ts
protected updateBehaviours(deltaTime: number): void;
```

Defined in: [entities/entity.ts:228](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L228)

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

***

### updateShaders()

```ts
protected updateShaders(deltaTime: number): void;
```

Defined in: [entities/entity.ts:302](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L302)

Advances every enabled shader. Call from a subclass's `update`, next to
[Entity.updateBehaviours](Entity.md#updatebehaviours).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Since

0.5.0

#### Inherited from

[`Entity`](Entity.md).[`updateShaders`](Entity.md#updateshaders)
