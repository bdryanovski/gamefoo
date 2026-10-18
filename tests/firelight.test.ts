/**
 * Contract: the {@link LightSource} behavior derives its lit/unlit states from
 * the owner's machine (initial state = lit) and its collider from the owner's
 * definition — no config file. Toggling flips the state and the solid box.
 */
import { describe, expect, test } from 'vite-plus/test';
import { Campfire } from '../games/Experiment00/src/objects/campfire';
import { Torch } from '../games/Experiment00/src/objects/torch';
import { LightSource } from '../games/Experiment00/src/behaviors/light_source';
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

function context(name: string, x: number, y: number): MapObjectContext {
  const def = fireDef(name);
  return {
    assets,
    machine: def.machine,
    def,
    properties: {},
    x,
    y,
    level: 0,
    startStateId: 'st_lit',
  };
}

function makeCampfire(x = 100, y = 100): { fire: Campfire; light: LightSource } {
  const fire = new Campfire({ ...fireCtx(x, y) });
  fire.onSpawn();
  const light = fire.getBehaviour<LightSource>('light-source');
  if (!light) throw new Error('LightSource behavior not attached');
  return { fire, light };
}

function fireCtx(x: number, y: number): MapObjectContext {
  const def = fireDef('campfire');
  return { assets, machine: def.machine, def, properties: {}, x, y, level: 0, startStateId: 'st_lit' };
}

describe('LightSource (Campfire)', () => {
  test('spawns lit (the machine initial state)', () => {
    expect(makeCampfire().light.lit).toBe(true);
  });

  test('toggle flips lit ⇄ unlit and back', () => {
    const { fire, light } = makeCampfire();
    expect(light.toggle()).toBe(true);
    expect(light.lit).toBe(false);
    expect(fire.state).toBe('st_off');
    expect(light.toggle()).toBe(true);
    expect(light.lit).toBe(true);
    expect(fire.state).toBe('st_lit');
  });

  test('extinguish and ignite are idempotent', () => {
    const { light } = makeCampfire();
    expect(light.extinguish()).toBe(true);
    expect(light.extinguish()).toBe(false); // already out
    expect(light.ignite()).toBe(true);
    expect(light.ignite()).toBe(false); // already lit
  });

  test('collisionBox comes from the current state solid collider', () => {
    const { light } = makeCampfire(100, 100);
    expect(light.collisionBox).toEqual({ x: 102, y: 102, w: 12, h: 12 });
    light.extinguish(); // cold pit authors no solid
    expect(light.collisionBox).toEqual({ x: 100, y: 100, w: 0, h: 0 });
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
    torch.onSpawn();
    const light = torch.getBehaviour<LightSource>('light-source')!;
    expect(light.lit).toBe(true);
    expect(light.toggle()).toBe(true);
    expect(light.lit).toBe(false);
  });
});
