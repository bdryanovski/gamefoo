---
title: 'Class: CameraSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CameraSystem

# Class: CameraSystem

Defined in: [subsystems/camera\_system.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L45)

Camera subsystem with optional zoom, smooth follow, and isometric-aware
viewport transforms.

`CameraSystem` manages an [EnhancedCamera](EnhancedCamera.md) and applies the correct
canvas transform (translation + optional zoom scaling) every frame. It
works for both orthogonal (top-down) and isometric games.

Defaults (`zoom=1`, `lerpSpeed=1`) produce instant-follow behaviour
identical to the original simple camera, so existing code requires
no changes.

## Since

0.2.0

## Examples

**Basic orthogonal camera (no zoom, instant follow)**

```ts
engine.use(new CameraSystem(800, 600, () => player.getPosition()));
```

**Smooth-follow with zoom**

```ts
engine.use(new CameraSystem(800, 600, () => player.getPosition(), undefined, {
  zoom: 2,
  lerpSpeed: 0.08,
  pixelPerfect: true,
}));
```

**Isometric game with projection reference**

```ts
engine.use(new CameraSystem(800, 600, () => player.getPosition(), isoProjection, {
  zoom: 2,
  lerpSpeed: 0.05,
}));
```

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new CameraSystem(
   width: number, 
   height: number, 
   target: () => Vector2 | null, 
   projection?: IsometricProjection, 
   config?: EnhancedCameraConfig
): CameraSystem;
```

Defined in: [subsystems/camera\_system.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L90)

Creates a new camera subsystem.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Viewport width in pixels. |
| `height` | `number` | Viewport height in pixels. |
| `target` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` | Function returning the world-space position to follow. |
| `projection?` | [`IsometricProjection`](IsometricProjection.md) | Optional isometric projection (stored for reference). |
| `config?` | [`EnhancedCameraConfig`](../interfaces/EnhancedCameraConfig.md) | Optional camera configuration (zoom, lerpSpeed, etc.). |

#### Returns

`CameraSystem`

#### Since

0.2.0

#### Example

```ts
const camSys = new CameraSystem(800, 600, () => player.getPosition());
engine.use(camSys);
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="camera"></a> `camera` | `public` | [`EnhancedCamera`](EnhancedCamera.md) | `undefined` | The underlying enhanced camera. Exposed for external consumers. | [subsystems/camera\_system.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L60) |
| <a id="id"></a> `id` | `public` | `string` | `'camera'` | Subsystem identifier. | [subsystems/camera\_system.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L49) |
| <a id="order"></a> `order` | `public` | `number` | `10` | Execution order. `10` ensures the camera transform is applied before tilemap (15) and entity (20) rendering. | [subsystems/camera\_system.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L55) |
| <a id="projection"></a> `projection` | `public` | [`IsometricProjection`](IsometricProjection.md) \| `null` | `undefined` | Optional isometric projection reference, stored for convenience. `null` for orthogonal games. | [subsystems/camera\_system.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L66) |
| <a id="target"></a> `target` | `private` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` | `undefined` | Target position supplier. Returns `null` for free camera. | [subsystems/camera\_system.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L71) |

## Methods

### postRender()

```ts
postRender(ctx: RenderContext): void;
```

Defined in: [subsystems/camera\_system.ts:145](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L145)

Restores the context state after all rendering is complete.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`postRender`](../interfaces/SubSystem.md#postrender)

***

### preRender()

```ts
preRender(ctx: RenderContext): void;
```

Defined in: [subsystems/camera\_system.ts:127](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L127)

Applies the camera transform before rendering.

Saves the context state, applies zoom scaling and translates to
the camera viewport. Image smoothing is explicitly disabled when
zoom != 1 to preserve pixel-art crispness.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Canvas 2D rendering context. |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`preRender`](../interfaces/SubSystem.md#prerender)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/camera\_system.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L111)

Updates the camera position each frame using smooth interpolation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds since the last frame. |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
