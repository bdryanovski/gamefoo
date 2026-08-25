import React, { useRef, useEffect, useState, useCallback } from "react";
import type { AppState, AppAction, AnimationDef, SpriteRegion } from "../types";
import { uid } from "../utils/uid";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  image: HTMLImageElement | null;
  /** All loaded library images — frames may come from any of them. */
  imageMap: Map<string, HTMLImageElement>;
}

function FrameThumb({
  sprite,
  imageMap,
  index,
  selected,
  onClick,
}: {
  sprite: SpriteRegion;
  imageMap: Map<string, HTMLImageElement>;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 28;
    canvas.height = 28;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 28, 28);
    const image = imageMap.get(sprite.imageId);
    if (!image || !image.complete) return;
    const scale = Math.min(28 / sprite.width, 28 / sprite.height);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    ctx.drawImage(
      image,
      sprite.x, sprite.y, sprite.width, sprite.height,
      (28 - dw) / 2, (28 - dh) / 2, dw, dh,
    );
  }, [sprite, imageMap]);

  return (
    <div className={`anim-frame-thumb ${selected ? "selected" : ""}`} onClick={onClick}>
      <canvas ref={ref} width={28} height={28} />
      <span className="anim-frame-thumb__order">{index}</span>
    </div>
  );
}

function AnimPreview({
  anim,
  sprites,
  imageMap,
}: {
  anim: AnimationDef;
  sprites: SpriteRegion[];
  imageMap: Map<string, HTMLImageElement>;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const spriteMap = new Map(sprites.map((s) => [s.id, s]));

  useEffect(() => {
    if (anim.frames.length === 0 || anim.duration <= 0) return;
    const interval = setInterval(() => {
      setFrameIndex((i) => (i + 1) % anim.frames.length);
    }, anim.duration * 1000);
    return () => clearInterval(interval);
  }, [anim.frames.length, anim.duration]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameId = anim.frames[frameIndex];
    const sprite = frameId ? spriteMap.get(frameId) : null;
    if (!sprite) {
      canvas.width = 64;
      canvas.height = 64;
      ctx.clearRect(0, 0, 64, 64);
      return;
    }
    const image = imageMap.get(sprite.imageId);
    if (!image || !image.complete) return;

    const maxDim = 64;
    const scale = Math.min(maxDim / sprite.width, maxDim / sprite.height, 4);
    const dw = sprite.width * scale;
    const dh = sprite.height * scale;
    canvas.width = dw;
    canvas.height = dh;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(image, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0, dw, dh);
  }, [frameIndex, anim, imageMap, spriteMap]);

  return (
    <div className="preview-box" style={{ minHeight: 72 }}>
      <canvas ref={ref} />
    </div>
  );
}

