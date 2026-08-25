import React, { useState, useMemo, useCallback } from "react";
import type {
  AppState,
  AppAction,
  GameObjectDef,
  SpriteRegion,
} from "../types";
import {
  STANDARD_SLOTS,
  isCharacter,
  makeCharacter,
  assignSlot,
  clearSlot,
  addAction,
  renameAction,
  removeAction,
  characterPreviewFrames,
} from "./character";
import { AnimatedSpritePreview } from "../components/AnimatedSpritePreview";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  imageMap: Map<string, HTMLImageElement>;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: "save" | "quick") => void;
  onOpenProjects: () => void;
}

const ELLIPSIS: React.CSSProperties = {
  maxWidth: 48,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export function CharacterEditor({
  state,
  dispatch,
  imageMap,
  projectId,
  saving,
  onSave,
  onOpenProjects,
}: Props) {
  const characters = state.objects.filter(isCharacter);
  const selected =
    characters.find((o) => o.id === state.selectedObjectId) ?? null;

  const [pick, setPick] = useState<{ key: string; kind: "sprite" | "animation" } | null>(null);
  const [newAction, setNewAction] = useState("");

  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const animById = useMemo(
    () => new Map(state.animations.map((a) => [a.id, a])),
    [state.animations],
  );

  const createCharacter = useCallback(() => {
    const c = makeCharacter(`character_${characters.length}`);
    dispatch({ type: "ADD_OBJECT", object: c });
    dispatch({ type: "SELECT_OBJECT", id: c.id });
  }, [characters.length, dispatch]);

  const apply = useCallback(
    (next: GameObjectDef) =>
      dispatch({ type: "UPDATE_OBJECT", id: next.id, updates: next }),
    [dispatch],
  );

  const headerPreview = selected
    ? characterPreviewFrames(selected, animById)
    : { frames: [], duration: 0 };

  const slotFrames = useCallback(
    (o: GameObjectDef, key: string): { frames: string[]; duration: number } | null => {
      const slot = o.character?.slots[key];
      if (!slot) return null;
      if (slot.kind === "sprite") return { frames: [slot.id], duration: 0 };
      const a = animById.get(slot.id);
      return a ? { frames: a.frames, duration: a.duration } : { frames: [], duration: 0 };
    },
    [animById],
  );

  return (
    <div className="app-layout">
      <div className="title-bar">
        <span className="title-bar__icon">☺</span>
        <span className="title-bar__name">
          GameFoo Character — {state.projectName}
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
        {/* Left: character list */}
        <div
          className="right-panel"
          style={{ borderRight: "1px solid var(--border-dark)" }}
        >
          <div className="panel-content">
            <div className="section">
              <div className="section-title">
                <span>Characters ({characters.length})</span>
                <button className="btn btn-sm" onClick={createCharacter}>
                  + New
                </button>
              </div>
              {characters.length === 0 && (
                <div className="p-4 text-dim text-xs">
                  No characters yet. “+ New” creates a character you can wire to
                  movement sprites and actions.
                </div>
              )}
              {characters.map((o) => {
                const pv = characterPreviewFrames(o, animById);
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
                        spriteById={spriteById}
                        imageMap={imageMap}
                        size={26}
                      />
                    </div>
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {o.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: character config */}
        <div className="panel-content" style={{ flex: 1 }}>
          {!selected ? (
            <div className="p-4 text-dim text-xs">
              Select a character, or create one with “+ New”.
            </div>
          ) : (
            <div className="col gap-md">
              {/* Header */}
              <div className="section">
                <div className="section-title">
                  <span>Character</span>
                  <button
                    className="btn btn-sm danger"
                    onClick={() => dispatch({ type: "DELETE_OBJECT", id: selected.id })}
                  >
                    Delete
                  </button>
                </div>
                <div className="row" style={{ gap: 10, alignItems: "center", padding: 4 }}>
                  <div className="asset-thumb" style={{ width: 64, height: 64, cursor: "default" }}>
                    <AnimatedSpritePreview
                      frames={headerPreview.frames}
                      duration={headerPreview.duration}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      size={62}
                    />
                  </div>
                  <div className="col" style={{ flex: 1, gap: 4 }}>
                    <div className="field-row" style={{ margin: 0 }}>
                      <span className="field-label">Name:</span>
                      <input
                        type="text"
                        className="input input-full"
                        value={selected.name}
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_OBJECT", id: selected.id, updates: { name: e.target.value } })
                        }
                      />
                    </div>
                    <span className="text-xs text-dim">
                      {selected.machine.states.length} states ·{" "}
                      {selected.machine.transitions.length} transitions · place it
                      from the Map tab (Objects palette)
                    </span>
                  </div>
                </div>
              </div>

              {/* Movement slots */}
              <div className="section">
                <div className="section-title">Movement & States</div>
                <div className="row" style={{ flexWrap: "wrap", gap: 6, padding: 4 }}>
                  {STANDARD_SLOTS.map((s) => (
                    <SlotCard
                      key={s.key}
                      label={s.label}
                      frames={slotFrames(selected, s.key)}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      onSetSprite={() => setPick({ key: s.key, kind: "sprite" })}
                      onSetAnim={() => setPick({ key: s.key, kind: "animation" })}
                      onClear={() => apply(clearSlot(selected, s.key))}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="section">
                <div className="section-title">
                  <span>Actions ({selected.character?.actions.length ?? 0})</span>
                </div>
                <div className="row" style={{ flexWrap: "wrap", gap: 6, padding: 4 }}>
                  {(selected.character?.actions ?? []).map((a) => (
                    <SlotCard
                      key={a.id}
                      label={a.name}
                      editableLabel
                      onRenameLabel={(name) => apply(renameAction(selected, a.id, name))}
                      onRemove={() => apply(removeAction(selected, a.id))}
                      frames={slotFrames(selected, a.id)}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      onSetSprite={() => setPick({ key: a.id, kind: "sprite" })}
                      onSetAnim={() => setPick({ key: a.id, kind: "animation" })}
                      onClear={() => apply(clearSlot(selected, a.id))}
                    />
                  ))}
                </div>
                <div className="field-row">
                  <input
                    type="text"
                    className="input input-md"
                    placeholder="action name (e.g. attack)"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newAction.trim()) {
                        apply(addAction(selected, newAction.trim()));
                        setNewAction("");
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm"
                    disabled={!newAction.trim()}
                    onClick={() => {
                      apply(addAction(selected, newAction.trim()));
                      setNewAction("");
                    }}
                  >
                    + Action
                  </button>
                </div>
              </div>

              <div className="section">
                <div className="text-xs text-dim" style={{ padding: 4 }}>
                  The state machine (idle hub ↔ each filled slot) is generated
                  automatically. Fine-tune states, transitions and conditions in
                  the Objects tab.
                </div>
              </div>

              {/* Asset picker */}
              {pick && (
                <div className="section">
                  <div className="section-title">
                    <span>
                      Pick {pick.kind} for “{labelForKey(selected, pick.key)}”
                    </span>
                    <button className="btn btn-sm" onClick={() => setPick(null)}>
                      Close
                    </button>
                  </div>
                  <div className="sprite-list" style={{ maxHeight: 220 }}>
                    <div className="asset-grid">
                      {pick.kind === "sprite"
                        ? state.sprites.map((s) => (
                          <div key={s.id} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                            <div
                              className="asset-thumb"
                              title={`${s.name} (${s.width}×${s.height})`}
                              onClick={() => {
                                apply(assignSlot(selected, pick.key, { kind: "sprite", id: s.id }));
                                setPick(null);
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
                        ))
                        : state.animations.map((a) => (
                          <div key={a.id} className="col" style={{ alignItems: "center", gap: 2, width: 48 }}>
                            <div
                              className="asset-thumb"
                              title={`${a.name} (${a.frames.length} frames)`}
                              onClick={() => {
                                apply(assignSlot(selected, pick.key, { kind: "animation", id: a.id }));
                                setPick(null);
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
                    {((pick.kind === "sprite" && state.sprites.length === 0) ||
                      (pick.kind === "animation" && state.animations.length === 0)) && (
                        <div className="p-4 text-dim text-xs">
                          No {pick.kind}s in the project yet.
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function labelForKey(o: GameObjectDef, key: string): string {
  const std = STANDARD_SLOTS.find((s) => s.key === key);
  if (std) return std.label;
  return o.character?.actions.find((a) => a.id === key)?.name ?? key;
}

function SlotCard({
  label,
  editableLabel,
  onRenameLabel,
  onRemove,
  frames,
  spriteById,
  imageMap,
  onSetSprite,
  onSetAnim,
  onClear,
}: {
  label: string;
  editableLabel?: boolean;
  onRenameLabel?: (name: string) => void;
  onRemove?: () => void;
  frames: { frames: string[]; duration: number } | null;
  spriteById: Map<string, SpriteRegion>;
  imageMap: Map<string, HTMLImageElement>;
  onSetSprite: () => void;
  onSetAnim: () => void;
  onClear: () => void;
}) {
  return (
    <div
      className="col"
      style={{
        width: 128,
        gap: 4,
        padding: 6,
        border: "1px solid var(--border-mid)",
        background: "var(--bg-dark)",
      }}
    >
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        {editableLabel ? (
          <input
            type="text"
            className="input input-sm"
            style={{ flex: 1 }}
            value={label}
            onChange={(e) => onRenameLabel?.(e.target.value)}
          />
        ) : (
          <span className="text-xs" style={{ fontWeight: "bold" }}>{label}</span>
        )}
        {onRemove && (
          <button
            className="btn btn-sm danger"
            style={{ padding: "0 3px", minHeight: 14, fontSize: 8 }}
            onClick={onRemove}
          >
            ✕
          </button>
        )}
      </div>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="asset-thumb" style={{ cursor: "default" }}>
          {frames ? (
            <AnimatedSpritePreview
              frames={frames.frames}
              duration={frames.duration}
              spriteById={spriteById}
              imageMap={imageMap}
            />
          ) : (
            <div
              className="text-dim"
              style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}
            >
              empty
            </div>
          )}
        </div>
      </div>
      <div className="row" style={{ gap: 2, justifyContent: "center" }}>
        <button className="btn btn-sm" style={{ fontSize: 8, padding: "0 4px" }} onClick={onSetSprite}>
          Sprite
        </button>
        <button className="btn btn-sm" style={{ fontSize: 8, padding: "0 4px" }} onClick={onSetAnim}>
          Anim
        </button>
        {frames && (
          <button className="btn btn-sm danger" style={{ fontSize: 8, padding: "0 4px" }} onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
