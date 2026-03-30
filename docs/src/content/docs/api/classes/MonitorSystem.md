---
title: 'Class: MonitorSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MonitorSystem

# Class: MonitorSystem

Defined in: [subsystems/monitor\_system.ts:34](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L34)

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
new MonitorSystem(): MonitorSystem;
```

#### Returns

`MonitorSystem`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `public` | `string` | `'monitor'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/monitor\_system.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L35) |
| <a id="order"></a> `order` | `public` | `number` | `100` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/monitor\_system.ts:36](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L36) |
| <a id="x"></a> `x` | `public` | `number` | `8` | X position of the overlay in pixels. | [subsystems/monitor\_system.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L45) |
| <a id="y"></a> `y` | `public` | `number` | `8` | Y position of the overlay in pixels. | [subsystems/monitor\_system.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L47) |
| <a id="fps"></a> `fps` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L38) |
| <a id="framecount"></a> `frameCount` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L40) |
| <a id="frames"></a> `frames` | `private` | `number`[] | `[]` | - | [subsystems/monitor\_system.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L42) |
| <a id="memory"></a> `memory` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L41) |
| <a id="timer"></a> `timer` | `private` | `number` | `0` | - | [subsystems/monitor\_system.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L39) |

## Methods

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [subsystems/monitor\_system.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L69)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`render`](../interfaces/SubSystem.md#render)

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/monitor\_system.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L49)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
