/**
 * Contract: Screen honors MapData.layers visibility.
 *
 * A placement's `level` indexes into `map.layers`; a layer with
 * `visible: false` is excluded at build time (no tiles/fill drawn). Maps that
 * omit `layers` render every level, exactly as before.
 */
import { describe, expect, test } from 'vitest';
import type AssetManager from '../src/core/map/asset_manager';
import Screen from '../src/core/map/screen';
import type { Frame, MapData, Placement, ScreenData } from '../src/core/map/types';
import type { RenderContext } from '../src/core/renderer/type';

const frame: Frame = { image: {} as HTMLImageElement, sx: 0, sy: 0, sw: 16, sh: 16, name: 'f' };

const assets = {
  frame: () => frame,
  spriteCollisions: () => undefined,
  clip: () => undefined,
  objectByMachine: () => undefined,
} as unknown as AssetManager;

const sprite = (level: number): Placement =>
  ({ id: `p${level}`, kind: 'sprite', spriteId: 's', x: 0, y: 0, level }) as Placement;

function countDraws(mapPartial: Partial<MapData>, data: ScreenData): number {
  const map: MapData = {
    blockSize: 16,
    screenCols: 2,
    screenRows: 2,
    defaultSpriteId: null,
    screens: {},
    ...mapPartial,
  };
  const screen = new Screen({ data, assets, map });
  let draws = 0;
  const ctx = {
    drawSprite: () => {
      draws += 1;
    },
    save() {},
    restore() {},
    translate() {},
    scale() {},
  } as unknown as RenderContext;
  screen.render(ctx);
  return draws;
}

const twoLevels: ScreenData = { x: 0, y: 0, placements: [sprite(0), sprite(1)] };

describe('Screen layer visibility', () => {
  test('renders every level when no layers metadata is present', () => {
    expect(countDraws({}, twoLevels)).toBe(2);
  });

  test('excludes placements whose layer is hidden', () => {
    const layers = [
      { name: 'base', visible: true },
      { name: 'pillars', visible: false },
    ];
    expect(countDraws({ layers }, twoLevels)).toBe(1);
  });

  test('excludes the ground fill when the base layer is hidden', () => {
    // 2x2 grid → 4 fill tiles when the base layer is visible.
    const fillData: ScreenData = { x: 0, y: 0, placements: [] };
    expect(countDraws({ defaultSpriteId: 's' }, fillData)).toBe(4);
    expect(
      countDraws({ defaultSpriteId: 's', layers: [{ name: 'base', visible: false }] }, fillData),
    ).toBe(0);
  });

  test('draws an overlay interleaved: after its level, before higher layers', () => {
    // Sprites on level 0 and level 3; player overlay at level 2.
    const data: ScreenData = { x: 0, y: 0, placements: [sprite(0), sprite(3)] };
    const map: MapData = {
      blockSize: 16,
      screenCols: 2,
      screenRows: 2,
      defaultSpriteId: null,
      screens: {},
    };
    const screen = new Screen({ data, assets, map });
    const events: string[] = [];
    const ctx = {
      drawSprite: () => events.push('tile'),
      save() {},
      restore() {},
      translate() {},
      scale() {},
    } as unknown as RenderContext;
    screen.render(ctx, { level: 2, render: () => events.push('player') });
    expect(events).toEqual(['tile', 'player', 'tile']);
  });
});
