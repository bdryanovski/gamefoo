---
title: 'Abstract Class: Text'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Text

# Abstract Class: Text

Defined in: [entities/text.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L17)

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
   id: string, 
   fontName: InternalBitmapFontName, 
   color?: string
): Text;
```

Defined in: [entities/text.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L51)

Create new Text object that could be placed and render on the screen

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | - |
| `fontName` | [`InternalBitmapFontName`](../type-aliases/InternalBitmapFontName.md) | the FontBitmap valid name to load |
| `color?` | `string` | text color (optional) |

#### Returns

`Text`

#### Example

```ts
const Label = new Text('CustomLabel', '5x5');
```

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `''` | Unique identifier for this entity. Used as the key in [GameObjectRegister](GameObjectRegister.md) and for collision-callback identification. | [`Entity`](Entity.md).[`id`](Entity.md#id) | [entities/entity.ts:64](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/entity.ts#L64) |
| <a id="color"></a> `color?` | `protected` | `string` | `'#FFFFFF'` | Text color (optional) **Since** 0.4.0 | - | [entities/text.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L38) |
| <a id="font"></a> `font` | `protected` | [`FontBitmap`](FontBitmap.md) | `undefined` | BitmapFont instance used to manipulate the font | - | [entities/text.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L26) |
| <a id="fontname"></a> `fontName` | `protected` | `string` | `undefined` | Bitmap font name to load internally | - | [entities/text.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L21) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | [`Entity`](Entity.md).[`position`](Entity.md#position) | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | [`Entity`](Entity.md).[`size`](Entity.md#size) | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="text"></a> `text` | `protected` | `string` | `''` | Internal state of the text needed to be update | - | [entities/text.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L31) |

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

[`Entity`](Entity.md).[`x`](Entity.md#x)

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

[`Entity`](Entity.md).[`y`](Entity.md#y)

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

### getText()

```ts
getText(): string;
```

Defined in: [entities/text.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L81)

Get the internal state of the object

#### Returns

`string`

string

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
render(ctx: RenderContext): void;
```

Defined in: [entities/text.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L89)

Render the text using the BitmapFont instance.
On canvas: uses Path2D glyph rendering.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Overrides

[`Entity`](Entity.md).[`render`](Entity.md#render)

***

### setText()

```ts
setText(text: string): void;
```

Defined in: [entities/text.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/text.ts#L70)

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
