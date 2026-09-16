---
title: 'Class: ShaderStack'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ShaderStack

# Class: ShaderStack

Defined in: [core/shaders/shader\_stack.ts:17](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L17)

An ordered collection of [Shader](Shader.md)s bound to a single host (a game
object or the engine). Handles keyed look-up plus the per-frame update
and render fan-out, skipping disabled shaders.

Hosts embed a stack rather than inheriting from it, so both
[MapObject](MapObject.md) and [Entity](Entity.md) can expose identical shader APIs.

## Since

0.5.0

## Constructors

### Constructor

```ts
new ShaderStack(): ShaderStack;
```

#### Returns

`ShaderStack`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="items"></a> `items` | `private` | [`Shader`](Shader.md)[] | `[]` | [core/shaders/shader\_stack.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L18) |

## Accessors

### all

#### Get Signature

```ts
get all(): readonly Shader[];
```

Defined in: [core/shaders/shader\_stack.ts:63](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L63)

A read-only view of the attached shaders, in render order.

##### Returns

readonly [`Shader`](Shader.md)[]

## Methods

### attach()

```ts
attach<T extends Shader>(shader: T): T;
```

Defined in: [core/shaders/shader\_stack.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L24)

Adds a shader (rendered in insertion order) and returns it for
fluent configuration.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `shader` | `T` |

#### Returns

`T`

***

### clear()

```ts
clear(): void;
```

Defined in: [core/shaders/shader\_stack.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L56)

Removes every shader.

#### Returns

`void`

***

### detach()

```ts
detach(type: string): void;
```

Defined in: [core/shaders/shader\_stack.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L46)

Removes the first shader with `type`, if present.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`void`

***

### get()

```ts
get<T extends Shader>(type: string): T | undefined;
```

Defined in: [core/shaders/shader\_stack.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L32)

The first shader whose `type` matches `type`, or `undefined`.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Shader`](Shader.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`T` \| `undefined`

***

### has()

```ts
has(type: string): boolean;
```

Defined in: [core/shaders/shader\_stack.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L39)

Whether a shader with `type` is attached.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`boolean`

***

### render()

```ts
render(ctx: RenderContext, region: ShaderRegion): void;
```

Defined in: [core/shaders/shader\_stack.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L81)

Renders every enabled shader over `region`, in insertion order.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |
| `region` | [`ShaderRegion`](../interfaces/ShaderRegion.md) |

#### Returns

`void`

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [core/shaders/shader\_stack.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader_stack.ts#L70)

Advances every enabled shader.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`
