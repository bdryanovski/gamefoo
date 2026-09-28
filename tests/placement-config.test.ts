/**
 * Contract: a machine placement can override its object prefab's config.
 *
 * `stateName` picks the state the instance spawns in; `properties` are merged
 * over the object def's `properties` (the placement wins). This is how one
 * prefab (e.g. a `portal`) drives many differently-configured instances.
 */
import { describe, expect, test } from 'vitest';
import type AssetManager from '../src/core/map/asset_manager';
import MapObject from '../src/core/map/map_object';
import MapObjectRegistry from '../src/core/map/map_object_registry';
import Screen from '../src/core/map/screen';
import type { GameObjectDefinition, MapData, Placement, ScreenData } from '../src/core/map/types';

class Probe extends MapObject {
  static override readonly type = 'portal';
  get props(): Record<string, string> {
    return this.properties;
  }
}

const portalDef: GameObjectDefinition = {
  id: 'obj_portal',
  name: 'portal',
  sprites: [],
  animations: [],
  properties: { targetScreen: '0,0', open: 'false' },
  machine: {
    id: 'sm_portal',
    name: 'portal',
    states: [
      { id: 'st_closed', name: 'portal-close', display: { kind: 'sprite', spriteId: null } },
      { id: 'st_open', name: 'portal-open', display: { kind: 'sprite', spriteId: null } },
    ],
    transitions: [],
    initialStateId: 'st_closed',
  },
};

const assets = {
  frame: () => undefined,
  spriteCollisions: () => undefined,
  clip: () => undefined,
  objectByMachine: (id: string) => (id === 'sm_portal' ? portalDef : undefined),
} as unknown as AssetManager;

const map: MapData = {
  blockSize: 16,
  screenCols: 2,
  screenRows: 2,
  defaultSpriteId: null,
  screens: {},
};

function spawnPortal(placement: Partial<Placement>): Probe {
  const full = {
    id: 'p',
    kind: 'machine',
    machineId: 'sm_portal',
    x: 0,
    y: 0,
    level: 0,
    ...placement,
  } as Placement;
  const data: ScreenData = { x: 0, y: 0, placements: [full] };
  const registry = new MapObjectRegistry();
  registry.register(Probe);
  const screen = new Screen({ data, assets, map, registry });
  screen.activate();
  return screen.objectsByType(Probe)[0]!;
}

describe('machine placement configuration', () => {
  test('inherits the object def properties when the placement sets none', () => {
    const portal = spawnPortal({});
    expect(portal.props).toEqual({ targetScreen: '0,0', open: 'false' });
  });

  test('merges per-placement properties over the def (placement wins)', () => {
    const portal = spawnPortal({ properties: { targetScreen: '1,3', open: 'true' } });
    expect(portal.props).toEqual({ targetScreen: '1,3', open: 'true' });
  });

  test('keeps un-overridden def keys while overriding others', () => {
    const portal = spawnPortal({ properties: { targetScreen: '2,5' } });
    expect(portal.props).toEqual({ targetScreen: '2,5', open: 'false' });
  });

  test('spawns in the state named by the placement', () => {
    expect(spawnPortal({}).state).toBe('st_closed');
    expect(spawnPortal({ stateName: 'portal-open' }).state).toBe('st_open');
  });
});
