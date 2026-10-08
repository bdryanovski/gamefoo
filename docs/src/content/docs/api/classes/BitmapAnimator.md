---
title: 'Class: BitmapAnimator'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / BitmapAnimator

# Class: BitmapAnimator

Defined in: [core/renderer/objects/bitmap\_animator.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L34)

## Extends

- `default`

## Constructors

### Constructor

```ts
new BitmapAnimator(
   position: Vector2, 
   size: Demension, 
   animations?: BitmapAnimatorData, 
   duration?: number
): BitmapAnimator;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L72)

Creates a new BitmapAnimator.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `position` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | Position to render at. |
| `size` | [`Demension`](../interfaces/Demension.md) | `undefined` | Size of the animation. |
| `animations` | `BitmapAnimatorData` | `{}` | Map of animation names to Bitmap frame arrays. |
| `duration` | `number` | `0.1` | Seconds per frame (default: 0.1). |

#### Returns

`BitmapAnimator`

#### Since

0.5.0

#### Overrides

```ts
Node.constructor
```

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="current"></a> `current` | `protected` | `string` \| `null` | `null` | Current animation name. | - | [core/renderer/objects/bitmap\_animator.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L45) |
| <a id="duration"></a> `duration` | `protected` | `number` | `0.1` | Duration of each frame (seconds). Default 0.1 = 100ms. | - | [core/renderer/objects/bitmap\_animator.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L60) |
| <a id="elapsed"></a> `elapsed` | `protected` | `number` | `0` | Time elapsed since last frame change (seconds). | - | [core/renderer/objects/bitmap\_animator.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L55) |
| <a id="enableloop"></a> `enableLoop` | `protected` | `boolean` | `false` | Whether the animation loops. | - | [core/renderer/objects/bitmap\_animator.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L40) |
| <a id="position"></a> `position` | `readonly` | [`Vector2`](../interfaces/Vector2.md) | `undefined` | World-space position of the node's origin (top-left corner). **Since** 0.5.0 | `Node.position` | [entities/node.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L50) |
| <a id="progress"></a> `progress` | `protected` | `number` | `0` | Current frame index. | - | [core/renderer/objects/bitmap\_animator.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L50) |
| <a id="size"></a> `size` | `readonly` | [`Demension`](../interfaces/Demension.md) | `undefined` | Bounding dimensions of the node in pixels. **Since** 0.5.0 | `Node.size` | [entities/node.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/entities/node.ts#L57) |
| <a id="animations"></a> `animations` | `private` | `BitmapAnimatorData` | `undefined` | - | - | [core/renderer/objects/bitmap\_animator.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L35) |

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

```ts
Node.x
```

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

```ts
Node.y
```

## Methods

### getDuration()

```ts
getDuration(): number;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L138)

Gets the current frame duration.

#### Returns

`number`

Seconds per frame.

#### Since

0.5.0

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

### loop()

```ts
loop(enabled: boolean): void;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L107)

Enables or disables looping.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `enabled` | `boolean` | Whether to loop the animation. |

#### Returns

`void`

#### Since

0.5.0

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:149](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L149)

Renders the current animation frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The rendering context. |

#### Returns

`void`

#### Since

0.5.0

#### Overrides

```ts
Node.render
```

***

### setDuration()

```ts
setDuration(seconds: number): void;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L127)

Sets the frame duration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `seconds` | `number` | Seconds per frame (e.g., 0.1 = 100ms, 0.25 = 250ms). |

#### Returns

`void`

#### Since

0.5.0

#### Example

```ts
animator.setDuration(0.5);  // 2 fps, Very slow
animator.setDuration(0.25); // 4 fps, slow retro feel
animator.setDuration(0.15); // 7 fps, Medium
animator.setDuration(0.1);  // 10 fps, smooth
animator.setDuration(0.05); // 20 fps, fast, smooth
```

***

### state()

```ts
state(name: string): void;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L92)

Sets the current animation by name.

Resets playback to the first frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Animation name (key in animations map). |

#### Returns

`void`

#### Since

0.5.0

***

### update()

```ts
update(dt: number): void;
```

Defined in: [core/renderer/objects/bitmap\_animator.ts:173](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/objects/bitmap_animator.ts#L173)

Advances the animation based on elapsed time.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `dt` | `number` | Seconds since last frame. |

#### Returns

`void`

#### Since

0.5.0

#### Overrides

```ts
Node.update
```

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
