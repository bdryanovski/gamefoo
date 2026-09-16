/**
 * Contract: loading/importing a project must preserve per-placement
 * `properties` overrides. `migrateMapState` normalizes persisted map data on
 * every load; if it drops overrides, placed instances silently revert to the
 * object def's defaults (the "portal properties reset to 0,0" bug).
 */
import { describe, expect, test } from 'vitest';
import { migrateMapState } from '../tools/src/map/types';
import type { MachinePlacement } from '../tools/src/map/types';

function migrateOne(placement: Record<string, unknown>): MachinePlacement {
  const out = migrateMapState({
    screens: { '0,0': { x: 0, y: 0, placements: [placement] } },
  });
  return out.screens['0,0']!.placements[0] as MachinePlacement;
}

describe('migrateMapState placement properties', () => {
  test('preserves per-placement property overrides through a load round-trip', () => {
    const p = migrateOne({
      id: 'pl_portal',
      kind: 'machine',
      machineId: 'sm_portal',
      stateName: 'closed',
      properties: { targetScreen: '1,3', open: 'true' },
      x: 5,
      y: 6,
      level: 0,
    });
    expect(p.properties).toEqual({ targetScreen: '1,3', open: 'true' });
    expect(p.stateName).toBe('closed');
    expect(p.x).toBe(5);
    expect(p.y).toBe(6);
  });

  test('omits properties entirely when the placement has no overrides', () => {
    const p = migrateOne({
      id: 'pl_plain',
      kind: 'machine',
      machineId: 'sm_portal',
      x: 0,
      y: 0,
      level: 0,
    });
    expect(p.properties).toBeUndefined();
  });

  test('drops non-string property values but keeps valid ones', () => {
    const p = migrateOne({
      id: 'pl_mixed',
      kind: 'machine',
      machineId: 'sm_portal',
      properties: { good: 'yes', bad: 42 },
      x: 0,
      y: 0,
      level: 0,
    });
    expect(p.properties).toEqual({ good: 'yes' });
  });
});
