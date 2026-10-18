/**
 * Contract: MapSystem (phase 6f).
 *
 * MapSystem owns a MapManager and drives it: it ticks the map (gating on
 * `isActive`), renders it inside the world→screen scale sandwich (gating on
 * `isVisible`), interleaves an overlay, navigates screens, and exposes game
 * hooks either side of the tick and above the map.
 */
import { describe, expect, test, vi } from 'vite-plus/test';
import { MapSystem, type RenderContext } from '../src/index';
import type MapManager from '../src/core/map/map_manager';
import type { ScreenOverlay } from '../src/core/map/screen';
import type Screen from '../src/core/map/screen';
import type MapObject from '../src/core/map/map_object';

function makeManager(events: string[] = []) {
  const current = {
    coordinate: [0, 0] as [number, number],
    objects: [] as MapObject[],
  };
  const manager = {
    current,
    assets: {},
    screenAt: vi.fn((x: number, y: number) => x === 1 && y === 0),
    navigateTo: vi.fn((x: number, y: number) => {
      if (!(x === 1 && y === 0)) return false;
      current.coordinate = [x, y];
      events.push('navigateTo');
      return true;
    }),
    update: vi.fn(() => events.push('map.update')),
    render: vi.fn((_ctx: RenderContext, overlay?: ScreenOverlay) => {
      events.push('map.render');
      overlay?.render({} as RenderContext);
    }),
  };
  return { manager: manager as unknown as MapManager, current, events };
}

function makeCtx(events: string[] = []) {
  const canvas = { imageSmoothingEnabled: true };
  const ctx = {
    getCanvas: () => canvas,
    save: () => events.push('save'),
    restore: () => events.push('restore'),
    scale: (x: number, y: number) => events.push(`scale:${x},${y}`),
  } as unknown as RenderContext;
  return { ctx, canvas, events };
}

class ProbeMapSystem extends MapSystem {
  readonly log: string[] = [];
  protected override onScreenEntered(x: number, y: number): void {
    this.log.push(`enter:${x},${y}`);
  }
  protected override onBeforeUpdate(): void {
    this.log.push('before');
  }
  protected override onAfterUpdate(): void {
    this.log.push('after');
  }
  protected override renderOverMap(): void {
    this.log.push('overMap');
  }
}

describe('MapSystem', () => {
  test('adopts a map and answers world queries', () => {
    const { manager, current } = makeManager();
    const system = new ProbeMapSystem();
    system.useMap(manager);

    expect(system.map).toBe(manager);
    expect(system.screenKey()).toBe('0,0');
    expect(system.current()).toBe(current as unknown as Screen);
    expect(system.objects()).toBe(current.objects);
    expect(system.canNavigate(1, 0)).toBe(true);
    expect(system.canNavigate(9, 9)).toBe(false);
    expect(system.log).toEqual(['enter:0,0']);
  });

  test('navigate() swaps screens, tracks the coordinate and fires the hook', () => {
    const { manager, events } = makeManager();
    const system = new ProbeMapSystem();
    system.useMap(manager);

    expect(system.navigate(1, 0)).toBe(true);
    expect(system.screenKey()).toBe('1,0');
    expect(events).toContain('navigateTo');
    expect(system.log).toEqual(['enter:0,0', 'enter:1,0']);

    expect(system.navigate(9, 9)).toBe(false);
    expect(system.screenKey()).toBe('1,0');
    expect(system.log).toEqual(['enter:0,0', 'enter:1,0']);
  });

  test('update() is gated by isActive and brackets the map tick', () => {
    const { manager, events } = makeManager();
    let active = false;
    const system = new ProbeMapSystem({ isActive: () => active, scale: 1 });
    system.useMap(manager);

    system.update(16);
    expect(events).toEqual([]);
    expect(system.log).toEqual(['enter:0,0']);

    active = true;
    system.update(16);
    expect(events).toEqual(['map.update']);
    expect(system.log).toEqual(['enter:0,0', 'before', 'after']);
  });

  test('render() is gated by isVisible, applies the scale and draws hooks', () => {
    const renderEvents: string[] = [];
    const { manager, events } = makeManager(renderEvents);
    const { ctx, canvas } = makeCtx(renderEvents);
    let visible = false;
    const system = new ProbeMapSystem({
      scale: 3,
      isVisible: () => visible,
      overlay: () => ({ level: 3, render: (c) => system.log.push('overlay') }),
    });
    system.useMap(manager);
    system.log.length = 0;

    system.render(ctx);
    expect(events).toEqual([]);
    expect(canvas.imageSmoothingEnabled).toBe(false);

    visible = true;
    system.render(ctx);
    expect(renderEvents).toEqual(['save', 'scale:3,3', 'map.render', 'restore']);
    expect(system.log).toEqual(['overlay', 'overMap']);
    expect(canvas.imageSmoothingEnabled).toBe(false);
  });
});
