import React, { useState, useEffect, useCallback } from "react";
import type { AppState } from "../types";
import {
  exportAtlasForImage,
  exportGridForImage,
  exportFull,
  exportSprites,
  exportAnimations,
  spritesOfImage,
} from "../utils/export";
import { exportProjectFiles } from "../utils/storage";

interface Props {
  state: AppState;
  projectId: string;
  onClose: () => void;
}

interface ExportFile {
  filename: string;
  label: string;
  data: unknown;
  serverPath?: string;
  copied?: boolean;
}

export function SaveScreen({ state, projectId, onClose }: Props) {
  const [files, setFiles] = useState<ExportFile[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savedToServer, setSavedToServer] = useState(false);
  const [saving, setSaving] = useState(false);

  const baseName = state.projectName.replace(/\s+/g, "_").toLowerCase();

  useEffect(() => {
    const full = exportFull(state);

    const list: ExportFile[] = [
      {
        filename: `${baseName}.sprites.json`,
        label: "Sprites Export (name + coordinates + size)",
        data: exportSprites(state),
      },
      {
        filename: `${baseName}.animations.json`,
        label: "Animations Export (frame order, duration, loop)",
        data: exportAnimations(state),
      },
    ];

    // One atlas (+ grid) per image that has sprites
    for (const img of state.images) {
      if (spritesOfImage(state, img.id).length === 0) continue;
      const imgBase = img.name
        .replace(/\.[^.]+$/, "")
        .replace(/\s+/g, "_")
        .toLowerCase();
      list.push({
        filename: `${baseName}.${imgBase}.atlas.json`,
        label: `Atlas Export — ${img.name} (Sprite.fromAtlas)`,
        data: exportAtlasForImage(state, img),
      });
      if (state.grid.enabled) {
        list.push({
          filename: `${baseName}.${imgBase}.grid.json`,
          label: `Grid Export — ${img.name} (Sprite.fromGrid)`,
          data: exportGridForImage(state, img),
        });
      }
    }

    list.push({
      filename: `${baseName}.full.json`,
      label: "Full Export (everything)",
      data: full,
    });

    list.push({
      filename: `${baseName}.project.json`,
      label: "Project File (re-import into editor)",
      data: state,
    });

    setFiles(list);
  }, [state, baseName]);

  const handleSaveToServer = useCallback(async () => {
    setSaving(true);
    try {
      const fileMap: Record<string, unknown> = {};
      for (const f of files) {
        fileMap[f.filename] = f.data;
      }
      const paths = await exportProjectFiles(projectId, fileMap);
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          serverPath: paths[f.filename] || undefined,
        })),
      );
      setSavedToServer(true);
    } catch (e) {
      console.error("Export failed:", e);
      alert("Failed to save export files to server");
    } finally {
      setSaving(false);
    }
  }, [files, projectId]);

  const handleCopy = useCallback((filename: string, data: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setFiles((prev) =>
      prev.map((f) =>
        f.filename === filename ? { ...f, copied: true } : f,
      ),
    );
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.filename === filename ? { ...f, copied: false } : f,
        ),
      );
    }, 2000);
  }, []);

  const handleDownload = useCallback((filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title">
          <span>Save & Export — {state.projectName}</span>
          <button className="btn btn-sm" onClick={onClose}>
            X
          </button>
        </div>

        <div className="modal-body">
          {/* Status */}
          <div className="save-status raised p-4 mb-8">
            <div>Project saved to server.</div>
            {state.images.map((img) => (
              <div key={img.id} className="text-xs text-dim mt-4">
                Image: {img.name} ({img.width}x{img.height}) — stored at{" "}
                <code>{img.url}</code>
              </div>
            ))}
          </div>

          {/* Save to server button */}
          <div className="row gap-md mb-8">
            <button
              className="btn"
              onClick={handleSaveToServer}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : savedToServer
                  ? "Re-save Export Files to Server"
                  : "Save Export Files to Server"}
            </button>
            {savedToServer && (
              <span className="text-xs" style={{ color: "#008000" }}>
                Files saved to /public/exports/{projectId}/
              </span>
            )}
          </div>

          {/* Files */}
          <div className="section-title">Generated Files</div>

          {files.map((f) => (
            <div key={f.filename} className="export-file-card sunken mb-8">
              <div className="export-file-header">
                <div>
                  <div className="text-sm" style={{ fontWeight: "bold" }}>
                    {f.filename}
                  </div>
                  <div className="text-xs text-dim">{f.label}</div>
                  {f.serverPath && (
                    <div className="text-xs" style={{ color: "#008000" }}>
                      Server: {f.serverPath}
                    </div>
                  )}
                </div>
                <div className="row gap-sm">
                  <button
                    className="btn btn-sm"
                    onClick={() => handleCopy(f.filename, f.data)}
                  >
                    {f.copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDownload(f.filename, f.data)}
                  >
                    Download
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setExpanded(
                        expanded === f.filename ? null : f.filename,
                      )
                    }
                  >
                    {expanded === f.filename ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {expanded === f.filename && (
                <pre className="export-preview">
                  {JSON.stringify(f.data, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {/* Usage instructions */}
          <div className="section-title mt-8">How to Use in Game Engine</div>
          <div className="usage-guide sunken p-4">
            <div className="text-sm" style={{ fontWeight: "bold" }}>
              Atlas format → Sprite.fromAtlas()
            </div>
            <pre className="usage-code">
{`const res = await fetch("assets/${baseName}.atlas.json");
const atlas = await res.json();
const image = await Asset.load("assets/" + atlas.meta.image);
const sprite = Sprite.fromAtlas(image, atlas.frames, atlas.animations);

const render = new SpriteRender(entity, sprite);
render.play("idle");`}
            </pre>

            {state.grid.enabled && (
              <>
                <div
                  className="text-sm mt-4"
                  style={{ fontWeight: "bold" }}
                >
                  Grid format → Sprite.fromGrid()
                </div>
                <pre className="usage-code">
{`const res = await fetch("assets/${baseName}.grid.json");
const data = await res.json();
const image = await Asset.load("assets/" + data.meta.image);
const sprite = Sprite.fromGrid(image, data.grid, data.animations);`}
                </pre>
              </>
            )}

            <div className="text-sm mt-4" style={{ fontWeight: "bold" }}>
              Full format → mixed usage
            </div>
            <pre className="usage-code">
{`const res = await fetch("assets/${baseName}.full.json");
const data = await res.json();
const image = await Asset.load("assets/" + data.meta.image);

// Sprite from atlas frames
const sprite = Sprite.fromAtlas(image, data.frames, data.animations);

// Access object definitions
const config = data.objects["hero"];
console.log(config.properties);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
