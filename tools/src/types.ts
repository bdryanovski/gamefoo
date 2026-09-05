import { uid } from "./utils/uid";
import { INITIAL_MAP_STATE, migrateMapState, sanitizeMap, DEFAULT_LAYER_NAMES } from "./map/types";
import type { MapAction, MapState } from "./map/types";
import { makeStateMachine, sanitizeMachine } from "./statemachine/types";
import type { StateMachineDef, StateNodeDef } from "./statemachine/types";
import { INITIAL_DIALOG_STATE, sanitizeDialogState } from "./dialog/types";
import type { DialogAction, DialogState } from "./dialog/types";

/**
 * An image in the shared asset library. The sprite editor cuts sprites
 * from these; the map editor paints with the resulting sprites.
 */
export interface LibraryImage {
  id: string;
  url: string;
  name: string;
  width: number;
  height: number;
}

/**
 * Grid slicing configuration — mirrors the game engine's GridConfig
 * so exported JSON can be consumed directly by Sprite.fromGrid().
 */
export interface GridSettings {
  enabled: boolean;
  cellWidth: number;
  cellHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
}

/**
 * Collision geometry in sprite-local pixel coordinates (origin = sprite
 * top-left, extent = sprite width/height).
 */
export type CollisionShape =
  | { kind: "circle"; cx: number; cy: number; radius: number }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "polygon"; points: Array<{ x: number; y: number }> };

/**
 * A collision layer defined once at the project level: a named collision
 * system (solid, vision, damage, ...) with a fixed colour used everywhere.
 * Sprites don't redefine layers — they position shapes that reference one.
 */
export interface CollisionLayerDef {
  /** Stable key referenced by CollisionVolume.layerId. */
  id: string;
  name: string;
  /** Fixed overlay colour for every volume on this layer. */
  color: string;
}

/**
 * A collision volume attached to a sprite: a shape positioned in the
 * sprite frame, tagged with the project layer it belongs to. Colour and
 * name come from the layer, so they stay consistent across all sprites;
 * only the shape/position is per-sprite.
 */
export interface CollisionVolume {
  id: string;
  /** References a CollisionLayerDef in AppState.collisionLayers. */
  layerId: string;
  /** Toggle participation without deleting the shape. */
  enabled: boolean;
  shape: CollisionShape;
}

/**
 * Well-known collision layers seeded into every new project. Users can add
 * more; each layer keeps one colour wherever it is used.
 */
export const DEFAULT_COLLISION_LAYERS: readonly CollisionLayerDef[] = [
  { id: "solid", name: "Solid", color: "#e05a5a" },
  { id: "vision", name: "Vision", color: "#f2c14e" },
  { id: "damage", name: "Damage", color: "#d94fd9" },
  { id: "activation", name: "Activation", color: "#4ea3f2" },
  { id: "hitbox", name: "Hitbox", color: "#ff7043" },
  { id: "hurtbox", name: "Hurtbox", color: "#5ad07a" },
  { id: "trigger", name: "Trigger", color: "#26c6da" },
  { id: "pickup", name: "Pickup", color: "#ffd54f" },
  { id: "ledge", name: "Ledge", color: "#8d6e63" },
  { id: "water", name: "Water", color: "#29b6f6" },
];

/** Slugify a layer name into a stable id (lowercase, dash-separated). */
export function collisionLayerId(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || uid("layer");
}

/** A fresh collision volume of the given shape, sized to the sprite frame. */
export function makeCollision(
  kind: CollisionShape["kind"],
  sprite: { width: number; height: number },
  layerId: string,
): CollisionVolume {
  const w = Math.max(1, sprite.width);
  const h = Math.max(1, sprite.height);
  let shape: CollisionShape;
  if (kind === "circle") {
    shape = { kind: "circle", cx: w / 2, cy: h / 2, radius: Math.min(w, h) / 2 };
  } else if (kind === "rect") {
    shape = { kind: "rect", x: w * 0.25, y: h * 0.25, width: w * 0.5, height: h * 0.5 };
  } else {
    shape = {
      kind: "polygon",
      points: [
        { x: w / 2, y: h * 0.2 },
        { x: w * 0.8, y: h * 0.8 },
        { x: w * 0.2, y: h * 0.8 },
      ],
    };
  }
  return { id: uid("col"), layerId, enabled: true, shape };
}