export function AnimationPanel({ state, dispatch, imageMap }: Props) {
  const spriteMap = new Map(state.sprites.map((s) => [s.id, s]));
  const selectedAnim = state.animations.find((a) => a.id === state.selectedAnimationId) ?? null;
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (selectedAnim) setEditName(selectedAnim.name);
  }, [selectedAnim?.id]);

  const createAnimation = useCallback(() => {
    if (state.selectedSpriteIds.length === 0) {
      const anim: AnimationDef = {
        id: uid("anim"),
        name: `anim_${state.animations.length}`,
        frames: [],
        duration: 0.15,
        loop: true,
      };
      dispatch({ type: "ADD_ANIMATION", animation: anim });
      dispatch({ type: "SELECT_ANIMATION", id: anim.id });
      return;
    }

    const sortedSprites = [...state.selectedSpriteIds]
      .map((id) => state.sprites.find((s) => s.id === id))
      .filter((s): s is SpriteRegion => s != null)
      .sort((a, b) => a.order - b.order);

    const anim: AnimationDef = {
      id: uid("anim"),
      name: `anim_${state.animations.length}`,
      frames: sortedSprites.map((s) => s.id),
      duration: 0.15,
      loop: true,
    };
    dispatch({ type: "ADD_ANIMATION", animation: anim });
    dispatch({ type: "SELECT_ANIMATION", id: anim.id });
  }, [state.selectedSpriteIds, state.sprites, state.animations.length, dispatch]);

  const addFramesToAnim = useCallback(() => {
    if (!selectedAnim || state.selectedSpriteIds.length === 0) return;
    const newFrames = [...selectedAnim.frames, ...state.selectedSpriteIds];
    dispatch({ type: "UPDATE_ANIMATION", id: selectedAnim.id, updates: { frames: newFrames } });
  }, [selectedAnim, state.selectedSpriteIds, dispatch]);

  const removeFrame = useCallback(
    (index: number) => {
      if (!selectedAnim) return;
      const frames = selectedAnim.frames.filter((_, i) => i !== index);
      dispatch({ type: "UPDATE_ANIMATION", id: selectedAnim.id, updates: { frames } });
    },
    [selectedAnim, dispatch],
  );

  const moveFrame = useCallback(
    (index: number, dir: -1 | 1) => {
      if (!selectedAnim) return;
      const frames = [...selectedAnim.frames];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= frames.length) return;
      [frames[index], frames[newIdx]] = [frames[newIdx]!, frames[index]!];
      dispatch({ type: "UPDATE_ANIMATION", id: selectedAnim.id, updates: { frames } });
    },
    [selectedAnim, dispatch],
  );

  return (
    <div className="col gap-md">
      {/* Create */}
      <div className="section">
        <div className="section-title">
          <span>Animations ({state.animations.length})</span>
          <button className="btn btn-sm" onClick={createAnimation}>
            + New
          </button>
        </div>
        {state.selectedSpriteIds.length > 0 && (
          <div className="text-xs text-dim mb-4">
            {state.selectedSpriteIds.length} sprite(s) selected — "New" will use them as frames
          </div>
        )}

        {/* Animation list */}
        <div className="sprite-list" style={{ maxHeight: 150 }}>
          {state.animations.length === 0 && (
            <div className="p-4 text-dim text-xs">
              No animations. Select sprites then click "+ New" to create one.
            </div>
          )}
          {state.animations.map((a) => (
            <div
              key={a.id}
              className={`anim-item ${state.selectedAnimationId === a.id ? "selected" : ""}`}
              onClick={() => dispatch({ type: "SELECT_ANIMATION", id: a.id })}
            >
              <span className="anim-item__name">{a.name}</span>
              <span className="anim-item__info">
                {a.frames.length}f · {a.duration}s · {a.loop ? "loop" : "once"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit selected animation */}
      {selectedAnim && (
        <div className="section">
          <div className="section-title">
            <span>Edit: {selectedAnim.name}</span>
            <button
              className="btn btn-sm danger"
              onClick={() => dispatch({ type: "DELETE_ANIMATION", id: selectedAnim.id })}
            >
              Del
            </button>
          </div>

          <div className="field-row">
            <span className="field-label">Name:</span>
            <input
              type="text"
              className="input input-full"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={() =>
                dispatch({ type: "UPDATE_ANIMATION", id: selectedAnim.id, updates: { name: editName } })
              }
            />
          </div>
          <div className="field-row">
            <span className="field-label">Duration:</span>
            <input
              type="number"
              className="input input-sm"
              value={selectedAnim.duration}
              step={0.01}
              min={0.01}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_ANIMATION",
                  id: selectedAnim.id,
                  updates: { duration: +e.target.value || 0.1 },
                })
              }
            />
            <span className="text-xs text-dim">sec/frame</span>
          </div>
          <div className="field-row">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={selectedAnim.loop}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_ANIMATION",
                    id: selectedAnim.id,
                    updates: { loop: e.target.checked },
                  })
                }
              />
              Loop
            </label>
          </div>

          {/* Frames */}
          <div className="mt-4">
            <div className="row-between">
              <span className="text-sm">Frames ({selectedAnim.frames.length})</span>
              <button
                className="btn btn-sm"
                onClick={addFramesToAnim}
                disabled={state.selectedSpriteIds.length === 0}
                title="Add selected sprites as frames"
              >
                + Add Selected
              </button>
            </div>
            <div className="anim-frames mt-4">
              {selectedAnim.frames.map((fid, i) => {
                const sprite = spriteMap.get(fid);
                if (!sprite) return null;
                return (
                  <div key={`${fid}-${i}`} style={{ position: "relative" }}>
                    <FrameThumb
                      sprite={sprite}
                      imageMap={imageMap}
                      index={i}
                      selected={false}
                      onClick={() => {}}
                    />
                    <div className="row gap-sm" style={{ justifyContent: "center" }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => moveFrame(i, -1)}
                        disabled={i === 0}
                        style={{ padding: "0 2px", minHeight: 14, fontSize: 8 }}
                      >
                        ◀
                      </button>
                      <button
                        className="btn btn-sm danger"
                        onClick={() => removeFrame(i)}
                        style={{ padding: "0 2px", minHeight: 14, fontSize: 8 }}
                      >
                        ✕
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => moveFrame(i, 1)}
                        disabled={i === selectedAnim.frames.length - 1}
                        style={{ padding: "0 2px", minHeight: 14, fontSize: 8 }}
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4">
            <div className="section-title">Preview</div>
            <AnimPreview anim={selectedAnim} sprites={state.sprites} imageMap={imageMap} />
            <div className="text-xs text-dim mt-4" style={{ textAlign: "center" }}>
              {selectedAnim.frames.length > 0
                ? `${selectedAnim.frames.length} frames @ ${selectedAnim.duration}s = ${(selectedAnim.frames.length * selectedAnim.duration).toFixed(2)}s total`
                : "No frames"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
