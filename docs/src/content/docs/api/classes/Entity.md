---
title: 'Abstract Class: Entity'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Entity

# Abstract Class: Entity

Defined in: [entities/entity.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L57)

Abstract base class for every game entity in the GameFoo engine.

`Entity` provides:

- **Identity** — a unique string [id](#id).
- **Transform** — a 2-D [position](Bitmap.md#position) and
  [size](Bitmap.md#size) with convenient `x`/`y` accessors.
- **Behaviour system** — attach, detach, query, and bulk-update
  [Behaviour](Behaviour.md) instances that compose an entity's logic.

Subclasses must implement [Entity.update](#update) and
[Entity.render](DynamicEntity.md#render).

## Since

0.1.0

## Examples

**Subclassing**

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

**Attaching behaviours**

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

## Extends

- `default`

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
   height?: number
): Entity;
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

#### Overrides

```ts
Node.constructor
```

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | - | [entities/entity.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L64) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | `Node.position` | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | `Node.size` | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="_sortedbehaviors"></a> `_sortedBehaviors` | `private` | [`Behaviour`](Behaviour.md)\<`Entity`\>[] \| `null` | `null` | Priority-sorted cache of behaviours. Invalidated (`null`) whenever a behaviour is attached or detached. | - | [entities/entity.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L76) |
| <a id="behaviormap"></a> `behaviorMap` | `private` | `Map`\<`string`, [`Behaviour`](Behaviour.md)\<`Entity`\>\> | `undefined` | Internal map from behaviour key (lowercased type) to [Behaviour](Behaviour.md) instance. | - | [entities/entity.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L70) |
| <a id="shaderstack"></a> `shaderStack` | `private` | [`ShaderStack`](ShaderStack.md) | `undefined` | Screen effects attached to this entity (glow, particles, …). **Since** 0.5.0 | - | [entities/entity.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L83) |

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

[`Behaviour`](Behaviour.md)\<`Entity`\>[]

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

### attachShader()

```ts
attachShader<T extends Shader>(shader: T): T;
```

Defined in: [entities/entity.ts:263](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L263)

Attaches a screen shader to this entity and returns it.

Effects render when the subclass calls [Entity.renderShaders](#rendershaders) and
advance when it calls [Entity.updateShaders](#updateshaders) — mirroring the
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
getBehavioursByType<T extends Behaviour<Entity>>(type: (...args: any[]) => T): T[];
```

Defined in: [entities/entity.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L139)

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

```ts
Node.getPosition
```

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

```ts
Node.getSize
```

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

***

### render()

```ts
abstract render(ctx: RenderContext): void;
```

Defined in: [entities/node.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L212)

Draws the node to the screen.

Called once per frame after [update](#update). Subclasses
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

```ts
Node.render
```

***

### update()

```ts
abstract update(deltaTime: number): void;
```

Defined in: [entities/node.ts:192](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L192)

Advances the node's state by one frame.

Called once per frame by the game loop. Subclasses must implement
this method to update position, animation, AI, or any other
per-frame logic.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
update(dt: number) {
  this.x += this.velocity.x * dt;
  this.y += this.velocity.y * dt;
}
```

#### Inherited from

```ts
Node.update
```

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

***

### renderShaders()

```ts
protected renderShaders(ctx: RenderContext): void;
```

Defined in: [entities/entity.ts:314](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L314)

Renders every enabled shader over this entity's bounding box. Call from
a subclass's `render`, next to [Entity.renderBehaviours](#renderbehaviours).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

#### Since

0.5.0

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

```ts
Node.setSize
```

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

***

### updateShaders()

```ts
protected updateShaders(deltaTime: number): void;
```

Defined in: [entities/entity.ts:302](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L302)

Advances every enabled shader. Call from a subclass's `update`, next to
[Entity.updateBehaviours](#updatebehaviours).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Since

0.5.0
