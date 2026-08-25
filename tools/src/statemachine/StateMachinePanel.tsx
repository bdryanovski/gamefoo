import React, { useMemo, useState, useCallback } from "react";
import type { AppState, SpriteRegion } from "../types";
import type { SMAction, StateMachineDef, StateNodeDef } from "./types";
import { makeState, makeStateMachine } from "./types";
import { uid } from "../utils/uid";
import { downloadStateMachinesExport } from "./smExport";

interface Props {
  state: AppState;
  imageMap: Map<string, HTMLImageElement>;
  smDispatch: (a: SMAction) => void;
  machine: StateMachineDef | null;
  selectedState: StateNodeDef | null;
}

const THUMB = 36;
const NODE_SPACING_X = 180;
const NODE_SPACING_Y = 130;

function SpritePickThumb({
  sprite,
  imageMap,
  selected,
  onClick,
}: {
  sprite: SpriteRegion;
  imageMap: Map<string, HTMLImageElement>;
  selected: boolean;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imageMap.get(sprite.imageId);
    canvas.width = THUMB;
    canvas.height = THUMB;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, THUMB, THUMB);
    if (!img || !img.complete) return;
    const scale = Math.min(THUMB / sprite.width, THUMB / sprite.height);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    ctx.drawImage(
      img,
      sprite.x, sprite.y, sprite.width, sprite.height,
      (THUMB - dw) / 2, (THUMB - dh) / 2, dw, dh,
    );
  }, [sprite, imageMap]);

  return (
    <div
      className={`asset-thumb ${selected ? "selected" : ""}`}
      title={`${sprite.name} (${sprite.width}×${sprite.height})`}
      onClick={onClick}
    >
      <canvas ref={ref} />
    </div>
  );
}

