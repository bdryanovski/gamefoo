---
title: 'Interface: EnhancedCameraConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / EnhancedCameraConfig

# Interface: EnhancedCameraConfig

Defined in: [core/enhanced\_camera.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L71)

Configuration options for [EnhancedCamera](../classes/EnhancedCamera.md).

## Since

0.4.0

## Example

```ts
const opts: EnhancedCameraConfig = {
  zoom: 2,
  lerpSpeed: 0.1,
  pixelPerfect: true,
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="lerpspeed"></a> `lerpSpeed?` | `number` | `0.1` | Interpolation speed for [EnhancedCamera.smoothFollow](../classes/EnhancedCamera.md#smoothfollow). `0` = instant snap, closer to `1` = very slow approach. | [core/enhanced\_camera.ts:99](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L99) |
| <a id="maxzoom"></a> `maxZoom?` | `number` | `4` | Maximum allowed zoom level. | [core/enhanced\_camera.ts:91](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L91) |
| <a id="minzoom"></a> `minZoom?` | `number` | `0.25` | Minimum allowed zoom level. | [core/enhanced\_camera.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L84) |
| <a id="pixelperfect"></a> `pixelPerfect?` | `boolean` | `false` | When `true`, zoom values are rounded to the nearest integer for crisp pixel-art rendering (1×, 2×, 3×, 4×). | [core/enhanced\_camera.ts:107](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L107) |
| <a id="zoom"></a> `zoom?` | `number` | `1` | Initial zoom level. | [core/enhanced\_camera.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/enhanced_camera.ts#L77) |
