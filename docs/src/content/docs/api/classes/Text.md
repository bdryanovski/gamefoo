---
title: 'Abstract Class: Text'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Text

# Abstract Class: Text

Defined in: [entities/text.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L16)

Abstract base class for Text and Label alike objects

`Text` extends [Entity](Entity.md) and could also get all behaviors attach to it but
most likely there will be no need for that. Its primary design use case is to
keep track of text objects and interact with them

## Since

0.2.0

## See

[Entity](Entity.md) - parent class

## Extends

- [`Entity`](Entity.md)

## Constructors

### Constructor

```ts
new Text(
   fontName: any, 
   x: number, 
   y: number): Text;
```

Defined in: [entities/text.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L38)

Create new Text object that could be placed and render on the screen

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fontName` | `any` | the FontBitmap valid name to load |
| `x` | `number` | initial vertical position |
| `y` | `number` | initial horizontal position |

#### Returns

`Text`

#### Example

```ts
const Label = new Text('5x5', 20, 20);
```

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `""` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [`Entity`](Entity.md).[`id`](Entity.md#id) | [entities/entity.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L60) |
| <a id="f"></a> `f` | `protected` | [`FontBitmap`](FontBitmap.md) | `undefined` | BitmapFont instance used to manipulate the font | - | [entities/text.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L21) |
| <a id="fontname"></a> `fontName` | `protected` | `string` | `undefined` | Bitmap font name to load internally | - | [entities/text.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L18) |
| <a id="position"></a> `position` | `protected` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the entity's origin (top-left corner). | [`Entity`](Entity.md).[`position`](Entity.md#position) | [entities/entity.ts:65](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L65) |
| <a id="size"></a> `size` | `protected` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the entity in pixels. | [`Entity`](Entity.md).[`size`](Entity.md#size) | [entities/entity.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L70) |
| <a id="text"></a> `text` | `protected` | `string` | `""` | Internal state of the text needed to be update | - | [entities/text.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L24) |

## Accessors

### x

#### Get Signature

```ts
get x(): number;
```

Defined in: [entities/entity.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L88)

Horizontal position of the entity (shorthand for
`position.x`).

##### Returns

`number`

#### Set Signature

```ts
set x(value: number): void;
```

Defined in: [entities/entity.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L93)

Sets the horizontal position.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`x`](Entity.md#x)

***

### y

#### Get Signature

```ts
get y(): number;
```

Defined in: [entities/entity.ts:101](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L101)

Vertical position of the entity (shorthand for
`position.y`).

##### Returns

`number`

#### Set Signature

```ts
set y(value: number): void;
```

Defined in: [entities/entity.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L106)

Sets the vertical position.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`y`](Entity.md#y)

***

### behaviors

#### Get Signature

```ts
get private behaviors(): Behaviour<Entity>[];
```

Defined in: [entities/entity.ts:284](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L284)

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

Defined in: [entities/entity.ts:244](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L244)

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

Defined in: [entities/entity.ts:266](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L266)

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

Defined in: [entities/entity.ts:195](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L195)

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

Defined in: [entities/entity.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L212)

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

Defined in: [entities/entity.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L157)

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

Defined in: [entities/entity.ts:166](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L166)

Returns a **copy** of the entity's bounding dimensions.

#### Returns

[`Demension`](../interfaces/Demension.md)

An object with `width` and `height`.

#### Inherited from

[`Entity`](Entity.md).[`getSize`](Entity.md#getsize)

***

### getText()

```ts
getText(): string;
```

Defined in: [entities/text.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L62)

Get the internal state of the object

#### Returns

`string`

string

***

### hasBehaviour()

```ts
hasBehaviour(key: string): boolean;
```

Defined in: [entities/entity.ts:223](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L223)

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
render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [entities/text.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L66)

Draws the entity to the canvas.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` | The 2-D rendering context. |

#### Returns

`void`

#### Overrides

[`Entity`](Entity.md).[`render`](Entity.md#render)

***

### setSize()

```ts
setSize(width: number, height: number): void;
```

Defined in: [entities/entity.ts:177](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L177)

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

### setText()

```ts
setText(text: string): void;
```

Defined in: [entities/text.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L53)

Set internal state value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `string` | any content that should be render |

#### Returns

`void`

void

***

### update()

```ts
abstract update(deltaTime: number): void;
```

Defined in: [entities/entity.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L143)

Advances the entity's state by one frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`update`](Entity.md#update)

***

### renderBehaviours()

```ts
protected renderBehaviours(ctx: CanvasRenderingContext2D): void;
```

Defined in: [entities/entity.ts:315](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L315)

Calls [render(ctx)](Behaviour.md#render) on every enabled
behaviour that defines a render method, in priority order.

Typically called from a subclass's `render` implementation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` | The canvas 2-D rendering context. |

#### Returns

`void`

#### Inherited from

[`Entity`](Entity.md).[`renderBehaviours`](Entity.md#renderbehaviours)

***

### updateBehaviours()

```ts
protected updateBehaviours(deltaTime: number): void;
```

Defined in: [entities/entity.ts:299](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L299)

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