/**
 * A single sprite region cut from a library image. Maps directly to the
 * engine's SpriteFrame interface with added metadata for the editor.
 */
export interface SpriteRegion {
  id: string;
  imageId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  anchor: { x: number; y: number };
  tags: string[];
  group: string;
  order: number;
  level: number;
  properties: Record<string, string>;
  /** Collision volumes in sprite-local pixel coords. Empty when none. */
  collisions: CollisionVolume[];
}

/**
 * Named animation built from ordered sprite frames.
 * Maps directly to the engine's AnimationDefinition.
 */
export interface AnimationDef {
  id: string;
  name: string;
  /** Ordered list of SpriteRegion IDs that form the animation frames. */
  frames: string[];
  /** Seconds each frame is displayed. */
  duration: number;
  loop: boolean;
}

/**
 * Structured metadata for a game object — human-facing description and
 * organisational fields, distinct from the free-form `properties` map
 * that games read at runtime.
 */
export interface ObjectMeta {
  description: string;
  category: string;
  tags: string[];
}

/**
 * A game object groups related sprites and animations together.
 * Useful for organizing complex entities (e.g. a character with
 * idle, walk, attack sprites and animations).
 */
/** One directional/action slot on a character → a sprite or animation. */
export interface CharacterSlot {
  kind: "sprite" | "animation";
  id: string;
  /** Mirror horizontally — reuse an existing animation flipped (e.g. left = right flipped). */
  flipX?: boolean;
  flipY?: boolean;
  /** Rotation in degrees (0/90/180/270). */
  rotation?: number;
}

/** A user-defined character action slot (e.g. attack, jump). */
export interface CharacterAction {
  id: string;
  name: string;
}

/**
 * Character authoring config layered onto a game object. `slots` is keyed
 * by standard slot keys (idle/up/down/left/right/sideways/death) and by
 * custom action ids. Presence of this field marks the object as a character.
 */
export interface CharacterConfig {
  slots: Record<string, CharacterSlot>;
  actions: CharacterAction[];
}

/** The object composition grid: cols×rows cells of `cell` px (project box grid). */
export interface ObjectGrid {
  cols: number;
  rows: number;
  cell: number;
}

/** What a composition cell draws: a static sprite or an animation. */
export type ObjectCellSource =
  | { kind: "sprite"; spriteId: string }
  | { kind: "animation"; animationId: string };

/** One sprite/animation placed at grid (col,row) on a layer. */
export interface ObjectCell {
  id: string;
  col: number;
  row: number;
  source: ObjectCellSource;
  /** Mirror horizontally (e.g. reuse walk-right as walk-left). */
  flipX?: boolean;
  /** Mirror vertically. */
  flipY?: boolean;
  /** Rotation in degrees (0/90/180/270). */
  rotation?: number;
}

/**
 * A z-ordered composition layer (array order = draw order, bottom→top).
 * `visible` is the default; a machine state may override per-state via
 * StateNodeDef.layers.
 */
export interface ObjectLayer {
  id: string;
  name: string;
  visible: boolean;
  cells: ObjectCell[];
}

/**
 * A composite game object: a grid of z-ordered layers (each placing
 * sprites/animations into cells), object-local collision volumes, and a
 * state machine whose states toggle layer visibility and collisions.
 * `sprites`/`animations` are the object's asset palette.
 */
export interface GameObjectDef {
  id: string;
  name: string;
  /** Asset palette: sprites available to place in the composition. */
  sprites: string[];
  /** Asset palette: animations available to place in the composition. */
  animations: string[];
  /** Composition footprint in grid cells. */
  grid: ObjectGrid;
  /**
   * Per-state composition: state id → that state's z-ordered layers
   * (bottom→top). Each state is its own independent set of sprites/animations.
   */
  layersByState: Record<string, ObjectLayer[]>;
  /**
   * Per-state collision volumes (object pixel space). A state with no entry
   * falls back to the initial ("idle") state's collisions.
   */
  collisionsByState: Record<string, CollisionVolume[]>;
  /** Free-form key/value config consumed by game code. */
  properties: Record<string, string>;
  /** Structured, editor-facing metadata. */
  meta: ObjectMeta;
  /**
   * Embedded state machine. For composite objects each state's `display`
   * is a derived representative kept in sync from its visible layers.
   */
  machine: StateMachineDef;
  /** Present when this object is a character built in the Character tab. */
  character?: CharacterConfig;
}

