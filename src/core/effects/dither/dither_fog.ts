import type { RenderContext } from '../../renderer/type';
import { DitherLight, type DitherLightOptions, type DitherPatternName } from './dither_light';
import { DitherPatterns } from './dither_patterns';

export interface DitherFogOptions {
  /**
   * Width of the fog's coordinate space, in world pixels. Lights must be
   * positioned in this same space.
   */
  width?: number;
  /** Height of the fog's coordinate space, in world pixels. */
  height?: number;
  /**
   * Size (world px) of one dither cell; smaller = crisper but costlier. The
   * fog only computes cells near lights, so moderate values stay cheap.
   * @defaultValue 4
   */
  cellSize?: number;
  /** The fog's solid colour (any CSS colour, alpha supported). */
  color?: string;
  /**
   * Base fog coverage with no lights nearby (`1` = fully opaque fog of war,
   * `0` = no fog at all). Lights can only reduce coverage below this.
   * @defaultValue 1
   */
  ambientCoverage?: number;
  /**
   * How smoothly multiple light circles blend into one another, in "pixel"
   * units (`0` = hard min, higher = softer). Divided by 100 internally, so
   * `50` ≈ a 0.5px soft zone.
   * @defaultValue 24
   */
  blendSharpness?: number;
  /**
   * Pattern used wherever no light is the closest influence.
   * @defaultValue 'bayer4'
   */
  defaultPattern?: DitherPatternName | number[][];
  /** Master on/off switch for the whole fog layer. */
  enabled?: boolean;
  /** Lights created with the fog. */
  lights?: Array<DitherLightOptions | DitherLight>;
}

/** Per-light, per-frame render plan: clamped cell box, threshold grid and LUT. */
interface LightPlan {
  light: DitherLight;
  /** Threshold grid (cell-indexed), shared per distinct pattern. */
  grid: Float32Array;
  /** The pattern value `grid` was built from (rebuilt when it changes). */
  gridSource: string | number[][] | null;
  /** Distance (px) → remaining coverage, sampled per whole pixel. */
  lut: Float32Array;
  /** Effective (flicker-scaled) outer radius this frame. */
  outer: number;
  /** Clamped cell-space bounding box of the light's reach. */
  minCol: number;
  maxCol: number;
  minRow: number;
  maxRow: number;
  /** Scratch: column interval the circle reaches on the current row. */
  rowMinCol: number;
  rowMaxCol: number;
  /** Scratch: squared vertical distance from the light to the current row. */
  dy2: number;
}

/** Axis-aligned cell-space box (inclusive bounds). */
interface CellBox {
  minCol: number;
  minRow: number;
  maxCol: number;
  maxRow: number;
}

/** A `CellBox` covering nothing (the empty painted region). */
const EMPTY_BOX: CellBox = { minCol: 0, minRow: 0, maxCol: -1, maxRow: -1 };

const CLEAR_EPSILON = 0.004;
const SOLID_EPSILON = 0.996;

