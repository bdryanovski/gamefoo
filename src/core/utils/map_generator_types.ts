/**
 * Type definitions for the procedural {@link MapGenerator}.
 *
 * @category Utilities
 * @module map_generator_types
 * @since 0.4.0
 */

/**
 * A biome rule that maps a noise-value range to a tile ID and
 * walkability status.
 *
 * Rules are evaluated in order. The first rule whose range contains
 * the noise value at a cell determines that cell's tile and
 * walkability.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const water: BiomeRule = {
 *   name: "water",
 *   tileId: 0,
 *   minNoise: -1.0,
 *   maxNoise: -0.2,
 *   walkable: false,
 * };
 * ```
 */
export interface BiomeRule {
  /** Human-readable biome name for debugging. */
  name: string;
  /** Tile ID to assign when this rule matches. */
  tileId: number;
  /**
   * Lower noise threshold (inclusive). Noise values in `[-1, 1]`.
   */
  minNoise: number;
  /**
   * Upper noise threshold (exclusive). Use a value slightly above
   * `1.0` (e.g. `1.01`) for the highest biome to ensure coverage.
   */
  maxNoise: number;
  /** Whether entities can traverse tiles in this biome. */
  walkable: boolean;
}

/**
 * Configuration for constructing a {@link MapGenerator}.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example Simple terrain
 * ```ts
 * const config: MapGeneratorConfig = {
 *   cols: 32,
 *   rows: 32,
 *   seed: 42,
 *   biomes: [
 *     { name: "water", tileId: 0, minNoise: -1.0, maxNoise: -0.1, walkable: false },
 *     { name: "grass", tileId: 1, minNoise: -0.1, maxNoise: 0.6, walkable: true },
 *     { name: "mountain", tileId: 2, minNoise: 0.6, maxNoise: 1.01, walkable: false },
 *   ],
 * };
 * ```
 *
 * @example High-detail terrain
 * ```ts
 * const config: MapGeneratorConfig = {
 *   cols: 64,
 *   rows: 64,
 *   seed: 12345,
 *   scale: 0.04,
 *   octaves: 6,
 *   lacunarity: 2.0,
 *   persistence: 0.5,
 *   biomes: myBiomes,
 * };
 * ```
 */
export interface MapGeneratorConfig {
  /** Number of tile columns to generate. */
  cols: number;
  /** Number of tile rows to generate. */
  rows: number;
  /**
   * Seed for the Perlin noise generator. Identical seeds produce
   * identical maps.
   *
   * @defaultValue `0`
   */
  seed?: number;
  /**
   * Noise coordinate scale. Smaller values produce smoother,
   * larger-feature terrain; larger values produce noisier terrain.
   *
   * @defaultValue `0.05`
   */
  scale?: number;
  /**
   * Number of fBm octaves. More octaves add finer detail.
   *
   * @defaultValue `4`
   */
  octaves?: number;
  /**
   * Frequency multiplier per octave.
   *
   * @defaultValue `2`
   */
  lacunarity?: number;
  /**
   * Amplitude multiplier per octave. Controls roughness.
   *
   * @defaultValue `0.5`
   */
  persistence?: number;
  /**
   * Ordered biome rules. Must collectively cover the full `[-1, 1]`
   * noise range to avoid unmapped cells.
   */
  biomes: BiomeRule[];
}

/**
 * Output of {@link MapGenerator.generateTileData}.
 *
 * @category Utilities
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const result: GeneratedMapData = generator.generateTileData();
 * console.log(result.data.length);           // cols * rows
 * console.log(result.walkableMap[0]!.length); // cols
 * ```
 */
export interface GeneratedMapData {
  /** Flat row-major tile ID array (length = cols × rows). */
  data: number[];
  /** 2D walkability map indexed `[row][col]`. */
  walkableMap: boolean[][];
}
