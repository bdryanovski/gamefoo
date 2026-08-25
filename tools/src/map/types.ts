import type { SpriteRegion } from "../types";

/**
 * Map Editor state — part of the unified project. Sprites and images
 * live in the sprite-editor library (AppState); the map only stores
 * screen layout + placements referencing sprite IDs.
 *
 * Screen coordinates: first screen is (0,0); the screen to the RIGHT
 * is (0,1); the screen BELOW is (1,0). x grows South, y grows East.
 */

/** A sprite placed on a screen. x/y are px offsets from screen top-left. */
export interface MapPlacement {
  id: string;
  spriteId: string;
  x: number;
  y: number;
  /** Rotation in degrees, clockwise around the sprite center. */
  rotation?: number;
  /** Mirror horizontally. */
  flipX?: boolean;
  /** Mirror vertically. */
  flipY?: boolean;
}

export interface MapScreen {
  x: number;
  y: number;
  /** Sprite tiled across the whole screen as the background layer. */
  defaultSpriteId: string | null;
  /** Drawn in order — later placements render on top. */
  placements: MapPlacement[];
}

export type MapToolType = "paint" | "erase" | "fill" | "pick" | "move" | "pan";

export interface MapState {
  /** Px per block. */
  blockSize: number;
  /** Blocks per screen, E-W. */
  screenCols: number;
  /** Blocks per screen, N-S. */
  screenRows: number;
  /** New screens inherit this sprite as their background. */
  defaultSpriteId: string | null;
  screens: Record<string, MapScreen>;
  selectedSpriteId: string | null;
  /** Placement selected for editing (move/rotate/flip). */
  selectedPlacementId: string | null;
  activeTool: MapToolType;
  zoom: number;
  pan: { x: number; y: number };
}

export const screenKey = (x: number, y: number) => `${x},${y}`;

export const INITIAL_MAP_STATE: MapState = {
  blockSize: 32,
  screenCols: 16,
  screenRows: 12,
  defaultSpriteId: null,
  screens: {},
  selectedSpriteId: null,
  selectedPlacementId: null,
  activeTool: "paint",
  zoom: 0.5,
  pan: { x: 40, y: 40 },
};

export type MapAction =
  | {
      type: "SET_MAP_SETTINGS";
      blockSize?: number;
      screenCols?: number;
      screenRows?: number;
    }
  | { type: "SELECT_SPRITE"; spriteId: string | null }
  | { type: "SELECT_PLACEMENT"; id: string | null }
  | { type: "SET_MAP_DEFAULT"; spriteId: string | null }
  | { type: "ADD_SCREEN"; x: number; y: number }
  | { type: "REMOVE_SCREEN"; x: number; y: number }
  | { type: "SET_SCREEN_DEFAULT"; x: number; y: number; spriteId: string | null }
  | { type: "ADD_PLACEMENT"; screenKey: string; placement: MapPlacement }
  | { type: "REMOVE_PLACEMENT"; screenKey: string; id: string }
  | { type: "MOVE_PLACEMENT"; screenKey: string; id: string; x: number; y: number }
  | {
      type: "UPDATE_PLACEMENT";
      screenKey: string;
      id: string;
      updates: Partial<
        Pick<MapPlacement, "x" | "y" | "rotation" | "flipX" | "flipY">
      >;
    }
  | { type: "CLEAR_SCREEN"; x: number; y: number }
  | { type: "SET_TOOL"; tool: MapToolType }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "LOAD_MAP"; state: MapState };

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case "SET_MAP_SETTINGS":
      return {
        ...state,
        blockSize: action.blockSize ?? state.blockSize,
        screenCols: action.screenCols ?? state.screenCols,
        screenRows: action.screenRows ?? state.screenRows,
      };

    case "SELECT_SPRITE":
      return { ...state, selectedSpriteId: action.spriteId };

    case "SELECT_PLACEMENT":
      return { ...state, selectedPlacementId: action.id };

    case "SET_MAP_DEFAULT":
      return { ...state, defaultSpriteId: action.spriteId };

    case "ADD_SCREEN": {
      const key = screenKey(action.x, action.y);
      if (state.screens[key]) return state;
      return {
        ...state,
        screens: {
          ...state.screens,
          [key]: {
            x: action.x,
            y: action.y,
            defaultSpriteId: state.defaultSpriteId,
            placements: [],
          },
        },
      };
    }

    case "REMOVE_SCREEN": {
      const key = screenKey(action.x, action.y);
      if (!state.screens[key]) return state;
      const screens = { ...state.screens };
      delete screens[key];
      return { ...state, screens };
    }

    case "SET_SCREEN_DEFAULT": {
      const key = screenKey(action.x, action.y);
      const screen = state.screens[key];
      if (!screen) return state;
      return {
        ...state,
        screens: {
          ...state.screens,
          [key]: { ...screen, defaultSpriteId: action.spriteId },
        },
      };
    }

    case "ADD_PLACEMENT": {
      const screen = state.screens[action.screenKey];
      if (!screen) return state;
      // Same-origin placements replace each other (clean tile painting).
      const placements = screen.placements.filter(
        (p) => !(p.x === action.placement.x && p.y === action.placement.y),
      );
      return {
        ...state,
        screens: {
          ...state.screens,
          [action.screenKey]: {
            ...screen,
            placements: [...placements, action.placement],
          },
        },
      };
    }

    case "REMOVE_PLACEMENT": {
      const screen = state.screens[action.screenKey];
      if (!screen) return state;
      return {
        ...state,
        selectedPlacementId:
          state.selectedPlacementId === action.id
            ? null
            : state.selectedPlacementId,
        screens: {
          ...state.screens,
          [action.screenKey]: {
            ...screen,
            placements: screen.placements.filter((p) => p.id !== action.id),
          },
        },
      };
    }

    case "MOVE_PLACEMENT": {
      const screen = state.screens[action.screenKey];
      if (!screen) return state;
      return {
        ...state,
        screens: {
          ...state.screens,
          [action.screenKey]: {
            ...screen,
            placements: screen.placements.map((p) =>
              p.id === action.id ? { ...p, x: action.x, y: action.y } : p,
            ),
          },
        },
      };
    }

    case "UPDATE_PLACEMENT": {
      const screen = state.screens[action.screenKey];
      if (!screen) return state;
      return {
        ...state,
        screens: {
          ...state.screens,
          [action.screenKey]: {
            ...screen,
            placements: screen.placements.map((p) =>
              p.id === action.id ? { ...p, ...action.updates } : p,
            ),
          },
        },
      };
    }

    case "CLEAR_SCREEN": {
      const key = screenKey(action.x, action.y);
      const screen = state.screens[key];
      if (!screen) return state;
      return {
        ...state,
        screens: { ...state.screens, [key]: { ...screen, placements: [] } },
      };
    }

    case "SET_TOOL":
      return { ...state, activeTool: action.tool };

    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.05, Math.min(8, action.zoom)) };

    case "SET_PAN":
      return { ...state, pan: { x: action.x, y: action.y } };

    case "LOAD_MAP":
      return action.state;

    default:
      return state;
  }
}

