import type { RenderContext } from '../renderer/type';
import StateMachine from '../state_machine';
import type AssetManager from './asset_manager';
import type DrawNode from './draw_node';
import FrameNode from './frame_node';
import AnimatedObject from './animated_object';
import { shapeBounds, transformShape, type WorldCollider } from './collision_map';
import ShaderHost from '../shaders/shader_host';
import type { ShaderPart } from '../shaders/types';
import type {
  GameObjectDefinition,
  MapObjectContext,
  ObjectCell,
  ObjectLayer,
  StateMachineDefinition,
  StateNodeDefinition,
  Transform,
} from './types';
import type { DeltaTime } from '@/generic_types';
import type { MapObjectBehaviour } from './map_behaviour';
import type { MapObjectBehaviourRegistry } from './behaviour_registry';

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
 * A state's art resolves into a list of {@link DrawNode} parts — one per
 * visible cell of its authored composition, each anchored to this object —
 * which the object advances and draws as one unit, handing them to shaders
 * that trace its silhouette.
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
 * @see {@link ShaderHost} — the position + shader base this builds on
 */
export default class MapObject extends ShaderHost {
  /**
   * Registry key. Override in subclasses; falls back to the object name.
   */
  static readonly type?: string;

  /**
   * Z-layer this object lives on.
   */
  readonly level: number;

  /**
   * Stable per-placement identity (the map {@link Placement.id}), or `""` when
   * the object was created without one. Use it to key persistent per-instance
   * state — an opened chest, a collected pickup — in a store.
   */
  readonly id: string;

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
   * The current state's draw parts — each visible composition cell as a
   * static frame or a live animation, anchored to this object at its cell's
   * pixel offset. Parts stack bottom→top, so a layered state (e.g. `base` +
   * `door`) renders in full.
   */
  private parts: DrawNode[] = [];

  /**
   * Authored behaviour type keys (from the prefab / placement), resolved
   * against a {@link MapObjectBehaviourRegistry} on screen activation.
   */
  private readonly authoredBehaviours: readonly string[];
  /**
   * The shared services bag handed to behaviours (game singletons), or
   * `undefined` when the map was loaded without one.
   */
  private readonly gameServices?: object;
  /**
   * Attached behaviors, keyed by lowercased {@link MapObjectBehaviour.type}.
   */
  private readonly behaviorMap = new Map<string, MapObjectBehaviour>();
  /**
   * Priority-sorted cache of behaviors, invalidated on attach/detach.
   */
  private sortedBehaviours: MapObjectBehaviour[] | null = null;

