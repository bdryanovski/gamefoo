/**
 * Subsystem that renders a performance debug overlay.
 *
 * Tracks FPS and memory usage, draws a frame-rate graph,
 * and can display grid overlays for debugging.
 *
 * Runs at order `100` — last of all subsystems.
 *
 * @since 0.2.0
 * @category SubSystems
 *
 * @example
 * ```ts
 * const monitor = new MonitorSystem({ graph: true });
 * engine.use(monitor);
 *
 * // Toggle features
 * monitor.showFps = true;
 * monitor.showGrid = true;
 * monitor.gridSize = 16;
 * ```
 */
import type Engine from '../core/engine';
import FontBitmap from '../core/fonts/font_bitmap';
import type { RenderContext } from '../core/renderer/type';
import type { SubSystem } from './types';

/**
 * Chrome-only non-standard extension to the Performance API.
 * @internal
 */
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/** @internal */
declare const performance: Performance & { memory?: MemoryInfo };

/**
 * Grid size options for the grid overlay.
 *
 * @since 0.5.0
 */
export type GridSize = 8 | 16 | 32 | 'none';

/**
 * Monitor system configuration options.
 *
 * @since 0.5.0
 */
export interface MonitorSystemOptions {
  /** Show FPS graph (default: true) */
  graph?: boolean;
  /** Show FPS counter (default: true) */
  showFps?: boolean;
  /** Show memory usage (default: true when available) */
  showMemory?: boolean;
  /** Show grid overlay (default: false) */
  showGrid?: boolean;
  /** Grid size in pixels (default: 16) */
  gridSize?: GridSize;
  /** Grid color (default: '#333333') */
  gridColor?: string;
  /** X position of the overlay (default: 8) */
  x?: number;
  /** Y position of the overlay (default: 8) */
  y?: number;
}

const font = new FontBitmap('5x5');

/**
 * Performance and debug overlay subsystem.
 *
 * @since 0.2.0
 */
export class MonitorSystem implements SubSystem {
  id = 'monitor';
  /** Order 90 ensures grid renders BEFORE menu system (order 95) */
  order = 90;
  enabled = true;

  private fps: number = 0;
  private timer: number = 0;
  private frameCount: number = 0;
  private memory: number = 0;
  private frames: number[] = [];

  /** X position of the overlay in pixels. @defaultValue `8` */
  public x: number = 8;
  /** Y position of the overlay in pixels. @defaultValue `8` */
  public y: number = 8;

  /** Show FPS graph */
  private _showGraph: boolean = true;
  /** Show FPS counter */
  private _showFps: boolean = true;
  /** Show memory usage */
  private _showMemory: boolean = true;
  /** Show grid overlay */
  private _showGrid: boolean = false;
  /** Grid size */
  private _gridSize: GridSize = 16;
  /** Grid color */
  private _gridColor: string = '#333333';

  /** Engine reference for screen dimensions */
  private _engine: Engine | null = null;

