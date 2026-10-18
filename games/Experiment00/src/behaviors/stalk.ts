import { MapObjectBehaviour } from '../../../../src/index';
import type { ChaseAI } from '../objects/ai/chase_ai';
import { greet } from '../senses';

const CHASE_SPEED = 16; // px/s — a slow, inevitable approach

/**
 * The stalking temperament (skeleton, goblin) attached to a {@link ChaseAI}:
 *
 * - **Approaches** — while the player is on-screen it walks straight toward
 *   them at a slow, menacing pace, sliding along solids.
 * - **Confronts** — once the player is inside its authored `activation` zone it
 *   stops and (via the shared services bag) opens the dialog named by
 *   its `message` property — exactly **once**, on the first meeting. Afterward
 *   the player replays it on demand with **E** (the object's Interactable).
 *
 * Drives the object's shared ({@link CritterAI}) movement; the critter class
 * only attaches this behavior and exposes its dialog reference.
 */
export class StalkBehavior extends MapObjectBehaviour {
  readonly type = 'stalk';

  /** Latched after the one automatic greeting; only **E** replays afterward. */
  private greeted = false;

  constructor(owner: ChaseAI) {
    super(owner);
  }

  private get foe(): ChaseAI {
    return this.owner as ChaseAI;
  }

  override update(dt: number): void {
    const foe = this.foe;
    const t = foe.target;
    if (!t || foe.reached) {
      if (foe.reached && !this.greeted) {
        this.greetPlayer();
      }
      foe.heading = { x: 0, y: 0 };
      foe.moving = false;
      foe.applyFacing();
      return;
    }

    const c = foe.center();
    const ax = t.x + t.width / 2 - c.x;
    const ay = t.y + t.height / 2 - c.y;
    const len = Math.hypot(ax, ay) || 1;
    foe.heading = { x: ax / len, y: ay / len };
    foe.moving = true;
    // A blocked step just stalls against the wall/pit — keep pursuing.
    foe.move(foe.heading.x * CHASE_SPEED * dt, foe.heading.y * CHASE_SPEED * dt);
    foe.applyFacing();
  }

  /** Fire (once) the automatic greeting: telemetry + the opening dialog. */
  private greetPlayer(): void {
    this.greeted = true;
    greet(this.owner.services, this.owner.definition.name, this.foe.dialogRef);
  }
}
