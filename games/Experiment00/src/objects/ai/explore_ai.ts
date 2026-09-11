import type { DeltaTime } from '../../../../../src/generic_types';
import { CritterAI } from './critter_ai';

const WANDER_SPEED = 14; // px/s — a slow amble
const FLEE_SPEED = 48; // px/s — bolts away from the player
const WANDER_MIN = 0.7; // s between wander decisions
const WANDER_MAX = 1.8;
const IDLE_CHANCE = 0.35; // chance a wander decision is a pause

/**
 * A skittish critter (rat, slime, ghost, flying skull). It runs its own simple
 * AI every frame on top of {@link CritterAI}'s shared movement/perception:
 *
 * - **Flee** — when the player enters the critter's authored `vision` collider
 *   it bolts directly away (and keeps re-aiming as the player moves).
 * - **Wander** — otherwise it ambles slowly, picking a new random heading (or a
 *   short pause) every so often.
 *
 * Movement slides against the screen's solids and stays on walkable ground; a
 * blocked step turns it around.
 */
export class ExploreAI extends CritterAI {
  static override readonly type: string;

  private wanderTimer = 0;

  /** True while the critter is bolting away from a sensed player. */
  get fleeing(): boolean {
    return this.sees;
  }

  protected think(dt: DeltaTime): void {
    const speed = this.sees ? this.fleeHeading() : this.wanderHeading(dt);
    const dx = this.heading.x * speed * dt;
    const dy = this.heading.y * speed * dt;
    this.moving = this.heading.x !== 0 || this.heading.y !== 0;

    if (this.moving && this.move(dx, dy)) {
      // Stepped onto a wall/pit — turn around and re-decide next tick.
      this.heading = { x: -this.heading.x, y: -this.heading.y };
      this.wanderTimer = 0;
    }
    this.applyFacing();
  }

  /** Aim directly away from the player; returns the flee speed. */
  private fleeHeading(): number {
    const t = this.target!;
    const c = this.center();
    const ax = c.x - (t.x + t.width / 2);
    const ay = c.y - (t.y + t.height / 2);
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
}
