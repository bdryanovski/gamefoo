import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  AppState,
  AppAction,
  GameObjectDef,
  SpriteRegion,
  AnimationDef,
  ObjectCellSource,
  ObjectLayer,
  ObjectCell,
  CollisionVolume,
} from "../types";
import { makeObject, objectPixelSize, stateCollisions, stateHasOwnCollisions } from "../types";
import type { StateMachineDef, StateNodeDef } from "../statemachine/types";
import {
  makeState,
  smAddState,
  smUpdateState,
  smRemoveState,
} from "../statemachine/types";
import { AnimatedSpritePreview } from "../components/AnimatedSpritePreview";
import type { PreviewTransform } from "../components/AnimatedSpritePreview";
import { CollisionEditor } from "../components/CollisionEditor";
import { drawObjectLayers } from "./composition";
import { exportObject, downloadObject } from "./objectExport";
import { Icon } from "../components/Icon";
import { uid } from "../utils/uid";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  imageMap: Map<string, HTMLImageElement>;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: "save" | "quick") => void;
  onOpenProjects: () => void;
}

type Brush = { kind: "sprite"; id: string } | { kind: "animation"; id: string } | null;
type Frames = { frames: string[]; duration: number; transform?: PreviewTransform };

const ELLIPSIS: React.CSSProperties = {
  maxWidth: 48,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

/** Default preview: the machine's initial state representative, else first cell. */
function objectPreviewFrames(o: GameObjectDef, animById: Map<string, AnimationDef>): Frames {
  const m = o.machine;
  const initialId = m.states.find((s) => s.id === m.initialStateId)?.id ?? m.states[0]?.id ?? null;
  const layers = initialId ? (o.layersByState[initialId] ?? []) : [];
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i]!;
    if (!l.visible || l.cells.length === 0) continue;
    const c = l.cells[0]!;
    const transform: PreviewTransform | undefined =
      c.flipX || c.flipY || c.rotation ? { flipX: c.flipX, flipY: c.flipY, rotation: c.rotation } : undefined;
    if (c.source.kind === "sprite") return { frames: [c.source.spriteId], duration: 0, transform };
    const a = animById.get(c.source.animationId);
    if (a && a.frames.length > 0) return { frames: a.frames, duration: a.duration, transform };
  }
  return { frames: [], duration: 0 };
}

