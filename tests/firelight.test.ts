/**
 * Contract: Firelight (Campfire/Torch) derives its lit/unlit states from the
 * object's machine (initial state = lit) and its collider from the object
 * definition — no config file. Toggling flips the state and the solid box.
 */
import { describe, expect, test } from 'vitest';
import { Campfire } from '../games/Experiment00/src/objects/campfire';
import { Torch } from '../games/Experiment00/src/objects/torch';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function fireDef(name: string): GameObjectDefinition {
  return {
    id: `obj_${name}`,
    name,
    sprites: [],
    animations: [],
    properties: {},
    grid: { cols: 1, rows: 1, cell: 16 },
    machine: {
      id: `sm_${name}`,
      name,
      states: [
        { id: 'st_lit', name: 'init', display: { kind: 'sprite', spriteId: null } },
        { id: 'st_off', name: 'off', display: { kind: 'sprite', spriteId: null } },
      ],
      transitions: [],
      initialStateId: 'st_lit',
    },
    // Only the burning state authors a solid collider (the cold pit is passable).
    collisionsByState: {
      st_lit: [
        {
          id: 'c_solid',
          layerId: 'solid',
          enabled: true,
          shape: { kind: 'rect', x: 2, y: 2, width: 12, height: 12 },
        },
      ],
    },
  };
}

function makeCampfire(x = 100, y = 100): Campfire {
  const def = fireDef('campfire');
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties: {},
    x,
    y,
    level: 0,
    startStateId: 'st_lit',
  };
  return new Campfire(ctx);
}

describe('Firelight (Campfire)', () => {
  test('spawns lit (the machine initial state)', () => {
    expect(makeCampfire().lit).toBe(true);
  });

  test('toggle flips lit ⇄ unlit and back', () => {
    const fire = makeCampfire();
    expect(fire.toggle()).toBe(true);
    expect(fire.lit).toBe(false);
    expect(fire.state).toBe('st_off');
    expect(fire.toggle()).toBe(true);
    expect(fire.lit).toBe(true);
    expect(fire.state).toBe('st_lit');
  });

  test('extinguish and ignite are idempotent', () => {
    const fire = makeCampfire();
    expect(fire.extinguish()).toBe(true);
    expect(fire.extinguish()).toBe(false); // already out
    expect(fire.ignite()).toBe(true);
    expect(fire.ignite()).toBe(false); // already lit
  });

  test('collisionBox comes from the current state solid collider', () => {
    const fire = makeCampfire(100, 100);
    expect(fire.collisionBox).toEqual({ x: 102, y: 102, w: 12, h: 12 });
    expect(fire.hitTest(108, 108)).toBe(true);
    expect(fire.hitTest(50, 50)).toBe(false);
    fire.extinguish(); // cold pit authors no solid
    expect(fire.collisionBox).toEqual({ x: 100, y: 100, w: 0, h: 0 });
  });
});

describe('Torch', () => {
  test('constructs without a config file and spawns lit', () => {
    const def = fireDef('torch');
    const torch = new Torch({
      assets,
      machine: def.machine,
      def,
      properties: {},
      x: 0,
      y: 0,
      level: 0,
      startStateId: 'st_lit',
    });
    expect(torch.lit).toBe(true);
    expect(torch.toggle()).toBe(true);
    expect(torch.lit).toBe(false);
  });
});
