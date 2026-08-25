import { uid } from "./utils/uid";
import { INITIAL_MAP_STATE, migrateMapState, sanitizeMap } from "./map/types";
import type { MapAction, MapState } from "./map/types";
import { makeStateMachine, sanitizeMachine } from "./statemachine/types";
import type { StateMachineDef } from "./statemachine/types";

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
export interface GameObjectDef {
  id: string;
  name: string;
  sprites: string[];
  animations: string[];
  /** Free-form key/value config consumed by game code. */
  properties: Record<string, string>;
  /** Structured, editor-facing metadata. */
  meta: ObjectMeta;
  /**
   * Embedded state machine: switches the object between its sprites and
   * animations. Every object owns exactly one.
   */
  machine: StateMachineDef;
}

/** A fresh, empty game object with its own (single-state) machine. */
export function makeObject(name: string): GameObjectDef {
  return {
    id: uid("obj"),
    name,
    sprites: [],
    animations: [],
    properties: {},
    meta: { description: "", category: "", tags: [] },
    machine: makeStateMachine(name),
  };
}

/** All embedded machines across objects — the project's machine set. */
export function objectMachines(objects: GameObjectDef[]): StateMachineDef[] {
  return objects.map((o) => o.machine);
}

/** Coerce persisted/legacy object data to the current shape. */
export function normalizeObject(raw: unknown): GameObjectDef {
  const o = (raw ?? {}) as Partial<GameObjectDef> & { meta?: Partial<ObjectMeta> };
  const meta: Partial<ObjectMeta> = o.meta ?? {};
  return {
    id: typeof o.id === "string" ? o.id : uid("obj"),
    name: typeof o.name === "string" ? o.name : "object",
    sprites: Array.isArray(o.sprites) ? o.sprites : [],
    animations: Array.isArray(o.animations) ? o.animations : [],
    properties:
      o.properties && typeof o.properties === "object" ? o.properties : {},
    meta: {
      description: typeof meta.description === "string" ? meta.description : "",
      category: typeof meta.category === "string" ? meta.category : "",
      tags: Array.isArray(meta.tags) ? meta.tags : [],
    },
    machine: normalizeMachine(o.machine, o.name),
  };
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

export type ToolType = "select" | "region" | "grid-pick" | "pan";
export type TabType = "images" | "sprites" | "animations" | "export";

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
  selectedSpriteIds: string[];
  selectedAnimationId: string | null;
  selectedObjectId: string | null;
  activeTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  activeTab: TabType;
  /** Map editor slice — screens, placements, view state. */
  map: MapState;
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
  | { type: "ADD_ANIMATION"; animation: AnimationDef }
  | { type: "UPDATE_ANIMATION"; id: string; updates: Partial<AnimationDef> }
  | { type: "DELETE_ANIMATION"; id: string }
  | { type: "SELECT_ANIMATION"; id: string | null }
  | { type: "ADD_OBJECT"; object: GameObjectDef }
  | { type: "UPDATE_OBJECT"; id: string; updates: Partial<GameObjectDef> }
  | { type: "DELETE_OBJECT"; id: string }
  | { type: "SELECT_OBJECT"; id: string | null }
  | { type: "SET_TOOL"; tool: ToolType }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "SET_TAB"; tab: TabType }
  | { type: "SET_PROJECT_NAME"; name: string }
  | { type: "LOAD_PROJECT"; state: AppState }
  | { type: "UNDO" }
  /** All map-editor actions, delegated to mapReducer. */
  | { type: "MAP"; action: MapAction };

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
  selectedSpriteIds: [],
  selectedAnimationId: null,
  selectedObjectId: null,
  activeTool: "grid-pick",
  zoom: 2,
  pan: { x: 0, y: 0 },
  activeTab: "sprites",
  map: INITIAL_MAP_STATE,
  history: [],
};

interface LegacyState {
  imageData?: { url: string; name: string; width: number; height: number };
  images?: LibraryImage[];
  activeImageId?: string | null;
  map?: unknown;
  stateMachines?: unknown;
  sprites?: Array<SpriteRegion & { imageId?: string }>;
  animations?: AnimationDef[];
  grid?: Partial<GridSettings>;
  [key: string]: unknown;
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

  if (Array.isArray(old.images)) {
    images = old.images.filter(
      (i) => i && typeof i.id === "string" && typeof i.url === "string",
    );
    const imageIds = new Set(images.map((i) => i.id));
    sprites = (old.sprites ?? [])
      .filter((s) => s && s.imageId && imageIds.has(s.imageId))
      .map((s) => ({ ...s, imageId: s.imageId! }));
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
    sprites = (old.sprites ?? []).map((s) => ({ ...s, imageId }));
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
    ? old.objects.map(normalizeObject)
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
    const obj = normalizeObject({ name, machine: m });
    // Attach every sprite/animation the machine states reference.
    const sIds = new Set<string>();
    const aIds = new Set<string>();
    for (const st of obj.machine.states) {
      if (st.display.kind === "sprite" && st.display.spriteId) sIds.add(st.display.spriteId);
      if (st.display.kind === "animation" && st.display.animationId) aIds.add(st.display.animationId);
    }
    return { ...obj, sprites: [...sIds], animations: [...aIds] };
  });
  const objects = [...rawObjects, ...legacyObjects].map((o) => ({
    ...o,
    machine: sanitizeMachine(o.machine, sprites, animations),
  }));

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
    history: Array.isArray(old.history)
      ? (old.history as ProjectSnapshot[])
      : [],
  } satisfies AppState;

  delete (state as unknown as Record<string, unknown>).imageData;
  delete (state as unknown as Record<string, unknown>).kind;
  return state;
}
