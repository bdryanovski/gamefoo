---
title: 'Class: SpriteRender'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SpriteRender

# Class: SpriteRender

Defined in: [core/behaviours/sprite\_render.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L47)

Sprite animation renderer that can be attached to any [Entity](Entity.md).

`SpriteRender` plays named animations defined in a [Sprite](Sprite.md)
sheet, advancing frames based on each animation's `duration` and
`loop` settings. It supports horizontal flipping for left/right
facing and an optional pixel offset for fine-tuning draw position.

## Since

0.1.0

## Examples

```ts
import { Asset, Sprite, SpriteRender, Player } from "gamefoo";

const image  = await Asset.load("hero.png");
const sheet  = new Sprite(image, 32, 32, {
  idle: { frames: [0, 1], duration: 0.25, loop: true },
  run:  { frames: [2, 3, 4, 5], duration: 0.1, loop: true },
});

const player = new Player("hero", 100, 100, 32, 32);
const sr     = new SpriteRender(player, sheet);
player.attachBehaviour(sr);

sr.play("idle");
```

```ts
if (velocity.x < 0) {
  spriteRender.setFlipX(true);
} else if (velocity.x > 0) {
  spriteRender.setFlipX(false);
}
```

## See

 - [Sprite](Sprite.md)    — spritesheet metadata
 - [Asset](Asset.md)     — image loader
 - [Behaviour](Behaviour.md) — abstract base class

## Extends

- [`Behaviour`](Behaviour.md)\<[`Entity`](Entity.md)\>

## Constructors

### Constructor

```ts
new SpriteRender(owner: Entity, sheet: Sprite): SpriteRender;
```

Defined in: [core/behaviours/sprite\_render.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L98)

Creates a sprite renderer bound to the given entity and sheet.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `owner` | [`Entity`](Entity.md) | The entity whose position determines where the sprite is drawn. |
| `sheet` | [`Sprite`](Sprite.md) | A [Sprite](Sprite.md) containing the image and animation definitions. |

#### Returns

`SpriteRender`

#### Overrides

[`Behaviour`](Behaviour.md).[`constructor`](Behaviour.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Whether this behaviour is currently active. Disabled behaviours are skipped during both [Entity.updateBehaviours](Entity.md#updatebehaviours) and [Entity.renderBehaviours](Entity.md#renderbehaviours). | - | [`Behaviour`](Behaviour.md).[`enabled`](Behaviour.md#enabled) | [core/behaviour.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L91) |
| <a id="offset"></a> `offset` | `public` | [`Vector2`](../interfaces/Vector2.md) | `{ x: 0, y: 0 }` | Pixel offset applied to the draw position, relative to the entity's origin. | - | - | [core/behaviours/sprite\_render.ts:88](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L88) |
| <a id="priority"></a> `priority` | `public` | `number` | `1` | Execution priority — lower numbers run first. When an entity has multiple behaviours, they are sorted by priority before each update/render pass. | - | [`Behaviour`](Behaviour.md).[`priority`](Behaviour.md#priority) | [core/behaviour.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L81) |
| <a id="type"></a> `type` | `readonly` | `"sprite"` | `"sprite"` | Unique string identifier for this behaviour type. Used as the look-up key in [Entity.getBehaviour](Entity.md#getbehaviour) and [Entity.hasBehaviour](Entity.md#hasbehaviour). Must be a compile-time constant (`readonly`). **Example** `class Gravity extends Behaviour { readonly type = "gravity"; // ... }` | [`Behaviour`](Behaviour.md).[`type`](Behaviour.md#type) | - | [core/behaviours/sprite\_render.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L49) |
| <a id="owner"></a> `owner` | `protected` | [`Entity`](Entity.md) | `undefined` | Reference to the entity that owns this behaviour. Available to subclasses for reading and mutating entity state. | - | [`Behaviour`](Behaviour.md).[`owner`](Behaviour.md#owner) | [core/behaviour.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L54) |
| <a id="currentframe"></a> `currentFrame` | `private` | `string` \| `null` | `null` | Name of the currently playing animation, or `null` if stopped. | - | - | [core/behaviours/sprite\_render.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L59) |
| <a id="currentframeindex"></a> `currentFrameIndex` | `private` | `number` | `0` | Index into the current animation's `frames` array. | - | - | [core/behaviours/sprite\_render.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L66) |
| <a id="elapsedtime"></a> `elapsedTime` | `private` | `number` | `0` | Seconds accumulated towards the next frame advance. | - | - | [core/behaviours/sprite\_render.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L73) |
| <a id="flipx"></a> `flipX` | `private` | `boolean` | `false` | Whether the sprite is drawn mirrored horizontally. | - | - | [core/behaviours/sprite\_render.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L80) |
| <a id="sheet"></a> `sheet` | `private` | [`Sprite`](Sprite.md) | `undefined` | The spritesheet this renderer draws from. | - | - | [core/behaviours/sprite\_render.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L52) |

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

### onAttach()?

```ts
optional onAttach(): void;
```

Defined in: [core/behaviour.ts:136](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L136)

Lifecycle hook called immediately after the behaviour is attached
to an entity via [Entity.attachBehaviour](Entity.md#attachbehaviour).

Use this for one-time setup such as registering with the
collision [World](World.md).

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onAttach`](Behaviour.md#onattach)

***

### onDetach()?

```ts
optional onDetach(): void;
```

Defined in: [core/behaviour.ts:144](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviour.ts#L144)

Lifecycle hook called when the behaviour is removed from an entity
via [Entity.detachBehaviour](Entity.md#detachbehaviour).

Use this to unregister from external systems or release resources.

#### Returns

`void`

#### Inherited from

[`Behaviour`](Behaviour.md).[`onDetach`](Behaviour.md#ondetach)

***

### play()

```ts
play(animation: string): void;
```

Defined in: [core/behaviours/sprite\_render.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L117)

Starts (or switches to) the named animation.

If the requested animation is already playing, the call is a no-op
so the current playback position is preserved.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `animation` | `string` | Name matching a key in [Sprite.animations](Sprite.md#animations). |

#### Returns

`void`

#### Example

```ts
spriteRender.play("run");
```

***

### render()

```ts
render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [core/behaviours/sprite\_render.ts:190](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L190)

Draws the current animation frame to the canvas.

Respects [SpriteRender.flipX](#flipx) by temporarily mirroring the
canvas transform, and applies [SpriteRender.offset](#offset) to the
draw position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` | The canvas 2-D rendering context. |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`render`](Behaviour.md#render)

***

### setFlipX()

```ts
setFlipX(flip: boolean): void;
```

Defined in: [core/behaviours/sprite\_render.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L145)

Enables or disables horizontal flipping.

Useful for mirroring a character sprite when facing left.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `flip` | `boolean` | `true` to mirror horizontally, `false` for normal. |

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [core/behaviours/sprite\_render.ts:132](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L132)

Stops the current animation and resets playback state.

After calling `stop`, nothing is drawn until [SpriteRender.play](#play)
is called again.

#### Returns

`void`

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/behaviours/sprite\_render.ts:157](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/sprite_render.ts#L157)

Advances the animation clock and moves to the next frame when the
animation's `duration` has elapsed.

If the animation does not loop, it holds on the last frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds elapsed since the previous frame. |

#### Returns

`void`

#### Overrides

[`Behaviour`](Behaviour.md).[`update`](Behaviour.md#update)