  constructor(options: MonitorSystemOptions = {}) {
    this._showGraph = options.graph ?? true;
    this._showFps = options.showFps ?? true;
    this._showMemory = options.showMemory ?? true;
    this._showGrid = options.showGrid ?? false;
    this._gridSize = options.gridSize ?? 16;
    this._gridColor = options.gridColor ?? '#333333';
    this.x = options.x ?? 8;
    this.y = options.y ?? 8;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Accessors
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Whether to show FPS counter.
   *
   * @since 0.5.0
   */
  get showFps(): boolean {
    return this._showFps;
  }

  set showFps(value: boolean) {
    this._showFps = value;
  }

  /**
   * Whether to show FPS graph.
   *
   * @since 0.5.0
   */
  get showGraph(): boolean {
    return this._showGraph;
  }

  set showGraph(value: boolean) {
    this._showGraph = value;
  }

  /**
   * Whether to show memory usage.
   *
   * @since 0.5.0
   */
  get showMemory(): boolean {
    return this._showMemory;
  }

  set showMemory(value: boolean) {
    this._showMemory = value;
  }

  /**
   * Whether to show grid overlay.
   *
   * @since 0.5.0
   */
  get showGrid(): boolean {
    return this._showGrid;
  }

  set showGrid(value: boolean) {
    this._showGrid = value;
  }

  /**
   * Grid size in pixels (8, 16, 32, or 'none').
   * Setting a numeric value automatically enables the grid.
   *
   * @since 0.5.0
   */
  get gridSize(): GridSize {
    return this._gridSize;
  }

  set gridSize(value: GridSize) {
    this._gridSize = value;
    // If setting a numeric grid size, enable grid
    if (value !== 'none') {
      this._showGrid = true;
    }
  }

  /**
   * Grid overlay color.
   *
   * @defaultValue '#333333'
   * @since 0.5.0
   */
  get gridColor(): string {
    return this._gridColor;
  }

  set gridColor(value: string) {
    this._gridColor = value;
  }

  /**
   * Current FPS value (read-only).
   *
   * @since 0.5.0
   */
  get currentFps(): number {
    return this.fps;
  }

  /**
   * Current memory usage in MB (read-only).
   *
   * @since 0.5.0
   */
  get currentMemory(): number {
    return this.memory;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initializes the monitor system.
   *
   * @param engine - Engine instance
   *
   * @since 0.5.0
   */
  init(engine: Engine): void {
    this._engine = engine;
  }

  update(deltaTime: number): void {
    this.frameCount++;
    this.timer += deltaTime;

    if (this.timer >= 1.0) {
      this.fps = this.frameCount / this.timer;
      this.frameCount = 0;
      this.timer = 0;

      this.frames.push(this.fps);
      if (this.frames.length > 60) {
        this.frames.shift();
      }
    }

    if (performance.memory) {
      this.memory = performance.memory.usedJSHeapSize / 1048576;
    }
  }

  render(ctx: RenderContext): void {
    // Draw grid first (behind everything)
    if (this._showGrid && this._gridSize !== 'none') {
      this.renderGrid(ctx);
    }

    // Draw FPS/memory overlay
    if (this._showFps || this._showMemory || this._showGraph) {
      this.renderOverlay(ctx);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Renders the grid overlay.
   *
   * @param ctx - Render context
   *
   * @internal
   */
  private renderGrid(ctx: RenderContext): void {
    if (this._gridSize === 'none') return;

    const width = this._engine?.dementions.width ?? 320;
    const height = this._engine?.dementions.height ?? 240;
    const size = this._gridSize;
    const color = this._gridColor;

    // Draw dotted vertical lines
    for (let x = 0; x < width; x += size) {
      for (let y = 0; y < height; y += 2) {
        ctx.fillRect(x, y, 1, 1, color);
      }
    }

    // Draw dotted horizontal lines
    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += 2) {
        ctx.fillRect(x, y, 1, 1, color);
      }
    }
  }

  /**
   * Renders the FPS/memory overlay.
   *
   * @param ctx - Render context
   *
   * @internal
   */
  private renderOverlay(ctx: RenderContext): void {
    ctx.save();

    const raw = ctx.getCanvas?.();
    if (raw) raw.fillStyle = '#ffffff';

    let yOffset = this.y;

    if (this._showFps) {
      font.renderText(`FPS: ${this.fps.toFixed(1)}`, this.x, yOffset, ctx);
      yOffset += font.height + 3;
    }

    if (this._showMemory && this.memory) {
      font.renderText(
        `MEM: ${this.memory.toFixed(1)} MB`,
        this.x,
        yOffset,
        ctx,
      );
      yOffset += font.height + 3;
    }

    if (this._showGraph) {
      const canvasCtx = ctx.getCanvas?.();
      if (canvasCtx && this.frames.length >= 1) {
        canvasCtx.strokeStyle = '#fff';
        canvasCtx.beginPath();
        for (let i = 0; i < this.frames.length; i++) {
          const x = this.x + i;
          const y = yOffset + 60 - (this.frames[i] ?? 0);
          canvasCtx.lineTo(x, y);
        }
        canvasCtx.stroke();
      }
    }

    ctx.restore();
  }
}
