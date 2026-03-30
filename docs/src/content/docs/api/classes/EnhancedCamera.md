---
title: 'Class: EnhancedCamera'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / EnhancedCamera

# Class: EnhancedCamera

Defined in: [core/enhanced\_camera.ts:110](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L110)

A 2-D viewport camera that tracks a target position within the game
world.

The camera stores its own `(x, y)` centre and viewport dimensions.
Each frame the [Engine](Engine.md) calls [Camera.follow](Camera.md#follow) with the
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

## Extends

- [`Camera`](Camera.md)

## Constructors

### Constructor

```ts
new EnhancedCamera(
   width: number, 
   height: number, 
   config?: EnhancedCameraConfig): EnhancedCamera;
```

Defined in: [core/enhanced\_camera.ts:139](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L139)

Creates an enhanced camera with the given viewport dimensions and
optional configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Viewport width in pixels. |
| `height` | `number` | Viewport height in pixels. |
| `config?` | [`EnhancedCameraConfig`](../interfaces/EnhancedCameraConfig.md) | Optional zoom, lerp, and pixel-perfect settings. |

#### Returns

`EnhancedCamera`

#### Since

0.4.0

#### Example

```ts
const camera = new EnhancedCamera(800, 600, {
  zoom: 2,
  lerpSpeed: 0.08,
  pixelPerfect: true,
});
```

#### Overrides

[`Camera`](Camera.md).[`constructor`](Camera.md#constructor)

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_lerpspeed"></a> `_lerpSpeed` | `private` | `number` | - | [core/enhanced\_camera.ts:114](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L114) |
| <a id="_maxzoom"></a> `_maxZoom` | `private` | `number` | - | [core/enhanced\_camera.ts:113](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L113) |
| <a id="_minzoom"></a> `_minZoom` | `private` | `number` | - | [core/enhanced\_camera.ts:112](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L112) |
| <a id="_pixelperfect"></a> `_pixelPerfect` | `private` | `boolean` | - | [core/enhanced\_camera.ts:115](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L115) |
| <a id="_viewcache"></a> `_viewCache` | `private` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | Cached view rect to avoid per-call allocation. | [core/enhanced\_camera.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L118) |
| `_viewCache.height` | `public` | `number` | - | [core/enhanced\_camera.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L118) |
| `_viewCache.width` | `public` | `number` | - | [core/enhanced\_camera.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L118) |
| `_viewCache.x` | `public` | `number` | - | [core/enhanced\_camera.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L118) |
| `_viewCache.y` | `public` | `number` | - | [core/enhanced\_camera.ts:118](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L118) |
| <a id="_zoom"></a> `_zoom` | `private` | `number` | - | [core/enhanced\_camera.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L111) |

## Accessors

### lerpSpeed

#### Get Signature

```ts
get lerpSpeed(): number;
```

Defined in: [core/enhanced\_camera.ts:179](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L179)

Interpolation speed for smooth follow. A value of `0.1` means
the camera covers 10% of the remaining distance each frame.

##### Since

0.4.0

##### Returns

`number`

#### Set Signature

```ts
set lerpSpeed(value: number): void;
```

Defined in: [core/enhanced\_camera.ts:183](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### zoom

#### Get Signature

```ts
get zoom(): number;
```

Defined in: [core/enhanced\_camera.ts:165](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L165)

Current zoom level. Setting this value automatically clamps it
within [[EnhancedCameraConfig.minZoom](../interfaces/EnhancedCameraConfig.md#minzoom),
[EnhancedCameraConfig.maxZoom](../interfaces/EnhancedCameraConfig.md#maxzoom)] and applies pixel-perfect
rounding if enabled.

##### Since

0.4.0

##### Example

```ts
camera.zoom = 3;
console.log(camera.zoom); // 3

camera.zoom = 10; // clamped to maxZoom
console.log(camera.zoom); // 4 (default max)
```

##### Returns

`number`

#### Set Signature

```ts
set zoom(value: number): void;
```

Defined in: [core/enhanced\_camera.ts:169](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

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

#### Inherited from

[`Camera`](Camera.md).[`follow`](Camera.md#follow)

***

### getPosition()

```ts
getPosition(): Vector2;
```

Defined in: [core/camera.ts:96](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L96)

Returns the current centre position of the camera.

#### Returns

[`Vector2`](../interfaces/Vector2.md)

A new [Vector2](../interfaces/Vector2.md) copy of the camera centre.

#### Inherited from

[`Camera`](Camera.md).[`getPosition`](Camera.md#getposition)

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

Defined in: [core/enhanced\_camera.ts:231](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L231)

Returns the visible viewport rectangle in world-space, adjusted
for the current zoom level.

At zoom 2× the visible area is half the size; at zoom 0.5× it is
double.

#### Returns

```ts
{
  height: number;
  width: number;
  x: number;
  y: number;
}
```

An `{ x, y, width, height }` rectangle in world-space.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [core/enhanced\_camera.ts:235](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L235) |
| `width` | `number` | [core/enhanced\_camera.ts:234](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L234) |
| `x` | `number` | [core/enhanced\_camera.ts:232](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L232) |
| `y` | `number` | [core/enhanced\_camera.ts:233](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L233) |

#### Since

0.4.0

#### Example

```ts
const view = camera.getViewRect();
// Use for viewport culling or coordinate conversion
```

#### Overrides

[`Camera`](Camera.md).[`getViewRect`](Camera.md#getviewrect)

***

### moveTo()

```ts
moveTo(target: Vector2): void;
```

Defined in: [core/camera.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L87)

Instantly teleports the camera to a specific position.

Functionally identical to [Camera.follow](Camera.md#follow) but communicates
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

#### Inherited from

[`Camera`](Camera.md).[`moveTo`](Camera.md#moveto)

***

### resize()

```ts
resize(width: number, height: number): void;
```

Defined in: [core/camera.ts:140](https://github.com/bdryanovski/gamefoo/blob/main/src/core/camera.ts#L140)

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

#### Inherited from

[`Camera`](Camera.md).[`resize`](Camera.md#resize)

***

### screenToWorld()

```ts
screenToWorld(screenX: number, screenY: number): Vector2;
```

Defined in: [core/enhanced\_camera.ts:267](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L267)

Converts a screen-space position (e.g. mouse coordinates on the
canvas) to world-space coordinates, accounting for camera offset
and zoom.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | X coordinate on the canvas. |
| `screenY` | `number` | Y coordinate on the canvas. |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

World-space position.

#### Since

0.4.0

#### Example

```ts
canvas.addEventListener("click", (e) => {
  const world = camera.screenToWorld(e.offsetX, e.offsetY);
  console.log("Clicked at world:", world.x, world.y);
});
```

***

### smoothFollow()

```ts
smoothFollow(target: Vector2, deltaTime: number): void;
```

Defined in: [core/enhanced\_camera.ts:206](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L206)

Smoothly moves the camera toward a target position using linear
interpolation.

Call this every frame instead of [Camera.follow](Camera.md#follow) for fluid
camera movement.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | [`Vector2`](../interfaces/Vector2.md) | World-space position to track. |
| `deltaTime` | `number` | Seconds since last frame. Used for frame-rate independent interpolation. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
// In your update loop:
camera.smoothFollow(player.getPosition(), deltaTime);
```

***

### worldToScreen()

```ts
worldToScreen(worldX: number, worldY: number): Vector2;
```

Defined in: [core/enhanced\_camera.ts:291](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L291)

Converts a world-space position to screen-space canvas coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `worldX` | `number` | World-space X coordinate. |
| `worldY` | `number` | World-space Y coordinate. |

#### Returns

[`Vector2`](../interfaces/Vector2.md)

Screen-space position.

#### Since

0.4.0

#### Example

```ts
const screen = camera.worldToScreen(entity.x, entity.y);
// Draw a UI element at the entity's screen position
ctx.fillText("!", screen.x, screen.y);
```

***

### clampZoom()

```ts
private clampZoom(value: number): number;
```

Defined in: [core/enhanced\_camera.ts:304](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L304)

**`Internal`**

Clamps and optionally rounds a zoom value.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

#### Returns

`number`
