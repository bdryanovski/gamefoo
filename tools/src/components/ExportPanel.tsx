import React, { useState, useMemo, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import { exportAtlasForImage, exportGridForImage, exportFull, exportProject, exportSprites, exportAnimations, downloadJSON, spritesOfImage } from "../utils/export";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type ExportFormat = "sprites" | "animations" | "atlas" | "grid" | "full" | "project";

const FORMAT_INFO: Record<ExportFormat, { label: string; desc: string }> = {
  sprites: {
    label: "Sprites (simple)",
    desc: "Name → { x, y, width, height }. Minimal — write your own wrapper.",
  },
  animations: {
    label: "Animations",
    desc: "Animations only: ordered frame names, duration, loop.",
  },
  atlas: {
    label: "Atlas (fromAtlas)",
    desc: "Named sprite regions + animations for the ACTIVE image. Use with Sprite.fromAtlas().",
  },
  grid: {
    label: "Grid (fromGrid)",
    desc: "Uniform grid config + named frame indices for the ACTIVE image. Use with Sprite.fromGrid().",
  },
  full: {
    label: "Full Export",
    desc: "Everything: frames, animations, objects, metadata. Comprehensive format.",
  },
  project: {
    label: "Project File",
    desc: "Save/reload project state in the editor. Not for engine consumption.",
  },
};

export function ExportPanel({ state, dispatch }: Props) {
  const [format, setFormat] = useState<ExportFormat>("sprites");

  const activeImage =
    state.images.find((i) => i.id === state.activeImageId) ??
    state.images.find((i) => spritesOfImage(state, i.id).length > 0) ??
    state.images[0] ??
    null;

  const imageBase = activeImage
    ? activeImage.name.replace(/\.[^.]+$/, "").replace(/\s+/g, "_").toLowerCase()
    : "image";

  const preview = useMemo(() => {
    switch (format) {
      case "sprites":
        return JSON.stringify(exportSprites(state), null, 2);
      case "animations":
        return JSON.stringify(exportAnimations(state), null, 2);
      case "atlas":
        return JSON.stringify(
          activeImage ? exportAtlasForImage(state, activeImage) : {},
          null,
          2,
        );
      case "grid":
        return JSON.stringify(
          activeImage ? exportGridForImage(state, activeImage) : {},
          null,
          2,
        );
      case "full":
        return JSON.stringify(exportFull(state), null, 2);
      case "project":
        return exportProject(state);
    }
  }, [format, state, activeImage]);

  const handleDownload = useCallback(() => {
    const baseName = state.projectName.replace(/\s+/g, "_").toLowerCase();
    switch (format) {
      case "sprites":
        downloadJSON(exportSprites(state), `${baseName}.sprites.json`);
        break;
      case "animations":
        downloadJSON(exportAnimations(state), `${baseName}.animations.json`);
        break;
      case "atlas":
        if (activeImage) {
          downloadJSON(
            exportAtlasForImage(state, activeImage),
            `${baseName}.${imageBase}.atlas.json`,
          );
        }
        break;
      case "grid":
        if (activeImage) {
          downloadJSON(
            exportGridForImage(state, activeImage),
            `${baseName}.${imageBase}.grid.json`,
          );
        }
        break;
      case "full":
        downloadJSON(exportFull(state), `${baseName}.full.json`);
        break;
      case "project":
        downloadJSON(JSON.parse(exportProject(state)), `${baseName}.project.json`);
        break;
    }
  }, [format, state, activeImage, imageBase]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(preview);
  }, [preview]);

  return (
    <div className="col gap-md">
      {/* Project name */}
      <div className="section">
        <div className="section-title">Project</div>
        <div className="field-row">
          <span className="field-label">Name:</span>
          <input
            type="text"
            className="input input-full"
            value={state.projectName}
            onChange={(e) => dispatch({ type: "SET_PROJECT_NAME", name: e.target.value })}
          />
        </div>
      </div>

      {/* Format selection */}
      <div className="section">
        <div className="section-title">Export Format</div>
        {(Object.keys(FORMAT_INFO) as ExportFormat[]).map((f) => (
          <div key={f} className="field-row">
            <label className="checkbox-row">
              <input
                type="radio"
                name="format"
                checked={format === f}
                onChange={() => setFormat(f)}
                style={{ appearance: "auto", width: 13, height: 13 }}
              />
              <div>
                <div className="text-sm">{FORMAT_INFO[f].label}</div>
                <div className="text-xs text-dim">{FORMAT_INFO[f].desc}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="section">
        <div className="section-title">Summary</div>
        <div className="text-xs" style={{ padding: 4 }}>
          <div>Sprites: {state.sprites.length}</div>
          <div>Animations: {state.animations.length}</div>
          <div>Objects: {state.objects.length}</div>
          <div>Images: {state.images.length}</div>
          {activeImage && (
            <div>
              Active image: {activeImage.name} ({activeImage.width}×
              {activeImage.height}) — {spritesOfImage(state, activeImage.id).length}{" "}
              sprites
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="export-actions">
        <div className="row" style={{ gap: 4 }}>
          <button className="btn" onClick={handleDownload} style={{ flex: 1 }}>
            Download JSON
          </button>
          <button className="btn" onClick={handleCopy}>
            Copy
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="section">
        <div className="section-title">JSON Preview</div>
        <pre className="export-preview">{preview}</pre>
      </div>
    </div>
  );
}
