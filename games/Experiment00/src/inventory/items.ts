import type { ScopedState } from '../../../../src/index';

/**
 * The definition of one item the player can hold. The {@link Inventory} only
 * tracks `id → count`; this catalog attaches the things the UI needs — a
 * display name and an optional `message` shown as plain text in the detail
 * pane of the inventory's Items section.
 *
 * Definitions are authored in the editor on the interactable that grants the
 * item (`item_id`, `item_name`, and a `message` dialog), so the catalog is
 * filled at runtime as the player finds things.
 */
export interface ItemDefinition {
  /** Stable id, matching the object's `item_id` property. */
  id: string;
  /** Display name shown in the list (`item_name`). */
  name: string;
  /** Optional lore/description shown as plain text when the item is selected. */
  message?: string;
}

/** The persisted shape of one discovered item definition. */
interface StoredItem {
  [key: string]: string | null;
  name: string;
  message: string | null;
}

/** Root key under which discovered definitions are persisted. */
const STORE_KEY = 'defs';

/**
 * A registry of {@link ItemDefinition}s keyed by id. The inventory stores only
 * counts; this is the lookup the view uses to name an item and show its
 * message.
 *
 * Definitions discovered during play are persisted to an optional
 * {@link ScopedState}, so a found item keeps its authored name + message across
 * screen changes and reloads. Built-in {@link DEFAULT_ITEMS} act as fallbacks
 * and are never written.
 */
export class ItemCatalog {
  private readonly state?: ScopedState;
  private readonly discovered = new Map<string, ItemDefinition>();
  private readonly builtins = new Map<string, ItemDefinition>();

  constructor(builtins: ItemDefinition[] = [], state?: ScopedState) {
    for (const definition of builtins) {
      this.builtins.set(definition.id, definition);
    }
    this.state = state;
    this.hydrate();
  }

  /** Adds or replaces the definition for `definition.id` and persists it. */
  register(definition: ItemDefinition): void {
    const existing = this.discovered.get(definition.id) ?? this.builtins.get(definition.id);
    const stored: ItemDefinition = {
      id: definition.id,
      name: definition.name.trim() || definition.id,
      message: definition.message ?? existing?.message,
    };
    this.discovered.set(definition.id, stored);
    if (this.state) {
      const previous = this.state.get<Record<string, StoredItem>>(STORE_KEY) ?? {};
      this.state.set(STORE_KEY, {
        ...previous,
        [definition.id]: { name: stored.name, message: stored.message ?? null },
      });
    }
  }

  /** Whether a definition exists for `id` (discovered, or built in). */
  has(id: string): boolean {
    return this.discovered.has(id) || this.builtins.has(id);
  }

  /**
   * The definition for `id`, or a minimal fallback that names the id itself —
   * so a chest granting an undefined item still shows up in the bag.
   */
  get(id: string): ItemDefinition {
    return this.discovered.get(id) ?? this.builtins.get(id) ?? { id, name: id };
  }

  /** Loads discovered definitions persisted in the save. */
  private hydrate(): void {
    const raw = this.state?.get<Record<string, StoredItem>>(STORE_KEY);
    if (!raw) {
      return;
    }
    for (const [id, stored] of Object.entries(raw)) {
      if (stored && typeof stored === 'object') {
        this.discovered.set(id, {
          id,
          name: (stored.name ?? id).trim() || id,
          message: stored.message ?? undefined,
        });
      }
    }
  }
}

/**
 * The game's built-in fallback item definitions. Dynamic items authored in the
 * editor (via `item_id`/`item_name`) take precedence; these keep a few ids
 * legible even before anything is found.
 */
export const DEFAULT_ITEMS: ItemDefinition[] = [
  {
    id: 'gold_key',
    name: 'Gold Key',
    message: 'A small brass key, warm to the touch. It hums when held near the locked door.',
  },
  {
    id: 'rusty_nail',
    name: 'Rusty Nail',
    message: 'Bent and flaking. Whoever pulled it out of the wall did so in a hurry.',
  },
  {
    id: 'torn_photo',
    name: 'Torn Photograph',
    message: 'Two figures stand together. The half with her face has been carefully torn away.',
  },
  {
    id: 'pocket_watch',
    name: 'Pocket Watch',
    message: 'The hands are stopped at 3:07. The second hand twitches, but never moves forward.',
  },
  {
    id: 'dried_flower',
    name: 'Dried Flower',
    message: 'Pressed flat between two pages. It still smells faintly of the room it came from.',
  },
  {
    id: 'glass_eye',
    name: 'Glass Eye',
    message: 'It follows the light. When you look away, you feel it keep watching.',
  },
  {
    id: 'old_coin',
    name: 'Old Coin',
    message: 'The face on it is worn smooth. The other side shows a door, and nothing else.',
  },
  {
    id: 'candle_stub',
    name: 'Candle Stub',
    message: 'It has been lit many times. The wick is black but there is still wax to burn.',
  },
  {
    id: 'cracked_locket',
    name: 'Cracked Locket',
    message: 'The clasp is broken, but the tiny portrait inside survives. You do not recognize her.',
  },
  {
    id: 'folded_letter',
    name: 'Folded Letter',
    message: 'The seal was already broken. The first line reads: "If you are reading this, it worked."',
  },
];
