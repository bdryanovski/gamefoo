---
title: 'Class: MonitorSystem'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MonitorSystem

# Class: MonitorSystem

Defined in: [subsystems/monitor\_system.ts:13](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L13)

MonitorSystem is responsible for displaying debug information on the screen.
It uses the Monitor class to track and render various performance metrics,

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
| <a id="id"></a> `id` | `public` | `string` | `'monitor'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/monitor\_system.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L14) |
| <a id="order"></a> `order` | `public` | `number` | `100` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/monitor\_system.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L16) |
| <a id="monitor"></a> `monitor` | `private` | [`Monitor`](Monitor.md) | `undefined` | - | [subsystems/monitor\_system.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L18) |

## Methods

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [subsystems/monitor\_system.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L24)

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

Defined in: [subsystems/monitor\_system.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/monitor_system.ts#L20)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
