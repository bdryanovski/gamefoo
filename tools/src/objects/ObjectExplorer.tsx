import React, { useState, useCallback, useMemo, useEffect } from "react";
import type {
  AppState,
  AppAction,
  GameObjectDef,
  SpriteRegion,
  AnimationDef,
} from "../types";
import { makeObject } from "../types";
import type { StateMachineDef, StateNodeDef } from "../statemachine/types";
import {
  makeState,
  smAddState,
  smUpdateState,
  smRemoveState,
  smAddTransition,
  smRemoveTransition,
} from "../statemachine/types";
import { StateMachineCanvas } from "../statemachine/StateMachineCanvas";
import { AnimatedSpritePreview } from "../components/AnimatedSpritePreview";
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

type Frames = { frames: string[]; duration: number };

/** What an object shows by default: its machine's initial state, else a
 *  first sprite/animation fallback. Used for list + header previews. */
function objectPreviewFrames(
  o: GameObjectDef,
  animById: Map<string, AnimationDef>,
): Frames {
  const m = o.machine;
  const initial =
    m.states.find((s) => s.id === m.initialStateId) ?? m.states[0] ?? null;
  if (initial) {
    if (initial.display.kind === "sprite" && initial.display.spriteId) {
      return { frames: [initial.display.spriteId], duration: 0 };
    }
    if (initial.display.kind === "animation" && initial.display.animationId) {
      const a = animById.get(initial.display.animationId);
      if (a && a.frames.length > 0) return { frames: a.frames, duration: a.duration };
    }
  }
  if (o.sprites[0]) return { frames: [o.sprites[0]], duration: 0 };
  const a = o.animations[0] ? animById.get(o.animations[0]) : undefined;
  if (a && a.frames.length > 0) return { frames: a.frames, duration: a.duration };
  return { frames: [], duration: 0 };
}