export function ObjectExplorer({ state, dispatch, imageMap, projectId, saving, onSave, onOpenProjects }: Props) {
  const selected = state.objects.find((o) => o.id === state.selectedObjectId) ?? null;

  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [brush, setBrush] = useState<Brush>(null);
  const [tool, setTool] = useState<"paint" | "erase">("paint");
  const [paletteKind, setPaletteKind] = useState<"sprite" | "animation">("sprite");
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");
  const [jsonView, setJsonView] = useState<string | null>(null);
  const [editWidth, setEditWidth] = useState<number>(() => {
    const v = Number(localStorage.getItem("gamefoo-object-edit-width"));
    return Number.isFinite(v) && v >= 280 ? v : 360;
  });
  const resizeRef = useRef<{ startX: number; startW: number } | null>(null);
  useEffect(() => {
    localStorage.setItem("gamefoo-object-edit-width", String(editWidth));
  }, [editWidth]);
  const onResizeDown = useCallback(
    (e: React.PointerEvent) => {
      resizeRef.current = { startX: e.clientX, startW: editWidth };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [editWidth],
  );
  const onResizeMove = useCallback((e: React.PointerEvent) => {
    const r = resizeRef.current;
    if (!r) return;
    setEditWidth(Math.min(900, Math.max(280, r.startW - (e.clientX - r.startX))));
  }, []);
  const onResizeUp = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    resizeRef.current = null;
  }, []);

  const spriteById = useMemo(() => new Map(state.sprites.map((s) => [s.id, s])), [state.sprites]);
  const animById = useMemo(() => new Map(state.animations.map((a) => [a.id, a])), [state.animations]);

  useEffect(() => {
    if (!selected) {
      setSelectedStateId(null);
      setActiveLayerId(null);
      return;
    }
    setSelectedStateId(
      selected.machine.states.find((s) => s.id === selected.machine.initialStateId)?.id ??
        selected.machine.states[0]?.id ??
        null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedObjectId]);

  const updateSelected = useCallback(
    (updates: Partial<GameObjectDef>) => {
      if (!selected) return;
      dispatch({ type: "UPDATE_OBJECT", id: selected.id, updates });
    },
    [selected, dispatch],
  );
  const setMachine = useCallback((m: StateMachineDef) => updateSelected({ machine: m }), [updateSelected]);
  const updateMeta = useCallback(
    (patch: Partial<GameObjectDef["meta"]>) => {
      if (!selected) return;
      updateSelected({ meta: { ...selected.meta, ...patch } });
    },
    [selected, updateSelected],
  );

  const createObject = useCallback(() => {
    const obj = makeObject(`object_${state.objects.length}`, state.grid.cellWidth);
    dispatch({ type: "ADD_OBJECT", object: obj });
    dispatch({ type: "SELECT_OBJECT", id: obj.id });
  }, [state.objects.length, state.grid.cellWidth, dispatch]);

  const machine = selected?.machine ?? null;
  const selState = machine?.states.find((s) => s.id === selectedStateId) ?? null;

  // The composition of the currently selected state — what we edit.
  const stateLayers: ObjectLayer[] =
    selected && selectedStateId ? (selected.layersByState[selectedStateId] ?? []) : [];

  // When the selected state (or object) changes, focus its top layer.
  useEffect(() => {
    setActiveLayerId(stateLayers[stateLayers.length - 1]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateId, state.selectedObjectId]);

  const setStateLayers = useCallback(
    (layers: ObjectLayer[]) => {
      if (!selected || !selectedStateId) return;
      updateSelected({ layersByState: { ...selected.layersByState, [selectedStateId]: layers } });
    },
    [selected, selectedStateId, updateSelected],
  );

  const addStateAt = useCallback(
    (x: number, y: number) => {
      if (!machine) return;
      const st = makeState(`state_${machine.states.length}`, x, y);
      setMachine(smAddState(machine, st));
      setSelectedStateId(st.id);
    },
    [machine, setMachine],
  );

  // --- composition editing (targets the selected state) -------------
  const addLayer = useCallback(() => {
    const layer: ObjectLayer = { id: uid("lyr"), name: `layer_${stateLayers.length}`, visible: true, cells: [] };
    setStateLayers([...stateLayers, layer]);
    setActiveLayerId(layer.id);
  }, [stateLayers, setStateLayers]);

  const removeLayer = useCallback(
    (id: string) => {
      const layers = stateLayers.filter((l) => l.id !== id);
      setStateLayers(layers);
      if (activeLayerId === id) setActiveLayerId(layers[layers.length - 1]?.id ?? null);
    },
    [stateLayers, setStateLayers, activeLayerId],
  );

  const moveLayer = useCallback(
    (id: string, dir: -1 | 1) => {
      const layers = [...stateLayers];
      const i = layers.findIndex((l) => l.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= layers.length) return;
      [layers[i], layers[j]] = [layers[j]!, layers[i]!];
      setStateLayers(layers);
    },
    [stateLayers, setStateLayers],
  );

  const paintCell = useCallback(
    (col: number, row: number) => {
      if (!selected || !selectedStateId || !activeLayerId || !brush) return;
      const source: ObjectCellSource =
        brush.kind === "sprite" ? { kind: "sprite", spriteId: brush.id } : { kind: "animation", animationId: brush.id };
      const layers = stateLayers.map((l) =>
        l.id === activeLayerId
          ? { ...l, cells: [...l.cells.filter((c) => !(c.col === col && c.row === row)), { id: uid("cell"), col, row, source }] }
          : l,
      );
      const updates: Partial<GameObjectDef> = {
        layersByState: { ...selected.layersByState, [selectedStateId]: layers },
      };
      if (brush.kind === "sprite" && !selected.sprites.includes(brush.id)) updates.sprites = [...selected.sprites, brush.id];
      if (brush.kind === "animation" && !selected.animations.includes(brush.id)) updates.animations = [...selected.animations, brush.id];
      updateSelected(updates);
    },
    [selected, selectedStateId, stateLayers, activeLayerId, brush, updateSelected],
  );

  const eraseCell = useCallback(
    (col: number, row: number) => {
      if (!activeLayerId) return;
      setStateLayers(
        stateLayers.map((l) => (l.id === activeLayerId ? { ...l, cells: l.cells.filter((c) => !(c.col === col && c.row === row)) } : l)),
      );
    },
    [stateLayers, activeLayerId, setStateLayers],
  );

  const onCanvasCell = useCallback(
    (col: number, row: number) => (tool === "erase" ? eraseCell(col, row) : paintCell(col, row)),
    [tool, eraseCell, paintCell],
  );

  const activeCells = stateLayers.find((l) => l.id === activeLayerId)?.cells ?? [];
  const updateCell = useCallback(
    (cellId: string, patch: Partial<ObjectCell>) => {
      setStateLayers(
        stateLayers.map((l) =>
          l.id === activeLayerId ? { ...l, cells: l.cells.map((c) => (c.id === cellId ? { ...c, ...patch } : c)) } : l,
        ),
      );
    },
    [stateLayers, activeLayerId, setStateLayers],
  );

  // Per-state collisions with idle fallback.
  const idleStateId = selected?.machine.initialStateId ?? null;
  const isIdleState = !!selectedStateId && selectedStateId === idleStateId;
  const collisionsInherited =
    !!selected && !!selectedStateId && !isIdleState && !stateHasOwnCollisions(selected, selectedStateId);
  const effectiveCollisions = selected && selectedStateId ? stateCollisions(selected, selectedStateId) : [];
  const setStateCollisions = useCallback(
    (vols: CollisionVolume[]) => {
      if (!selected || !selectedStateId) return;
      updateSelected({ collisionsByState: { ...selected.collisionsByState, [selectedStateId]: vols } });
    },
    [selected, selectedStateId, updateSelected],
  );
  const resetStateCollisions = useCallback(() => {
    if (!selected || !selectedStateId) return;
    const cbs = { ...selected.collisionsByState };
    delete cbs[selectedStateId];
    updateSelected({ collisionsByState: cbs });
  }, [selected, selectedStateId, updateSelected]);

  const palette = paletteKind === "sprite" ? state.sprites : state.animations;

  const headerPreview = selected ? objectPreviewFrames(selected, animById) : { frames: [], duration: 0 };

  return (
    <div className="app-layout">
      <div className="title-bar">
        <span className="title-bar__icon"><Icon name="objects" size={15} /></span>
        <span className="title-bar__name">
          GameFoo Object Explorer — {state.projectName}
          {projectId ? "" : " (unsaved)"}
        </span>
        <button className="btn btn-sm title-btn" onClick={onOpenProjects}>Projects</button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.history.length === 0}
          title="Undo — Ctrl/Cmd+Z"
        >
          <Icon name="undo" size={13} /> Undo{state.history.length > 0 ? ` (${state.history.length})` : ""}
        </button>
        <button className="btn btn-sm title-btn" onClick={() => onSave("quick")} disabled={saving} title="QuickSave">
          QuickSave
        </button>
        <button className="btn btn-sm title-btn" onClick={() => onSave("save")} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="main-area">
        {/* Left: object list */}
        <div className="right-panel" style={{ borderRight: "1px solid var(--border-dark)" }}>
          <div className="panel-content">
            <div className="section">
              <div className="section-title">
                <span>Objects ({state.objects.length})</span>
                <button className="btn btn-sm" onClick={createObject}>+ New</button>
              </div>
              {state.objects.length === 0 && (
                <div className="p-4 text-dim text-xs">
                  No objects yet. Each object is a grid composition of sprite/animation
                  layers, with collisions and a state machine.
                </div>
              )}
              {state.objects.map((o) => {
                const pv = objectPreviewFrames(o, animById);
                return (
                  <div
                    key={o.id}
                    className={`object-item ${state.selectedObjectId === o.id ? "selected" : ""}`}
                    onClick={() => dispatch({ type: "SELECT_OBJECT", id: o.id })}
                  >
                    <div className="asset-thumb" style={{ width: 28, height: 28, cursor: "pointer" }}>
                      <AnimatedSpritePreview
                        frames={pv.frames}
                        duration={pv.duration}
                        transform={pv.transform}
                        spriteById={spriteById}
                        imageMap={imageMap}
                        size={26}
                      />
                    </div>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{o.name}</span>
                    <span className="text-xs text-dim">
                      {o.grid.cols}×{o.grid.rows} · {o.machine.states.length}st
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: composition canvas + state machine graph */}
        {selected ? (
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <div className="object-compose">
              <div className="row" style={{ gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
                <span className="text-xs text-dim">State:</span>
                {machine!.states.map((s) => (
                  <button
                    key={s.id}
                    className={`btn btn-sm ${selectedStateId === s.id ? "active" : ""}`}
                    onClick={() => setSelectedStateId(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
                <span style={{ flex: 1 }} />
                <button
                  className={`btn btn-sm ${tool === "paint" ? "active" : ""}`}
                  onClick={() => setTool("paint")}
                >
                  Paint
                </button>
                <button
                  className={`btn btn-sm ${tool === "erase" ? "active" : ""}`}
                  onClick={() => setTool("erase")}
                >
                  Erase
                </button>
              </div>
              <ObjectCanvas
                grid={selected.grid}
                layers={stateLayers}
                activeLayerId={activeLayerId}
                spriteById={spriteById}
                animById={animById}
                imageMap={imageMap}
                onCell={onCanvasCell}
              />
              <div className="text-xs text-dim" style={{ marginTop: 2 }}>
                Painting layer: <b>{stateLayers.find((l) => l.id === activeLayerId)?.name ?? "— none —"}</b>
                {" · "}
                {tool === "paint" ? (brush ? "click a cell to place" : "pick an asset in the palette") : "click a cell to erase"}
              </div>
            </div>
          </div>
        ) : (
          <div className="main-area" style={{ alignItems: "center", justifyContent: "center" }}>
            <div className="text-dim text-xs">Select an object on the left, or create one with “+ New”.</div>
          </div>
        )}

        {/* Right: configuration */}
        {selected && (
          <>
            <div
              className="panel-resizer"
              title="Drag to resize the edit column"
              onPointerDown={onResizeDown}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeUp}
              onPointerCancel={onResizeUp}
            />
            <div className="right-panel" style={{ width: editWidth, flexShrink: 0 }}>
            <div className="panel-content">
              <div className="section">
                <div className="section-title">
                  <span>Edit: {selected.name}</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button className="btn btn-sm" title="Show the object's JSON to copy or download" onClick={() => setJsonView(JSON.stringify(exportObject(state, selected), null, 2))}>
                      Export JSON
                    </button>
                    <button className="btn btn-sm danger" onClick={() => dispatch({ type: "DELETE_OBJECT", id: selected.id })}>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="row" style={{ gap: 8, alignItems: "center", padding: 4 }}>
                  <div className="asset-thumb" style={{ width: 56, height: 56, cursor: "default" }}>
                    <AnimatedSpritePreview
                      frames={headerPreview.frames}
                      duration={headerPreview.duration}
                      transform={headerPreview.transform}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      size={54}
                    />
                  </div>
                  <div className="col text-xs text-dim" style={{ gap: 2 }}>
                    <span>{selState?.name ?? "—"}: {stateLayers.length} layers · {effectiveCollisions.length} collisions{collisionsInherited ? " (idle)" : ""}</span>
                    <span>{selected.machine.states.length} states</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="section">
                <div className="section-title">Metadata</div>
                <div className="field-row">
                  <span className="field-label">Name:</span>
                  <input type="text" className="input input-full" value={selected.name} onChange={(e) => updateSelected({ name: e.target.value })} />
                </div>
                <div className="field-row">
                  <span className="field-label">Category:</span>
                  <input type="text" className="input input-full" placeholder="e.g. prop, enemy, pickup" value={selected.meta.category} onChange={(e) => updateMeta({ category: e.target.value })} />
                </div>
                <div className="field-row" style={{ alignItems: "flex-start" }}>
                  <span className="field-label">Notes:</span>
                  <textarea className="input input-full" rows={2} value={selected.meta.description} onChange={(e) => updateMeta({ description: e.target.value })} />
                </div>
              </div>

              {/* Grid */}
              <div className="section">
                <div className="section-title">Grid</div>
                <div className="field-row wrap">
                  <span className="field-label">Cols:</span>
                  <input type="number" className="input input-sm" min={1} value={selected.grid.cols} onChange={(e) => updateSelected({ grid: { ...selected.grid, cols: Math.max(1, +e.target.value || 1) } })} />
                  <span className="field-label">Rows:</span>
                  <input type="number" className="input input-sm" min={1} value={selected.grid.rows} onChange={(e) => updateSelected({ grid: { ...selected.grid, rows: Math.max(1, +e.target.value || 1) } })} />
                  <span className="field-label">Cell:</span>
                  <input type="number" className="input input-sm" min={1} value={selected.grid.cell} onChange={(e) => updateSelected({ grid: { ...selected.grid, cell: Math.max(1, +e.target.value || 1) } })} />
                </div>
              </div>

              {/* Layers */}
              <div className="section">
                <div className="section-title">
                  <span>Layers ({stateLayers.length}) — {selState?.name ?? "—"}</span>
                  <button className="btn btn-sm" onClick={addLayer}>+ Layer</button>
                </div>
                {stateLayers.length === 0 && <div className="p-4 text-dim text-xs">Add a layer, then paint sprites into the grid.</div>}
                {[...stateLayers].reverse().map((l) => (
                  <div key={l.id} className={`object-layer-row ${activeLayerId === l.id ? "selected" : ""}`} onClick={() => setActiveLayerId(l.id)}>
                    <input
                      type="checkbox"
                      checked={l.visible}
                      title="Visible"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setStateLayers(stateLayers.map((x) => (x.id === l.id ? { ...x, visible: e.target.checked } : x)))}
                    />
                    <input
                      type="text"
                      className="input input-full"
                      value={l.name}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setStateLayers(stateLayers.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)))}
                    />
                    <span className="text-xs text-dim">{l.cells.length}</span>
                    <button className="btn btn-sm" title="Move up (toward front)" onClick={(e) => { e.stopPropagation(); moveLayer(l.id, 1); }}><Icon name="up" size={12} /></button>
                    <button className="btn btn-sm" title="Move down (toward back)" onClick={(e) => { e.stopPropagation(); moveLayer(l.id, -1); }}><Icon name="down" size={12} /></button>
                    <button className="btn btn-sm danger" title="Remove layer" onClick={(e) => { e.stopPropagation(); removeLayer(l.id); }}><Icon name="delete" size={12} /></button>
                  </div>
                ))}
              </div>

              {/* Cells in the active layer — flip/rotate to reuse existing art */}
              <div className="section">
                <div className="section-title">Cells ({activeCells.length})</div>
                {activeCells.length === 0 && <div className="text-xs text-dim" style={{ padding: "0 4px" }}>Paint sprites/animations, then flip or rotate them here.</div>}
                {activeCells.map((c) => {
                  const name = c.source.kind === "sprite" ? (spriteById.get(c.source.spriteId)?.name ?? "?") : (animById.get(c.source.animationId)?.name ?? "?");
                  return (
                    <div className="field-row" key={c.id}>
                      <span className="text-xs text-dim" style={{ minWidth: 34 }}>{c.col},{c.row}</span>
                      <span className="text-xs" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                      <button className={`btn btn-sm ${c.flipX ? "active" : ""}`} title="Flip horizontal (mirror)" onClick={() => updateCell(c.id, { flipX: !c.flipX })}>⇋</button>
                      <button className={`btn btn-sm ${c.flipY ? "active" : ""}`} title="Flip vertical" onClick={() => updateCell(c.id, { flipY: !c.flipY })}>⇅</button>
                      <button className="btn btn-sm" title="Rotate 90°" onClick={() => updateCell(c.id, { rotation: ((c.rotation ?? 0) + 90) % 360 })}>{(c.rotation ?? 0)}°</button>
                    </div>
                  );
                })}
              </div>

              {/* Palette */}
              <div className="section">
                <div className="section-title">
                  <span>Palette</span>
                  <div className="row" style={{ gap: 4 }}>
                    <button className={`btn btn-sm ${paletteKind === "sprite" ? "active" : ""}`} onClick={() => setPaletteKind("sprite")}>Sprites</button>
                    <button className={`btn btn-sm ${paletteKind === "animation" ? "active" : ""}`} onClick={() => setPaletteKind("animation")}>Anims</button>
                  </div>
                </div>
                {!activeLayerId && <div className="text-xs text-dim" style={{ padding: "0 4px" }}>Select a layer to paint into.</div>}
                <div className="sprite-list" style={{ maxHeight: 150 }}>
                  <div className="asset-grid">
                    {palette.length === 0 && <div className="p-4 text-dim text-xs">No {paletteKind}s in the project.</div>}
                    {palette.map((item) => {
                      const isSprite = paletteKind === "sprite";
                      const a = isSprite ? null : (item as AnimationDef);
                      const active = brush?.kind === paletteKind && brush.id === item.id;
                      return (
                        <div key={item.id} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                          <div
                            className={`asset-thumb ${active ? "selected" : ""}`}
                            title={item.name}
                            onClick={() => { setBrush({ kind: paletteKind, id: item.id }); setTool("paint"); }}
                          >
                            <AnimatedSpritePreview
                              frames={isSprite ? [item.id] : a!.frames}
                              duration={isSprite ? 0 : a!.duration}
                              spriteById={spriteById}
                              imageMap={imageMap}
                            />
                          </div>
                          <span className="text-xs text-dim" style={ELLIPSIS}>{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Collisions — per state, inheriting the idle/initial state */}
              <div className="section">
                <div className="section-title">
                  <span>Collisions — {selState?.name ?? "—"}{collisionsInherited ? " (inherits idle)" : ""}</span>
                  {!isIdleState && (
                    collisionsInherited ? (
                      <button className="btn btn-sm" title="Copy idle collisions to edit them just for this state" onClick={() => setStateCollisions(effectiveCollisions.map((c) => ({ ...c, id: uid("col") })))}>Override</button>
                    ) : (
                      <button className="btn btn-sm" title="Discard this state's collisions and inherit idle" onClick={resetStateCollisions}>Reset to idle</button>
                    )
                  )}
                </div>
                {collisionsInherited && (
                  <div className="text-xs text-dim" style={{ padding: "0 4px 4px" }}>
                    This state uses the idle collisions. Click Override to change them here.
                  </div>
                )}
                <CollisionEditor
                  key={selectedStateId ?? "none"}
                  width={objectPixelSize(selected.grid).width}
                  height={objectPixelSize(selected.grid).height}
                  collisions={effectiveCollisions}
                  layers={state.collisionLayers}
                  onChange={setStateCollisions}
                  dispatch={dispatch}
                  drawBackdrop={(ctx, scale) =>
                    drawObjectLayers(ctx, stateLayers, selected.grid.cell, spriteById, animById, imageMap, scale, () => 1)
                  }
                />
              </div>

              {/* Selected state */}
              <div className="section">
                <div className="section-title">
                  <span>State: {selState?.name ?? "—"}</span>
                  <button className="btn btn-sm" onClick={() => addStateAt(60, 60)}>+ State</button>
                </div>
                {selState && machine ? (
                  <StateEditor
                    object={selected}
                    machine={machine}
                    selState={selState}
                    setMachine={setMachine}
                    setSelectedStateId={setSelectedStateId}
                  />
                ) : (
                  <div className="p-4 text-dim text-xs">Select a state chip above to configure it.</div>
                )}
              </div>

              {/* Custom properties */}
              <div className="section">
                <div className="section-title">Custom Properties ({Object.keys(selected.properties).length})</div>
                {Object.entries(selected.properties).map(([key, val]) => (
                  <div key={key} className="field-row">
                    <span className="field-label" style={{ minWidth: 70 }}>{key}:</span>
                    <input type="text" className="input input-full" value={val} onChange={(e) => updateSelected({ properties: { ...selected.properties, [key]: e.target.value } })} />
                    <button className="btn btn-sm danger" title="Remove property" style={{ padding: "0 3px", minHeight: 14 }} onClick={() => { const props = { ...selected.properties }; delete props[key]; updateSelected({ properties: props }); }}><Icon name="close" size={11} /></button>
                  </div>
                ))}
                <div className="field-row mt-4">
                  <input type="text" className="input input-sm" placeholder="key" value={newPropKey} onChange={(e) => setNewPropKey(e.target.value)} />
                  <input type="text" className="input input-md" placeholder="value" value={newPropVal} onChange={(e) => setNewPropVal(e.target.value)} />
                  <button
                    className="btn btn-sm"
                    disabled={!newPropKey.trim()}
                    onClick={() => {
                      const k = newPropKey.trim();
                      if (!k) return;
                      updateSelected({ properties: { ...selected.properties, [k]: newPropVal } });
                      setNewPropKey("");
                      setNewPropVal("");
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
      {jsonView !== null && selected && (
        <div className="json-modal-overlay" onClick={() => setJsonView(null)}>
          <div className="json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="section-title">
              <span>{selected.name}.object.json</span>
              <div className="row" style={{ gap: 4 }}>
                <button className="btn btn-sm" onClick={() => navigator.clipboard.writeText(jsonView)}>Copy</button>
                <button className="btn btn-sm" onClick={() => downloadObject(exportObject(state, selected))}>Download</button>
                <button className="btn btn-sm" onClick={() => setJsonView(null)}>Close</button>
              </div>
            </div>
            <textarea className="input json-modal-text" readOnly value={jsonView} onFocus={(e) => e.currentTarget.select()} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Interactive grid composition canvas. */
function ObjectCanvas({
  grid,
  layers,
  activeLayerId,
  spriteById,
  animById,
  imageMap,
  onCell,
}: {
  grid: GameObjectDef["grid"];
  layers: ObjectLayer[];
  activeLayerId: string | null;
  spriteById: Map<string, SpriteRegion>;
  animById: Map<string, AnimationDef>;
  imageMap: Map<string, HTMLImageElement>;
  onCell: (col: number, row: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downRef = useRef(false);
  const { width, height } = objectPixelSize(grid);
  const scale = Math.max(1, Math.floor(360 / Math.max(width, height, 1)));
  const cell = grid.cell;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dw = width * scale;
    const dh = height * scale;
    canvas.width = dw;
    canvas.height = dh;
    canvas.style.width = `${dw}px`;
    canvas.style.height = `${dh}px`;
    ctx.clearRect(0, 0, dw, dh);

    drawObjectLayers(ctx, layers, cell, spriteById, animById, imageMap, scale, (id) =>
      id === activeLayerId ? 1 : 0.85,
    );

    // Grid lines.
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    for (let c = 0; c <= grid.cols; c++) {
      const x = Math.round(c * cell * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dh);
      ctx.stroke();
    }
    for (let r = 0; r <= grid.rows; r++) {
      const y = Math.round(r * cell * scale) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dw, y);
      ctx.stroke();
    }
  }, [layers, cell, activeLayerId, spriteById, animById, imageMap, scale, grid.cols, grid.rows, width, height]);

  const cellAt = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): { col: number; row: number } | null => {
      const rect = e.currentTarget.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / (cell * scale));
      const row = Math.floor((e.clientY - rect.top) / (cell * scale));
      if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return null;
      return { col, row };
    },
    [cell, scale, grid.cols, grid.rows],
  );

  return (
    <div className="preview-box collision-canvas-box" style={{ alignSelf: "flex-start" }}>
      <canvas
        ref={canvasRef}
        className="collision-canvas"
        onPointerDown={(e) => {
          const c = cellAt(e);
          if (!c) return;
          downRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          onCell(c.col, c.row);
        }}
        onPointerMove={(e) => {
          if (!downRef.current) return;
          const c = cellAt(e);
          if (c) onCell(c.col, c.row);
        }}
        onPointerUp={(e) => {
          downRef.current = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }}
      />
    </div>
  );
}

/** Per-state editor: initial flag, layer visibility, collision overrides, transitions. */
function StateEditor({
  object,
  machine,
  selState,
  setMachine,
  setSelectedStateId,
}: {
  object: GameObjectDef;
  machine: StateMachineDef;
  selState: StateNodeDef;
  setMachine: (m: StateMachineDef) => void;
  setSelectedStateId: (id: string | null) => void;
}) {
  const isInitial = machine.initialStateId === selState.id;

  return (
    <div className="col gap-sm" style={{ padding: 4 }}>
      <div className="field-row">
        <span className="field-label">Name:</span>
        <input type="text" className="input input-full" value={selState.name} onChange={(e) => setMachine(smUpdateState(machine, selState.id, { name: e.target.value }))} />
        <button className={`btn btn-sm ${isInitial ? "active" : ""}`} title="The state the engine starts in" onClick={() => setMachine({ ...machine, initialStateId: selState.id })}>
          {isInitial ? <><Icon name="check" size={11} /> Initial</> : "Set initial"}
        </button>
      </div>

      <div className="text-xs text-dim" style={{ marginTop: 4 }}>
        States carry no conditions — your Entity code decides when to switch.
      </div>

      <button className="btn btn-sm danger" onClick={() => { setMachine(smRemoveState(machine, selState.id)); setSelectedStateId(null); }}>
        Delete State
      </button>
    </div>
  );
}
