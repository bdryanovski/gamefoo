import React, { useMemo } from "react";
import type { AppState, AppAction, SpriteRegion } from "../types";
import type { MapAction } from "./types";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  mapDispatch: (a: MapAction) => void;
  activeScreenKey: string | null;
  imageMap: Map<string, HTMLImageElement>;
}

const THUMB = 40;

function SpriteThumb({
  sprite,
  imageMap,
  selected,
  title,
  onClick,
}: {
  sprite: SpriteRegion;
  imageMap: Map<string, HTMLImageElement>;
  selected: boolean;
  title: string;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imageMap.get(sprite.imageId);
    canvas.width = THUMB;
    canvas.height = THUMB;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, THUMB, THUMB);
    if (!img || !img.complete) return;
    const scale = Math.min(THUMB / sprite.width, THUMB / sprite.height);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    ctx.drawImage(
      img,
      sprite.x, sprite.y, sprite.width, sprite.height,
      (THUMB - dw) / 2, (THUMB - dh) / 2, dw, dh,
    );
  }, [sprite, imageMap]);

  return (
    <div
      className={`asset-thumb ${selected ? "selected" : ""}`}
      title={title}
      onClick={onClick}
    >
      <canvas ref={ref} />
    </div>
  );
}

export function MapPalettePanel({
  state,
  dispatch,
  mapDispatch,
  activeScreenKey,
  imageMap,
}: Props) {
  const map = state.map;
  const spriteById = useMemo(
    () => new Map(state.sprites.map((s) => [s.id, s])),
    [state.sprites],
  );
  const imageNames = useMemo(
    () => new Map(state.images.map((i) => [i.id, i.name])),
    [state.images],
  );

  const selectedSprite = map.selectedSpriteId
    ? spriteById.get(map.selectedSpriteId)
    : undefined;

  // Group sprites: explicit sprite.group, else the source image name.
  const groups = useMemo(() => {
    const g = new Map<string, SpriteRegion[]>();
    for (const s of [...state.sprites].sort((a, b) => a.order - b.order)) {
      const key = s.group || imageNames.get(s.imageId) || "ungrouped";
      const list = g.get(key) ?? [];
      list.push(s);
      g.set(key, list);
    }
    return Array.from(g.entries());
  }, [state.sprites, imageNames]);

  const activeScreen = activeScreenKey ? map.screens[activeScreenKey] : undefined;

  return (
    <div className="col gap-md">
      {/* Project (shared with the sprite editor) */}
      <div className="section">
        <div className="section-title">Project</div>
        <div className="field-row">
          <span className="field-label">Name:</span>
          <input
            type="text"
            className="input input-full"
            value={state.projectName}
            onChange={(e) =>
              dispatch({ type: "SET_PROJECT_NAME", name: e.target.value })
            }
          />
        </div>
      </div>

      {/* Map settings */}
      <div className="section">
        <div className="section-title">Map Settings</div>
        <div className="field-row">
          <span className="field-label">Block:</span>
          <input
            type="number"
            className="input"
            min={4}
            max={256}
            value={map.blockSize}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                blockSize: Math.max(4, Math.min(256, Number(e.target.value) || 4)),
              })
            }
          />
          <span className="text-xs text-dim">px</span>
        </div>
        <div className="field-row">
          <span className="field-label">Cols:</span>
          <input
            type="number"
            className="input"
            min={1}
            max={256}
            value={map.screenCols}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                screenCols: Math.max(1, Math.min(256, Number(e.target.value) || 1)),
              })
            }
          />
          <span className="field-label">Rows:</span>
          <input
            type="number"
            className="input"
            min={1}
            max={256}
            value={map.screenRows}
            onChange={(e) =>
              mapDispatch({
                type: "SET_MAP_SETTINGS",
                screenRows: Math.max(1, Math.min(256, Number(e.target.value) || 1)),
              })
            }
          />
        </div>
        <div className="text-xs text-dim" style={{ padding: "2px 4px" }}>
          Screen = {map.screenCols * map.blockSize}×
          {map.screenRows * map.blockSize}px ({map.screenCols}×
          {map.screenRows} blocks). Screens: (x,y) — x grows ↓, y grows →.
        </div>
      </div>

      {/* Default tile for new screens */}
      <div className="section">
        <div className="section-title">Default Tile (new screens)</div>
        <div className="text-xs" style={{ padding: "2px 4px" }}>
          {map.defaultSpriteId
            ? `Current: ${spriteById.get(map.defaultSpriteId)?.name ?? "?"}`
            : "None — new screens start empty"}
        </div>
        <div className="row gap-sm" style={{ padding: 4 }}>
          <button
            className="btn btn-sm"
            disabled={!map.selectedSpriteId}
            onClick={() =>
              mapDispatch({
                type: "SET_MAP_DEFAULT",
                spriteId: map.selectedSpriteId,
              })
            }
          >
            Use Selected
          </button>
          <button
            className="btn btn-sm"
            disabled={!map.defaultSpriteId}
            onClick={() => mapDispatch({ type: "SET_MAP_DEFAULT", spriteId: null })}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Active screen */}
      <div className="section">
        <div className="section-title">Screen {activeScreenKey ?? "—"}</div>
        <div className="text-xs" style={{ padding: "2px 4px" }}>
          {activeScreen
            ? `Fill: ${
                activeScreen.defaultSpriteId
                  ? spriteById.get(activeScreen.defaultSpriteId)?.name ?? "?"
                  : "none"
              } · ${activeScreen.placements.length} placements`
            : "Click a screen on the map to select it (Fill tool sets its tile)"}
        </div>
        <div className="row gap-sm" style={{ padding: 4, flexWrap: "wrap" }}>
          <button
            className="btn btn-sm"
            disabled={!activeScreen || !map.selectedSpriteId}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "SET_SCREEN_DEFAULT",
                x: activeScreen.x,
                y: activeScreen.y,
                spriteId: map.selectedSpriteId,
              })
            }
          >
            Fill w/ Selected
          </button>
          <button
            className="btn btn-sm"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "SET_SCREEN_DEFAULT",
                x: activeScreen.x,
                y: activeScreen.y,
                spriteId: null,
              })
            }
          >
            Clear Fill
          </button>
          <button
            className="btn btn-sm"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              mapDispatch({
                type: "CLEAR_SCREEN",
                x: activeScreen.x,
                y: activeScreen.y,
              })
            }
          >
            Clear Placements
          </button>
          <button
            className="btn btn-sm danger"
            disabled={!activeScreen}
            onClick={() =>
              activeScreen &&
              confirm(`Delete screen (${activeScreen.x},${activeScreen.y})?`) &&
              mapDispatch({
                type: "REMOVE_SCREEN",
                x: activeScreen.x,
                y: activeScreen.y,
              })
            }
          >
            Delete Screen
          </button>
        </div>
      </div>

      {/* Sprite palette — from the shared library */}
      <div className="section">
        <div className="section-title">
          Sprites ({state.sprites.length}) — from the Sprite Editor library
        </div>
        {state.sprites.length === 0 && (
          <div className="text-xs text-dim" style={{ padding: 4 }}>
            No sprites yet. Switch to the Sprite Editor, add images and cut
            sprites — they appear here automatically.
          </div>
        )}
        {groups.map(([group, sprites]) => (
          <div key={group} style={{ padding: "4px 0" }}>
            <div className="text-xs text-dim" style={{ padding: "2px 0" }}>
              {group} ({sprites.length})
            </div>
            <div className="asset-grid">
              {sprites.map((s) => (
                <SpriteThumb
                  key={s.id}
                  sprite={s}
                  imageMap={imageMap}
                  selected={map.selectedSpriteId === s.id}
                  title={`${s.name} (${s.width}×${s.height})`}
                  onClick={() =>
                    mapDispatch({
                      type: "SELECT_SPRITE",
                      spriteId: map.selectedSpriteId === s.id ? null : s.id,
                    })
                  }
                />
              ))}
            </div>
          </div>
        ))}
        {selectedSprite && (
          <div className="text-xs" style={{ padding: "4px 4px 0" }}>
            Selected: {selectedSprite.name} ({selectedSprite.width}×
            {selectedSprite.height}px)
          </div>
        )}
      </div>
    </div>
  );
}
