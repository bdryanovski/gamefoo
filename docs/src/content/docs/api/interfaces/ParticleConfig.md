---
title: 'Interface: ParticleConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ParticleConfig

# Interface: ParticleConfig

Defined in: [core/shaders/particle\_shader.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L8)

Options for [ParticleShader](../classes/ParticleShader.md).

## Extends

- [`ShaderConfig`](ShaderConfig.md)

## Properties

| Property | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="alpha"></a> `alpha?` | `number` | `0.9` | Peak opacity, `0`–`1`, fading to `0` over life. | - | [core/shaders/particle\_shader.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L40) |
| <a id="color"></a> `color?` | `string` | `"#ffb347"` | Particle colour (any CSS colour). | - | [core/shaders/particle\_shader.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L12) |
| <a id="enabled"></a> `enabled?` | `boolean` | `true` | Whether the shader starts enabled. Disabled shaders are skipped by both update and render passes. | [`ShaderConfig`](ShaderConfig.md).[`enabled`](ShaderConfig.md#enabled) | [core/shaders/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L37) |
| <a id="gravity"></a> `gravity?` | `number` | `10` | Vertical acceleration in px/s² (positive = downward). | - | [core/shaders/particle\_shader.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L32) |
| <a id="lifetime"></a> `lifetime?` | `number` | `0.8` | Particle lifetime in seconds (± 40% jitter). | - | [core/shaders/particle\_shader.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L20) |
| <a id="max"></a> `max?` | `number` | `120` | Hard cap on live particles. | - | [core/shaders/particle\_shader.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L44) |
| <a id="rate"></a> `rate?` | `number` | `18` | Particles spawned per second. | - | [core/shaders/particle\_shader.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L16) |
| <a id="size"></a> `size?` | `number` | `1` | Particle square size in logical px. | - | [core/shaders/particle\_shader.ts:36](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L36) |
| <a id="speed"></a> `speed?` | `number` | `20` | Initial upward speed in px/s (± 40% jitter). | - | [core/shaders/particle\_shader.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L24) |
| <a id="spread"></a> `spread?` | `number` | `6` | Horizontal velocity spread in px/s. | - | [core/shaders/particle\_shader.ts:28](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/particle_shader.ts#L28) |
