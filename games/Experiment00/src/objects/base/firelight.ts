import {
  type CollisionDefinition,
  GlowShader,
  type GlowConfig,
  MapObject,
  ParticleShader,
  type ParticleConfig,
  type RenderContext,
  shapeBounds,
  translateShape,
} from '../../../../../src/index';

/** A world-space axis-aligned box. */
/**
 * TODO: create generic type for boxes
 */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The glow + ember effects a {@link Firelight} shows while burning. */
export interface FireEffects {
  glow: GlowConfig;
  particles: ParticleConfig;
}

const DEFAULT_EFFECTS: FireEffects = {
  glow: { color: '#ff8a1a', radius: 52, intensity: 0.25, pulseSpeed: 1, pulseAmount: 0.35 },
  particles: { color: '#ffcc55', rate: 6, speed: 10, spread: 6, gravity: 0.9, lifetime: 10.9 },
};

/**
 * A two-state light source (lit ⇄ unlit) — the shared behaviour behind
 * {@link Campfire} and {@link Torch}. The object is authored as a machine
 * whose **initial** state is the burning variant and whose other state is the
 * cold one; the object authors no FSM edges, so the class drives the toggle.
 *
 * Everything is read from the object definition delivered at spawn
 * ({@link MapObject}'s `machine`/`def`): the lit/unlit states from
 * `machine.initialStateId`, and the `solid` collider from `def.collisionsByState`.
 * No config file, no globals, no load-order coupling — a subclass only needs to
 * declare its registry `type` (and may override {@link Firelight.effects} to
 * tune the flame).
 *
 * @see {@link MapObjectRegistry}
 */
export abstract class Firelight extends MapObject {
  /** Glow/ember settings shown while lit. Override to tune per subclass. */
  protected effects(): FireEffects {
    return DEFAULT_EFFECTS;
  }

  /** Attach the flame's glow + ember effects, matched to the lit state. */
  public override onSpawn(): void {
    const fx = this.effects();
    this.attachShader(new GlowShader(fx.glow));
    this.attachShader(new ParticleShader(fx.particles));
    this.syncEffects();
  }

  /** Enable the glow/ember shaders only while lit. */
  private syncEffects(): void {
    const glow = this.getShader('glow');
    if (glow) {
      glow.enabled = this.lit;
    }
    const embers = this.getShader('particles');
    if (embers) {
      embers.enabled = this.lit;
    }
  }

  /** The burning state's id — the machine's initial state. */
  private get litStateId(): string {
    return this.machine.initialStateId ?? this.machine.states[0]?.id ?? '';
  }

  /** The cold state's id — the first state that isn't the lit one. */
  private get unlitStateId(): string {
    return this.machine.states.find((s) => s.id !== this.litStateId)?.id ?? this.litStateId;
  }

  /** Whether the light is currently burning. */
  public get lit(): boolean {
    return this.state === this.litStateId;
  }

  /**
   * Flip lit ⇄ unlit.
   *
   * @returns `true` if the state actually changed.
   */
  public toggle(): boolean {
    const changed = this.transition(this.lit ? this.unlitStateId : this.litStateId);
    this.syncEffects();
    return changed;
  }

  /** Force the light out (idempotent). Used by screen classes for variants. */
  public extinguish(): boolean {
    return this.lit ? this.toggle() : false;
  }

  /** Force the light on (idempotent). Used by screen classes for variants. */
  public ignite(): boolean {
    return this.lit ? false : this.toggle();
  }

  /** Authored colliders for the current state, from the object definition. */
  private stateColliders(): CollisionDefinition[] {
    return this.def.collisionsByState?.[this.state] ?? [];
  }

  /** World-space AABB of the current state's `solid` collider (if any). */
  public get collisionBox(): Box {
    const solid = this.stateColliders().find((c) => c.layerId === 'solid' && c.enabled !== false);
    if (!solid) {
      return { x: this.x, y: this.y, w: 0, h: 0 };
    }
    const b = shapeBounds(translateShape(solid.shape, this.x, this.y));
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }

  public override render(ctx: RenderContext): void {
    // The base composites every cell of the current state at its grid offset.
    super.render(ctx);
  }
}
