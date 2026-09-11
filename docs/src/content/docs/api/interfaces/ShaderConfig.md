---
title: 'Interface: ShaderConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ShaderConfig

# Interface: ShaderConfig

Defined in: [core/shaders/types.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L30)

Base options shared by every [Shader](../classes/Shader.md).

## Extended by

- [`GlowConfig`](GlowConfig.md)
- [`ParticleConfig`](ParticleConfig.md)
- [`VignetteConfig`](VignetteConfig.md)

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled?` | `boolean` | `true` | Whether the shader starts enabled. Disabled shaders are skipped by both update and render passes. | [core/shaders/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L37) |
