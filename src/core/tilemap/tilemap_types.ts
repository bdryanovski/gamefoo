/**
 * Type definitions for the tilemap system.
 *
 * These types define configurations for {@link TileSet}, {@link TileLayer},
 * and {@link TileMap}. They are kept separate so consumer code can import
 * only the type interfaces without pulling in implementation.
 *
 * @category Tilemap
 * @module tilemap_types
 * @since 0.4.0
 */

import type { Grid } from '../grid/grid';
import type { IsometricProjection } from '../grid/isometric';
import type Sprite from '../sprite';
import type { TileLayer } from './tile_layer';
import type { TileSet } from './tileset';

/**
 * Configuration for constructing a {@link TileSet}.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const config: TileSetConfig = {
 *   sprite: mySprite,
 *   firstGid: 1,
 *   tileProperties: new Map([
 *     [0, { walkable: false }],       // water
 *     [1, { walkable: true }],        // grass
 *   ]),
 * };
 * ```
 */
export interface TileSetConfig {
  /**
   * The sprite sheet containing all tile frames.
   */
  sprite: Sprite;
  /**
   * First global tile ID for this tileset. When combining multiple
   * tilesets in a single map, each set has a unique starting ID.
   *
   * @defaultValue `0`
   */
  firstGid?: number;
  /**
   * Per-tile custom properties. Keys are **local** tile indices
   * (relative to the sprite sheet, starting at 0).
   */
  tileProperties?: Map<number, Record<string, unknown>>;
}

/**
 * Configuration for constructing a {@link TileLayer}.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const config: TileLayerConfig = {
 *   name: "ground",
 *   cols: 32,
 *   rows: 32,
 *   tileSet: myTileSet,
 *   data: new Array(32 * 32).fill(0),
 * };
 * ```
 *
 * @example Semi-transparent overlay layer
 * ```ts
 * const config: TileLayerConfig = {
 *   name: "decorations",
 *   cols: 32,
 *   rows: 32,
 *   tileSet: decoTileSet,
 *   data: decoData,
 *   opacity: 0.8,
 * };
 * ```
 */
export interface TileLayerConfig {
  /**
   * Human-readable layer name (e.g. `"ground"`, `"collision"`).
   */
  name: string;
  /**
   * Number of tile columns in this layer.
   */
  cols: number;
  /**
   * Number of tile rows in this layer.
   */
  rows: number;
  /**
   * The tileset that maps tile IDs to sprite frames.
   */
  tileSet: TileSet;
  /**
   * Flat row-major tile data. Length must equal `cols × rows`.
   * A value of `-1` means "empty / no tile".
   */
  data: number[];
  /**
   * Whether this layer is drawn during rendering.
   *
   * @defaultValue `true`
   */
  visible?: boolean;
  /**
   * Layer opacity from `0` (fully transparent) to `1` (fully opaque).
   *
   * @defaultValue `1`
   */
  opacity?: number;
  /**
   * Horizontal pixel offset applied before rendering. Useful for
   * parallax effects.
   *
   * @defaultValue `0`
   */
  offsetX?: number;
  /**
   * Vertical pixel offset applied before rendering.
   *
   * @defaultValue `0`
   */
  offsetY?: number;
}

/**
 * Configuration for constructing a {@link TileMap}.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example Orthogonal tilemap
 * ```ts
 * const config: TileMapConfig = {
 *   grid: myGrid,
 *   layers: [groundLayer, decorLayer],
 * };
 * ```
 *
 * @example Isometric tilemap with collision
 * ```ts
 * const config: TileMapConfig = {
 *   grid: myGrid,
 *   layers: [groundLayer],
 *   projection: myIsoProjection,
 *   collisionLayerName: "ground",
 * };
 * ```
 */
export interface TileMapConfig {
  /**
   * The grid that defines map dimensions and cell walkability.
   */
  grid: Grid;
  /**
   * Ordered list of tile layers (rendered back-to-front).
   */
  layers: TileLayer[];
  /**
   * Isometric projection. When omitted the map renders in
   * orthogonal (top-down) mode.
   */
  projection?: IsometricProjection;
  /**
   * Name of the layer whose non-empty, non-walkable tiles should
   * generate collision entities via {@link TileMap.buildColliders}.
   */
  collisionLayerName?: string;
}
