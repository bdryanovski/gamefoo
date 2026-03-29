---
title: 'Class: IsometricCameraSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IsometricCameraSystem

# Class: IsometricCameraSystem

Defined in: [subsystems/iso\_camera\_system.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L55)

SubSystem is a modular component of the game engine that can be added or removed as needed.
It provides hooks for initialization, updating, rendering, and destruction.
Each subsystem can have its own logic and state, and can interact with the engine and other subsystems.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new IsometricCameraSystem(
   width: number, 
   height: number, 
   target: () => Vector2 | null, 
   projection?: IsometricProjection, 
   config?: EnhancedCameraConfig): IsometricCameraSystem;
```

Defined in: [subsystems/iso\_camera\_system.ts:100](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L100)

Creates a new isometric camera subsystem.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Viewport width in pixels. |
| `height` | `number` | Viewport height in pixels. |
| `target` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` | Function returning the world-space position to follow, or `null` for free camera. |
| `projection?` | [`IsometricProjection`](IsometricProjection.md) | Optional isometric projection. Stored for reference by other systems. |
| `config?` | [`EnhancedCameraConfig`](../interfaces/EnhancedCameraConfig.md) | Optional camera configuration (zoom, lerp, etc.). |

#### Returns

`IsometricCameraSystem`

#### Since

0.4.0

#### Example

```ts
const system = new IsometricCameraSystem(
  800, 600,
  () => player.getPosition(),
  isoProjection,
  { zoom: 2, lerpSpeed: 0.08 },
);
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="camera"></a> `camera` | `public` | [`EnhancedCamera`](EnhancedCamera.md) | `undefined` | The enhanced camera instance. Exposed for external use. | [subsystems/iso\_camera\_system.ts:66](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L66) |
| <a id="id"></a> `id` | `public` | `string` | `'camera'` | Subsystem identifier. | [subsystems/iso\_camera\_system.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L57) |
| <a id="order"></a> `order` | `public` | `number` | `10` | Execution order. `10` ensures the camera transform is applied before tilemap (15) and entity (20) rendering. | [subsystems/iso\_camera\_system.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L63) |
| <a id="projection"></a> `projection` | `public` | [`IsometricProjection`](IsometricProjection.md) \| `null` | `undefined` | Isometric projection reference, stored for convenience. `null` when used for orthogonal games. | [subsystems/iso\_camera\_system.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L72) |
| <a id="target"></a> `target` | `private` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` | `undefined` | Target position supplier. Returns `null` for free camera. | [subsystems/iso\_camera\_system.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L75) |

## Methods

### postRender()

```ts
postRender(ctx: RenderContext): void;
```

Defined in: [subsystems/iso\_camera\_system.ts:154](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L154)

Restores the context state after all rendering is complete.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`postRender`](../interfaces/SubSystem.md#postrender)

***

### preRender()

```ts
preRender(ctx: RenderContext): void;
```

Defined in: [subsystems/iso\_camera\_system.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L137)

Applies the camera transform before rendering.

Saves the context state, applies zoom scaling and translates to
the camera viewport. Image smoothing is explicitly disabled to
preserve pixel-art crispness after the scale operation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Canvas 2D rendering context. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`preRender`](../interfaces/SubSystem.md#prerender)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/iso\_camera\_system.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/iso_camera_system.ts#L119)

Updates the camera position each frame using smooth interpolation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | Seconds since the last frame. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
