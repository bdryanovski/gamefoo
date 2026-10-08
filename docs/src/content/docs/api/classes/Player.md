---
title: 'Abstract Class: Player'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Player

# Abstract Class: Player

Defined in: [entities/player.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L57)

Default player entity with convenience accessors for common
behaviours.

`Player` extends [DynamicEntity](DynamicEntity.md) and automatically delegates
its [update](#update) and [render](DynamicEntity.md#render)
calls to all attached [behaviours](Behaviour.md). It also
provides typed getters for the [Control](Control.md) and
[HealthKit](HealthKit.md) behaviours so game code can access them without
manual casting.

Subclass `Player` and implement [render](Entity.md#render) to provide
custom visuals. The [update](Entity.md#update) lifecycle (apply velocity,
tick behaviours) is handled automatically by [DynamicEntity](DynamicEntity.md).

## Since

0.1.0

## Examples

**Subclassing (required — Player is abstract)**

```ts
import { Player, Control, HealthKit, Input, SpriteRender } from "gamefoo";

class Hero extends Player {
  render(ctx: RenderContext) {
    this.renderBehaviours(ctx); // SpriteRender handles drawing
  }
}

const hero = new Hero("hero", 400, 300, 50, 50);
hero.attachBehaviour(new Control(hero, new Input()));
hero.attachBehaviour(new HealthKit(hero, 100));
```

**Subclassing for custom rendering**

```ts
class Knight extends Player {
  constructor(x: number, y: number) {
    super("knight", x, y, 48, 48);
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(this.x, this.y, 48, 48);
    this.renderBehaviours(ctx);
  }
}
```

## See

 - [DynamicEntity](DynamicEntity.md) — parent class (velocity, speed)
 - [Control](Control.md)       — keyboard movement behaviour
 - [HealthKit](HealthKit.md)     — health-tracking behaviour

## Extends

- [`DynamicEntity`](DynamicEntity.md)

## Constructors

### Constructor

```ts
new Player(
   id: string, 
   x: number, 
   y: number, 
   width?: number, 
   height?: number
): Player;
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

`Player`

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

[`DynamicEntity`](DynamicEntity.md).[`constructor`](DynamicEntity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [`DynamicEntity`](DynamicEntity.md).[`id`](DynamicEntity.md#id) | [entities/entity.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L64) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | [`DynamicEntity`](DynamicEntity.md).[`position`](DynamicEntity.md#position) | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | [`DynamicEntity`](DynamicEntity.md).[`size`](DynamicEntity.md#size) | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="speed"></a> `speed` | `protected` | `number` | `0` | Scalar movement speed in pixels per second. | [`DynamicEntity`](DynamicEntity.md).[`speed`](DynamicEntity.md#speed) | [entities/dynamic\_entity.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L59) |
| <a id="velocity"></a> `velocity` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `{ x: 0, y: 0 }` | Directional velocity vector. Represents the normalised (or raw) direction of movement. Multiply by [speed](DynamicEntity.md#speed) and `deltaTime` to get the per-frame displacement. | [`DynamicEntity`](DynamicEntity.md).[`velocity`](DynamicEntity.md#velocity) | [entities/dynamic\_entity.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/dynamic_entity.ts#L52) |

## Accessors

### control

#### Get Signature

```ts
get control(): Control | undefined;
```

Defined in: [entities/player.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L63)

Convenience getter for the attached [Control](Control.md) behaviour.

##### Returns

[`Control`](Control.md) \| `undefined`

The `Control` instance, or `undefined` if not attached.

***

### healthkit

#### Get Signature

```ts
get healthkit(): HealthKit | undefined;
```

Defined in: [entities/player.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L72)

Convenience getter for the attached [HealthKit](HealthKit.md) behaviour.

##### Returns

[`HealthKit`](HealthKit.md) \| `undefined`

The `HealthKit` instance, or `undefined` if not attached.

***

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

[`DynamicEntity`](DynamicEntity.md).[`x`](DynamicEntity.md#x)

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

[`DynamicEntity`](DynamicEntity.md).[`y`](DynamicEntity.md#y)

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

[`DynamicEntity`](DynamicEntity.md).[`behaviors`](DynamicEntity.md#behaviors)

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

[`DynamicEntity`](DynamicEntity.md).[`attachBehaviour`](DynamicEntity.md#attachbehaviour)

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

[`DynamicEntity`](DynamicEntity.md).[`attachShader`](DynamicEntity.md#attachshader)

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

[`DynamicEntity`](DynamicEntity.md).[`detachBehaviour`](DynamicEntity.md#detachbehaviour)

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

[`DynamicEntity`](DynamicEntity.md).[`detachShader`](DynamicEntity.md#detachshader)

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

[`DynamicEntity`](DynamicEntity.md).[`getBehaviour`](DynamicEntity.md#getbehaviour)

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

[`DynamicEntity`](DynamicEntity.md).[`getBehavioursByType`](DynamicEntity.md#getbehavioursbytype)

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

[`DynamicEntity`](DynamicEntity.md).[`getPosition`](DynamicEntity.md#getposition)

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

[`DynamicEntity`](DynamicEntity.md).[`getShader`](DynamicEntity.md#getshader)

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

[`DynamicEntity`](DynamicEntity.md).[`getSize`](DynamicEntity.md#getsize)

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

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getSpeed`](DynamicEntity.md#getspeed)

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

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`getVelocity`](DynamicEntity.md#getvelocity)

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

[`DynamicEntity`](DynamicEntity.md).[`hasBehaviour`](DynamicEntity.md#hasbehaviour)

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

[`DynamicEntity`](DynamicEntity.md).[`hasShader`](DynamicEntity.md#hasshader)

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

[`DynamicEntity`](DynamicEntity.md).[`render`](DynamicEntity.md#render)

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

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`setSpeed`](DynamicEntity.md#setspeed)

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

#### Inherited from

[`DynamicEntity`](DynamicEntity.md).[`setVelocity`](DynamicEntity.md#setvelocity)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [entities/player.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/player.ts#L82)

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

[`DynamicEntity`](DynamicEntity.md).[`update`](DynamicEntity.md#update)

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

[`DynamicEntity`](DynamicEntity.md).[`renderBehaviours`](DynamicEntity.md#renderbehaviours)

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

[`DynamicEntity`](DynamicEntity.md).[`renderShaders`](DynamicEntity.md#rendershaders)

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

[`DynamicEntity`](DynamicEntity.md).[`setSize`](DynamicEntity.md#setsize)

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

[`DynamicEntity`](DynamicEntity.md).[`updateBehaviours`](DynamicEntity.md#updatebehaviours)

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

[`DynamicEntity`](DynamicEntity.md).[`updateShaders`](DynamicEntity.md#updateshaders)
