import { InteractableBehaviour, type InteractionActor } from '../../../../src/index';
import { BLOCK_SIZE, PORTAL_OPEN_SECONDS, SCREEN_H, SCREEN_W } from '../constants';
import type { GameContext } from '../context';
import { harvest } from '../harvest';
import type { LightSource } from './light_source';
import type { Bookshelf } from '../objects/bookshelf';
import type { Campfire } from '../objects/campfire';
import type { Chest } from '../objects/chest';
import type { Portal } from '../objects/portal';
import type { Sign } from '../objects/sign';
import type { ChaseAI } from '../objects/ai/chase_ai';
import type { SlimeKing } from '../objects/slime_king';

/** How far a campfire can be used from, in px (centre to centre). */
const CAMP_REACH = 24;

/**
 * A portal: unlocked/open doors travel behind the iris wipe; a locked door
 * raises its reminder (then the keypad) or falls through to a toast. Bound to
 * a {@link Portal}, whose open state + persistence it drives.
 */
export class PortalBehavior extends InteractableBehaviour {
  readonly type = 'portal-use';
  readonly interactPriority = 100;

  constructor(private readonly portal: Portal) {
    super(portal);
  }

  inReach(actor: InteractionActor): boolean {
    return this.portal.overlaps(actor.interactionBox());
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    const portal = this.portal;
    harvest(ctx, portal);
    if (portal.isLocked) {
      ctx.telemetry.portalLocked(portal.id);
      // Reminder first; the keypad raises when the reminder closes.
      if (
        ctx.dialog?.start(portal.reminderRef, 'portal_reminder', () => ctx.lock?.openFor(portal))
      ) {
        return true;
      }
      ctx.hud?.show('The door is locked', 1.4);
      ctx.lock?.openFor(portal);
      return true;
    }
    if (portal.isOpen) {
      const target = portal.target;
      if (target && ctx.world?.canNavigate(target.x, target.y)) {
        ctx.telemetry.portalTravel(portal.id, `${target.x},${target.y}`);
        const spawn = portal.spawn;
        ctx.transition?.begin(() => {
          ctx.world?.navigate(target.x, target.y, (player) => {
            if (spawn) {
              player.placeClamped(
                spawn.col * BLOCK_SIZE,
                spawn.row * BLOCK_SIZE,
                SCREEN_W,
                SCREEN_H,
              );
            } else {
              player.placeAtCentre(SCREEN_W, SCREEN_H);
            }
          });
        });
      }
      return true;
    }
    if (!portal.isOpening) {
      portal.beginOpening(PORTAL_OPEN_SECONDS);
      ctx.telemetry.portalOpen(portal.id);
      const handle = ctx.audio?.playSound('portal_open', { volume: 0.4, rate: 4 });
      if (handle) handle.onEnded(() => portal.open());
      else portal.open();
    }
    return true;
  }
}

/** A sign or any pure "show a message" interactable. */
export class SignBehavior extends InteractableBehaviour {
  readonly type = 'sign-use';
  readonly interactPriority = 80;

  constructor(private readonly sign: Sign) {
    super(sign);
  }

  inReach(actor: InteractionActor): boolean {
    return this.sign.overlaps(actor.interactionBox());
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    harvest(ctx, this.sign);
    return ctx.dialog?.start(this.sign.dialogRef, 'sign') ?? false;
  }
}

/** A chest: opens once, grants its item, toasts, and runs its dialog. */
export class ChestBehavior extends InteractableBehaviour {
  readonly type = 'chest-use';
  readonly interactPriority = 70;

  constructor(private readonly chest: Chest) {
    super(chest);
  }

  inReach(actor: InteractionActor): boolean {
    return !this.chest.isOpen && this.chest.overlaps(actor.interactionBox());
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    const chest = this.chest;
    if (!chest.open()) return false;
    ctx.audio?.playSound('chest_open', { volume: 0.7 });
    ctx.telemetry.chestOpen(chest.id, chest.item ?? null);
    if (!harvest(ctx, chest)) {
      ctx.hud?.show('The chest is empty', 1.2);
    }
    ctx.dialog?.start(chest.dialogRef, 'chest');
    return true;
  }
}

/** A bookshelf: shows its message, then slides open a movable secret shelf. */
export class BookshelfBehavior extends InteractableBehaviour {
  readonly type = 'shelf-use';
  readonly interactPriority = 75;

  constructor(private readonly shelf: Bookshelf) {
    super(shelf);
  }

  inReach(actor: InteractionActor): boolean {
    return this.shelf.overlaps(actor.interactionBox());
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    const shelf = this.shelf;
    harvest(ctx, shelf);
    if (shelf.movable && !shelf.isOpen) {
      // Slide open after the message is read — or now, when it has none.
      if (ctx.dialog?.start(shelf.dialogRef, 'bookshelf', () => shelf.slideOpen())) {
        return true;
      }
      shelf.slideOpen();
      return true;
    }
    return ctx.dialog?.start(shelf.dialogRef, 'bookshelf') ?? false;
  }
}

/** A campfire: toggles its flame when the player is close enough. */
export class CampfireBehavior extends InteractableBehaviour {
  readonly type = 'campfire-use';
  readonly interactPriority = 50;

  constructor(private readonly campfire: Campfire) {
    super(campfire);
  }

  private get light(): LightSource | undefined {
    return this.campfire.getBehaviour<LightSource>('light-source');
  }

  inReach(actor: InteractionActor): boolean {
    const box = actor.box();
    const b = this.light?.collisionBox ?? { x: this.campfire.x, y: this.campfire.y, w: 0, h: 0 };
    const dx = box.x + box.width / 2 - (b.x + b.w / 2);
    const dy = box.y + box.height / 2 - (b.y + b.h / 2);
    return dx * dx + dy * dy <= CAMP_REACH * CAMP_REACH;
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    harvest(ctx, this.campfire);
    this.light?.toggle();
    ctx.telemetry.campfireToggle(this.campfire.id, this.light?.lit ?? false);
    return true;
  }
}

/** A stalker: replays its dialog on demand with E. */
export class StalkerBehavior extends InteractableBehaviour {
  readonly type = 'stalker-use';
  readonly interactPriority = 90;

  constructor(private readonly foe: ChaseAI) {
    super(foe);
  }

  inReach(actor: InteractionActor): boolean {
    return this.foe.overlaps(actor.box()); // stalkers talk from the body box
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    harvest(ctx, this.foe);
    return ctx.dialog?.start(this.foe.dialogRef, 'stalker') ?? false;
  }
}

/** The slime king: shows its message on demand with E. */
export class SlimeKingBehavior extends InteractableBehaviour {
  readonly type = 'slime-king-use';
  readonly interactPriority = 85;

  constructor(private readonly king: SlimeKing) {
    super(king);
  }

  inReach(actor: InteractionActor): boolean {
    return this.king.overlaps(actor.box());
  }

  interact(services: object): boolean {
    const ctx = services as GameContext;
    harvest(ctx, this.king);
    return ctx.dialog?.start(this.king.dialogRef, 'slime_king') ?? false;
  }
}