  constructor(ctx: MapObjectContext) {
    super({ x: ctx.x, y: ctx.y });
    this.level = ctx.level;
    this.id = ctx.id ?? '';
    this.def = ctx.def;
    this.machine = ctx.machine;
    this.properties = ctx.properties;
    this.assets = ctx.assets;
    this.transform = ctx.transform;
    this.authoredBehaviours = ctx.behaviours ?? [];
    this.gameServices = ctx.services;

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
  get state(): string {
    return this.fsm.current;
  }

  /**
   * The object prefab (name, sprites, animations, meta, authored colliders).
   * Exposed for engine-side {@link MapObjectBehaviour | behaviors}.
   */
  get definition(): GameObjectDefinition {
    return this.def;
  }

  /**
   * The finite state machine definition (states + transitions), for behaviors
   * that reason about authored states.
   */
  get machineDefinition(): StateMachineDefinition {
    return this.machine;
  }

  /**
   * The authored key/value properties for this object. Exposed for behaviors
   * that read their tuning from the map project.
   */
  get authored(): Record<string, string> {
    return this.properties;
  }

  /**
   * The shared services bag attached by the loader (game singletons:
   * state store, fog, dialog, …). `undefined` when none was provided; game
   * behaviors/objects narrow it to their own `GameServices` shape.
   */
  get services(): object | undefined {
    return this.gameServices;
  }

  /**
   * Fires `condition`. If a transition leaves the current state on that
   * condition, moves to its target (and swaps the display).
   *
   * @returns `true` if a transition was taken.
   */
  interact(condition: string): boolean {
    const current = this.fsm.current;
    const edge = this.machine.transitions.find(
      (t) => t.fromStateId === current && t.condition === condition,
    );
    if (!edge) {
      return false;
    }
    return this.fsm.transition(edge.toStateId);
  }

  // --- Behaviors ----------------------------------------------------------

  /**
   * The attached behaviour with `type` (case-insensitive), or `undefined`.
   */
  getBehaviour<T extends MapObjectBehaviour>(type: string): T | undefined {
    return this.behaviorMap.get(type.toLowerCase()) as T | undefined;
  }

  /**
   * Whether a behaviour with `type` (case-insensitive) is attached.
   */
  hasBehaviour(type: string): boolean {
    return this.behaviorMap.has(type.toLowerCase());
  }

  /**
   * Every attached behaviour that is an instance of `type`.
   */
  getBehavioursByType<T extends MapObjectBehaviour>(
    type: abstract new (...args: never[]) => T,
  ): T[] {
    return this.behaviors.filter((b): b is T => b instanceof type);
  }

  /**
   * Attaches a behaviour; fires its {@link MapObjectBehaviour.onAttach} hook.
   *
   * @returns The same behaviour instance (for chaining).
   */
  attachBehaviour<T extends MapObjectBehaviour>(behaviour: T): T {
    this.behaviorMap.set(behaviour.key, behaviour);
    this.sortedBehaviours = null;
    behaviour.onAttach?.();
    return behaviour;
  }

  /**
   * Detaches the behaviour with `type`, firing {@link MapObjectBehaviour.onDetach}.
   */
  detachBehaviour(type: string): void {
    const behaviour = this.behaviorMap.get(type.toLowerCase());
    if (!behaviour) {
      return;
    }
    behaviour.onDetach?.();
    this.behaviorMap.delete(type.toLowerCase());
    this.sortedBehaviours = null;
  }

  /**
   * Detaches every behaviour (firing each `onDetach`).
   */
  detachBehaviours(): void {
    for (const type of Array.from(this.behaviorMap.keys())) {
      this.detachBehaviour(type);
    }
  }

  /**
   * Resolves and attaches this object's authored `behaviours` from `registry`.
   * Unknown names warn and are skipped. Called by the screen on activation,
   * after {@link MapObject.onSpawn}.
   */
  attachAuthoredBehaviours(registry?: MapObjectBehaviourRegistry, services?: object): void {
    if (!registry) {
      return;
    }
    for (const type of this.authoredBehaviours) {
      const factory = registry.resolve(type);
      if (!factory) {
        console.warn(`[MapObject] Unknown behaviour "${type}" on "${this.def.name}"`);
        continue;
      }
      this.attachBehaviour(factory(this, services));
    }
  }

  /**
   * Every attached behaviour, in priority order (lowest first). Mainly for
   * engine systems that dispatch on a behavior subclass (e.g. interaction).
   */
  getBehaviours(): readonly MapObjectBehaviour[] {
    return this.behaviors;
  }

  /**
   * Priority-sorted behaviours, recomputed only when the set changes.
   */
  private get behaviors(): MapObjectBehaviour[] {
    this.sortedBehaviours ??= Array.from(this.behaviorMap.values()).sort(
      (a, b) => a.priority - b.priority,
    );
    return this.sortedBehaviours;
  }

  /**
   * Calls `update(deltaTime)` on every enabled behaviour, in priority order.
   * Driven by the screen (game subclasses override {@link MapObject.update}).
   */
  updateBehaviours(deltaTime: DeltaTime): void {
    for (const behaviour of this.behaviors) {
      if (behaviour.enabled) {
        behaviour.update(deltaTime);
      }
    }
  }

  /**
   * Calls `render(ctx)` on every enabled behaviour that defines one, in
   * priority order, after the object's own render.
   */
  renderBehaviours(ctx: RenderContext): void {
    for (const behaviour of this.behaviors) {
      if (behaviour.enabled && behaviour.render) {
        behaviour.render(ctx);
      }
    }
  }

  /**
   * Called once when the object's screen becomes active.
   */
  onSpawn(): void {}

  /**
   * Called once when the object's screen is left; disposes the FSM.
   */
  onDespawn(): void {
    this.clearShaders();
    this.fsm.destroy();
  }

  /**
   * Advances the current state's animations, if any.
   */
  update(deltaTime: DeltaTime): void {
    for (const part of this.parts) {
      part.update(deltaTime);
    }
    this.updateShaders(deltaTime);
  }

  /**
   * Draws the current state's parts, between the under and over shader passes.
   */
  render(ctx: RenderContext): void {
    this.renderShaders(ctx, () => {
      for (const part of this.parts) {
        part.render(ctx);
      }
    });
  }

  /**
   * This object's colliders in world (screen) pixels for its **current
   * state**, resolved from `collisionsByState`. Each carries its layer
   * (`solid`, `trigger`, …) and points back to this object as `owner`, so a
   * {@link CollisionMap} can block movement or resolve interactions. Empty
   * when the current state authors none (e.g. an unlit, non-solid campfire).
   */
  worldColliders(): WorldCollider[] {
    return this.collidersForState(this.state);
  }

  /**
   * This object's colliders for an arbitrary state id, resolved from
   * `collisionsByState` and placed in world (screen) pixels. Lets a subclass
   * keep a state's colliders in another state — e.g. an opened chest reusing
   * its closed state's `solid` so it still blocks. Empty when that state
   * authors none.
   */
  protected collidersForState(stateId: string): WorldCollider[] {
    const defs = this.def.collisionsByState?.[stateId] ?? [];
    const out: WorldCollider[] = [];
    const footprint = this.footprint;
    for (const collision of defs) {
      if (collision.enabled === false) {
        continue;
      }
      const shape = transformShape(collision.shape, this.x, this.y, this.transform, footprint);
      out.push({ layer: collision.layerId, shape, bounds: shapeBounds(shape), owner: this });
    }
    return out;
  }

  /**
   * Transitions to a state by **id**.
   */
  transition(stateId: string): boolean {
    return this.fsm.transition(stateId);
  }

  /**
   * Transitions to a state by its authored **name**.
   */
  play(stateName: string): boolean {
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
   * Reads an authored key/value property by name — the public counterpart to
   * {@link MapObject.prop}. Lets game systems drive behaviour from free-form
   * editor properties (e.g. a chest's `item_id`, a note's `journal_id`)
   * without the object class having to expose a dedicated getter for each.
   *
   * @since 0.5.0
   */
  getProperty(key: string): string | undefined {
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
   * The parts of the current state, so silhouette shaders can trace this
   * object's art rather than its bounding box.
   */
  protected override shaderParts(): readonly ShaderPart[] {
    return this.parts;
  }

  /**
   * The centre that a placement transform rotates colliders about — the
   * authored composition grid, or a nominal cell when the prefab has no grid.
   *
   * Deliberately not {@link Node.getSize}: a gridless object's draw bounds grow
   * to its sprite, but its collider pivot stays on the nominal cell, so
   * rotating an ungridded prefab keeps its authored collision geometry.
   */
  private get footprint(): { width: number; height: number } {
    const grid = this.def.grid;
    return grid
      ? { width: grid.cols * grid.cell, height: grid.rows * grid.cell }
      : { width: 16, height: 16 };
  }

  /**
   * Resolves a state's `display` into a frame or a fresh animation.
   */
  private applyState(state: StateNodeDefinition): void {
    this.parts = [];

    const layers = this.def.layersByState?.[state.id];
    if (layers && layers.length > 0) {
      this.addComposedParts(layers, this.def.grid?.cell ?? 16);
    } else {
      // Fallback: the state's single representative display (objects with no
      // authored composition).
      this.addDisplayPart(state);
    }

    const [width, height] = this.stateSize();
    this.setSize(width, height);
  }

  /**
   * The size the current state draws at — its composition grid, else its first
   * part's frame, else a nominal cell for a state with neither. Keeps the
   * object's {@link ShaderHost.bounds | bounds} in step with its art.
   */
  private stateSize(): [number, number] {
    const grid = this.def.grid;
    if (grid) {
      return [grid.cols * grid.cell, grid.rows * grid.cell];
    }
    const frame = this.parts[0]?.frame;
    return [frame?.sw ?? 16, frame?.sh ?? 16];
  }

  /**
   * Pushes one part per cell of the state's authored composition, layer by
   * layer (bottom→top) and skipping hidden layers.
   */
  private addComposedParts(layers: ObjectLayer[], cell: number): void {
    for (const layer of layers) {
      if (!layer.visible) {
        continue;
      }
      for (const c of layer.cells) {
        this.addCellPart(c, cell);
      }
    }
  }

  /**
   * Pushes the part for one composition cell at its grid offset, combining
   * the object's transform with the cell's own flips.
   */
  private addCellPart(c: ObjectCell, cell: number): void {
    const ox = c.col * cell;
    const oy = c.row * cell;
    const transform: Transform = {
      rotation: this.transform?.rotation,
      flipX: (this.transform?.flipX ?? false) !== (c.flipX ?? false),
      flipY: (this.transform?.flipY ?? false) !== (c.flipY ?? false),
    };

    if (c.source.kind === 'sprite') {
      const frame = this.assets.frame(c.source.spriteId);
      if (frame) {
        this.parts.push(new FrameNode(this, ox, oy, frame, transform));
      }
    } else {
      const clip = this.assets.clip(c.source.animationId);
      if (clip) {
        this.parts.push(new AnimatedObject(clip, this, ox, oy, transform));
      }
    }
  }

  /**
   * Pushes the fallback part for a state with no authored composition: its
   * single representative display, drawn at the object origin.
   */
  private addDisplayPart(state: StateNodeDefinition): void {
    const { display } = state;
    if (display.kind === 'sprite' && display.spriteId) {
      const frame = this.assets.frame(display.spriteId);
      if (frame) {
        this.parts.push(new FrameNode(this, 0, 0, frame, this.transform));
      }
    } else if (display.kind === 'animation' && display.animationId) {
      const clip = this.assets.clip(display.animationId);
      if (clip) {
        this.parts.push(new AnimatedObject(clip, this, 0, 0, this.transform));
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
