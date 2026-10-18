import type { RenderContext } from '../core/renderer/type';
import type { MapProject } from '../core/map/types';
import type AssetManager from '../core/map/asset_manager';
import MapManager from '../core/map/map_manager';
import type { MapLoadOptions } from '../core/map/map_manager';
import type MapObject from '../core/map/map_object';
import type Screen from '../core/map/screen';
import type { ScreenOverlay } from '../core/map/screen';
import type { SubSystem } from './types';

/**
 * Configuration for {@link MapSystem}.
 *
 * @category SubSystems
 */
export interface MapSystemConfig {
  /**
   * Scale applied to the whole map pass (the world→screen upscale).
   *
   * @defaultValue `1`
   */
  scale?: number;
  /**
   * The overlay interleaved into the map render (the game's player), or
   * `undefined` when there is none yet.
   */
  overlay?: () => ScreenOverlay | undefined;
  /**
   * Gate for {@link MapSystem.update} — freeze the map while a modal is up.
   *
   * @defaultValue always active
   */
  isActive?: () => boolean;
  /**
   * Gate for {@link MapSystem.render} — hide the map behind a title card.
   *
   * @defaultValue always visible
   */
  isVisible?: () => boolean;
}

/**
 * Drives a {@link MapManager}: owns it, ticks + renders the current screen
 * (interleaving an optional overlay), and navigates between screens. It runs
 * at order `20` — after the camera transform (`10`) and tilemap (`15`), the
 * same slot the old `ObjectSystem` used, so map layers stay in the world pass.
 *
 * Subclass it to add game glue around the map: override
 * {@link onBeforeUpdate}/{@link onAfterUpdate} for per-frame work either side
 * of the map tick, and {@link renderOverMap} for passes drawn above the map
 * but still inside the scale sandwich (e.g. object pies, fog).
 *
 * @since 0.5.0
 * @category SubSystems
 *
 * @example
 * ```ts
 * const system = new MapSystem({
 *   scale: 3,
 *   overlay: () => (player ? { level: 3, render: (c) => player.render(c) } : undefined),
 *   isActive: () => flow.worldActive,
 * });
 * await system.load(project, { registry, screens, services: ctx });
 * engine.use(system);
 * ```
 */
export class MapSystem implements SubSystem {
  id = 'map';

  /** After camera (10) / tilemap (15); the world-object pass slot. */
  order = 20;

  /** The owned map, or `undefined` before {@link load}/{@link useMap}. */
  protected mapManager?: MapManager;

  /** Extension config; subclasses may replace it after `super()` to add glue. */
  protected config: MapSystemConfig;

  private cx = 0;
  private cy = 0;

  constructor(config: MapSystemConfig = {}) {
    this.config = config;
  }

  /**
   * Builds the map from an already-parsed project and adopts it. The map's
   * `(0, 0)` screen (or first present) becomes current.
   */
  async load(project: MapProject, options: MapLoadOptions = {}): Promise<void> {
    const manager = new MapManager();
    await manager.load(project, options);
    this.useMap(manager);
  }

  /** Adopts an already-built map and enters its current screen. */
  useMap(manager: MapManager): void {
    this.mapManager = manager;
    this.onScreenEntered(this.cx, this.cy, manager.current);
  }

  /** The shared asset catalog, or `undefined` before the map loads. */
  get assets(): AssetManager | undefined {
    return this.mapManager?.assets;
  }

  /** The owned {@link MapManager}, or `undefined` before the map loads. */
  get map(): MapManager | undefined {
    return this.mapManager;
  }

  /** The active screen, or `undefined` before the map loads. */
  current(): Screen | undefined {
    return this.mapManager?.current;
  }

  /** Objects on the active screen. */
  objects(): MapObject[] {
    return this.mapManager?.current?.objects ?? [];
  }

  /** The active screen coordinate as `"cx,cy"`. */
  screenKey(): string {
    return `${this.cx},${this.cy}`;
  }

  /** Whether a screen exists at the coordinate (a travel destination). */
  canNavigate(x: number, y: number): boolean {
    return !!this.mapManager?.screenAt(x, y);
  }

  /**
   * Points the map at `(x, y)`.
   *
   * @returns `true` if that screen exists, `false` otherwise.
   */
  navigate(x: number, y: number): boolean {
    if (!this.mapManager?.navigateTo(x, y)) {
      return false;
    }
    this.cx = x;
    this.cy = y;
    this.onScreenEntered(x, y, this.mapManager.current);
    return true;
  }

  update(deltaTime: number): void {
    if (this.config.isActive && !this.config.isActive()) {
      return;
    }
    this.onBeforeUpdate(deltaTime);
    this.mapManager?.update(deltaTime);
    this.onAfterUpdate(deltaTime, this.mapManager?.current);
  }

  render(ctx: RenderContext): void {
    // Pixel-crisp sprites at the world upscale (set even while hidden, as the
    // old map pass did on its first line).
    const raw = ctx.getCanvas?.();
    if (raw) {
      raw.imageSmoothingEnabled = false;
    }
    if (this.config.isVisible && !this.config.isVisible()) {
      return;
    }
    const scale = this.config.scale ?? 1;
    ctx.save();
    if (scale !== 1) {
      ctx.scale(scale, scale);
    }
    this.mapManager?.render(ctx, this.config.overlay?.());
    this.renderOverMap(ctx);
    ctx.restore();
  }

  /**
   * Game hook called after a screen becomes current (add occupants, record
   * telemetry). The base system does nothing.
   */
  protected onScreenEntered(_x: number, _y: number, _screen: Screen | undefined): void {}

  /** Game hook run immediately before the map tick (e.g. advance the fog). */
  protected onBeforeUpdate(_deltaTime: number): void {}

  /** Game hook run immediately after the map tick (e.g. move the player). */
  protected onAfterUpdate(_deltaTime: number, _screen: Screen | undefined): void {}

  /** Game hook drawn above the map but inside the scale sandwich. */
  protected renderOverMap(_ctx: RenderContext): void {}
}
