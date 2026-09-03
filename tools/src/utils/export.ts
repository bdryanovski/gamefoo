import type { AppState, LibraryImage, SpriteRegion, AnimationDef, GameObjectDef, CollisionVolume, CollisionLayerDef } from "../types";
import type { ObjectExport } from "../objects/objectExport";
import { exportObject } from "../objects/objectExport";

/**
 * Atlas export format — compatible with Sprite.fromAtlas().
 * One image per atlas: sprites come from a single library image.
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

/** Grid export format — compatible with Sprite.fromGrid(). */
export interface GridExport {
  meta: AtlasExport["meta"];
  grid: {
    frameWidth: number;
    frameHeight: number;
    offsetX: number;
    offsetY: number;
    spacingX: number;
    spacingY: number;
  };
  namedFrames: Record<string, number>;
  animations: Record<string, { frames: number[]; duration: number; loop: boolean }>;
}

/** Full project export — includes everything across all images. */
export interface FullExport {
  meta: {
    version: string;
    tool: string;
    projectName: string;
    exportedAt: string;
  };
  images: Array<{ id: string; name: string; url: string; width: number; height: number }>;
  /** Project-wide collision layer registry (name + colour per layer). */
  collisionLayers: CollisionLayerDef[];
  grid?: GridExport["grid"];
  frames: Record<string, AtlasExport["frames"][string] & { image: string }>;
  animations: AtlasExport["animations"];
  objects: Record<string, {
    sprites: string[];
    animations: string[];
    properties: Record<string, string>;
    category: string;
    description: string;
    tags: string[];
    grid: ObjectExport["grid"];
    collisionLayers: ObjectExport["collisionLayers"];
    states: ObjectExport["states"];
    initial: string | null;
  }>;
  spriteMetadata: Record<string, {
    image: string;
    tags: string[];
    group: string;
    order: number;
    level: number;
    properties: Record<string, string>;
    collisions?: CollisionVolume[];
  }>;
}

function buildMeta(state: AppState, image: LibraryImage): AtlasExport["meta"] {
  return {
    version: "1.0",
    tool: "gamefoo-tilemap-editor",
    projectName: state.projectName,
    image: image.name,
    imageWidth: image.width,
    imageHeight: image.height,
    exportedAt: new Date().toISOString(),
  };
}

