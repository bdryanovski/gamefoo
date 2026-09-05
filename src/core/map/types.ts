/**
 * Runtime map schema + resolved forms consumed by {@link MapManager} and
 * {@link AssetManager}.
 *
 * The *Def* interfaces mirror the JSON emitted by the gamefoo map editor
 * (`*.map.project.json`). Everything is cross-referenced by **id**
 * (`spr_…`, `anim_…`, `sm_…`, `img_…`); the loader resolves those into the
 * *Frame* / *Clip* forms below once, up front.
 *
 * @category Map
 * @since 0.5.0
 */

import type AssetManager from './asset_manager';

/**
 * A screen's stable identifier, `"x,y"`.
 *
 * @since 0.5.0
 */
export type ScreenName = string;

/**
 * A screen's grid coordinate `[x, y]`.
 *
 * @since 0.5.0
 */
export type ScreenCoordinate = [number, number];

/**
 * A source spritesheet image in the project's asset library.
 *
 * @since 0.5.0
 */
export interface ImageDefinition {
  id: string;
  name: string;
  /**
   * Path as stored by the editor, e.g. `/uploads/1699_walls.png`.
   */
  url: string;
  width: number;
  height: number;
}

/**
 * A named source rectangle cut from an {@link ImageDefinition}.
 */
export interface SpriteRegionDefinition {
  id: string;
  name: string;
  imageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * Authored colliders in sprite-local pixels (absent/empty = none).
   */
  collisions?: CollisionDefinition[];
}

/**
 * A named animation: an ordered list of {@link SpriteRegionDefinition} ids.
 */
export interface AnimationDefinition {
  id: string;
  name: string;
  /**
   * Ordered `SpriteRegionDefinition` ids that form the animation frames.
   */
  frames: string[];
  /**
   * Seconds each frame is displayed.
   */
  duration: number;
  loop: boolean;
}

/**
 * What a state renders: one static sprite, or an animation.
 */
export type StateDisplay =
  | { kind: 'sprite'; spriteId: string | null }
  | { kind: 'animation'; animationId: string | null };

/**
 * One state in a {@link StateMachineDefinition}.
 */
export interface StateNodeDefinition {
  id: string;
  name: string;
  display: StateDisplay;
}

/**
 * A directed edge between two states, fired by a named condition.
 */
export interface StateTransitionDefinition {
  id: string;
  fromStateId: string;
  toStateId: string;
  /**
   * Engine-controlled verb, e.g. `"kick"`, `"ignite"`.
   */
  condition: string;
}

/**
 * An object's embedded finite state machine.
 */
export interface StateMachineDefinition {
  id: string;
  name: string;
  states: StateNodeDefinition[];
  transitions: StateTransitionDefinition[];
  initialStateId: string | null;
}

/**
 * An axis-aligned rectangle in pixels — colliders, regions, bounds.
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A collision shape in object/sprite-local pixels: rectangle or circle.
 */
export type CollisionShape =
  | { kind: 'rect'; x: number; y: number; width: number; height: number }
  | { kind: 'circle'; cx: number; cy: number; radius: number };

/**
 * One authored collider, tagged with a collision layer (solid, trigger, …).
 */
export interface CollisionDefinition {
  id?: string;
  /**
   * Collision layer id, e.g. "solid", "trigger", "activation".
   */
  layerId: string;
  enabled?: boolean;
  shape: CollisionShape;
}

/**
 * The object composition grid: `cols`×`rows` cells of `cell` pixels.
 */
export interface ObjectGrid {
  cols: number;
  rows: number;
  cell: number;
}

/**
 * What a composition cell draws: a static sprite or an animation.
 */
export type ObjectCellSource =
  | { kind: 'sprite'; spriteId: string }
  | { kind: 'animation'; animationId: string };

/**
 * One sprite/animation placed at grid `(col, row)` on a composition layer.
 */
export interface ObjectCell {
  col: number;
  row: number;
  source: ObjectCellSource;
  flipX?: boolean;
  flipY?: boolean;
}

/**
 * One z-ordered composition layer of a state (bottom→top).
 */
export interface ObjectLayer {
  name: string;
  visible: boolean;
  cells: ObjectCell[];
}

/**
 * A prefab grouping sprites/animations behind a {@link StateMachineDefinition}.
 */
