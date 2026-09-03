import React, { useMemo, useCallback, useState } from "react";
import type { AppState, AppAction, SpriteRegion, AnimationDef } from "../types";
import { objectMachines } from "../types";
import type { StateMachineDef } from "../statemachine/types";
import type { MapAction, MapPlacement } from "./types";
import { resolvePlacementDisplay, resolveMachineState } from "./types";
import { AnimatedSpritePreview } from "../components/AnimatedSpritePreview";
import { Icon } from "../components/Icon";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  mapDispatch: (a: MapAction) => void;
  activeScreenKey: string | null;
  imageMap: Map<string, HTMLImageElement>;
}

const THUMB = 40;

/** Clickable palette thumbnail box wrapping a preview, with a badge. */
function ThumbShell({
  selected,
  title,
  badge,
  onClick,
  children,
}: {
  selected: boolean;
  title: string;
  badge?: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`asset-thumb ${selected ? "selected" : ""}`}
      title={title}
      onClick={onClick}
      style={{ position: "relative" }}
    >
      {children}
      {badge && (
        <span
          style={{
            position: "absolute",
            top: 1,
            right: 3,
            fontSize: 9,
            lineHeight: 1,
            color: "#00ff66",
            textShadow: "0 0 2px #000",
            pointerEvents: "none",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function SpriteThumb({
  sprite,
  imageMap,
  selected,
  title,
  onClick,
}: {
  sprite: SpriteRegion;
  imageMap: Map<string, HTMLImageElement>;
  selected: boolean;
  title: string;
  onClick: () => void;
}) {
  const spriteById = React.useMemo(
    () => new Map([[sprite.id, sprite]]),
    [sprite],
  );
  return (
    <ThumbShell selected={selected} title={title} onClick={onClick}>
      <AnimatedSpritePreview
        frames={[sprite.id]}
        duration={0}
        spriteById={spriteById}
        imageMap={imageMap}
      />
    </ThumbShell>
  );
}

/**
 * Live preview of a sprite-id sequence in a selectable palette thumb.
 */
function FramePreview({
  frames,
  duration,
  spriteById,
  imageMap,
  selected,
  title,
  badge,
  onClick,
}: {
  frames: string[];
  duration: number;
  spriteById: Map<string, SpriteRegion>;
  imageMap: Map<string, HTMLImageElement>;
  selected: boolean;
  title: string;
  badge?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <ThumbShell selected={selected} title={title} badge={badge} onClick={onClick}>
      <AnimatedSpritePreview
        frames={frames}
        duration={duration}
        spriteById={spriteById}
        imageMap={imageMap}
      />
    </ThumbShell>
  );
}

/** Live preview of a state machine's default (initial) state. */
function MachineThumb({
  machine,
  animations,
  spriteById,
  imageMap,
  selected,
  title,
  onClick,
}: {
  machine: StateMachineDef;
  animations: AnimationDef[];
  spriteById: Map<string, SpriteRegion>;
  imageMap: Map<string, HTMLImageElement>;
  selected: boolean;
  title: string;
  onClick: () => void;
}) {
  const st = resolveMachineState(machine);
  let frames: string[] = [];
  let duration = 0.15;
  let badge: React.ReactNode = <Icon name="settings" size={9} />;
  if (st) {
    if (st.display.kind === "sprite" && st.display.spriteId) {
      frames = [st.display.spriteId];
    } else if (st.display.kind === "animation" && st.display.animationId) {
      const animationId = st.display.animationId;
      const anim = animations.find((a) => a.id === animationId);
      if (anim && anim.frames.length > 0) {
        frames = anim.frames;
        duration = anim.duration;
        badge = (<><Icon name="settings" size={9} /><Icon name="play" size={9} /></>);
      }
    }
  }

  return (
    <FramePreview
      frames={frames}
      duration={duration}
      spriteById={spriteById}
      imageMap={imageMap}
      selected={selected}
      title={title}
      badge={badge}
      onClick={onClick}
    />
  );
}

export function MapPalettePanel({
  state,
  dispatch,
  mapDispatch,
  activeScreenKey,
  imageMap,
}: Props) {
  const map = state.map;
  const [dragLayer, setDragLayer] = useState<number | null>(null);
  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const imageNames = useMemo(
    () => new Map(state.images.map((i) => [i.id, i.name])),
    [state.images],
  );

  const selectedSpriteId = map.selected?.kind === "sprite" ? map.selected.id : null;
  const selectedSprite = selectedSpriteId ? spriteById.get(selectedSpriteId) : undefined;

  // Group sprites: explicit sprite.group, else the source image name.
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

  const activeScreen = activeScreenKey ? map.screens[activeScreenKey] : undefined;

  // Selected placement lookup (screen key + placement)
  const selectedPlacement = useMemo(() => {
    if (!map.selectedPlacementId) return null;
    for (const [key, screen] of Object.entries(map.screens)) {
      const p = screen.placements.find(
        (pl) => pl.id === map.selectedPlacementId,
      );
      if (p) return { screenKey: key, placement: p };
    }
    return null;
  }, [map.selectedPlacementId, map.screens]);

  const selDisplay = selectedPlacement
    ? resolvePlacementDisplay(
      selectedPlacement.placement,
      state.sprites,
      state.animations,
      objectMachines(state.objects),
    )
    : null;
  const selSprite = selDisplay?.spriteId ? spriteById.get(selDisplay.spriteId) : undefined;

  const updatePlacement = useCallback(
    (
      updates: Partial<
        Pick<
          MapPlacement,
          "x" | "y" | "rotation" | "flipX" | "flipY"
        >
      >,
    ) => {
      if (!selectedPlacement) return;
      mapDispatch({
        type: "UPDATE_PLACEMENT",
        screenKey: selectedPlacement.screenKey,
        id: selectedPlacement.placement.id,
        updates,
      });
    },
    [selectedPlacement, mapDispatch],
  );

  return (
    <div className="col gap-md">
      {/* Project (shared with the sprite editor) */}
      <div className="section">
        <div className="section-title">Project</div>
        <div className="field-row">
          <span className="field-label">Name:</span>
          <input
            type="text"
            className="input input-full"
            value={state.projectName}
            onChange={(e) =>
              dispatch({ type: "SET_PROJECT_NAME", name: e.target.value })
            }
          />
        </div>
      </div>

      {/* Map settings */}
      <div className="section">
        <div className="section-title">Map Settings</div>
        <div className="field-row">
          <span className="field-label">Block:</span>
          <input
            type="number"
            className="input"
            min={4}
            max={256}
            value={map.blockSize}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                blockSize: Math.max(4, Math.min(256, Number(e.target.value) || 4)),
              })
            }
          />
          <span className="text-xs text-dim">px</span>
        </div>
        <div className="field-row">
          <span className="field-label">Cols:</span>
          <input
            type="number"
            className="input"
            min={1}
            max={256}
            value={map.screenCols}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                screenCols: Math.max(1, Math.min(256, Number(e.target.value) || 1)),
              })
            }
          />
          <span className="field-label">Rows:</span>
          <input
            type="number"
            className="input"
            min={1}
            max={256}
            value={map.screenRows}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                screenRows: Math.max(1, Math.min(256, Number(e.target.value) || 1)),
              })
            }
          />
        </div>
        <div className="section-title" style={{ marginTop: 4 }}>
          <span>Layers ({map.layers.length})</span>
          <button className="btn btn-sm" onClick={() => mapDispatch({ type: "ADD_LAYER" })}>+ Layer</button>
        </div>
        <div className="active-layer-banner">
          Placing on: <b>{map.layers[map.activeLevel]?.name ?? "?"}</b>
          <span className="text-dim"> (layer {map.activeLevel})</span>
        </div>
        {[...map.layers]
          .map((l, i) => ({ l, i }))
          .reverse()
          .map(({ l, i }) => (
            <div
              key={i}
              className={`object-layer-row ${map.activeLevel === i ? "selected" : ""} ${dragLayer === i ? "dragging" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragLayer !== null && dragLayer !== i) mapDispatch({ type: "MOVE_LAYER", from: dragLayer, to: i });
                setDragLayer(null);
              }}
              onClick={() => mapDispatch({ type: "SET_ACTIVE_LEVEL", level: i })}
            >
              <span
                className="text-xs text-dim layer-grip"
                title="Drag to reorder"
                draggable
                onDragStart={(e) => { e.stopPropagation(); setDragLayer(i); }}
                onDragEnd={() => setDragLayer(null)}
              >
                <Icon name="grip" size={12} />
              </span>
              <span className="text-xs" style={{ minWidth: 12, textAlign: "center" }}>{map.activeLevel === i ? <Icon name="play" size={11} /> : i}</span>
              <input
                type="text"
                className="input input-full"
                value={l.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => mapDispatch({ type: "RENAME_LAYER", level: i, name: e.target.value })}
              />
              <button
                className={`btn btn-sm ${l.visible ? "active" : ""}`}
                title={l.visible ? "Visible — click to hide" : "Hidden — click to show"}
                onClick={(e) => { e.stopPropagation(); mapDispatch({ type: "SET_LAYER_VISIBLE", level: i, visible: !l.visible }); }}
              >
                {l.visible ? <Icon name="eye" size={13} /> : <Icon name="eye-off" size={13} />}
              </button>
            </div>
          ))}
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          Screen = {map.screenCols * map.blockSize}×
          {map.screenRows * map.blockSize}px ({map.screenCols}×
          {map.screenRows} blocks). Screens: (x,y) — x grows ↓, y grows →.
        </div>
      </div>

      {/* Default tile for new screens */}
      <div className="section">
        <div className="section-title">Default Tile (new screens)</div>
        <div className="text-xs" style={{ padding: "2px 4px" }}>
          {map.defaultSpriteId
            ? `Current: ${spriteById.get(map.defaultSpriteId)?.name ?? "?"}`
            : "None — new screens start empty"}
        </div>
        <div className="row gap-sm" style={{ padding: 4 }}>
          <button
            className="btn btn-sm"
            disabled={!selectedSpriteId}
            onClick={() =>
              mapDispatch({
                type: "SET_MAP_DEFAULT",
                spriteId: selectedSpriteId,
              })
            }
          >
            Use Selected
          </button>
          <button
            className="btn btn-sm"
            disabled={!map.defaultSpriteId}
            onClick={() => mapDispatch({ type: "SET_MAP_DEFAULT", spriteId: null })}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Active screen */}
      <div className="section">
        <div className="section-title">Screen {activeScreenKey ?? "—"}</div>
        <div className="text-xs" style={{ padding: "2px 4px" }}>
          {activeScreen
            ? `Fill: ${activeScreen.defaultSpriteId
              ? spriteById.get(activeScreen.defaultSpriteId)?.name ?? "?"
              : "none"
            } · ${activeScreen.placements.length} placements`
            : "Click a screen on the map to select it (Fill tool sets its tile)"}
        </div>
        <div className="row gap-sm" style={{ padding: 4, flexWrap: "wrap" }}>
          <button
            className="btn btn-sm"
            disabled={!activeScreen || !selectedSpriteId}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "SET_SCREEN_DEFAULT",
                x: activeScreen.x,
                y: activeScreen.y,
                spriteId: selectedSpriteId,
              })
            }
          >
            Fill w/ Selected
          </button>
          <button
            className="btn btn-sm"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "SET_SCREEN_DEFAULT",
                x: activeScreen.x,
                y: activeScreen.y,
                spriteId: null,
              })
            }
          >
            Clear Fill
          </button>
          <button
            className="btn btn-sm"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "CLEAR_SCREEN",
                x: activeScreen.x,
                y: activeScreen.y,
              })
            }
          >
            Clear Placements
          </button>
          <button
            className="btn btn-sm danger"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              confirm(`Delete screen (${activeScreen.x},${activeScreen.y})?`) &&
              mapDispatch({
                type: "REMOVE_SCREEN",
                x: activeScreen.x,
                y: activeScreen.y,
              })
            }
          >
            Delete Screen
          </button>
        </div>
      </div>

      {/* Selected placement editor */}
      {selectedPlacement && (
        <div className="section">
          <div className="section-title">
            <span>
              Placement: {selSprite?.name ?? "?"}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => mapDispatch({ type: "SELECT_PLACEMENT", id: null })}
            >
              Deselect
            </button>
          </div>

          <div className="field-row">
            <span className="field-label">X:</span>
            <input
              type="number"
              className="input input-sm"
              value={selectedPlacement.placement.x}
              onChange={(e) =>
                updatePlacement({ x: Math.max(0, Number(e.target.value) || 0) })
              }
            />
            <span className="field-label">Y:</span>
            <input
              type="number"
              className="input input-sm"
              value={selectedPlacement.placement.y}
              onChange={(e) =>
                updatePlacement({ y: Math.max(0, Number(e.target.value) || 0) })
              }
            />
          </div>

          <div className="field-row">
            <span className="field-label">Rot:</span>
            <input
              type="number"
              className="input input-sm"
              step={15}
              value={selectedPlacement.placement.rotation ?? 0}
              onChange={(e) =>
                updatePlacement({ rotation: Number(e.target.value) || 0 })
              }
            />
            <span className="text-xs text-dim">deg</span>
            <button
              className="btn btn-sm"
              title="Rotate 90° clockwise (R)"
              onClick={() =>
                updatePlacement({
                  rotation: ((selectedPlacement.placement.rotation ?? 0) + 90) % 360,
                })
              }
            >
              +90°
            </button>
            <button
              className="btn btn-sm"
              title="Reset rotation"
              disabled={!selectedPlacement.placement.rotation}
              onClick={() => updatePlacement({ rotation: 0 })}
            >
              ↺
            </button>
          </div>

          <div className="field-row">
            <button
              className={`btn btn-sm ${selectedPlacement.placement.flipX ? "active" : ""}`}
              title="Mirror horizontally (X)"
              onClick={() =>
                updatePlacement({ flipX: !selectedPlacement.placement.flipX })
              }
            >
              ⇄ Flip X {selectedPlacement.placement.flipX ? "ON" : ""}
            </button>
            <button
              className={`btn btn-sm ${selectedPlacement.placement.flipY ? "active" : ""}`}
              title="Mirror vertically (Y)"
              onClick={() =>
                updatePlacement({ flipY: !selectedPlacement.placement.flipY })
              }
            >
              ⇅ Flip Y {selectedPlacement.placement.flipY ? "ON" : ""}
            </button>
          </div>

          <div className="field-row">
            <button
              className="btn btn-sm"
              disabled={
                !selectedPlacement.placement.rotation &&
                !selectedPlacement.placement.flipX &&
                !selectedPlacement.placement.flipY
              }
              onClick={() =>
                updatePlacement({ rotation: 0, flipX: false, flipY: false })
              }
            >
              Reset Transform
            </button>
            <button
              className="btn btn-sm danger"
              onClick={() =>
                mapDispatch({
                  type: "REMOVE_PLACEMENT",
                  screenKey: selectedPlacement.screenKey,
                  id: selectedPlacement.placement.id,
                })
              }
            >
              Delete
            </button>
          </div>

          <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
            On screen {selectedPlacement.screenKey} · shortcuts: R rotate, X
            flip X, Y flip Y · select with Pick or Move tool
          </div>
        </div>
      )}

      {/* Sprite palette — from the shared library */}
      <div className="section">
        <div className="section-title">
          Sprites ({state.sprites.length}) — from the Sprite Editor library
        </div>
        {state.sprites.length === 0 && (
          <div className="text-xs text-dim" style={{ padding: 4 }}>
            No sprites yet. Switch to the Sprite Editor, add images and cut
            sprites — they appear here automatically.
          </div>
        )}
        {groups.map(([group, sprites]) => (
          <div key={group} style={{ padding: "4px 0" }}>
            <div className="text-xs text-dim" style={{ padding: "2px 0" }}>
              {group} ({sprites.length})
            </div>
            <div className="asset-grid">
              {sprites.map((s) => (
                <SpriteThumb
                  key={s.id}
                  sprite={s}
                  imageMap={imageMap}
                  selected={map.selected?.kind === "sprite" && map.selected.id === s.id}
                  title={`${s.name} (${s.width}×${s.height})`}
                  onClick={() =>
                    mapDispatch({
                      type: "SELECT_PALETTE",
                      selection:
                        map.selected?.kind === "sprite" && map.selected.id === s.id
                          ? null
                          : { kind: "sprite", id: s.id },
                    })
                  }
                />
              ))}
            </div>
          </div>
        ))}
        {selectedSprite && (
          <div className="text-xs" style={{ padding: "4px 4px 0" }}>
            Selected: {selectedSprite.name} ({selectedSprite.width}×
            {selectedSprite.height}px)
          </div>
        )}
      </div>

      {/* Objects palette — animations & state machines */}
      <div className="section">
        <div className="section-title">
          Objects ({state.animations.length + objectMachines(state.objects).length})
        </div>
        {state.animations.length === 0 && objectMachines(state.objects).length === 0 && (
          <div className="text-xs text-dim" style={{ padding: 4 }}>
            No animations or state machines yet.
          </div>
        )}
        {state.animations.length > 0 && (
          <div style={{ padding: "4px 0" }}>
            <div className="text-xs text-dim" style={{ padding: "2px 0" }}>
              Animations ({state.animations.length})
            </div>
            <div className="asset-grid">
              {state.animations.map((a) => {
                const sel =
                  map.selected?.kind === "animation" && map.selected.id === a.id;
                return (
                  <div
                    key={a.id}
                    className="col"
                    style={{ alignItems: "center", gap: 2, width: THUMB + 8 }}
                  >
                    <FramePreview
                      frames={a.frames}
                      duration={a.duration}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      selected={sel}
                      badge={<Icon name="play" size={9} />}
                      title={`${a.name} (${a.frames.length} frames)`}
                      onClick={() =>
                        mapDispatch({
                          type: "SELECT_PALETTE",
                          selection: sel ? null : { kind: "animation", id: a.id },
                        })
                      }
                    />
                    <span
                      className="text-xs text-dim"
                      style={{
                        maxWidth: THUMB + 8,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {objectMachines(state.objects).length > 0 && (
          <div style={{ padding: "4px 0" }}>
            <div className="text-xs text-dim" style={{ padding: "2px 0" }}>
              State Machines ({objectMachines(state.objects).length})
            </div>
            <div className="asset-grid">
              {objectMachines(state.objects).map((mch) => {
                const sel =
                  map.selected?.kind === "machine" && map.selected.id === mch.id;
                const initial = resolveMachineState(mch);
                return (
                  <div
                    key={mch.id}
                    className="col"
                    style={{ alignItems: "center", gap: 2, width: THUMB + 8 }}
                  >
                    <MachineThumb
                      machine={mch}
                      animations={state.animations}
                      spriteById={spriteById}
                      imageMap={imageMap}
                      selected={sel}
                      title={`${mch.name}${initial ? ` — ${initial.name}` : ""}`}
                      onClick={() =>
                        mapDispatch({
                          type: "SELECT_PALETTE",
                          selection: sel ? null : { kind: "machine", id: mch.id },
                        })
                      }
                    />
                    <span
                      className="text-xs text-dim"
                      style={{
                        maxWidth: THUMB + 8,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {mch.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
