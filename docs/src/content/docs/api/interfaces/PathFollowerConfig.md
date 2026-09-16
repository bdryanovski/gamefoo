---
title: 'Interface: PathFollowerConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / PathFollowerConfig

# Interface: PathFollowerConfig

Defined in: [core/behaviours/path\_follower.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L72)

Configuration options for [PathFollower](../classes/PathFollower.md).

## Since

0.4.0

## Example

```ts
const opts: PathFollowerConfig = {
  projection: isoProjection,
  speed: 60,
  arrivalThreshold: 3,
  onPathComplete: () => console.log("Arrived!"),
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="arrivalthreshold"></a> `arrivalThreshold?` | `number` | `2` | Distance (in pixels) at which the entity is considered to have reached a waypoint. | [core/behaviours/path\_follower.ts:92](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L92) |
| <a id="onpathblocked"></a> `onPathBlocked?` | () => `void` | `undefined` | Called when `moveTo` fails to find a path. | [core/behaviours/path\_follower.ts:102](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L102) |
| <a id="onpathcomplete"></a> `onPathComplete?` | () => `void` | `undefined` | Called when the entity reaches the final waypoint. | [core/behaviours/path\_follower.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L97) |
| <a id="projection"></a> `projection?` | [`IsometricProjection`](../classes/IsometricProjection.md) | `undefined` | Isometric projection for grid → screen conversion. Omit for orthogonal grids. | [core/behaviours/path\_follower.ts:77](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L77) |
| <a id="speed"></a> `speed?` | `number` | `60` | Movement speed in pixels per second. | [core/behaviours/path\_follower.ts:84](https://github.com/bdryanovski/gamefoo/blob/main/src/core/behaviours/path_follower.ts#L84) |
