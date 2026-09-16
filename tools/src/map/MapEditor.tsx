import React, { useState, useEffect, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import { objectMachines } from "../types";
import type { MapAction, MapToolType } from "./types";
import { MapCanvas } from "./MapCanvas";
import { MapPalettePanel } from "./MapPalettePanel";
import { MapExportPanel } from "./MapExportPanel";
import { Icon, type IconName, ICON } from "../components/Icon";
import { Tooltip } from "../components/Tooltip";
import { EditorHeader } from "../components/EditorHeader";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  mapDispatch: (a: MapAction) => void;
  imageMap: Map<string, HTMLImageElement>;
  projectId: string | null;
  saving: boolean;
  onSave: (mode?: "save" | "quick") => void;
  onOpenProjects: () => void;
}

const MAP_TOOLS: { key: MapToolType; icon: IconName; label: string; shortcut: string; tip: string }[] = [
  { key: "select", icon: "tool-select", label: "Select", shortcut: "C", tip: "Click a placed object to edit its placement, orientation, state & properties" },
  { key: "paint", icon: "tool-paint", label: "Paint", shortcut: "P", tip: "Place the selected sprite" },
  { key: "stream", icon: "tool-stream", label: "Stream", shortcut: "S", tip: "Toggle continuous painting; paints wherever the mouse moves" },
  { key: "erase", icon: "tool-erase", label: "Erase", shortcut: "E", tip: "Remove placements" },
  { key: "fill", icon: "tool-fill", label: "Fill", shortcut: "F", tip: "Set the screen default tile" },
  { key: "pick", icon: "tool-pick", label: "Pick", shortcut: "I", tip: "Sample a sprite/object into the paint brush" },
  { key: "move", icon: "tool-move", label: "Move", shortcut: "M", tip: "Drag a placement to reposition it" },
  { key: "text", icon: "draw", label: "Text", shortcut: "T", tip: "Drop a free-positioned text label (not grid-snapped)" },
  { key: "pan", icon: "tool-pan", label: "Pan", shortcut: "H", tip: "Drag to move the view (or hold Space)" },
];

const KEY_MAP: Record<string, MapToolType> = {
  p: "paint",
  s: "stream",
  e: "erase",
  f: "fill",
  i: "pick",
  m: "move",
  c: "select",
  h: "pan",
  t: "text",
};

type MapTabType = "palette" | "export";

