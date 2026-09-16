import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import type {
  AppAction,
  CollisionVolume,
  CollisionShape,
  CollisionLayerDef,
} from "../types";
import { makeCollision, collisionLayerId } from "../types";
import { uid } from "../utils/uid";
import { Icon } from "./Icon";

interface Props {
  /** Local coordinate space width in px. */
  width: number;
  /** Local coordinate space height in px. */
  height: number;
  /** Collision volumes in local pixel coords. */
  collisions: CollisionVolume[];
  /** Project-wide layer registry (name + fixed colour per layer). */
  layers: CollisionLayerDef[];
  /** Persist the edited volumes. */
  onChange: (collisions: CollisionVolume[]) => void;
  /** Dispatch for the global layer registry (add / edit / delete). */
  dispatch: React.Dispatch<AppAction>;
  /** Paint the backdrop (sprite/composition) behind the overlay. */
  drawBackdrop?: (ctx: CanvasRenderingContext2D, scale: number) => void;
}

/** Local pixel point (sprite frame space). */
interface Pt {
  x: number;
  y: number;
}

/** Largest canvas dimension in device pixels before down-scaling. */
const VIEW = 260;
/** Handle square half-size, in canvas pixels (constant on screen). */
const HANDLE = 4;
/** Fallback colour when a volume references a missing layer. */
const UNKNOWN_COLOR = "#888888";

// --- geometry (sprite-local coords) ------------------------------------

function translateShape(shape: CollisionShape, dx: number, dy: number): CollisionShape {
  if (shape.kind === "circle") return { ...shape, cx: shape.cx + dx, cy: shape.cy + dy };
  if (shape.kind === "rect") return { ...shape, x: shape.x + dx, y: shape.y + dy };
  return { kind: "polygon", points: shape.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) };
}

function hitShape(shape: CollisionShape, p: Pt): boolean {
  if (shape.kind === "circle") {
    return Math.hypot(p.x - shape.cx, p.y - shape.cy) <= shape.radius;
  }
  if (shape.kind === "rect") {
    return p.x >= shape.x && p.x <= shape.x + shape.width && p.y >= shape.y && p.y <= shape.y + shape.height;
  }
  const pts = shape.points;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i]!;
    const b = pts[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/** Draggable handles for a shape, each with a stable id, in local coords. */
function handlesFor(shape: CollisionShape): Array<{ id: string; x: number; y: number }> {
  if (shape.kind === "circle") {
    return [{ id: "r", x: shape.cx + shape.radius, y: shape.cy }];
  }
  if (shape.kind === "rect") {
    const { x, y, width: w, height: h } = shape;
    return [
      { id: "nw", x, y },
      { id: "ne", x: x + w, y },
      { id: "sw", x, y: y + h },
      { id: "se", x: x + w, y: y + h },
    ];
  }
  return shape.points.map((p, i) => ({ id: `v${i}`, x: p.x, y: p.y }));
}

/** Apply a handle drag: `cur` is the pointer's current local position. */
function dragHandle(shape: CollisionShape, handle: string, cur: Pt): CollisionShape {
  if (shape.kind === "circle") {
    return { ...shape, radius: Math.max(1, Math.hypot(cur.x - shape.cx, cur.y - shape.cy)) };
  }
  if (shape.kind === "rect") {
    // Keep the corner opposite the grabbed one fixed.
    const left = handle === "nw" || handle === "sw" ? shape.x + shape.width : shape.x;
    const top = handle === "nw" || handle === "ne" ? shape.y + shape.height : shape.y;
    const x = Math.min(left, cur.x);
    const y = Math.min(top, cur.y);
    return {
      kind: "rect",
      x,
      y,
      width: Math.max(1, Math.abs(cur.x - left)),
      height: Math.max(1, Math.abs(cur.y - top)),
    };
  }
  const idx = Number(handle.slice(1));
  const points = shape.points.map((p, i) => (i === idx ? { x: cur.x, y: cur.y } : p));
  return { kind: "polygon", points };
}

/** Insert a polygon vertex at the edge nearest `p`. */
function insertVertex(points: Pt[], p: Pt): Pt[] {
  let best = points.length;
  let bestDist = Infinity;
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
    const d = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    if (d < bestDist) {
      bestDist = d;
      best = i + 1;
    }
  }
  const next = points.slice();
  next.splice(best, 0, { x: p.x, y: p.y });
  return next;
}

