---
title: 'Interface: GlowConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / GlowConfig

# Interface: GlowConfig

Defined in: [core/shaders/glow\_shader.ts:10](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L10)

Options for [GlowShader](../classes/GlowShader.md).

## Extends

- [`ShaderConfig`](ShaderConfig.md)

## Properties

| Property | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="color"></a> `color?` | `string` | `"#ff7a1a"` | Glow colour (any CSS colour). | - | [core/shaders/glow\_shader.ts:14](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L14) |
| <a id="enabled"></a> `enabled?` | `boolean` | `true` | Whether the shader starts enabled. Disabled shaders are skipped by both update and render passes. | [`ShaderConfig`](ShaderConfig.md).[`enabled`](ShaderConfig.md#enabled) | [core/shaders/types.ts:37](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L37) |
| <a id="intensity"></a> `intensity?` | `number` | `0.6` | Peak opacity, `0`–`1`. | - | [core/shaders/glow\_shader.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L22) |
| <a id="pulseamount"></a> `pulseAmount?` | `number` | `0` | Fraction of `intensity` that the pulse swings, `0`–`1`. | - | [core/shaders/glow\_shader.ts:30](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L30) |
| <a id="pulsespeed"></a> `pulseSpeed?` | `number` | `0` | Pulse frequency in Hz; `0` disables pulsing. | - | [core/shaders/glow\_shader.ts:26](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L26) |
| <a id="radius"></a> `radius?` | `number` | `24` | Glow radius in logical pixels from the region centre. | - | [core/shaders/glow\_shader.ts:18](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/glow_shader.ts#L18) |
