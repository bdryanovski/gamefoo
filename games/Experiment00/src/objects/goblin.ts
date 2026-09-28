import { ChaseAI } from './ai/chase_ai';

/**
 * The "goblin" character, bound to the `goblin` object and driven by its
 * exported state machine (`Idle`/`Up`/`Down`/`Left`/`Right`). A {@link ChaseAI}
 * stalker: it walks slowly toward the player and, once within its `activation`
 * zone, opens the dialog named by its `message` property. Pressing **E** next
 * to it replays the dialog.
 */
export class Goblin extends ChaseAI {
  static override readonly type = 'goblin';
}
