---
title: 'Class: RAFLoopDriver'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / RAFLoopDriver

# Class: RAFLoopDriver

Defined in: [core/renderer/loops/loop.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L73)

Browser game loop driver using `requestAnimationFrame`.

This is the **default** loop driver used by [Engine](Engine.md) when no
explicit driver is supplied. It synchronises with the browser's
display refresh rate (typically 60 Hz or the monitor's native rate).

## Since

0.4.0

## Example

```ts
// Explicit (normally not needed — it is the default):
const engine = new Engine(renderer, {
  loopDriver: new RAFLoopDriver(),
});
```

## See

[IntervalLoopDriver](IntervalLoopDriver.md) — alternative for server

## Implements

- [`LoopDriver`](../interfaces/LoopDriver.md)

## Constructors

### Constructor

```ts
new RAFLoopDriver(): RAFLoopDriver;
```

#### Returns

`RAFLoopDriver`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="handle"></a> `handle` | `private` | `number` | `0` | The handle returned by `requestAnimationFrame`. | [core/renderer/loops/loop.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L77) |
| <a id="lasttime"></a> `lastTime` | `private` | `number` | `0` | Timestamp of the previous frame in milliseconds. | [core/renderer/loops/loop.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L82) |

## Methods

### start()

```ts
start(tick: (dt: number) => void): void;
```

Defined in: [core/renderer/loops/loop.ts:94](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L94)

Starts the `requestAnimationFrame` loop.

On the very first frame `deltaTime` is `0` to avoid a spurious large
delta on initialisation.

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

Defined in: [core/renderer/loops/loop.ts:109](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L109)

Cancels the pending `requestAnimationFrame` call.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`LoopDriver`](../interfaces/LoopDriver.md).[`stop`](../interfaces/LoopDriver.md#stop)
