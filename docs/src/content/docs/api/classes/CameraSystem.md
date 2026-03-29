---
title: 'Class: CameraSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / CameraSystem

# Class: CameraSystem

Defined in: [subsystems/camera\_system.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L14)

CameraSystem is responsible for managing the camera's position and view.
It can follow a target (like a player) and adjust the view accordingly.

## Since

0.2.0

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new CameraSystem(
   width: number, 
   height: number, 
   target: () => Vector2 | null): CameraSystem;
```

Defined in: [subsystems/camera\_system.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L25)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `width` | `number` |
| `height` | `number` |
| `target` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` |

#### Returns

`CameraSystem`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="camera"></a> `camera` | `public` | [`Camera`](Camera.md) | `undefined` | - | [subsystems/camera\_system.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L21) |
| <a id="id"></a> `id` | `public` | `string` | `'camera'` | The unique identifier for this subsystem. | [subsystems/camera\_system.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L18) |
| <a id="order"></a> `order` | `public` | `number` | `10` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/camera\_system.ts:19](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L19) |
| <a id="target"></a> `target` | `private` | () => [`Vector2`](../interfaces/Vector2.md) \| `null` | `undefined` | - | [subsystems/camera\_system.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L23) |

## Methods

### postRender()

```ts
postRender(ctx: RenderContext): void;
```

Defined in: [subsystems/camera\_system.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L50)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`postRender`](../interfaces/SubSystem.md#postrender)

***

### preRender()

```ts
preRender(ctx: RenderContext): void;
```

Defined in: [subsystems/camera\_system.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`preRender`](../interfaces/SubSystem.md#prerender)

***

### update()

```ts
update(): void;
```

Defined in: [subsystems/camera\_system.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/camera_system.ts#L33)

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