/**
 * An ordered-dither fog of war.
 *
 * The fog is a grid of `cellSize` cells; each cell is either solid fog colour
 * or punched out, decided by comparing the cell's remaining coverage against
 * an ordered-dither threshold (a Bayer/dots/noise matrix). Lights carve
 * soft, dithered holes into the fog and can follow map objects
 * (`followTarget`), carry a colour glow, and flicker like fire.
 *
 * ### Coordinate space
 *
 * `width`/`height` define the fog's **own** space — typically the game's
 * world space (e.g. 320×256), with lights tracking objects at world
 * coordinates. {@link render} draws under whatever transform is current, so
 * call it inside the game's world-scale block and one dither cell becomes
 * `cellSize × displayScale` screen pixels.
 *
 * ### Performance model
 *
 * The whole fog is rasterised into a tiny offscreen canvas (one pixel per
 * dither cell) and blitted with a single `drawImage`. Per frame only cells
 * inside a light's circle are evaluated: a per-light distance LUT
 * replaces per-cell `pow`/`hypot`, overlapping lights blend with a
 * closed-form soft minimum, and lights beyond their reach contribute
 * nothing. Only the region lights touched since the last frame is reset,
 * re-rasterised and re-uploaded (dirty-rect `putImageData`); a static fog
 * uploads nothing. Threshold grids are tiled once per distinct pattern
 * and shared between every light (and the ambient) using it. Glow
 * gradients are pre-rendered once per (colour, size bucket) and blitted —
 * no per-frame gradient creation or per-pixel gradient rasterisation.
 * Cost scales with total light area, not screen area. Non-canvas
 * renderers fall back to batched `fillRect` runs (correct but slower).
 * See this module's `README.md` for a full walkthrough of the algorithm
 * and the trade-offs behind it.
 *
 * @category Effects
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const fog = new DitherFog(renderer, {
 *   width: 320, height: 256, cellSize: 2,
 *   color: '#08040f', ambientCoverage: 1,
 * });
 * // A light following the player, dead centre of its 16px sprite:
 * fog.addLight({ followTarget: player, offsetX: 8, offsetY: 8, ditherRadius: 96 });
 * // Per frame: world drawn → fog.render() inside the world-scale block → HUD on top.
 * ```
 */
export class DitherFog {
  /** Width of the fog space (world px). */
  readonly width: number;
  /** Height of the fog space (world px). */
  readonly height: number;
  /** Size (world px) of one dither cell (fixed at construction). */
  readonly cellSize: number;
  /** The fog's solid CSS colour. */
  color: string;
  /** Base coverage with no lights nearby (`0..1`). */
  ambientCoverage: number;
  /** Light-blend softness in px units (divided by 100 when used). */
  blendSharpness: number;
  /** Pattern used wherever no light is the closest influence. */
  readonly defaultPattern: DitherPatternName | number[][];
  /** Master on/off switch — `render` is a no-op while `false`. */
  enabled: boolean;

  private readonly ctx: RenderContext;
  /** Raw canvas context, acquired once (fast path); `null` → fallback. */
  private raw: CanvasRenderingContext2D | null = null;
  private rawResolved = false;
  /** Cell-space grid: `cols × rows`, one cell per pixel. */
  private cols = 0;
  private rows = 0;
  /** Offscreen canvas the fog is rasterised into (1 px per cell). */
  private cellCanvas: HTMLCanvasElement | null = null;
  private cellCtx: CanvasRenderingContext2D | null = null;
  private imageData: ImageData | null = null;
  /** Frame buffer view over {@link imageData} (packed RGBA pixels). */
  private buf32: Uint32Array = new Uint32Array(0);
  /** Cell states with no lights (the per-frame reset source). */
  private template: Uint32Array = new Uint32Array(0);
  /** `true` when the template is entirely transparent (nothing to blit). */
  private templateEmpty = true;
  /** The fog colour packed as one native-endian RGBA pixel. */
  private fogU32 = 0;
  /** Ambient thresholds per cell (default pattern), tiled. */
  private ambientGrid: Float32Array = new Float32Array(0);
  /** Tiled grids per distinct pattern, shared between lights and the ambient. */
  private readonly gridByPattern = new Map<string | number[][], Float32Array>();
  /** Colour/ambient the current template was built from (staleness check). */
  private templateColor = '';
  private templateAmbient = Number.NaN;
  /** `true` from a template rebuild until the buffer is fully re-uploaded. */
  private templateDirty = false;
  /** The previous frame's painted region (this frame's reset source). */
  private readonly prevBox: CellBox = { ...EMPTY_BOX };
  /** The current frame's painted region (recorded by `paintPlans`). */
  private readonly curBox: CellBox = { ...EMPTY_BOX };
  /** Pooled render plan per light. */
  private readonly planByLight = new Map<DitherLight, LightPlan>();
  /** Active plans for the current frame (reused array). */
  private readonly active: LightPlan[] = [];
  /** Scratch: column span of the plans covering the current row. */
  private spanMinCol = 0;
  private spanMaxCol = -1;
  /** Pre-rendered additive glow sprites, keyed by colour + size bucket. */
  private readonly glowCache = new Map<string, HTMLCanvasElement>();
  /** Safety cap on cached glow sprites (FIFO-evicts the oldest). */
  private static readonly MAX_GLOW_SPRITES = 64;
  private readonly lightsInternal: DitherLight[] = [];