// --- drawing -----------------------------------------------------------

function tracePath(ctx: CanvasRenderingContext2D, shape: CollisionShape, scale: number): void {
  ctx.beginPath();
  if (shape.kind === "circle") {
    ctx.arc(shape.cx * scale, shape.cy * scale, shape.radius * scale, 0, Math.PI * 2);
  } else if (shape.kind === "rect") {
    ctx.rect(shape.x * scale, shape.y * scale, shape.width * scale, shape.height * scale);
  } else {
    shape.points.forEach((p, i) => {
      const mx = p.x * scale;
      const my = p.y * scale;
      if (i === 0) ctx.moveTo(mx, my);
      else ctx.lineTo(mx, my);
    });
    ctx.closePath();
  }
}

/** Set pointer capture, tolerating synthetic/inactive pointer ids. */
function capturePointer(e: React.PointerEvent<HTMLCanvasElement>): void {
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {
    // pointer not active (e.g. programmatic events) — dragging still works
  }
}

// --- component ---------------------------------------------------------

type Drag =
  | { mode: "move"; id: string; origin: Pt; shape: CollisionShape }
  | { mode: "handle"; id: string; handle: string }
  | null;

const SHAPE_LABEL: Record<CollisionShape["kind"], string> = {
  circle: "Circle",
  rect: "Box",
  polygon: "Custom",
};

