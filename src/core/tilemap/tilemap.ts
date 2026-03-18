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
import Entity from "../../entities/entity";
import { Collidable } from "../behaviours/collidable";
import type { Grid } from "../grid/grid";
import type { IsometricProjection } from "../grid/isometric";
import type World from "../world";
import type { TileLayer } from "./tile_layer";
import type { TileMapConfig } from "./tilemap_types";

/**
 * Internal entity used by {@link TileMap.buildColliders} to represent
 * a static wall tile in the collision world.
 *
 * @internal
 */
class WallEntity extends Entity {
  /**
   * @param col    - Grid column of this wall.
   * @param row    - Grid row of this wall.
   * @param x      - World/screen X position.
   * @param y      - World/screen Y position.
   * @param width  - Width in pixels.
   * @param height - Height in pixels.
   */
  constructor(col: number, row: number, x: number, y: number, width: number, height: number) {
    super(`wall_${col}_${row}`, x, y, width, height);
  }

  /** Walls are static — no update logic. */
  update(_dt: number): void {}

  /** Walls are invisible — collision only, tiles draw them. */
  render(_ctx: CanvasRenderingContext2D): void {}
}

export class TileMap {
  /** The underlying grid storing cell data and walkability. */
  readonly grid: Grid;

  /** Ordered list of tile layers (rendered back-to-front). */
  readonly layers: TileLayer[];

  /**
   * Isometric projection. `null` means orthogonal (top-down) mode.
   *
   * Can be reassigned at runtime to change the isometric angle.
   */
  projection: IsometricProjection | null;

  /** Name of the collision layer, if any. */
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
  render(ctx: CanvasRenderingContext2D, viewport: { x: number; y: number; width: number; height: number }): void {
    for (const layer of this.layers) {
      if (!layer.visible) continue;

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
    if (!layer) return -1;

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

    if (!this.grid.isInBounds(col, row)) return -1;
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
    if (!this.collisionLayerName) return [];

    const layer = this.layers.find((l) => l.name === this.collisionLayerName);
    if (!layer) return [];

    const entities: Entity[] = [];
    const isIso = this.projection !== null;

    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const cell = this.grid.getCell(col, row);
        if (!cell || cell.walkable) continue;

        const tileId = layer.getTile(col, row);
        if (tileId < 0) continue;

        let wx: number;
        let wy: number;
        let colliderW: number;
        let colliderH: number;

        if (isIso) {
          const pos = this.projection!.gridToScreen(col, row);
          const tw = this.projection!.tileWidth;
          const th = this.projection!.tileHeight;
          colliderW = tw / 2;
          colliderH = th / 2;
          wx = pos.x + (tw - colliderW) / 2;
          wy = pos.y + (th - colliderH) / 2;
        } else {
          const pos = this.grid.cellToWorld(col, row);
          wx = pos.x;
          wy = pos.y;
          colliderW = this.grid.cellWidth;
          colliderH = this.grid.cellHeight;
        }

        const wall = new WallEntity(col, row, wx, wy, colliderW, colliderH);

        wall.attachBehaviour(
          new Collidable(wall, world, {
            shape: {
              type: "aabb",
              width: colliderW,
              height: colliderH,
            },
            solid: true,
            fixed: true,
            tags: new Set(["wall"]),
            collidesWith: new Set(["player", "enemy", "npc"]),
          }),
        );

        entities.push(wall);
      }
    }

    return entities;
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
