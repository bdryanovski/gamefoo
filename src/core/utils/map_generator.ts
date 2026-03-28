/**
 * Procedural map generator powered by Perlin noise.
 *
 * `MapGenerator` uses the existing {@link PerlinNoise} utility to
 * produce tile data and walkability maps from configurable biome
 * rules. Feed the output into a {@link Grid} and {@link TileLayer}
 * to create a complete playable level.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example Generate and apply a terrain map
 * ```ts
 * import { MapGenerator, Grid, TileLayer, TileSet } from "gamefoo";
 *
 * const generator = new MapGenerator({
 *   cols: 32,
 *   rows: 32,
 *   seed: 42,
 *   biomes: [
 *     { name: "water",    tileId: 0, minNoise: -1.0, maxNoise: -0.2, walkable: false },
 *     { name: "sand",     tileId: 1, minNoise: -0.2, maxNoise:  0.0, walkable: true },
 *     { name: "grass",    tileId: 2, minNoise:  0.0, maxNoise:  0.5, walkable: true },
 *     { name: "forest",   tileId: 3, minNoise:  0.5, maxNoise:  0.8, walkable: true },
 *     { name: "mountain", tileId: 4, minNoise:  0.8, maxNoise:  1.01, walkable: false },
 *   ],
 * });
 *
 * const { grid, layer } = generator.buildLayer(tileSet, "ground");
 * ```
 *
 * @example Access raw noise map
 * ```ts
 * const noiseMap = generator.generateNoiseMap();
 * // noiseMap[row][col] is in [-1, 1]
 * ```
 *
 * @see {@link PerlinNoise} — the noise engine
 * @see {@link Grid}        — receives walkability data
 * @see {@link TileLayer}   — receives tile ID data
 */

import { Grid } from '../grid/grid';
import { TileLayer } from '../tilemap/tile_layer';
import type { TileSet } from '../tilemap/tileset';
import type {
  BiomeRule,
  GeneratedMapData,
  MapGeneratorConfig,
} from './map_generator_types';
import { PerlinNoise } from './perlin_noise';

export class MapGenerator {
  private noise: PerlinNoise;
  private config: MapGeneratorConfig;

  /**
   * Creates a new map generator.
   *
   * @param config - Map dimensions, noise parameters, and biome rules.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const gen = new MapGenerator({
   *   cols: 64, rows: 64,
   *   seed: 42,
   *   scale: 0.08,
   *   octaves: 4,
   *   biomes: myBiomeRules,
   * });
   * ```
   */
  constructor(config: MapGeneratorConfig) {
    this.config = config;
    this.noise = new PerlinNoise(config.seed ?? 0);
  }

  /**
   * Generates a raw 2D noise map.
   *
   * Values are in `[-1, 1]`, produced by fBm with the configured
   * octaves, lacunarity, and persistence.
   *
   * @returns Flat `Float64Array` indexed `[row * cols + col]`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const noise = generator.generateNoiseMap();
   * const elevation = noise[10 * cols + 5];
   * console.log("Elevation at (5,10):", elevation);
   * ```
   */
  generateNoiseMap(): Float64Array {
    const { cols, rows } = this.config;
    const scale = this.config.scale ?? 0.05;
    const octaves = this.config.octaves ?? 4;
    const lacunarity = this.config.lacunarity ?? 2;
    const persistence = this.config.persistence ?? 0.5;

    const map = new Float64Array(cols * rows);
    for (let row = 0; row < rows; row++) {
      const offset = row * cols;
      for (let col = 0; col < cols; col++) {
        map[offset + col] = this.noise.fbm(
          col * scale,
          row * scale,
          octaves,
          lacunarity,
          persistence,
        );
      }
    }
    return map;
  }

  /**
   * Generates tile IDs and walkability data by applying biome rules
   * to the noise map.
   *
   * For each cell, the noise value is compared against each
   * {@link BiomeRule} in order. The first matching rule determines
   * the tile ID and walkability.
   *
   * @returns An object with flat `data` array (row-major tile IDs) and
   *   2D `walkableMap`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const { data, walkableMap } = generator.generateTileData();
   *
   * // data is a flat array of length cols*rows
   * // walkableMap[row][col] is a boolean
   * ```
   */
  generateTileData(): GeneratedMapData {
    const noiseMap = this.generateNoiseMap();
    const { cols, rows, biomes } = this.config;
    const totalCells = cols * rows;

    const data: number[] = new Array(totalCells);
    const walkableMap: boolean[][] = [];

    for (let row = 0; row < rows; row++) {
      walkableMap[row] = [];
      const offset = row * cols;
      for (let col = 0; col < cols; col++) {
        const n = noiseMap[offset + col]!;
        const biome = this.findBiome(n, biomes);

        data[offset + col] = biome.tileId;
        walkableMap[row]![col] = biome.walkable;
      }
    }

    return { data, walkableMap };
  }

  /**
   * Convenience method that generates a complete {@link Grid} and
   * {@link TileLayer} from the configured parameters.
   *
   * The grid is populated with tile values and walkability data. The
   * layer is ready to be added to a {@link TileMap}.
   *
   * @param tileSet   - Tileset for the layer.
   * @param layerName - Name for the generated layer.
   * @param cellWidth - Grid cell width in pixels.
   * @param cellHeight - Grid cell height in pixels.
   * @returns An object with the populated `grid` and `layer`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const { grid, layer } = generator.buildLayer(tileSet, "ground", 64, 32);
   *
   * const tilemap = new TileMap({
   *   grid,
   *   layers: [layer],
   *   projection: isoProjection,
   * });
   * ```
   */
  buildLayer(
    tileSet: TileSet,
    layerName: string,
    cellWidth = 64,
    cellHeight = 32,
  ): { grid: Grid; layer: TileLayer } {
    const { cols, rows } = this.config;
    const { data, walkableMap } = this.generateTileData();

    const grid = new Grid<number>({ cols, rows, cellWidth, cellHeight }, 0);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid.setCell(col, row, data[row * cols + col]!);
        grid.setWalkable(col, row, walkableMap[row]![col]!);
      }
    }

    const layer = new TileLayer({
      name: layerName,
      cols,
      rows,
      tileSet,
      data,
    });

    return { grid, layer };
  }

  /**
   * Finds the biome rule matching a noise value.
   *
   * Falls back to the last rule if no match is found (safeguard
   * against gaps in biome coverage).
   *
   * @param noiseValue - Noise value in `[-1, 1]`.
   * @param biomes     - Ordered biome rules.
   * @returns The matching biome rule.
   *
   * @internal
   */
  private findBiome(noiseValue: number, biomes: BiomeRule[]): BiomeRule {
    for (const biome of biomes) {
      if (noiseValue >= biome.minNoise && noiseValue < biome.maxNoise) {
        return biome;
      }
    }
    return biomes[biomes.length - 1]!;
  }
}
