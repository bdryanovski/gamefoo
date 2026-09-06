import React from "react";
import type { AppState, AppAction, ToolType } from "../types";
import { Icon, type IconName } from "./Icon";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const TOOLS: { key: ToolType; icon: IconName; title: string }[] = [
  { key: "select", icon: "tool-select", title: "Select (V)" },
  { key: "grid-pick", icon: "tool-grid", title: "Grid Pick (G)" },
  { key: "region", icon: "tool-region", title: "Draw Region (R)" },
  { key: "pan", icon: "tool-pan", title: "Pan (H)" },
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
      {TOOLS.map((t) => (
        <button
          key={t.key}
          className={`tool-btn ${state.activeTool === t.key ? "active" : ""}`}
          title={t.title}
          onClick={() => dispatch({ type: "SET_TOOL", tool: t.key })}
        >
          <Icon name={t.icon} size={16} />
        </button>
      ))}

      <div className="toolbar-sep" />

      <button
        className={`tool-btn ${state.grid.enabled ? "active" : ""}`}
        title="Toggle Grid"
        onClick={() =>
          dispatch({ type: "SET_GRID", grid: { enabled: !state.grid.enabled } })
        }
      >
        <Icon name="tool-grid" size={16} />
      </button>

      <div className="toolbar-sep" />

      <button
        className="tool-btn"
        title="Zoom In (+)"
        onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom * 1.25 })}
      >
        <Icon name="add" size={16} />
      </button>
      <button
        className="tool-btn"
        title="Zoom Out (-)"
        onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom / 1.25 })}
      >
        <Icon name="subtract" size={16} />
      </button>
      <button
        className="tool-btn"
        title="Reset Zoom (0)"
        onClick={() => {
          dispatch({ type: "SET_ZOOM", zoom: 2 });
          dispatch({ type: "SET_PAN", x: 0, y: 0 });
        }}
      >
        <Icon name="zoom-reset" size={16} />
      </button>
    </div>
  );
}