export interface GameObjectDefinition {
  id: string;
  name: string;
  sprites: string[];
  animations: string[];
  properties: Record<string, string>;
  machine: StateMachineDefinition;
  /**
   * Composition footprint in grid cells (drives cell pixel offsets).
   */
  grid?: ObjectGrid;
  /**
   * Per-state composition: state id → z-ordered layers (bottom→top). Every
   * visible cell is drawn at its grid offset, so one state can stack multiple
   * sprites/animations (e.g. a portal's `base` + `door`). Absent → the
   * state's single `display` is used.
   */
  layersByState?: Record<string, ObjectLayer[]>;
  /**
   * Authored colliders per FSM state id — solidity can change with state.
   */
  collisionsByState?: Record<string, CollisionDefinition[]>;
  meta?: { category?: string; tags?: string[]; description?: string };
}

/**
 * Optional per-placement transform flags shared by tiles and objects.
 */
export interface Transform {
  /**
   * Clockwise rotation in degrees (canvas-backed renderers only).
   */
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

/**
 * One thing painted on a screen at a pixel offset and z-`level`.
 */
export type Placement = Transform & {
  id: string;
  /**
   * Pixel offset within the screen (grid-snapped).
   */
  x: number;
  y: number;
  /**
   * Z-layer, `0` = back. Layers stack low → high.
   */
  level: number;
} & (
    | { kind: 'sprite'; spriteId: string }
    | { kind: 'animation'; animationId: string }
    | {
        kind: 'machine';
        machineId: string;
        stateName?: string;
        /**
         * Per-placement overrides merged over the object def's `properties`
         * (this instance wins). Lets one prefab drive many configured
         * instances — e.g. a `portal` whose target screen differs per copy.
         */
        properties?: Record<string, string>;
      }
  );

/**
 * A single navigable screen: a fill tile plus placements.
 */
export interface ScreenData {
  x: number;
  y: number;
  /**
   * Sprite id painted across the whole screen before placements.
   */
  defaultSpriteId?: string | null;
  placements: Placement[];
}

/**
 * A named z-layer in draw order: its index is the placement `level` that
 * targets it. The runtime honors only `visible` — a hidden layer is excluded
 * entirely (no tiles, colliders, or objects). `name` is authoring metadata.
 */
export interface LayerDefinition {
  name: string;
  visible: boolean;
}

/**
 * The map: grid dimensions plus every screen keyed by `"x,y"`.
 */
export interface MapData {
  /**
   * Pixels per tile cell.
   */
  blockSize: number;
  /**
   * Tile columns per screen.
   */
  screenCols: number;
  /**
   * Tile rows per screen.
   */
  screenRows: number;
  /**
   * Fallback fill sprite id when a screen omits its own.
   */
  defaultSpriteId?: string | null;
  screens: Record<ScreenName, ScreenData>;
  /**
   * Named z-layers in draw order; index === a placement's `level`. When
   * present, any layer with `visible: false` is skipped at build time.
   * Absent → every level renders.
   */
  layers?: LayerDefinition[];
}

/**
 * A complete exported project — the single runtime input.
 */
export interface MapProject {
  projectName?: string;
  images: ImageDefinition[];
  sprites: SpriteRegionDefinition[];
  animations: AnimationDefinition[];
  objects: GameObjectDefinition[];
  map: MapData;
}

/**
 * A loaded image region ready to place and render — no id lookups at draw time.
 * @since 0.5.0
 */
export interface Frame {
  image: HTMLImageElement;
  /**
   * Source rectangle in the image.
   */
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  name: string;
}

/**
 * A resolved animation: pre-looked-up frames + timing.
 *
 * @since 0.5.0
 */
export interface Clip {
  name: string;
  frames: Frame[];
  duration: number;
  loop: boolean;
}

/**
 * Everything a {@link MapObject} needs, assembled by the loader and
 * injected once at construction. Custom classes read from this instead of
 * reaching into the loader.
 */
export interface MapObjectContext {
  /**
   * Shared catalog for resolving frames/clips on demand.
   */
  assets: AssetManager;
  /**
   * The finite state machine definition backing this object.
   */
  machine: StateMachineDefinition;
  /**
   * The full object prefab (name, sprites, animations, meta).
   */
  def: GameObjectDefinition;
  /**
   * Free-form key/value config authored on the object.
   */
  properties: Record<string, string>;
  /**
   * Pixel offset within the screen.
   */
  x: number;
  y: number;
  /**
   * Z-layer this object lives on.
   */
  level: number;
  /**
   * Optional flip/rotation.
   */
  transform?: Transform;
  /**
   * Initial state id (resolved from a placement's `stateName`, if any).
   */
  startStateId?: string;
}

/**
 * Maps an {@link ImageDefinition} to the URL to actually fetch.
 */
export type ImageResolver = (image: ImageDefinition) => string;

/**
 * Builds the `"x,y"` key for a screen coordinate.
 */
export const screenKey = (x: number, y: number): ScreenName => `${x},${y}`;