/** Object pixel dimensions from its grid. */
export function objectPixelSize(grid: ObjectGrid): { width: number; height: number } {
  return { width: grid.cols * grid.cell, height: grid.rows * grid.cell };
}

/**
 * A fresh composite object: 1×1 grid, a single "base" composition layer,
 * no collisions, and a machine with one state named "init".
 */
export function makeObject(name: string, cell = 32): GameObjectDef {
  const machine = makeStateMachine(name);
  const initId = machine.states[0]!.id;
  return {
    id: uid("obj"),
    name,
    sprites: [],
    animations: [],
    grid: { cols: 1, rows: 1, cell: Math.max(1, cell) },
    layersByState: { [initId]: makeStateLayers() },
    collisionsByState: {},
    properties: {},
    meta: { description: "", category: "", tags: [] },
    machine: { ...machine, states: machine.states.map((s) => ({ ...s, name: "init" })) },
  };
}

/** A fresh composition for a new state: one empty "base" layer. */
export function makeStateLayers(): ObjectLayer[] {
  return [{ id: uid("lyr"), name: "base", visible: true, cells: [] }];
}

/** Effective collisions for a state: its own set, else the initial state's. */
export function stateCollisions(object: GameObjectDef, stateId: string): CollisionVolume[] {
  const own = object.collisionsByState[stateId];
  if (own) return own;
  const fallback = object.machine.initialStateId;
  return (fallback ? object.collisionsByState[fallback] : undefined) ?? [];
}

/** Whether a state defines its own collisions (vs inheriting the idle default). */
export function stateHasOwnCollisions(object: GameObjectDef, stateId: string): boolean {
  return Object.prototype.hasOwnProperty.call(object.collisionsByState, stateId);
}

/** All embedded machines across objects — the project's machine set. */
export function objectMachines(objects: GameObjectDef[]): StateMachineDef[] {
  return objects.map((o) => o.machine);
}

/** Coerce persisted/legacy object data to the current shape. */
export function normalizeObject(
  raw: unknown,
  legacy?: Map<string, CollisionLayerDef>,
): GameObjectDef {
  const o = (raw ?? {}) as Partial<GameObjectDef> & { meta?: Partial<ObjectMeta> };
  const rec = asRecord(raw) ?? {};
  const meta: Partial<ObjectMeta> = o.meta ?? {};
  const g = asRecord(o.grid);
  const grid: ObjectGrid = {
    cols: Math.max(1, Math.floor(num(g?.cols, 2))),
    rows: Math.max(1, Math.floor(num(g?.rows, 2))),
    cell: Math.max(1, Math.floor(num(g?.cell, 32))),
  };
  const machine = normalizeMachine(o.machine, o.name);
  return {
    id: typeof o.id === "string" ? o.id : uid("obj"),
    name: typeof o.name === "string" ? o.name : "object",
    sprites: Array.isArray(o.sprites) ? o.sprites : [],
    animations: Array.isArray(o.animations) ? o.animations : [],
    grid,
    layersByState: normalizeLayersByState(rec, machine),
    collisionsByState: normalizeCollisionsByState(rec, machine, legacy),
    properties:
      o.properties && typeof o.properties === "object" ? o.properties : {},
    meta: {
      description: typeof meta.description === "string" ? meta.description : "",
      category: typeof meta.category === "string" ? meta.category : "",
      tags: Array.isArray(meta.tags) ? meta.tags : [],
    },
    machine,
    ...(o.character ? { character: normalizeCharacter(o.character) } : {}),
  };
}

function cloneLayers(layers: ObjectLayer[]): ObjectLayer[] {
  return layers.map((l) => ({
    id: uid("lyr"),
    name: l.name,
    visible: l.visible,
    cells: l.cells.map((c) => ({ ...c, id: uid("cell") })),
  }));
}

