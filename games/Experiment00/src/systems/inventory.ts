import type { RenderContext, SubSystem } from '../../../../src/index';
import type { GameContext } from '../context';

/** Keys the overlay reacts to while it is open (lowercased for `Input`). */
const INVENTORY_KEYS = [
  'escape',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'w',
  'a',
  's',
  'd',
] as const;

/**
 * The Esc inventory overlay: opens the book-like {@link InventoryView}, which
 * then captures the navigation keys and closes itself. Opening pushes
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
    // own open flag on Esc, so the transition is observed here one frame later.
    const frozen = flow?.has('inventory') ?? false;
    if (open && !frozen) {
      flow?.push('inventory');
    } else if (!open && frozen) {
      flow?.pop('inventory');
    }

    if (open) {
      for (const key of INVENTORY_KEYS) {
        if (input.isKeyPressed(key) && view.handleKeyName(key)) {
          input.consume(key);
        }
      }
      return;
    }

    // Closed: Esc opens it — unless a dialog, keypad, or the splash owns the
    // screen, in which case Esc belongs to them.
    if (
      input.isKeyPressed('escape') &&
      !flow?.has('splash') &&
      !flow?.has('dialog') &&
      !flow?.has('lock')
    ) {
      view.show();
      input.consume('escape');
    }
  }

  render(ctx: RenderContext): void {
    this.context.inventoryView.render(ctx); // no-op while hidden
  }
}
