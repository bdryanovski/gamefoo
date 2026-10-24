import type { RenderContext, SubSystem } from '../../../../src/index';
import type { GameContext } from '../context';
import { GAME_ACTION } from '../config/controls';

/** Actions the overlay reacts to while it is open. */
const INVENTORY_ACTIONS = [
  [GAME_ACTION.up, 'up'],
  [GAME_ACTION.down, 'down'],
  [GAME_ACTION.left, 'left'],
  [GAME_ACTION.right, 'right'],
  [GAME_ACTION.inventory, 'close'],
] as const;

/**
 * The inventory overlay: opens the book-like {@link InventoryView}, which
 * then captures navigation actions and closes itself. Opening pushes
 * `'inventory'` onto the flow stack, so the world freezes while it is up — the
 * replacement for `MapGame`'s `inventoryView` key handling.
 */
export class InventorySystem implements SubSystem {
  readonly id = 'inventory';
  readonly order = 88; // above dialog (85) + lock (87); below splash (89)

  constructor(private readonly context: GameContext) {}

  update(): void {
    const view = this.context.inventoryView;
    const flow = this.context.flow;
    const input = this.context.input;
    const open = view.isOpen;

    // Reconcile the freeze with the view's current state. The view flips its
    // own open flag on close, so the transition is observed one frame later.
    const frozen = flow?.has('inventory') ?? false;
    if (open && !frozen) {
      flow?.push('inventory');
    } else if (!open && frozen) {
      flow?.pop('inventory');
    }

    if (open) {
      for (const [action, direction] of INVENTORY_ACTIONS) {
        if (input.isActionPressed(action) && view.handleAction(direction)) {
          input.consume(action);
        }
      }
      return;
    }

    // Closed: the inventory action opens it — unless a dialog, keypad, or the
    // splash owns the screen, in which case that action belongs to them.
    if (
      input.isActionPressed(GAME_ACTION.inventory) &&
      !flow?.has('splash') &&
      !flow?.has('dialog') &&
      !flow?.has('lock')
    ) {
      view.show();
      input.consume(GAME_ACTION.inventory);
    }
  }

  render(ctx: RenderContext): void {
    this.context.inventoryView.render(ctx); // no-op while hidden
  }
}
