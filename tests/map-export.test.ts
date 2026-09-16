/**
 * Contract: map export carries per-placement state + property overrides.
 *
 * `exportMap` must emit a machine placement's `stateName` and `properties`
 * when set, and omit them when empty — this is the editor→runtime hand-off the
 * engine's Screen consumes.
 */
import { describe, expect, test } from 'vitest';
import type { AppState } from '../tools/src/types';
import { exportMap } from '../tools/src/map/mapExport';

function makeState(): AppState {
  return {
    projectName: 'T',
    images: [],
    sprites: [],
    animations: [],
    objects: [],
    map: {
      blockSize: 16,
      screenCols: 20,
      screenRows: 16,
      defaultSpriteId: null,
      layers: [{ name: 'base', visible: true }],
      activeLevel: 0,
      screens: {
        '0,0': {
          x: 0,
          y: 0,
          defaultSpriteId: null,
          placements: [
            {
              id: 'a',
              kind: 'machine',
              machineId: 'm1',
              stateName: 'portal-open',
              properties: { targetScreen: '1,3' },
              x: 16,
              y: 32,
              level: 0,
            },
            { id: 'b', kind: 'machine', machineId: 'm1', properties: {}, x: 0, y: 0, level: 0 },
          ],
        },
      },
    },
  } as unknown as AppState;
}

describe('exportMap per-placement config', () => {
  const out = exportMap(makeState());
  const placements = (out.screens as Record<string, { placements: Record<string, unknown>[] }>)[
    '0,0'
  ]!.placements;

  test('emits stateName and properties when set', () => {
    expect(placements[0]).toMatchObject({
      kind: 'machine',
      machineId: 'm1',
      stateName: 'portal-open',
      properties: { targetScreen: '1,3' },
      x: 16,
      y: 32,
      level: 0,
    });
  });

  test('omits stateName and empty properties', () => {
    expect(placements[1]!.stateName).toBeUndefined();
    expect(placements[1]!.properties).toBeUndefined();
  });
});
