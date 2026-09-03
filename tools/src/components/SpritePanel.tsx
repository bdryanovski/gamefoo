import React, { useRef, useEffect, useCallback, useMemo } from "react";
import type { AppState, AppAction, SpriteRegion } from "../types";
import { AnimatedSpritePreview } from "./AnimatedSpritePreview";
import { CollisionEditor } from "./CollisionEditor";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  image: HTMLImageElement | null;
}


export function SpritePanel({ state, dispatch, image }: Props) {
  const activeSprites = state.sprites.filter(
    (s) => s.imageId === state.activeImageId,
  );
  const selected = activeSprites.find((s) =>
    state.selectedSpriteIds.includes(s.id),
  );

  const updateSelected = useCallback(
    (updates: Partial<SpriteRegion>) => {
      if (!selected) return;
      dispatch({ type: "UPDATE_SPRITE", id: selected.id, updates });
    },
    [selected, dispatch],
  );

  // Preview maps for the shared AnimatedSpritePreview. All active
  // sprites share the active image, so a single-entry image map suffices.
  const spriteById = useMemo(
    () => new Map(activeSprites.map((s) => [s.id, s])),
    [activeSprites],
  );
  const previewImageMap = useMemo(
    () =>
      state.activeImageId && image
        ? new Map([[state.activeImageId, image]])
        : new Map<string, HTMLImageElement>(),
    [state.activeImageId, image],
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
          <span>
            Sprites ({activeSprites.length}
            {state.sprites.length !== activeSprites.length
              ? ` of ${state.sprites.length}`
              : ""}
            )
          </span>
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
        <div className="sprite-list" style={{ maxHeight: 260 }}>
          {state.sprites.length === 0 && (
            <div className="p-4 text-dim text-xs">
              No sprites defined. Use Grid Pick or Region tool to create sprites from the tilemap.
            </div>
          )}
          {state.sprites.length > 0 && activeSprites.length === 0 && (
            <div className="p-4 text-dim text-xs">
              No sprites on this image. Select it in the Images tab and cut
              sprites with Grid Pick (G) or Region (R).
            </div>
          )}
          <div className="asset-grid">
            {activeSprites.map((s) => {
              const sel = state.selectedSpriteIds.includes(s.id);
              return (
                <div
                  key={s.id}
                  className="col"
                  style={{ alignItems: "center", gap: 2, width: 48 }}
                >
                  <div
                    className={`asset-thumb ${sel ? "selected" : ""}`}
                    title={`${s.name} — ${s.width}×${s.height}${s.group ? ` · ${s.group}` : ""}`}
                    onClick={(e) =>
                      dispatch({ type: "SELECT_SPRITE", id: s.id, multi: e.shiftKey })
                    }
                  >
                    <AnimatedSpritePreview
                      frames={[s.id]}
                      duration={0}
                      spriteById={spriteById}
                      imageMap={previewImageMap}
                    />
                  </div>
                  <span
                    className={`text-xs ${sel ? "" : "text-dim"}`}
                    style={{
                      maxWidth: 48,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
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

          {/* Collision volumes */}
          <div className="mt-4">
            <CollisionEditor
              width={selected.width}
              height={selected.height}
              collisions={selected.collisions}
              layers={state.collisionLayers}
              onChange={(collisions) => updateSelected({ collisions })}
              dispatch={dispatch}
              drawBackdrop={
                image
                  ? (ctx, scale) =>
                      ctx.drawImage(
                        image,
                        selected.x,
                        selected.y,
                        selected.width,
                        selected.height,
                        0,
                        0,
                        selected.width * scale,
                        selected.height * scale,
                      )
                  : undefined
              }
            />
          </div>
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
