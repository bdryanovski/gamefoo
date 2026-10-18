import type Input from '../core/input';
import type MapObject from '../core/map/map_object';
import { InteractableBehaviour, type InteractionActor } from '../core/map/interactable_behaviour';
import { OutlineShader } from '../core/shaders/outline_shader';
import type { SubSystem } from './types';

/**
 * Configuration for {@link InteractionSystem}.
 *
 * @category SubSystems
 */
export interface InteractionSystemConfig {
  /** The actor reaching for things (the game's player). `null` → idle. */
  actor: () => InteractionActor | null;
  /** The live objects to scan each frame (e.g. the active screen's). */
  objects: () => Iterable<MapObject>;
  /** Keyboard source (edge-triggered presses). */
  input: Input;
  /** Services handed to {@link InteractableBehaviour.interact}. */
  services?: object;
  /** Optional gate (e.g. freeze while a modal is up). */
  isActive?: () => boolean;
  /**
   * Keys that trigger an interaction.
   *
   * @defaultValue `['e', ' ']`
   */
  keys?: readonly string[];
  /** Outline color used to highlight in-reach interactables. */
  outlineColor?: string;
}

/**
 * The E key, generalized: every frame it outlines exactly the interactables in
 * reach (so the player sees what E would act on), and on a press edge it acts
 * on the best one — highest {@link InteractableBehaviour.interactPriority}
 * first, and the first whose `interact` accepts.
 *
 * Highlight and action share one predicate per object, so they can never
 * disagree. Any object carrying an {@link InteractableBehaviour} participates;
 * the system knows nothing about specific game objects.
 *
 * @since 0.5.0
 * @category SubSystems
 *
 * @example
 * ```ts
 * engine.use(new InteractionSystem({
 *   actor: () => ctx.player ?? null,
 *   objects: () => ctx.world?.objects() ?? [],
 *   input: ctx.input,
 *   services: ctx,
 *   isActive: () => ctx.flow?.worldActive ?? false,
 * }));
 * ```
 */
export class InteractionSystem implements SubSystem {
  id = 'interact';

  /** Before dialog (85) / lock (87) / splash (89) — same slot as before. */
  order = 40;

  private readonly config: InteractionSystemConfig;
  private readonly keys: readonly string[];

  constructor(config: InteractionSystemConfig) {
    this.config = config;
    this.keys = config.keys ?? ['e', ' '];
  }

  update(_deltaTime: number): void {
    if (this.config.isActive && !this.config.isActive()) {
      return;
    }
    const actor = this.config.actor();
    if (!actor) {
      return;
    }
    const inReach = this.frame(actor);
    if (!this.pressed()) {
      return;
    }
    const services = this.config.services ?? {};
    for (const behaviour of inReach) {
      if (behaviour.interact(services)) {
        this.consume();
        return;
      }
    }
  }

  /**
   * Outlines every interactable by reach and returns the in-reach behaviors,
   * best first. A stable sort keeps screen order for equal priorities.
   */
  private frame(actor: InteractionActor): InteractableBehaviour[] {
    const inReach: InteractableBehaviour[] = [];
    for (const object of this.config.objects()) {
      for (const behaviour of object.getBehaviours()) {
        if (!(behaviour instanceof InteractableBehaviour)) {
          continue;
        }
        const on = behaviour.inReach(actor);
        this.highlight(object, on);
        if (on) {
          inReach.push(behaviour);
        }
      }
    }
    inReach.sort((a, b) => b.interactPriority - a.interactPriority);
    return inReach;
  }

  /** Whether any trigger key was just pressed. */
  private pressed(): boolean {
    return (this.config.keys ?? ['e', ' ']).some((key) => this.config.input.isKeyPressed(key));
  }

  /** Eats the press edges so no later system re-handles them. */
  private consume(): void {
    for (const key of this.config.keys ?? ['e', ' ']) {
      this.config.input.consume(key);
    }
  }

  /** Attaches (once) and toggles the outline shader on an interactable. */
  private highlight(obj: MapObject, on: boolean): void {
    let outline = obj.getShader<OutlineShader>('outline');
    outline ??= obj.attachShader(
      new OutlineShader({ color: this.config.outlineColor ?? '#ffffff', thickness: 1 }),
    );
    outline.enabled = on;
  }
}
