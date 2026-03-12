/**
 * Behaviour that moves an entity along a computed A* path, cell by cell.
 *
 * `PathFollower` integrates the {@link Pathfinder} with the entity
 * behaviour system. Attach it to any {@link DynamicEntity} and call
 * {@link PathFollower.moveTo} to compute and follow a path.
 *
 * Movement is handled in world-space using either the
 * {@link IsometricProjection} (for isometric games) or the
 * {@link Grid} orthogonal conversion.
 *
 * @category Behaviours
 * @since 0.4.0
 *
 * @example Basic patrolling NPC
 * ```ts
 * import { DynamicEntity, Pathfinder, PathFollower } from "gamefoo";
 *
 * const npc = new Guard("guard", 100, 100, 16, 16);
 *
 * const follower = npc.attachBehaviour(
 *   new PathFollower(npc, pathfinder, grid, {
 *     speed: 60,
 *     onPathComplete: () => {
 *       // Patrol: pick a new random destination
 *       follower.moveTo(randomCol(), randomRow());
 *     },
 *   }),
 * );
 *
 * follower.moveTo(10, 5); // walk to grid cell (10, 5)
 * ```
 *
 * @example Isometric movement
 * ```ts
 * const follower = npc.attachBehaviour(
 *   new PathFollower(npc, pathfinder, grid, {
 *     projection: isoProjection,
 *     speed: 40,
 *   }),
 * );
 * ```
 *
 * @see {@link Pathfinder}          — computes the path
 * @see {@link Grid}                — the grid being navigated
 * @see {@link IsometricProjection} — coordinate conversion for iso
 * @see {@link Behaviour}           — base behaviour class
 */
import { Behaviour } from "../behaviour";
import type DynamicEntity from "../../entities/dynamic_entity";
import type { Grid } from "../grid/grid";
import type { IsometricProjection } from "../grid/isometric";
import type { Pathfinder } from "../utils/pathfinding";

/**
 * Configuration options for {@link PathFollower}.
 *
 * @category Behaviours
 * @since 0.4.0
 *
 * @example
 * ```ts
 * const opts: PathFollowerConfig = {
 *   projection: isoProjection,
 *   speed: 60,
 *   arrivalThreshold: 3,
 *   onPathComplete: () => console.log("Arrived!"),
 * };
 * ```
 */
export interface PathFollowerConfig {
  /**
   * Isometric projection for grid → screen conversion.
   * Omit for orthogonal grids.
   */
  projection?: IsometricProjection;

  /**
   * Movement speed in pixels per second.
   *
   * @defaultValue `60`
   */
  speed?: number;

  /**
   * Distance (in pixels) at which the entity is considered to have
   * reached a waypoint.
   *
   * @defaultValue `2`
   */
  arrivalThreshold?: number;

  /**
   * Called when the entity reaches the final waypoint.
   */
  onPathComplete?: () => void;

  /**
   * Called when `moveTo` fails to find a path.
   */
  onPathBlocked?: () => void;
}

export class PathFollower extends Behaviour<DynamicEntity> {
  /** @inheritdoc */
  readonly type = "pathfollower";

  private pathfinder: Pathfinder;
  private grid: Grid;
  private projection: IsometricProjection | null;
  private speed: number;
  private arrivalThreshold: number;
  private arrivalThresholdSq: number;
  private onPathComplete?: () => void;
  private onPathBlocked?: () => void;

  /** The current computed path (array of grid waypoints). */
  private path: { col: number; row: number }[] = [];

  /** Index of the current waypoint being approached. */
  private currentIndex = 0;

  /** Whether the entity is actively following a path. */
  private _isMoving = false;

  /**
   * Creates a new path follower behaviour.
   *
   * @param owner      - The entity this behaviour is attached to.
   * @param pathfinder - Pathfinder instance for A* computation.
   * @param grid       - The grid being navigated.
   * @param config     - Optional movement and callback configuration.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const pf = new PathFollower(npc, pathfinder, grid, {
   *   speed: 60,
   *   onPathComplete: () => console.log("Done!"),
   * });
   * npc.attachBehaviour(pf);
   * ```
   */
  constructor(
    owner: DynamicEntity,
    pathfinder: Pathfinder,
    grid: Grid,
    config?: PathFollowerConfig,
  ) {
    super(owner);
    this.pathfinder = pathfinder;
    this.grid = grid;
    this.projection = config?.projection ?? null;
    this.speed = config?.speed ?? 60;
    this.arrivalThreshold = config?.arrivalThreshold ?? 2;
    this.arrivalThresholdSq = this.arrivalThreshold * this.arrivalThreshold;
    this.onPathComplete = config?.onPathComplete;
    this.onPathBlocked = config?.onPathBlocked;
  }

