---
title: 'Interface: LoopDriver'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / LoopDriver

# Interface: LoopDriver

Defined in: [core/renderer/loops/loop.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L23)

Abstraction over the mechanism that drives the game loop.

The engine delegates frame scheduling to a `LoopDriver` so that the
same `Engine` class can run in both browser (`requestAnimationFrame`)
and server (`setInterval` / Bun timer) environments.

Pass a driver via EngineConfig.loopDriver:

```ts
// Browser (default — no need to pass):
const engine = new Engine(renderer);

const engine = new Engine(renderer, {
  loopDriver: new IntervalLoopDriver(30),
});
```

## Since

0.4.0

## See

[RAFLoopDriver](../classes/RAFLoopDriver.md)      — browser `requestAnimationFrame` driver

## Methods

### start()

```ts
start(tick: (dt: number) => void): void;
```

Defined in: [core/renderer/loops/loop.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L41)

Starts the frame loop.

The provided `tick` callback is called once per frame with the
elapsed time in seconds since the previous frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `tick` | (`dt`: `number`) => `void` | Frame callback. Receives `deltaTime` in seconds. |

#### Returns

`void`

#### Since

0.4.0

#### Example

```ts
driver.start((dt) => {
  console.log(`Frame: ${dt.toFixed(4)}s`);
});
```

***

### stop()

```ts
stop(): void;
```

Defined in: [core/renderer/loops/loop.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/loop.ts#L51)

Stops the frame loop.

After calling `stop`, no further `tick` invocations occur until
`start` is called again.

#### Returns

`void`

#### Since

0.4.0
