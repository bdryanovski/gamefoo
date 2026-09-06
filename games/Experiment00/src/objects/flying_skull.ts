import type { DeltaTime } from '../../../../src/generic_types';
import {
  type CollisionMap,
  type CollisionShape,
  MapObject,
  type MapObjectContext,
  type Rect,
  shapeBounds,
  translateShape,
} from '../../../../src/index';

const SIZE = 16;
const WANDER_SPEED = 14; // px/s — a slow amble
const FLEE_SPEED = 48; // px/s — bolts away from the player
const WANDER_MIN = 0.7; // s between wander decisions
const WANDER_MAX = 1.8;
const IDLE_CHANCE = 0.35; // chance a wander decision is a pause
const DEFAULT_VISION = 24; // px radius fallback when none is authored

type Facing = 'up' | 'down' | 'left' | 'right';

interface Vec {
  x: number;
  y: number;
}

/**
 * The "rat" critter, bound to the `rat` object and driven by its exported
 * state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). It runs its own simple
 * AI every frame:
 *
 * - **Flee** — when the player enters the rat's authored `vision` collider it
 *   bolts directly away (and keeps re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or
 *   a short pause) every so often.
 *
 * Movement slides against the screen's solids and stays on walkable ground.
 * The rat can't see the game-owned player on its own, so the game feeds it the
 * player's box + the screen collision each frame via {@link Rat.sense}; the
 * state machine is switched to match the heading so the animation follows.
 */
export class FlyingSkull extends MapObject {
  public static override readonly type = 'flying_skull';

  /** The `vision` collider shape (object-local), used for player detection. */
  private readonly vision: CollisionShape | null;

  /** Per-frame sensing, set by the game before the screen updates. */
  private target: Rect | null = null;
  private collision: CollisionMap | null = null;

  private facing: Facing = 'down';
  private moving = false;
  private heading: Vec = { x: 0, y: 0 };
  private wanderTimer = 0;

  constructor(ctx: MapObjectContext) {
    super(ctx);
    this.vision = this.findVisionShape();
  }

  /** Pull the `vision` collider from any state's authored colliders. */
  private findVisionShape(): CollisionShape | null {
    const byState = this.def.collisionsByState ?? {};
    for (const defs of Object.values(byState)) {
      for (const c of defs) {
        if (c.layerId === 'vision' && c.enabled !== false) return c.shape;
      }
    }
    return null;
  }

  /**
   * Provide this frame's perception: the player's world box (or `null` when
   * off-screen) and the screen's collision world for movement.
   */
  sense(target: Rect | null, collision: CollisionMap): void {
    this.target = target;
    this.collision = collision;
  }

  /** The rat's world-space collision/footprint box. */
  box(): Rect {
    return { x: this.x, y: this.y, width: SIZE, height: SIZE };
  }

  /** Centre-bottom point, used for the walkable-ground check. */
  private footPoint(): Vec {
    return { x: this.x + SIZE / 2, y: this.y + SIZE - 2 };
  }

  /** World-space AABB of the vision zone at the rat's current position. */
  private visionBounds(): Rect {
    if (!this.vision) {
      return {
        x: this.x + SIZE / 2 - DEFAULT_VISION,
        y: this.y + SIZE / 2 - DEFAULT_VISION,
        width: DEFAULT_VISION * 2,
        height: DEFAULT_VISION * 2,
      };
    }
    return shapeBounds(translateShape(this.vision, this.x, this.y));
  }

  /** True when the sensed player overlaps the vision zone. */
  get fleeing(): boolean {
    if (!this.target) return false;
    const v = this.visionBounds();
    const t = this.target;
    return (
      v.x < t.x + t.width && v.x + v.width > t.x && v.y < t.y + t.height && v.y + v.height > t.y
    );
  }

  override update(deltaTime: DeltaTime): void {
    this.think(deltaTime);
    super.update(deltaTime);
  }

  /** One AI step: pick a heading (flee or wander), move, animate. */
  private think(dt: DeltaTime): void {
    const speed = this.fleeing ? this.fleeHeading() : this.wanderHeading(dt);

    const dx = this.heading.x * speed * dt;
    const dy = this.heading.y * speed * dt;
    this.moving = this.heading.x !== 0 || this.heading.y !== 0;

    if (this.moving) this.move(dx, dy);
    this.applyFacing();
  }

  /** Aim directly away from the player; returns the flee speed. */
  private fleeHeading(): number {
    const t = this.target!;
    const ax = this.x + SIZE / 2 - (t.x + t.width / 2);
    const ay = this.y + SIZE / 2 - (t.y + t.height / 2);
    const len = Math.hypot(ax, ay) || 1;
    this.heading = { x: ax / len, y: ay / len };
    this.wanderTimer = 0; // re-decide immediately once the player leaves
    return FLEE_SPEED;
  }

  /** Keep the current amble, choosing a fresh heading when the timer lapses. */
  private wanderHeading(dt: DeltaTime): number {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderTimer = WANDER_MIN + Math.random() * (WANDER_MAX - WANDER_MIN);
      if (Math.random() < IDLE_CHANCE) {
        this.heading = { x: 0, y: 0 };
      } else {
        const angle = Math.random() * Math.PI * 2;
        this.heading = { x: Math.cos(angle), y: Math.sin(angle) };
      }
    }
    return WANDER_SPEED;
  }

  /** Slide against solids + screen bounds; refuse steps off walkable ground. */
  private move(dx: number, dy: number): void {
    const prevX = this.x;
    const prevY = this.y;

    if (this.collision) {
      const next = this.collision.resolve(this.box(), dx, dy, this);
      const maxX = this.collision.cols * this.collision.cellSize - SIZE;
      const maxY = this.collision.rows * this.collision.cellSize - SIZE;
      this.x = Math.max(0, Math.min(maxX, next.x));
      this.y = Math.max(0, Math.min(maxY, next.y));
      const foot = this.footPoint();
      if (!this.collision.isWalkable(foot.x, foot.y)) {
        // Stepped onto a wall/pit — undo and turn around next tick.
        this.x = prevX;
        this.y = prevY;
        this.heading = { x: -this.heading.x, y: -this.heading.y };
        this.wanderTimer = 0;
      }
    } else {
      this.x += dx;
      this.y += dy;
    }
  }

  /** Derive facing from the heading and switch the animation state. */
  private applyFacing(): void {
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
    if (!this.moving) return 'Idle';
    if (this.facing === 'up') return 'Up';
    if (this.facing === 'down') return 'Down';
    return this.facing === 'left' ? 'Left' : 'Right';
  }
}
