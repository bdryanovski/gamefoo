import type { AppState } from "../types";
import { screenKey } from "./types";
import { downloadJSON } from "../utils/export";

function baseNameOf(state: AppState): string {
  return state.projectName.replace(/\s+/g, "_").toLowerCase();
}

/**
 * Full map export — everything needed to rebuild the map: images,
 * sprites (source rects, keyed by id with names), screens and
 * id-based placements.
 */
export function exportMap(state: AppState) {
  const m = state.map;
  const imageNames = new Map(state.images.map((i) => [i.id, i.name]));
  return {
    meta: {
      version: "1.0",
      tool: "gamefoo-map-editor",
      projectName: state.projectName,
      blockSize: m.blockSize,
      screenCols: m.screenCols,
      screenRows: m.screenRows,
      exportedAt: new Date().toISOString(),
    },
    images: state.images.map((i) => ({
      id: i.id,
      name: i.name,
      url: i.url,
      width: i.width,
      height: i.height,
    })),
    sprites: Object.fromEntries(
      state.sprites.map((s) => [
        s.id,
        {
          name: s.name,
          imageId: s.imageId,
          image: imageNames.get(s.imageId) ?? "",
          x: s.x,
          y: s.y,
          width: s.width,
          height: s.height,
        },
      ]),
    ),
    mapDefaultSpriteId: m.defaultSpriteId,
    screens: Object.fromEntries(
      Object.values(m.screens).map((s) => [
        screenKey(s.x, s.y),
        {
          defaultSpriteId: s.defaultSpriteId,
          placements: s.placements.map((p) => ({
            spriteId: p.spriteId,
            x: p.x,
            y: p.y,
          })),
        },
      ]),
    ),
  };
}

/**
 * Screens export (simple) — screens keyed "x,y", placements referenced
 * by sprite NAME (stable across re-imports). Minimal, for custom wrappers.
 */
export function exportMapScreens(state: AppState) {
  const m = state.map;
  const names = new Map(state.sprites.map((s) => [s.id, s.name]));
  const out: Record<string, { fill: string | null; tiles: Array<{ sprite: string; x: number; y: number }> }> = {};
  for (const s of Object.values(m.screens)) {
    out[screenKey(s.x, s.y)] = {
      fill: s.defaultSpriteId ? (names.get(s.defaultSpriteId) ?? null) : null,
      tiles: s.placements.map((p) => ({
        sprite: names.get(p.spriteId) ?? p.spriteId,
        x: p.x,
        y: p.y,
      })),
    };
  }
  return out;
}

/**
 * Objects export (world space) — every placement as a self-contained
 * object: sprite name, screen coord, local + world px position, size,
 * source rect in the image, stacking order (z). For entity spawners.
 *
 * World coords: worldX grows East, worldY grows South.
 */
export interface MapObjectExport {
  name: string;
  screen: string;
  x: number;
  y: number;
  worldX: number;
  worldY: number;
  width: number;
  height: number;
  image: string;
  sx: number;
  sy: number;
  z: number;
}

export function exportMapObjects(state: AppState): MapObjectExport[] {
  const m = state.map;
  const sprites = new Map(state.sprites.map((s) => [s.id, s]));
  const imageNames = new Map(state.images.map((i) => [i.id, i.name]));
  const screenW = m.screenCols * m.blockSize;
  const screenH = m.screenRows * m.blockSize;

  const objects: MapObjectExport[] = [];
  for (const s of Object.values(m.screens)) {
    s.placements.forEach((p, z) => {
      const sprite = sprites.get(p.spriteId);
      if (!sprite) return;
      objects.push({
        name: sprite.name,
        screen: screenKey(s.x, s.y),
        x: p.x,
        y: p.y,
        worldX: s.y * screenW + p.x,
        worldY: s.x * screenH + p.y,
        width: sprite.width,
        height: sprite.height,
        image: imageNames.get(sprite.imageId) ?? "",
        sx: sprite.x,
        sy: sprite.y,
        z,
      });
    });
  }
  return objects;
}

/** All map export files, keyed by filename — for server export. */
export function mapExportFiles(state: AppState): Record<string, unknown> {
  const base = baseNameOf(state);
  return {
    [`${base}.map.screens.json`]: exportMapScreens(state),
    [`${base}.map.objects.json`]: exportMapObjects(state),
    [`${base}.map.json`]: exportMap(state),
    [`${base}.map.project.json`]: state,
  };
}

export function downloadMapExport(state: AppState): void {
  downloadJSON(exportMap(state), `${baseNameOf(state)}.map.json`);
}
