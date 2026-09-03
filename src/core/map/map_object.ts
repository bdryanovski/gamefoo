import type { RenderContext } from '../renderer/type';
import StateMachine from '../state_machine';
import AnimatedObject from './animated_object';
import type AssetManager from './asset_manager';
import { drawFrame } from './draw';
import { shapeBounds, translateShape, type WorldCollider } from './collision_map';
import type { Shader } from '../shaders/shader';
import { ShaderStack } from '../shaders/shader_stack';
import type { ShaderRegion } from '../shaders/types';
import type {
  Frame,
  GameObjectDefinition,
  MapObjectContext,
  StateMachineDefinition,
  StateNodeDefinition,
  Transform,
} from './types';
import type { DeltaTime } from '@/generic_types';

/**
 * Base class for every placed object driven by a {@link StateMachineDefinition}
 * (chests, torches, switches, enemies).
 *
 * The base wires the FSM from {@link MapObjectContext.machine}, resolves
 * each state's `display` (a static sprite or an animation) on entry, and
 * draws/advances it — so an unsubclassed `MapObject` already works. Custom
 * classes extend this to own the machine: add timers, fire conditions in
 * {@link MapObject.interact | interact}, and override the lifecycle hooks.
 *
 * Instances are created when their screen becomes active and disposed when
 * it is left (see {@link Screen}); {@link MapObject.onDespawn | onDespawn}
 * tears the FSM down.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example A custom chest
 * ```ts
 * class Chest extends MapObject {
 *   static readonly type = "Chest";
 *   private opened = false;
 *   override interact(): boolean {
 *     if (this.opened) return false;
 *     this.opened = true;
 *     return this.play("open"); // by state name
 *   }
 * }
 * registry.register(Chest);
 * ```
 *
 * @see {@link MapObjectRegistry}
 * @see {@link StateMachine}
 */
export default class MapObject {
  /**
   * Registry key. Override in subclasses; falls back to the object name.
   */
  public static readonly type?: string;

  /**
   * Pixel X within the screen.
   */
  public x: number;
  /**
   * Pixel Y within the screen.
   */
  public y: number;
  /**
   * Z-layer this object lives on.
   */
  public readonly level: number;

  /**
   * The object prefab (name, sprites, animations, meta).
   */
  protected readonly def: GameObjectDefinition;
  /**
   * The machine definition (states + transitions).
   */
  protected readonly machine: StateMachineDefinition;
  /**
   * Free-form key/value config authored on the object.
   */
  protected readonly properties: Record<string, string>;
  /**
   * Shared catalog for resolving frames/clips.
   */
  protected readonly assets: AssetManager;
  /**
   * The finite state machine this object drives.
   */
  protected readonly fsm: StateMachine<string>;

  private readonly transform?: Transform;
  /**
   * Active animation for the current state, if it displays one.
   */
  private anim?: AnimatedObject;
  /**
   * Active static frame for the current state, if it displays one.
   */
  private staticFrame?: Frame;

  /**
   * Screen effects attached to this object (glow, particles, …).
   */
  private readonly shaders = new ShaderStack();

  constructor(ctx: MapObjectContext) {
    this.x = ctx.x;
    this.y = ctx.y;
    this.level = ctx.level;
    this.def = ctx.def;
    this.machine = ctx.machine;
    this.properties = ctx.properties;
    this.assets = ctx.assets;
    this.transform = ctx.transform;

    const initial =
      ctx.startStateId ?? ctx.machine.initialStateId ?? ctx.machine.states[0]?.id ?? '';
    this.fsm = new StateMachine<string>(initial);

    for (const state of ctx.machine.states) {
      this.fsm.onEnter(state.id, () => this.applyState(state));
    }

    const initialState = ctx.machine.states.find((s) => s.id === initial);
    if (initialState) {
      this.applyState(initialState);
    }
  }

  /**
   * The current state's id.
   */
  public get state(): string {
    return this.fsm.current;
  }

  /**
   * Fires `condition`. If a transition leaves the current state on that
   * condition, moves to its target (and swaps the display).
   *
   * @returns `true` if a transition was taken.
   */
  public interact(condition: string): boolean {
    const current = this.fsm.current;
    const edge = this.machine.transitions.find(
      (t) => t.fromStateId === current && t.condition === condition,
    );
    if (!edge) {
      return false;
    }
    return this.fsm.transition(edge.toStateId);
  }

