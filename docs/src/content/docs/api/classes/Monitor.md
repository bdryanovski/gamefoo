---
title: 'Class: Monitor'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Monitor

# Class: Monitor

Defined in: [debug/monitor.ts:6](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L6)

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
| <a id="x"></a> `x` | `public` | `number` | `8` | [debug/monitor.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L14) |
| <a id="y"></a> `y` | `public` | `number` | `8` | [debug/monitor.ts:15](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L15) |
| <a id="fps"></a> `fps` | `private` | `number` | `0` | [debug/monitor.ts:7](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L7) |
| <a id="framecount"></a> `frameCount` | `private` | `number` | `0` | [debug/monitor.ts:9](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L9) |
| <a id="frames"></a> `frames` | `private` | `number`[] | `undefined` | [debug/monitor.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L12) |
| <a id="memory"></a> `memory` | `private` | `number` | `0` | [debug/monitor.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L10) |
| <a id="timer"></a> `timer` | `private` | `number` | `0` | [debug/monitor.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L8) |

## Methods

### render()

```ts
render(ctx: RenderContext): void;
```

Defined in: [debug/monitor.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

***

### update()

```ts
update(delta: number): void;
```

Defined in: [debug/monitor.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/debug/monitor.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `delta` | `number` |

#### Returns

`void`
