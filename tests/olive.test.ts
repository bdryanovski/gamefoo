/**
 * Contract: the Olive collectible remembers its picked state through the
 * engine StateStore, so a collected olive stays gone (no colliders) across
 * re-spawns, and exposes its optional `message` dialog reference.
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { Olive } from '../games/Experiment00/src/objects/olive';
import { MemoryBackend } from '../src/core/state/memory_backend';
import { StateStore } from '../src/core/state/state_store';
import type AssetManager from '../src/core/map/asset_manager';
import type { GameObjectDefinition, MapObjectContext } from '../src/core/map/types';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function oliveDef(): GameObjectDefinition {
  return {
    id: 'obj_olive',
    name: 'olive',
    sprites: [],
    animations: [],
    properties: {},
    grid: { cols: 1, rows: 1, cell: 16 },
    machine: {
      id: 'sm_olive',
      name: 'olive',
      states: [{ id: 'st_init', name: 'init', display: { kind: 'sprite', spriteId: null } }],
      transitions: [],
      initialStateId: 'st_init',
    },
    collisionsByState: {
      st_init: [
        {
          id: 'c_pickup',
          layerId: 'pickup',
          enabled: true,
          shape: { kind: 'circle', cx: 8, cy: 8, radius: 8 },
        },
      ],
    },
  };
}

function makeOlive(store: StateStore, opts: { id?: string; message?: string } = {}): Olive {
  Olive.useState(store.scope('olives'));
  const def = oliveDef();
  const properties: Record<string, string> = {};
  if (opts.id !== undefined) properties.id = opts.id;
  if (opts.message !== undefined) properties.message = opts.message;
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties,
    x: 0,
    y: 0,
    level: 2,
    startStateId: 'st_init',
  };
  const olive = new Olive(ctx);
  olive.onSpawn();
  return olive;
}

describe('Olive', () => {
  let store: StateStore;

  beforeEach(() => {
    store = new StateStore();
  });

  test('oliveId reads and trims the authored id property', () => {
    expect(makeOlive(store, { id: '18   ' }).oliveId).toBe('18');
    expect(makeOlive(store, {}).oliveId).toBe('');
  });

  test('dialogRef comes from the message property, else null', () => {
    expect(makeOlive(store, { id: '1', message: 'Base' }).dialogRef).toBe('Base');
    expect(makeOlive(store, { id: '1' }).dialogRef).toBeNull();
    expect(makeOlive(store, { id: '1', message: '   ' }).dialogRef).toBeNull();
  });

  test('a fresh olive is uncollected and carries its pickup collider', () => {
    const olive = makeOlive(store, { id: '1' });
    expect(olive.isCollected).toBe(false);
    expect(olive.worldColliders()).toHaveLength(1);
    expect(olive.worldColliders()[0]!.layer).toBe('pickup');
  });

  test('collect records the pickup and retires the olive from collision', () => {
    const olive = makeOlive(store, { id: '1' });
    expect(olive.collect()).toBe(true);
    expect(olive.isCollected).toBe(true);
    expect(olive.worldColliders()).toEqual([]);
    expect(store.get('olives.1')).toBe(true);
    // Idempotent — a second pickup is a no-op.
    expect(olive.collect()).toBe(false);
  });

  test('a collected olive stays gone when its screen re-spawns it', () => {
    makeOlive(store, { id: '7' }).collect();
    const respawned = makeOlive(store, { id: '7' });
    expect(respawned.isCollected).toBe(true);
    expect(respawned.worldColliders()).toEqual([]);
  });

  test('collected state survives a store reload from the same backend', () => {
    const backend = new MemoryBackend();
    const first = new StateStore({ backend, autoSave: true });
    makeOlive(first, { id: '3' }).collect();

    // A brand-new store hydrates the same backend — the olive is still gone.
    const reloaded = new StateStore({ backend });
    expect(makeOlive(reloaded, { id: '3' }).isCollected).toBe(true);
  });

  test('an olive without an id is not persisted', () => {
    makeOlive(store, {}).collect();
    expect(makeOlive(store, {}).isCollected).toBe(false);
  });
});
