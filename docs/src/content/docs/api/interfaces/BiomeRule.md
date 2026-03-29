---
title: 'Interface: BiomeRule'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / BiomeRule

# Interface: BiomeRule

Defined in: [core/utils/map\_generator\_types.ts:31](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L31)

A biome rule that maps a noise-value range to a tile ID and
walkability status.

Rules are evaluated in order. The first rule whose range contains
the noise value at a cell determines that cell's tile and
walkability.

## Since

0.4.0

## Example

```ts
const water: BiomeRule = {
  name: "water",
  tileId: 0,
  minNoise: -1.0,
  maxNoise: -0.2,
  walkable: false,
};
```

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="maxnoise"></a> `maxNoise` | `number` | Upper noise threshold (exclusive). Use a value slightly above `1.0` (e.g. `1.01`) for the highest biome to ensure coverage. | [core/utils/map\_generator\_types.ts:44](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L44) |
| <a id="minnoise"></a> `minNoise` | `number` | Lower noise threshold (inclusive). Noise values in `[-1, 1]`. | [core/utils/map\_generator\_types.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L39) |
| <a id="name"></a> `name` | `string` | Human-readable biome name for debugging. | [core/utils/map\_generator\_types.ts:33](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L33) |
| <a id="tileid"></a> `tileId` | `number` | Tile ID to assign when this rule matches. | [core/utils/map\_generator\_types.ts:35](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L35) |
| <a id="walkable"></a> `walkable` | `boolean` | Whether entities can traverse tiles in this biome. | [core/utils/map\_generator\_types.ts:46](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L46) |
