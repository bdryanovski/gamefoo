/**
 * Contract: a MapObject renders every visible cell of its current state's
 * composition (all layers, bottom→top) at each cell's grid offset — so a
 * layered state like a portal's `base` + `door` draws in full, not just its
 * single representative sprite.
 */
import { describe, expect, test } from 'vitest';
import type AssetManager from '../src/core/map/asset_manager';
import MapObject from '../src/core/map/map_object';
import type { Frame, GameObjectDefinition, MapObjectContext } from '../src/core/map/types';
import type { RenderContext } from '../src/core/renderer/type';

const img = {} as HTMLImageElement;
const frameFor = (tag: number): Frame => ({ image: img, sx: tag, sy: 0, sw: 16, sh: 16, name: `f${tag}` });

// sprA → tag 1 (base), sprB → tag 2 (door)
const assets = {
  frame: (id: string) => (id === 'sprA' ? frameFor(1) : id === 'sprB' ? frameFor(2) : undefined),
  clip: () => undefined,
} as unknown as AssetManager;

const def: GameObjectDefinition = {
  id: 'obj_portal',
  name: 'portal',
  sprites: [],
  animations: [],
  properties: {},
  grid: { cols: 1, rows: 2, cell: 16 },
  machine: {
    id: 'sm',
    name: 'portal',
    states: [
      { id: 'st_open', name: 'open', display: { kind: 'sprite', spriteId: 'sprA' } },
      { id: 'st_close', name: 'close', display: { kind: 'sprite', spriteId: 'sprB' } },
    ],
    transitions: [],
    initialStateId: 'st_close',
  },
  layersByState: {
    st_open: [
      { name: 'base', visible: true, cells: [{ col: 0, row: 0, source: { kind: 'sprite', spriteId: 'sprA' } }] },
    ],
    st_close: [
      { name: 'base', visible: true, cells: [{ col: 0, row: 0, source: { kind: 'sprite', spriteId: 'sprA' } }] },
      { name: 'door', visible: true, cells: [{ col: 0, row: 1, source: { kind: 'sprite', spriteId: 'sprB' } }] },
    ],
  },
};

function drawsFor(startStateId: string): Array<{ tag: number; dx: number; dy: number }> {
  const ctx: MapObjectContext = {
    assets,
    machine: def.machine,
    def,
    properties: {},
    x: 100,
    y: 50,
    level: 0,
    startStateId,
  };
  const obj = new MapObject(ctx);
  const draws: Array<{ tag: number; dx: number; dy: number }> = [];
  const rctx = {
    drawSprite: (_img: unknown, sx: number, _sy: number, _sw: number, _sh: number, dx: number, dy: number) =>
      draws.push({ tag: sx, dx, dy }),
    save() {},
    restore() {},
    translate() {},
    scale() {},
  } as unknown as RenderContext;
  obj.render(rctx);
  return draws;
}

describe('MapObject composition', () => {
  test('renders both layers of a two-layer state at their grid offsets', () => {
    // closed = base (row 0) + door (row 1), cell 16 → base at (100,50), door at (100,66).
    expect(drawsFor('st_close')).toEqual([
      { tag: 1, dx: 100, dy: 50 },
      { tag: 2, dx: 100, dy: 66 },
    ]);
  });

  test('renders a single-layer state as just that cell', () => {
    expect(drawsFor('st_open')).toEqual([{ tag: 1, dx: 100, dy: 50 }]);
  });
});
