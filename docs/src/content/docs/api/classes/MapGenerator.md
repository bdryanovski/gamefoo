---
title: 'Class: MapGenerator'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / MapGenerator

# Class: MapGenerator

Defined in: [core/utils/map\_generator.ts:49](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L49)

## Constructors

### Constructor

```ts
new MapGenerator(config: MapGeneratorConfig): MapGenerator;
```

Defined in: [core/utils/map\_generator.ts:71](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L71)

Creates a new map generator.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`MapGeneratorConfig`](../interfaces/MapGeneratorConfig.md) | Map dimensions, noise parameters, and biome rules. |

#### Returns

`MapGenerator`

#### Since

0.4.0

#### Example

```ts
const gen = new MapGenerator({
  cols: 64, rows: 64,
  seed: 42,
  scale: 0.08,
  octaves: 4,
  biomes: myBiomeRules,
});
```

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="config"></a> `config` | `private` | [`MapGeneratorConfig`](../interfaces/MapGeneratorConfig.md) | [core/utils/map\_generator.ts:51](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L51) |
| <a id="noise"></a> `noise` | `private` | [`PerlinNoise`](PerlinNoise.md) | [core/utils/map\_generator.ts:50](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L50) |

## Methods

### buildLayer()

```ts
buildLayer(
   tileSet: TileSet, 
   layerName: string, 
   cellWidth?: number, 
   cellHeight?: number
): {
  grid: Grid;
  layer: TileLayer;
};
```

Defined in: [core/utils/map\_generator.ts:186](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L186)

Convenience method that generates a complete [Grid](Grid.md) and
[TileLayer](TileLayer.md) from the configured parameters.

The grid is populated with tile values and walkability data. The
layer is ready to be added to a [TileMap](TileMap.md).

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `tileSet` | [`TileSet`](TileSet.md) | `undefined` | Tileset for the layer. |
| `layerName` | `string` | `undefined` | Name for the generated layer. |
| `cellWidth` | `number` | `64` | Grid cell width in pixels. |
| `cellHeight` | `number` | `32` | Grid cell height in pixels. |

#### Returns

```ts
{
  grid: Grid;
  layer: TileLayer;
}
```

An object with the populated `grid` and `layer`.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `grid` | [`Grid`](Grid.md) | [core/utils/map\_generator.ts:191](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L191) |
| `layer` | [`TileLayer`](TileLayer.md) | [core/utils/map\_generator.ts:191](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L191) |

#### Since

0.4.0

#### Example

```ts
const { grid, layer } = generator.buildLayer(tileSet, "ground", 64, 32);

const tilemap = new TileMap({
  grid,
  layers: [layer],
  projection: isoProjection,
});
```

***

### generateNoiseMap()

```ts
generateNoiseMap(): Float64Array;
```

Defined in: [core/utils/map\_generator.ts:93](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L93)

Generates a raw 2D noise map.

Values are in `[-1, 1]`, produced by fBm with the configured
octaves, lacunarity, and persistence.

#### Returns

`Float64Array`

Flat `Float64Array` indexed `[row * cols + col]`.

#### Since

0.4.0

#### Example

```ts
const noise = generator.generateNoiseMap();
const elevation = noise[10 * cols + 5];
console.log("Elevation at (5,10):", elevation);
```

***

### generateTileData()

```ts
generateTileData(): GeneratedMapData;
```

Defined in: [core/utils/map\_generator.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L137)

Generates tile IDs and walkability data by applying biome rules
to the noise map.

For each cell, the noise value is compared against each
[BiomeRule](../interfaces/BiomeRule.md) in order. The first matching rule determines
the tile ID and walkability.

#### Returns

[`GeneratedMapData`](../interfaces/GeneratedMapData.md)

An object with flat `data` array (row-major tile IDs) and
  2D `walkableMap`.

#### Since

0.4.0

#### Example

```ts
const { data, walkableMap } = generator.generateTileData();

// data is a flat array of length cols*rows
// walkableMap[row][col] is a boolean
```

***

### findBiome()

```ts
private findBiome(noiseValue: number, biomes: BiomeRule[]): BiomeRule;
```

Defined in: [core/utils/map\_generator.ts:227](https://github.com/bdryanovski/gamefoo/blob/main/src/core/utils/map_generator.ts#L227)

**`Internal`**

Finds the biome rule matching a noise value.

Falls back to the last rule if no match is found (safeguard
against gaps in biome coverage).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `noiseValue` | `number` | Noise value in `[-1, 1]`. |
| `biomes` | [`BiomeRule`](../interfaces/BiomeRule.md)[] | Ordered biome rules. |

#### Returns

[`BiomeRule`](../interfaces/BiomeRule.md)

The matching biome rule.