export function MapEditor({
  state,
  dispatch,
  mapDispatch,
  imageMap,
  projectId,
  saving,
  onSave,
  onOpenProjects,
}: Props) {
  const map = state.map;
  const [tab, setTab] = useState<MapTabType>("palette");
  const [status, setStatus] = useState<{
    screenKey: string | null;
    block: { col: number; row: number } | null;
  }>({ screenKey: null, block: null });
  const [activeScreenKey, setActiveScreenKey] = useState<string | null>(null);

  // ── Tool shortcuts + placement transform shortcuts ────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      const tool = KEY_MAP[k];
      if (tool) {
        mapDispatch({ type: "SET_TOOL", tool });
        return;
      }
      if (k === "[") {
        mapDispatch({ type: "SET_ACTIVE_LEVEL", level: state.map.activeLevel - 1 });
        return;
      }
      if (k === "]") {
        mapDispatch({ type: "SET_ACTIVE_LEVEL", level: state.map.activeLevel + 1 });
        return;
      }
      // Placement transforms when one is selected.
      const pid = state.map.selectedPlacementId;
      if (!pid || (k !== "r" && k !== "x" && k !== "y")) return;
      for (const [key, screen] of Object.entries(state.map.screens)) {
        const p = screen.placements.find((pl) => pl.id === pid);
        if (!p) continue;
        if (k === "r") {
          mapDispatch({
            type: "UPDATE_PLACEMENT",
            screenKey: key,
            id: pid,
            updates: { rotation: ((p.rotation ?? 0) + 90) % 360 },
          });
        } else if (k === "x") {
          mapDispatch({
            type: "UPDATE_PLACEMENT",
            screenKey: key,
            id: pid,
            updates: { flipX: !p.flipX },
          });
        } else {
          mapDispatch({
            type: "UPDATE_PLACEMENT",
            screenKey: key,
            id: pid,
            updates: { flipY: !p.flipY },
          });
        }
        return;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mapDispatch, state.map]);

  const sel = map.selected;
  const selectedSpriteName = !sel
    ? "—"
    : sel.kind === "sprite"
      ? (state.sprites.find((s) => s.id === sel.id)?.name ?? "?")
      : sel.kind === "animation"
        ? (state.animations.find((a) => a.id === sel.id)?.name ?? "?")
        : sel.kind === "text"
          ? `"${sel.text}"`
          : (objectMachines(state.objects).find((m) => m.id === sel.id)?.name ?? "?");

  const screenCount = Object.keys(map.screens).length;

  return (
    <div className="app-layout">
      <EditorHeader
        icon="map-editor"
        title="Map Editor"
        projectName={state.projectName}
        unsaved={!projectId}
        undoCount={state.history.length}
        onUndo={() => dispatch({ type: "UNDO" })}
        onOpenProjects={onOpenProjects}
        onSave={onSave}
        saving={saving}
      />

      {/* Main area */}
      <div className="main-area">
        <div className="toolbar">
          <div className="toolbar-group">
            {MAP_TOOLS.map((t) => (
              <Tooltip key={t.key} label={t.tip} shortcut={t.shortcut} side="right">
                <button
                  className={`tool-btn ${map.activeTool === t.key ? "active" : ""}`}
                  onClick={() => mapDispatch({ type: "SET_TOOL", tool: t.key })}
                  aria-label={t.label}
                >
                  <Icon name={t.icon} size={ICON.md} />
                </button>
              </Tooltip>
            ))}
          </div>
          <div className="toolbar-sep" />
          <div className="toolbar-group">
            <Tooltip label="Zoom In" shortcut="+" side="right">
              <button
                className="tool-btn"
                onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom * 1.25 })}
                aria-label="Zoom in"
              >
                <Icon name="add" size={ICON.md} />
              </button>
            </Tooltip>
            <Tooltip label="Zoom Out" shortcut="-" side="right">
              <button
                className="tool-btn"
                onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom / 1.25 })}
                aria-label="Zoom out"
              >
                <Icon name="subtract" size={ICON.md} />
              </button>
            </Tooltip>
            <Tooltip label="Reset View" side="right">
              <button
                className="tool-btn"
                onClick={() => {
                  mapDispatch({ type: "SET_ZOOM", zoom: 0.5 });
                  mapDispatch({ type: "SET_PAN", x: 40, y: 40 });
                }}
                aria-label="Reset view"
              >
                <Icon name="zoom-reset" size={ICON.md} />
              </button>
            </Tooltip>
          </div>
        </div>

        <MapCanvas
          state={state}
          map={map}
          mapDispatch={mapDispatch}
          imageMap={imageMap}
          onStatus={setStatus}
          onActiveScreen={setActiveScreenKey}
        />

        <div className="right-panel">
          <div className="panel-tabs">
            <div
              className={`panel-tab ${tab === "palette" ? "active" : ""}`}
              onClick={() => setTab("palette")}
            >
              Palette
            </div>
            <div
              className={`panel-tab ${tab === "export" ? "active" : ""}`}
              onClick={() => setTab("export")}
            >
              Export
            </div>
          </div>
          <div className="panel-content">
            {tab === "palette" && (
              <MapPalettePanel
                state={state}
                dispatch={dispatch}
                mapDispatch={mapDispatch}
                activeScreenKey={activeScreenKey}
                imageMap={imageMap}
              />
            )}
            {tab === "export" && (
              <MapExportPanel state={state} projectId={projectId} />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <div className="status-cell flex">
          {state.projectName} · block {map.blockSize}px · screen{" "}
          {map.screenCols}×{map.screenRows}
        </div>
        <div className="status-cell">Tool: {map.activeTool}</div>
        <div className="status-cell">
          Screen: {status.screenKey ?? "—"}
          {status.block ? ` · block ${status.block.col},${status.block.row}` : ""}
        </div>
        <div className="status-cell">Sprite: {selectedSpriteName}</div>
        <div className="status-cell">Zoom: {Math.round(map.zoom * 100)}%</div>
        <div className="status-cell">Screens: {screenCount}</div>
        <div className="status-cell">Sprites: {state.sprites.length}</div>
      </div>
    </div>
  );
}
