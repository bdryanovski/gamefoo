import type { Rect } from './types';
import { MapObjectBehaviour } from './map_behaviour';

/**
 * The thing acting on an interactable — the game's player, reduced to the two
 * boxes reaching is expressed with. Any object with these two methods
 * structurally satisfies it, so the engine never depends on a game player type.
 */
export interface InteractionActor {
  /** The actor's body box (used by body-reach interactables, e.g. stalkers). */
  box(): Rect;
  /** A slightly enlarged box used to reach nearby interactables. */
  interactionBox(): Rect;
}

/**
 * A {@link MapObjectBehaviour} that lets the actor act on the owner with a key
 * (E). The engine's {@link InteractionSystem} outlines every in-reach
 * interactable and, on a press, runs the highest-`interactPriority` one whose
 * {@link InteractableBehaviour.interact} accepts.
 *
 * @category Map
 * @since 0.5.0
 *
 * @see {@link InteractionSystem}
 */
export abstract class InteractableBehaviour extends MapObjectBehaviour {
  /**
   * Higher wins when several interactables are in reach at once. Distinct from
   * {@link MapObjectBehaviour.priority}, which orders per-frame ticks.
   */
  abstract readonly interactPriority: number;

  /**
   * Whether acting on the owner is possible right now (reach + state test).
   * Also gates the outline highlight, so highlight and action never disagree.
   */
  abstract inReach(actor: InteractionActor): boolean;

  /**
   * Perform the interaction.
   *
   * @param services - The shared services bag the map was loaded with
   *   (the game reaches its `GameContext` through it).
   * @returns `true` when the press was consumed; `false` lets the next
   *   in-reach interactable try — the fall-through of the old dispatch chain.
   */
  abstract interact(services: object): boolean;
}