/** Build per-state compositions, migrating legacy shared `layers` if needed. */
function normalizeLayersByState(
  rec: Record<string, unknown>,
  machine: StateMachineDef,
): Record<string, ObjectLayer[]> {
  const ids = machine.states.map((s) => s.id);
  const result: Record<string, ObjectLayer[]> = {};
  const rawMap = asRecord(rec.layersByState);
  if (rawMap) {
    for (const id of ids) {
      const layers = normalizeLayers(rawMap[id]);
      result[id] = layers.length > 0 ? layers : makeStateLayers();
    }
    return result;
  }
  // Legacy: one shared `layers` array + per-state visible-id lists.
  const shared = normalizeLayers(rec.layers);
  const rawMachine = asRecord(rec.machine);
  const rawStates = Array.isArray(rawMachine?.states) ? (rawMachine!.states as unknown[]) : [];
  const visById = new Map<string, string[] | null>();
  for (const rs of rawStates) {
    const r = asRecord(rs);
    if (r && typeof r.id === "string") {
      visById.set(r.id, Array.isArray(r.layers) ? r.layers.filter((x): x is string => typeof x === "string") : null);
    }
  }
  for (const id of ids) {
    const vis = visById.get(id);
    const picked = vis ? shared.filter((l) => vis.includes(l.id)) : shared;
    const cloned = cloneLayers(picked);
    result[id] = cloned.length > 0 ? cloned : makeStateLayers();
  }
  return result;
}

/** Build per-state collisions, migrating a legacy object-level `collisions`. */
function normalizeCollisionsByState(
  rec: Record<string, unknown>,
  machine: StateMachineDef,
  legacy?: Map<string, CollisionLayerDef>,
): Record<string, CollisionVolume[]> {
  const ids = new Set(machine.states.map((s) => s.id));
  const normList = (arr: unknown): CollisionVolume[] =>
    Array.isArray(arr)
      ? arr.map((c) => normalizeCollision(c, legacy)).filter((c): c is CollisionVolume => c != null)
      : [];
  const result: Record<string, CollisionVolume[]> = {};
  const rawMap = asRecord(rec.collisionsByState);
  if (rawMap) {
    for (const key of Object.keys(rawMap)) {
      if (ids.has(key)) result[key] = normList(rawMap[key]);
    }
    return result;
  }
  // Legacy object-level collisions → attach to the initial (idle) state.
  if (Array.isArray(rec.collisions) && machine.initialStateId) {
    result[machine.initialStateId] = normList(rec.collisions);
  }
  return result;
}

function normalizeCellSource(raw: unknown): ObjectCellSource | null {
  const r = asRecord(raw);
  if (!r) return null;
  if (r.kind === "sprite" && typeof r.spriteId === "string") return { kind: "sprite", spriteId: r.spriteId };
  if (r.kind === "animation" && typeof r.animationId === "string") return { kind: "animation", animationId: r.animationId };
  return null;
}

function normalizeLayers(raw: unknown): ObjectLayer[] {
  if (!Array.isArray(raw)) return [];
  const out: ObjectLayer[] = [];
  for (const l of raw) {
    const r = asRecord(l);
    if (!r) continue;
    const cells: ObjectCell[] = [];
    if (Array.isArray(r.cells)) {
      for (const c of r.cells) {
        const cr = asRecord(c);
        const src = cr && normalizeCellSource(cr.source);
        if (!cr || !src) continue;
        cells.push({
          id: typeof cr.id === "string" ? cr.id : uid("cell"),
          col: Math.max(0, Math.floor(num(cr.col))),
          row: Math.max(0, Math.floor(num(cr.row))),
          source: src,
          ...(cr.flipX === true ? { flipX: true } : {}),
          ...(cr.flipY === true ? { flipY: true } : {}),
          ...(typeof cr.rotation === "number" && cr.rotation ? { rotation: cr.rotation } : {}),
        });
      }
    }
    out.push({
      id: typeof r.id === "string" ? r.id : uid("lyr"),
      name: typeof r.name === "string" ? r.name : "layer",
      visible: typeof r.visible === "boolean" ? r.visible : true,
      cells,
    });
  }
  return out;
}

/** A state's composition layers (bottom→top). */
export function objectStateLayers(object: GameObjectDef, stateId: string): ObjectLayer[] {
  return object.layersByState[stateId] ?? [];
}

/** Representative sprite/animation for a composition: topmost visible cell. */
function representativeDisplay(layers: ObjectLayer[]): StateNodeDef["display"] {
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i]!;
    if (!layer.visible || layer.cells.length === 0) continue;
    const src = layer.cells[0]!.source;
    return src.kind === "sprite"
      ? { kind: "sprite", spriteId: src.spriteId }
      : { kind: "animation", animationId: src.animationId };
  }
  return { kind: "sprite", spriteId: null };
}

