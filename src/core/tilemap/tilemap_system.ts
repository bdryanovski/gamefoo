/**
 * Subsystem that renders a {@link TileMap} each frame within the
 * engine's lifecycle.
 *
 * `TilemapSystem` runs at order `15` — after the camera transform
 * (order 10) but before entity rendering via {@link ObjectSystem}
 * (order 20). This ensures tiles are drawn behind entities.
 *
 * @category Tilemap
 * @since 0.4.0
 *
 * @example
 * ```ts
 * import { Engine, CameraSystem, ObjectSystem } from "gamefoo";
 * import { TilemapSystem } from "gamefoo";
 *
 * engine.use(new CameraSystem(800, 600, () => player.getPosition()));   // order 10
 * engine.use(new TilemapSystem(tilemap));                                // order 15
 * engine.use(new ObjectSystem([player]));                                // order 20
 *
 * engine.setup();
 * ```
 *
 * @see {@link TileMap}    — the tilemap being rendered
 * @see {@link SubSystem}  — the subsystem interface
 */

import type { CameraSystem } from "../../subsystems/camera_system";
import type { SubSystem } from "../../subsystems/types";
import type Engine from "../engine";
import type { TileMap } from "./tilemap";

export class TilemapSystem implements SubSystem {
  /** Subsystem identifier. */
  id = "tilemap";

  /**
   * Execution order. `15` places this after camera (10) and before
   * objects (20).
   */
  order = 15;

  /** The tilemap to render. */
  private tilemap: TileMap;

  /** Cached reference to the camera subsystem, resolved in `init`. */
  private cameraSystem: CameraSystem | null = null;

  /** Canvas dimensions fallback when no camera is available. */
  private canvasWidth = 0;
  private canvasHeight = 0;

  /**
   * Creates a new tilemap subsystem.
   *
   * @param tilemap - The tilemap to render each frame.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const system = new TilemapSystem(myTileMap);
   * engine.use(system);
   * ```
   */
  constructor(tilemap: TileMap) {
    this.tilemap = tilemap;
  }

  /**
   * Called by the engine when this subsystem is attached.
   *
   * Stores canvas dimensions for viewport fallback and looks up the
   * {@link CameraSystem} if present.
   *
   * @param engine - The engine instance.
   *
   * @since 0.4.0
   */
  init(engine: Engine): void {
    const dims = engine.dementions;
    this.canvasWidth = dims.width;
    this.canvasHeight = dims.height;
  }

  /**
   * Attaches a camera system reference so the tilemap can use the
   * camera viewport for culling.
   *
   * Call this after both subsystems are registered, or let the
   * system fall back to full-canvas rendering.
   *
   * @param cameraSystem - The active camera subsystem.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const camSys = new CameraSystem(800, 600, () => player.getPosition());
   * const tmSys = new TilemapSystem(tilemap);
   * engine.use(camSys);
   * engine.use(tmSys);
   * tmSys.attachCamera(camSys);
   * ```
   */
  attachCamera(cameraSystem: CameraSystem): void {
    this.cameraSystem = cameraSystem;
  }

  /**
   * Renders the tilemap. Uses the camera viewport for culling when
   * available, otherwise renders the full canvas area.
   *
   * @param ctx - Canvas 2D rendering context.
   *
   * @since 0.4.0
   */
  render(ctx: CanvasRenderingContext2D): void {
    const viewport = this.cameraSystem
      ? this.cameraSystem.camera.getViewRect()
      : { x: 0, y: 0, width: this.canvasWidth, height: this.canvasHeight };

    this.tilemap.render(ctx, viewport);
  }
}
