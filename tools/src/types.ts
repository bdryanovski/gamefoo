import { uid } from "./utils/uid";
import { INITIAL_MAP_STATE, migrateMapState, sanitizeMap } from "./map/types";
import type { MapAction, MapState } from "./map/types";
import {
  INITIAL_SM_STATE,
  sanitizeStateMachines,
  smReducer,
} from "./statemachine/types";
import type {
  SMAction,
  StateMachinesState,
} from "./statemachine/types";

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
 * A game object groups related sprites and animations together.
 * Useful for organizing complex entities (e.g. a character with
 * idle, walk, attack sprites and animations).
 */
export interface GameObjectDef {
  id: string;
  name: string;
  sprites: string[];
  animations: string[];
  properties: Record<string, string>;
}

export type ToolType = "select" | "region" | "grid-pick" | "pan";
export type TabType = "images" | "sprites" | "animations" | "objects" | "export";

/**
 * The unified project state: sprite library + editor UI state,
 * with the map editor state embedded as `map`. One project,
 * one save file, one lifecycle — New/Open/Import resets everything.
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
  /** State machine slice — machines, states, transitions. */
  stateMachines: StateMachinesState;
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
  | { type: "MAP"; action: MapAction }
  /** All state-machine actions, delegated to smReducer. */
  | { type: "SM"; action: SMAction };

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
  stateMachines: INITIAL_SM_STATE,
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

  const state = {
    ...INITIAL_STATE,
    projectName:
      typeof old.projectName === "string" ? old.projectName : INITIAL_STATE.projectName,
    images,
    activeImageId,
    grid: { ...DEFAULT_GRID, ...(old.grid ?? {}) },
    sprites,
    animations,
    objects: Array.isArray(old.objects) ? old.objects : [],
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
      typeof old.activeTab === "string"
        ? (old.activeTab as AppState["activeTab"])
        : INITIAL_STATE.activeTab,
    map: old.map
      ? sanitizeMap(
        migrateMapState(old.map),
        sprites,
        animations,
        (old.stateMachines as StateMachinesState | undefined)?.machines ?? [],
      )
      : { ...INITIAL_MAP_STATE, screens: {} },
    stateMachines: old.stateMachines
      ? sanitizeStateMachines(
        old.stateMachines as StateMachinesState,
        sprites,
        animations,
      )
      : { ...INITIAL_SM_STATE },
    history: Array.isArray(old.history)
      ? (old.history as ProjectSnapshot[])
      : [],
  } satisfies AppState;

  delete (state as unknown as Record<string, unknown>).imageData;
  delete (state as unknown as Record<string, unknown>).kind;
  return state;
}
