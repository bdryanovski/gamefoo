---
title: 'Class: GlowShader'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GlowShader

# Class: GlowShader

Defined in: [core/shaders/glow\_shader.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L51)

An additive radial glow centred on the region — a cheap bloom for fire,
lamps, portals, pickups. Uses the `lighter` composite so it brightens
whatever is underneath rather than painting over it.

## Since

0.5.0

## Example

**Pulsing fire glow attached to an object**

```ts
campfire.attachShader(
  new GlowShader({ color: "#ff7a1a", radius: 28, intensity: 0.7,
                   pulseSpeed: 2, pulseAmount: 0.3 }),
);
```

## Extends

- [`Shader`](Shader.md)

## Constructors

### Constructor

```ts
new GlowShader(config?: GlowConfig): GlowShader;
```

Defined in: [core/shaders/glow\_shader.ts:61](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`GlowConfig`](../interfaces/GlowConfig.md) |

#### Returns

`GlowShader`

#### Overrides

[`Shader`](Shader.md).[`constructor`](Shader.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `undefined` | When `false`, the stack skips this shader's update and render. | - | [`Shader`](Shader.md).[`enabled`](Shader.md#enabled) | [core/shaders/shader.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L42) |
| <a id="type"></a> `type` | `readonly` | `"glow"` | `'glow'` | Unique key used by [ShaderStack.get](ShaderStack.md#get) / [ShaderStack.detach](ShaderStack.md#detach). | [`Shader`](Shader.md).[`type`](Shader.md#type) | - | [core/shaders/glow\_shader.ts:52](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L52) |
| <a id="color"></a> `color` | `private` | `string` | `undefined` | - | - | - | [core/shaders/glow\_shader.ts:54](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L54) |
| <a id="intensity"></a> `intensity` | `private` | `number` | `undefined` | - | - | - | [core/shaders/glow\_shader.ts:56](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L56) |
| <a id="pulseamount"></a> `pulseAmount` | `private` | `number` | `undefined` | - | - | - | [core/shaders/glow\_shader.ts:58](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L58) |
| <a id="pulsespeed"></a> `pulseSpeed` | `private` | `number` | `undefined` | - | - | - | [core/shaders/glow\_shader.ts:57](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L57) |
| <a id="radius"></a> `radius` | `private` | `number` | `undefined` | - | - | - | [core/shaders/glow\_shader.ts:55](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L55) |
| <a id="time"></a> `time` | `private` | `number` | `0` | - | - | - | [core/shaders/glow\_shader.ts:59](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L59) |

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

Defined in: [core/shaders/glow\_shader.ts:85](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L85)

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
update(deltaTime: number): void;
```

Defined in: [core/shaders/glow\_shader.ts:70](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L70)

Advances any time-based state (pulses, particle simulation).

The default is a no-op; override for animated effects.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `deltaTime` | `number` |

#### Returns

`void`

#### Overrides

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

***

### alpha()

```ts
private alpha(): number;
```

Defined in: [core/shaders/glow\_shader.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L77)

Current opacity, folding in the optional sine pulse.

#### Returns

`number`
