---
title: 'Function: createBunLoop()'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / createBunLoop

# Function: createBunLoop()

```ts
function createBunLoop(config: {
  fps?: number;
  onTick: (dt: number) => void;
}): {
  start: void;
  stop: void;
};
```

Defined in: [core/renderer/loops/terminal\_loop.ts:1](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/terminal_loop.ts#L1)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | \{ `fps?`: `number`; `onTick`: (`dt`: `number`) => `void`; \} |
| `config.fps?` | `number` |
| `config.onTick` | (`dt`: `number`) => `void` |

## Returns

```ts
{
  start: void;
  stop: void;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `start()` | () => `void` | [core/renderer/loops/terminal\_loop.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/terminal_loop.ts#L22) |
| `stop()` | () => `void` | [core/renderer/loops/terminal\_loop.ts:27](https://github.com/bdryanovski/gamefoo/blob/main/src/core/renderer/loops/terminal_loop.ts#L27) |
