import type { ScopedState, StateChange } from '../../../src/index';

/** One held item and how many the player carries. */
export interface InventoryEntry {
  id: string;
  count: number;
}

/**
 * The player's item bag, backed by a {@link ScopedState} so it persists with
 * the save and notifies listeners on every change. Items are stored as
 * `id → count`; the item definitions and their display icons are declared
 * elsewhere (later), so the bag stays a plain count map.
 *
 * @example
 * ```ts
 * const inventory = new Inventory(save.scope('inventory'));
 * inventory.add('gold_key');
 * inventory.subscribe(() => redrawHud(inventory.items()));
 * ```
 */
export class Inventory {
  constructor(private readonly state: ScopedState) {}

  /** Adds `qty` (default 1) of `itemId`. No-op for an empty id or `qty <= 0`. */
  add(itemId: string, qty = 1): void {
    if (itemId === '' || qty <= 0) {
      return;
    }
    this.state.update<number>(itemId, (n) => (n ?? 0) + qty);
  }

  /** How many of `itemId` are held. */
  count(itemId: string): number {
    return this.state.get<number>(itemId) ?? 0;
  }

  /** Whether at least one `itemId` is held. */
  has(itemId: string): boolean {
    return this.count(itemId) > 0;
  }

  /** Every held item as `{ id, count }`, in insertion order. */
  items(): InventoryEntry[] {
    const bag = this.state.get<Record<string, number>>() ?? {};
    return Object.entries(bag).map(([id, count]) => ({ id, count }));
  }

  /** Subscribes to any inventory change; returns an unsubscribe function. */
  subscribe(listener: (change: StateChange) => void): () => void {
    return this.state.subscribe('', listener);
  }
}
