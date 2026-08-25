import React, { useRef, useEffect, useCallback, useState } from "react";
import type { MapState, MapAction } from "./types";
import { screenKey } from "./types";
import type { AppState, SpriteRegion } from "../types";

/** World-space gap between screens (px in image space). */
const GAP = 16;

interface Props {
  state: AppState;
  map: MapState;
  mapDispatch: (a: MapAction) => void;
  imageMap: Map<string, HTMLImageElement>;
  onStatus: (s: {
    screenKey: string | null;
    block: { col: number; row: number } | null;
  }) => void;
  onActiveScreen: (key: string | null) => void;
}

interface ScreenRect {
  screen: MapState["screens"][string];
  wx: number;
  wy: number;
  w: number;
  h: number;
}

export function MapCanvas({
  state,
  map,
  mapDispatch,
  imageMap,
  onStatus,
  onActiveScreen,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const rafRef = useRef<number>(0);

  const spriteById = new Map(state.sprites.map((s) => [s.id, s]));

  // ── Pan / interaction state ────────────────────────────
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [hover, setHover] = useState<{
    screenKey: string;
    localX: number;
    localY: number;
  } | null>(null);

  // ── Layout helpers ─────────────────────────────────────

  const screenW = map.screenCols * map.blockSize;
  const screenH = map.screenRows * map.blockSize;

  const screenRects: ScreenRect[] = Object.values(map.screens).map((s) => ({
    screen: s,
    wx: s.y * (screenW + GAP),
    wy: s.x * (screenH + GAP),
    w: screenW,
    h: screenH,
  }));

  const findScreenAt = useCallback(
    (wx: number, wy: number): ScreenRect | null => {
      for (const r of screenRects) {
        if (wx >= r.wx && wx < r.wx + r.w && wy >= r.wy && wy < r.wy + r.h) {
          return r;
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map.screens, screenW, screenH],
  );

  // ── ResizeObserver ─────────────────────────────────────

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

  // ── Space key = temporary pan ──────────────────────────

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

  // ── Rendering ──────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawSprite = (spriteId: string, dx: number, dy: number, alpha = 1) => {
      const sprite = spriteById.get(spriteId);
      if (!sprite) return;
      const img = imageMap.get(sprite.imageId);
      if (!img || !img.complete) return;
      ctx.globalAlpha = alpha;
      ctx.drawImage(
        img,
        sprite.x, sprite.y, sprite.width, sprite.height,
        dx, dy, sprite.width, sprite.height,
      );
      ctx.globalAlpha = 1;
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      for (const r of screenRects) {
        const sx = r.wx * map.zoom + map.pan.x;
        const sy = r.wy * map.zoom + map.pan.y;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(map.zoom, map.zoom);

        // Background: default sprite tiled, or empty placeholder
        if (r.screen.defaultSpriteId) {
          const sprite = spriteById.get(r.screen.defaultSpriteId);
          if (sprite) {
            for (let ty = 0; ty < r.h; ty += sprite.height) {
              for (let tx = 0; tx < r.w; tx += sprite.width) {
                drawSprite(r.screen.defaultSpriteId, tx, ty);
              }
            }
          }
        } else {
          ctx.fillStyle = "#20203a";
          ctx.fillRect(0, 0, r.w, r.h);
          ctx.strokeStyle = "#3a3a5a";
          ctx.lineWidth = 1;
          const step = map.blockSize * 2;
          for (let gy = 0; gy < r.h; gy += step) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(r.w, gy);
            ctx.stroke();
          }
          for (let gx = 0; gx < r.w; gx += step) {
            ctx.beginPath();
            ctx.moveTo(gx, 0);
            ctx.lineTo(gx, r.h);
            ctx.stroke();
          }
        }

        // Block grid
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1 / map.zoom;
        for (let gx = 0; gx <= r.w; gx += map.blockSize) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, r.h);
          ctx.stroke();
        }
        for (let gy = 0; gy <= r.h; gy += map.blockSize) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(r.w, gy);
          ctx.stroke();
        }

        // Placements (clipped to the screen)
        ctx.beginPath();
        ctx.rect(0, 0, r.w, r.h);
        ctx.clip();
        for (const p of r.screen.placements) {
          drawSprite(p.spriteId, p.x, p.y);
        }

        // Ghost preview of the selected sprite at hover cell
        if (
          hover &&
          hover.screenKey === screenKey(r.screen.x, r.screen.y) &&
          map.activeTool === "paint" &&
          map.selectedSpriteId
        ) {
          const col = Math.floor(hover.localX / map.blockSize);
          const row = Math.floor(hover.localY / map.blockSize);
          drawSprite(
            map.selectedSpriteId,
            col * map.blockSize,
            row * map.blockSize,
            0.5,
          );
        }

        ctx.restore();

        // Screen border + hovered highlight
        const isHovered =
          hover && hover.screenKey === screenKey(r.screen.x, r.screen.y);
        ctx.strokeStyle = isHovered ? "#ffff00" : "#00ff00";
        ctx.lineWidth = (isHovered ? 2 : 1) / map.zoom;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(map.zoom, map.zoom);
        ctx.strokeRect(0, 0, r.w, r.h);

        // Coordinate label in the gap above the screen
        ctx.fillStyle = "#00ff00";
        ctx.font = `bold ${Math.max(10, 11 / map.zoom)}px monospace`;
        ctx.textBaseline = "bottom";
        ctx.fillText(`${r.screen.x},${r.screen.y}`, 0, -4 / map.zoom);
        ctx.restore();
      }
    });

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, canvasSize, hover, imageMap, state.sprites]);

  // ── Mouse handlers ─────────────────────────────────────

  const getWorldPos = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      return {
        x: (sx - map.pan.x) / map.zoom,
        y: (sy - map.pan.y) / map.zoom,
      };
    },
    [map.pan, map.zoom],
  );

  const findTopmostPlacement = useCallback(
    (screenKeyStr: string, wx: number, wy: number) => {
      const r = screenRects.find(
        (sr) => screenKey(sr.screen.x, sr.screen.y) === screenKeyStr,
      );
      if (!r) return null;
      const localX = wx - r.wx;
      const localY = wy - r.wy;
      for (let i = r.screen.placements.length - 1; i >= 0; i--) {
        const p = r.screen.placements[i]!;
        const sprite = spriteById.get(p.spriteId);
        if (!sprite) continue;
        if (
          localX >= p.x &&
          localX < p.x + sprite.width &&
          localY >= p.y &&
          localY < p.y + sprite.height
        ) {
          return p;
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenRects, state.sprites],
  );

  const applyTool = useCallback(
    (e: React.MouseEvent) => {
      const world = getWorldPos(e);
      const r = findScreenAt(world.x, world.y);
      if (!r) {
        onStatus({ screenKey: null, block: null });
        setHover(null);
        return;
      }
      const key = screenKey(r.screen.x, r.screen.y);
      const localX = world.x - r.wx;
      const localY = world.y - r.wy;
      const col = Math.max(0, Math.floor(localX / map.blockSize));
      const row = Math.max(0, Math.floor(localY / map.blockSize));

      onActiveScreen(key);
      onStatus({ screenKey: key, block: { col, row } });
      setHover({ screenKey: key, localX, localY });

      const tool = map.activeTool;

      if (tool === "fill" && map.selectedSpriteId) {
        mapDispatch({
          type: "SET_SCREEN_DEFAULT",
          x: r.screen.x,
          y: r.screen.y,
          spriteId: map.selectedSpriteId,
        });
        return;
      }

      if (tool === "pick") {
        const p = findTopmostPlacement(key, world.x, world.y);
        if (p) {
          mapDispatch({ type: "SELECT_SPRITE", spriteId: p.spriteId });
        } else if (r.screen.defaultSpriteId) {
          mapDispatch({
            type: "SELECT_SPRITE",
            spriteId: r.screen.defaultSpriteId,
          });
        }
        return;
      }

      if (tool === "erase") {
        const p = findTopmostPlacement(key, world.x, world.y);
        if (p) {
          mapDispatch({ type: "REMOVE_PLACEMENT", screenKey: key, id: p.id });
        }
        return;
      }

      // Paint: click places one sprite per click (no drag painting).
      if (tool === "paint" && map.selectedSpriteId) {
        mapDispatch({
          type: "ADD_PLACEMENT",
          screenKey: key,
          placement: {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            spriteId: map.selectedSpriteId,
            x: col * map.blockSize,
            y: row * map.blockSize,
          },
        });
      }
    },
    [
      map,
      mapDispatch,
      getWorldPos,
      findScreenAt,
      findTopmostPlacement,
      onStatus,
      onActiveScreen,
    ],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.button === 1 ||
        map.activeTool === "pan" ||
        (spaceHeld && e.button === 0)
      ) {
        setIsPanning(true);
        panStartRef.current = {
          x: e.clientX - map.pan.x,
          y: e.clientY - map.pan.y,
        };
        return;
      }
      if (e.button !== 0) return;
      applyTool(e);
    },
    [map.activeTool, map.pan, spaceHeld, applyTool],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        mapDispatch({
          type: "SET_PAN",
          x: e.clientX - panStartRef.current.x,
          y: e.clientY - panStartRef.current.y,
        });
        return;
      }
      // Hover only — placement/erase happen on click (mousedown).
      const world = getWorldPos(e);
      const r = findScreenAt(world.x, world.y);
      if (!r) {
        onStatus({ screenKey: null, block: null });
        setHover(null);
        return;
      }
      const key = screenKey(r.screen.x, r.screen.y);
      const localX = world.x - r.wx;
      const localY = world.y - r.wy;
      const col = Math.max(0, Math.floor(localX / map.blockSize));
      const row = Math.max(0, Math.floor(localY / map.blockSize));
      onStatus({ screenKey: key, block: { col, row } });
      setHover({ screenKey: key, localX, localY });
    },
    [isPanning, mapDispatch, getWorldPos, findScreenAt, map.blockSize, onStatus],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Stop panning even when the button is released outside the canvas.
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newZoom = Math.max(0.05, Math.min(8, map.zoom * factor));
      const newPanX = mx - (mx - map.pan.x) * (newZoom / map.zoom);
      const newPanY = my - (my - map.pan.y) * (newZoom / map.zoom);

      mapDispatch({ type: "SET_ZOOM", zoom: newZoom });
      mapDispatch({ type: "SET_PAN", x: newPanX, y: newPanY });
    },
    [map.zoom, map.pan, mapDispatch],
  );

  // ── Plus buttons (DOM overlay) ─────────────────────────

  interface PlusButton {
    key: string;
    x: number; // CSS px
    y: number;
    dir: "N" | "S" | "E" | "W";
    newX: number;
    newY: number;
  }

  const plusButtons: PlusButton[] = [];
  for (const r of screenRects) {
    const key = screenKey(r.screen.x, r.screen.y);
    const p = {
      x: r.wx * map.zoom + map.pan.x,
      y: r.wy * map.zoom + map.pan.y,
    };
    const pw = r.w * map.zoom;
    const ph = r.h * map.zoom;
    const half = (GAP * map.zoom) / 2;
    const cands: Array<[PlusButton["dir"], number, number, number, number]> = [
      ["N", p.x + pw / 2, p.y - half, r.screen.x - 1, r.screen.y],
      ["S", p.x + pw / 2, p.y + ph + half, r.screen.x + 1, r.screen.y],
      ["E", p.x + pw + half, p.y + ph / 2, r.screen.x, r.screen.y + 1],
      ["W", p.x - half, p.y + ph / 2, r.screen.x, r.screen.y - 1],
    ];
    for (const [dir, x, y, nx, ny] of cands) {
      if (map.screens[screenKey(nx, ny)]) continue;
      plusButtons.push({ key: `${key}:${dir}`, x, y, dir, newX: nx, newY: ny });
    }
  }

  const toolClass =
    map.activeTool === "pan" || spaceHeld
      ? `tool-pan ${isPanning ? "panning" : ""}`
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
      {plusButtons.map((b) => (
        <button
          key={b.key}
          className="map-plus-btn"
          title={`Add screen (${b.newX},${b.newY}) — ${b.dir}`}
          style={{ left: b.x, top: b.y }}
          onClick={() =>
            mapDispatch({ type: "ADD_SCREEN", x: b.newX, y: b.newY })
          }
        >
          +
        </button>
      ))}
      {Object.keys(map.screens).length === 0 && (
        <div className="upload-overlay">
          <div className="big-icon">▦</div>
          <div>No screens yet</div>
          <div>Click + to add the first screen at 0,0</div>
          <button
            className="btn"
            onClick={() => mapDispatch({ type: "ADD_SCREEN", x: 0, y: 0 })}
          >
            + Add Screen (0,0)
          </button>
        </div>
      )}
    </div>
  );
}
