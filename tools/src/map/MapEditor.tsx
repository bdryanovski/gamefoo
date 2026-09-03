import React, { useState, useEffect, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import { objectMachines } from "../types";
import type { MapAction, MapToolType } from "./types";
import { MapCanvas } from "./MapCanvas";
import { MapPalettePanel } from "./MapPalettePanel";
import { MapExportPanel } from "./MapExportPanel";
import { Icon, type IconName } from "../components/Icon";

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

const MAP_TOOLS: { key: MapToolType; icon: IconName; title: string }[] = [
  { key: "paint", icon: "tool-paint", title: "Paint (P) — place selected sprite" },
  { key: "stream", icon: "tool-stream", title: "Stream (S) — click to toggle continuous painting; paints wherever the mouse moves" },
  { key: "erase", icon: "tool-erase", title: "Erase (E) — remove placements" },
  { key: "fill", icon: "tool-fill", title: "Fill (F) — set screen default tile" },
  { key: "pick", icon: "tool-pick", title: "Pick (I) — select sprite under cursor" },
  { key: "move", icon: "tool-move", title: "Move (M) — drag a placement to reposition it" },
  { key: "pan", icon: "tool-pan", title: "Pan (H) — drag to move view (or Space)" },
];

const KEY_MAP: Record<string, MapToolType> = {
  p: "paint",
  s: "stream",
  e: "erase",
  f: "fill",
  i: "pick",
  m: "move",
  h: "pan",
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

  const selectedSpriteName = map.selected
    ? map.selected.kind === "sprite"
      ? (state.sprites.find((s) => s.id === map.selected!.id)?.name ?? "?")
      : map.selected.kind === "animation"
        ? (state.animations.find((a) => a.id === map.selected!.id)?.name ?? "?")
        : (objectMachines(state.objects).find((m) => m.id === map.selected!.id)?.name ?? "?")
    : "—";

  const screenCount = Object.keys(map.screens).length;

  return (
    <div className="app-layout">
      {/* Title bar — shared project lifecycle */}
      <div className="title-bar">
        <span className="title-bar__icon"><Icon name="map-editor" size={15} /></span>
        <span className="title-bar__name">
          GameFoo Map Editor — {state.projectName}
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
          <Icon name="undo" size={13} /> Undo{state.history.length > 0 ? ` (${state.history.length})` : ""}
        </button>
        <button
          className="btn btn-sm title-btn"
          onClick={() => onSave("quick")}
          disabled={saving}
          title="QuickSave — Ctrl/Cmd+S (no export screen)"
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

      {/* Main area */}
      <div className="main-area">
        <div className="toolbar">
          {MAP_TOOLS.map((t) => (
            <button
              key={t.key}
              className={`tool-btn ${map.activeTool === t.key ? "active" : ""}`}
              title={t.title}
              onClick={() => mapDispatch({ type: "SET_TOOL", tool: t.key })}
            >
              <Icon name={t.icon} size={16} />
            </button>
          ))}
          <div className="toolbar-sep" />
          <button
            className="tool-btn"
            title="Zoom out"
            onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom / 1.25 })}
          >
            <Icon name="subtract" size={16} />
          </button>
          <button
            className="tool-btn"
            title="Reset view"
            onClick={() => {
              mapDispatch({ type: "SET_ZOOM", zoom: 0.5 });
              mapDispatch({ type: "SET_PAN", x: 40, y: 40 });
            }}
          >
            <Icon name="zoom-reset" size={16} />
          </button>
          <button
            className="tool-btn"
            title="Zoom in"
            onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom * 1.25 })}
          >
            <Icon name="add" size={16} />
          </button>
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
