import type { DitherLight, DitherLightOptions, MapObject } from '../../../../src/index';
import { MapObjectBehaviour } from '../../../../src/index';
import { CRITTER_SIZE } from '../objects/ai/critter_ai';
import { game } from '../services';

/**
 * The settings every always-on glow shares: a full-strength reveal using the
 * coarse `bayer8` pattern. Owners override only what differs — radii, flicker,
 * `enabled`, offsets, …
 */
export const DEFAULT_FOG_LIGHT: Partial<DitherLightOptions> = {
  strength: 1,
  pattern: 'bayer8',
};

/**
 * The drifting ghost-light tuning shared by the wandering critters (flying
 * skull, Her): a small inner reveal ringed by a wide dither area, with a gentle
 * flicker — the critter drifts through the darkness as a fading wisp.
 */
export const GHOST_LIGHT: Partial<DitherLightOptions> = {
  innerRadius: 10,
  ditherRadius: 50,
  flickerAmount: 0.12,
  flickerSpeed: 1.7,
  offsetX: CRITTER_SIZE / 2,
  offsetY: CRITTER_SIZE / 2,
};

/**
 * Adds a dither-fog light that follows `owner`, centred on its sprite by
 * default. Returns `null` when the fog is not up. The one place lights are
 * created, so {@link FogLight} and the fire light sources stay in sync.
 */
export function addOwnerLight(
  owner: MapObject,
  options: Partial<DitherLightOptions> = {},
): DitherLight | null {
  const fog = game(owner.services)?.fog;
  if (!fog) {
    return null;
  }
  const { width, height } = owner.getSize();
  return fog.addLight({
    x: owner.x + width / 2,
    y: owner.y + height / 2,
    followTarget: owner,
    offsetX: width / 2,
    offsetY: height / 2,
    ...options,
  });
}

/**
 * A steady or flickering dither-fog glow that follows its owner and is torn
 * down automatically when the owner despawns (or the behaviour detaches) — so
 * a released object never leaves a light behind.
 *
 * The light is centred on the owner's sprite by default; pass `offsetX`/
 * `offsetY` (and any other {@link DitherLightOptions}) to shift it. Toggle it at
 * runtime with {@link setEnabled} and read it with {@link light} — this is how
 * a chest lights its glow only once opened.
 */
export class FogLight extends MapObjectBehaviour {
  readonly type = 'fog-light';

  private fogLight: DitherLight | null = null;

  constructor(
    owner: MapObject,
    private readonly options: Partial<DitherLightOptions> = {},
  ) {
    super(owner);
  }

  override onAttach(): void {
    this.fogLight = addOwnerLight(this.owner, { ...DEFAULT_FOG_LIGHT, ...this.options });
  }

  override onDetach(): void {
    if (!this.fogLight) {
      return;
    }
    game(this.owner.services)?.fog?.removeLight(this.fogLight);
    this.fogLight = null;
  }

  /** The live fog light, or `null` before attach / after detach. */
  get light(): DitherLight | null {
    return this.fogLight;
  }

  /** Show/hide the glow without removing it (no-op before attach). */
  setEnabled(enabled: boolean): void {
    if (this.fogLight) {
      this.fogLight.enabled = enabled;
    }
  }
}
