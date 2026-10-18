import { MapObject } from '../../../../src/index';
import { CampfireBehavior } from '../behaviors/interactable';
import { DEFAULT_FIRE_EFFECTS, LightSource, type FireFogLight } from '../behaviors/light_source';

/**
 * A wide, warm campfire: fully clear at its core, the widest and slowest
 * dissolve, with a lazy flame-like flicker.
 */
const FOG: FireFogLight = {
  innerRadius: 16,
  ditherRadius: 120,
  strength: 1,
  pattern: 'bayer8',
  flickerAmount: 0.01,
  flickerSpeed: 0.3,
};

/**
 * Custom class bound to the "campfire" object — a burning fire the player can
 * toggle lit/unlit. The flame itself is the {@link LightSource} behavior
 * attached on spawn; the object's two-state machine (`init` ⇄ `off`) and its
 * `solid` collider are read from the definition delivered at spawn, so there is
 * nothing to configure.
 *
 * Bind it with `registry.register(Campfire)` (keyed by its static `type`,
 * matching the object's name). A screen class can then configure each spawned
 * instance (via the {@link LightSource} behavior) to give a room its own
 * variant — e.g. a chamber whose fires start dead.
 */
export class Campfire extends MapObject {
  static override readonly type = 'campfire';

  override onSpawn(): void {
    this.attachBehaviour(new LightSource(this, DEFAULT_FIRE_EFFECTS, FOG));
    this.attachBehaviour(new CampfireBehavior(this));
  }
}
