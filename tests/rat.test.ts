/**
 * Contract: the Rat critter senses the player through its authored `vision`
 * collider and flees directly away when the player is inside it, sliding
 * against the screen collision. Without a nearby player it wanders (and never
 * reports fleeing).
 */
import { describe, expect, test } from 'vitest';
import { Rat } from '../games/Experiment00/src/objects/rat';
import CollisionMap from '../src/core/map/collision_map';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext, Rect } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function ratDef(): GameObjectDefinition {
  return {
    id: 'obj_rat',
    name: 'rat',
    sprites: [],
    animations: [],
    properties: {},
    grid: { cols: 1, rows: 1, cell: 16 },
    machine: {
      id: 'sm_rat',
      name: 'rat',
      states: [
        { id: 'st_idle', name: 'Idle', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_up', name: 'Up', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_down', name: 'Down', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_left', name: 'Left', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_right', name: 'Right', display: { kind: 'sprite', spriteId: null } },
      ],
      transitions: [],
      initialStateId: 'st_idle',
    },
    collisionsByState: {
      st_idle: [
        {
          id: 'c_vision',
          layerId: 'vision',
          enabled: true,
          shape: { kind: 'circle', cx: 8, cy: 8, radius: 16 },
        },
      ],
    },
  };
}

/** A collision world whose whole floor is walkable and has no solids. */
function openFloor(): CollisionMap {
  const map = new CollisionMap(20, 16, 16);
  for (let r = 0; r < 16; r++) for (let c = 0; c < 20; c++) map.setWalkable(c, r);
  return map;
}

function makeRat(x: number, y: number): Rat {
  const def = ratDef();
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties: {},
    x,
    y,
    level: 0,
    startStateId: 'st_idle',
  };
  return new Rat(ctx);
}

describe('Rat', () => {
  test('fleeing is false with no sensed player', () => {
    expect(makeRat(100, 100).fleeing).toBe(false);
  });

  test('detects a player inside the vision collider', () => {
    const rat = makeRat(100, 100);
    const near: Rect = { x: 88, y: 100, width: 16, height: 16 };
    rat.sense(near, openFloor());
    expect(rat.fleeing).toBe(true);
  });

  test('ignores a player outside the vision collider', () => {
    const rat = makeRat(100, 100);
    const far: Rect = { x: 0, y: 0, width: 16, height: 16 };
    rat.sense(far, openFloor());
    expect(rat.fleeing).toBe(false);
  });

  test('flees directly away from the player and faces that way', () => {
    const rat = makeRat(100, 100);
    // Player just to the left → rat should bolt right.
    rat.sense({ x: 84, y: 100, width: 16, height: 16 }, openFloor());
    rat.update(0.5);
    expect(rat.box().x).toBeGreaterThan(100);
    expect(rat.state).toBe('st_right');
  });

  test('flees upward when the player is below', () => {
    const rat = makeRat(100, 100);
    rat.sense({ x: 100, y: 112, width: 16, height: 16 }, openFloor());
    rat.update(0.5);
    expect(rat.box().y).toBeLessThan(100);
    expect(rat.state).toBe('st_up');
  });
});
