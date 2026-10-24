import { MapObjectBehaviour } from '../../../../src/index';
import type { ExploreAI } from '../objects/ai/explore_ai';

const WANDER_SPEED = 14; // px/s — a slow amble
const FLEE_SPEED = 48; // px/s — bolts away from the player
const WANDER_MIN = 0.7; // s between wander decisions
const WANDER_MAX = 1.8;
const IDLE_CHANCE = 0.35; // chance a wander decision is a pause

/**
 * The skittish temperament (rat, bat, slime, ghost, flying skull) attached to
 * an {@link ExploreAI}. Fuses the two states a fleeing critter alternates:
 *
 * - **Flee** — while the player is inside the critter's authored `vision`
 *   zone it bolts directly away (re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or
 *   a short pause) every so often.
 *
 * It drives the object's shared ({@link CritterAI}) movement, so the critter
 * class itself no longer contains any AI: it just attaches this behavior.
 */
export class ExploreBehavior extends MapObjectBehaviour {
  readonly type = 'explore';

  private wanderTimer = 0;

  constructor(owner: ExploreAI) {
    super(owner);
  }

  private get critter(): ExploreAI {
    return this.owner as ExploreAI;
  }

  override update(dt: number): void {
    const critter = this.critter;
    const speed = critter.sees ? this.fleeHeading() : this.wanderHeading(dt);
    const { x, y } = critter.heading;
    critter.moving = x !== 0 || y !== 0;
    if (critter.moving && critter.move(x * speed * dt, y * speed * dt)) {
      // Stepped onto a wall/pit — turn around and re-decide next tick.
      critter.heading = { x: -x, y: -y };
      this.wanderTimer = 0;
    }
    critter.applyFacing();
  }

  /** Aim directly away from the player; returns the flee speed. */
  private fleeHeading(): number {
    const critter = this.critter;
    const t = critter.target!;
    const c = critter.center();
    const ax = c.x - (t.x + t.width / 2);
    const ay = c.y - (t.y + t.height / 2);
    const len = Math.hypot(ax, ay) || 1;
    critter.heading = { x: ax / len, y: ay / len };
    this.wanderTimer = 0; // re-decide immediately once the player leaves
    return FLEE_SPEED;
  }

  /** Keep the current amble, choosing a fresh heading when the timer lapses. */
  private wanderHeading(dt: number): number {
    this.wanderTimer -= dt;
    if (this.wanderTimer <= 0) {
      this.wanderTimer = WANDER_MIN + Math.random() * (WANDER_MAX - WANDER_MIN);
      if (Math.random() < IDLE_CHANCE) {
        this.critter.heading = { x: 0, y: 0 };
      } else {
        const angle = Math.random() * Math.PI * 2;
        this.critter.heading = { x: Math.cos(angle), y: Math.sin(angle) };
      }
    }
    return WANDER_SPEED;
  }
}
