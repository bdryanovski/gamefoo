import React from "react";
import type { AppState, AppAction, ToolType } from "../types";
import { Icon, type IconName, ICON } from "./Icon";
import { Tooltip } from "./Tooltip";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

interface ToolDef {
  key: ToolType;
  icon: IconName;
  label: string;
  shortcut: string;
}

const TOOLS: ToolDef[] = [
  { key: "select", icon: "tool-select", label: "Select", shortcut: "V" },
  { key: "grid-pick", icon: "tool-grid", label: "Grid Pick", shortcut: "G" },
  { key: "region", icon: "tool-region", label: "Draw Region", shortcut: "R" },
  { key: "pan", icon: "tool-pan", label: "Pan", shortcut: "H" },
];

export function Toolbar({ state, dispatch }: Props) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const map: Record<string, ToolType> = { v: "select", g: "grid-pick", r: "region", h: "pan" };
      const tool = map[e.key.toLowerCase()];
      if (tool) dispatch({ type: "SET_TOOL", tool });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        {TOOLS.map((t) => (
          <Tooltip key={t.key} label={t.label} shortcut={t.shortcut} side="right">
            <button
              className={`tool-btn ${state.activeTool === t.key ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_TOOL", tool: t.key })}
              aria-label={t.label}
            >
              <Icon name={t.icon} size={ICON.md} />
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="toolbar-sep" />

      <div className="toolbar-group">
        <Tooltip label="Toggle Grid" side="right">
          <button
            className={`tool-btn ${state.grid.enabled ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_GRID", grid: { enabled: !state.grid.enabled } })}
            aria-label="Toggle grid"
          >
            <Icon name="tool-grid" size={ICON.md} />
          </button>
        </Tooltip>
      </div>

      <div className="toolbar-sep" />

      <div className="toolbar-group">
        <Tooltip label="Zoom In" shortcut="+" side="right">
          <button
            className="tool-btn"
            onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom * 1.25 })}
            aria-label="Zoom in"
          >
            <Icon name="add" size={ICON.md} />
          </button>
        </Tooltip>
        <Tooltip label="Zoom Out" shortcut="-" side="right">
          <button
            className="tool-btn"
            onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom / 1.25 })}
            aria-label="Zoom out"
          >
            <Icon name="subtract" size={ICON.md} />
          </button>
        </Tooltip>
        <Tooltip label="Reset Zoom" shortcut="0" side="right">
          <button
            className="tool-btn"
            onClick={() => {
              dispatch({ type: "SET_ZOOM", zoom: 2 });
              dispatch({ type: "SET_PAN", x: 0, y: 0 });
            }}
            aria-label="Reset zoom"
          >
            <Icon name="zoom-reset" size={ICON.md} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
