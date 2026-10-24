import { ChaseAI } from './ai/chase_ai';

/**
 * The "skeleton" character, bound to the `skeleton` object and driven by its
 * exported state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). A {@link ChaseAI}
 * stalker: it walks slowly toward the player and, once within its `activation`
 * zone, opens the dialog named by its `message` property. Pressing **E** next
 * to it replays the dialog.
 */
export class Skeleton extends ChaseAI {
  static override readonly type = 'skeleton';
}
