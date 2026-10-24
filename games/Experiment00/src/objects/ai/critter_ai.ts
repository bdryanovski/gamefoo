import type { Vector2 } from '../../../../../src/generic_types';
import { type CollisionMap, MapObject, type Rect } from '../../../../../src/index';
import { collision as readCollision, playerBox } from '../../senses';

/** Footprint side, in px — every critter is a 16×16 mover. */
export const CRITTER_SIZE = 16;

/** Half-side fallback for a zone when its collider is missing. */
const DEFAULT_ZONE = 12;

type Facing = 'up' | 'down' | 'left' | 'right';

/**
 * Shared brain-stem for the map's roaming characters. It owns the parts every
 * critter needs regardless of temperament — collider-aware movement that
 * slides on solids and refuses to walk off walkable ground
 * ({@link CritterAI.move}), zone tests against the object's authored
 * `vision`/`activation` colliders, the heading→facing→animation mapping, and
 * the player's box.
 *
 * Perception is *pulled*: {@link CritterAI.target} and {@link CritterAI.collision}
 * read the shared services bag (`senses.ts`) instead of being fed a frame
 * ahead by the game. The explicit {@link CritterAI.sense} setter remains for
 * unit tests (and as a per-frame override), but production never calls it.
 *
 * Temperaments live in attached {@link MapObjectBehaviour}s (see
 * `behaviors/explore.ts` and `behaviors/stalk.ts`) that drive the shared
 * movement through this public surface; subclasses only pick their behavior.
 */
export abstract class CritterAI extends MapObject {
  static override readonly type: string;

  /** Per-frame perception override (tests only); `null` → read the senses service. */
  private sensed: { target: Rect | null; collision: CollisionMap } | null = null;

  /** Current facing (drives the FSM state when moving). */
  facing: Facing = 'down';
  /** Whether this critter moved on the last think. */
  moving = false;
  /** Current heading unit vector (`{0,0}` = idle). */
  heading: Vector2 = { x: 0, y: 0 };

  /**
   * Provide perception explicitly, bypassing the senses service. Production
   * code relies on the service; tests use this to feed a box + collision.
   */
  sense(target: Rect | null, collision: CollisionMap): void {
    this.sensed = { target, collision };
  }

  /** The player's world box: the override if set, else the shared services. */
  get target(): Rect | null {
    return this.sensed ? this.sensed.target : playerBox(this.services);
  }

  /** The screen collision: the override if set, else the shared services. */
  get collision(): CollisionMap | null {
    return this.sensed ? this.sensed.collision : readCollision(this.services);
  }

  /** World-space collision/footprint box. */
  box(): Rect {
    return { x: this.x, y: this.y, width: CRITTER_SIZE, height: CRITTER_SIZE };
  }

  /** World-space centre of the footprint. */
  center(): Vector2 {
    return { x: this.x + CRITTER_SIZE / 2, y: this.y + CRITTER_SIZE / 2 };
  }

  /**
   * World-space AABB of the `layer` collider in the current state, or a
   * square around the centre when none is authored.
   */
  zoneBounds(layer: string): Rect {
    const zone = this.worldColliders().find((c) => c.layer === layer);
    if (zone) {
      return zone.bounds;
    }
    const c = this.center();
    return {
      x: c.x - DEFAULT_ZONE,
      y: c.y - DEFAULT_ZONE,
      width: DEFAULT_ZONE * 2,
      height: DEFAULT_ZONE * 2,
    };
  }

  /** True when `box` overlaps the player's sensed box. */
  overlapsTarget(box: Rect): boolean {
    const t = this.target;
    if (!t) {
      return false;
    }
    return (
      box.x < t.x + t.width &&
      box.x + box.width > t.x &&
      box.y < t.y + t.height &&
      box.y + box.height > t.y
    );
  }

  /** True when the player overlaps this critter's authored `vision` zone. */
  get sees(): boolean {
    return this.overlapsTarget(this.zoneBounds('vision'));
  }

  /** World-space foot point used for the walkable-ground test. */
  footPoint(): Vector2 {
    return { x: this.x + CRITTER_SIZE / 2, y: this.y + CRITTER_SIZE - 2 };
  }

  /**
   * Slide `(dx, dy)` against solids and screen bounds, refusing steps that
   * land off walkable ground (a wall or pit). Returns `true` when the step was
   * blocked and undone, so callers can react (turn around, give up).
   */
  move(dx: number, dy: number): boolean {
    const collision = this.collision;
    if (!collision) {
      this.x += dx;
      this.y += dy;
      return false;
    }
    const prevX = this.x;
    const prevY = this.y;
    const next = collision.resolve(this.box(), dx, dy, this);
    const maxX = collision.cols * collision.cellSize - CRITTER_SIZE;
    const maxY = collision.rows * collision.cellSize - CRITTER_SIZE;
    this.x = Math.max(0, Math.min(maxX, next.x));
    this.y = Math.max(0, Math.min(maxY, next.y));
    const foot = this.footPoint();
    if (!collision.isWalkable(foot.x, foot.y)) {
      this.x = prevX;
      this.y = prevY;
      return true;
    }
    return false;
  }

  /** Sync facing from the heading and switch the animation state. */
  applyFacing(): void {
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
    if (this.facing === 'up') {
      return 'Up';
    }
    if (this.facing === 'down') {
      return 'Down';
    }
    return this.facing === 'left' ? 'Left' : 'Right';
  }
}
