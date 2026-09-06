import { Firelight } from './base/firelight';

/**
 * Custom class bound to the "campfire" object — a burning fire the player can
 * toggle lit/unlit. All behaviour lives in {@link Firelight}; the object's
 * two-state machine (`init` ⇄ `off`) and its `solid` collider are read from
 * the definition delivered at spawn, so there is nothing to configure.
 *
 * Bind it with `registry.register(Campfire)` (keyed by its static `type`,
 * matching the object's name). A screen class can then configure each spawned
 * instance (see {@link Firelight.extinguish} / {@link Firelight.ignite}) to
 * give a room its own variant — e.g. a chamber whose fires start dead.
 */
export class Campfire extends Firelight {
  static override readonly type = 'campfire';
}
