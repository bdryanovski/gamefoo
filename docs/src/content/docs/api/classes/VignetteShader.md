---
title: 'Class: VignetteShader'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / VignetteShader

# Class: VignetteShader

Defined in: [core/shaders/vignette\_shader.ts:41](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L41)

A full-screen vignette: transparent at the centre, darkening toward the
edges. Register it with a [ShaderSystem](ShaderSystem.md) for an engine-wide mood
effect (dungeon gloom, focus framing, damage flash when animated).

## Since

0.5.0

## Example

**Engine-wide dungeon gloom**

```ts
const shaders = new ShaderSystem();
shaders.add(new VignetteShader({ intensity: 0.45 }));
engine.use(shaders);
```

## Extends

- [`Shader`](Shader.md)

## Constructors

### Constructor

```ts
new VignetteShader(config?: VignetteConfig): VignetteShader;
```

Defined in: [core/shaders/vignette\_shader.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`VignetteConfig`](../interfaces/VignetteConfig.md) |

#### Returns

`VignetteShader`

#### Overrides

[`Shader`](Shader.md).[`constructor`](Shader.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `undefined` | When `false`, the stack skips this shader's update and render. | - | [`Shader`](Shader.md).[`enabled`](Shader.md#enabled) | [core/shaders/shader.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L42) |
| <a id="type"></a> `type` | `readonly` | `"vignette"` | `'vignette'` | Unique key used by [ShaderStack.get](ShaderStack.md#get) / [ShaderStack.detach](ShaderStack.md#detach). | [`Shader`](Shader.md).[`type`](Shader.md#type) | - | [core/shaders/vignette\_shader.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L42) |
| <a id="color"></a> `color` | `private` | `string` | `undefined` | - | - | - | [core/shaders/vignette\_shader.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L44) |
| <a id="inner"></a> `inner` | `private` | `number` | `undefined` | - | - | - | [core/shaders/vignette\_shader.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L46) |
| <a id="intensity"></a> `intensity` | `private` | `number` | `undefined` | - | - | - | [core/shaders/vignette\_shader.ts:45](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L45) |

## Methods

### center()

```ts
protected static center(region: ShaderRegion): {
  x: number;
  y: number;
};
```

Defined in: [core/shaders/shader.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L84)

Centre point of a region, a common anchor for radial effects.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `region` | [`ShaderRegion`](../interfaces/ShaderRegion.md) |

#### Returns

```ts
{
  x: number;
  y: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/shaders/shader.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L84) |
| `y` | `number` | [core/shaders/shader.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L84) |

#### Inherited from

[`Shader`](Shader.md).[`center`](Shader.md#center)

***

### render()

```ts
render(ctx: RenderContext, region: ShaderRegion): void;
```

Defined in: [core/shaders/vignette\_shader.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L55)

Draws the effect for `region`.

Canvas-backed effects should obtain the raw context via
[Shader.raw](Shader.md#raw) and return early when it is `null`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |
| `region` | [`ShaderRegion`](../interfaces/ShaderRegion.md) | The area to affect (object box or full screen). |

#### Returns

`void`

#### Overrides

[`Shader`](Shader.md).[`render`](Shader.md#render)

***

### update()

```ts
update(_deltaTime: number): void;
```

Defined in: [core/shaders/shader.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L59)

Advances any time-based state (pulses, particle simulation).

The default is a no-op; override for animated effects.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `_deltaTime` | `number` | Seconds since the previous frame. |

#### Returns

`void`

#### Inherited from

[`Shader`](Shader.md).[`update`](Shader.md#update)

***

### raw()

```ts
protected raw(ctx: RenderContext): CanvasRenderingContext2D | null;
```

Defined in: [core/shaders/shader.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L77)

The raw `CanvasRenderingContext2D`, or `null` on non-canvas renderers.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |

#### Returns

`CanvasRenderingContext2D` \| `null`

#### Inherited from

[`Shader`](Shader.md).[`raw`](Shader.md#raw)
