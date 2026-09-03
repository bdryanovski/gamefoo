import type { DeltaTime } from '@/generic_types';
import type { RenderContext } from '../renderer/type';
import AssetManager from './asset_manager';
import type MapObjectRegistry from './map_object_registry';
import Screen from './screen';
import {
  type ImageResolver,
  type MapData,
  type MapProject,
  type ScreenCoordinate,
  screenKey,
} from './types';

/**
 * Options for {@link MapManager.load} / {@link MapManager.fromUrl}.
 */
export interface MapLoadOptions {
  /**
   * Maps each `ImageDefinition` to the URL to fetch (see {@link AssetManager.load}).
   */
  resolve?: ImageResolver;
  /**
   * Custom-class registry used to instantiate machine placements.
   */
  registry?: MapObjectRegistry;
}

/**
 * The whole map: every screen, keyed by grid coordinate, plus a shared
 * {@link AssetManager} and a `current` pointer.
 *
 * A screen is the navigable unit (often called a "level"). Screens are
 * *built* once at load, but their live objects only exist while the screen
 * is current: navigating activates the target screen (spawning its
 * objects) and deactivates the previous one (disposing them). Navigation
 * itself never touches the network.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example Load with custom classes
 * ```ts
 * const registry = new MapObjectRegistry();
 * registry.register(Chest);
 *
 * const map = await MapManager.fromUrl("./map.json", {
 *   resolve: (img) => `./assets/${img.name}`,
 *   registry,
 * });
 * map.navigateTo(0, 0);
 *
 * // in the engine loop:
 * map.update(dt);
 * map.render(ctx);
 * ```
 *
 * @see {@link Screen}
 * @see {@link MapObjectRegistry}
 */
export default class MapManager {
  /**
   * Shared catalog of images/frames/clips/machines.
   */
  readonly assets = new AssetManager();

  /**
   * Every screen keyed by `"x,y"`.
   */
  private readonly screens = new Map<string, Screen>();
  private map?: MapData;
  private currentScreen?: Screen;

  /**
   * Fetches a project JSON document and builds the map from it.
   *
   * @param url     - URL of the exported `*.map.project.json` document.
   * @param options - Image resolver and/or object-class registry.
   */
  static async fromUrl(url: string, options: MapLoadOptions = {}): Promise<MapManager> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load map: ${url} (${response.status})`);
    }
    const project = (await response.json()) as MapProject;
    const manager = new MapManager();
    await manager.load(project, options);
    return manager;
  }

  /**
   * Loads assets and builds every screen from an already-parsed project,
   * then activates the current screen (`(0, 0)` or the first present).
   *
   * @param project - The parsed project document.
   * @param options - Image resolver and/or object-class registry.
   */
  async load(project: MapProject, options: MapLoadOptions = {}): Promise<void> {
    await this.assets.load(project, options.resolve);
    this.map = project.map;

    this.currentScreen?.deactivate();
    this.screens.clear();

    for (const data of Object.values(project.map.screens)) {
      const screen = new Screen(data, this.assets, project.map, options.registry);
      this.screens.set(screen.name, screen);
    }

    this.currentScreen = this.screens.get(screenKey(0, 0)) ?? this.screens.values().next().value;
    this.currentScreen?.activate();
  }

  /**
   * Points `current` at the screen at `(x, y)`, deactivating the previous
   * screen and activating the new one.
   *
   * @returns `true` if that screen exists, `false` otherwise (current
   *   stays put).
   */
  navigateTo(x: number, y: number): boolean {
    const next = this.screens.get(screenKey(x, y));
    if (!next) {
      return false;
    }
    if (next === this.currentScreen) {
      return true;
    }

    this.currentScreen?.deactivate();
    this.currentScreen = next;
    next.activate();
    return true;
  }

  /**
   * The active screen, or `undefined` before {@link MapManager.load}.
   */
  get current(): Screen | undefined {
    return this.currentScreen;
  }

  /**
   * The screen at `(x, y)`, if any.
   */
  screenAt(x: number, y: number): Screen | undefined {
    return this.screens.get(screenKey(x, y));
  }

  /**
   * Coordinates of every screen in the map.
   */
  get coordinates(): ScreenCoordinate[] {
    return [...this.screens.values()].map((s) => s.coordinate);
  }

  /**
   * Pixel size of a single screen.
   */
  get screenSize(): { width: number; height: number } {
    return {
      width: (this.map?.screenCols ?? 0) * (this.map?.blockSize ?? 0),
      height: (this.map?.screenRows ?? 0) * (this.map?.blockSize ?? 0),
    };
  }

  /**
   * Advances the current screen's live objects.
   */
  update(deltaTime: DeltaTime): void {
    this.currentScreen?.update(deltaTime);
  }

  /**
   * Renders the current screen.
   */
  render(ctx: RenderContext): void {
    this.currentScreen?.render(ctx);
  }
}
