import React, { useState, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import { collisionLayerId } from "../types";
import { Icon } from "./Icon";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: "save" | "quick") => void;
  onOpenProjects: () => void;
}

export function ProjectConfigPanel({ state, dispatch, projectId, saving, onSave, onOpenProjects }: Props) {
  const layers = state.config.defaultLayers;
  const setLayers = useCallback(
    (l: string[]) => dispatch({ type: "SET_CONFIG_DEFAULT_LAYERS", layers: l }),
    [dispatch],
  );

  const applyToMap = useCallback(() => {
    dispatch({
      type: "MAP",
      action: { type: "SET_LAYERS", layers: layers.map((name) => ({ name, visible: true })) },
    });
  }, [dispatch, layers]);

  const [newLayerColor, setNewLayerColor] = useState("#7ad0ff");
  const [newLayerName, setNewLayerName] = useState("");
  const existingCollision = new Set(state.collisionLayers.map((l) => l.id));
  const newColId = collisionLayerId(newLayerName);
  const canAddCollision = newLayerName.trim().length > 0 && !existingCollision.has(newColId);

  return (
    <div className="app-layout">
      <div className="title-bar">
        <span className="title-bar__icon"><Icon name="settings" size={15} /></span>
        <span className="title-bar__name">
          GameFoo Project Config — {state.projectName}
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

      <div className="main-area" style={{ justifyContent: "center" }}>
        <div className="right-panel" style={{ width: 480, maxWidth: "100%", borderLeft: "none" }}>
          <div className="panel-content">
            <div className="text-xs text-dim" style={{ padding: "0 4px 6px" }}>
              Project-wide constants. Exported as a standalone <code>.config.json</code> and inlined
              into object/map exports; the editor never loads it back as its own file.
            </div>

            {/* Default screen layers */}
            <div className="section">
              <div className="section-title">
                <span>Default Screen Layers ({layers.length})</span>
                <button className="btn btn-sm" onClick={() => setLayers([...layers, `layer_${layers.length}`])}>+ Layer</button>
              </div>
              <div className="text-xs text-dim" style={{ padding: "0 4px 4px" }}>
                New projects start their map with these layers (bottom → top). Change any time;
                use “Apply to current map” to reset the open map's layers.
              </div>
              {layers.map((name, i) => (
                <div key={i} className="object-layer-row">
                  <span className="text-xs text-dim" style={{ minWidth: 12 }}>{i}</span>
                  <input
                    type="text"
                    className="input input-full"
                    value={name}
                    onChange={(e) => setLayers(layers.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                  <button
                    className="btn btn-sm"
                    title="Move down (toward back)"
                    disabled={i === 0}
                    onClick={() => { const l = [...layers]; [l[i - 1], l[i]] = [l[i]!, l[i - 1]!]; setLayers(l); }}
                  >
                    <Icon name="down" size={12} />
                  </button>
                  <button
                    className="btn btn-sm"
                    title="Move up (toward front)"
                    disabled={i === layers.length - 1}
                    onClick={() => { const l = [...layers]; [l[i + 1], l[i]] = [l[i]!, l[i + 1]!]; setLayers(l); }}
                  >
                    <Icon name="up" size={12} />
                  </button>
                  <button
                    className="btn btn-sm danger"
                    title="Remove layer"
                    disabled={layers.length <= 1}
                    onClick={() => setLayers(layers.filter((_, j) => j !== i))}
                  >
                    <Icon name="delete" size={12} />
                  </button>
                </div>
              ))}
              <div className="field-row" style={{ marginTop: 4 }}>
                <button className="btn btn-sm" onClick={applyToMap}>Apply to current map</button>
              </div>
            </div>

            {/* Collision layers */}
            <div className="section">
              <div className="section-title">Collision Layers ({state.collisionLayers.length})</div>
              <div className="text-xs text-dim" style={{ padding: "0 4px 4px" }}>
                Named collision categories with a fixed colour. Every sprite and object references
                these; edits apply everywhere.
              </div>
              {state.collisionLayers.map((l) => (
                <div className="field-row" key={l.id}>
                  <input
                    type="color"
                    className="input color-input"
                    value={l.color}
                    onChange={(e) => dispatch({ type: "UPDATE_COLLISION_LAYER", id: l.id, updates: { color: e.target.value } })}
                  />
                  <input
                    type="text"
                    className="input input-full"
                    value={l.name}
                    onChange={(e) => dispatch({ type: "UPDATE_COLLISION_LAYER", id: l.id, updates: { name: e.target.value } })}
                  />
                  <span className="badge-shape">{l.id}</span>
                  <button
                    className="btn btn-sm danger"
                    title="Delete layer and its volumes on every sprite/object"
                    onClick={() => dispatch({ type: "DELETE_COLLISION_LAYER", id: l.id })}
                  >
                    <Icon name="delete" size={12} />
                  </button>
                </div>
              ))}
              <div className="field-row" style={{ marginTop: 4 }}>
                <input type="color" className="input color-input" value={newLayerColor} onChange={(e) => setNewLayerColor(e.target.value)} />
                <input
                  type="text"
                  className="input input-full"
                  placeholder="new collision layer name"
                  value={newLayerName}
                  onChange={(e) => setNewLayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAddCollision) {
                      dispatch({ type: "ADD_COLLISION_LAYER", layer: { id: newColId, name: newLayerName.trim(), color: newLayerColor } });
                      setNewLayerName("");
                    }
                  }}
                />
                <button
                  className="btn btn-sm"
                  disabled={!canAddCollision}
                  onClick={() => {
                    dispatch({ type: "ADD_COLLISION_LAYER", layer: { id: newColId, name: newLayerName.trim(), color: newLayerColor } });
                    setNewLayerName("");
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