/**
 * Bring a composite object to a consistent state: ensure every machine state
 * has a composition, prune cells/overrides referencing missing
 * sprites/animations/collisions, and refresh each state's derived `display`.
 */
export function sanitizeObject(
  object: GameObjectDef,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
): GameObjectDef {
  const spriteIds = new Set(sprites.map((s) => s.id));
  const animIds = new Set(animations.map((a) => a.id));
  const machine = sanitizeMachine(object.machine, sprites, animations);
  const stateIds = new Set(machine.states.map((s) => s.id));

  const layersByState: Record<string, ObjectLayer[]> = {};
  for (const s of machine.states) {
    const src = object.layersByState[s.id] ?? [];
    const pruned = src.map((l) => ({
      ...l,
      cells: l.cells.filter((c) =>
        c.source.kind === "sprite" ? spriteIds.has(c.source.spriteId) : animIds.has(c.source.animationId),
      ),
    }));
    layersByState[s.id] = pruned.length > 0 ? pruned : makeStateLayers();
  }

  // Keep only collision entries for states that still exist.
  const collisionsByState: Record<string, CollisionVolume[]> = {};
  for (const key of Object.keys(object.collisionsByState)) {
    if (stateIds.has(key)) collisionsByState[key] = object.collisionsByState[key]!;
  }

  return {
    ...object,
    layersByState,
    collisionsByState,
    machine: {
      ...machine,
      states: machine.states.map((s) => ({
        ...s,
        display: representativeDisplay(layersByState[s.id]!),
      })),
    },
  };
}

/** Coerce persisted character config to a valid shape. */
function normalizeCharacter(raw: CharacterConfig): CharacterConfig {
  const slots: Record<string, CharacterSlot> = {};
  const rawSlots = raw.slots ?? {};
  for (const key of Object.keys(rawSlots)) {
    const s = rawSlots[key];
    if (s && (s.kind === "sprite" || s.kind === "animation") && typeof s.id === "string") {
      slots[key] = {
        kind: s.kind,
        id: s.id,
        ...(s.flipX === true ? { flipX: true } : {}),
        ...(s.flipY === true ? { flipY: true } : {}),
        ...(typeof s.rotation === "number" && s.rotation ? { rotation: s.rotation } : {}),
      };
    }
  }
  const actions = Array.isArray(raw.actions)
    ? raw.actions
      .filter((a) => a && typeof a.id === "string" && typeof a.name === "string")
      .map((a) => ({ id: a.id, name: a.name }))
    : [];
  return { slots, actions };
}

