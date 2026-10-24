import type { ScopedState, StateChange } from '../../../../src/index';

/** How many journal slots the book holds. */
export const JOURNAL_POOL_SIZE = 20;

/**
 * One slot in the journal book. A slot is either still sealed (showing
 * {@link JournalEntry.encrypted} noise) or found — in which case it shows the
 * authored {@link JournalEntry.title} and the readable
 * {@link JournalEntry.body} resolved from its dialog.
 */
export interface JournalEntry {
  /** 1-based slot number in the book. */
  slot: number;
  /** Whether this slot has been found. */
  found: boolean;
  /** The found entry's id (`journal_id`), or `''` while sealed. */
  id: string;
  /** The found entry's display name (`journal_name`), or `''` while sealed. */
  title: string;
  /** The readable lines shown once found. */
  body: string[];
  /** Random-character noise shown while sealed. */
  encrypted: string[];
}

/** A discovered entry as persisted in the save. */
interface StoredEntry {
  [key: string]: string | number | string[];
  name: string;
  body: string[];
  slot: number;
}

/** Root key under which discovered entries are persisted. */
const STORE_KEY = 'entries';

/** The alphabet the sealed-slot noise is drawn from. */
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+-=<>/|~^?';

/** How many random-character lines a sealed slot shows. */
const ENCRYPTED_LINE_COUNT = 20;

/** Small, fast, deterministic PRNG so sealed-slot noise is stable per slot. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One line of random-character noise, grouped so it reads as a cypher. */
function noiseLine(rand: () => number): string {
  const groups: string[] = [];
  for (let g = 0; g < 2; g++) {
    let chunk = '';
    for (let c = 0; c < 10; c++) {
      chunk += GLYPHS[Math.floor(rand() * GLYPHS.length)];
    }
    groups.push(chunk);
  }
  return groups.join(' ');
}

/** Builds the sealed noise for a 1-based slot, stable across loads. */
function crypticLines(slot: number): string[] {
  const rand = mulberry32(slot * 2654435761 + 7);
  return Array.from({ length: ENCRYPTED_LINE_COUNT }, () => noiseLine(rand));
}

/**
 * Tracks which journal slots the player has found, backed by a
 * {@link ScopedState} so the found set persists with the save. The book always
 * has {@link JOURNAL_POOL_SIZE} slots; entries are discovered in any order via
 * {@link Journal.discover}, and their readable text is resolved by the game
 * from the object's dialog.
 *
 * @example
 * ```ts
 * const journal = new Journal(save.scope('journal'));
 * journal.discover('4', 'The Long Hall', ['I counted the doors twice...']);
 * journal.foundCount(); // 1
 * ```
 */
export class Journal {
  private readonly state?: ScopedState;
  private readonly slots: Array<{ id: string; name: string; body: string[] } | null>;

  constructor(state?: ScopedState, poolSize: number = JOURNAL_POOL_SIZE) {
    this.state = state;
    this.slots = Array.from({ length: poolSize }, () => null);
    this.hydrate();
  }

  /** Every slot in the book, found or sealed, in slot order. */
  entries(): JournalEntry[] {
    return this.slots.map((slot, index) => {
      const ordinal = index + 1;
      if (slot === null) {
        return {
          slot: ordinal,
          found: false,
          id: '',
          title: '',
          body: [],
          encrypted: crypticLines(ordinal),
        };
      }
      return {
        slot: ordinal,
        found: true,
        id: slot.id,
        title: slot.name,
        body: slot.body,
        encrypted: crypticLines(ordinal),
      };
    });
  }

  /** How many slots the book has. */
  get total(): number {
    return this.slots.length;
  }

  /** The found entry with `id`, or `undefined`. */
  get(id: string): JournalEntry | undefined {
    return this.entries().find((entry) => entry.found && entry.id === id);
  }

  /** Whether entry `id` has been found. */
  has(id: string): boolean {
    return this.slots.some((slot) => slot?.id === id);
  }

  /** How many entries have been found. */
  foundCount(): number {
    return this.slots.filter((slot) => slot !== null).length;
  }

  /** The entries that have been found, in slot order. */
  found(): JournalEntry[] {
    return this.entries().filter((entry) => entry.found);
  }

  /**
   * Records a found entry: assigns it a slot (a numeric `id` claims its
   * matching slot, otherwise the next free one) and persists it. Returns
   * `true` only the first time, so callers can fire a one-time effect. A full
   * book ignores the entry.
   */
  discover(id: string, name: string, body: string[]): boolean {
    if (id === '' || this.has(id)) {
      return false;
    }
    const slot = this.claimSlot(id);
    if (slot < 0) {
      return false;
    }
    this.slots[slot] = { id, name: name.trim() || id, body };
    if (this.state) {
      const previous = this.state.get<Record<string, StoredEntry>>(STORE_KEY) ?? {};
      this.state.set(STORE_KEY, {
        ...previous,
        [id]: { name: name.trim() || id, body, slot },
      });
    }
    return true;
  }

  /** Subscribes to any found-set change; returns an unsubscribe function. */
  subscribe(listener: (change: StateChange) => void): (() => void) | undefined {
    return this.state?.subscribe('', listener);
  }

  /** Picks the slot a new entry should occupy, or `-1` when none is free. */
  private claimSlot(id: string): number {
    const preferred = Number(id);
    if (Number.isInteger(preferred) && preferred >= 1 && preferred <= this.slots.length) {
      if (this.slots[preferred - 1] === null) {
        return preferred - 1;
      }
    }
    return this.slots.findIndex((slot) => slot === null);
  }

  /** Loads discovered entries persisted in the save back into their slots. */
  private hydrate(): void {
    const raw = this.state?.get<Record<string, StoredEntry>>(STORE_KEY);
    if (!raw) {
      return;
    }
    for (const [id, stored] of Object.entries(raw)) {
      if (!stored || typeof stored !== 'object') {
        continue;
      }
      const storedSlot = typeof stored.slot === 'number' ? stored.slot : -1;
      const target =
        storedSlot >= 0 && storedSlot < this.slots.length && this.slots[storedSlot] === null
          ? storedSlot
          : this.slotFor(id);
      if (target < 0) {
        continue;
      }
      this.slots[target] = {
        id,
        name: (stored.name || id).trim() || id,
        body: Array.isArray(stored.body) ? stored.body : [],
      };
    }
  }

  /** The slot `id` should hydrate into: its numeric slot, else the next free. */
  private slotFor(id: string): number {
    const numeric = Number(id);
    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= this.slots.length) {
      if (this.slots[numeric - 1] === null) {
        return numeric - 1;
      }
    }
    return this.slots.findIndex((slot) => slot === null);
  }
}
