import type { SpriteRegion, AnimationDef } from "../types";
import type { StateMachineDef } from "../statemachine/types";

/**
 * Map Editor state — part of the unified project. Sprites and images
 * live in the sprite-editor library (AppState); the map only stores
 * screen layout + placements referencing sprites/animations/machines.
 *
 * Screen coordinates: first screen is (0,0); the screen to the RIGHT
 * is (0,1); the screen BELOW is (1,0). x grows South, y grows East.
 */

/** A static sprite placed on a screen. */
export interface SpritePlacement {
  id: string;
  kind: "sprite";
  spriteId: string;
  x: number;
  y: number;
  /** Stacking level — higher renders on top of lower. */
  level: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

/** A state machine placed on a screen (renders its chosen state). */
export interface MachinePlacement {
  id: string;
  kind: "machine";
  machineId: string;
  /** Which state renders first — defaults to the machine's initial. */
  stateName?: string;
  x: number;
  y: number;
  level: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

/** An animation placed on a screen (plays in the editor & engine). */
export interface AnimationPlacement {
  id: string;
  kind: "animation";
  animationId: string;
  x: number;
  y: number;
  level: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
}

export type MapPlacement =
  | SpritePlacement
  | MachinePlacement
  | AnimationPlacement;

export interface MapScreen {
  x: number;
  y: number;
  /** Sprite tiled across the whole screen as the background layer. */
  defaultSpriteId: string | null;
  /** Drawn sorted by level, then insertion order — later = on top. */
  placements: MapPlacement[];
}

export type MapToolType = "paint" | "erase" | "fill" | "pick" | "move" | "pan";

/** What the paint tool currently places. */
export type PaletteSelection =
  | { kind: "sprite"; id: string }
  | { kind: "machine"; id: string }
  | { kind: "animation"; id: string }
  | null;

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
  selected: PaletteSelection;
  /** Placement selected for editing (move/rotate/flip/level). */
  selectedPlacementId: string | null;
  /** Level new placements go to. */
  activeLevel: number;
  /** Render every level (true) or only activeLevel (false). */
  showAllLevels: boolean;
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
  selected: null,
  selectedPlacementId: null,
  activeLevel: 0,
  showAllLevels: false,
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
  | { type: "SELECT_PALETTE"; selection: PaletteSelection }
  | { type: "SELECT_PLACEMENT"; id: string | null }
  | { type: "SET_MAP_DEFAULT"; spriteId: string | null }
  | { type: "SET_ACTIVE_LEVEL"; level: number }
  | { type: "SET_SHOW_ALL_LEVELS"; show: boolean }
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
        Pick<
          MapPlacement,
          "x" | "y" | "level" | "rotation" | "flipX" | "flipY"
        > & { stateName?: string }
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

    case "SELECT_PALETTE":
      return { ...state, selected: action.selection };

    case "SELECT_PLACEMENT":
      return { ...state, selectedPlacementId: action.id };

    case "SET_MAP_DEFAULT":
      return { ...state, defaultSpriteId: action.spriteId };

    case "SET_ACTIVE_LEVEL":
      return {
        ...state,
        activeLevel: Math.max(0, Math.min(99, action.level)),
      };

