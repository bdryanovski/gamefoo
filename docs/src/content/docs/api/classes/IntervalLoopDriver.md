---
title: 'Class: IntervalLoopDriver'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IntervalLoopDriver

# Class: IntervalLoopDriver

Defined in: [core/renderer/loops/loop.ts:125](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L125)

Server game loop driver using `setInterval`.

Runs the game tick at a fixed target frame rate (default **30 FPS**).
Suitable forgames, headless simulations, and
server-side game logic.

## Since

0.4.0

## See

[RAFLoopDriver](RAFLoopDriver.md) — browser alternative

## Implements

- [`LoopDriver`](../interfaces/LoopDriver.md)

## Constructors

### Constructor

```ts
new IntervalLoopDriver(fps?: number): IntervalLoopDriver;
```

Defined in: [core/renderer/loops/loop.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L138)

Creates a new interval-based loop driver.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `fps` | `number` | `30` | Target frames per second. Default `30`. |

#### Returns

`IntervalLoopDriver`

#### Since

0.4.0

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="fps"></a> `fps` | `private` | `number` | `30` | Target frames per second. Default `30`. | [core/renderer/loops/loop.ts:138](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L138) |
| <a id="handle"></a> `handle` | `private` | `Timeout` \| `null` | `null` | The handle returned by `setInterval`, or `null` if not running. | [core/renderer/loops/loop.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L129) |

## Methods

### start()

```ts
start(tick: (dt: number) => void): void;
```

Defined in: [core/renderer/loops/loop.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L150)

Starts the `setInterval` loop at the configured FPS.

`deltaTime` is computed from `Date.now()` differences and will
drift slightly from the target interval under system load.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tick` | (`dt`: `number`) => `void` | Frame callback, invoked with `deltaTime` in seconds. |

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`LoopDriver`](../interfaces/LoopDriver.md).[`start`](../interfaces/LoopDriver.md#start)

***

### stop()

```ts
stop(): void;
```

Defined in: [core/renderer/loops/loop.ts:164](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L164)

Clears the `setInterval` handle, stopping the loop.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`LoopDriver`](../interfaces/LoopDriver.md).[`stop`](../interfaces/LoopDriver.md#stop)
