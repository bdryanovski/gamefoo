---
title: 'Class: Monitor'
---

[**@dryanovski/gamefoo v0.0.1**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Monitor

# Class: Monitor

Defined in: [debug/monitor.ts:5](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L5)

## Constructors

### Constructor

```ts
new Monitor(): Monitor;
```

#### Returns

`Monitor`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="x"></a> `x` | `public` | `number` | `8` | [debug/monitor.ts:13](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L13) |
| <a id="y"></a> `y` | `public` | `number` | `8` | [debug/monitor.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L14) |
| <a id="fps"></a> `fps` | `private` | `number` | `0` | [debug/monitor.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L6) |
| <a id="framecount"></a> `frameCount` | `private` | `number` | `0` | [debug/monitor.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L8) |
| <a id="frames"></a> `frames` | `private` | `number`[] | `undefined` | [debug/monitor.ts:11](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L11) |
| <a id="memory"></a> `memory` | `private` | `number` | `0` | [debug/monitor.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L9) |
| <a id="timer"></a> `timer` | `private` | `number` | `0` | [debug/monitor.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L7) |

## Methods

### render()

```ts
render(ctx: CanvasRenderingContext2D): void;
```

Defined in: [debug/monitor.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | `CanvasRenderingContext2D` |

#### Returns

`void`

***

### update()

```ts
update(delta: number): void;
```

Defined in: [debug/monitor.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `delta` | `number` |

#### Returns

`void`
