import React, { useCallback, useState, useEffect } from "react";
import type { AppState, AppAction, GameObjectDef } from "../types";
import { uid } from "../utils/uid";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export function ObjectPanel({ state, dispatch }: Props) {
  const selected = state.objects.find((o) => o.id === state.selectedObjectId) ?? null;
  const [newPropKey, setNewPropKey] = useState("");
  const [newPropVal, setNewPropVal] = useState("");

  const createObject = useCallback(() => {
    const obj: GameObjectDef = {
      id: uid("obj"),
      name: `object_${state.objects.length}`,
      sprites: [...state.selectedSpriteIds],
      animations: state.selectedAnimationId ? [state.selectedAnimationId] : [],
      properties: {},
    };
    dispatch({ type: "ADD_OBJECT", object: obj });
    dispatch({ type: "SELECT_OBJECT", id: obj.id });
  }, [state.selectedSpriteIds, state.selectedAnimationId, state.objects.length, dispatch]);

  const updateSelected = useCallback(
    (updates: Partial<GameObjectDef>) => {
      if (!selected) return;
      dispatch({ type: "UPDATE_OBJECT", id: selected.id, updates });
    },
    [selected, dispatch],
  );

  const addProperty = useCallback(() => {
    if (!selected || !newPropKey) return;
    updateSelected({
      properties: { ...selected.properties, [newPropKey]: newPropVal },
    });
    setNewPropKey("");
    setNewPropVal("");
  }, [selected, newPropKey, newPropVal, updateSelected]);

  const removeProperty = useCallback(
    (key: string) => {
      if (!selected) return;
      const props = { ...selected.properties };
      delete props[key];
      updateSelected({ properties: props });
    },
    [selected, updateSelected],
  );

  const spriteMap = new Map(state.sprites.map((s) => [s.id, s]));
  const animMap = new Map(state.animations.map((a) => [a.id, a]));

  return (
    <div className="col gap-md">
      <div className="section">
        <div className="section-title">
          <span>Game Objects ({state.objects.length})</span>
          <button className="btn btn-sm" onClick={createObject}>
            + New
          </button>
        </div>

        <div className="sprite-list" style={{ maxHeight: 150 }}>
          {state.objects.length === 0 && (
            <div className="p-4 text-dim text-xs">
              No objects. Objects group sprites and animations into logical game entities.
            </div>
          )}
          {state.objects.map((o) => (
            <div
              key={o.id}
              className={`object-item ${state.selectedObjectId === o.id ? "selected" : ""}`}
              onClick={() => dispatch({ type: "SELECT_OBJECT", id: o.id })}
            >
              <span style={{ flex: 1 }}>{o.name}</span>
              <span className="text-xs text-dim">
                {o.sprites.length}s {o.animations.length}a
              </span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="section">
          <div className="section-title">
            <span>Edit: {selected.name}</span>
            <button
              className="btn btn-sm danger"
              onClick={() => dispatch({ type: "DELETE_OBJECT", id: selected.id })}
            >
              Del
            </button>
          </div>

          <div className="field-row">
            <span className="field-label">Name:</span>
            <input
              type="text"
              className="input input-full"
              value={selected.name}
              onChange={(e) => updateSelected({ name: e.target.value })}
            />
          </div>

          {/* Sprites */}
          <div className="mt-4">
            <div className="row-between">
              <span className="text-sm">Sprites ({selected.sprites.length})</span>
              <button
                className="btn btn-sm"
                onClick={() => {
                  const toAdd = state.selectedSpriteIds.filter((id) => !selected.sprites.includes(id));
                  if (toAdd.length > 0) {
                    updateSelected({ sprites: [...selected.sprites, ...toAdd] });
                  }
                }}
                disabled={state.selectedSpriteIds.length === 0}
              >
                + Add
              </button>
            </div>
            <div className="sprite-list" style={{ maxHeight: 80 }}>
              {selected.sprites.map((sid) => {
                const s = spriteMap.get(sid);
                return (
                  <div key={sid} className="sprite-item">
                    <span className="sprite-item__name">{s?.name ?? sid}</span>
                    <button
                      className="btn btn-sm danger"
                      onClick={() =>
                        updateSelected({ sprites: selected.sprites.filter((id) => id !== sid) })
                      }
                      style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Animations */}
          <div className="mt-4">
            <div className="row-between">
              <span className="text-sm">Animations ({selected.animations.length})</span>
              <button
                className="btn btn-sm"
                onClick={() => {
                  if (state.selectedAnimationId && !selected.animations.includes(state.selectedAnimationId)) {
                    updateSelected({ animations: [...selected.animations, state.selectedAnimationId] });
                  }
                }}
                disabled={!state.selectedAnimationId}
              >
                + Add
              </button>
            </div>
            <div className="sprite-list" style={{ maxHeight: 80 }}>
              {selected.animations.map((aid) => {
                const a = animMap.get(aid);
                return (
                  <div key={aid} className="anim-item">
                    <span className="anim-item__name">{a?.name ?? aid}</span>
                    <button
                      className="btn btn-sm danger"
                      onClick={() =>
                        updateSelected({
                          animations: selected.animations.filter((id) => id !== aid),
                        })
                      }
                      style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom properties */}
          <div className="mt-4">
            <div className="section-title">Custom Properties</div>
            {Object.entries(selected.properties).map(([key, val]) => (
              <div key={key} className="field-row">
                <span className="field-label" style={{ minWidth: 40 }}>{key}:</span>
                <input
                  type="text"
                  className="input input-md"
                  value={val}
                  onChange={(e) =>
                    updateSelected({
                      properties: { ...selected.properties, [key]: e.target.value },
                    })
                  }
                />
                <button
                  className="btn btn-sm danger"
                  onClick={() => removeProperty(key)}
                  style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
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
              <button className="btn btn-sm" onClick={addProperty} disabled={!newPropKey}>
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
