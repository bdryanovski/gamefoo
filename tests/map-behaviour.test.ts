/**
 * Contract: MapObjectBehaviour attachment (phase 6a/6b).
 *
 * A hand-built {@link MapObject} attaches behaviours, ticks them in priority
 * order (skipping disabled ones), and detaches them with lifecycle hooks. An
 * authored `behaviours` list resolves through a registry on activation;
 * unknown names warn and are skipped.
 */
import { describe, expect, test } from 'vite-plus/test';
import {
  MapObject,
  MapObjectBehaviour,
  MapObjectBehaviourRegistry,
  type GameObjectDefinition,
  type MapObjectContext,
} from '../src/index';
import type AssetManager from '../src/core/map/asset_manager';

const assets = { frame: () => undefined, clip: () => undefined } as unknown as AssetManager;

function makeDef(): GameObjectDefinition {
  return {
    id: 'obj_probe',
    name: 'probe',
    sprites: [],
    animations: [],
    properties: {},
    machine: {
      id: 'sm_probe',
      name: 'probe',
      states: [{ id: 'st_idle', name: 'idle', display: { kind: 'sprite', spriteId: null } }],
      transitions: [],
      initialStateId: 'st_idle',
    },
  };
}

function makeObject(extra: Partial<MapObjectContext> = {}): MapObject {
  const def = makeDef();
  return new MapObject({
    assets,
    machine: def.machine,
    def,
    properties: {},
    x: 0,
    y: 0,
    level: 0,
    ...extra,
  });
}

class Stub extends MapObjectBehaviour {
  readonly type: string;
  readonly log: string[];
  attached = 0;
  detached = 0;

  constructor(owner: MapObject, type: string, priority: number, log: string[]) {
    super(owner);
    this.type = type;
    this.priority = priority;
    this.log = log;
  }

  override update(): void {
    this.log.push(this.type);
  }

  override onAttach(): void {
    this.attached += 1;
  }

  override onDetach(): void {
    this.detached += 1;
  }
}

describe('MapObject behaviours — attachment + ticking', () => {
  test('ticks enabled behaviours in priority order, skipping disabled', () => {
    const log: string[] = [];
    const obj = makeObject();
    const b = obj.attachBehaviour(new Stub(obj, 'b', 5, log));
    const a = obj.attachBehaviour(new Stub(obj, 'a', 1, log));
    const c = obj.attachBehaviour(new Stub(obj, 'c', 3, log));
    c.enabled = false;

    obj.updateBehaviours(0.1);

    expect(log).toEqual(['a', 'b']);
  });

  test('fires onAttach on attach and onDetach on detach', () => {
    const obj = makeObject();
    const stub = obj.attachBehaviour(new Stub(obj, 'x', 1, []));
    expect(stub.attached).toBe(1);
    expect(obj.hasBehaviour('x')).toBe(true);

    obj.detachBehaviour('x');
    expect(stub.detached).toBe(1);
    expect(obj.hasBehaviour('x')).toBe(false);
  });

  test('getBehaviour / getBehavioursByType resolve attached behaviours', () => {
    const obj = makeObject();
    const stub = obj.attachBehaviour(new Stub(obj, 'probe', 1, []));
    expect(obj.getBehaviour<Stub>('probe')).toBe(stub);
    expect(obj.getBehavioursByType(Stub)).toContain(stub);
  });

  test('detachBehaviours removes and detaches every behaviour', () => {
    const obj = makeObject();
    const a = obj.attachBehaviour(new Stub(obj, 'a', 1, []));
    const b = obj.attachBehaviour(new Stub(obj, 'b', 2, []));
    obj.detachBehaviours();
    expect(a.detached).toBe(1);
    expect(b.detached).toBe(1);
    expect(obj.getBehavioursByType(Stub)).toEqual([]);
  });
});

describe('MapObject behaviours — authored resolution (6b)', () => {
  test('resolves and attaches authored behaviours via the registry', () => {
    const registry = new MapObjectBehaviourRegistry();
    registry.register('stub-a', (owner) => new Stub(owner, 'stub-a', 1, []));
    registry.register('stub-b', (owner) => new Stub(owner, 'stub-b', 2, []));

    const obj = makeObject({ behaviours: ['stub-a', 'stub-b'] });
    obj.attachAuthoredBehaviours(registry);

    expect(obj.hasBehaviour('stub-a')).toBe(true);
    expect(obj.hasBehaviour('stub-b')).toBe(true);
  });

  test('unknown names are skipped without throwing', () => {
    const obj = makeObject({ behaviours: ['no-such-behaviour'] });
    expect(() => obj.attachAuthoredBehaviours(new MapObjectBehaviourRegistry())).not.toThrow();
    expect(obj.getBehavioursByType(Stub)).toEqual([]);
  });

  test('re-entry re-attaches cleanly with no leaked state', () => {
    const registry = new MapObjectBehaviourRegistry();
    registry.register('stub', (owner) => new Stub(owner, 'stub', 1, []));
    const obj = makeObject({ behaviours: ['stub'] });

    obj.attachAuthoredBehaviours(registry);
    const first = obj.getBehaviour<Stub>('stub');
    obj.detachBehaviours();
    expect(first?.detached).toBe(1);

    obj.attachAuthoredBehaviours(registry);
    const second = obj.getBehaviour<Stub>('stub');
    expect(second).not.toBe(first);
    expect(second?.attached).toBe(1);
  });
});
