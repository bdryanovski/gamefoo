---
title: 'Class: ParticleShader'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ParticleShader

# Class: ParticleShader

Defined in: [core/shaders/particle\_shader.ts:76](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L76)

A lightweight additive particle emitter — embers rising from a fire,
sparks, dust, bubbles. Particles spawn across the region's width near its
vertical middle, drift under `gravity`, and fade out over their lifetime.

The simulation advances in [ParticleShader.update](#update); the emit region
is captured from the most recent [ParticleShader.render](#render).

## Since

0.5.0

## Example

**Embers rising from a campfire**

```ts
campfire.attachShader(
  new ParticleShader({ color: "#ffcc55", rate: 24, speed: 22, gravity: 8 }),
);
```

## Extends

- [`Shader`](Shader.md)

## Constructors

### Constructor

```ts
new ParticleShader(config?: ParticleConfig): ParticleShader;
```

Defined in: [core/shaders/particle\_shader.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L93)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ParticleConfig`](../interfaces/ParticleConfig.md) |

#### Returns

`ParticleShader`

#### Overrides

[`Shader`](Shader.md).[`constructor`](Shader.md#constructor)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled` | `public` | `boolean` | `undefined` | When `false`, the stack skips this shader's update and render. | - | [`Shader`](Shader.md).[`enabled`](Shader.md#enabled) | [core/shaders/shader.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/shader.ts#L42) |
| <a id="type"></a> `type` | `readonly` | `"particles"` | `'particles'` | Unique key used by [ShaderStack.get](ShaderStack.md#get) / [ShaderStack.detach](ShaderStack.md#detach). | [`Shader`](Shader.md).[`type`](Shader.md#type) | - | [core/shaders/particle\_shader.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L77) |
| <a id="alpha"></a> `alpha` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L86) |
| <a id="color"></a> `color` | `private` | `string` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:79](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L79) |
| <a id="emit"></a> `emit` | `private` | [`ShaderRegion`](../interfaces/ShaderRegion.md) | `EMPTY` | - | - | - | [core/shaders/particle\_shader.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L91) |
| <a id="gravity"></a> `gravity` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L84) |
| <a id="lifetime"></a> `lifetime` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:81](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L81) |
| <a id="max"></a> `max` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:87](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L87) |
| <a id="particles"></a> `particles` | `private` | `Particle`[] | `[]` | - | - | - | [core/shaders/particle\_shader.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L89) |
| <a id="pending"></a> `pending` | `private` | `number` | `0` | - | - | - | [core/shaders/particle\_shader.ts:90](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L90) |
| <a id="rate"></a> `rate` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:80](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L80) |
| <a id="size"></a> `size` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:85](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L85) |
| <a id="speed"></a> `speed` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:82](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L82) |
| <a id="spread"></a> `spread` | `private` | `number` | `undefined` | - | - | - | [core/shaders/particle\_shader.ts:83](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L83) |

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

Defined in: [core/shaders/particle\_shader.ts:142](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L142)

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

Defined in: [core/shaders/particle\_shader.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L119)

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

### spawn()

```ts
private spawn(): void;
```

Defined in: [core/shaders/particle\_shader.ts:106](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L106)

#### Returns

`void`
