import type MapObject from '../core/map/map_object';
import { InteractableBehaviour, type InteractionActor } from '../core/map/interactable_behaviour';
import { OutlineShader } from '../core/shaders/outline_shader';
import type { SubSystem } from './types';
import type { DeltaTime } from '@/generic_types';

/**
 * Input source accepted by {@link InteractionSystem}.
 *
 * A raw `Input` provides key edges; an `InputSystem` provides action edges.
 *
 * @category SubSystems
 */
export interface InteractionInput {
  /** Edge query for action-based input. */
  isActionPressed?(action: string): boolean;
  /** Edge query for raw keyboard input. */
  isKeyPressed?(key: string): boolean;
  /** Clears a press edge for raw keys or actions. */
  consume(value: string): void;
}

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
  /** Input source (edge-triggered presses). */
  input: InteractionInput;
  /**
   * Action that triggers an interaction. Takes precedence over `keys`.
   *
   * @example `'PRIMARY'`
   */
  action?: string;
  /** Services handed to {@link InteractableBehaviour.interact}. */
  services?: object;
  /** Optional gate (e.g. freeze while a modal is up). */
  isActive?: () => boolean;
  /**
   * Keys that trigger an interaction when `action` is not set.
   *
   * @defaultValue `['e', ' ']`
   */
  keys?: readonly string[];
  /** Outline color used to highlight in-reach interactables. */
  outlineColor?: string;
}

/**
 * The interaction action, generalized: every frame it outlines exactly the
 * interactables in reach (so the player sees what the action would target),
 * and on a press edge it acts on the best one — highest
 * {@link InteractableBehaviour.interactPriority} first, and the first whose
 * `interact` accepts.
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
 *   action: 'PRIMARY',
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
  private readonly action: string | undefined;
  private readonly keys: readonly string[];

  constructor(config: InteractionSystemConfig) {
    this.config = config;
    this.action = config.action;
    this.keys = config.keys ?? ['e', ' '];
  }

  update(_deltaTime: DeltaTime): void {
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

  /** Whether the configured action or any trigger key was just pressed. */
  private pressed(): boolean {
    if (this.action) {
      return this.config.input.isActionPressed?.(this.action) ?? false;
    }
    return this.keys.some((key) => this.config.input.isKeyPressed?.(key) ?? false);
  }

  /** Eats the press edge so no later system re-handles it. */
  private consume(): void {
    if (this.action) {
      this.config.input.consume(this.action);
      return;
    }
    for (const key of this.keys) {
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
