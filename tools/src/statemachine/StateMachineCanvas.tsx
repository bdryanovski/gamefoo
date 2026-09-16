import React, { useRef, useEffect, useCallback, useState } from "react";
import type { StateMachineDef, StateNodeDef } from "./types";
import type { AnimationDef, SpriteRegion } from "../types";
import { Icon } from "../components/Icon";

const NODE_W = 150;
const NODE_H = 96;
const SNAP = 8;

interface Props {
  machine: StateMachineDef | null;
  sprites: SpriteRegion[];
  animations: AnimationDef[];
  imageMap: Map<string, HTMLImageElement>;
  selectedStateId: string | null;
  onSelectState: (id: string | null) => void;
  onCommitStatePos: (id: string, x: number, y: number) => void;
  onAddStateAt: (x: number, y: number) => void;
}

export function StateMachineCanvas({
  machine,
  sprites,
  animations,
  imageMap,
  selectedStateId,
  onSelectState,
  onCommitStatePos,
  onAddStateAt,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const rafRef = useRef<number>(0);

  const [view, setView] = useState({ zoom: 1, pan: { x: 40, y: 40 } });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  const dragRef = useRef<{ id: string; offX: number; offY: number } | null>(
    null,
  );
  const [dragPreview, setDragPreview] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const spriteById = new Map(sprites.map((s) => [s.id, s]));
  const animById = new Map(animations.map((a) => [a.id, a]));

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

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      if (!machine) return;

      ctx.save();
      ctx.translate(view.pan.x, view.pan.y);
      ctx.scale(view.zoom, view.zoom);

      const posOf = (st: StateNodeDef) =>
        dragPreview && dragPreview.id === st.id ? dragPreview : st;

      const nodeCenter = (st: StateNodeDef) => {
        const p = posOf(st);
        return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 };
      };

      // ── Transitions (under nodes) ─────────────────────

      for (const t of machine.transitions) {
        const a = machine.states.find((s) => s.id === t.fromStateId);
        const b = machine.states.find((s) => s.id === t.toStateId);
        if (!a || !b) continue;

        const ac = nodeCenter(a);
        const bc = nodeCenter(b);
        ctx.strokeStyle = "#404040";
        ctx.lineWidth = 1.5;

        if (a.id === b.id) {
          // Self-loop: circle above the node
          const cx = ac.x;
          const cy = posOf(a).y - 12;
          ctx.beginPath();
          ctx.arc(cx, cy, 13, 0, Math.PI * 2);
          ctx.stroke();
          // arrowhead at right of the loop, pointing down
          ctx.fillStyle = "#404040";
          ctx.beginPath();
          ctx.moveTo(cx + 13, cy + 4);
          ctx.lineTo(cx + 19, cy + 2);
          ctx.lineTo(cx + 14, cy - 6);
          ctx.closePath();
          ctx.fill();
          drawLabel(ctx, t.condition || "?", cx, cy - 20);
        } else {
          const dx = bc.x - ac.x;
          const dy = bc.y - ac.y;
          const hw = NODE_W / 2;
          const hh = NODE_H / 2;
          const sA = Math.min(
            dx !== 0 ? hw / Math.abs(dx) : Infinity,
            dy !== 0 ? hh / Math.abs(dy) : Infinity,
          );
          const sB = Math.min(
            dx !== 0 ? hw / Math.abs(dx) : Infinity,
            dy !== 0 ? hh / Math.abs(dy) : Infinity,
          );
          const sx = ac.x + dx * sA;
          const sy = ac.y + dy * sA;
          const ex = bc.x - dx * sB;
          const ey = bc.y - dy * sB;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const hs = 9;
          ctx.fillStyle = "#404040";
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - ux * hs + uy * hs * 0.5, ey - uy * hs - ux * hs * 0.5);
          ctx.lineTo(ex - ux * hs - uy * hs * 0.5, ey - uy * hs + ux * hs * 0.5);
          ctx.closePath();
          ctx.fill();

          drawLabel(ctx, t.condition || "?", (sx + ex) / 2, (sy + ey) / 2);
        }
      }

      // ── State nodes ───────────────────────────────────

      for (const st of machine.states) {
        const p = posOf(st);
        const selected = st.id === selectedStateId;
        const isInitial = st.id === machine.initialStateId;

        // Drop shadow
        ctx.fillStyle = "#808080";
        ctx.fillRect(p.x + 3, p.y + 3, NODE_W, NODE_H);
        // Body
        ctx.fillStyle = "#c0c0c0";
        ctx.fillRect(p.x, p.y, NODE_W, NODE_H);
        // Header
        ctx.fillStyle = selected ? "#000080" : "#40406a";
        ctx.fillRect(p.x, p.y, NODE_W, 18);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.textBaseline = "alphabetic";
        const nameText =
          st.name.length > 19 ? `${st.name.slice(0, 18)}…` : st.name;
        ctx.fillText(nameText, p.x + 4, p.y + 13);
        if (isInitial) {
          ctx.fillStyle = "#00ff00";
          ctx.fillText("▶", p.x + NODE_W - 14, p.y + 13);
        }

        // Thumbnail: sprite, or first frame of the animation
        const thumbBox = { x: p.x + 12, y: p.y + 26, s: 52 };
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(thumbBox.x - 2, thumbBox.y - 2, thumbBox.s + 4, thumbBox.s + 4);

        let displaySprite: SpriteRegion | null = null;
        if (st.display.kind === "sprite") {
          displaySprite = st.display.spriteId
            ? (spriteById.get(st.display.spriteId) ?? null)
            : null;
        } else {
          const anim = st.display.animationId
            ? animById.get(st.display.animationId)
            : undefined;
          const firstFrameId = anim?.frames[0];
          displaySprite = firstFrameId
            ? (spriteById.get(firstFrameId) ?? null)
            : null;
        }

        if (displaySprite) {
          const img = imageMap.get(displaySprite.imageId);
          if (img && img.complete) {
            const scale = Math.min(
              thumbBox.s / displaySprite.width,
              thumbBox.s / displaySprite.height,
            );
            const dw = displaySprite.width * scale;
            const dh = displaySprite.height * scale;
            ctx.drawImage(
              img,
              displaySprite.x, displaySprite.y,
              displaySprite.width, displaySprite.height,
              thumbBox.x + (thumbBox.s - dw) / 2,
              thumbBox.y + (thumbBox.s - dh) / 2,
              dw, dh,
            );
          }
        } else {
          ctx.fillStyle = "#ffff00";
          ctx.font = "bold 22px monospace";
          ctx.fillText("?", thumbBox.x + thumbBox.s / 2 - 6, thumbBox.y + thumbBox.s / 2 + 8);
        }

        // Kind label
        ctx.fillStyle = "#404040";
        ctx.font = "9px monospace";
        const kindLabel =
          st.display.kind === "sprite"
            ? displaySprite
              ? "sprite"
              : "no sprite"
            : displaySprite
              ? "animation"
              : "no anim";
        ctx.fillText(kindLabel, thumbBox.x + thumbBox.s + 10, p.y + 34);
        ctx.fillText(
          st.display.kind === "animation"
            ? (st.display.animationId
                ? (animById.get(st.display.animationId)?.name.slice(0, 12) ?? "")
                : "—")
            : (st.display.spriteId
                ? (spriteById.get(st.display.spriteId)?.name.slice(0, 12) ?? "")
                : "—"),
          thumbBox.x + thumbBox.s + 10,
          p.y + 46,
        );

        // Border
        ctx.strokeStyle = selected ? "#ffff00" : "#000000";
        ctx.lineWidth = selected ? 2.5 : 1;
        ctx.strokeRect(p.x, p.y, NODE_W, NODE_H);
      }

      ctx.restore();
    });

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    machine,
    sprites,
    animations,
    imageMap,
    canvasSize,
    view,
    dragPreview,
    selectedStateId,
  ]);

  // ── Mouse handlers ─────────────────────────────────────

  const getWorldPos = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      return {
        x: (sx - view.pan.x) / view.zoom,
        y: (sy - view.pan.y) / view.zoom,
      };
    },
    [view],
  );

  const findNodeAt = useCallback(
    (wx: number, wy: number): StateNodeDef | null => {
      if (!machine) return null;
      for (let i = machine.states.length - 1; i >= 0; i--) {
        const st = machine.states[i]!;
        if (
          wx >= st.x &&
          wx < st.x + NODE_W &&
          wy >= st.y &&
          wy < st.y + NODE_H
        ) {
          return st;
        }
      }
      return null;
    },
    [machine],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 1 || (spaceHeld && e.button === 0)) {
        setIsPanning(true);
        panStartRef.current = {
          x: e.clientX - view.pan.x,
          y: e.clientY - view.pan.y,
        };
        return;
      }
      if (e.button !== 0) return;
      const world = getWorldPos(e);
      const node = findNodeAt(world.x, world.y);
      if (node) {
        onSelectState(node.id);
        dragRef.current = {
          id: node.id,
          offX: world.x - node.x,
          offY: world.y - node.y,
        };
        setDragPreview({ id: node.id, x: node.x, y: node.y });
      } else {
        onSelectState(null);
      }
    },
    [spaceHeld, view.pan, getWorldPos, findNodeAt, onSelectState],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setView((v) => ({
          ...v,
          pan: {
            x: e.clientX - panStartRef.current.x,
            y: e.clientY - panStartRef.current.y,
          },
        }));
        return;
      }
      const drag = dragRef.current;
      if (drag) {
        const world = getWorldPos(e);
        setDragPreview({
          id: drag.id,
          x: Math.round((world.x - drag.offX) / SNAP) * SNAP,
          y: Math.round((world.y - drag.offY) / SNAP) * SNAP,
        });
      }
    },
    [isPanning, getWorldPos],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    const drag = dragRef.current;
    if (drag) {
      dragRef.current = null;
      const preview = dragPreview;
      setDragPreview(null);
      if (preview) {
        onCommitStatePos(drag.id, preview.x, preview.y);
      }
    }
  }, [dragPreview, onCommitStatePos]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const world = getWorldPos(e);
      const node = findNodeAt(world.x, world.y);
      if (node) return;
      onAddStateAt(
        Math.round(world.x / SNAP) * SNAP,
        Math.round(world.y / SNAP) * SNAP,
      );
    },
    [getWorldPos, findNodeAt, onAddStateAt],
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const zoom = Math.max(0.25, Math.min(3, v.zoom * factor));
      return {
        zoom,
        pan: {
          x: mx - (mx - v.pan.x) * (zoom / v.zoom),
          y: my - (my - v.pan.y) * (zoom / v.zoom),
        },
      };
    });
  }, []);

  const toolClass = spaceHeld ? `tool-pan ${isPanning ? "panning" : ""}` : "";

  return (
    <div ref={containerRef} className={`canvas-area ${toolClass}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="canvas-hint">
        double-click: add state · drag node: move · space/middle: pan · wheel:
        zoom
      </div>
      {!machine && (
        <div className="upload-overlay">
          <div className="big-icon"><Icon name="settings" size={48} /></div>
          <div>No state machine selected</div>
          <div>Create one in the panel →</div>
        </div>
      )}
      {machine && machine.states.length === 0 && (
        <div className="upload-overlay">
          <div className="big-icon">◈</div>
          <div>Double-click to add the first state</div>
        </div>
      )}
    </div>
  );
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
) {
  ctx.font = "9px monospace";
  const w = ctx.measureText(text).width;
  ctx.fillStyle = "#ffff00";
  ctx.fillRect(x - w / 2 - 3, y - 7, w + 6, 12);
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x - w / 2, y - 1);
  ctx.textBaseline = "alphabetic";
}
