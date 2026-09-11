---
title: 'Interface: MapGeneratorConfig'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapGeneratorConfig

# Interface: MapGeneratorConfig

Defined in: [core/utils/map\_generator\_types.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L89)

Configuration for constructing a [MapGenerator](../classes/MapGenerator.md).

## Since

0.4.0

## Examples

**Simple terrain**

```ts
const config: MapGeneratorConfig = {
  cols: 32,
  rows: 32,
  seed: 42,
  biomes: [
    { name: "water", tileId: 0, minNoise: -1.0, maxNoise: -0.1, walkable: false },
    { name: "grass", tileId: 1, minNoise: -0.1, maxNoise: 0.6, walkable: true },
    { name: "mountain", tileId: 2, minNoise: 0.6, maxNoise: 1.01, walkable: false },
  ],
};
```

**High-detail terrain**

```ts
const config: MapGeneratorConfig = {
  cols: 64,
  rows: 64,
  seed: 12345,
  scale: 0.04,
  octaves: 6,
  lacunarity: 2.0,
  persistence: 0.5,
  biomes: myBiomes,
};
```

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="biomes"></a> `biomes` | [`BiomeRule`](BiomeRule.md)[] | `undefined` | Ordered biome rules. Must collectively cover the full `[-1, 1]` noise range to avoid unmapped cells. | [core/utils/map\_generator\_types.ts:134](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L134) |
| <a id="cols"></a> `cols` | `number` | `undefined` | Number of tile columns to generate. | [core/utils/map\_generator\_types.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L93) |
| <a id="lacunarity"></a> `lacunarity?` | `number` | `2` | Frequency multiplier per octave. | [core/utils/map\_generator\_types.ts:123](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L123) |
| <a id="octaves"></a> `octaves?` | `number` | `4` | Number of fBm octaves. More octaves add finer detail. | [core/utils/map\_generator\_types.ts:117](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L117) |
| <a id="persistence"></a> `persistence?` | `number` | `0.5` | Amplitude multiplier per octave. Controls roughness. | [core/utils/map\_generator\_types.ts:129](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L129) |
| <a id="rows"></a> `rows` | `number` | `undefined` | Number of tile rows to generate. | [core/utils/map\_generator\_types.ts:97](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L97) |
| <a id="scale"></a> `scale?` | `number` | `0.05` | Noise coordinate scale. Smaller values produce smoother, larger-feature terrain; larger values produce noisier terrain. | [core/utils/map\_generator\_types.ts:111](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L111) |
| <a id="seed"></a> `seed?` | `number` | `0` | Seed for the Perlin noise generator. Identical seeds produce identical maps. | [core/utils/map\_generator\_types.ts:104](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator_types.ts#L104) |
