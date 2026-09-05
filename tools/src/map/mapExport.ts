import type { AppState } from "../types";
import { objectMachines } from "../types";
import { screenKey, resolvePlacementDisplay } from "./types";
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
    layers: m.layers.map((l) => ({ name: l.name, visible: l.visible })),
    mapDefaultSpriteId: m.defaultSpriteId,
    screens: Object.fromEntries(
      Object.values(m.screens).map((s) => [
        screenKey(s.x, s.y),
        {
          defaultSpriteId: s.defaultSpriteId,
          placements: s.placements.map((p) => ({
            kind: p.kind,
            ...(p.kind === "sprite" ? { spriteId: p.spriteId } : {}),
            ...(p.kind === "animation" ? { animationId: p.animationId } : {}),
            ...(p.kind === "machine"
              ? {
                  machineId: p.machineId,
                  ...(p.stateName ? { stateName: p.stateName } : {}),
                  ...(p.properties && Object.keys(p.properties).length > 0
                    ? { properties: p.properties }
                    : {}),
                }
              : {}),
            x: p.x,
            y: p.y,
            level: p.level,
            ...(p.rotation ? { rotation: p.rotation } : {}),
            ...(p.flipX ? { flipX: true } : {}),
            ...(p.flipY ? { flipY: true } : {}),
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
  const out: Record<
    string,
    {
      fill: string | null;
      tiles: Array<{ kind: string; name: string; x: number; y: number; level: number }>;
    }
  > = {};
  for (const s of Object.values(m.screens)) {
    out[screenKey(s.x, s.y)] = {
      fill: s.defaultSpriteId ? (names.get(s.defaultSpriteId) ?? null) : null,
      tiles: s.placements.map((p) => {
        const display = resolvePlacementDisplay(
          p,
          state.sprites,
          state.animations,
          objectMachines(state.objects),
        );
        const spriteName = display.spriteId ? (names.get(display.spriteId) ?? null) : null;
        const animName = display.animationId
          ? (state.animations.find((a) => a.id === display.animationId)?.name ?? null)
          : null;
        return {
          kind: p.kind,
          name: spriteName ?? animName ?? "?",
          x: p.x,
          y: p.y,
          level: p.level,
          ...(p.rotation ? { rotation: p.rotation } : {}),
          ...(p.flipX ? { flipX: true } : {}),
          ...(p.flipY ? { flipY: true } : {}),
        };
      }),
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
  rotation: number;
  flipX: boolean;
  flipY: boolean;
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
      const display = resolvePlacementDisplay(
        p,
        state.sprites,
        state.animations,
        objectMachines(state.objects),
      );
      const sprite = display.spriteId ? sprites.get(display.spriteId) : undefined;
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
        rotation: p.rotation ?? 0,
        flipX: p.flipX ?? false,
        flipY: p.flipY ?? false,
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