  /**
   * Called once when the object's screen becomes active.
   */
  public onSpawn(): void {}

  /**
   * Called once when the object's screen is left; disposes the FSM.
   */
  public onDespawn(): void {
    this.shaders.clear();
    this.fsm.destroy();
  }

  /**
   * Advances the current animation, if any.
   */
  public update(_deltaTime: DeltaTime): void {
    this.anim?.update(_deltaTime);
    this.shaders.update(_deltaTime);
  }

  /**
   * Draws the current state's display.
   */
  public render(ctx: RenderContext): void {
    if (this.anim) {
      // keep the animation aligned with the object (custom classes may move it)
      this.anim.x = this.x;
      this.anim.y = this.y;
      this.anim.render(ctx);
    } else if (this.staticFrame) {
      drawFrame(ctx, this.staticFrame, this.x, this.y, this.transform);
    }
    this.shaders.render(ctx, this.bounds());
  }

  /**
   * Attaches a screen shader to this object; returns it for configuration.
   */
  public attachShader<T extends Shader>(shader: T): T {
    return this.shaders.attach(shader);
  }

  /**
   * The attached shader with `type`, or `undefined`.
   */
  public getShader<T extends Shader>(type: string): T | undefined {
    return this.shaders.get<T>(type);
  }

  /**
   * Whether a shader with `type` is attached.
   */
  public hasShader(type: string): boolean {
    return this.shaders.has(type);
  }

  /**
   * Detaches the shader with `type`, if present.
   */
  public detachShader(type: string): void {
    this.shaders.detach(type);
  }

  /**
   * This object's colliders in world (screen) pixels for its **current
   * state**, resolved from `collisionsByState`. Each carries its layer
   * (`solid`, `trigger`, …) and points back to this object as `owner`, so a
   * {@link CollisionMap} can block movement or resolve interactions. Empty
   * when the current state authors none (e.g. an unlit, non-solid campfire).
   */
  public worldColliders(): WorldCollider[] {
    const defs = this.def.collisionsByState?.[this.state] ?? [];
    const out: WorldCollider[] = [];
    for (const collision of defs) {
      if (collision.enabled === false) {
        continue;
      }
      const shape = translateShape(collision.shape, this.x, this.y);
      out.push({ layer: collision.layerId, shape, bounds: shapeBounds(shape), owner: this });
    }
    return out;
  }

  /**
   * The object's bounding box, used as the region passed to shaders.
   */
  protected bounds(): ShaderRegion {
    const frame = this.anim?.frame ?? this.staticFrame;
    const width = frame?.sw ?? 16;
    const height = frame?.sh ?? 16;
    return { x: this.x, y: this.y, width, height };
  }

  /**
   * Transitions to a state by **id**.
   */
  protected transition(stateId: string): boolean {
    return this.fsm.transition(stateId);
  }

  /**
   * Transitions to a state by its authored **name**.
   */
  protected play(stateName: string): boolean {
    const target = this.machine.states.find((s) => s.name === stateName);
    return target ? this.fsm.transition(target.id) : false;
  }

  /**
   * Reads an authored property.
   */
  protected prop(key: string): string | undefined {
    return this.properties[key];
  }

  /**
   * Reads an authored property as a number, or `fallback` if absent/NaN.
   */
  protected propNumber(key: string, fallback = 0): number {
    const value = Number(this.properties[key]);
    return Number.isFinite(value) ? value : fallback;
  }

  /**
   * Reads an authored property as a boolean (`"true"`/`"1"` are true).
   */
  protected propBool(key: string): boolean {
    const value = this.properties[key];
    return value === 'true' || value === '1';
  }

  /**
   * Resolves a state's `display` into a frame or a fresh animation.
   */
  private applyState(state: StateNodeDefinition): void {
    this.anim = undefined;
    this.staticFrame = undefined;

    const { display } = state;
    if (display.kind === 'sprite' && display.spriteId) {
      this.staticFrame = this.assets.frame(display.spriteId);
    } else if (display.kind === 'animation' && display.animationId) {
      const clip = this.assets.clip(display.animationId);
      if (clip) {
        this.anim = new AnimatedObject(clip, this.x, this.y, this.transform);
      }
    }
  }
}

/**
 * Constructor shape a {@link MapObjectRegistry} stores.
 */
export type MapObjectConstructor = (new (ctx: MapObjectContext) => MapObject) & {
  type?: string;
};
