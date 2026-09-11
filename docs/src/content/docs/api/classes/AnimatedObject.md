---
title: 'Class: AnimatedObject'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / AnimatedObject

# Class: AnimatedObject

Defined in: [core/map/animated\_object.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L18)

A lightweight animated placement: advances a [Clip](../interfaces/Clip.md) on its own
timer and blits the current frame at a fixed screen position.

Not an [Entity](Entity.md) — it carries no behaviours or collision. Screens
hold these directly for decorative animations (torches, fire, water).

## Since

0.5.0

## See

MachineObject — stateful/interactable objects

## Constructors

### Constructor

```ts
new AnimatedObject(
   clip: Clip, 
   x: number, 
   y: number, 
   transform?: Transform
): AnimatedObject;
```

Defined in: [core/map/animated\_object.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L28)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clip` | [`Clip`](../interfaces/Clip.md) | The resolved animation to play. |
| `x` | `number` | Pixel X within the screen. |
| `y` | `number` | Pixel Y within the screen. |
| `transform?` | [`Transform`](../interfaces/Transform.md) | Optional flip/rotation. |

#### Returns

`AnimatedObject`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="x"></a> `x` | `public` | `number` | `undefined` | Pixel X within the screen. | [core/map/animated\_object.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L30) |
| <a id="y"></a> `y` | `public` | `number` | `undefined` | Pixel Y within the screen. | [core/map/animated\_object.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L31) |
| <a id="clip"></a> `clip` | `private` | [`Clip`](../interfaces/Clip.md) | `undefined` | The resolved animation to play. | [core/map/animated\_object.ts:29](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L29) |
| <a id="frameindex"></a> `frameIndex` | `private` | `number` | `0` | - | [core/map/animated\_object.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L20) |
| <a id="time"></a> `time` | `private` | `number` | `0` | - | [core/map/animated\_object.ts:19](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L19) |
| <a id="transform"></a> `transform?` | `private` | [`Transform`](../interfaces/Transform.md) | `undefined` | Optional flip/rotation. | [core/map/animated\_object.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L32) |

## Accessors

### frame

#### Get Signature

```ts
get frame(): Frame | undefined;
```

Defined in: [core/map/animated\_object.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L40)

The frame currently displayed, or `undefined` for an empty clip.

##### Since

0.5.0

##### Returns

[`Frame`](../interfaces/Frame.md) \| `undefined`

## Methods

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/map/animated\_object.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L77)

Draws the current frame.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Since

0.5.0

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/map/animated\_object.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/map/animated_object.ts#L49)

Advances the animation clock by `deltaTime` seconds.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Since

0.5.0
