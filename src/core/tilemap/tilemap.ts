/**
 * Multi-layer tilemap with orthogonal and isometric rendering support.
 *
 * `TileMap` combines a {@link Grid}, one or more {@link TileLayer}
 * instances, and an optional {@link IsometricProjection} into a
 * renderable map. It supports:
 *
 * - Back-to-front layer rendering with depth sorting for isometric.
 * - Screen-space tile picking (click/hover → tile ID).
 * - Collision entity generation from a designated layer.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example Orthogonal tilemap
 * ```ts
 * const tilemap = new TileMap({
 *   grid: myGrid,
 *   layers: [groundLayer, objectLayer],
 * });
 *
 * tilemap.render(ctx, camera.getViewRect());
 * ```
 *
 * @example Isometric tilemap with collision
 * ```ts
 * const tilemap = new TileMap({
 *   grid: myGrid,
 *   layers: [groundLayer],
 *   projection: isoProjection,
 *   collisionLayerName: "ground",
 * });
 *
 * const walls = tilemap.buildColliders(world);
 * ```
 *
 * @see {@link TileLayer}           — individual layer storage and rendering
 * @see {@link TileSet}             — tile ID → sprite frame mapping
 * @see {@link IsometricProjection} — coordinate conversion
 * @see {@link Grid}                — underlying grid data
 */
import Entity from '../../entities/entity';
import { Collidable } from '../behaviours/collidable';
import type { Grid } from '../grid/grid';
import type { IsometricProjection } from '../grid/isometric';
import type { RenderContext } from '../renderer/type';
import type World from '../world';
import type { TileLayer } from './tile_layer';
import type { TileMapConfig } from './tilemap_types';

/**
 * Grid position and pixel rect of a {@link WallEntity}.
 *
 * @internal
 */
interface WallEntityConfig {
  /**
   * Grid column of this wall.
   */
  col: number;
  /**
   * Grid row of this wall.
   */
  row: number;
  /**
   * World/screen X position.
   */
  x: number;
  /**
   * World/screen Y position.
   */
  y: number;
  /**
   * Width in pixels.
   */
  width: number;
  /**
   * Height in pixels.
   */
  height: number;
}

/**
 * Internal entity used by {@link TileMap.buildColliders} to represent
 * a static wall tile in the collision world.
 *
 * @internal
 */
class WallEntity extends Entity {
  /**
   * @param config - Grid position and pixel rect of the wall.
   */
  constructor(config: WallEntityConfig) {
    super(`wall_${config.col}_${config.row}`, config.x, config.y, config.width, config.height);
  }

  /**
   * Walls are static — no update logic.
   */
  update(_dt: number): void {}

  /**
   * Walls are invisible — collision only, tiles draw them.
   */
  render(_ctx: RenderContext): void {}
}

export class TileMap {
  /**
   * The underlying grid storing cell data and walkability.
   */
  readonly grid: Grid;

  /**
   * Ordered list of tile layers (rendered back-to-front).
   */
  readonly layers: TileLayer[];

  /**
   * Isometric projection. `null` means orthogonal (top-down) mode.
   *
   * Can be reassigned at runtime to change the isometric angle.
   */
  projection: IsometricProjection | null;

  /**
   * Name of the collision layer, if any.
   */
  private collisionLayerName: string | null;

  /**
   * Creates a new tilemap.
   *
   * @param config - Grid, layers, projection, and collision settings.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const tilemap = new TileMap({
   *   grid: myGrid,
   *   layers: [groundLayer],
   *   projection: isoProjection,
   *   collisionLayerName: "ground",
   * });
   * ```
   */
  constructor(config: TileMapConfig) {
    this.grid = config.grid;
    this.layers = config.layers;
    this.projection = config.projection ?? null;
    this.collisionLayerName = config.collisionLayerName ?? null;
  }

  /**
   * Renders all visible layers in order (back-to-front).
   *
   * Automatically selects orthogonal or isometric rendering based on
   * whether a projection is configured.
   *
   * @param ctx      - Canvas 2D rendering context.
   * @param viewport - Visible viewport rectangle (world-space for
   *   orthogonal, screen-space for isometric).
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // In a SubSystem.render():
   * tilemap.render(ctx, camera.getViewRect());
   * ```
   */
  render(
    ctx: RenderContext,
    viewport: { x: number; y: number; width: number; height: number },
  ): void {
    for (const layer of this.layers) {
      if (!layer.visible) {
        continue;
      }

      if (this.projection) {
        layer.renderIsometric(ctx, this.projection, viewport, this.grid.cols, this.grid.rows);
      } else {
        layer.renderOrthogonal(ctx, this.grid.cellWidth, this.grid.cellHeight, viewport);
      }
    }
  }