    case "SET_SHOW_ALL_LEVELS":
      return { ...state, showAllLevels: action.show };

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
      // Same level + same origin replaces (tile painting); other
      // levels stack — a torch on level 1 sits on a wall on level 0.
      const placements = screen.placements.filter(
        (p) =>
          !(
            p.level === action.placement.level &&
            p.x === action.placement.x &&
            p.y === action.placement.y
          ),
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
              p.id === action.id
                ? ({ ...p, ...action.updates } as MapPlacement)
                : p,
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

/** Resolve the machine state a placement shows (by name or initial). */
export function resolveMachineState(
  machine: StateMachineDef,
  stateName?: string,
) {
  return (
    machine.states.find((s) => s.name === stateName) ??
    machine.states.find((s) => s.id === machine.initialStateId) ??
    machine.states[0] ??
    null
  );
}

/**
 * Resolve what a placement displays: a static sprite, or an animation
 * (with its first frame as the size reference). Returns null refs when
 * the target no longer exists.
 */
export function resolvePlacementDisplay(
  p: MapPlacement,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
  machines: StateMachineDef[],
): { spriteId: string | null; animationId: string | null } {
  if (p.kind === "sprite") {
    const exists = sprites.some((s) => s.id === p.spriteId);
    return { spriteId: exists ? p.spriteId : null, animationId: null };
  }
  if (p.kind === "animation") {
    const anim = animations.find((a) => a.id === p.animationId);
    const firstFrame = anim?.frames[0];
    return {
      spriteId: firstFrame ? (firstFrame as string) : null,
      animationId: anim ? anim.id : null,
    };
  }
  const machine = machines.find((m) => m.id === p.machineId);
  if (!machine) return { spriteId: null, animationId: null };
  const st = resolveMachineState(machine, p.stateName);
  if (!st) return { spriteId: null, animationId: null };
  if (st.display.kind === "sprite") {
    const sid = st.display.spriteId;
    return {
      spriteId: sid && sprites.some((s) => s.id === sid) ? sid : null,
      animationId: null,
    };
  }
  const aid = st.display.animationId;
  const anim = aid ? animations.find((a) => a.id === aid) : undefined;
  return {
    spriteId: anim?.frames[0] ?? null,
    animationId: anim ? anim.id : null,
  };
}

/** Drop placements referencing sprites/animations/machines that are gone. */
export function sanitizeMap(
  map: MapState,
  sprites: SpriteRegion[],
  animations: AnimationDef[],
  machines: StateMachineDef[],
): MapState {
  const spriteIds = new Set(sprites.map((s) => s.id));
  const animIds = new Set(animations.map((a) => a.id));
  const machineIds = new Set(machines.map((m) => m.id));

  const screens: Record<string, MapScreen> = {};
  for (const [key, s] of Object.entries(map.screens ?? {})) {
    screens[key] = {
      ...s,
      defaultSpriteId:
        s.defaultSpriteId && spriteIds.has(s.defaultSpriteId)
          ? s.defaultSpriteId
          : null,
      placements: (s.placements ?? []).filter((p) => {
        if (p.kind === "sprite") return spriteIds.has(p.spriteId);
        if (p.kind === "animation") return animIds.has(p.animationId);
        return machineIds.has(p.machineId);
      }),
    };
  }

  let selectedPlacementId: string | null = null;
  for (const s of Object.values(screens)) {
    if (s.placements.some((p) => p.id === map.selectedPlacementId)) {
      selectedPlacementId = map.selectedPlacementId;
      break;
    }
  }

  const sel = map.selected;
  const selected: PaletteSelection =
    sel?.kind === "sprite" && spriteIds.has(sel.id)
      ? sel
      : sel?.kind === "animation" && animIds.has(sel.id)
        ? sel
        : sel?.kind === "machine" && machineIds.has(sel.id)
          ? sel
          : null;

  return {
    ...map,
    screens,
    selected,
    selectedPlacementId,
    defaultSpriteId:
      map.defaultSpriteId && spriteIds.has(map.defaultSpriteId)
        ? map.defaultSpriteId
        : null,
  };
}

/** Accepts new-format or legacy (spriteId-only, no level) map data. */
export function migrateMapState(raw: unknown): MapState {
  const old = (raw ?? {}) as Record<string, unknown> & {
    blockSize?: number;
    screenCols?: number;
    screenRows?: number;
    defaultSpriteId?: string | null;
    mapDefaultAssetId?: string | null;
    selectedSpriteId?: string | null;
    selectedAssetId?: string | null;
    activeLevel?: number;
    showAllLevels?: boolean;
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
        kind: (p.kind as "sprite" | "machine" | "animation") ?? "sprite",
        spriteId: p.spriteId as string | undefined,
        machineId: p.machineId as string | undefined,
        animationId: p.animationId as string | undefined,
        stateName: p.stateName as string | undefined,
        x: Number(p.x) || 0,
        y: Number(p.y) || 0,
        level: Number(p.level) || 0,
        rotation: typeof p.rotation === "number" ? p.rotation : undefined,
        flipX: p.flipX === true ? true : undefined,
        flipY: p.flipY === true ? true : undefined,
      })) as MapPlacement[],
    };
  }

  const legacySelected =
    old.selectedSpriteId ?? old.selectedAssetId ?? null;

  return {
    ...INITIAL_MAP_STATE,
    blockSize: old.blockSize ?? INITIAL_MAP_STATE.blockSize,
    screenCols: old.screenCols ?? INITIAL_MAP_STATE.screenCols,
    screenRows: old.screenRows ?? INITIAL_MAP_STATE.screenRows,
    defaultSpriteId: old.defaultSpriteId ?? old.mapDefaultAssetId ?? null,
    screens,
    selected: legacySelected
      ? { kind: "sprite", id: legacySelected }
      : INITIAL_MAP_STATE.selected,
    activeLevel: old.activeLevel ?? INITIAL_MAP_STATE.activeLevel,
    showAllLevels: old.showAllLevels ?? INITIAL_MAP_STATE.showAllLevels,
    activeTool: old.activeTool ?? INITIAL_MAP_STATE.activeTool,
    zoom: old.zoom ?? INITIAL_MAP_STATE.zoom,
    pan: old.pan ?? INITIAL_MAP_STATE.pan,
  };
}
