import type { SubSystem } from '../../../../src/index';
import { CollectibleBehaviour } from '../behaviors/collectible';
import type { GameContext } from '../context';
import { harvest } from '../harvest';

/**
 * Walk-over pickups: collects any {@link CollectibleBehaviour} whose `pickup`
 * collider the player overlaps — records it (stays gone across
 * screens/reloads), toasts, and — when it carries a `message` — opens its
 * dialog once (the modal then freezes the world for the frame).
 *
 * Dispatching on the behavior, not on a concrete object class, keeps the
 * system free of per-collectible imports.
 */
export class PickupSystem implements SubSystem {
  readonly id = 'pickup';
  readonly order = 35; // after the world moved the player (20), before E (40)

  constructor(private readonly context: GameContext) {}

  update(_dt: number): void {
    if (!this.context.flow?.worldActive) return;

    const player = this.context.player;
    const screen = this.context.world?.current();

    if (!player || !screen) return;

    for (const object of screen.collision.owners(player.box(), 'pickup', player)) {
      const collectible = object.getBehaviour<CollectibleBehaviour>('collectible');
      if (!collectible || !collectible.collect()) continue;
      this.context.hud?.show(collectible.toast, collectible.toastSeconds);
      this.context.telemetry.olivePickup(object.id);
      harvest(this.context, object);
      if (this.context.dialog?.start(collectible.dialogRef, collectible.dialogTag)) break;
    }
  }
}
