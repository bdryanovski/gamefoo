---
title: 'Class: IntervalLoopDriver'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / IntervalLoopDriver

# Class: IntervalLoopDriver

Defined in: [core/renderer/loops/loop.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L137)

Terminal / server game loop driver using `setInterval`.

Runs the game tick at a fixed target frame rate (default **30 FPS**).
Suitable for Bun / Node terminal games, headless simulations, and
server-side game logic.

For higher-precision frame timing in Bun, see `createBunLoop` in
`terminal_loop.ts`.

## Since

0.4.0

## Example

```ts
import { Engine, IntervalLoopDriver, TerminalRenderContext } from "gamefoo";

const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
const engine   = new Engine(renderer, {
  loopDriver: new IntervalLoopDriver(30),
});
engine.setup();
```

## See

[RAFLoopDriver](RAFLoopDriver.md) — browser alternative

## Implements

- [`LoopDriver`](../interfaces/LoopDriver.md)

## Constructors

### Constructor

```ts
new IntervalLoopDriver(fps?: number): IntervalLoopDriver;
```

Defined in: [core/renderer/loops/loop.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L150)

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
| <a id="fps"></a> `fps` | `private` | `number` | `30` | Target frames per second. Default `30`. | [core/renderer/loops/loop.ts:150](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L150) |
| <a id="handle"></a> `handle` | `private` | `Timeout` \| `null` | `null` | The handle returned by `setInterval`, or `null` if not running. | [core/renderer/loops/loop.ts:141](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L141) |

## Methods

### start()

```ts
start(tick: (dt: number) => void): void;
```

Defined in: [core/renderer/loops/loop.ts:162](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L162)

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

Defined in: [core/renderer/loops/loop.ts:176](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L176)

Clears the `setInterval` handle, stopping the loop.

#### Returns

`void`

#### Since

0.4.0

#### Implementation of

[`LoopDriver`](../interfaces/LoopDriver.md).[`stop`](../interfaces/LoopDriver.md#stop)