/** Coerce a persisted/legacy machine to a structurally valid shape. */
function normalizeMachine(raw: unknown, fallbackName?: string): StateMachineDef {
  const m = (raw ?? {}) as Partial<StateMachineDef>;
  const states = Array.isArray(m.states) ? m.states : [];
  return {
    id: typeof m.id === "string" ? m.id : uid("sm"),
    name: typeof m.name === "string" ? m.name : (fallbackName ?? "machine"),
    states,
    transitions: Array.isArray(m.transitions) ? m.transitions : [],
    initialStateId:
      typeof m.initialStateId === "string"
        ? m.initialStateId
        : (states[0]?.id ?? null),
  };
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

/**
 * Coerce a persisted/legacy collision volume to the current shape, or drop
 * it. `legacy` collects layer defs embedded in old volumes (name/colour)
 * so migration can rebuild the project layer registry.
 */
function normalizeCollision(
  raw: unknown,
  legacy?: Map<string, CollisionLayerDef>,
): CollisionVolume | null {
  const c = asRecord(raw);
  const s = c && asRecord(c.shape);
  if (!s) return null;
  let shape: CollisionShape;
  if (s.kind === "circle") {
    shape = { kind: "circle", cx: num(s.cx), cy: num(s.cy), radius: Math.max(0, num(s.radius)) };
  } else if (s.kind === "rect") {
    shape = { kind: "rect", x: num(s.x), y: num(s.y), width: Math.max(0, num(s.width)), height: Math.max(0, num(s.height)) };
  } else if (s.kind === "polygon") {
    const pts = Array.isArray(s.points) ? s.points : [];
    shape = {
      kind: "polygon",
      points: pts.map((p) => {
        const r = asRecord(p);
        return { x: num(r?.x), y: num(r?.y) };
      }),
    };
  } else {
    return null;
  }
  const layerId =
    typeof c!.layerId === "string" ? c!.layerId
    : typeof c!.layer === "string" ? c!.layer
    : "solid";
  // Old volumes carried their own name/colour; preserve them as a layer.
  if (legacy && !legacy.has(layerId)) {
    const name = typeof c!.name === "string" ? c!.name : null;
    const color = typeof c!.color === "string" ? c!.color : null;
    if (name || color) legacy.set(layerId, { id: layerId, name: name ?? layerId, color: color ?? "#e05a5a" });
  }
  return {
    id: typeof c!.id === "string" ? c!.id : uid("col"),
    layerId,
    enabled: typeof c!.enabled === "boolean" ? c!.enabled : true,
    shape,
  };
}

/** Coerce a persisted/legacy sprite to the current shape (adds `collisions`). */
function normalizeSprite(
  raw: SpriteRegion & { collisions?: unknown },
  legacy?: Map<string, CollisionLayerDef>,
): SpriteRegion {
  const collisions = Array.isArray(raw.collisions)
    ? raw.collisions.map((c) => normalizeCollision(c, legacy)).filter((c): c is CollisionVolume => c != null)
    : [];
  return { ...raw, collisions };
}

/** Merge default layers, persisted custom layers, and legacy-embedded layers. */
function buildCollisionLayers(
  raw: unknown,
  legacy: Map<string, CollisionLayerDef>,
): CollisionLayerDef[] {
  const byId = new Map<string, CollisionLayerDef>();
  for (const l of DEFAULT_COLLISION_LAYERS) byId.set(l.id, { ...l });
  if (Array.isArray(raw)) {
    for (const r of raw) {
      const rec = asRecord(r);
      if (rec && typeof rec.id === "string") {
        byId.set(rec.id, {
          id: rec.id,
          name: typeof rec.name === "string" ? rec.name : rec.id,
          color: typeof rec.color === "string" ? rec.color : "#e05a5a",
        });
      }
    }
  }
  for (const [id, def] of legacy) if (!byId.has(id)) byId.set(id, def);
  return [...byId.values()];
}

export type ToolType = "select" | "region" | "grid-pick" | "pan";
export type TabType = "images" | "sprites" | "animations" | "export";

/**
 * Project-wide constants shared across every editor and inlined into
 * exports. Not a runtime asset file on its own — a reference the other
 * exports (objects, map) resolve their layer/collision names against.
 */
export interface ProjectConfig {
  /** Layer names a new project's map starts with (and "reset to defaults"). */
  defaultLayers: string[];
}

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  defaultLayers: [...DEFAULT_LAYER_NAMES],
};

/**
 * The unified project state: sprite library + editor UI state,
 * with the map editor state embedded as `map`. One project,
 * one save file, one lifecycle — New / Open / Import resets everything.
 */
export interface AppState {
  projectName: string;
  /** All loaded images — the shared asset library. */
  images: LibraryImage[];
  /** The image currently being edited in the sprite editor canvas. */
  activeImageId: string | null;
  grid: GridSettings;
  sprites: SpriteRegion[];
  animations: AnimationDef[];
  objects: GameObjectDef[];
  /** Project-wide collision layer registry (name + fixed colour per layer). */
  collisionLayers: CollisionLayerDef[];
  /** Project-wide constants (default layers, …). */
  config: ProjectConfig;
  selectedSpriteIds: string[];
  selectedAnimationId: string | null;
  selectedObjectId: string | null;
  activeTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  activeTab: TabType;
  /** Map editor slice — screens, placements, view state. */
  map: MapState;
  /** Dialog tree editor slice — trees of linked, id-addressable messages. */
  dialog: DialogState;
  /**
   * Undo stack: past project documents, oldest → newest. Each entry is
   * a full snapshot minus its own history. Persisted with the project
   * so undo survives save/reload. Capped in the reducer.
   */
  history: ProjectSnapshot[];
}

/** A point-in-time project document — everything except the undo stack. */
export type ProjectSnapshot = Omit<AppState, "history">;

