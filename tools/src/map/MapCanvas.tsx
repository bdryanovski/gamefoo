import React, { useRef, useEffect, useCallback, useState } from "react";
import type {
  MapState,
  MapAction,
  MapPlacement,
  PaletteSelection,
} from "./types";
import { screenKey, resolvePlacementDisplay } from "./types";
import type { AppState, SpriteRegion } from "../types";
import { objectMachines } from "../types";

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

interface DisplayRef {
  spriteId: string | null;
  animationId: string | null;
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
  const animById = new Map(state.animations.map((a) => [a.id, a]));
  const machineById = new Map(
    objectMachines(state.objects).map((m) => [m.id, m]),
  );

  const displayOf = useCallback(
    (p: MapPlacement): DisplayRef =>
      resolvePlacementDisplay(
        p,
        state.sprites,
        state.animations,
        objectMachines(state.objects),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.sprites, state.animations, state.objects],
  );

  /** Static size reference for hit-testing / outlines. */
  const sizeSpriteOf = useCallback(
    (p: MapPlacement): SpriteRegion | null => {
      const d = displayOf(p);
      return d.spriteId ? (spriteById.get(d.spriteId) ?? null) : null;
    },
    [displayOf, spriteById],
  );

  // ── Pan / interaction state ────────────────────────────
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);
  /** Move tool: the placement being dragged. */
  const movingRef = useRef<{
    id: string;
    screenKey: string;
  } | null>(null);
  const [movePreview, setMovePreview] = useState<{
    id: string;
    screenKey: string;
    spriteId: string | null;
    x: number;
    y: number;
    rotation?: number;
    flipX?: boolean;
    flipY?: boolean;
    valid: boolean;
  } | null>(null);
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

  /**
   * Visible in the current view mode. In "All" mode every level shows;
   * otherwise the active level plus every level below it (as dimmed
   * positioning reference). Levels above the active level are hidden.
   */
  const levelVisible = useCallback(
    (level: number) =>
      map.showAllLevels || level <= map.activeLevel,
    [map.showAllLevels, map.activeLevel],
  );

  /** Interactive (hit-testable) — only the active level, unless "All". */
  const levelInteractive = useCallback(
    (level: number) => map.showAllLevels || level === map.activeLevel,
    [map.showAllLevels, map.activeLevel],
  );

  /**
   * Render opacity for a level. Full opacity in "All" mode and for the
   * active level. Lower levels dim progressively with depth so stacked
   * levels stay distinguishable while positioning.
   */
  const alphaForLevel = useCallback(
    (level: number) => {
      if (map.showAllLevels || level === map.activeLevel) return 1;
      const depth = map.activeLevel - level; // >= 1 (only below reaches here)
      return Math.max(0.15, 0.5 - (depth - 1) * 0.12);
    },
    [map.showAllLevels, map.activeLevel],
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

  // ── Live animation tick ────────────────────────────────

  const [tick, setTick] = useState(0);
  const hasAnimatedPlacements = React.useMemo(() => {
    for (const s of Object.values(map.screens)) {
      for (const p of s.placements) {
        if (!levelVisible(p.level)) continue;
        if (displayOf(p).animationId) return true;
      }
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map.screens, map.showAllLevels, map.activeLevel, state.animations, state.objects, displayOf]);

  useEffect(() => {
    if (!hasAnimatedPlacements) return;
    let raf = 0;
    const loop = (t: number) => {
      setTick(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hasAnimatedPlacements]);

  // ── Rendering ──────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frameIndexOf = (animationId: string | null): number => {
      if (!animationId) return -1;
      const anim = animById.get(animationId);
      if (!anim || anim.frames.length === 0 || anim.duration <= 0) return -1;
      return Math.floor(tick / 1000 / anim.duration) % anim.frames.length;
    };

    const drawSprite = (
      spriteId: string | null,
      dx: number,
      dy: number,
      alpha = 1,
      transform?: { rotation?: number; flipX?: boolean; flipY?: boolean },
    ) => {
      if (!spriteId) return;
      const sprite = spriteById.get(spriteId);
      if (!sprite) return;
      const img = imageMap.get(sprite.imageId);
      if (!img || !img.complete) return;
      ctx.globalAlpha = alpha;
      if (
        transform &&
        (transform.rotation || transform.flipX || transform.flipY)
      ) {
        ctx.save();
        ctx.translate(dx + sprite.width / 2, dy + sprite.height / 2);
        if (transform.rotation) {
          ctx.rotate((transform.rotation * Math.PI) / 180);
        }
        if (transform.flipX || transform.flipY) {
          ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
        }
        ctx.drawImage(
          img,
          sprite.x, sprite.y, sprite.width, sprite.height,
          -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height,
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          img,
          sprite.x, sprite.y, sprite.width, sprite.height,
          dx, dy, sprite.width, sprite.height,
        );
      }
      ctx.globalAlpha = 1;
    };

    /** Draw a placement: animated kinds play live, machines show
     *  their current state; a ▶ badge marks animated objects. */
    const drawPlacement = (p: MapPlacement, alpha = 1) => {
      const d = displayOf(p);
      let spriteId = d.spriteId;
      if (d.animationId) {
        const anim = animById.get(d.animationId);
        const fi = frameIndexOf(d.animationId);
        if (anim && fi >= 0) {
          spriteId = anim.frames[fi] ?? d.spriteId;
        }
      }
      drawSprite(spriteId, p.x, p.y, alpha, p);

      if (d.animationId || p.kind === "machine") {
        const sprite = spriteId ? spriteById.get(spriteId) : null;
        const w = sprite?.width ?? map.blockSize;
        ctx.fillStyle = "#00ff66";
        ctx.font = `bold ${Math.max(7, 9 / map.zoom)}px monospace`;
        ctx.textBaseline = "top";
        ctx.fillText("▶", p.x + w - 8 / map.zoom, p.y + 1 / map.zoom);
        ctx.textBaseline = "alphabetic";
      }
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

        // Placements sorted by level (stable: insertion order within a
        // level). Levels above the active one are hidden; the active
        // level renders solid while lower levels dim with depth.
        ctx.beginPath();
        ctx.rect(0, 0, r.w, r.h);
        ctx.clip();
        const sorted = [...r.screen.placements].sort(
          (a, b) => a.level - b.level,
        );
        for (const p of sorted) {
          if (movePreview && p.id === movePreview.id) continue;
          if (!levelVisible(p.level)) continue;
          const alpha = alphaForLevel(p.level);
          drawPlacement(p, alpha);
        }

        // Level badge on each screen (top-right)
        ctx.fillStyle = "#00ff66";
        ctx.font = `bold ${Math.max(9, 10 / map.zoom)}px monospace`;
        ctx.textBaseline = "top";
        ctx.fillText(
          map.showAllLevels ? "L:all" : `L:${map.activeLevel}`,
          r.w - (map.showAllLevels ? 46 : 34) / map.zoom,
          3 / map.zoom,
        );
        ctx.textBaseline = "alphabetic";

        // Move-tool preview: ghost of the dragged placement
        if (
          movePreview &&
          movePreview.screenKey === screenKey(r.screen.x, r.screen.y)
        ) {
          const mpSprite = movePreview.spriteId
            ? spriteById.get(movePreview.spriteId)
            : null;
          const mw = mpSprite?.width ?? map.blockSize;
          const mh = mpSprite?.height ?? map.blockSize;
          drawSprite(
            movePreview.spriteId,
            movePreview.x,
            movePreview.y,
            0.6,
            movePreview,
          );
          ctx.save();
          ctx.translate(movePreview.x + mw / 2, movePreview.y + mh / 2);
          if (movePreview.rotation) {
            ctx.rotate((movePreview.rotation * Math.PI) / 180);
          }
          ctx.strokeStyle = movePreview.valid ? "#ffff00" : "#ff4444";
          ctx.lineWidth = 2 / map.zoom;
          ctx.strokeRect(-mw / 2, -mh / 2, mw, mh);
          ctx.restore();
        }

        // Selected-placement outline (edit indicator)
        const selPlacement =
          map.selectedPlacementId &&
            r.screen.placements.some((p) => p.id === map.selectedPlacementId)
            ? r.screen.placements.find(
              (p) => p.id === map.selectedPlacementId,
            )
            : null;
        if (
          selPlacement &&
          levelVisible(selPlacement.level) &&
          !(movePreview && movePreview.id === selPlacement.id)
        ) {
          const sSprite = sizeSpriteOf(selPlacement);
          const sw = sSprite?.width ?? map.blockSize;
          const sh = sSprite?.height ?? map.blockSize;
          ctx.save();
          ctx.translate(selPlacement.x + sw / 2, selPlacement.y + sh / 2);
          if (selPlacement.rotation) {
            ctx.rotate((selPlacement.rotation * Math.PI) / 180);
          }
          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 1.5 / map.zoom;
          ctx.setLineDash([4 / map.zoom, 3 / map.zoom]);
          ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
          ctx.setLineDash([]);
          ctx.restore();
        }

        // Ghost preview of the selected palette item at hover cell
        if (
          hover &&
          hover.screenKey === screenKey(r.screen.x, r.screen.y) &&
          map.activeTool === "paint" &&
          map.selected
        ) {
          const col = Math.floor(hover.localX / map.blockSize);
          const row = Math.floor(hover.localY / map.blockSize);
          const ghost = resolveSelectionDisplay(map.selected);
          const gSprite = ghost?.spriteId
            ? spriteById.get(ghost.spriteId)
            : null;
          if (gSprite) {
            drawSprite(
              ghost?.spriteId ?? null,
              col * map.blockSize,
              row * map.blockSize,
              0.5,
            );
          }
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
  }, [
    map,
    canvasSize,
    hover,
    imageMap,
    state.sprites,
    state.animations,
    state.objects,
    movePreview,
    tick,
  ]);

  /** Resolve a palette selection to its display (for ghost preview). */
  const resolveSelectionDisplay = useCallback(
    (sel: PaletteSelection): DisplayRef | null => {
      if (!sel) return null;
      if (sel.kind === "sprite") return { spriteId: sel.id, animationId: null };
      if (sel.kind === "animation") {
        const anim = animById.get(sel.id);
        return { spriteId: anim?.frames[0] ?? null, animationId: sel.id };
      }
      const machine = machineById.get(sel.id);
      if (!machine) return null;
      const st =
        machine.states.find((s) => s.id === machine.initialStateId) ??
        machine.states[0];
      if (!st) return null;
      if (st.display.kind === "sprite") {
        return { spriteId: st.display.spriteId, animationId: null };
      }
      const anim = st.display.animationId
        ? animById.get(st.display.animationId)
        : undefined;
      return { spriteId: anim?.frames[0] ?? null, animationId: anim?.id ?? null };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.animations, state.objects],
  );

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
      // Topmost = highest level, then latest insertion (reverse walk of
      // the level-sorted list).
      const sorted = [...r.screen.placements].sort(
        (a, b) => a.level - b.level,
      );
      for (let i = sorted.length - 1; i >= 0; i--) {
        const p = sorted[i]!;
        if (!levelInteractive(p.level)) continue;
        const sprite = sizeSpriteOf(p);
        if (!sprite) continue;
        const rot = ((p.rotation ?? 0) * Math.PI) / 180;
        if (rot === 0) {
          if (
            localX >= p.x &&
            localX < p.x + sprite.width &&
            localY >= p.y &&
            localY < p.y + sprite.height
          ) {
            return p;
          }
        } else {
          const cx = p.x + sprite.width / 2;
          const cy = p.y + sprite.height / 2;
          const dx = localX - cx;
          const dy = localY - cy;
          const lx = dx * Math.cos(rot) + dy * Math.sin(rot);
          const ly = -dx * Math.sin(rot) + dy * Math.cos(rot);
          if (
            Math.abs(lx) <= sprite.width / 2 &&
            Math.abs(ly) <= sprite.height / 2
          ) {
            return p;
          }
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenRects, state.sprites, state.animations, state.objects, map.showAllLevels, map.activeLevel],
  );

  /** Build a new placement for the current palette selection. */
  const makePlacement = useCallback(
    (col: number, row: number): MapPlacement | null => {
      const sel = map.selected;
      if (!sel) return null;
      const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const x = col * map.blockSize;
      const y = row * map.blockSize;
      const level = map.activeLevel;
      if (sel.kind === "sprite") {
        return { id, kind: "sprite", spriteId: sel.id, x, y, level };
      }
      if (sel.kind === "animation") {
        return { id, kind: "animation", animationId: sel.id, x, y, level };
      }
      return {
        id,
        kind: "machine",
        machineId: sel.id,
        x,
        y,
        level,
      };
    },
    [map.selected, map.blockSize, map.activeLevel],
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

      if (tool === "fill") {
        if (map.selected?.kind === "sprite") {
          mapDispatch({
            type: "SET_SCREEN_DEFAULT",
            x: r.screen.x,
            y: r.screen.y,
            spriteId: map.selected.id,
          });
        }
        return;
      }

      if (tool === "pick") {
        const p = findTopmostPlacement(key, world.x, world.y);
        if (p) {
          mapDispatch({
            type: "SELECT_PALETTE",
            selection:
              p.kind === "sprite"
                ? { kind: "sprite", id: p.spriteId }
                : p.kind === "animation"
                  ? { kind: "animation", id: p.animationId }
                  : { kind: "machine", id: p.machineId },
          });
          mapDispatch({ type: "SELECT_PLACEMENT", id: p.id });
        } else {
          if (r.screen.defaultSpriteId) {
            mapDispatch({
              type: "SELECT_PALETTE",
              selection: {
                kind: "sprite",
                id: r.screen.defaultSpriteId,
              },
            });
          }
          mapDispatch({ type: "SELECT_PLACEMENT", id: null });
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

      // Move: click-drag a placement to reposition it (drop on mouseup).
      if (tool === "move") {
        const p = findTopmostPlacement(key, world.x, world.y);
        if (!p) {
          mapDispatch({ type: "SELECT_PLACEMENT", id: null });
          return;
        }
        mapDispatch({ type: "SELECT_PLACEMENT", id: p.id });
        movingRef.current = { id: p.id, screenKey: key };
        setMovePreview({
          id: p.id,
          screenKey: key,
          spriteId: displayOf(p).spriteId,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          flipX: p.flipX,
          flipY: p.flipY,
          valid: true,
        });
        return;
      }

      // Paint: click places one item per click at the active level.
      if (tool === "paint") {
        const placement = makePlacement(col, row);
        if (placement) {
          mapDispatch({ type: "ADD_PLACEMENT", screenKey: key, placement });
        }
      }
    },
    [
      map,
      mapDispatch,
      getWorldPos,
      findScreenAt,
      findTopmostPlacement,
      makePlacement,
      displayOf,
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

      const world = getWorldPos(e);
      const r = findScreenAt(world.x, world.y);

      // Move tool: update the drag preview (block-snapped).
      const moving = movingRef.current;
      if (moving && map.activeTool === "move") {
        if (!r) {
          setMovePreview(null);
          return;
        }
        const key = screenKey(r.screen.x, r.screen.y);
        const localX = world.x - r.wx;
        const localY = world.y - r.wy;
        const nx = Math.round(localX / map.blockSize) * map.blockSize;
        const ny = Math.round(localY / map.blockSize) * map.blockSize;
        setMovePreview((prev) =>
          prev
            ? {
              ...prev,
              screenKey: key,
              x: nx,
              y: ny,
              valid: moving.screenKey === key,
            }
            : prev,
        );
        onStatus({
          screenKey: key,
          block: {
            col: Math.max(0, Math.floor(localX / map.blockSize)),
            row: Math.max(0, Math.floor(localY / map.blockSize)),
          },
        });
        return;
      }

      // Hover only — placement/erase happen on click (mousedown).
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
    [isPanning, mapDispatch, getWorldPos, findScreenAt, map, onStatus],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);

    // Commit a move-tool drag.
    const moving = movingRef.current;
    if (moving) {
      movingRef.current = null;
      const preview = movePreview;
      setMovePreview(null);
      if (preview && preview.valid) {
        const original = map.screens[moving.screenKey]?.placements.find(
          (p) => p.id === moving.id,
        );
        if (
          original &&
          (original.x !== preview.x || original.y !== preview.y) &&
          preview.screenKey === moving.screenKey
        ) {
          mapDispatch({
            type: "MOVE_PLACEMENT",
            screenKey: moving.screenKey,
            id: moving.id,
            x: preview.x,
            y: preview.y,
          });
        }
      }
    }
  }, [mapDispatch, map.screens, movePreview]);

  // Stop panning / commit moves even off-canvas.
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
