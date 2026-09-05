/**
 * Contract: the Bookshelf demo class starts a dialog from the placed shelf's
 * `message` property. The `"0"` default (and unset) means "no dialog" — the
 * shelf is inert; any other value is a dialog reference.
 */
import { describe, expect, test } from 'vitest';
import { Bookshelf } from '../games/Experiment00/src/objects/bookshelf';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext, Rect } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function shelfDef(): GameObjectDefinition {
  return {
    id: 'obj_shelf',
    name: 'shelf',
    sprites: [],
    animations: [],
    properties: { message: '0' },
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

function makeShelf(message?: string, x = 0, y = 0): Bookshelf {
  const def = shelfDef();
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties: message !== undefined ? { message } : {},
    x,
    y,
    level: 0,
    startStateId: 'st_idle',
  };
  return new Bookshelf(ctx);
}

describe('Bookshelf', () => {
  test('dialogRef is null when unset or left at the "0" default', () => {
    expect(makeShelf().dialogRef).toBeNull();
    expect(makeShelf('0').dialogRef).toBeNull();
    expect(makeShelf('  0  ').dialogRef).toBeNull();
    expect(makeShelf('   ').dialogRef).toBeNull();
  });

  test('dialogRef returns the trimmed reference when message is set', () => {
    expect(makeShelf('Base').dialogRef).toBe('Base');
    expect(makeShelf(' msg_abc ').dialogRef).toBe('msg_abc');
    expect(makeShelf('2').dialogRef).toBe('2');
  });

  test('overlaps uses the footprint when no activation collider exists', () => {
    const shelf = makeShelf('Base', 32, 32);
    const inside: Rect = { x: 40, y: 40, width: 4, height: 4 };
    const outside: Rect = { x: 60, y: 60, width: 4, height: 4 };
    expect(shelf.overlaps(inside)).toBe(true);
    expect(shelf.overlaps(outside)).toBe(false);
  });
});