/** Drop placements / defaults referencing sprites that no longer exist. */
export function sanitizeMap(
  map: MapState,
  sprites: SpriteRegion[],
): MapState {
  const ids = new Set(sprites.map((s) => s.id));
  const screens: Record<string, MapScreen> = {};
  for (const [key, s] of Object.entries(map.screens ?? {})) {
    screens[key] = {
      ...s,
      defaultSpriteId:
        s.defaultSpriteId && ids.has(s.defaultSpriteId)
          ? s.defaultSpriteId
          : null,
      placements: (s.placements ?? []).filter((p) => ids.has(p.spriteId)),
    };
  }
  let selectedPlacementId: string | null = null;
  for (const s of Object.values(screens)) {
    if (s.placements.some((p) => p.id === map.selectedPlacementId)) {
      selectedPlacementId = map.selectedPlacementId;
      break;
    }
  }
  return {
    ...map,
    screens,
    selectedPlacementId,
    defaultSpriteId:
      map.defaultSpriteId && ids.has(map.defaultSpriteId)
        ? map.defaultSpriteId
        : null,
    selectedSpriteId:
      map.selectedSpriteId && ids.has(map.selectedSpriteId)
        ? map.selectedSpriteId
        : null,
  };
}

/** Accepts new-format or legacy (assetId-based) map data. */
export function migrateMapState(raw: unknown): MapState {
  const old = (raw ?? {}) as Record<string, unknown> & {
    blockSize?: number;
    screenCols?: number;
    screenRows?: number;
    defaultSpriteId?: string | null;
    mapDefaultAssetId?: string | null;
    selectedSpriteId?: string | null;
    selectedAssetId?: string | null;
    activeTool?: MapToolType;
    zoom?: number;
    pan?: { x: number; y: number };
    screens?: Record<string, Record<string, unknown>>;
  };

  const screens: Record<string, MapScreen> = {};
  for (const [key, rawScreen] of Object.entries(old.screens ?? {})) {
    const s = rawScreen as {
      x?: number;
      y?: number;
      defaultSpriteId?: string | null;
      defaultAssetId?: string | null;
      placements?: Array<Record<string, unknown>>;
    };
    screens[key] = {
      x: Number(s.x) || 0,
      y: Number(s.y) || 0,
      defaultSpriteId: s.defaultSpriteId ?? s.defaultAssetId ?? null,
      placements: (s.placements ?? []).map((p, i) => ({
        id: (p.id as string) ?? `pl_${key}_${i}`,
        spriteId: (p.spriteId as string) ?? (p.assetId as string) ?? "",
        x: Number(p.x) || 0,
        y: Number(p.y) || 0,
        rotation: typeof p.rotation === "number" ? p.rotation : undefined,
        flipX: p.flipX === true ? true : undefined,
        flipY: p.flipY === true ? true : undefined,
      })),
    };
  }

  return {
    ...INITIAL_MAP_STATE,
    blockSize: old.blockSize ?? INITIAL_MAP_STATE.blockSize,
    screenCols: old.screenCols ?? INITIAL_MAP_STATE.screenCols,
    screenRows: old.screenRows ?? INITIAL_MAP_STATE.screenRows,
    defaultSpriteId: old.defaultSpriteId ?? old.mapDefaultAssetId ?? null,
    screens,
    selectedSpriteId: old.selectedSpriteId ?? old.selectedAssetId ?? null,
    selectedPlacementId: null,
    activeTool: old.activeTool ?? INITIAL_MAP_STATE.activeTool,
    zoom: old.zoom ?? INITIAL_MAP_STATE.zoom,
    pan: old.pan ?? INITIAL_MAP_STATE.pan,
  };
}