export type AppAction =
  | { type: "ADD_IMAGE"; image: LibraryImage; activate?: boolean }
  | { type: "REMOVE_IMAGE"; imageId: string }
  | { type: "SET_ACTIVE_IMAGE"; imageId: string }
  | { type: "SET_GRID"; grid: Partial<GridSettings> }
  | { type: "ADD_SPRITE"; sprite: SpriteRegion }
  | { type: "UPDATE_SPRITE"; id: string; updates: Partial<SpriteRegion> }
  | { type: "DELETE_SPRITE"; id: string }
  | { type: "SELECT_SPRITE"; id: string; multi?: boolean }
  | { type: "DESELECT_ALL_SPRITES" }
  | { type: "ADD_COLLISION_LAYER"; layer: CollisionLayerDef }
  | { type: "UPDATE_COLLISION_LAYER"; id: string; updates: Partial<Omit<CollisionLayerDef, "id">> }
  | { type: "DELETE_COLLISION_LAYER"; id: string }
  | { type: "ADD_ANIMATION"; animation: AnimationDef }
  | { type: "UPDATE_ANIMATION"; id: string; updates: Partial<AnimationDef> }
  | { type: "DELETE_ANIMATION"; id: string }
  | { type: "SELECT_ANIMATION"; id: string | null }
  | { type: "ADD_OBJECT"; object: GameObjectDef }
  | { type: "UPDATE_OBJECT"; id: string; updates: Partial<GameObjectDef> }
  | { type: "DELETE_OBJECT"; id: string }
  | { type: "SELECT_OBJECT"; id: string | null }
  | { type: "SET_CONFIG_DEFAULT_LAYERS"; layers: string[] }
  | { type: "SET_TOOL"; tool: ToolType }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "SET_TAB"; tab: TabType }
  | { type: "SET_PROJECT_NAME"; name: string }
  | { type: "LOAD_PROJECT"; state: AppState }
  | { type: "UNDO" }
  /** All map-editor actions, delegated to mapReducer. */
  | { type: "MAP"; action: MapAction }
  /** All dialog-editor actions, delegated to dialogReducer. */
  | { type: "DIALOG"; action: DialogAction };

export const DEFAULT_GRID: GridSettings = {
  enabled: true,
  cellWidth: 32,
  cellHeight: 32,
  offsetX: 0,
  offsetY: 0,
  spacingX: 0,
  spacingY: 0,
};

export const INITIAL_STATE: AppState = {
  projectName: "Untitled",
  images: [],
  activeImageId: null,
  grid: { ...DEFAULT_GRID },
  sprites: [],
  animations: [],
  objects: [],
  collisionLayers: DEFAULT_COLLISION_LAYERS.map((l) => ({ ...l })),
  config: { defaultLayers: [...DEFAULT_LAYER_NAMES] },
  selectedSpriteIds: [],
  selectedAnimationId: null,
  selectedObjectId: null,
  activeTool: "grid-pick",
  zoom: 2,
  pan: { x: 0, y: 0 },
  activeTab: "sprites",
  map: INITIAL_MAP_STATE,
  dialog: INITIAL_DIALOG_STATE,
  history: [],
};

interface LegacyState {
  imageData?: { url: string; name: string; width: number; height: number };
  images?: LibraryImage[];
  activeImageId?: string | null;
  map?: unknown;
  stateMachines?: unknown;
  sprites?: Array<SpriteRegion & { imageId?: string }>;
  collisionLayers?: unknown;
  config?: unknown;
  animations?: AnimationDef[];
  grid?: Partial<GridSettings>;
  [key: string]: unknown;
}

/** Coerce persisted project config to a valid shape. */
function normalizeConfig(raw: unknown): ProjectConfig {
  const c = asRecord(raw);
  const layers = c && Array.isArray(c.defaultLayers)
    ? c.defaultLayers.filter((n): n is string => typeof n === "string" && n.trim().length > 0)
    : null;
  return { defaultLayers: layers && layers.length > 0 ? layers : [...DEFAULT_LAYER_NAMES] };
}

/**
 * Normalize any persisted/imported project state to the current shape.
 * Handles the legacy single-image format (`imageData`) and legacy map
 * data (assetId-based placements). Map placements referencing sprites
 * that don't exist are dropped.
 */
