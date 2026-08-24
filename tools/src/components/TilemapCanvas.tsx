import React, { useRef, useEffect, useCallback, useState } from "react";
import type { AppState, AppAction, SpriteRegion } from "../types";
import { uid } from "../utils/uid";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  image: HTMLImageElement | null;
  onMouseMove: (pos: { x: number; y: number }) => void;
  onUploadClick: () => void;
}

export function TilemapCanvas({ state, dispatch, image, onMouseMove, onUploadClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const rafRef = useRef<number>(0);
  const [spaceHeld, setSpaceHeld] = useState(false);

  // ── Space key = temporary pan mode ─────────────────────
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      return (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.isContentEditable
      );
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      setSpaceHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      setSpaceHeld(false);
    };
    const handleBlur = () => setSpaceHeld(false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const screenToImage = useCallback(
    (sx: number, sy: number) => ({
      x: (sx - state.pan.x) / state.zoom,
      y: (sy - state.pan.y) / state.zoom,
    }),
    [state.zoom, state.pan],
  );

  const snapToGrid = useCallback(
    (ix: number, iy: number): { x: number; y: number } => {
      const g = state.grid;
      if (!g.enabled) return { x: ix, y: iy };
      const cw = g.cellWidth + g.spacingX;
      const ch = g.cellHeight + g.spacingY;
      return {
        x: Math.floor((ix - g.offsetX) / cw) * cw + g.offsetX,
        y: Math.floor((iy - g.offsetY) / ch) * ch + g.offsetY,
      };
    },
    [state.grid],
  );

  const findSpriteAt = useCallback(
    (ix: number, iy: number): SpriteRegion | null => {
      for (let i = state.sprites.length - 1; i >= 0; i--) {
        const s = state.sprites[i]!;
        if (ix >= s.x && ix < s.x + s.width && iy >= s.y && iy < s.y + s.height) {
          return s;
        }
      }
      return null;
    },
    [state.sprites],
  );

  // ── Drawing ────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(state.pan.x, state.pan.y);
      ctx.scale(state.zoom, state.zoom);
      ctx.imageSmoothingEnabled = false;

      if (image) {
        ctx.drawImage(image, 0, 0);
      }

      // Grid
      const g = state.grid;
      if (g.enabled && image) {
        ctx.strokeStyle = "var(--grid-line)";
        ctx.strokeStyle = "rgba(0,255,0,0.2)";
        ctx.lineWidth = 1 / state.zoom;
        const cw = g.cellWidth + g.spacingX;
        const ch = g.cellHeight + g.spacingY;
        for (let x = g.offsetX; x < image.width; x += cw) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, image.height);
          ctx.stroke();
          if (g.spacingX > 0 && x + g.cellWidth < image.width) {
            ctx.strokeStyle = "rgba(255,0,0,0.15)";
            ctx.beginPath();
            ctx.moveTo(x + g.cellWidth, 0);
            ctx.lineTo(x + g.cellWidth, image.height);
            ctx.stroke();
            ctx.strokeStyle = "rgba(0,255,0,0.2)";
          }
        }
        for (let y = g.offsetY; y < image.height; y += ch) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(image.width, y);
          ctx.stroke();
          if (g.spacingY > 0 && y + g.cellHeight < image.height) {
            ctx.strokeStyle = "rgba(255,0,0,0.15)";
            ctx.beginPath();
            ctx.moveTo(0, y + g.cellHeight);
            ctx.lineTo(image.width, y + g.cellHeight);
            ctx.stroke();
            ctx.strokeStyle = "rgba(0,255,0,0.2)";
          }
        }
      }

      // Sprite regions
      for (const s of state.sprites) {
        const selected = state.selectedSpriteIds.includes(s.id);
        ctx.fillStyle = selected ? "rgba(255,255,0,0.12)" : "rgba(0,255,0,0.08)";
        ctx.fillRect(s.x, s.y, s.width, s.height);
        ctx.strokeStyle = selected ? "#ffff00" : "#00ff00";
        ctx.lineWidth = (selected ? 2 : 1) / state.zoom;
        ctx.strokeRect(s.x, s.y, s.width, s.height);

        // Anchor marker
        if (s.anchor.x !== 0 || s.anchor.y !== 0) {
          const ax = s.x + s.anchor.x;
          const ay = s.y + s.anchor.y;
          ctx.strokeStyle = "#ff00ff";
          ctx.lineWidth = 1 / state.zoom;
          const r = 3 / state.zoom;
          ctx.beginPath();
          ctx.moveTo(ax - r, ay);
          ctx.lineTo(ax + r, ay);
          ctx.moveTo(ax, ay - r);
          ctx.lineTo(ax, ay + r);
          ctx.stroke();
        }
      }

      // Drawing rectangle
      if (drawStart && drawEnd) {
        const rx = Math.min(drawStart.x, drawEnd.x);
        const ry = Math.min(drawStart.y, drawEnd.y);
        const rw = Math.abs(drawEnd.x - drawStart.x);
        const rh = Math.abs(drawEnd.y - drawStart.y);
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 1 / state.zoom;
        ctx.setLineDash([4 / state.zoom, 4 / state.zoom]);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);

        // Show dimensions
        ctx.fillStyle = "#ff4444";
        ctx.font = `${10 / state.zoom}px monospace`;
        ctx.fillText(`${Math.round(rw)}×${Math.round(rh)}`, rx, ry - 3 / state.zoom);
      }

      ctx.restore();
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [image, state, canvasSize, drawStart, drawEnd]);

  // ── Mouse handlers ─────────────────────────────────────

  const getMouseImagePos = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      return screenToImage(sx, sy);
    },
    [screenToImage],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const imgPos = screenToImage(sx, sy);

      // Middle click, pan tool, or space+drag = pan
      if (e.button === 1 || state.activeTool === "pan" || (spaceHeld && e.button === 0)) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - state.pan.x, y: e.clientY - state.pan.y });
        return;
      }

      if (e.button !== 0) return;

      if (state.activeTool === "select") {
        const sprite = findSpriteAt(imgPos.x, imgPos.y);
        if (sprite) {
          dispatch({ type: "SELECT_SPRITE", id: sprite.id, multi: e.shiftKey });
        } else {
          dispatch({ type: "DESELECT_ALL_SPRITES" });
        }
        return;
      }

      if (state.activeTool === "grid-pick") {
        if (!state.grid.enabled) return;
        const snapped = snapToGrid(imgPos.x, imgPos.y);
        if (snapped.x < 0 || snapped.y < 0) return;
        if (image && (snapped.x >= image.width || snapped.y >= image.height)) return;

        // Check if there's already a sprite at this grid cell
        const existing = state.sprites.find(
          (s) => s.x === snapped.x && s.y === snapped.y &&
            s.width === state.grid.cellWidth && s.height === state.grid.cellHeight,
        );

        if (existing) {
          if (e.shiftKey) {
            dispatch({ type: "SELECT_SPRITE", id: existing.id, multi: true });
          } else {
            dispatch({ type: "SELECT_SPRITE", id: existing.id });
          }
        } else {
          const g = state.grid;
          const col = Math.floor((snapped.x - g.offsetX) / (g.cellWidth + g.spacingX));
          const row = Math.floor((snapped.y - g.offsetY) / (g.cellHeight + g.spacingY));
          const sprite: SpriteRegion = {
            id: uid("spr"),
            name: `sprite_${col}_${row}`,
            x: snapped.x,
            y: snapped.y,
            width: g.cellWidth,
            height: g.cellHeight,
            anchor: { x: 0, y: 0 },
            tags: [],
            group: "",
            order: state.sprites.length,
            level: 0,
            properties: {},
          };
          dispatch({ type: "ADD_SPRITE", sprite });
          dispatch({ type: "SELECT_SPRITE", id: sprite.id });
        }
        return;
      }

      if (state.activeTool === "region") {
        const pos = state.grid.enabled ? snapToGrid(imgPos.x, imgPos.y) : imgPos;
        setDrawStart(pos);
        setDrawEnd(pos);
      }
    },
    [state, dispatch, screenToImage, snapToGrid, findSpriteAt, image, spaceHeld],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const imgPos = getMouseImagePos(e);
      onMouseMove({ x: Math.round(imgPos.x), y: Math.round(imgPos.y) });

      if (isPanning) {
        dispatch({
          type: "SET_PAN",
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      if (drawStart) {
        const pos = state.grid.enabled ? snapToGrid(imgPos.x, imgPos.y) : imgPos;
        if (state.grid.enabled) {
          setDrawEnd({
            x: pos.x + state.grid.cellWidth,
            y: pos.y + state.grid.cellHeight,
          });
        } else {
          setDrawEnd(pos);
        }
      }
    },
    [isPanning, panStart, drawStart, state.grid, getMouseImagePos, onMouseMove, dispatch, snapToGrid],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setIsPanning(false);
        return;
      }

      if (drawStart && drawEnd && state.activeTool === "region") {
        const rx = Math.min(drawStart.x, drawEnd.x);
        const ry = Math.min(drawStart.y, drawEnd.y);
        const rw = Math.abs(drawEnd.x - drawStart.x);
        const rh = Math.abs(drawEnd.y - drawStart.y);

        if (rw > 1 && rh > 1) {
          const sprite: SpriteRegion = {
            id: uid("spr"),
            name: `region_${state.sprites.length}`,
            x: Math.round(rx),
            y: Math.round(ry),
            width: Math.round(rw),
            height: Math.round(rh),
            anchor: { x: 0, y: 0 },
            tags: [],
            group: "",
            order: state.sprites.length,
            level: 0,
            properties: {},
          };
          dispatch({ type: "ADD_SPRITE", sprite });
          dispatch({ type: "SELECT_SPRITE", id: sprite.id });
        }
        setDrawStart(null);
        setDrawEnd(null);
      }
    },
    [isPanning, drawStart, drawEnd, state, dispatch],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newZoom = Math.max(0.25, Math.min(16, state.zoom * factor));

      const newPanX = mx - (mx - state.pan.x) * (newZoom / state.zoom);
      const newPanY = my - (my - state.pan.y) * (newZoom / state.zoom);

      dispatch({ type: "SET_ZOOM", zoom: newZoom });
      dispatch({ type: "SET_PAN", x: newPanX, y: newPanY });
    },
    [state.zoom, state.pan, dispatch],
  );

  const toolClass = state.activeTool === "pan" || spaceHeld
    ? `tool-pan ${isPanning ? "panning" : ""}`
    : state.activeTool === "select"
      ? "tool-select"
      : "";

  return (
    <div ref={containerRef} className={`canvas-area ${toolClass}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      {!image && (
        <div className="upload-overlay">
          <div className="big-icon">▣</div>
          <div>Drop a tilemap image here</div>
          <div>— or —</div>
          <button className="btn" onClick={onUploadClick}>
            Open Image File
          </button>
        </div>
      )}
    </div>
  );
}
