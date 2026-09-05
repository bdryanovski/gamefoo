import {
  type CollisionDefinition,
  type CollisionShape,
  GlowShader,
  MapObject,
  type MapObjectContext,
  ParticleShader,
  type RenderContext,
  shapeBounds,
  translateShape,
  type WorldCollider,
} from '../../../../src/index';

/**
 * The bits of the exported `*.object.json` the {@link Campfire} class needs:
 * which state means "lit" vs "unlit", and the authored `solid` collider.
 */
export interface CampfireConfig {
  /** State NAME rendered as the burning fire (the object's `initial`). */
  litState: string;
  /** State NAME rendered as the cold, unlit pit. */
  unlitState: string;
  /** Authored colliders per state NAME (both lit and unlit), from the file. */
  collisionsByName: Record<string, CollisionDefinition[]>;
}

// The tool exports every object into its own file; the class is configured
// from that file rather than hard-coded. Populated by loadCampfireConfig()
// before the map loads, then read by every spawned Campfire.
let config: CampfireConfig | null = null;

/** The shape of `campfire.object.json` we read (only the fields we use). */
interface CampfireObjectFile {
  size?: { width: number; height: number };
  grid?: { cell?: number };
  states: Record<
    string,
    {
      collisions?: Array<{ layer: string; enabled?: boolean; shape: CollisionShape }>;
    }
  >;
  initial?: string;
}

/**
 * Fetches the object-editor export and derives the {@link CampfireConfig}:
 * the `initial` state is "lit", the other state is "unlit", and the first
 * enabled collision becomes the solid box. Call once before loading the map.
 */
export async function loadCampfireConfig(url: string): Promise<CampfireConfig> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load campfire object: ${url} (${response.status})`);
  const file = (await response.json()) as CampfireObjectFile;

  const stateNames = Object.keys(file.states);
  const litState = file.initial ?? stateNames[0] ?? 'init';
  const unlitState = stateNames.find((name) => name !== litState) ?? litState;

  const collisionsByName: Record<string, CollisionDefinition[]> = {};
  for (const [name, state] of Object.entries(file.states)) {
    collisionsByName[name] = (state.collisions ?? []).map((c) => ({
      layerId: c.layer,
      enabled: c.enabled,
      shape: c.shape,
    }));
  }

  config = { litState, unlitState, collisionsByName };
  return config;
}

/** A world-space axis-aligned box. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Custom class bound to the "campfire" object. It owns the two-state
 * machine the object defines (`init` ⇄ `off`) — which ships with **no**
 * transitions — and adds the interaction logic: a player can toggle it
 * lit/unlit, and its authored `solid` collider is used both to hit-test
 * clicks and (in a full game) to block movement.
 *
 * Bind it with `registry.register(Campfire)` (keyed by its static `type`,
 * matching the object's name). A screen class can then configure each
 * spawned instance (see {@link Campfire.extinguish} / {@link Campfire.ignite})
 * to give a room its own variant — e.g. a chamber whose fires start dead.
 */
export class Campfire extends MapObject {
  static override readonly type = 'campfire';

  constructor(ctx: MapObjectContext) {
    super(ctx);
    // The object's initialStateId is the lit fire, so we spawn lit by
    // default — no extra work needed here beyond asserting configuration.
    if (!config) {
      throw new Error('Campfire used before loadCampfireConfig() resolved');
    }
  }

  /** Attach the fire's glow + ember effects, matched to the lit state. */
  override onSpawn(): void {
    this.attachShader(
      new GlowShader({
        color: '#ff8a1a',
        radius: 52,
        intensity: 0.25,
        pulseSpeed: 1,
        pulseAmount: 0.35,
      }),
    );
    this.attachShader(
      new ParticleShader({
        color: '#ffcc55',
        rate: 6,
        speed: 10,
        spread: 6,
        gravity: 0.9,
        lifetime: 10.9,
      }),
    );
    this.syncEffects();
  }

  /** Enable the glow/ember shaders only while the fire is lit. */
  private syncEffects(): void {
    const glow = this.getShader('glow');
    if (glow) glow.enabled = this.lit;
    const embers = this.getShader('particles');
    if (embers) embers.enabled = this.lit;
  }

  private get cfg(): CampfireConfig {
    if (!config) throw new Error('Campfire config missing');
    return config;
  }

  /** Current state's authored NAME (`init` / `off`), not its id. */
  private get stateName(): string | undefined {
    return this.machine.states.find((s) => s.id === this.state)?.name;
  }

  /** Whether the fire is currently burning. */
  get lit(): boolean {
    return this.stateName === this.cfg.litState;
  }

  /**
   * Player interaction: flip lit ⇄ unlit. The object authors no FSM edges,
   * so the class drives the transition directly by state name.
   *
   * @returns `true` if the state actually changed.
   */
  toggle(): boolean {
    const changed = this.play(this.lit ? this.cfg.unlitState : this.cfg.litState);
    this.syncEffects();
    return changed;
  }

  /**
   * Forces the fire unlit (cold pit). Idempotent. Used by screen classes to
   * apply a room variant.
   *
   * @returns `true` if the state changed.
   */
  extinguish(): boolean {
    return this.lit ? this.toggle() : false;
  }

  /**
   * Forces the fire lit (burning). Idempotent. Used by screen classes to
   * apply a room variant.
   *
   * @returns `true` if the state changed.
   */
  ignite(): boolean {
    return this.lit ? false : this.toggle();
  }

  /** Authored colliders for the current state (from the object file). */
  private stateColliders(): CollisionDefinition[] {
    return this.cfg.collisionsByName[this.stateName ?? ''] ?? [];
  }

  /** World-space AABB of the current state's `solid` collider (if any). */
  get collisionBox(): Box {
    const solid = this.stateColliders().find((c) => c.layerId === 'solid' && c.enabled !== false);
    if (!solid) return { x: this.x, y: this.y, w: 0, h: 0 };
    const b = shapeBounds(translateShape(solid.shape, this.x, this.y));
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  }

  /** Every current-state collider in world space — fed to the CollisionMap. */
  override worldColliders(): WorldCollider[] {
    const out: WorldCollider[] = [];
    for (const collision of this.stateColliders()) {
      if (collision.enabled === false) continue;
      const shape = translateShape(collision.shape, this.x, this.y);
      out.push({ layer: collision.layerId, shape, bounds: shapeBounds(shape), owner: this });
    }
    return out;
  }

  /** True when a world-space point lands on the collider. */
  hitTest(worldX: number, worldY: number): boolean {
    const b = this.collisionBox;
    return worldX >= b.x && worldX <= b.x + b.w && worldY >= b.y && worldY <= b.y + b.h;
  }

  override render(ctx: RenderContext): void {
    // The base composites every cell of the current state at its grid offset.
    super.render(ctx);
    // Affordance: outline the interactive collider — warm when lit, cold off.
    const b = this.collisionBox;
    ctx.strokeRect(b.x, b.y, b.w, b.h, this.lit ? '#ffb347' : '#4a4a68');
  }
}
