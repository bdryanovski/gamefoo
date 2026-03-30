/**
 * All-in-one debug overlay subsystem for grid and tilemap games.
 *
 * `GridDebugSystem` renders configurable debug visualisations on top
 * of the game world at order `90` (after everything else). It supports:
 *
 * - **Grid overlay** — lines (orthogonal) or diamond outlines (isometric).
 * - **Coordinates** — `(col, row)` label in each cell.
 * - **World coordinates** — cursor position readout in grid/world/screen space.
 * - **Collision bounds** — AABB and circle outlines for all active colliders.
 * - **Pathfinding** — green line connecting waypoints of the last computed path.
 * - **Tile inspector** — highlight + tooltip on the hovered tile.
 *
 * Every feature is toggled independently via {@link GridDebugConfig}.
 * Disable the entire system at runtime with `system.enabled = false`.
 *
 * @category Debug
 * @since 0.4.0
 *
 * @example Full debug overlay
 * ```ts
 * import { GridDebugSystem } from "gamefoo";
 *
 * engine.use(new GridDebugSystem({
 *   grid: myGrid,
 *   projection: isoProjection,
 *   world: collisionWorld,
 *   showGrid: true,
 *   showCoordinates: true,
 *   showCollisionBounds: true,
 *   showPathfinding: true,
 *   showTileInspector: true,
 *   showWorldCoordinates: true,
 * }));
 * ```
 *
 * @example Grid lines only
 * ```ts
 * engine.use(new GridDebugSystem({
 *   grid: myGrid,
 *   showGrid: true,
 *   gridColor: "rgba(0,255,255,0.4)",
 * }));
 * ```
 *
 * @see {@link GridDebugConfig} — configuration options
 * @see {@link MonitorSystem}   — FPS/memory debug overlay (existing)
 */
import type Engine from '../core/engine';
import type { Grid } from '../core/grid/grid';
import type { IsometricProjection } from '../core/grid/isometric';
import type { RenderContext } from '../core/renderer/type';
import type World from '../core/world';
import type { SubSystem } from '../subsystems/types';
import type { GridDebugConfig } from './grid_debug_types';

export class GridDebugSystem implements SubSystem {
  /** Subsystem identifier. */
  id = 'grid-debug';

  /** Execution order. `90` renders on top of most subsystems. */
  order = 90;

  private grid: Grid;
  private projection: IsometricProjection | null;
  private world: World | null;

  private showGrid: boolean;
  private showCoordinates: boolean;
  private showWorldCoordinates: boolean;
  private showCollisionBounds: boolean;
  private showPathfinding: boolean;
  private showTileInspector: boolean;

  private gridColor: string;
  private pathColor: string;
  private collisionColor: string;
  private fontSize: number;

