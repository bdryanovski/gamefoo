---
title: 'Class: TilemapSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / TilemapSystem

# Class: TilemapSystem

Defined in: [core/tilemap/tilemap\_system.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L40)

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
new TilemapSystem(tilemap: TileMap): TilemapSystem;
```

Defined in: [core/tilemap/tilemap\_system.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L73)

Creates a new tilemap subsystem.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tilemap` | [`TileMap`](TileMap.md) | The tilemap to render each frame. |

#### Returns

`TilemapSystem`

#### Since

0.4.0

#### Example

```ts
const system = new TilemapSystem(myTileMap);
engine.use(system);
```

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `'tilemap'` | Subsystem identifier. | [core/tilemap/tilemap\_system.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L42) |
| <a id="order"></a> `order` | `public` | `number` | `15` | Execution order. `15` places this after camera (10) and before objects (20). | [core/tilemap/tilemap\_system.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L48) |
| <a id="camerasystem"></a> `cameraSystem` | `private` | `CameraLike` \| `null` | `null` | Cached reference to the camera subsystem, resolved in `init`. | [core/tilemap/tilemap\_system.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L54) |
| <a id="canvasheight"></a> `canvasHeight` | `private` | `number` | `0` | - | [core/tilemap/tilemap\_system.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L58) |
| <a id="canvaswidth"></a> `canvasWidth` | `private` | `number` | `0` | Canvas dimensions fallback when no camera is available. | [core/tilemap/tilemap\_system.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L57) |
| <a id="tilemap"></a> `tilemap` | `private` | [`TileMap`](TileMap.md) | `undefined` | The tilemap to render. | [core/tilemap/tilemap\_system.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L51) |

## Methods

### attachCamera()

```ts
attachCamera(cameraSystem: CameraLike): void;
```

Defined in: [core/tilemap/tilemap\_system.ts:113](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L113)

Attaches a camera system reference so the tilemap can use the
camera viewport for culling.

Call this after both subsystems are registered, or let the
system fall back to full-canvas rendering.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cameraSystem` | `CameraLike` | The active camera subsystem. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
const camSys = new CameraSystem(800, 600, () => player.getPosition());
const tmSys = new TilemapSystem(tilemap);
engine.use(camSys);
engine.use(tmSys);
tmSys.attachCamera(camSys);
```

***

### init()

```ts
init(engine: Engine): void;
```

Defined in: [core/tilemap/tilemap\_system.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L87)

Called by the engine when this subsystem is attached.

Stores canvas dimensions for viewport fallback and looks up the
[CameraSystem](CameraSystem.md) if present.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `engine` | [`Engine`](Engine.md) | The engine instance. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`init`](../interfaces/SubSystem.md#init)

***

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [core/tilemap/tilemap\_system.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/tilemap/tilemap_system.ts#L125)

Renders the tilemap. Uses the camera viewport for culling when
available, otherwise renders the full canvas area.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | Canvas 2D rendering context. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`render`](../interfaces/SubSystem.md#render)
