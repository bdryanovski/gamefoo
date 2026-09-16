import type { DeltaTime, Vector2 } from '../../../../../src/generic_types';
import { type CollisionMap, MapObject, type Rect } from '../../../../../src/index';

/** Footprint side, in px — every critter is a 16×16 mover. */
export const CRITTER_SIZE = 16;

/** Half-side fallback for a zone when its collider is missing. */
const DEFAULT_ZONE = 12;

type Facing = 'up' | 'down' | 'left' | 'right';

/**
 * Shared brain-stem for the map's roaming characters. It owns the parts every
 * critter needs regardless of temperament: per-frame perception of the player
 * ({@link CritterAI.sense}), collision-aware movement that slides on solids and
 * refuses to walk off walkable ground ({@link CritterAI.move}), zone tests
 * against the object's authored `vision`/`activation` colliders, and the
 * heading→facing→animation mapping.
 *
 * Subclasses supply only a temperament in {@link CritterAI.think}: {@link
 * ExploreAI} flees, {@link ChaseAI} closes in. They drive movement through the
 * shared {@link CritterAI.move} and read perception through {@link
 * CritterAI.sees} and {@link CritterAI.zoneBounds}.
 *
 * The critter can't see the game-owned player on its own, so the game feeds it
 * the player's box + the screen collision each frame via {@link
 * CritterAI.sense} before the screen advances the live objects.
 */
export abstract class CritterAI extends MapObject {
  static override readonly type: string;

  /** This frame's perception, set by the game before the screen updates. */
  protected target: Rect | null = null;
  protected collision: CollisionMap | null = null;

  protected facing: Facing = 'down';
  protected moving = false;
  protected heading: Vector2 = { x: 0, y: 0 };

  /**
   * Provide this frame's perception: the player's world box (or `null` when
   * off-screen) and the screen's collision world for movement.
   */
  sense(target: Rect | null, collision: CollisionMap): void {
    this.target = target;
    this.collision = collision;
  }

  /** World-space collision/footprint box. */
  box(): Rect {
    return { x: this.x, y: this.y, width: CRITTER_SIZE, height: CRITTER_SIZE };
  }

  /** Centre-bottom point, used for the walkable-ground check. */
  protected footPoint(): Vector2 {
    return { x: this.x + CRITTER_SIZE / 2, y: this.y + CRITTER_SIZE - 2 };
  }

  /** Centre point of the footprint. */
  protected center(): Vector2 {
    return { x: this.x + CRITTER_SIZE / 2, y: this.y + CRITTER_SIZE / 2 };
  }

  /**
   * World-space AABB of the current state's collider on `layer` (e.g.
   * `"vision"`, `"activation"`), or a square around the centre when the
   * object authors none.
   */
  protected zoneBounds(layer: string): Rect {
    const hit = this.worldColliders().find((c) => c.layer === layer);
    if (hit) {
      return hit.bounds;
    }
    const c = this.center();
    return { x: c.x - DEFAULT_ZONE, y: c.y - DEFAULT_ZONE, width: DEFAULT_ZONE * 2, height: DEFAULT_ZONE * 2 };
  }

  /** True when the sensed player overlaps `box`. */
  protected overlapsTarget(box: Rect): boolean {
    const t = this.target;
    if (!t) {
      return false;
    }
    return (
      box.x < t.x + t.width && box.x + box.width > t.x && box.y < t.y + t.height && box.y + box.height > t.y
    );
  }

  /** True when the sensed player overlaps this critter's `vision` zone. */
  get sees(): boolean {
    return this.overlapsTarget(this.zoneBounds('vision'));
  }

  override update(deltaTime: DeltaTime): void {
    this.think(deltaTime);
    super.update(deltaTime);
  }

  /** One AI step: pick a heading, move, animate. Implemented per temperament. */
  protected abstract think(dt: DeltaTime): void;

  /**
   * Slide `(dx, dy)` against solids and screen bounds, refusing steps that
   * land off walkable ground (a wall or pit). Returns `true` when the step was
   * blocked and undone, so callers can react (turn around, give up).
   */
  protected move(dx: number, dy: number): boolean {
    if (!this.collision) {
      this.x += dx;
      this.y += dy;
      return false;
    }
    const prevX = this.x;
    const prevY = this.y;
    const next = this.collision.resolve(this.box(), dx, dy, this);
    const maxX = this.collision.cols * this.collision.cellSize - CRITTER_SIZE;
    const maxY = this.collision.rows * this.collision.cellSize - CRITTER_SIZE;
    this.x = Math.max(0, Math.min(maxX, next.x));
    this.y = Math.max(0, Math.min(maxY, next.y));
    const foot = this.footPoint();
    if (!this.collision.isWalkable(foot.x, foot.y)) {
      this.x = prevX;
      this.y = prevY;
      return true;
    }
    return false;
  }

  /** Derive facing from the current heading and switch the animation state. */
  protected applyFacing(): void {
    if (this.moving) {
      if (Math.abs(this.heading.x) > Math.abs(this.heading.y)) {
        this.facing = this.heading.x < 0 ? 'left' : 'right';
      } else {
        this.facing = this.heading.y < 0 ? 'up' : 'down';
      }
    }
    this.play(this.desiredState());
  }

  /** The FSM state name matching the current facing + moving flag. */
  private desiredState(): string {
    if (!this.moving) {
      return 'Idle';
    }
    if (this.facing === 'up') return 'Up';
    if (this.facing === 'down') return 'Down';
    return this.facing === 'left' ? 'Left' : 'Right';
  }
}
