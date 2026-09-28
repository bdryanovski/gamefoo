/**
 * Contract: the Chest demo class opens once (one-way), remembers it through
 * the engine StateStore keyed by the placement id, exposes its `message`
 * dialog + `item` payload, and drops its solid collider when open.
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { Chest } from '../games/Experiment00/src/objects/chest';
import { Inventory } from '../games/Experiment00/src/inventory';
import { StateStore } from '../src/core/state/state_store';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function chestDef(): GameObjectDefinition {
  return {
    id: 'obj_chest',
    name: 'chest',
    sprites: [],
    animations: [],
    properties: {},
    grid: { cols: 1, rows: 1, cell: 16 },
    machine: {
      id: 'sm_chest',
      name: 'chest',
      states: [
        { id: 'st_init', name: 'init', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_open', name: 'open', display: { kind: 'sprite', spriteId: null } },
      ],
      transitions: [],
      initialStateId: 'st_init',
    },
    collisionsByState: {
      st_init: [
        {
          id: 'c_solid',
          layerId: 'solid',
          enabled: true,
          shape: { kind: 'rect', x: 0, y: 4, width: 16, height: 8 },
        },
        {
          id: 'c_act',
          layerId: 'activation',
          enabled: true,
          shape: { kind: 'circle', cx: 8, cy: 8, radius: 8 },
        },
      ],
      // The open state authors no colliders.
    },
  };
}

function makeChest(
  store: StateStore,
  opts: { id?: string; message?: string; item?: string } = {},
): Chest {
  Chest.useState(store.scope('chests'));
  const def = chestDef();
  const properties: Record<string, string> = {};
  if (opts.message !== undefined) properties.message = opts.message;
  if (opts.item !== undefined) properties.item = opts.item;
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties,
    x: 0,
    y: 0,
    level: 2,
    startStateId: 'st_init',
    id: opts.id ?? 'chest_1',
  };
  const chest = new Chest(ctx);
  chest.onSpawn();
  return chest;
}

describe('Chest', () => {
  let store: StateStore;

  beforeEach(() => {
    store = new StateStore();
  });

  test('MapObject.id comes from the placement id in the context', () => {
    expect(makeChest(store, { id: 'chest_42' }).id).toBe('chest_42');
  });

  test('open() is one-way: opens once, records it, then is a no-op', () => {
    const chest = makeChest(store, { id: 'c1' });
    expect(chest.isOpen).toBe(false);
    expect(chest.open()).toBe(true);
    expect(chest.isOpen).toBe(true);
    expect(store.get('chests.c1')).toBe(true);
    expect(chest.open()).toBe(false);
  });

  test('an open chest keeps its solid collider so it still blocks', () => {
    const chest = makeChest(store, { id: 'c1' });
    expect(chest.worldColliders().some((c) => c.layer === 'solid')).toBe(true);
    chest.open();
    expect(chest.isOpen).toBe(true);
    expect(chest.worldColliders().some((c) => c.layer === 'solid')).toBe(true);
  });

  test('dialogRef and item read their properties, treating "0"/empty as unset', () => {
    expect(makeChest(store, { id: 'a', message: 'msg_x', item: 'gold_key' }).dialogRef).toBe(
      'msg_x',
    );
    expect(makeChest(store, { id: 'b', message: 'msg_x', item: 'gold_key' }).item).toBe('gold_key');
    const empty = makeChest(store, { id: 'c', message: '0', item: '0' });
    expect(empty.dialogRef).toBeNull();
    expect(empty.item).toBeNull();
    const absent = makeChest(store, { id: 'd' });
    expect(absent.dialogRef).toBeNull();
    expect(absent.item).toBeNull();
  });

  test('overlaps detects a box inside vs outside the activation zone', () => {
    const chest = makeChest(store, { id: 'c1' });
    expect(chest.overlaps({ x: 6, y: 6, width: 4, height: 4 })).toBe(true);
    expect(chest.overlaps({ x: 40, y: 40, width: 4, height: 4 })).toBe(false);
  });
});

describe('Inventory', () => {
  test('add accumulates counts and grants items from chests', () => {
    const store = new StateStore();
    const bag = new Inventory(store.scope('inventory'));
    const chest = makeChest(store, { id: 'c1', item: 'gold_key' });

    // Simulate the game granting the chest's item on open.
    chest.open();
    bag.add(chest.item ?? '');
    bag.add('coin', 3);

    expect(bag.has('gold_key')).toBe(true);
    expect(bag.count('coin')).toBe(3);
    expect(bag.items()).toEqual([
      { id: 'gold_key', count: 1 },
      { id: 'coin', count: 3 },
    ]);
    expect(store.get('inventory.gold_key')).toBe(1);
  });

  test('add ignores an empty id or non-positive quantity', () => {
    const store = new StateStore();
    const bag = new Inventory(store.scope('inventory'));
    bag.add('');
    bag.add('coin', 0);
    expect(bag.items()).toEqual([]);
  });
});
