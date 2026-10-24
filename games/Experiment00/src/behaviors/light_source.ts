import type { DitherLight } from '../../../../src/index';
import {
  type CollisionDefinition,
  type DitherLightOptions,
  GlowShader,
  type GlowConfig,
  MapObjectBehaviour,
  type MapObject,
  ParticleShader,
  type ParticleConfig,
  shapeBounds,
  translateShape,
} from '../../../../src/index';
import { addOwnerLight } from './fog_light';
import { game } from '../services';

/** A world-space axis-aligned box. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The glow + ember effects a {@link LightSource} shows while burning. */
export interface FireEffects {
  glow: GlowConfig;
  particles: ParticleConfig;
}

/**
 * The dither-fog light a {@link LightSource} casts while burning: radii in
 * world px, the reveal pattern, the additive glow tint and an optional
 * flicker. `null` (the default) opts out of the fog entirely.
 */
export type FireFogLight = Partial<DitherLightOptions> | null;

/** The default flame, shared by fires that don't override it. */
export const DEFAULT_FIRE_EFFECTS: FireEffects = {
  glow: { color: '#ff8a1a', radius: 52, intensity: 0.25, pulseSpeed: 1, pulseAmount: 0.35 },
  particles: { color: '#ffcc55', rate: 6, speed: 10, spread: 6, gravity: 0.9, lifetime: 10.9 },
};

/**
 * A two-state light source (lit ⇄ unlit) — the shared behaviour behind
 * campfires, torches, candles and lanterns. The owner is authored as a machine
 * whose **initial** state is the burning variant and whose other state is the
 * cold one; the owner authors no FSM edges, so this behavior drives the toggle.
 *
 * Everything is read from the owner's definition: the lit/unlit states from
 * `machineDefinition.initialStateId`, and the `solid` collider from
 * `definition.collisionsByState`. A factory only needs to supply the glow/ember
 * tuning and the fog-light signature.
 */
export class LightSource extends MapObjectBehaviour {
  readonly type = 'light-source';

  /** The fog light this fire casts while lit (removed on detach). */
  private fogLight: DitherLight | null = null;

  constructor(
    owner: MapObject,
    private readonly effects: FireEffects = DEFAULT_FIRE_EFFECTS,
    private readonly fogOptions: FireFogLight = null,
  ) {
    super(owner);
  }

  /** Attaches the flame's glow + ember effects, matched to the lit state. */
  override onAttach(): void {
    this.owner.attachShader(new GlowShader(this.effects.glow));
    this.owner.attachShader(new ParticleShader(this.effects.particles));
    this.syncEffects();
    this.attachFogLight();
  }

  override onDetach(): void {
    if (this.fogLight) {
      game(this.owner.services)?.fog?.removeLight(this.fogLight);
      this.fogLight = null;
    }
  }

  /** Registers this fire's dither-fog light (when the fog is up). */
  private attachFogLight(): void {
    if (!this.fogOptions) {
      return;
    }
    this.fogLight = addOwnerLight(this.owner, { ...this.fogOptions, enabled: this.lit });
  }

  /** Enable the glow/ember effects (and fog light) only while lit. */
  private syncEffects(): void {
    const glow = this.owner.getShader('glow');
    if (glow) {
      glow.enabled = this.lit;
    }
    const embers = this.owner.getShader('particles');
    if (embers) {
      embers.enabled = this.lit;
    }
    if (this.fogLight) {
      this.fogLight.enabled = this.lit;
    }
  }

  /** The burning state's id — the machine's initial state. */
  private get litStateId(): string {
    const machine = this.owner.machineDefinition;
    return machine.initialStateId ?? machine.states[0]?.id ?? '';
  }

  /** The cold state's id — the first state that isn't the lit one. */
  private get unlitStateId(): string {
    return (
      this.owner.machineDefinition.states.find((s) => s.id !== this.litStateId)?.id ?? this.litStateId
    );
  }

  /** Whether the light is currently burning. */
  get lit(): boolean {
    return this.owner.state === this.litStateId;
  }

  /**
   * Flip lit ⇄ unlit.
   *
   * @returns `true` if the state actually changed.
   */
  toggle(): boolean {
    const changed = this.owner.transition(this.lit ? this.unlitStateId : this.litStateId);
    this.syncEffects();
    return changed;
  }

  /** Force the light out (idempotent). */
  extinguish(): boolean {
    return this.lit ? this.toggle() : false;
  }

  /** Force the light on (idempotent). */
  ignite(): boolean {
    return this.lit ? false : this.toggle();
  }

  /** Authored colliders for the owner's current state. */
  private stateColliders(): CollisionDefinition[] {
    return this.owner.definition.collisionsByState?.[this.owner.state] ?? [];
  }

  /** World-space AABB of the current state's `solid` collider (if any). */
  get collisionBox(): Box {
    const solid = this.stateColliders().find((c) => c.layerId === 'solid' && c.enabled !== false);
    if (!solid) {
      return { x: this.owner.x, y: this.owner.y, w: 0, h: 0 };
    }
    const b = shapeBounds(translateShape(solid.shape, this.owner.x, this.owner.y));
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }
}
