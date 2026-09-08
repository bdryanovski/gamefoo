/**
 * Contract: the Portal demo class reads its open/target/trigger from the
 * placed object's state + properties, so map-authored data drives travel.
 */
import { describe, expect, test } from 'vitest';
import { Portal } from '../games/Experiment00/src/objects/portal';
import { StateStore } from '../src/core/state/state_store';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function portalDef(withActivation = true): GameObjectDefinition {
  return {
    id: 'obj_portal',
    name: 'portal',
    sprites: [],
    animations: [],
    properties: {},
    machine: {
      id: 'sm_portal',
      name: 'portal',
      states: [
        { id: 'st_open', name: 'top-open', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_close', name: 'top-close', display: { kind: 'sprite', spriteId: null } },
      ],
      transitions: [],
      initialStateId: 'st_open',
    },
    collisionsByState: withActivation
      ? {
          st_open: [
            {
              id: 'c1',
              layerId: 'activation',
              enabled: true,
              shape: { kind: 'rect', x: 0, y: 0, width: 16, height: 16 },
            },
          ],
        }
      : {},
  };
}

function makePortal(opts: {
  stateId?: string;
  targetScreen?: string;
  spawn?: string;
  x?: number;
  y?: number;
  activation?: boolean;
}): Portal {
  const def = portalDef(opts.activation ?? true);
  const properties: Record<string, string> = {};
  if (opts.targetScreen !== undefined) properties.targetScreen = opts.targetScreen;
  if (opts.spawn !== undefined) properties.spawn = opts.spawn;
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties,
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    level: 0,
    startStateId: opts.stateId ?? 'st_open',
  };
  return new Portal(ctx);
}

describe('Portal', () => {
  test('isOpen follows the current state name', () => {
    expect(makePortal({ stateId: 'st_open' }).isOpen).toBe(true);
    expect(makePortal({ stateId: 'st_close' }).isOpen).toBe(false);
  });

  test('target parses the "x,y" targetScreen property', () => {
    expect(makePortal({ targetScreen: '1,3' }).target).toEqual({ x: 1, y: 3 });
    expect(makePortal({ targetScreen: ' 2 , 5 ' }).target).toEqual({ x: 2, y: 5 });
  });

  test('target is null when unset or malformed', () => {
    expect(makePortal({}).target).toBeNull();
    expect(makePortal({ targetScreen: 'nope' }).target).toBeNull();
    expect(makePortal({ targetScreen: '1,2,3' }).target).toBeNull();
  });

  test('spawn parses the "col,row" spawn property as grid cells', () => {
    expect(makePortal({ spawn: '3,10' }).spawn).toEqual({ col: 3, row: 10 });
    expect(makePortal({ spawn: ' 1 , 15 ' }).spawn).toEqual({ col: 1, row: 15 });
  });

  test('spawn is null when unset, malformed, or the "0,0" default sentinel', () => {
    expect(makePortal({}).spawn).toBeNull();
    expect(makePortal({ spawn: '0,0' }).spawn).toBeNull();
    expect(makePortal({ spawn: 'nope' }).spawn).toBeNull();
    expect(makePortal({ spawn: '1,2,3' }).spawn).toBeNull();
  });

  test('activationBox uses the activation collider in world space', () => {
    expect(makePortal({ x: 100, y: 50 }).activationBox()).toEqual({
      x: 100,
      y: 50,
      width: 16,
      height: 16,
    });
  });

  test('activationBox falls back to the footprint with no activation collider', () => {
    const box = makePortal({ x: 30, y: 40, activation: false }).activationBox();
    expect(box).toMatchObject({ x: 30, y: 40 });
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('overlaps detects a box inside vs outside the activation zone', () => {
    const p = makePortal({ x: 100, y: 100 });
    expect(p.overlaps({ x: 108, y: 108, width: 16, height: 16 })).toBe(true);
    expect(p.overlaps({ x: 200, y: 200, width: 16, height: 16 })).toBe(false);
  });

  test('open() transitions a closed portal to its open state (idempotent)', () => {
    const p = makePortal({ stateId: 'st_close' });
    expect(p.isOpen).toBe(false);
    expect(p.open()).toBe(true);
    expect(p.isOpen).toBe(true);
    expect(p.state).toBe('st_open');
    expect(p.open()).toBe(false); // already open
  });
});

function makeDoor(store: StateStore, opts: { id?: string } = {}): Portal {
  Portal.useState(store.scope('doors'));
  const def = portalDef(true);
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties: {},
    x: 0,
    y: 0,
    level: 0,
    startStateId: 'st_open', // authored open — onSpawn must force it closed
    id: opts.id ?? 'door_1',
  };
  const portal = new Portal(ctx);
  portal.onSpawn();
  return portal;
}

describe('Portal — door (sound-gated, persistent)', () => {
  test('a door starts closed even when authored open', () => {
    expect(makeDoor(new StateStore()).isOpen).toBe(false);
  });

  test('open() opens the door and remembers it', () => {
    const store = new StateStore();
    const door = makeDoor(store, { id: 'd1' });
    expect(door.isOpen).toBe(false);
    expect(door.open()).toBe(true);
    expect(door.isOpen).toBe(true);
    expect(store.get('doors.d1')).toBe(true);
  });

  test('a remembered-open door re-spawns open (silently, no sound needed)', () => {
    const store = new StateStore();
    makeDoor(store, { id: 'd1' }).open();
    expect(makeDoor(store, { id: 'd1' }).isOpen).toBe(true);
  });

  test('beginOpening flags the opening state; open() clears it', () => {
    const door = makeDoor(new StateStore(), { id: 'd1' });
    door.beginOpening();
    expect(door.isOpening).toBe(true);
    door.open();
    expect(door.isOpening).toBe(false);
    expect(door.isOpen).toBe(true);
    // Opening an already-open door does not re-arm the flag.
    door.beginOpening();
    expect(door.isOpening).toBe(false);
  });
});
