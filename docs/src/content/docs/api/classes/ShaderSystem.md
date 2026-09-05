---
title: 'Class: ShaderSystem'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ShaderSystem

# Class: ShaderSystem

Defined in: [subsystems/shader\_system.ts:29](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L29)

Engine-level shader host: applies full-screen [Shader](Shader.md)s as a final
post-render pass, after every other subsystem has drawn.

Register it with [Engine.use](Engine.md#use), then add screen effects (vignette,
colour grade, damage flash). The engine can look effects back up by key
via [ShaderSystem.get](#get) to toggle or reconfigure them at runtime.

## Since

0.5.0

## Example

```ts
const shaders = new ShaderSystem();
shaders.add(new VignetteShader({ intensity: 0.45 }));
engine.use(shaders);

// later — react to game state:
shaders.get<VignetteShader>("vignette")!.enabled = isNight;
```

## Implements

- [`SubSystem`](../interfaces/SubSystem.md)

## Constructors

### Constructor

```ts
new ShaderSystem(): ShaderSystem;
```

#### Returns

`ShaderSystem`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `true` | Determines the order in which subsystems are updated and rendered. Subsystems with lower order values are processed first. | [subsystems/shader\_system.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L37) |
| <a id="id"></a> `id` | `readonly` | `"shaders"` | `'shaders'` | A unique identifier for the subsystem, used for registration and management within the engine. | [subsystems/shader\_system.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L30) |
| <a id="order"></a> `order` | `readonly` | `900` | `900` | Runs late so effects composite over the finished frame. | [subsystems/shader\_system.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L35) |
| <a id="height"></a> `height` | `private` | `number` | `0` | - | [subsystems/shader\_system.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L41) |
| <a id="stack"></a> `stack` | `private` | [`ShaderStack`](ShaderStack.md) | `undefined` | - | [subsystems/shader\_system.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L39) |
| <a id="width"></a> `width` | `private` | `number` | `0` | - | [subsystems/shader\_system.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L40) |

## Methods

### add()

```ts
add<T extends Shader>(shader: T): T;
```

Defined in: [subsystems/shader\_system.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L55)

Adds a screen shader and returns it for fluent configuration.

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

### get()

```ts
get<T extends Shader>(type: string): T | undefined;
```

Defined in: [subsystems/shader\_system.ts:62](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L62)

The attached shader with `type`, or `undefined`.

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

### init()

```ts
init(engine: Engine): void;
```

Defined in: [subsystems/shader\_system.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L46)

Captures the screen dimensions to size the full-screen region.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `engine` | [`Engine`](Engine.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`init`](../interfaces/SubSystem.md#init)

***

### postRender()

```ts
postRender(ctx: RenderContext): void;
```

Defined in: [subsystems/shader\_system.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L77)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`postRender`](../interfaces/SubSystem.md#postrender)

***

### remove()

```ts
remove(type: string): void;
```

Defined in: [subsystems/shader\_system.ts:69](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L69)

Removes the shader with `type`, if present.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |

#### Returns

`void`

***

### update()

```ts
update(deltaTime: number): void;
```

Defined in: [subsystems/shader\_system.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/subsystems/shader_system.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Implementation of

[`SubSystem`](../interfaces/SubSystem.md).[`update`](../interfaces/SubSystem.md#update)