export function migrateSpriteState(raw: unknown): AppState {
  const old = (raw ?? {}) as LegacyState;
  let images: LibraryImage[];
  let sprites: SpriteRegion[];
  const legacyLayers = new Map<string, CollisionLayerDef>();

  if (Array.isArray(old.images)) {
    images = old.images.filter(
      (i) => i && typeof i.id === "string" && typeof i.url === "string",
    );
    const imageIds = new Set(images.map((i) => i.id));
    sprites = (old.sprites ?? [])
      .filter((s) => s && s.imageId && imageIds.has(s.imageId))
      .map((s) => normalizeSprite({ ...s, imageId: s.imageId! }, legacyLayers));
  } else if (old.imageData) {
    const imageId = uid("img");
    images = [
      {
        id: imageId,
        url: old.imageData.url,
        name: old.imageData.name,
        width: old.imageData.width,
        height: old.imageData.height,
      },
    ];
    sprites = (old.sprites ?? []).map((s) => normalizeSprite({ ...s, imageId }, legacyLayers));
  } else {
    images = [];
    sprites = [];
  }

  const activeImageId =
    old.activeImageId && images.some((i) => i.id === old.activeImageId)
      ? old.activeImageId
      : (images[0]?.id ?? null);

  const animations: AnimationDef[] = Array.isArray(old.animations)
    ? old.animations
    : [];

  const rawObjects = Array.isArray(old.objects)
    ? old.objects.map((o) => normalizeObject(o, legacyLayers))
    : [];
  // Legacy top-level state machines: each becomes its own object.
  const smRaw = old.stateMachines;
  const legacyMachines =
    smRaw && typeof smRaw === "object" && "machines" in smRaw && Array.isArray(smRaw.machines)
      ? smRaw.machines
      : [];
  const legacyObjects = legacyMachines.map((m) => {
    const name =
      m && typeof m === "object" && "name" in m && typeof m.name === "string"
        ? m.name
        : "machine";
    const obj = normalizeObject({ name, machine: m }, legacyLayers);
    // Attach every sprite/animation the machine states reference.
    const sIds = new Set<string>();
    const aIds = new Set<string>();
    for (const st of obj.machine.states) {
      if (st.display.kind === "sprite" && st.display.spriteId) sIds.add(st.display.spriteId);
      if (st.display.kind === "animation" && st.display.animationId) aIds.add(st.display.animationId);
    }
    return { ...obj, sprites: [...sIds], animations: [...aIds] };
  });
  const objects = [...rawObjects, ...legacyObjects].map((o) =>
    sanitizeObject(o, sprites, animations),
  );

  const state = {
    ...INITIAL_STATE,
    projectName:
      typeof old.projectName === "string" ? old.projectName : INITIAL_STATE.projectName,
    images,
    activeImageId,
    grid: { ...DEFAULT_GRID, ...(old.grid ?? {}) },
    sprites,
    animations,
    objects,
    collisionLayers: buildCollisionLayers(old.collisionLayers, legacyLayers),
    config: normalizeConfig(old.config),
    selectedSpriteIds: Array.isArray(old.selectedSpriteIds)
      ? old.selectedSpriteIds.filter((id) => sprites.some((s) => s.id === id))
      : [],
    selectedAnimationId:
      typeof old.selectedAnimationId === "string" ? old.selectedAnimationId : null,
    selectedObjectId:
      typeof old.selectedObjectId === "string" ? old.selectedObjectId : null,
    activeTool:
      typeof old.activeTool === "string"
        ? (old.activeTool as AppState["activeTool"])
        : INITIAL_STATE.activeTool,
    zoom: typeof old.zoom === "number" ? old.zoom : INITIAL_STATE.zoom,
    pan:
      old.pan && typeof old.pan === "object"
        ? (old.pan as { x: number; y: number })
        : INITIAL_STATE.pan,
    activeTab:
      old.activeTab === "images" ||
        old.activeTab === "sprites" ||
        old.activeTab === "animations" ||
        old.activeTab === "export"
        ? old.activeTab
        : INITIAL_STATE.activeTab,
    map: old.map
      ? sanitizeMap(
        migrateMapState(old.map),
        sprites,
        animations,
        objectMachines(objects),
      )
      : { ...INITIAL_MAP_STATE, screens: {} },
    dialog: sanitizeDialogState(old.dialog),
    history: Array.isArray(old.history)
      ? (old.history as ProjectSnapshot[])
      : [],
  } satisfies AppState;

  delete (state as unknown as Record<string, unknown>).imageData;
  delete (state as unknown as Record<string, unknown>).kind;
  return state;
}