  /** Parsed CSS colour cache, shared by every fog instance. */
  private static readonly colorCache = new Map<string, number>();
  /** Runtime byte order, for packing colours into pixel words. */
  private static readonly littleEndian = ((): boolean => {
    const bytes = new Uint8Array(new Uint32Array([0x04030201]).buffer);
    return bytes[0] === 0x01;
  })();

  constructor(ctx: RenderContext, opts: DitherFogOptions = {}) {
    this.ctx = ctx;
    this.width = opts.width ?? 100;
    this.height = opts.height ?? 100;
    this.cellSize = opts.cellSize ?? 4;
    this.color = opts.color ?? '#08040f';
    this.ambientCoverage = opts.ambientCoverage ?? 1;
    this.blendSharpness = opts.blendSharpness ?? 24;
    this.defaultPattern = opts.defaultPattern ?? 'bayer4';
    this.enabled = opts.enabled ?? true;
    for (const light of opts.lights ?? []) {
      this.addLight(light);
    }
    this.cols = Math.max(1, Math.ceil(this.width / this.cellSize));
    this.rows = Math.max(1, Math.ceil(this.height / this.cellSize));
    this.ambientGrid = this.gridFor(this.defaultPattern);
  }

  /** All lights, in add order. */
  get lights(): readonly DitherLight[] {
    return this.lightsInternal;
  }

  /**
   * Adds a light from options (or adopts an existing `DitherLight`) and
   * returns it for live configuration.
   */
  addLight(opts: DitherLightOptions | DitherLight): DitherLight {
    const light = opts instanceof DitherLight ? opts : new DitherLight(opts);
    this.lightsInternal.push(light);
    return light;
  }

  /** Removes a light previously added with {@link addLight}. */
  removeLight(light: DitherLight): void {
    const index = this.lightsInternal.indexOf(light);
    if (index !== -1) {
      this.lightsInternal.splice(index, 1);
    }
    this.planByLight.delete(light);
  }

  /** Removes every light. */
  clearLights(): void {
    this.lightsInternal.length = 0;
    this.planByLight.clear();
  }