export function CollisionEditor({ width, height, collisions, layers, onChange, dispatch, drawBackdrop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<Drag>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [addLayerId, setAddLayerId] = useState<string>("");
  const [showLayers, setShowLayers] = useState(false);
  // Freehand draw mode: `drawing` holds the polygon volume id being traced;
  // `hover` is the current cursor position for the rubber-band preview.
  const [drawing, setDrawing] = useState<string | null>(null);
  const [hover, setHover] = useState<Pt | null>(null);

  const selected = collisions.find((c) => c.id === selectedId) ?? null;
  const scale = Math.min(12, VIEW / Math.max(1, width, height));

  const layerById = useMemo(
    () => Object.fromEntries(layers.map((l) => [l.id, l])) as Record<string, CollisionLayerDef>,
    [layers],
  );
  const colorOf = useCallback((id: string) => layerById[id]?.color ?? UNKNOWN_COLOR, [layerById]);
  const activeLayerId = layerById[addLayerId] ? addLayerId : (layers[0]?.id ?? "");

  const patch = useCallback(
    (id: string, shape: CollisionShape) =>
      onChange(collisions.map((c) => (c.id === id ? { ...c, shape } : c))),
    [collisions, onChange],
  );

  const toLocal = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
      const rect = e.currentTarget.getBoundingClientRect();
      return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
    },
    [scale],
  );

  // Redraw whenever geometry, selection, layers, or image change.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dw = width * scale;
    const dh = height * scale;
    canvas.width = dw;
    canvas.height = dh;
    canvas.style.width = `${dw}px`;
    canvas.style.height = `${dh}px`;

    ctx.clearRect(0, 0, dw, dh);
    ctx.imageSmoothingEnabled = false;
    drawBackdrop?.(ctx, scale);

    for (const vol of collisions) {
      const isSel = vol.id === selectedId;
      const color = colorOf(vol.layerId);
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.setLineDash(vol.enabled ? [] : [4, 3]);
      ctx.strokeStyle = color;
      ctx.fillStyle = `${color}33`;
      tracePath(ctx, vol.shape, scale);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);
      if (isSel) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        for (const h of handlesFor(vol.shape)) {
          ctx.beginPath();
          ctx.rect(h.x * scale - HANDLE, h.y * scale - HANDLE, HANDLE * 2, HANDLE * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // Rubber-band segment from the last placed point to the cursor.
    if (drawing && hover) {
      const vol = collisions.find((c) => c.id === drawing);
      if (vol && vol.shape.kind === "polygon" && vol.shape.points.length > 0) {
        const last = vol.shape.points[vol.shape.points.length - 1]!;
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = colorOf(vol.layerId);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(last.x * scale, last.y * scale);
        ctx.lineTo(hover.x * scale, hover.y * scale);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [width, height, drawBackdrop, collisions, selectedId, scale, colorOf, drawing, hover]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const p = toLocal(e);
      // Draw mode: each click appends a vertex to the polygon being traced.
      if (drawing) {
        const vol = collisions.find((c) => c.id === drawing);
        if (vol && vol.shape.kind === "polygon") {
          patch(drawing, { kind: "polygon", points: [...vol.shape.points, p] });
        }
        return;
      }
      if (selected) {
        for (const h of handlesFor(selected.shape)) {
          if (Math.abs(h.x - p.x) * scale <= HANDLE + 2 && Math.abs(h.y - p.y) * scale <= HANDLE + 2) {
            dragRef.current = { mode: "handle", id: selected.id, handle: h.id };
            capturePointer(e);
            return;
          }
        }
      }
      if (addMode && selected && selected.shape.kind === "polygon") {
        patch(selected.id, { kind: "polygon", points: insertVertex(selected.shape.points, p) });
        return;
      }
      for (let i = collisions.length - 1; i >= 0; i--) {
        const vol = collisions[i]!;
        if (hitShape(vol.shape, p)) {
          setSelectedId(vol.id);
          dragRef.current = { mode: "move", id: vol.id, origin: p, shape: vol.shape };
          capturePointer(e);
          return;
        }
      }
      setSelectedId(null);
    },
    [collisions, selected, addMode, drawing, scale, toLocal, patch],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (drawing) {
        setHover(toLocal(e));
        return;
      }
      const drag = dragRef.current;
      if (!drag) return;
      const p = toLocal(e);
      if (drag.mode === "move") {
        patch(drag.id, translateShape(drag.shape, p.x - drag.origin.x, p.y - drag.origin.y));
      } else {
        const vol = collisions.find((c) => c.id === drag.id);
        if (vol) patch(drag.id, dragHandle(vol.shape, drag.handle, p));
      }
    },
    [collisions, drawing, toLocal, patch],
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // pointer already released (e.g. synthetic events)
      }
      dragRef.current = null;
    }
  }, []);

  // Finish the traced polygon (needs ≥3 points, else discard it).
  const finishDraw = useCallback(() => {
    setDrawing(null);
    setHover(null);
    if (!drawing) return;
    const vol = collisions.find((c) => c.id === drawing);
    if (!vol || vol.shape.kind !== "polygon" || vol.shape.points.length < 3) {
      onChange(collisions.filter((c) => c.id !== drawing));
      setSelectedId((s) => (s === drawing ? null : s));
    }
  }, [drawing, collisions, onChange]);

  const cancelDraw = useCallback(() => {
    if (drawing) {
      onChange(collisions.filter((c) => c.id !== drawing));
      setSelectedId((s) => (s === drawing ? null : s));
    }
    setDrawing(null);
    setHover(null);
  }, [drawing, collisions, onChange]);

  // While drawing: Enter finishes, Escape cancels.
  useEffect(() => {
    if (!drawing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelDraw();
      else if (e.key === "Enter") finishDraw();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawing, cancelDraw, finishDraw]);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (drawing) {
        finishDraw();
        return;
      }
      if (!selected || selected.shape.kind !== "polygon") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const p = { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
      const pts = selected.shape.points;
      if (pts.length <= 3) return;
      const idx = pts.findIndex((v) => Math.abs(v.x - p.x) * scale <= HANDLE + 2 && Math.abs(v.y - p.y) * scale <= HANDLE + 2);
      if (idx >= 0) {
        patch(selected.id, { kind: "polygon", points: pts.filter((_, i) => i !== idx) });
      }
    },
    [selected, scale, patch],
  );

  const addVolume = useCallback(
    (kind: CollisionShape["kind"]) => {
      if (!activeLayerId) return;
      const vol = makeCollision(kind, { width, height }, activeLayerId);
      onChange([...collisions, vol]);
      setSelectedId(vol.id);
      setAddMode(false);
    },
    [collisions, width, height, onChange, activeLayerId],
  );

  const startDraw = useCallback(() => {
    if (!activeLayerId) return;
    const vol: CollisionVolume = {
      id: uid("col"),
      layerId: activeLayerId,
      enabled: true,
      shape: { kind: "polygon", points: [] },
    };
    onChange([...collisions, vol]);
    setSelectedId(vol.id);
    setDrawing(vol.id);
    setHover(null);
    setAddMode(false);
  }, [activeLayerId, collisions, onChange]);

  const setVolumeLayer = useCallback(
    (id: string, layerId: string) => onChange(collisions.map((c) => (c.id === id ? { ...c, layerId } : c))),
    [collisions, onChange],
  );
  const setVolumeEnabled = useCallback(
    (id: string, enabled: boolean) => onChange(collisions.map((c) => (c.id === id ? { ...c, enabled } : c))),
    [collisions, onChange],
  );
  const removeVolume = useCallback(
    (id: string) => {
      onChange(collisions.filter((c) => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [collisions, onChange, selectedId],
  );

  const drawingVol = drawing ? collisions.find((c) => c.id === drawing) : null;
  const drawnCount =
    drawingVol && drawingVol.shape.kind === "polygon" ? drawingVol.shape.points.length : 0;

  return (
    <div className="col gap-md collision-editor">
      <div className="section-title">
        <span>Collisions ({collisions.length})</span>
        <button className={`btn btn-sm ${showLayers ? "active" : ""}`} onClick={() => setShowLayers(!showLayers)}>
          Layers
        </button>
      </div>

      {showLayers && <LayerManager layers={layers} dispatch={dispatch} />}

      <div className="field-row">
        <select
          className="input input-md"
          value={activeLayerId}
          onChange={(e) => setAddLayerId(e.target.value)}
          title="Layer for new volumes"
        >
          {layers.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <button className="btn btn-sm" disabled={!activeLayerId || !!drawing} onClick={() => addVolume("circle")}><Icon name="shape-circle" size={12} /> Circle</button>
        <button className="btn btn-sm" disabled={!activeLayerId || !!drawing} onClick={() => addVolume("rect")}><Icon name="shape-box" size={12} /> Box</button>
        <button className="btn btn-sm" disabled={!activeLayerId || !!drawing} onClick={() => addVolume("polygon")}><Icon name="shape-custom" size={12} /> Custom</button>
        <button className="btn btn-sm" disabled={!activeLayerId || !!drawing} onClick={startDraw}><Icon name="draw" size={12} /> Draw</button>
      </div>

      {drawing && (
        <div className="field-row draw-banner">
          <span className="text-xs">Click to add points ({drawnCount})</span>
          <button className="btn btn-sm" disabled={drawnCount < 3} onClick={finishDraw}>Finish</button>
          <button className="btn btn-sm danger" onClick={cancelDraw}>Cancel</button>
          <span className="text-xs text-dim">Enter finishes · Esc cancels</span>
        </div>
      )}

      <div className="preview-box collision-canvas-box">
        <canvas
          ref={canvasRef}
          className="collision-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={onDoubleClick}
        />
      </div>

      {collisions.length === 0 && (
        <div className="text-xs text-dim">
          No collision volumes. Pick a layer, then add a Circle, Box, or Custom
          polygon — or use Draw to click out any shape. Drag on the canvas to
          move, drag handles to resize.
        </div>
      )}

      {collisions.map((vol) => {
        const sel = vol.id === selectedId;
        return (
          <div
            key={vol.id}
            className={`collision-vol ${sel ? "selected" : ""}`}
            onClick={() => setSelectedId(vol.id)}
          >
            <div className="field-row">
              <span className="collision-swatch" style={{ background: colorOf(vol.layerId) }} />
              <select
                className="input input-full"
                value={vol.layerId}
                onChange={(e) => setVolumeLayer(vol.id, e.target.value)}
              >
                {layers.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
                {!layerById[vol.layerId] && <option value={vol.layerId}>{vol.layerId} (missing)</option>}
              </select>
              <span className="badge-shape">{SHAPE_LABEL[vol.shape.kind]}</span>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={vol.enabled}
                  onChange={(e) => setVolumeEnabled(vol.id, e.target.checked)}
                />
                On
              </label>
              <button className="btn btn-sm danger" onClick={() => removeVolume(vol.id)}>Del</button>
            </div>
            {sel && <ShapeFields vol={vol} onShape={(shape) => patch(vol.id, shape)} addMode={addMode} setAddMode={setAddMode} />}
          </div>
        );
      })}
    </div>
  );
}

function LayerManager({
  layers,
  dispatch,
}: {
  layers: CollisionLayerDef[];
  dispatch: React.Dispatch<AppAction>;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#7ad0ff");

  const existing = useMemo(() => new Set(layers.map((l) => l.id)), [layers]);
  const newId = collisionLayerId(name);
  const canAdd = name.trim().length > 0 && !existing.has(newId);

  const add = useCallback(() => {
    if (!canAdd) return;
    dispatch({ type: "ADD_COLLISION_LAYER", layer: { id: newId, name: name.trim(), color } });
    setName("");
  }, [canAdd, dispatch, newId, name, color]);

  return (
    <div className="section collision-layers">
      <div className="section-title">Collision Layers ({layers.length})</div>
      {layers.map((l) => (
        <div className="field-row" key={l.id}>
          <input
            type="color"
            className="input color-input"
            value={l.color}
            onChange={(e) => dispatch({ type: "UPDATE_COLLISION_LAYER", id: l.id, updates: { color: e.target.value } })}
          />
          <input
            type="text"
            className="input input-full"
            value={l.name}
            onChange={(e) => dispatch({ type: "UPDATE_COLLISION_LAYER", id: l.id, updates: { name: e.target.value } })}
          />
          <span className="badge-shape">{l.id}</span>
          <button
            className="btn btn-sm danger"
            title="Delete layer and its volumes on every sprite"
            onClick={() => dispatch({ type: "DELETE_COLLISION_LAYER", id: l.id })}
          >
            Del
          </button>
        </div>
      ))}
      <div className="field-row">
        <input type="color" className="input color-input" value={color} onChange={(e) => setColor(e.target.value)} />
        <input
          type="text"
          className="input input-full"
          placeholder="new layer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn btn-sm" disabled={!canAdd} onClick={add}>Add</button>
      </div>
    </div>
  );
}

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function ShapeFields({
  vol,
  onShape,
  addMode,
  setAddMode,
}: {
  vol: CollisionVolume;
  onShape: (shape: CollisionShape) => void;
  addMode: boolean;
  setAddMode: (v: boolean) => void;
}) {
  const s = vol.shape;
  if (s.kind === "circle") {
    return (
      <div className="field-row">
        <span className="field-label">CX:</span>
        <input type="number" className="input input-sm" value={s.cx} onChange={(e) => onShape({ ...s, cx: num(e.target.value) })} />
        <span className="field-label">CY:</span>
        <input type="number" className="input input-sm" value={s.cy} onChange={(e) => onShape({ ...s, cy: num(e.target.value) })} />
        <span className="field-label">R:</span>
        <input type="number" className="input input-sm" min={1} value={s.radius} onChange={(e) => onShape({ ...s, radius: Math.max(1, num(e.target.value)) })} />
      </div>
    );
  }
  if (s.kind === "rect") {
    return (
      <>
        <div className="field-row">
          <span className="field-label">X:</span>
          <input type="number" className="input input-sm" value={s.x} onChange={(e) => onShape({ ...s, x: num(e.target.value) })} />
          <span className="field-label">Y:</span>
          <input type="number" className="input input-sm" value={s.y} onChange={(e) => onShape({ ...s, y: num(e.target.value) })} />
        </div>
        <div className="field-row">
          <span className="field-label">W:</span>
          <input type="number" className="input input-sm" min={1} value={s.width} onChange={(e) => onShape({ ...s, width: Math.max(1, num(e.target.value)) })} />
          <span className="field-label">H:</span>
          <input type="number" className="input input-sm" min={1} value={s.height} onChange={(e) => onShape({ ...s, height: Math.max(1, num(e.target.value)) })} />
        </div>
      </>
    );
  }
  return (
    <div className="col" style={{ gap: 3 }}>
      <div className="field-row">
        <span className="field-label">Points:</span>
        <button
          className={`btn btn-sm ${addMode ? "active" : ""}`}
          onClick={() => setAddMode(!addMode)}
        >
          {addMode ? "Click canvas to add" : "+ Add point"}
        </button>
        <span className="text-xs text-dim">dbl-click vertex to remove</span>
      </div>
      {s.points.map((p, i) => (
        <div className="field-row" key={i}>
          <span className="field-label">#{i}</span>
          <input
            type="number"
            className="input input-sm"
            value={p.x}
            onChange={(e) => onShape({ kind: "polygon", points: s.points.map((q, j) => (j === i ? { ...q, x: num(e.target.value) } : q)) })}
          />
          <input
            type="number"
            className="input input-sm"
            value={p.y}
            onChange={(e) => onShape({ kind: "polygon", points: s.points.map((q, j) => (j === i ? { ...q, y: num(e.target.value) } : q)) })}
          />
          {s.points.length > 3 && (
            <button
              className="btn btn-sm danger"
              title="Remove point"
              onClick={() => onShape({ kind: "polygon", points: s.points.filter((_, j) => j !== i) })}
            >
              <Icon name="close" size={10} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
