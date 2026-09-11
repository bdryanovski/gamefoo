import React from "react";
import type { AppState } from "../types";

interface Props {
  state: AppState;
  mousePos: { x: number; y: number };
}

export function StatusBar({ state, mousePos }: Props) {
  const activeImage = state.images.find((i) => i.id === state.activeImageId);
  const imgInfo = activeImage
    ? `${activeImage.name} (${activeImage.width}×${activeImage.height})`
    : "No image";

  return (
    <div className="status-bar">
      <div className="status-cell flex">{imgInfo}</div>
      <div className="status-cell">
        Tool: {state.activeTool}
      </div>
      <div className="status-cell">
        Pos: {mousePos.x}, {mousePos.y}
      </div>
      <div className="status-cell">
        Zoom: {Math.round(state.zoom * 100)}%
      </div>
      <div className="status-cell">
        Sprites: {state.sprites.length}
      </div>
      <div className="status-cell">
        Anims: {state.animations.length}
      </div>
    </div>
  );
}
