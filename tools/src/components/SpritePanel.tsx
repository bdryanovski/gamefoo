import React, { useRef, useEffect, useCallback } from "react";
import type { AppState, AppAction, SpriteRegion } from "../types";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  image: HTMLImageElement | null;
}

function SpriteThumb({ sprite, image }: { sprite: SpriteRegion; image: HTMLImageElement | null }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 20;
    canvas.height = 20;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 20, 20);

    const scale = Math.min(20 / sprite.width, 20 / sprite.height);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    const dx = (20 - dw) / 2;
    const dy = (20 - dh) / 2;
    ctx.drawImage(image, sprite.x, sprite.y, sprite.width, sprite.height, dx, dy, dw, dh);
  }, [sprite, image]);

  return <canvas ref={ref} className="sprite-item__preview" width={20} height={20} />;
}

export function SpritePanel({ state, dispatch, image }: Props) {
  const selected = state.sprites.find((s) => state.selectedSpriteIds.includes(s.id)) ?? null;

  const updateSelected = useCallback(
    (updates: Partial<SpriteRegion>) => {
      if (!selected) return;
      dispatch({ type: "UPDATE_SPRITE", id: selected.id, updates });
    },
    [selected, dispatch],
  );

  return (
    <div className="col gap-md">
      {/* Grid settings */}
      <div className="section">
        <div className="section-title">Grid Settings</div>
        <div className="field-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={state.grid.enabled}
              onChange={(e) => dispatch({ type: "SET_GRID", grid: { enabled: e.target.checked } })}
            />
            Enable Grid
          </label>
        </div>
        {state.grid.enabled && (
          <>
            <div className="field-row">
              <span className="field-label">Cell W:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.cellWidth}
                min={1}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { cellWidth: +e.target.value || 1 } })}
              />
              <span className="field-label">H:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.cellHeight}
                min={1}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { cellHeight: +e.target.value || 1 } })}
              />
            </div>
            <div className="field-row">
              <span className="field-label">Offset X:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.offsetX}
                min={0}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { offsetX: +e.target.value || 0 } })}
              />
              <span className="field-label">Y:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.offsetY}
                min={0}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { offsetY: +e.target.value || 0 } })}
              />
            </div>
            <div className="field-row">
              <span className="field-label">Space X:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.spacingX}
                min={0}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { spacingX: +e.target.value || 0 } })}
              />
              <span className="field-label">Y:</span>
              <input
                type="number"
                className="input input-sm"
                value={state.grid.spacingY}
                min={0}
                onChange={(e) => dispatch({ type: "SET_GRID", grid: { spacingY: +e.target.value || 0 } })}
              />
            </div>
          </>
        )}
      </div>

      {/* Sprite list */}
      <div className="section">
        <div className="section-title">
          <span>Sprites ({state.sprites.length})</span>
          {state.selectedSpriteIds.length > 0 && (
            <button
              className="btn btn-sm danger"
              onClick={() => {
                for (const id of state.selectedSpriteIds) {
                  dispatch({ type: "DELETE_SPRITE", id });
                }
              }}
            >
              Del
            </button>
          )}
        </div>
        <div className="sprite-list">
          {state.sprites.length === 0 && (
            <div className="p-4 text-dim text-xs">
              No sprites defined. Use Grid Pick or Region tool to create sprites from the tilemap.
            </div>
          )}
          {state.sprites.map((s) => (
            <div
              key={s.id}
              className={`sprite-item ${state.selectedSpriteIds.includes(s.id) ? "selected" : ""}`}
              onClick={(e) => dispatch({ type: "SELECT_SPRITE", id: s.id, multi: e.shiftKey })}
            >
              <SpriteThumb sprite={s} image={image} />
              <span className="sprite-item__name">{s.name}</span>
              <span className="sprite-item__size">
                {s.width}×{s.height}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Properties of selected sprite */}
      {selected && (
        <div className="section">
          <div className="section-title">Properties</div>
          <div className="field-row">
            <span className="field-label">Name:</span>
            <input
              type="text"
              className="input input-full"
              value={selected.name}
              onChange={(e) => updateSelected({ name: e.target.value })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">X:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.x}
              onChange={(e) => updateSelected({ x: +e.target.value })}
            />
            <span className="field-label">Y:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.y}
              onChange={(e) => updateSelected({ y: +e.target.value })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">W:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.width}
              min={1}
              onChange={(e) => updateSelected({ width: +e.target.value || 1 })}
            />
            <span className="field-label">H:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.height}
              min={1}
              onChange={(e) => updateSelected({ height: +e.target.value || 1 })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">Anchor X:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.anchor.x}
              onChange={(e) => updateSelected({ anchor: { ...selected.anchor, x: +e.target.value } })}
            />
            <span className="field-label">Y:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.anchor.y}
              onChange={(e) => updateSelected({ anchor: { ...selected.anchor, y: +e.target.value } })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">Group:</span>
            <input
              type="text"
              className="input input-md"
              value={selected.group}
              onChange={(e) => updateSelected({ group: e.target.value })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">Order:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.order}
              onChange={(e) => updateSelected({ order: +e.target.value })}
            />
            <span className="field-label">Level:</span>
            <input
              type="number"
              className="input input-sm"
              value={selected.level}
              onChange={(e) => updateSelected({ level: +e.target.value })}
            />
          </div>
          <div className="field-row">
            <span className="field-label">Tags:</span>
            <input
              type="text"
              className="input input-full"
              value={selected.tags.join(", ")}
              placeholder="tag1, tag2"
              onChange={(e) =>
                updateSelected({
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>

          {/* Preview */}
          {image && (
            <div className="mt-4">
              <div className="section-title">Preview</div>
              <SpritePreview sprite={selected} image={image} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SpritePreview({ sprite, image }: { sprite: SpriteRegion; image: HTMLImageElement }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDim = 72;
    const scale = Math.min(maxDim / sprite.width, maxDim / sprite.height, 4);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;

    canvas.width = dw;
    canvas.height = dh;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(image, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, dw, dh);
  }, [sprite, image]);

  return (
    <div className="preview-box">
      <canvas ref={ref} />
    </div>
  );
}
