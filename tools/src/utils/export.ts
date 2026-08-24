import type { AppState, SpriteRegion, AnimationDef, GameObjectDef } from "../types";

/**
 * Atlas export format — compatible with Sprite.fromAtlas().
 *
 * Usage in game engine:
 *   const data = await fetch('spritesheet.json').then(r => r.json());
 *   const image = await Asset.load(data.meta.image);
 *   const sprite = Sprite.fromAtlas(image, data.frames, data.animations);
 */
export interface AtlasExport {
  meta: {
    version: string;
    tool: string;
    projectName: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    exportedAt: string;
  };
  frames: Record<string, { x: number; y: number; width: number; height: number; anchor?: { x: number; y: number } }>;
  animations: Record<string, { frames: string[]; duration: number; loop: boolean }>;
}

/**
 * Grid export format — compatible with Sprite.fromGrid().
 *
 * Usage in game engine:
 *   const data = await fetch('tileset.json').then(r => r.json());
 *   const image = await Asset.load(data.meta.image);
 *   const sprite = Sprite.fromGrid(image, data.grid, data.animations);
 */
export interface GridExport {
  meta: {
    version: string;
    tool: string;
    projectName: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    exportedAt: string;
  };
  grid: {
    frameWidth: number;
    frameHeight: number;
    offsetX: number;
    offsetY: number;
    spacingX: number;
    spacingY: number;
    count?: number;
  };
  namedFrames: Record<string, number>;
  animations: Record<string, { frames: (string | number)[]; duration: number; loop: boolean }>;
}

/**
 * Full project export — includes everything: frames, animations, objects,
 * tile properties. This is the most comprehensive format.
 */
export interface FullExport {
  meta: {
    version: string;
    tool: string;
    projectName: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    exportedAt: string;
  };
  grid?: GridExport["grid"];
  frames: AtlasExport["frames"];
  animations: AtlasExport["animations"];
  objects: Record<string, {
    sprites: string[];
    animations: string[];
    properties: Record<string, string>;
  }>;
  spriteMetadata: Record<string, {
    tags: string[];
    group: string;
    order: number;
    level: number;
    properties: Record<string, string>;
  }>;
}

/**
 * Simple sprites export — sprite name → coordinates + size. Nothing else.
 *
 * Minimal by design: write your own wrapper around this.
 */
export interface SpritesExport {
  [name: string]: { x: number; y: number; width: number; height: number };
}

/**
 * Animations export — animations in their own file, separate from
 * sprite coordinates. Frames are ordered sprite names.
 */
export interface AnimationsExport {
  [name: string]: {
    frames: string[];
    duration: number;
    loop: boolean;
  };
}

function buildMeta(state: AppState) {
  return {
    version: "1.0",
    tool: "gamefoo-tilemap-editor",
    projectName: state.projectName,
    image: state.imageData?.name ?? "",
    imageWidth: state.imageData?.width ?? 0,
    imageHeight: state.imageData?.height ?? 0,
    exportedAt: new Date().toISOString(),
  };
}

function buildFrames(sprites: SpriteRegion[]): AtlasExport["frames"] {
  const frames: AtlasExport["frames"] = {};
  for (const s of sprites) {
    const frame: { x: number; y: number; width: number; height: number; anchor?: { x: number; y: number } } = {
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
    };
    if (s.anchor.x !== 0 || s.anchor.y !== 0) {
      frame.anchor = { x: s.anchor.x, y: s.anchor.y };
    }
    frames[s.name] = frame;
  }
  return frames;
}

function buildAnimations(
  animations: AnimationDef[],
  sprites: SpriteRegion[],
): AtlasExport["animations"] {
  const spriteMap = new Map(sprites.map((s) => [s.id, s]));
  const result: AtlasExport["animations"] = {};
  for (const a of animations) {
    result[a.name] = {
      frames: a.frames
        .map((fid) => spriteMap.get(fid)?.name)
        .filter((n): n is string => n != null),
      duration: a.duration,
      loop: a.loop,
    };
  }
  return result;
}

/** Minimal export: sprite name → { x, y, width, height }. */
export function exportSprites(state: AppState): SpritesExport {
  const result: SpritesExport = {};
  for (const s of state.sprites) {
    result[s.name] = { x: s.x, y: s.y, width: s.width, height: s.height };
  }
  return result;
}

/** Animations only: ordered frame names (by sprite name) + timing + loop. */
export function exportAnimations(state: AppState): AnimationsExport {
  return buildAnimations(state.animations, state.sprites);
}

export function exportAtlas(state: AppState): AtlasExport {
  return {
    meta: buildMeta(state),
    frames: buildFrames(state.sprites),
    animations: buildAnimations(state.animations, state.sprites),
  };
}

export function exportGrid(state: AppState): GridExport {
  const g = state.grid;
  const namedFrames: Record<string, number> = {};

  for (const s of state.sprites) {
    if (!g.enabled) continue;
    const col = Math.round((s.x - g.offsetX) / (g.cellWidth + g.spacingX));
    const row = Math.round((s.y - g.offsetY) / (g.cellHeight + g.spacingY));
    const cols = state.imageData
      ? Math.floor((state.imageData.width - g.offsetX + g.spacingX) / (g.cellWidth + g.spacingX))
      : 1;
    namedFrames[s.name] = row * cols + col;
  }

  const spriteMap = new Map(state.sprites.map((s) => [s.id, s]));
  const animations: GridExport["animations"] = {};
  for (const a of state.animations) {
    animations[a.name] = {
      frames: a.frames
        .map((fid) => {
          const s = spriteMap.get(fid);
          if (!s) return -1;
          return namedFrames[s.name] ?? -1;
        })
        .filter((n) => n >= 0),
      duration: a.duration,
      loop: a.loop,
    };
  }

  return {
    meta: buildMeta(state),
    grid: {
      frameWidth: g.cellWidth,
      frameHeight: g.cellHeight,
      offsetX: g.offsetX,
      offsetY: g.offsetY,
      spacingX: g.spacingX,
      spacingY: g.spacingY,
    },
    namedFrames,
    animations,
  };
}

export function exportFull(state: AppState): FullExport {
  const objects: FullExport["objects"] = {};
  const spriteMap = new Map(state.sprites.map((s) => [s.id, s]));
  const animMap = new Map(state.animations.map((a) => [a.id, a]));

  for (const o of state.objects) {
    objects[o.name] = {
      sprites: o.sprites
        .map((sid) => spriteMap.get(sid)?.name)
        .filter((n): n is string => n != null),
      animations: o.animations
        .map((aid) => animMap.get(aid)?.name)
        .filter((n): n is string => n != null),
      properties: { ...o.properties },
    };
  }

  const spriteMetadata: FullExport["spriteMetadata"] = {};
  for (const s of state.sprites) {
    spriteMetadata[s.name] = {
      tags: [...s.tags],
      group: s.group,
      order: s.order,
      level: s.level,
      properties: { ...s.properties },
    };
  }

  const result: FullExport = {
    meta: buildMeta(state),
    frames: buildFrames(state.sprites),
    animations: buildAnimations(state.animations, state.sprites),
    objects,
    spriteMetadata,
  };

  if (state.grid.enabled) {
    result.grid = {
      frameWidth: state.grid.cellWidth,
      frameHeight: state.grid.cellHeight,
      offsetX: state.grid.offsetX,
      offsetY: state.grid.offsetY,
      spacingX: state.grid.spacingX,
      spacingY: state.grid.spacingY,
    };
  }

  return result;
}

/** Save project state for later reload. */
export function exportProject(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
