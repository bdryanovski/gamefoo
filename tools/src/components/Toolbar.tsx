import React from "react";
import type { AppState, AppAction, ToolType } from "../types";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const TOOLS: { key: ToolType; icon: string; title: string }[] = [
  { key: "select", icon: "⇱", title: "Select (V)" },
  { key: "grid-pick", icon: "▦", title: "Grid Pick (G)" },
  { key: "region", icon: "▭", title: "Draw Region (R)" },
  { key: "pan", icon: "✥", title: "Pan (H)" },
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
          {t.icon}
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
        #
      </button>

      <div className="toolbar-sep" />

      <button
        className="tool-btn"
        title="Zoom In (+)"
        onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom * 1.25 })}
      >
        +
      </button>
      <button
        className="tool-btn"
        title="Zoom Out (-)"
        onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom / 1.25 })}
      >
        −
      </button>
      <button
        className="tool-btn"
        title="Reset Zoom (0)"
        onClick={() => {
          dispatch({ type: "SET_ZOOM", zoom: 2 });
          dispatch({ type: "SET_PAN", x: 0, y: 0 });
        }}
      >
        ⊙
      </button>
    </div>
  );
}