  private debugPath: { col: number; row: number }[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private mouseActive = false;
  private canvasHeight = 0;
  private canvas: HTMLCanvasElement | null = null;

  /** Cached viewport bounds for culling debug overlays. */
  private viewX = 0;
  private viewY = 0;
  private viewW = 0;
  private viewH = 0;

  /**
   * Creates a new grid debug subsystem.
   *
   * @param config - Debug overlay configuration.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const debug = new GridDebugSystem({
   *   grid: myGrid,
   *   showGrid: true,
   * });
   * engine.use(debug);
   * ```
   */
  /** Stored canvas reference from config for use in init(). */
  private configCanvas: HTMLCanvasElement | undefined;

  constructor(config: GridDebugConfig) {
    this.grid = config.grid;
    this.configCanvas = config.canvas;
    this.projection = config.projection ?? null;
    this.world = config.world ?? null;

    this.showGrid = config.showGrid ?? false;
    this.showCoordinates = config.showCoordinates ?? false;
    this.showWorldCoordinates = config.showWorldCoordinates ?? false;
    this.showCollisionBounds = config.showCollisionBounds ?? false;
    this.showPathfinding = config.showPathfinding ?? false;
    this.showTileInspector = config.showTileInspector ?? false;

    this.gridColor = config.gridColor ?? 'rgba(255,255,0,0.3)';
    this.pathColor = config.pathColor ?? 'rgba(0,255,0,0.8)';
    this.collisionColor = config.collisionColor ?? 'rgba(255,0,0,0.5)';
    this.fontSize = config.fontSize ?? 8;
  }

  /**
   * Called by the engine when this subsystem is attached.
   *
   * Sets up mouse tracking for the tile inspector and coordinate
   * readout.
   *
   * @param engine - The engine instance.
   *
   * @since 0.4.0
   */
  init(engine: Engine): void {
    const dims = engine.dementions;
    this.canvasHeight = dims.height;

    // Prefer the canvas provided via config; fall back to DOM query (browser-only)
    const canvasEl =
      this.configCanvas
      ?? (typeof document !== 'undefined'
        ? document.querySelector('canvas')
        : null);
    if (canvasEl) {
      this.canvas = canvasEl;
      canvasEl.addEventListener('mousemove', this.handleMouseMove);
      canvasEl.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  /**
   * Sets the viewport rectangle for culling. Call once per frame
   * before render with the camera's view rect.
   *
   * @param x - Left edge in world/screen-space.
   * @param y - Top edge in world/screen-space.
   * @param w - Width in pixels.
   * @param h - Height in pixels.
   *
   * @since 0.4.0
   */
  setViewport(x: number, y: number, w: number, h: number): void {
    this.viewX = x;
    this.viewY = y;
    this.viewW = w;
    this.viewH = h;
  }

  /**
   * Sets a pathfinding result to visualise.
   *
   * The path is drawn as a green line connecting cell centres. Call
   * with an empty array to clear.
   *
   * @param path - Array of `{ col, row }` waypoints.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const path = pathfinder.findPath(0, 0, 10, 10);
   * if (path) debugSystem.setDebugPath(path);
   * ```
   */
  setDebugPath(path: { col: number; row: number }[]): void {
    this.debugPath = path;
  }

  /**
   * Renders all enabled debug overlays.
   *
   * Only functional on canvas-backed `RenderContext` implementations.
   * No-op on terminal renderers.
   *
   * @param ctx - The active render context.
   *
   * @since 0.4.0
   */
  render(ctx: RenderContext): void {
    // GridDebugSystem only supports canvas rendering
    const canvasCtx = ctx.getCanvas?.();
    if (!canvasCtx) return;
    if (this.showGrid) this.renderGrid(canvasCtx);
    if (this.showCoordinates) this.renderCoordinates(canvasCtx);
    if (this.showCollisionBounds) this.renderCollisionBounds(canvasCtx);
    if (this.showPathfinding) this.renderPathfinding(canvasCtx);
    if (this.showTileInspector) this.renderTileInspector(canvasCtx);
    if (this.showWorldCoordinates) this.renderWorldCoordinates(canvasCtx);
  }

  /**
   * Cleans up event listeners when the subsystem is destroyed.
   *
   * @since 0.4.0
   */
  destroy(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  // ── Event handlers ────────────────────────────────────────────────

  private handleMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
    this.mouseActive = true;
  };

  private handleMouseLeave = (): void => {
    this.mouseActive = false;
  };

  // ── Grid overlay ──────────────────────────────────────────────────

  /**
   * Draws the grid structure — rectangular lines for orthogonal,
   * diamond outlines for isometric.
   *
   * @internal
   */
  private renderGrid(ctx: CanvasRenderingContext2D): void {
    if (this.projection) {
      this.renderIsometricGrid(ctx);
    } else {
      this.renderOrthogonalGrid(ctx);
    }
  }

  /**
   * Draws orthogonal grid lines.
   *
   * @internal
   */
  private renderOrthogonalGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;

    const { cols, rows, cellWidth, cellHeight, origin } = this.grid;

    for (let row = 0; row <= rows; row++) {
      const y = origin.y + row * cellHeight;
      ctx.beginPath();
      ctx.moveTo(origin.x, y);
      ctx.lineTo(origin.x + cols * cellWidth, y);
      ctx.stroke();
    }

    for (let col = 0; col <= cols; col++) {
      const x = origin.x + col * cellWidth;
      ctx.beginPath();
      ctx.moveTo(x, origin.y);
      ctx.lineTo(x, origin.y + rows * cellHeight);
      ctx.stroke();
    }
  }

  /**
   * Draws isometric diamond outlines for each tile.
   *
   * @internal
   */
  private renderIsometricGrid(ctx: CanvasRenderingContext2D): void {
    if (!this.projection) return;

    const range = this.projection.getVisibleRange(
      this.viewX,
      this.viewY,
      this.viewW,
      this.viewH,
      this.grid.cols,
      this.grid.rows,
    );

    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 1;

    for (let row = range.minRow; row <= range.maxRow; row++) {
      for (let col = range.minCol; col <= range.maxCol; col++) {
        const [top, right, bottom, left] = this.projection.getTileDiamond(
          col,
          row,
        );
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(right.x, right.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.lineTo(left.x, left.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // ── Coordinates ───────────────────────────────────────────────────

  /**
   * Draws `(col, row)` labels in each visible cell.
   *
   * @internal
   */
  private renderCoordinates(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let minCol = 0;
    let maxCol = this.grid.cols - 1;
    let minRow = 0;
    let maxRow = this.grid.rows - 1;

    if (this.projection) {
      const range = this.projection.getVisibleRange(
        this.viewX,
        this.viewY,
        this.viewW,
        this.viewH,
        this.grid.cols,
        this.grid.rows,
      );
      minCol = range.minCol;
      maxCol = range.maxCol;
      minRow = range.minRow;
      maxRow = range.maxRow;
    } else if (this.viewW > 0) {
      const cw = this.grid.cellWidth;
      const ch = this.grid.cellHeight;
      minCol = Math.max(0, Math.floor(this.viewX / cw) - 1);
      maxCol = Math.min(
        this.grid.cols - 1,
        Math.ceil((this.viewX + this.viewW) / cw) + 1,
      );
      minRow = Math.max(0, Math.floor(this.viewY / ch) - 1);
      maxRow = Math.min(
        this.grid.rows - 1,
        Math.ceil((this.viewY + this.viewH) / ch) + 1,
      );
    }

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        let cx: number;
        let cy: number;

        if (this.projection) {
          const pos = this.projection.gridToScreenFast(col, row);
          cx = pos.x + this.projection.tileWidth / 2;
          cy = pos.y + this.projection.tileHeight / 2;
        } else {
          cx =
            this.grid.origin.x
            + col * this.grid.cellWidth
            + this.grid.cellWidth / 2;
          cy =
            this.grid.origin.y
            + row * this.grid.cellHeight
            + this.grid.cellHeight / 2;
        }

        ctx.fillText(`${col},${row}`, cx, cy);
      }
    }

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // ── Collision bounds ──────────────────────────────────────────────

  /**
   * Draws outlines for all active colliders in the world.
   *
   * @internal
   */
  private renderCollisionBounds(ctx: CanvasRenderingContext2D): void {
    if (!this.world) return;

    ctx.strokeStyle = this.collisionColor;
    ctx.lineWidth = 1;

    for (const collider of this.world.getColliders()) {
      if (!collider.enabled) continue;

      const bounds = collider.getWorldBounds();
      const shape = collider.shape;

      if (shape.type === 'aabb') {
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(
          bounds.x + shape.radius,
          bounds.y + shape.radius,
          shape.radius,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }
  }

  // ── Pathfinding ───────────────────────────────────────────────────

  /**
   * Draws the debug path as a line connecting cell centres, with
   * dots at each waypoint.
   *
   * @internal
   */
  private renderPathfinding(ctx: CanvasRenderingContext2D): void {
    if (this.debugPath.length < 2) return;

    ctx.strokeStyle = this.pathColor;
    ctx.fillStyle = this.pathColor;
    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let i = 0; i < this.debugPath.length; i++) {
      const wp = this.debugPath[i]!;
      const pos = this.getCellCenter(wp.col, wp.row);

      if (i === 0) {
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
      }
    }

    ctx.stroke();

    const dotRadius = 3;
    for (const wp of this.debugPath) {
      const pos = this.getCellCenter(wp.col, wp.row);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Tile inspector ────────────────────────────────────────────────

  /**
   * Highlights the tile under the cursor and shows a tooltip.
   *
   * @internal
   */
  private renderTileInspector(ctx: CanvasRenderingContext2D): void {
    if (!this.mouseActive) return;

    let col: number;
    let row: number;

    if (this.projection) {
      const cell = this.projection.screenToGrid(this.mouseX, this.mouseY);
      col = cell.col;
      row = cell.row;
    } else {
      const cell = this.grid.worldToCell(this.mouseX, this.mouseY);
      col = cell.col;
      row = cell.row;
    }

    if (!this.grid.isInBounds(col, row)) return;

    const gridCell = this.grid.getCell(col, row);
    if (!gridCell) return;

    if (this.projection) {
      const [top, right, bottom, left] = this.projection.getTileDiamond(
        col,
        row,
      );
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(right.x, right.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x, left.y);
      ctx.closePath();
      ctx.fill();
    } else {
      const wx = this.grid.origin.x + col * this.grid.cellWidth;
      const wy = this.grid.origin.y + row * this.grid.cellHeight;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(wx, wy, this.grid.cellWidth, this.grid.cellHeight);
    }

    const text = `(${col},${row}) id:${gridCell.value} ${gridCell.walkable ? 'walk' : 'solid'}`;
    const pos = this.getCellCenter(col, row);

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(
      pos.x - 2,
      pos.y - this.fontSize - 4,
      ctx.measureText(text).width + 4,
      this.fontSize + 4,
    );

    ctx.fillStyle = '#fff';
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textAlign = 'start';
    ctx.fillText(text, pos.x, pos.y - 4);
  }

  // ── World coordinates readout ─────────────────────────────────────

  /**
   * Draws a fixed-position readout showing the cursor's grid, world,
   * and screen coordinates.
   *
   * @internal
   */
  private renderWorldCoordinates(ctx: CanvasRenderingContext2D): void {
    if (!this.mouseActive) return;

    let col: number;
    let row: number;

    if (this.projection) {
      const cell = this.projection.screenToGrid(this.mouseX, this.mouseY);
      col = cell.col;
      row = cell.row;
    } else {
      const cell = this.grid.worldToCell(this.mouseX, this.mouseY);
      col = cell.col;
      row = cell.row;
    }

    const lines = [
      `screen: (${this.mouseX.toFixed(0)}, ${this.mouseY.toFixed(0)})`,
      `grid:   (${col}, ${row})`,
      `bounds: ${this.grid.isInBounds(col, row) ? 'yes' : 'no'}`,
    ];

    const padding = 4;
    const lineHeight = this.fontSize + 2;
    const x = padding;
    const y = this.canvasHeight - lines.length * lineHeight - padding;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x, y, 160, lines.length * lineHeight + padding);

    ctx.fillStyle = '#0f0';
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textAlign = 'start';
    ctx.textBaseline = 'top';

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i]!, x + padding, y + padding + i * lineHeight);
    }

    ctx.textBaseline = 'alphabetic';
  }

  // ── Helpers ───────────────────────────────────────────────────────

  /**
   * Returns the screen-space center of a grid cell.
   *
   * @internal
   */
  private getCellCenter(col: number, row: number): { x: number; y: number } {
    if (this.projection) {
      const pos = this.projection.gridToScreenFast(col, row);
      return {
        x: pos.x + this.projection.tileWidth / 2,
        y: pos.y + this.projection.tileHeight / 2,
      };
    }
    return {
      x:
        this.grid.origin.x
        + col * this.grid.cellWidth
        + this.grid.cellWidth / 2,
      y:
        this.grid.origin.y
        + row * this.grid.cellHeight
        + this.grid.cellHeight / 2,
    };
  }
}