export function StateMachinePanel({
  state,
  imageMap,
  smDispatch,
  machine,
  selectedState,
}: Props) {
  const sm = state.stateMachines;
  const [newCondition, setNewCondition] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const animById = useMemo(
    () => new Map(state.animations.map((a) => [a.id, a])),
    [state.animations],
  );
  const imageNames = useMemo(
    () => new Map(state.images.map((i) => [i.id, i.name])),
    [state.images],
  );

  // Sprite palette grouped by group / source image
  const groups = useMemo(() => {
    const g = new Map<string, SpriteRegion[]>();
    for (const s of [...state.sprites].sort((a, b) => a.order - b.order)) {
      const key = s.group || imageNames.get(s.imageId) || "ungrouped";
      const list = g.get(key) ?? [];
      list.push(s);
      g.set(key, list);
    }
    return Array.from(g.entries());
  }, [state.sprites, imageNames]);

  const addMachine = useCallback(() => {
    const m = makeStateMachine(`sm_${sm.machines.length}`);
    smDispatch({ type: "ADD_MACHINE", machine: m });
  }, [sm.machines.length, smDispatch]);

  const addStateDefault = useCallback(() => {
    if (!machine) return;
    const n = machine.states.length;
    const st = makeState(
      `state_${n}`,
      80 + (n % 5) * (NODE_SPACING_X),
      80 + Math.floor(n / 5) * (NODE_SPACING_Y),
    );
    smDispatch({ type: "ADD_STATE", machineId: machine.id, state: st });
  }, [machine, smDispatch]);

  const outgoing = useMemo(
    () =>
      machine && selectedState
        ? machine.transitions.filter(
            (t) => t.fromStateId === selectedState.id,
          )
        : [],
    [machine, selectedState],
  );
  const incoming = useMemo(
    () =>
      machine && selectedState
        ? machine.transitions.filter((t) => t.toStateId === selectedState.id)
        : [],
    [machine, selectedState],
  );

  const stateName = (id: string) =>
    machine?.states.find((s) => s.id === id)?.name ?? "?";

  const addTransition = useCallback(() => {
    if (!machine || !selectedState || !newTarget) return;
    smDispatch({
      type: "ADD_TRANSITION",
      machineId: machine.id,
      transition: {
        id: uid("tr"),
        fromStateId: selectedState.id,
        toStateId: newTarget,
        condition: newCondition.trim() || "condition",
      },
    });
    setNewCondition("");
    setNewTarget("");
  }, [machine, selectedState, newTarget, newCondition, smDispatch]);

  return (
    <div className="col gap-md">
      {/* Machine list */}
      <div className="section">
        <div className="section-title">
          <span>Machines ({sm.machines.length})</span>
          <button className="btn btn-sm" onClick={addMachine}>
            + New
          </button>
        </div>
        {sm.machines.length === 0 && (
          <div className="p-4 text-dim text-xs">
            No state machines. "+ New" creates one with an initial state.
          </div>
        )}
        <div className="sprite-list" style={{ maxHeight: 130 }}>
          {sm.machines.map((m) => (
            <div
              key={m.id}
              className={`anim-item ${sm.selectedMachineId === m.id ? "selected" : ""}`}
              onClick={() => smDispatch({ type: "SELECT_MACHINE", id: m.id })}
            >
              <span className="anim-item__name">{m.name}</span>
              <span className="anim-item__info">
                {m.states.length}st · {m.transitions.length}tr
              </span>
            </div>
          ))}
        </div>
        {sm.machines.length > 0 && (
          <div className="row gap-sm" style={{ padding: 4 }}>
            <button
              className="btn btn-sm"
              onClick={() => downloadStateMachinesExport(state)}
            >
              Export JSON
            </button>
          </div>
        )}
      </div>

      {machine && (
        <>
          {/* Machine properties */}
          <div className="section">
            <div className="section-title">
              <span>Machine</span>
              <button
                className="btn btn-sm danger"
                onClick={() => {
                  if (confirm(`Delete machine "${machine.name}"?`)) {
                    smDispatch({ type: "REMOVE_MACHINE", id: machine.id });
                  }
                }}
              >
                Del
              </button>
            </div>
            <div className="field-row">
              <span className="field-label">Name:</span>
              <input
                type="text"
                className="input input-full"
                value={machine.name}
                onChange={(e) =>
                  smDispatch({
                    type: "UPDATE_MACHINE",
                    id: machine.id,
                    updates: { name: e.target.value },
                  })
                }
              />
            </div>
            <div className="field-row">
              <span className="field-label">Initial:</span>
              <select
                className="input input-full"
                value={machine.initialStateId ?? ""}
                onChange={(e) =>
                  smDispatch({
                    type: "UPDATE_MACHINE",
                    id: machine.id,
                    updates: {
                      initialStateId: e.target.value || null,
                    },
                  })
                }
              >
                <option value="">— none —</option>
                {machine.states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="row gap-sm" style={{ padding: 4 }}>
              <button className="btn btn-sm" onClick={addStateDefault}>
                + State
              </button>
            </div>
          </div>

          {/* Selected state */}
          {selectedState && (
            <div className="section">
              <div className="section-title">
                <span>State: {selectedState.name}</span>
                <button
                  className="btn btn-sm danger"
                  title="Delete this state (Del)"
                  onClick={() =>
                    smDispatch({
                      type: "REMOVE_STATE",
                      machineId: machine.id,
                      id: selectedState.id,
                    })
                  }
                >
                  Del
                </button>
              </div>

              <div className="field-row">
                <span className="field-label">Name:</span>
                <input
                  type="text"
                  className="input input-full"
                  value={selectedState.name}
                  onChange={(e) =>
                    smDispatch({
                      type: "UPDATE_STATE",
                      machineId: machine.id,
                      id: selectedState.id,
                      updates: { name: e.target.value },
                    })
                  }
                />
              </div>

              <div className="field-row">
                <span className="field-label">Show:</span>
                <label className="checkbox-row">
                  <input
                    type="radio"
                    name="sm-display-kind"
                    checked={selectedState.display.kind === "sprite"}
                    onChange={() =>
                      smDispatch({
                        type: "UPDATE_STATE",
                        machineId: machine.id,
                        id: selectedState.id,
                        updates: {
                          display: { kind: "sprite", spriteId: null },
                        },
                      })
                    }
                  />
                  Sprite (static)
                </label>
                <label className="checkbox-row">
                  <input
                    type="radio"
                    name="sm-display-kind"
                    checked={selectedState.display.kind === "animation"}
                    onChange={() =>
                      smDispatch({
                        type: "UPDATE_STATE",
                        machineId: machine.id,
                        id: selectedState.id,
                        updates: {
                          display: { kind: "animation", animationId: null },
                        },
                      })
                    }
                  />
                  Animation
                </label>
              </div>

              {selectedState.display.kind === "sprite" && (
                <>
                  <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                    {selectedState.display.spriteId
                      ? `Sprite: ${spriteById.get(selectedState.display.spriteId)?.name ?? "?"}`
                      : "No sprite — pick one:"}
                  </div>
                  {groups.map(([group, sprites]) => (
                    <div key={group} style={{ padding: "2px 0" }}>
                      <div className="text-xs text-dim">{group}</div>
                      <div className="asset-grid">
                        {sprites.map((s) => (
                          <SpritePickThumb
                            key={s.id}
                            sprite={s}
                            imageMap={imageMap}
                            selected={selectedState.display.kind === "sprite" &&
                              selectedState.display.spriteId === s.id}
                            onClick={() =>
                              smDispatch({
                                type: "UPDATE_STATE",
                                machineId: machine.id,
                                id: selectedState.id,
                                updates: {
                                  display: {
                                    kind: "sprite",
                                    spriteId: s.id,
                                  },
                                },
                              })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  {state.sprites.length === 0 && (
                    <div className="text-xs text-dim" style={{ padding: 4 }}>
                      No sprites — cut some in the Sprite Editor first.
                    </div>
                  )}
                </>
              )}

              {selectedState.display.kind === "animation" && (
                <div className="field-row">
                  <span className="field-label">Anim:</span>
                  <select
                    className="input input-full"
                    value={selectedState.display.animationId ?? ""}
                    onChange={(e) =>
                      smDispatch({
                        type: "UPDATE_STATE",
                        machineId: machine.id,
                        id: selectedState.id,
                        updates: {
                          display: {
                            kind: "animation",
                            animationId: e.target.value || null,
                          },
                        },
                      })
                    }
                  >
                    <option value="">— none —</option>
                    {state.animations.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.frames.length}f, {a.duration}s
                        {a.loop ? ", loop" : ""})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Transitions */}
              <div className="mt-4">
                <div className="section-title">Transitions</div>

                {outgoing.length > 0 && (
                  <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                    Outgoing (trigger by condition):
                  </div>
                )}
                {outgoing.map((t) => (
                  <div key={t.id} className="field-row">
                    <span className="field-label">→ {stateName(t.toStateId)}</span>
                    <input
                      type="text"
                      className="input input-full"
                      placeholder="condition"
                      value={t.condition}
                      onChange={(e) =>
                        smDispatch({
                          type: "UPDATE_TRANSITION",
                          machineId: machine.id,
                          id: t.id,
                          updates: { condition: e.target.value },
                        })
                      }
                    />
                    <button
                      className="btn btn-sm danger"
                      onClick={() =>
                        smDispatch({
                          type: "REMOVE_TRANSITION",
                          machineId: machine.id,
                          id: t.id,
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {incoming.length > 0 && (
                  <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                    Incoming:
                  </div>
                )}
                {incoming.map((t) => (
                  <div key={t.id} className="field-row">
                    <span className="field-label">
                      ← {stateName(t.fromStateId)}
                    </span>
                    <span className="text-xs" style={{ flex: 1 }}>
                      {t.condition}
                    </span>
                    <button
                      className="btn btn-sm danger"
                      onClick={() =>
                        smDispatch({
                          type: "REMOVE_TRANSITION",
                          machineId: machine.id,
                          id: t.id,
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add transition */}
                <div className="field-row">
                  <select
                    className="input"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                  >
                    <option value="">to…</option>
                    {machine.states
                      .filter((s) => s.id !== selectedState.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    className="input input-full"
                    placeholder="condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                  />
                  <button
                    className="btn btn-sm"
                    onClick={addTransition}
                    disabled={!newTarget}
                  >
                    +
                  </button>
                </div>
                {machine.states.length < 2 && (
                  <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
                    Add a second state to connect them.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
