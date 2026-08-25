import React, { useState, useEffect, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import type { MapAction, MapToolType } from "./types";
import { MapCanvas } from "./MapCanvas";
import { MapPalettePanel } from "./MapPalettePanel";
import { MapExportPanel } from "./MapExportPanel";

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

const MAP_TOOLS: { key: MapToolType; icon: string; title: string }[] = [
  { key: "paint", icon: "▣", title: "Paint (P) — place selected sprite" },
  { key: "erase", icon: "✕", title: "Erase (E) — remove placements" },
  { key: "fill", icon: "▒", title: "Fill (F) — set screen default tile" },
  { key: "pick", icon: "◌", title: "Pick (I) — select sprite under cursor" },
  { key: "move", icon: "✜", title: "Move (M) — drag a placement to reposition it" },
  { key: "pan", icon: "✥", title: "Pan (H) — drag to move view (or Space)" },
];

const KEY_MAP: Record<string, MapToolType> = {
  p: "paint",
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

  // ── Tool keyboard shortcuts ────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      const tool = KEY_MAP[e.key.toLowerCase()];
      if (tool) mapDispatch({ type: "SET_TOOL", tool });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mapDispatch]);

  const selectedSpriteName = map.selectedSpriteId
    ? (state.sprites.find((s) => s.id === map.selectedSpriteId)?.name ?? "?")
    : "—";

  const screenCount = Object.keys(map.screens).length;

  return (
    <div className="app-layout">
      {/* Title bar — shared project lifecycle */}
      <div className="title-bar">
        <span className="title-bar__name">
          GameFoo Map Editor — {state.projectName}
          {projectId ? "" : " (unsaved)"}
        </span>
        <button className="btn btn-sm title-btn" onClick={onOpenProjects}>
          Projects
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
              {t.icon}
            </button>
          ))}
          <div className="toolbar-sep" />
          <button
            className="tool-btn"
            title="Zoom out"
            onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom / 1.25 })}
          >
            −
          </button>
          <button
            className="tool-btn"
            title="Reset view"
            onClick={() => {
              mapDispatch({ type: "SET_ZOOM", zoom: 0.5 });
              mapDispatch({ type: "SET_PAN", x: 40, y: 40 });
            }}
          >
            ⊙
          </button>
          <button
            className="tool-btn"
            title="Zoom in"
            onClick={() => mapDispatch({ type: "SET_ZOOM", zoom: map.zoom * 1.25 })}
          >
            +
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
