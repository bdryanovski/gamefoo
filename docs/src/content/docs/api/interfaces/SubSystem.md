---
title: 'Interface: SubSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / SubSystem

# Interface: SubSystem

Defined in: [subsystems/types.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L14)

SubSystem is a modular component of the game engine that can be added or removed as needed.
It provides hooks for initialization, updating, rendering, and destruction.
Each subsystem can have its own logic and state, and can interact with the engine and other subsystems.

## Since

0.2.0

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled?` | `boolean` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/types.ts:25](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L25) |
| <a id="id"></a> `id` | `string` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/types.ts:19](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L19) |
| <a id="order"></a> `order?` | `number` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/types.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L31) |

## Methods

### destroy()?

```ts
optional destroy(): void;
```

Defined in: [subsystems/types.ts:47](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L47)

#### Returns

`void`

***

### init()?

```ts
optional init(engine: Engine): void;
```

Defined in: [subsystems/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L37)

Called when the subsystem is added to the engine. Use this method to perform any
necessary setup or initialization.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `engine` | [`Engine`](../classes/Engine.md) |

#### Returns

`void`

***

### postRender()?

```ts
optional postRender(ctx: RenderContext): void;
```

Defined in: [subsystems/types.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L45)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](RenderContext.md) |

#### Returns

`void`

***

### postUpdate()?

```ts
optional postUpdate(deltaTime: number): void;
```

Defined in: [subsystems/types.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L41)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

***

### preRender()?

```ts
optional preRender(ctx: RenderContext): void;
```

Defined in: [subsystems/types.ts:43](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L43)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](RenderContext.md) |

#### Returns

`void`

***

### preUpdate()?

```ts
optional preUpdate(deltaTime: number): void;
```

Defined in: [subsystems/types.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

***

### render()?

```ts
optional render(ctx: RenderContext): void;
```

Defined in: [subsystems/types.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L44)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](RenderContext.md) |

#### Returns

`void`

***

### update()?

```ts
optional update(deltaTime: number): void;
```

Defined in: [subsystems/types.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/types.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