const ELLIPSIS: React.CSSProperties = {
  maxWidth: 48,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function ObjectExplorer({
  state,
  dispatch,
  imageMap,
  projectId,
  saving,
  onSave,
  onOpenProjects,
}: Props) {
  const selected =
    state.objects.find((o) => o.id === state.selectedObjectId) ?? null;

  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [pickSprite, setPickSprite] = useState(false);
  const [pickAnim, setPickAnim] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");
  const [transCond, setTransCond] = useState("");
  const [transTarget, setTransTarget] = useState("");

  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const animById = useMemo(
    () => new Map(state.animations.map((a) => [a.id, a])),
    [state.animations],
  );

  // Reset transient selection when the active object changes.
  useEffect(() => {
    setSelectedStateId(
      selected
        ? (selected.machine.states.find((s) => s.id === selected.machine.initialStateId)?.id ??
          selected.machine.states[0]?.id ??
          null)
        : null,
    );
    setPickSprite(false);
    setPickAnim(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedObjectId]);

  const updateSelected = useCallback(
    (updates: Partial<GameObjectDef>) => {
      if (!selected) return;
      dispatch({ type: "UPDATE_OBJECT", id: selected.id, updates });
    },
    [selected, dispatch],
  );

  const setMachine = useCallback(
    (m: StateMachineDef) => updateSelected({ machine: m }),
    [updateSelected],
  );
  const updateMeta = useCallback(
    (patch: Partial<GameObjectDef["meta"]>) => {
      if (!selected) return;
      updateSelected({ meta: { ...selected.meta, ...patch } });
    },
    [selected, updateSelected],
  );

  const createObject = useCallback(() => {
    const obj = makeObject(`object_${state.objects.length}`);
    dispatch({ type: "ADD_OBJECT", object: obj });
    dispatch({ type: "SELECT_OBJECT", id: obj.id });
  }, [state.objects.length, dispatch]);

  const machine = selected?.machine ?? null;
  const selState =
    machine?.states.find((s) => s.id === selectedStateId) ?? null;

  const addStateAt = useCallback(
    (x: number, y: number) => {
      if (!machine) return;
      const st = makeState(`state_${machine.states.length}`, x, y);
      setMachine(smAddState(machine, st));
      setSelectedStateId(st.id);
    },
    [machine, setMachine],
  );

  // Delete key removes the selected machine state.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      if (!machine || !selState) return;
      e.preventDefault();
      setMachine(smRemoveState(machine, selState.id));
      setSelectedStateId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [machine, selState, setMachine]);

  const availableSprites = selected
    ? state.sprites.filter((s) => !selected.sprites.includes(s.id))
    : [];
  const availableAnims = selected
    ? state.animations.filter((a) => !selected.animations.includes(a.id))
    : [];

  const headerPreview = selected
    ? objectPreviewFrames(selected, animById)
    : { frames: [], duration: 0 };

  return (
    <div className="app-layout">
      <div className="title-bar">
        <span className="title-bar__name">
          GameFoo Object Explorer — {state.projectName}
          {projectId ? "" : " (unsaved)"}
        </span>
        <button className="btn btn-sm title-btn" onClick={onOpenProjects}>
          Projects
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.history.length === 0}
          title="Undo — Ctrl/Cmd+Z"
        >
          ↶ Undo{state.history.length > 0 ? ` (${state.history.length})` : ""}
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave("quick")}
          disabled={saving}
          title="QuickSave — Ctrl/Cmd+S"
        >
          QuickSave
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave("save")}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="main-area">
        {/* Left: object list with previews */}
        <div
          className="right-panel"
          style={{ borderRight: "1px solid var(--border-dark)" }}
        >
          <div className="panel-content">
            <div className="section">
              <div className="section-title">
                <span>Objects ({state.objects.length})</span>
                <button className="btn btn-sm" onClick={createObject}>
                  + New
                </button>
              </div>
              {state.objects.length === 0 && (
                <div className="p-4 text-dim text-xs">
                  No objects yet. Each object bundles sprites, animations and a
                  state machine that switches between them.
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
                    <div
                      className="asset-thumb"
                      style={{ width: 28, height: 28, cursor: "pointer" }}
                    >
                      <AnimatedSpritePreview
                        frames={pv.frames}
                        duration={pv.duration}
                        spriteById={spriteById}
                        imageMap={imageMap}
                        size={26}
                      />
                    </div>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {o.name}
                    </span>
                    {o.meta.category && (
                      <span className="text-xs text-dim">{o.meta.category}</span>
                    )}
                    <span className="text-xs text-dim">
                      {o.sprites.length}s {o.animations.length}a{" "}
                      {o.machine.states.length}·
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: embedded state machine graph */}
        {selected ? (
          <StateMachineCanvas
            machine={selected.machine}
            sprites={state.sprites}
            animations={state.animations}
            imageMap={imageMap}
            selectedStateId={selectedStateId}
            onSelectState={setSelectedStateId}
            onCommitStatePos={(id, x, y) =>
              setMachine(smUpdateState(selected.machine, id, { x, y }))
            }
            onAddStateAt={addStateAt}
          />
        ) : (
          <div className="main-area" style={{ alignItems: "center", justifyContent: "center" }}>
            <div className="text-dim text-xs">
              Select an object on the left, or create one with “+ New”.
            </div>
          </div>
        )}

        {/* Right: object configuration */}
        {selected && (
          <div className="right-panel">
            <div className="panel-content">
              {/* Header + preview */}
              <div className="section">
                <div className="section-title">
                  <span>Edit: {selected.name}</span>
                  <button
                    className="btn btn-sm danger"
                    onClick={() =>
                      dispatch({ type: "DELETE_OBJECT", id: selected.id })
                    }
                  >
                    Delete
                  </button>
                </div>
                <div className="row" style={{ gap: 8, alignItems: "center", padding: 4 }}>
                  <div className="asset-thumb" style={{ width: 56, height: 56, cursor: "default" }}>
                    <AnimatedSpritePreview
                      frames={headerPreview.frames}
                      duration={headerPreview.duration}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      size={54}
                    />
                  </div>
                  <div className="col text-xs text-dim" style={{ gap: 2 }}>
                    <span>{selected.sprites.length} sprites · {selected.animations.length} anims</span>
                    <span>{selected.machine.states.length} states · {selected.machine.transitions.length} transitions</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="section">
                <div className="section-title">Metadata</div>
                <div className="field-row">
                  <span className="field-label">Name:</span>
                  <input
                    type="text"
                    className="input input-full"
                    value={selected.name}
                    onChange={(e) => updateSelected({ name: e.target.value })}
                  />
                </div>
                <div className="field-row">
                  <span className="field-label">Category:</span>
                  <input
                    type="text"
                    className="input input-full"
                    placeholder="e.g. enemy, prop, pickup"
                    value={selected.meta.category}
                    onChange={(e) => updateMeta({ category: e.target.value })}
                  />
                </div>
                <div className="field-row" style={{ alignItems: "flex-start" }}>
                  <span className="field-label">Notes:</span>
                  <textarea
                    className="input input-full"
                    rows={2}
                    placeholder="Description / notes"
                    value={selected.meta.description}
                    onChange={(e) => updateMeta({ description: e.target.value })}
                  />
                </div>
                <div className="field-row" style={{ alignItems: "flex-start" }}>
                  <span className="field-label">Tags:</span>
                  <div className="col" style={{ flex: 1, gap: 4 }}>
                    <div className="row" style={{ flexWrap: "wrap", gap: 4 }}>
                      {selected.meta.tags.length === 0 && (
                        <span className="text-xs text-dim">none</span>
                      )}
                      {selected.meta.tags.map((t) => (
                        <span
                          key={t}
                          className="btn btn-sm"
                          style={{ display: "inline-flex", gap: 4, cursor: "default" }}
                        >
                          {t}
                          <button
                            className="btn btn-sm danger"
                            style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
                            onClick={() =>
                              updateMeta({ tags: selected.meta.tags.filter((x) => x !== t) })
                            }
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="row" style={{ gap: 4 }}>
                      <input
                        type="text"
                        className="input input-md"
                        placeholder="add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          const t = newTag.trim();
                          if (e.key === "Enter" && t && !selected.meta.tags.includes(t)) {
                            updateMeta({ tags: [...selected.meta.tags, t] });
                            setNewTag("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sprites */}
              <div className="section">
                <div className="section-title">
                  <span>Sprites ({selected.sprites.length})</span>
                  <button
                    className="btn btn-sm"
                    onClick={() => { setPickSprite((v) => !v); setPickAnim(false); }}
                    disabled={availableSprites.length === 0}
                  >
                    {pickSprite ? "Close" : "+ Add"}
                  </button>
                </div>
                {selected.sprites.length === 0 && !pickSprite && (
                  <div className="p-4 text-dim text-xs">No sprites attached.</div>
                )}
                <div className="asset-grid">
                  {selected.sprites.map((sid) => {
                    const s = spriteById.get(sid);
                    return (
                      <div key={sid} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                        <div className="asset-thumb" style={{ cursor: "default" }}>
                          <AnimatedSpritePreview
                            frames={[sid]}
                            duration={0}
                            spriteById={spriteById}
                            imageMap={imageMap}
                          />
                        </div>
                        <button
                          className="btn btn-sm danger"
                          style={{ padding: "0 4px", minHeight: 14, fontSize: 8, maxWidth: 48 }}
                          title={`Remove ${s?.name ?? sid}`}
                          onClick={() =>
                            updateSelected({ sprites: selected.sprites.filter((id) => id !== sid) })
                          }
                        >
                          ✕ {s?.name ?? sid}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {pickSprite && (
                  <div className="sprite-list" style={{ maxHeight: 160, marginTop: 4 }}>
                    <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                      Pick a sprite to attach:
                    </div>
                    <div className="asset-grid">
                      {availableSprites.map((s) => (
                        <div key={s.id} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                          <div
                            className="asset-thumb"
                            title={`${s.name} (${s.width}×${s.height})`}
                            onClick={() => {
                              updateSelected({ sprites: [...selected.sprites, s.id] });
                              if (availableSprites.length <= 1) setPickSprite(false);
                            }}
                          >
                            <AnimatedSpritePreview
                              frames={[s.id]}
                              duration={0}
                              spriteById={spriteById}
                              imageMap={imageMap}
                            />
                          </div>
                          <span className="text-xs text-dim" style={ELLIPSIS}>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Animations */}
              <div className="section">
                <div className="section-title">
                  <span>Animations ({selected.animations.length})</span>
                  <button
                    className="btn btn-sm"
                    onClick={() => { setPickAnim((v) => !v); setPickSprite(false); }}
                    disabled={availableAnims.length === 0}
                  >
                    {pickAnim ? "Close" : "+ Add"}
                  </button>
                </div>
                {selected.animations.length === 0 && !pickAnim && (
                  <div className="p-4 text-dim text-xs">No animations attached.</div>
                )}
                <div className="asset-grid">
                  {selected.animations.map((aid) => {
                    const a = animById.get(aid);
                    return (
                      <div key={aid} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                        <div className="asset-thumb" style={{ cursor: "default", position: "relative" }}>
                          <AnimatedSpritePreview
                            frames={a?.frames ?? []}
                            duration={a?.duration ?? 0.12}
                            spriteById={spriteById}
                            imageMap={imageMap}
                          />
                          <span style={{ position: "absolute", top: 1, right: 3, fontSize: 9, color: "#00ff66" }}>▶</span>
                        </div>
                        <button
                          className="btn btn-sm danger"
                          style={{ padding: "0 4px", minHeight: 14, fontSize: 8, maxWidth: 48 }}
                          title={`Remove ${a?.name ?? aid}`}
                          onClick={() =>
                            updateSelected({ animations: selected.animations.filter((id) => id !== aid) })
                          }
                        >
                          ✕ {a?.name ?? aid}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {pickAnim && (
                  <div className="sprite-list" style={{ maxHeight: 160, marginTop: 4 }}>
                    <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                      Pick an animation to attach:
                    </div>
                    <div className="asset-grid">
                      {availableAnims.map((a) => (
                        <div key={a.id} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                          <div
                            className="asset-thumb"
                            title={`${a.name} (${a.frames.length} frames)`}
                            onClick={() => {
                              updateSelected({ animations: [...selected.animations, a.id] });
                              if (availableAnims.length <= 1) setPickAnim(false);
                            }}
                          >
                            <AnimatedSpritePreview
                              frames={a.frames}
                              duration={a.duration}
                              spriteById={spriteById}
                              imageMap={imageMap}
                            />
                          </div>
                          <span className="text-xs text-dim" style={ELLIPSIS}>{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected state (switcher) */}
              <div className="section">
                <div className="section-title">
                  <span>State Machine ({machine?.states.length ?? 0})</span>
                  <button className="btn btn-sm" onClick={() => addStateAt(60, 60)}>
                    + State
                  </button>
                </div>
                <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                  Double-click the canvas to add a state · drag to move · Delete
                  removes the selected state.
                </div>
                {selState && machine ? (
                  <StateEditor
                    machine={machine}
                    selState={selState}
                    object={selected}
                    spriteById={spriteById}
                    animById={animById}
                    imageMap={imageMap}
                    setMachine={setMachine}
                    setSelectedStateId={setSelectedStateId}
                    transCond={transCond}
                    setTransCond={setTransCond}
                    transTarget={transTarget}
                    setTransTarget={setTransTarget}
                  />
                ) : (
                  <div className="p-4 text-dim text-xs">
                    Select a state in the graph to configure what it displays and
                    its transitions.
                  </div>
                )}
              </div>

              {/* Custom properties */}
              <div className="section">
                <div className="section-title">
                  Custom Properties ({Object.keys(selected.properties).length})
                </div>
                {Object.entries(selected.properties).map(([key, val]) => (
                  <div key={key} className="field-row">
                    <span className="field-label" style={{ minWidth: 70 }}>{key}:</span>
                    <input
                      type="text"
                      className="input input-full"
                      value={val}
                      onChange={(e) =>
                        updateSelected({
                          properties: { ...selected.properties, [key]: e.target.value },
                        })
                      }
                    />
                    <button
                      className="btn btn-sm danger"
                      style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
                      onClick={() => {
                        const props = { ...selected.properties };
                        delete props[key];
                        updateSelected({ properties: props });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="field-row mt-4">
                  <input
                    type="text"
                    className="input input-sm"
                    placeholder="key"
                    value={newPropKey}
                    onChange={(e) => setNewPropKey(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input input-md"
                    placeholder="value"
                    value={newPropVal}
                    onChange={(e) => setNewPropVal(e.target.value)}
                  />
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
        )}
      </div>
    </div>
  );
}

/** Editor for the selected machine state: its display (chosen from the
 *  object's sprites/animations) and its outgoing transitions. */
function StateEditor({
  machine,
  selState,
  object,
  spriteById,
  animById,
  imageMap,
  setMachine,
  setSelectedStateId,
  transCond,
  setTransCond,
  transTarget,
  setTransTarget,
}: {
  machine: StateMachineDef;
  selState: StateNodeDef;
  object: GameObjectDef;
  spriteById: Map<string, SpriteRegion>;
  animById: Map<string, AnimationDef>;
  imageMap: Map<string, HTMLImageElement>;
  setMachine: (m: StateMachineDef) => void;
  setSelectedStateId: (id: string | null) => void;
  transCond: string;
  setTransCond: (v: string) => void;
  transTarget: string;
  setTransTarget: (v: string) => void;
}) {
  const isInitial = machine.initialStateId === selState.id;
  const outgoing = machine.transitions.filter((t) => t.fromStateId === selState.id);
  const otherStates = machine.states.filter((s) => s.id !== selState.id);
  const kind = selState.display.kind;
  const currentId =
    selState.display.kind === "sprite"
      ? selState.display.spriteId
      : selState.display.animationId;

  return (
    <div className="col gap-sm" style={{ padding: 4 }}>
      <div className="field-row">
        <span className="field-label">State:</span>
        <input
          type="text"
          className="input input-full"
          value={selState.name}
          onChange={(e) =>
            setMachine(smUpdateState(machine, selState.id, { name: e.target.value }))
          }
        />
        <button
          className={`btn btn-sm ${isInitial ? "active" : ""}`}
          title="Set as the machine's initial state"
          onClick={() =>
            setMachine({ ...machine, initialStateId: selState.id })
          }
        >
          {isInitial ? "Initial ✓" : "Set initial"}
        </button>
      </div>

      <div className="field-row">
        <span className="field-label">Shows:</span>
        <button
          className={`btn btn-sm ${kind === "sprite" ? "active" : ""}`}
          onClick={() =>
            setMachine(
              smUpdateState(machine, selState.id, {
                display: { kind: "sprite", spriteId: null },
              }),
            )
          }
        >
          Sprite
        </button>
        <button
          className={`btn btn-sm ${kind === "animation" ? "active" : ""}`}
          onClick={() =>
            setMachine(
              smUpdateState(machine, selState.id, {
                display: { kind: "animation", animationId: null },
              }),
            )
          }
        >
          Animation
        </button>
      </div>

      {/* Choose the sprite/animation from the object's attached assets */}
      <div className="asset-grid">
        {kind === "sprite" &&
          object.sprites.map((sid) => {
            const s = spriteById.get(sid);
            return (
              <div key={sid} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                <div
                  className={`asset-thumb ${currentId === sid ? "selected" : ""}`}
                  title={s?.name ?? sid}
                  onClick={() =>
                    setMachine(
                      smUpdateState(machine, selState.id, {
                        display: { kind: "sprite", spriteId: sid },
                      }),
                    )
                  }
                >
                  <AnimatedSpritePreview
                    frames={[sid]}
                    duration={0}
                    spriteById={spriteById}
                    imageMap={imageMap}
                  />
                </div>
                <span className="text-xs text-dim" style={ELLIPSIS}>{s?.name ?? sid}</span>
              </div>
            );
          })}
        {kind === "animation" &&
          object.animations.map((aid) => {
            const a = animById.get(aid);
            return (
              <div key={aid} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                <div
                  className={`asset-thumb ${currentId === aid ? "selected" : ""}`}
                  title={a?.name ?? aid}
                  onClick={() =>
                    setMachine(
                      smUpdateState(machine, selState.id, {
                        display: { kind: "animation", animationId: aid },
                      }),
                    )
                  }
                >
                  <AnimatedSpritePreview
                    frames={a?.frames ?? []}
                    duration={a?.duration ?? 0.12}
                    spriteById={spriteById}
                    imageMap={imageMap}
                  />
                </div>
                <span className="text-xs text-dim" style={ELLIPSIS}>{a?.name ?? aid}</span>
              </div>
            );
          })}
      </div>
      {((kind === "sprite" && object.sprites.length === 0) ||
        (kind === "animation" && object.animations.length === 0)) && (
          <div className="text-xs text-dim" style={{ padding: "0 4px" }}>
            Attach {kind === "sprite" ? "sprites" : "animations"} above, then pick one here.
          </div>
        )}

      {/* Transitions */}
      <div className="section-title" style={{ marginTop: 4 }}>
        Transitions ({outgoing.length})
      </div>
      {outgoing.map((t) => {
        const target = machine.states.find((s) => s.id === t.toStateId);
        return (
          <div key={t.id} className="field-row">
            <span className="text-xs" style={{ flex: 1 }}>
              on <b>{t.condition || "?"}</b> → {target?.name ?? "?"}
            </span>
            <button
              className="btn btn-sm danger"
              style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
              onClick={() => setMachine(smRemoveTransition(machine, t.id))}
            >
              ✕
            </button>
          </div>
        );
      })}
      <div className="field-row">
        <input
          type="text"
          className="input input-sm"
          placeholder="condition"
          value={transCond}
          onChange={(e) => setTransCond(e.target.value)}
        />
        <select
          className="input input-md"
          value={transTarget}
          onChange={(e) => setTransTarget(e.target.value)}
        >
          <option value="">→ target…</option>
          {otherStates.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          className="btn btn-sm"
          disabled={!transCond.trim() || !transTarget}
          onClick={() => {
            if (!transCond.trim() || !transTarget) return;
            setMachine(
              smAddTransition(machine, {
                id: uid("tr"),
                fromStateId: selState.id,
                toStateId: transTarget,
                condition: transCond.trim(),
              }),
            );
            setTransCond("");
            setTransTarget("");
          }}
        >
          + Transition
        </button>
      </div>

      <button
        className="btn btn-sm danger"
        onClick={() => {
          setMachine(smRemoveState(machine, selState.id));
          setSelectedStateId(null);
        }}
      >
        Delete State
      </button>
    </div>
  );
}
