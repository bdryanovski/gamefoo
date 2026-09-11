import type { AppState, GameObjectDef, CollisionShape, ObjectCellSource, ObjectCell } from "../types";
import { objectPixelSize, objectStateLayers, stateCollisions } from "../types";
import { downloadJSON } from "../utils/export";

/**
 * A single, self-contained object definition the engine loads as one
 * class: grid footprint, inlined sprite frames + animations it uses,
 * z-ordered composition layers (by asset name), object-local collisions
 * (with their layer colours), and the state machine that toggles layers
 * and collisions.
 */
export interface ObjectExport {
  meta: { version: string; tool: string; name: string; category: string };
  grid: { cols: number; rows: number; cell: number };
  size: { width: number; height: number };
  properties: Record<string, string>;
  /** Every image the object references: name → source URL + dimensions. */
  images: Record<string, { src: string; width: number; height: number }>;
  frames: Record<string, { image: string; x: number; y: number; width: number; height: number; anchor?: { x: number; y: number }; collisions?: Array<{ layer: string; enabled: boolean; shape: CollisionShape }> }>;
  animations: Record<string, { frames: string[]; duration: number; loop: boolean }>;
  collisionLayers: Record<string, { name: string; color: string }>;
  /** Each state's composition + effective collisions (idle-resolved). */
  states: Record<string, {
    layers: Array<{ name: string; cells: Array<{ col: number; row: number; source: { kind: "sprite"; sprite: string | null } | { kind: "animation"; animation: string | null }; flipX?: boolean; flipY?: boolean; rotation?: number }> }>;
    collisions: Array<{ id: string; layer: string; enabled: boolean; shape: CollisionShape }>;
  }>;
  initial: string | null;
}

export function exportObject(state: AppState, object: GameObjectDef): ObjectExport {
  const spriteById = new Map(state.sprites.map((s) => [s.id, s]));
  const animById = new Map(state.animations.map((a) => [a.id, a]));
  const imageById = new Map(state.images.map((i) => [i.id, i]));
  const imageName = new Map(state.images.map((i) => [i.id, i.name]));
  const layerDef = new Map(state.collisionLayers.map((l) => [l.id, l]));

  // Assets referenced by any state's composition (+ frames in used animations).
  const usedSprites = new Set<string>();
  const usedAnims = new Set<string>();
  const allLayers = Object.values(object.layersByState).flat();
  for (const layer of allLayers) {
    for (const c of layer.cells) {
      if (c.source.kind === "sprite") usedSprites.add(c.source.spriteId);
      else usedAnims.add(c.source.animationId);
    }
  }
  for (const aid of usedAnims) {
    animById.get(aid)?.frames.forEach((f) => usedSprites.add(f));
  }

  // Collision layer ids referenced by any state or any involved sprite.
  const refColLayers = new Set<string>();
  for (const vols of Object.values(object.collisionsByState)) for (const c of vols) refColLayers.add(c.layerId);

  const frames: ObjectExport["frames"] = {};
  for (const sid of usedSprites) {
    const s = spriteById.get(sid);
    if (!s) continue;
    for (const c of s.collisions) refColLayers.add(c.layerId);
    frames[s.name] = {
      image: imageName.get(s.imageId) ?? "",
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height,
      ...(s.anchor.x !== 0 || s.anchor.y !== 0 ? { anchor: { x: s.anchor.x, y: s.anchor.y } } : {}),
      ...(s.collisions.length > 0
        ? { collisions: s.collisions.map((c) => ({ layer: c.layerId, enabled: c.enabled, shape: c.shape })) }
        : {}),
    };
  }

  // Inline the source of every image the used sprites come from.
  const images: ObjectExport["images"] = {};
  for (const sid of usedSprites) {
    const s = spriteById.get(sid);
    const img = s && imageById.get(s.imageId);
    if (img) images[img.name] = { src: img.url, width: img.width, height: img.height };
  }

  const animations: ObjectExport["animations"] = {};
  for (const aid of usedAnims) {
    const a = animById.get(aid);
    if (!a) continue;
    animations[a.name] = {
      frames: a.frames.map((f) => spriteById.get(f)?.name).filter((n): n is string => n != null),
      duration: a.duration,
      loop: a.loop,
    };
  }

  const serializeCell = (c: ObjectCell) => ({
    col: c.col,
    row: c.row,
    source:
      c.source.kind === "sprite"
        ? { kind: "sprite" as const, sprite: spriteById.get(c.source.spriteId)?.name ?? null }
        : { kind: "animation" as const, animation: animById.get(c.source.animationId)?.name ?? null },
    ...(c.flipX ? { flipX: true } : {}),
    ...(c.flipY ? { flipY: true } : {}),
    ...(c.rotation ? { rotation: c.rotation } : {}),
  });

  const collisionLayers: ObjectExport["collisionLayers"] = {};
  for (const id of refColLayers) {
    const d = layerDef.get(id);
    collisionLayers[id] = { name: d?.name ?? id, color: d?.color ?? "#888888" };
  }
  const m = object.machine;
  const stateName = (id: string | null) => (id && m.states.find((s) => s.id === id)?.name) || null;
  const states: ObjectExport["states"] = {};
  for (const s of m.states) {
    states[s.name] = {
      layers: objectStateLayers(object, s.id).map((l) => ({ name: l.name, cells: l.cells.map(serializeCell) })),
      collisions: stateCollisions(object, s.id).map((c) => ({ id: c.id, layer: c.layerId, enabled: c.enabled, shape: c.shape })),
    };
  }

  return {
    meta: {
      version: "1.0",
      tool: "gamefoo-object-editor",
      name: object.name,
      category: object.meta.category,
    },
    grid: { ...object.grid },
    size: objectPixelSize(object.grid),
    properties: { ...object.properties },
    images,
    frames,
    animations,
    collisionLayers,
    states,
    initial: stateName(m.initialStateId),
  };
}

export function downloadObject(data: ObjectExport): void {
  const base = data.meta.name.replace(/\s+/g, "_").toLowerCase() || "object";
  downloadJSON(data, `${base}.object.json`);
}