  /**
   * Quadratic smooth-min: blends two coverage values with a soft zone of
   * width `k` (0 = plain `Math.min`). Used to merge overlapping lights.
   */
  static smoothMin(a: number, b: number, k: number): number {
    if (k <= 0) {
      return Math.min(a, b);
    }
    const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - a)) / k));
    return b * (1 - h) + a * h - k * h * (1 - h);
  }

  /**
   * Advances every light: follows targets and advances flicker. Call once
   * per frame from the game's update (flicker then pauses with the world,
   * matching map object effects).
   */
  update(deltaTime: number): void {
    for (const light of this.lightsInternal) {
      light.updatePosition();
      light.update(deltaTime);
    }
  }

  /**
   * Composites the fog (glow, then dithered cells) over the scene. Call once
   * per frame **after** drawing the world, under the world transform. A
   * cheap no-op while {@link enabled} is `false`.
   */
  render(): void {
    if (!this.enabled) {
      return;
    }
    for (const light of this.lightsInternal) {
      light.updatePosition();
    }
    const raw = this.acquireRaw();
    if (raw && this.ensureSurface()) {
      this.renderGlow(raw);
      this.renderCells(raw);
    } else {
      this.renderFallback();
    }
  }

  // ── Fast path (canvas renderer) ─────────────────────────────────────────

  /** Caches the raw 2-D context from the renderer, if there is one. */
  private acquireRaw(): CanvasRenderingContext2D | null {
    if (!this.rawResolved) {
      this.raw = this.ctx.getCanvas?.() ?? null;
      this.rawResolved = true;
    }
    return this.raw;
  }

  /** Creates a plain 2-D canvas of `w × h` px, or `null` when headless. */
  private makeSurface(
    w: number,
    h: number,
  ): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
    if (typeof document === 'undefined') {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    return ctx ? { canvas, ctx } : null;
  }

  /** Creates the offscreen cell surface; `false` = unusable. */
  private ensureSurface(): boolean {
    if (this.cellCtx) {
      return true;
    }
    const cell = this.makeSurface(this.cols, this.rows);
    if (!cell) {
      return false;
    }
    this.cellCanvas = cell.canvas;
    this.cellCtx = cell.ctx;
    this.imageData = cell.ctx.createImageData(this.cols, this.rows);
    this.buf32 = new Uint32Array(this.imageData.data.buffer);
    return true;
  }

  /**
   * Rebuilds the template (and the packed colour) when the live
   * {@link color}/{@link ambientCoverage} changed since it was last built —
   * the fast path otherwise resets each frame from a stale snapshot. Flags
   * {@link templateDirty} so the next rasterisation resets and re-uploads
   * everything.
   */
  private refreshTemplate(): void {
    if (this.templateColor === this.color && this.templateAmbient === this.ambientCoverage) {
      return;
    }
    this.templateColor = this.color;
    this.templateAmbient = this.ambientCoverage;
    this.fogU32 = this.parseColor(this.color);
    this.buildTemplate();
    this.templateDirty = true;
  }

  /** Parses a CSS colour into one packed RGBA pixel word. */
  private parseColor(color: string): number {
    const cached = DitherFog.colorCache.get(color);
    if (cached !== undefined) {
      return cached;
    }
    const probe = document.createElement('canvas');
    probe.width = 1;
    probe.height = 1;
    const probeCtx = probe.getContext('2d', { willReadFrequently: true });
    if (!probeCtx) {
      return 0xff000000;
    }
    probeCtx.fillStyle = color;
    probeCtx.fillRect(0, 0, 1, 1);
    const data = probeCtx.getImageData(0, 0, 1, 1).data;
    const [r = 0, g = 0, b = 0, a = 255] = data;
    const word = DitherFog.littleEndian
      ? (r | (g << 8) | (b << 16) | (a << 24)) >>> 0
      : ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
    DitherFog.colorCache.set(color, word);
    return word;
  }

  /**
   * Draws each light's additive colour glow beneath the dither cells. The
   * radial gradient is pre-rendered **once** per (colour, size bucket) and
   * blitted per frame — no per-frame gradient creation or per-pixel
   * gradient rasterisation, and lights fully outside the fog area are
   * culled.
   */
  private renderGlow(raw: CanvasRenderingContext2D): void {
    if (!this.lightsInternal.some((l) => l.enabled && l.color)) {
      return;
    }
    raw.save();
    raw.globalCompositeOperation = 'lighter';
    // Sprites are smooth gradients — let the blit interpolate softly.
    raw.imageSmoothingEnabled = true;
    for (const light of this.lightsInternal) {
      this.stampGlow(raw, light);
    }
    raw.restore();
  }

  /** Blits one light's cached glow sprite (culled to the fog area). */
  private stampGlow(raw: CanvasRenderingContext2D, light: DitherLight): void {
    if (!light.enabled || !light.color) {
      return;
    }
    const r = light.effDitherRadius;
    if (r <= 0) {
      return;
    }
    if (
      light.x - r >= this.width ||
      light.x + r <= 0 ||
      light.y - r >= this.height ||
      light.y + r <= 0
    ) {
      return;
    }
    const sprite = this.glowSprite(light, r);
    if (!sprite) {
      return;
    }
    raw.globalAlpha = light.glowAlpha;
    raw.drawImage(sprite, light.x - r, light.y - r, r * 2, r * 2);
  }

  /** Cached radial-gradient glow sprite for a light at ~radius `r`. */
  private glowSprite(light: DitherLight, r: number): HTMLCanvasElement | null {
    const color = light.color ?? '';
    // Bucket the radius so flicker never churns the sprite cache.
    const bucket = Math.max(16, Math.ceil(r / 16) * 16);
    const key = `${color}|${bucket}`;
    const cached = this.glowCache.get(key);
    if (cached) {
      return cached;
    }
    const surface = this.makeSurface(bucket * 2, bucket * 2);
    if (!surface) {
      return null;
    }
    const glow = surface.ctx.createRadialGradient(bucket, bucket, 0, bucket, bucket, bucket);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    surface.ctx.fillStyle = glow;
    surface.ctx.fillRect(0, 0, bucket * 2, bucket * 2);
    this.storeGlowSprite(key, surface.canvas);
    return surface.canvas;
  }

  /**
   * Stores a glow sprite, FIFO-evicting the oldest past
   * {@link MAX_GLOW_SPRITES} — a safety valve against pathological cache
   * growth (e.g. dynamically coloured lights); evicted live sprites simply
   * rebuild.
   */
  private storeGlowSprite(key: string, canvas: HTMLCanvasElement): void {
    if (!this.glowCache.has(key) && this.glowCache.size >= DitherFog.MAX_GLOW_SPRITES) {
      const oldest = this.glowCache.keys().next().value;
      if (oldest !== undefined) {
        this.glowCache.delete(oldest);
      }
    }
    this.glowCache.set(key, canvas);
  }

  /**
   * Rasterises the cells lights reach, then blits the surface with a single
   * `drawImage`. Only the region touched since the last frame is reset,
   * re-rasterised and re-uploaded (dirty-rect `putImageData`); a static fog
   * uploads nothing.
   */
  private renderCells(raw: CanvasRenderingContext2D): void {
    this.refreshTemplate();
    const plans = this.collectPlans();
    const hadPrev = this.prevBox.maxCol >= this.prevBox.minCol;
    if (this.templateEmpty && plans.length === 0 && !hadPrev && !this.templateDirty) {
      return; // nothing to erase, paint or blit
    }
    if (this.templateDirty) {
      this.buf32.set(this.template); // template changed: reset everything
    } else if (hadPrev) {
      this.resetBox(this.prevBox); // erase what the previous frame painted
    }
    if (plans.length > 0) {
      this.paintPlans(plans); // records the painted region in curBox
    } else {
      Object.assign(this.curBox, EMPTY_BOX);
    }
    this.uploadCells(hadPrev);
    Object.assign(this.prevBox, this.curBox);
    raw.save();
    raw.imageSmoothingEnabled = false;
    raw.drawImage(this.cellCanvas!, 0, 0, this.width, this.height);
    raw.restore();
  }

  /** Resets a box of cells to the template (e.g. the previous frame's paint). */
  private resetBox(box: CellBox): void {
    for (let row = box.minRow; row <= box.maxRow; row++) {
      const start = row * this.cols + box.minCol;
      this.buf32.set(this.template.subarray(start, start + (box.maxCol - box.minCol) + 1), start);
    }
  }

  /**
   * Uploads the changed region of the frame buffer — the union of the
   * previous and current paint, or everything on a template change.
   */
  private uploadCells(hadPrev: boolean): void {
    const cellCtx = this.cellCtx;
    const imageData = this.imageData;
    if (!cellCtx || !imageData) {
      return;
    }
    if (this.templateDirty) {
      this.templateDirty = false;
      cellCtx.putImageData(imageData, 0, 0);
      return;
    }
    const hasCur = this.curBox.maxCol >= this.curBox.minCol;
    if (!hadPrev && !hasCur) {
      return; // nothing changed since the last upload
    }
    const prev = this.prevBox;
    const cur = this.curBox;
    let { minCol: x, minRow: y, maxCol: right, maxRow: bottom } = hasCur ? cur : prev;
    if (hadPrev && hasCur) {
      x = Math.min(x, prev.minCol);
      y = Math.min(y, prev.minRow);
      right = Math.max(right, prev.maxCol);
      bottom = Math.max(bottom, prev.maxRow);
    }
    cellCtx.putImageData(imageData, 0, 0, x, y, right - x + 1, bottom - y + 1);
  }

  /**
   * Snapshots this frame's renderable lights into pooled plans: skips
   * disabled/zero-strength/off-grid lights, clamps each reach to its cell
   * box, and refreshes its distance LUT (flicker moves the radii).
   */
  private collectPlans(): LightPlan[] {
    this.active.length = 0;
    for (const light of this.lightsInternal) {
      if (!light.enabled || light.strength <= 0) {
        continue;
      }
      const r = light.effDitherRadius;
      if (r <= 0) {
        continue;
      }
      const plan = this.planFor(light);
      plan.minCol = Math.max(0, Math.floor((light.x - r) / this.cellSize));
      plan.maxCol = Math.min(this.cols - 1, Math.ceil((light.x + r) / this.cellSize));
      plan.minRow = Math.max(0, Math.floor((light.y - r) / this.cellSize));
      plan.maxRow = Math.min(this.rows - 1, Math.ceil((light.y + r) / this.cellSize));
      if (plan.maxCol < plan.minCol || plan.maxRow < plan.minRow) {
        continue;
      }
      this.buildLut(plan, light);
      this.ensurePlanGrid(plan, light);
      this.active.push(plan);
    }
    return this.active;
  }

  /** The pooled plan for `light`, created on first use. */
  private planFor(light: DitherLight): LightPlan {
    let plan = this.planByLight.get(light);
    if (!plan) {
      plan = {
        light,
        grid: this.ambientGrid,
        gridSource: null,
        lut: new Float32Array(0),
        outer: 0,
        minCol: 0,
        maxCol: 0,
        minRow: 0,
        maxRow: 0,
        rowMinCol: 0,
        rowMaxCol: 0,
        dy2: 0,
      };
      this.planByLight.set(light, plan);
    }
    return plan;
  }

  /** Rebuilds `plan.lut[i] = coverage at distance i`, for this frame's radii. */
  private buildLut(plan: LightPlan, light: DitherLight): void {
    plan.outer = light.effDitherRadius;
    const len = Math.max(2, Math.ceil(plan.outer) + 2);
    if (plan.lut.length < len) {
      plan.lut = new Float32Array(len);
    }
    for (let i = 0; i < len; i++) {
      plan.lut[i] = light.coverageAtDistance(i);
    }
  }

  /** Refreshes the plan's threshold grid when the light's pattern changed. */
  private ensurePlanGrid(plan: LightPlan, light: DitherLight): void {
    if (plan.gridSource !== light.pattern) {
      plan.grid = this.gridFor(light.pattern);
      plan.gridSource = light.pattern;
    }
  }

  /**
   * Paints every cell inside the plans' circles: rows in the box union, per
   * row the union of the circles' column intervals. Records the painted
   * region (the boxes, a safe superset) in `curBox` for the next frame's
   * reset and upload.
   */
  private paintPlans(plans: LightPlan[]): void {
    let minRow = plans[0]!.minRow;
    let maxRow = plans[0]!.maxRow;
    let minCol = plans[0]!.minCol;
    let maxCol = plans[0]!.maxCol;
    for (const plan of plans) {
      minRow = Math.min(minRow, plan.minRow);
      maxRow = Math.max(maxRow, plan.maxRow);
      minCol = Math.min(minCol, plan.minCol);
      maxCol = Math.max(maxCol, plan.maxCol);
    }
    const cur = this.curBox;
    cur.minCol = minCol;
    cur.minRow = minRow;
    cur.maxCol = maxCol;
    cur.maxRow = maxRow;
    const k = this.blendSharpness / 100;
    const rowPlans: LightPlan[] = [];
    for (let gy = minRow; gy <= maxRow; gy++) {
      this.collectRowPlans(plans, gy, rowPlans);
      for (let gx = this.spanMinCol; gx <= this.spanMaxCol; gx++) {
        this.paintCell(gx, gy, rowPlans, k);
      }
    }
  }

  /**
   * Gathers the plans whose circle reaches row `gy`, recording each one's
   * column interval for the row (into `rowMinCol`/`rowMaxCol`) and their
   * union into {@link spanMinCol}/{@link spanMaxCol}.
   */
  private collectRowPlans(plans: LightPlan[], gy: number, out: LightPlan[]): void {
    out.length = 0;
    this.spanMinCol = this.cols;
    this.spanMaxCol = -1;
    const py = gy * this.cellSize + this.cellSize / 2;
    for (const plan of plans) {
      if (gy < plan.minRow || gy > plan.maxRow) {
        continue;
      }
      const dy = py - plan.light.y;
      const reach = plan.outer * plan.outer - dy * dy;
      if (reach <= 0) {
        continue; // the circle misses this row entirely
      }
      const s = Math.sqrt(reach);
      plan.rowMinCol = Math.max(
        0,
        Math.ceil((plan.light.x - s - this.cellSize / 2) / this.cellSize),
      );
      plan.rowMaxCol = Math.min(
        this.cols - 1,
        Math.floor((plan.light.x + s - this.cellSize / 2) / this.cellSize),
      );
      if (plan.rowMinCol > plan.rowMaxCol) {
        continue; // reaches the row, but only between cell centres
      }
      plan.dy2 = dy * dy;
      out.push(plan);
      this.spanMinCol = Math.min(this.spanMinCol, plan.rowMinCol);
      this.spanMaxCol = Math.max(this.spanMaxCol, plan.rowMaxCol);
    }
  }

  /**
   * Blends every covering light at one cell and writes its buffer pixel.
   * Lights whose circle doesn't reach the cell contribute nothing — no
   * blend, no dominant claim.
   */
  private paintCell(gx: number, gy: number, rowPlans: LightPlan[], k: number): void {
    const px = gx * this.cellSize + this.cellSize / 2;
    let coverage = this.ambientCoverage;
    let dominant: LightPlan | null = null;
    let dominantValue = coverage;
    for (const plan of rowPlans) {
      if (gx < plan.rowMinCol || gx > plan.rowMaxCol) {
        continue; // the circle doesn't reach this cell
      }
      const c = this.planCoverageAt(plan, px);
      if (c >= 1) {
        continue; // out of reach (or no strength): no contribution
      }
      if (c < dominantValue) {
        dominantValue = c;
        dominant = plan;
      }
      coverage = DitherFog.smoothMin(coverage, c, k);
    }
    this.writeCell(gx, gy, coverage, dominant);
  }

  /** LUT-sampled coverage of one plan at `px` (on the plan's current row). */
  private planCoverageAt(plan: LightPlan, px: number): number {
    const dx = px - plan.light.x;
    const d = Math.sqrt(dx * dx + plan.dy2);
    return d >= plan.outer ? 1 : (plan.lut[d | 0] ?? 1);
  }

  /** Writes one cell's buffer pixel from its blended coverage. */
  private writeCell(gx: number, gy: number, coverage: number, dominant: LightPlan | null): void {
    const index = gy * this.cols + gx;
    if (coverage <= CLEAR_EPSILON) {
      this.buf32[index] = 0;
      return;
    }
    if (coverage >= SOLID_EPSILON) {
      this.buf32[index] = this.fogU32;
      return;
    }
    const grid = dominant ? dominant.grid : this.ambientGrid;
    this.buf32[index] = coverage > (grid[index] ?? 0) ? this.fogU32 : 0;
  }

  // ── Fallback path (non-canvas renderers) ─────────────────────────────────

  /**
   * Correct-but-slow path: full-grid evaluation with exact per-cell
   * coverage, batched into horizontal `fillRect` runs of consecutive filled
   * cells. Glow is skipped (it needs canvas compositing).
   */
  private renderFallback(): void {
    const k = this.blendSharpness / 100;
    this.ctx.save();
    for (let gy = 0; gy < this.rows; gy++) {
      this.paintFallbackRow(gy, k);
    }
    this.ctx.restore();
  }

  /** Emits one row's fallback runs (consecutive filled cells → one rect). */
  private paintFallbackRow(gy: number, k: number): void {
    let runStart = -1;
    for (let gx = 0; gx < this.cols; gx++) {
      if (this.cellFilled(gx, gy, k)) {
        if (runStart < 0) {
          runStart = gx;
        }
      } else if (runStart !== -1) {
        this.fillFallbackRun(gy, runStart, gx);
        runStart = -1;
      }
    }
    if (runStart !== -1) {
      this.fillFallbackRun(gy, runStart, this.cols);
    }
  }

  /** One batched `fillRect` covering `[fromCol, toColExclusive)` in a row. */
  private fillFallbackRun(gy: number, fromCol: number, toColExclusive: number): void {
    const { cellSize } = this;
    this.ctx.fillRect(
      fromCol * cellSize,
      gy * cellSize,
      (toColExclusive - fromCol) * cellSize,
      cellSize,
      this.color,
    );
  }

  /** Exact coverage test for one fallback cell. */
  private cellFilled(gx: number, gy: number, k: number): boolean {
    const px = gx * this.cellSize + this.cellSize / 2;
    const py = gy * this.cellSize + this.cellSize / 2;
    const { coverage, dominant } = this.cellCoverage(px, py, k);
    if (coverage <= CLEAR_EPSILON) {
      return false;
    }
    if (coverage >= SOLID_EPSILON) {
      return true;
    }
    const index = gy * this.cols + gx;
    const threshold = dominant
      ? (this.gridFor(dominant.pattern)[index] ?? 0)
      : (this.ambientGrid[index] ?? 0);
    return coverage > threshold;
  }

  /**
   * Blends every light that reaches the point (exact `coverageAt`); lights
   * beyond their `ditherRadius` contribute nothing — the same rule as the
   * fast path's circle intervals.
   */
  private cellCoverage(
    px: number,
    py: number,
    k: number,
  ): { coverage: number; dominant: DitherLight | null } {
    let coverage = this.ambientCoverage;
    let dominant: DitherLight | null = null;
    let dominantValue = coverage;
    for (const light of this.lightsInternal) {
      const c = light.coverageAt(px, py);
      if (c >= 1) {
        continue; // out of reach (or disabled): no contribution
      }
      if (c < dominantValue) {
        dominantValue = c;
        dominant = light;
      }
      coverage = DitherFog.smoothMin(coverage, c, k);
    }
    return { coverage, dominant };
  }

  // ── Grid construction ────────────────────────────────────────────────────

  /**
   * Tiles one pattern's thresholds across the whole cell grid — cached per
   * distinct pattern, so every light (and the ambient) sharing a pattern
   * shares one grid.
   */
  private gridFor(pattern: string | number[][]): Float32Array {
    const cached = this.gridByPattern.get(pattern);
    if (cached) {
      return cached;
    }
    const { matrix, size } = DitherPatterns.get(pattern);
    const grid = new Float32Array(this.cols * this.rows);
    for (let gy = 0; gy < this.rows; gy++) {
      for (let gx = 0; gx < this.cols; gx++) {
        grid[gy * this.cols + gx] = matrix[gy % size]?.[gx % size] ?? 0;
      }
    }
    this.gridByPattern.set(pattern, grid);
    return grid;
  }

  /** Precomputes the no-light cell states used to reset the frame buffer. */
  private buildTemplate(): void {
    this.template = new Uint32Array(this.cols * this.rows);
    let any = false;
    for (let i = 0; i < this.template.length; i++) {
      const filled =
        this.ambientCoverage >= SOLID_EPSILON ||
        (this.ambientCoverage > CLEAR_EPSILON && this.ambientCoverage > (this.ambientGrid[i] ?? 0));
      if (filled) {
        this.template[i] = this.fogU32;
        any = true;
      }
    }
    this.templateEmpty = !any;
  }
}
