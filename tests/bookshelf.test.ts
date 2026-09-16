/**
 * Contract: the Bookshelf demo class starts a dialog from the `message`
 * property, and — when it carries a meaningful `id` — is a movable secret
 * door that slides one tile (16px) right on {@link Bookshelf.slideOpen},
 * remembers it in the store, and re-spawns at the opened position.
 */
import { describe, expect, test } from 'vitest';
import { Bookshelf } from '../games/Experiment00/src/objects/bookshelf';
import { StateStore } from '../src/core/state/state_store';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext, Rect } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function shelfDef(): GameObjectDefinition {
  return {
    id: 'obj_shelf',
    name: 'shelf',
    sprites: [],
    animations: [],
    properties: { message: '0', id: '0' },
    grid: { cols: 1, rows: 1, cell: 16 },
    machine: {
      id: 'sm_shelf',
      name: 'shelf',
      states: [{ id: 'st_idle', name: 'idle', display: { kind: 'sprite', spriteId: null } }],
      transitions: [],
      initialStateId: 'st_idle',
    },
    collisionsByState: {},
  };
}

function makeShelf(
  opts: { message?: string; id?: string; x?: number; y?: number; store?: StateStore } = {},
): Bookshelf {
  Bookshelf.useState(opts.store ? opts.store.scope('shelves') : null);
  const def = shelfDef();
  const properties: Record<string, string> = {};
  if (opts.message !== undefined) properties.message = opts.message;
  if (opts.id !== undefined) properties.id = opts.id;
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties,
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    level: 0,
    startStateId: 'st_idle',
    // Persistence keys off the placement id; derive a stable one from the
    // authored id so two shelves with the same id share saved state.
    id: `plc_${opts.id ?? 'default'}`,
  };
  const shelf = new Bookshelf(ctx);
  shelf.onSpawn();
  return shelf;
}

describe('Bookshelf — dialog', () => {
  test('dialogRef is null when unset or left at the "0" default', () => {
    expect(makeShelf().dialogRef).toBeNull();
    expect(makeShelf({ message: '0' }).dialogRef).toBeNull();
    expect(makeShelf({ message: '  0  ' }).dialogRef).toBeNull();
    expect(makeShelf({ message: '   ' }).dialogRef).toBeNull();
  });

  test('dialogRef returns the trimmed reference when message is set', () => {
    expect(makeShelf({ message: 'Base' }).dialogRef).toBe('Base');
    expect(makeShelf({ message: ' msg_abc ' }).dialogRef).toBe('msg_abc');
    expect(makeShelf({ message: '2' }).dialogRef).toBe('2');
  });

  test('overlaps uses the footprint when no activation collider exists', () => {
    const shelf = makeShelf({ message: 'Base', x: 32, y: 32 });
    const inside: Rect = { x: 40, y: 40, width: 4, height: 4 };
    const outside: Rect = { x: 60, y: 60, width: 4, height: 4 };
    expect(shelf.overlaps(inside)).toBe(true);
    expect(shelf.overlaps(outside)).toBe(false);
  });
});

describe('Bookshelf — movable secret door', () => {
  test('movable is true only for a meaningful id property', () => {
    expect(makeShelf({ id: '100' }).movable).toBe(true);
    expect(makeShelf({ id: '0' }).movable).toBe(false);
    expect(makeShelf({}).movable).toBe(false);
  });

  test('slides one tile right, once, and remembers it', () => {
    const store = new StateStore();
    const shelf = makeShelf({ id: '100', x: 100, store });
    expect(shelf.isOpen).toBe(false);
    expect(shelf.slideOpen()).toBe(true);
    // 32 px/s * 0.5 s = 16 px → fully open in one step.
    shelf.update(0.5);
    expect(shelf.x).toBe(116);
    expect(shelf.isOpen).toBe(true);
    expect(store.get('shelves.plc_100')).toBe(true);
    expect(shelf.slideOpen()).toBe(false); // one-way
    shelf.update(0.5);
    expect(shelf.x).toBe(116); // no further movement
  });

  test('animates gradually rather than teleporting', () => {
    const shelf = makeShelf({ id: '100', x: 100, store: new StateStore() });
    shelf.slideOpen();
    shelf.update(0.25); // half the distance
    expect(shelf.x).toBeGreaterThan(100);
    expect(shelf.x).toBeLessThan(116);
  });

  test('an opened shelf re-spawns at its slid position', () => {
    const store = new StateStore();
    const first = makeShelf({ id: '100', x: 100, store });
    first.slideOpen();
    first.update(0.5);
    const respawned = makeShelf({ id: '100', x: 100, store });
    expect(respawned.isOpen).toBe(true);
    expect(respawned.x).toBe(116);
  });

  test('a non-movable shelf ignores slideOpen', () => {
    const shelf = makeShelf({ x: 100 });
    expect(shelf.slideOpen()).toBe(false);
    shelf.update(0.5);
    expect(shelf.x).toBe(100);
  });
});
