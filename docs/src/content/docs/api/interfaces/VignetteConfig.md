---
title: 'Interface: VignetteConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / VignetteConfig

# Interface: VignetteConfig

Defined in: [core/shaders/vignette\_shader.ts:8](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L8)

Options for [VignetteShader](../classes/VignetteShader.md).

## Extends

- [`ShaderConfig`](ShaderConfig.md)

## Properties

| Property | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="color"></a> `color?` | `string` | `"#000000"` | Edge colour (any CSS colour). | - | [core/shaders/vignette\_shader.ts:12](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L12) |
| <a id="enabled"></a> `enabled?` | `boolean` | `true` | Whether the shader starts enabled. Disabled shaders are skipped by both update and render passes. | [`ShaderConfig`](ShaderConfig.md).[`enabled`](ShaderConfig.md#enabled) | [core/shaders/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L37) |
| <a id="inner"></a> `inner?` | `number` | `0.55` | Radius (as a fraction of the half-diagonal, `0`–`1`) at which the darkening begins; the centre stays clear. | - | [core/shaders/vignette\_shader.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L21) |
| <a id="intensity"></a> `intensity?` | `number` | `0.5` | Edge opacity, `0`–`1`. | - | [core/shaders/vignette\_shader.ts:16](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/vignette_shader.ts#L16) |
