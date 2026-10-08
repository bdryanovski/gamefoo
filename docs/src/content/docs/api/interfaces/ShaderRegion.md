---
title: 'Interface: ShaderRegion'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / ShaderRegion

# Interface: ShaderRegion

Defined in: [core/shaders/types.ts:20](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L20)

The rectangular area a [Shader](../classes/Shader.md) affects, expressed in the same
coordinate space as the surrounding draw calls (logical game pixels).

- Object shaders receive the host object's bounding box.
- Engine shaders receive the whole screen.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="height"></a> `height` | `number` | [core/shaders/types.ts:24](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L24) |
| <a id="width"></a> `width` | `number` | [core/shaders/types.ts:23](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L23) |
| <a id="x"></a> `x` | `number` | [core/shaders/types.ts:21](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L21) |
| <a id="y"></a> `y` | `number` | [core/shaders/types.ts:22](https://github.com/bdryanovski/gamefoo/blob/main/src/core/shaders/types.ts#L22) |
