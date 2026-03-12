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
 * A single sprite region cut from the tilemap. Maps directly to the
 * engine's SpriteFrame interface with added metadata for the editor.
 */
export interface SpriteRegion {
  id: string;
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
export type TabType = "sprites" | "animations" | "objects" | "export";

export interface AppState {
  projectName: string;
  imageData: {
    url: string;
    name: string;
    width: number;
    height: number;
  } | null;
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
}

export type AppAction =
  | { type: "SET_IMAGE"; url: string; name: string; width: number; height: number }
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
  | { type: "LOAD_PROJECT"; state: AppState };

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
  imageData: null,
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
};