  /**
   * Returns the tile ID at a screen-space position within a named
   * layer.
   *
   * Handles both orthogonal and isometric coordinate conversion
   * automatically.
   *
   * @param screenX   - Screen X coordinate.
   * @param screenY   - Screen Y coordinate.
   * @param layerName - Name of the layer to query.
   * @returns Tile ID at the position, or `-1` if empty/out of bounds.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const tileId = tilemap.getTileAtScreen(mouseX, mouseY, "ground");
   * if (tileId >= 0) {
   *   console.log("Clicked tile:", tileId);
   * }
   * ```
   */
  getTileAtScreen(screenX: number, screenY: number, layerName: string): number {
    const layer = this.layers.find((l) => l.name === layerName);
    if (!layer) {
      return -1;
    }

    let col: number;
    let row: number;

    if (this.projection) {
      const cell = this.projection.screenToGrid(screenX, screenY);
      col = cell.col;
      row = cell.row;
    } else {
      const cell = this.grid.worldToCell(screenX, screenY);
      col = cell.col;
      row = cell.row;
    }

    if (!this.grid.isInBounds(col, row)) {
      return -1;
    }
    return layer.getTile(col, row);
  }

  /**
   * Generates static {@link Entity} instances with {@link Collidable}
   * behaviours for all non-walkable tiles in the collision layer.
   *
   * Each wall entity is `fixed` and `solid`, tagged with `"wall"`,
   * and set to collide with `"player"`, `"enemy"`, and `"npc"`.
   *
   * @param world - The collision {@link World} to register colliders in.
   * @returns Array of wall entities. The caller should add them to an
   *   {@link ObjectSystem} or manage them directly.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const world = new World();
   * const walls = tilemap.buildColliders(world);
   * // Add to ObjectSystem for update/render lifecycle
   * engine.use(new ObjectSystem([player, ...walls]));
   * ```
   */
  buildColliders(world: World): Entity[] {
    if (!this.collisionLayerName) {
      return [];
    }

    const layer = this.layers.find((l) => l.name === this.collisionLayerName);
    if (!layer) {
      return [];
    }

    const entities: Entity[] = [];

    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const wall = this.buildWall(layer, col, row, world);
        if (wall) {
          entities.push(wall);
        }
      }
    }

    return entities;
  }

  /**
   * Builds the wall entity for a single cell of the collision layer.
   *
   * Returns `null` when the cell produces no wall — either the cell is
   * walkable, or the layer has no tile at that position.
   *
   * @param layer - The collision layer being scanned.
   * @param col   - Grid column of the cell.
   * @param row   - Grid row of the cell.
   * @param world - The collision {@link World} the collider registers in.
   * @returns The wall entity, or `null` if this cell is not a wall.
   *
   * @internal
   */
  private buildWall(layer: TileLayer, col: number, row: number, world: World): WallEntity | null {
    const cell = this.grid.getCell(col, row);
    if (!cell || cell.walkable) {
      return null;
    }

    const tileId = layer.getTile(col, row);
    if (tileId < 0) {
      return null;
    }

    const config = this.wallConfigAt(col, row);
    const wall = new WallEntity(config);

    wall.attachBehaviour(
      new Collidable(wall, world, {
        shape: {
          type: 'aabb',
          width: config.width,
          height: config.height,
        },
        solid: true,
        fixed: true,
        tags: new Set(['wall']),
        collidesWith: new Set(['player', 'enemy', 'npc']),
      }),
    );

    return wall;
  }

  /**
   * Computes the collider rect of a cell, in world-space for
   * orthogonal maps and screen-space for isometric ones.
   *
   * Isometric colliders use the box inscribed in the diamond tile —
   * half the tile width and height, centred inside it.
   *
   * @param col - Grid column of the cell.
   * @param row - Grid row of the cell.
   * @returns The grid position and pixel rect of the wall.
   *
   * @internal
   */
  private wallConfigAt(col: number, row: number): WallEntityConfig {
    if (this.projection) {
      const pos = this.projection.gridToScreen(col, row);
      const tw = this.projection.tileWidth;
      const th = this.projection.tileHeight;
      const width = tw / 2;
      const height = th / 2;

      return { col, row, x: pos.x + (tw - width) / 2, y: pos.y + (th - height) / 2, width, height };
    }

    const pos = this.grid.cellToWorld(col, row);
    return {
      col,
      row,
      x: pos.x,
      y: pos.y,
      width: this.grid.cellWidth,
      height: this.grid.cellHeight,
    };
  }

  /**
   * Returns a layer by name, or `undefined` if not found.
   *
   * @param name - Layer name to look up.
   * @returns The matching layer, or `undefined`.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const ground = tilemap.getLayer("ground");
   * if (ground) {
   *   ground.opacity = 0.5;
   * }
   * ```
   */
  getLayer(name: string): TileLayer | undefined {
    return this.layers.find((l) => l.name === name);
  }
}