function buildFrames(sprites: SpriteRegion[]): AtlasExport["frames"] {
  const frames: AtlasExport["frames"] = {};
  for (const s of sprites) {
    const frame: AtlasExport["frames"][string] = {
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

/** The image the atlas/grid exports target: active image, else first image with sprites. */
function targetImage(state: AppState): LibraryImage | null {
  if (state.activeImageId) {
    const img = state.images.find((i) => i.id === state.activeImageId);
    if (img) return img;
  }
  return (
    state.images.find((i) => state.sprites.some((s) => s.imageId === i.id)) ??
    state.images[0] ??
    null
  );
}

/** Sprites belonging to one image. */
export function spritesOfImage(state: AppState, imageId: string): SpriteRegion[] {
  return state.sprites.filter((s) => s.imageId === imageId);
}

/** Atlas export for one image — engine-compatible single-sheet format. */
export function exportAtlasForImage(state: AppState, image: LibraryImage): AtlasExport {
  const sprites = spritesOfImage(state, image.id);
  return {
    meta: buildMeta(state, image),
    frames: buildFrames(sprites),
    animations: buildAnimations(
      state.animations.filter((a) =>
        a.frames.some((fid) => sprites.some((s) => s.id === fid)),
      ),
      sprites,
    ),
  };
}

/** Atlas export for the active/target image. */
export function exportAtlas(state: AppState): AtlasExport | null {
  const image = targetImage(state);
  return image ? exportAtlasForImage(state, image) : null;
}

/** Grid export for one image. */
export function exportGridForImage(state: AppState, image: LibraryImage): GridExport {
  const g = state.grid;
  const sprites = spritesOfImage(state, image.id);
  const namedFrames: Record<string, number> = {};

  for (const s of sprites) {
    if (!g.enabled) continue;
    const col = Math.round((s.x - g.offsetX) / (g.cellWidth + g.spacingX));
    const row = Math.round((s.y - g.offsetY) / (g.cellHeight + g.spacingY));
    const cols = Math.floor((image.width - g.offsetX + g.spacingX) / (g.cellWidth + g.spacingX)) || 1;
    namedFrames[s.name] = row * cols + col;
  }

  const spriteMap = new Map(sprites.map((s) => [s.id, s]));
  const animations: GridExport["animations"] = {};
  for (const a of state.animations) {
    const frames = a.frames
      .map((fid) => {
        const s = spriteMap.get(fid);
        return s ? (namedFrames[s.name] ?? -1) : -1;
      })
      .filter((n) => n >= 0);
    if (frames.length === 0) continue;
    animations[a.name] = { frames, duration: a.duration, loop: a.loop };
  }

  return {
    meta: buildMeta(state, image),
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

/** Minimal export: sprite name → { x, y, width, height } — across ALL images. */
export function exportSprites(state: AppState): Record<string, { x: number; y: number; width: number; height: number }> {
  const result: Record<string, { x: number; y: number; width: number; height: number }> = {};
  for (const s of state.sprites) {
    result[s.name] = { x: s.x, y: s.y, width: s.width, height: s.height };
  }
  return result;
}

/** Animations only: ordered frame names (by sprite name) + timing + loop. */
export function exportAnimations(state: AppState): Record<string, { frames: string[]; duration: number; loop: boolean }> {
  return buildAnimations(state.animations, state.sprites);
}

export function exportFull(state: AppState): FullExport {
  const objects: FullExport["objects"] = {};
  const spriteMap = new Map(state.sprites.map((s) => [s.id, s]));
  const animMap = new Map(state.animations.map((a) => [a.id, a]));
  const imageNames = new Map(state.images.map((i) => [i.id, i.name]));

  for (const o of state.objects) {
    const def = exportObject(state, o);
    objects[o.name] = {
      sprites: o.sprites
        .map((sid) => spriteMap.get(sid)?.name)
        .filter((n): n is string => n != null),
      animations: o.animations
        .map((aid) => animMap.get(aid)?.name)
        .filter((n): n is string => n != null),
      properties: { ...o.properties },
      category: o.meta.category,
      description: o.meta.description,
      tags: [...o.meta.tags],
      grid: def.grid,
      collisionLayers: def.collisionLayers,
      states: def.states,
      initial: def.initial,
    };
  }

  const frames: FullExport["frames"] = {};
  const spriteMetadata: FullExport["spriteMetadata"] = {};
  for (const s of state.sprites) {
    const frame = buildFrames([s])[s.name]!;
    frames[s.name] = {
      ...frame,
      image: imageNames.get(s.imageId) ?? "",
    };
    spriteMetadata[s.name] = {
      image: imageNames.get(s.imageId) ?? "",
      tags: [...s.tags],
      group: s.group,
      order: s.order,
      level: s.level,
      properties: { ...s.properties },
    };
    if (s.collisions.length > 0) {
      spriteMetadata[s.name]!.collisions = s.collisions.map((c) => ({ ...c }));
    }
  }

  const result: FullExport = {
    meta: {
      version: "1.0",
      tool: "gamefoo-tilemap-editor",
      projectName: state.projectName,
      exportedAt: new Date().toISOString(),
    },
    images: state.images.map((i) => ({
      id: i.id,
      name: i.name,
      url: i.url,
      width: i.width,
      height: i.height,
    })),
    frames,
    animations: buildAnimations(state.animations, state.sprites),
    objects,
    collisionLayers: state.collisionLayers.map((l) => ({ ...l })),
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

/**
 * Project configuration constants — default map layers + the collision
 * layer registry. Standalone reference file inlined by other exports.
 */
export function exportConfig(state: AppState) {
  return {
    meta: {
      version: "1.0",
      tool: "gamefoo-project-config",
      projectName: state.projectName,
    },
    defaultLayers: [...state.config.defaultLayers],
    collisionLayers: state.collisionLayers.map((l) => ({ ...l })),
  };
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
