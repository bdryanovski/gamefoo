/**
 * Thin adapter that maps tile IDs to {@link Sprite} frames.
 *
 * `TileSet` wraps the existing {@link Sprite} class so the tilemap
 * renderer can look up source rectangles by tile ID. It also stores
 * optional per-tile properties (walkability, custom metadata).
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example Create from a grid-based sprite sheet
 * ```ts
 * import { Asset, Sprite } from "gamefoo";
 * import { TileSet } from "gamefoo";
 *
 * const image = await Asset.load("tileset.png");
 * const sprite = Sprite.fromGrid(image, {
 *   frameWidth: 64,
 *   frameHeight: 32,
 * });
 *
 * const tileSet = new TileSet({ sprite });
 * const frame = tileSet.getFrame(3); // source rect for tile 3
 * ```
 *
 * @example With custom properties
 * ```ts
 * const tileSet = new TileSet({
 *   sprite,
 *   tileProperties: new Map([
 *     [0, { walkable: false, name: "water" }],
 *     [1, { walkable: true, name: "grass" }],
 *   ]),
 * });
 *
 * console.log(tileSet.getProperties(0)?.name); // "water"
 * ```
 *
 * @see {@link Sprite}    — the underlying spritesheet
 * @see {@link TileLayer} — consumes TileSet for rendering
 */
import type Sprite from '../sprite';
import type { SpriteFrame } from '../sprite';
import type { TileSetConfig } from './tilemap_types';

export class TileSet {
  /**
   * The sprite sheet containing all tile frames.
   */
  readonly sprite: Sprite;

  /**
   * First global tile ID for this tileset. Tile IDs in layer data
   * that fall in `[firstGid, firstGid + frameCount)` belong to this
   * set.
   */
  readonly firstGid: number;

  /**
   * Per-tile custom properties indexed by **local** tile index.
   */
  readonly properties: Map<number, Record<string, unknown>>;

  /**
   * Creates a new tileset from the given config.
   *
   * @param config - Sprite, first GID, and optional tile properties.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const tileSet = new TileSet({
   *   sprite: mySprite,
   *   firstGid: 1,
   * });
   * ```
   */
  constructor(config: TileSetConfig) {
    this.sprite = config.sprite;
    this.firstGid = config.firstGid ?? 0;
    this.properties = config.tileProperties ?? new Map();
  }

  /**
   * Returns the {@link SpriteFrame} for a **global** tile ID.
   *
   * The global ID is offset by {@link TileSet.firstGid} to obtain the
   * local frame index used by the sprite sheet.
   *
   * @param tileId - Global tile ID from layer data.
   * @returns The source rectangle, or `undefined` if the ID does not
   *   belong to this tileset.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const frame = tileSet.getFrame(5);
   * if (frame) {
   *   ctx.drawImage(
   *     tileSet.sprite.image,
   *     frame.x, frame.y, frame.width, frame.height,
   *     dx, dy, frame.width, frame.height,
   *   );
   * }
   * ```
   */
  getFrame(tileId: number): SpriteFrame | undefined {
    const localId = tileId - this.firstGid;
    if (localId < 0) {
      return undefined;
    }
    try {
      return this.sprite.getFrameRect(localId);
    } catch {
      return undefined;
    }
  }

  /**
   * Checks whether a global tile ID belongs to this tileset.
   *
   * @param tileId - Global tile ID.
   * @returns `true` if this tileset contains the tile.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * if (tileSet.containsTile(7)) {
   *   // tile 7 is in this set
   * }
   * ```
   */
  containsTile(tileId: number): boolean {
    return this.getFrame(tileId) !== undefined;
  }

  /**
   * Returns custom properties for a **local** tile index.
   *
   * @param localIndex - Zero-based index within the sprite sheet.
   * @returns Property record, or `undefined` if none were defined.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const props = tileSet.getProperties(0);
   * if (props?.walkable === false) {
   *   console.log("This tile blocks movement");
   * }
   * ```
   */
  getProperties(localIndex: number): Record<string, unknown> | undefined {
    return this.properties.get(localIndex);
  }
}