  /**
   * Whether the entity is currently following a path.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * if (follower.isMoving) {
   *   console.log("NPC is walking...");
   * }
   * ```
   */
  get isMoving(): boolean {
    return this._isMoving;
  }

  /**
   * Returns a copy of the current path waypoints.
   *
   * Useful for debug visualisation.
   *
   * @returns Array of `{ col, row }` waypoints, or empty array.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * debugSystem.setDebugPath(follower.currentPath);
   * ```
   */
  get currentPath(): ReadonlyArray<{ col: number; row: number }> {
    return this.path;
  }

  /**
   * Computes a path to the target grid cell and begins following it.
   *
   * Returns `true` if a path was found, `false` otherwise. When the
   * path is blocked, `onPathBlocked` is called if configured.
   *
   * @param goalCol - Destination grid column.
   * @param goalRow - Destination grid row.
   * @returns `true` if a path was computed successfully.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const success = follower.moveTo(15, 10);
   * if (!success) {
   *   console.log("Cannot reach target!");
   * }
   * ```
   */
  moveTo(goalCol: number, goalRow: number): boolean {
    const ownerWorld = this.getOwnerGridPosition();

    const result = this.pathfinder.findPath(
      ownerWorld.col,
      ownerWorld.row,
      goalCol,
      goalRow,
    );

    if (!result) {
      this._isMoving = false;
      this.path = [];
      this.currentIndex = 0;
      this.onPathBlocked?.();
      return false;
    }

    this.path = result;
    this.currentIndex = 1;
    this._isMoving = true;
    return true;
  }

  /**
   * Cancels the current path and stops the entity.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * // Stop the NPC when the player approaches
   * follower.stop();
   * ```
   */
  stop(): void {
    this._isMoving = false;
    this.path = [];
    this.currentIndex = 0;
  }

  /**
   * Called every frame. Moves the entity toward the next waypoint.
   *
   * @param deltaTime - Seconds since the last frame.
   *
   * @since 0.4.0
   */
  update(deltaTime: number): void {
    if (!this._isMoving || this.path.length === 0 || this.currentIndex >= this.path.length) {
      return;
    }

    const target = this.path[this.currentIndex]!;
    const targetWorld = this.gridToWorld(target.col, target.row);

    const dx = targetWorld.x - this.owner.x;
    const dy = targetWorld.y - this.owner.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < this.arrivalThresholdSq) {
      this.currentIndex++;
      if (this.currentIndex >= this.path.length) {
        this._isMoving = false;
        this.onPathComplete?.();
      }
      return;
    }

    const dist = Math.sqrt(distSq);
    const moveX = (dx / dist) * this.speed * deltaTime;
    const moveY = (dy / dist) * this.speed * deltaTime;

    if (Math.abs(moveX) > Math.abs(dx)) {
      this.owner.x = targetWorld.x;
    } else {
      this.owner.x += moveX;
    }

    if (Math.abs(moveY) > Math.abs(dy)) {
      this.owner.y = targetWorld.y;
    } else {
      this.owner.y += moveY;
    }
  }

  /**
   * Gets the owner's current grid position based on their world
   * coordinates.
   *
   * @internal
   */
  private getOwnerGridPosition(): { col: number; row: number } {
    if (this.projection) {
      return this.projection.screenToGrid(this.owner.x, this.owner.y);
    }
    return this.grid.worldToCell(this.owner.x, this.owner.y);
  }

  /**
   * Converts grid coordinates to world-space position using the
   * configured projection or orthogonal fallback.
   *
   * @internal
   */
  private gridToWorld(col: number, row: number): { x: number; y: number } {
    if (this.projection) {
      return this.projection.gridToScreen(col, row);
    }
    return this.grid.cellToWorld(col, row);
  }

  /**
   * Provides access to the owner entity for external systems.
   *
   * @returns The entity this behaviour is attached to.
   *
   * @since 0.4.0
   *
   * @example
   * ```ts
   * const entity = follower.getOwner();
   * console.log(entity.id);
   * ```
   */
  getOwner(): DynamicEntity {
    return this.owner;
  }
}
