---
title: 'Class: Camera'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Camera

# Class: Camera

Defined in: [core/camera.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L32)

A 2-D viewport camera that tracks a target position within the game
world.

The camera stores its own `(x, y)` centre and viewport dimensions.
Each frame the [Engine](Engine.md) calls [Camera.follow](#follow) with the
player's position so the viewport stays centred on the action.

## Since

0.1.0

## Examples

```ts
const camera = new Camera(800, 600);
camera.follow(player.getPosition());

const view = camera.getViewRect();
// view → { x: px - 400, y: py - 300, width: 800, height: 600 }
```

```ts
const camera = new Camera(800, 600);
camera.moveTo({ x: 0, y: 0 });       // jump to origin
console.log(camera.getPosition());    // { x: 0, y: 0 }
```

## See

[Engine](Engine.md) — owns and drives the camera each frame

## Constructors

### Constructor

```ts
new Camera(width: number, height: number): Camera;
```

Defined in: [core/camera.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L51)

Creates a camera with the given viewport dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Viewport width in pixels. |
| `height` | `number` | Viewport height in pixels. |

#### Returns

`Camera`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="height"></a> `height` | `private` | `number` | `undefined` | Viewport height in pixels. | [core/camera.ts:43](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L43) |
| <a id="width"></a> `width` | `private` | `number` | `undefined` | Viewport width in pixels. | [core/camera.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L40) |
| <a id="x"></a> `x` | `private` | `number` | `0` | Current X coordinate of the camera centre. | [core/camera.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L34) |
| <a id="y"></a> `y` | `private` | `number` | `0` | Current Y coordinate of the camera centre. | [core/camera.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L37) |

## Methods

### follow()

```ts
follow(target: Vector2): void;
```

Defined in: [core/camera.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L68)

Centres the camera on a target position.

Called by the engine every frame when a player is set.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) | The world-space position to track. |

#### Returns

`void`

#### Example

```ts
camera.follow(player.getPosition());
```

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [core/camera.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L97)

Returns the current centre position of the camera.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

A new [Vector2](../interfaces/Vector2.md) copy of the camera centre.

***

### getViewRect()

```ts
getViewRect(): {
  height: number;
  width: number;
  x: number;
  y: number;
};
```

Defined in: [core/camera.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L119)

Computes the axis-aligned rectangle that represents the visible
area in world-space.

The rectangle is centred on the camera's current position.

#### Returns

```ts
{
  height: number;
  width: number;
  x: number;
  y: number;
}
```

An object with `x` (left edge), `y` (top edge), `width`,
  and `height`.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/camera.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L119) |
| `width` | `number` | [core/camera.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L119) |
| `x` | `number` | [core/camera.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L119) |
| `y` | `number` | [core/camera.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L119) |

#### Example

```ts
const rect = camera.getViewRect();
// Use rect to cull off-screen objects
if (entity.x < rect.x || entity.x > rect.x + rect.width) {
  return; // off-screen — skip rendering
}
```

***

### moveTo()

```ts
moveTo(target: Vector2): void;
```

Defined in: [core/camera.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L87)

Instantly teleports the camera to a specific position.

Functionally identical to [Camera.follow](#follow) but communicates
intent more clearly for one-shot repositioning (e.g. scene
transitions).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) | The world-space position to jump to. |

#### Returns

`void`

#### Example

```ts
camera.moveTo({ x: 500, y: 300 });
```

***

### resize()

```ts
resize(width: number, height: number): void;
```

Defined in: [core/camera.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L141)

Updates the viewport dimensions, e.g. after a window resize.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | New viewport width in pixels. |
| `height` | `number` | New viewport height in pixels. |

#### Returns

`void`

#### Example

```ts
window.addEventListener("resize", () => {
  camera.resize(window.innerWidth, window.innerHeight);
});
```
