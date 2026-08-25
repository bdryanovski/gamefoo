import React, { useState, useMemo, useCallback } from "react";
import type { AppState } from "../types";
import {
  exportMap,
  exportMapScreens,
  exportMapObjects,
  mapExportFiles,
} from "./mapExport";
import { downloadJSON } from "../utils/export";
import { exportProjectFiles } from "../utils/storage";

interface Props {
  state: AppState;
  projectId: string | null;
}

type MapExportFormat = "screens" | "objects" | "full" | "project";

const FORMAT_INFO: Record<
  MapExportFormat,
  { label: string; desc: string; ext: string }
> = {
  screens: {
    label: "Screens (simple)",
    desc: 'Screens keyed "x,y" → fill + tiles by sprite NAME. Minimal, for custom wrappers.',
    ext: ".map.screens.json",
  },
  objects: {
    label: "Objects (world space)",
    desc: "Flat list of placements: name, screen, local + world px, size, source rect, z-order. For entity spawners.",
    ext: ".map.objects.json",
  },
  full: {
    label: "Full Map",
    desc: "Everything: images, sprites, screens, defaults, placements. ID-based with names.",
    ext: ".map.json",
  },
  project: {
    label: "Project File",
    desc: "Full editor state. Re-import into the editor. Not for engine use.",
    ext: ".map.project.json",
  },
};

export function MapExportPanel({ state, projectId }: Props) {
  const [format, setFormat] = useState<MapExportFormat>("screens");
  const [saving, setSaving] = useState(false);
  const [savedPaths, setSavedPaths] = useState<Record<string, string> | null>(
    null,
  );

  const baseName = state.projectName.replace(/\s+/g, "_").toLowerCase();
  const map = state.map;

  const data = useMemo(() => {
    switch (format) {
      case "screens":
        return exportMapScreens(state);
      case "objects":
        return exportMapObjects(state);
      case "full":
        return exportMap(state);
      case "project":
        return state;
    }
  }, [format, state]);

  const preview = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const handleDownload = useCallback(() => {
    downloadJSON(data, `${baseName}${FORMAT_INFO[format].ext}`);
  }, [data, format, baseName]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(preview);
  }, [preview]);

  const handleSaveToServer = useCallback(async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const paths = await exportProjectFiles(projectId, mapExportFiles(state));
      setSavedPaths(paths);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Failed to save export files to server");
    } finally {
      setSaving(false);
    }
  }, [projectId, state]);

  const screenCount = Object.keys(map.screens).length;
  const placementCount = Object.values(map.screens).reduce(
    (n, s) => n + s.placements.length,
    0,
  );

  return (
    <div className="col gap-md">
      {/* Format selection */}
      <div className="section">
        <div className="section-title">Export Format</div>
        {(Object.keys(FORMAT_INFO) as MapExportFormat[]).map((f) => (
          <div key={f} className="field-row">
            <label className="checkbox-row">
              <input
                type="radio"
                name="map-format"
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
          <div>Screens: {screenCount}</div>
          <div>Placements: {placementCount}</div>
          <div>Sprites (library): {state.sprites.length}</div>
          <div>Images (library): {state.images.length}</div>
          <div>
            Screen: {map.screenCols}×{map.screenRows} blocks ·{" "}
            {map.blockSize}px blocks
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="export-actions">
        <div className="row" style={{ gap: 4 }}>
          <button
            className="btn"
            onClick={handleDownload}
            style={{ flex: 1 }}
            disabled={screenCount === 0}
          >
            Download JSON
          </button>
          <button className="btn" onClick={handleCopy}>
            Copy
          </button>
        </div>
        <button
          className="btn"
          style={{ width: "100%", marginTop: 4 }}
          onClick={handleSaveToServer}
          disabled={!projectId || saving || screenCount === 0}
          title={
            projectId
              ? "Write all 4 export files to public/exports/{projectId}/"
              : "Save the project first (title bar Save)"
          }
        >
          {saving ? "Saving..." : "Save Export Files to Server"}
        </button>
        {!projectId && (
          <div className="text-xs text-dim" style={{ padding: "2px 0" }}>
            Save the project first to enable server export.
          </div>
        )}
      </div>

      {savedPaths && (
        <div className="section">
          <div className="section-title">Saved to Server</div>
          <div className="text-xs" style={{ padding: 4, wordBreak: "break-all" }}>
            {Object.entries(savedPaths).map(([filename, path]) => (
              <div key={filename}>
                <a href={path} target="_blank" rel="noreferrer">
                  {path}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="section">
        <div className="section-title">JSON Preview</div>
        <pre className="export-preview">{preview}</pre>
      </div>
    </div>
  );
}
