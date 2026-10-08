---
title: 'Abstract Class: Shader'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / Shader

# Abstract Class: Shader

Defined in: [core/shaders/shader.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L33)

Base class for every screen effect ("shader").

A shader draws an effect over a [ShaderRegion](../interfaces/ShaderRegion.md) each frame. Attach
instances to a game object (see [MapObject.attachShader](MapObject.md#attachshader)) to affect
that object's area, or register them with a [ShaderSystem](ShaderSystem.md) to affect
the whole screen. Time-based effects advance in [Shader.update](#update).

Subclasses **must** implement:
- [Shader.type](#type) — a unique string key used for look-ups.
- [Shader.render](#render) — the per-frame draw.

## Since

0.5.0

## Example

**A minimal tint shader**

```ts
class Tint extends Shader {
  readonly type = "tint";
  render(ctx: RenderContext, region: ShaderRegion): void {
    ctx.fillRect(region.x, region.y, region.width, region.height, "#ff000022");
  }
}
```

## See

 - [ShaderStack](ShaderStack.md)
 - [ShaderSystem](ShaderSystem.md)

## Extended by

- [`GlowShader`](GlowShader.md)
- [`ParticleShader`](ParticleShader.md)
- [`VignetteShader`](VignetteShader.md)

## Constructors

### Constructor

```ts
new Shader(config?: ShaderConfig): Shader;
```

Defined in: [core/shaders/shader.ts:48](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L48)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`ShaderConfig`](../interfaces/ShaderConfig.md) | Base options (currently just `enabled`). Subclasses extend [ShaderConfig](../interfaces/ShaderConfig.md) with their own tunables. |

#### Returns

`Shader`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | When `false`, the stack skips this shader's update and render. | [core/shaders/shader.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L42) |
| <a id="type"></a> `type` | `abstract` | `string` | Unique key used by [ShaderStack.get](ShaderStack.md#get) / [ShaderStack.detach](ShaderStack.md#detach). | [core/shaders/shader.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L37) |

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

***

### render()

```ts
abstract render(ctx: RenderContext, region: ShaderRegion): void;
```

Defined in: [core/shaders/shader.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L70)

Draws the effect for `region`.

Canvas-backed effects should obtain the raw context via
[Shader.raw](#raw) and return early when it is `null`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | [`RenderContext`](../interfaces/RenderContext.md) | The active render context. |
| `region` | [`ShaderRegion`](../interfaces/ShaderRegion.md) | The area to affect (object box or full screen). |

#### Returns

`void`

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
