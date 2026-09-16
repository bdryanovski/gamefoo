/**
 * Contract: a `text` placement builds a live {@link TextObject} that draws its
 * string with the authored font/size/colour/alignment, defaults fill missing
 * style, and the object is reachable + mutable via `Screen.objectsByType` so it
 * can be animated at runtime.
 */
import { describe, expect, test } from 'vitest';
import TextObject from '../src/core/map/text_object';
import Screen from '../src/core/map/screen';
import AssetManager from '../src/core/map/asset_manager';
import type { MapData, MapObjectContext, RenderContext } from '../src/index';

/** A canvas double recording the text draw call + the active 2D state. */
function fakeCtx() {
  const calls: Array<{ text: string; x: number; y: number }> = [];
  const raw = {
    font: '',
    textAlign: '',
    textBaseline: '',
    fillStyle: '',
    globalAlpha: 1,
    save() {},
    restore() {},
    fillText(text: string, x: number, y: number) {
      calls.push({ text, x, y });
      // capture the state at draw time
      raw._at = { font: raw.font, align: raw.textAlign, alpha: raw.globalAlpha, fill: raw.fillStyle };
    },
    _at: {} as Record<string, unknown>,
  };
  const ctx = {
    getCanvas: () => raw as unknown as CanvasRenderingContext2D,
    drawText: (text: string, x: number, y: number) => calls.push({ text, x, y }),
  } as unknown as RenderContext;
  return { ctx, raw, calls };
}

function context(over: Partial<MapObjectContext> = {}): MapObjectContext {
  return {
    assets: new AssetManager(),
    machine: { id: '', name: 'text', states: [], transitions: [], initialStateId: null },
    def: { id: '', name: 'Text', sprites: [], animations: [], properties: {}, machine: { id: '', name: 'text', states: [], transitions: [], initialStateId: null } },
    properties: {},
    x: 10,
    y: 20,
    level: 1,
    text: { text: 'Hi' },
    ...over,
  };
}

describe('TextObject', () => {
  test('applies authored style and draws the string', () => {
    const obj = new TextObject(
      context({ text: { text: 'HELLO', font: 'Georgia', fontSize: 24, color: '#ff0000', align: 'center' } }),
    );
    const { ctx, raw, calls } = fakeCtx();
    obj.render(ctx);

    expect(calls).toContainEqual({ text: 'HELLO', x: 10, y: 20 });
    expect(raw._at).toMatchObject({ font: '24px Georgia', align: 'center', fill: '#ff0000' });
  });

  test('fills defaults for omitted style and reflects alpha', () => {
    const obj = new TextObject(context({ text: { text: 'x' } }));
    expect(obj.font).toBe('monospace');
    expect(obj.fontSize).toBe(16);
    expect(obj.color).toBe('#ffffff');
    expect(obj.align).toBe('left');

    obj.alpha = 0.5;
    const { ctx, raw } = fakeCtx();
    obj.render(ctx);
    expect(raw._at.alpha).toBe(0.5);
  });

  test('is a mutable game object (runtime animation)', () => {
    const obj = new TextObject(context());
    obj.x = 99;
    obj.setText('changed');
    obj.color = '#00ff00';
    const { ctx, calls } = fakeCtx();
    obj.render(ctx);
    expect(calls[0]).toEqual({ text: 'changed', x: 99, y: 20 });
  });
});

describe('Screen builds text placements', () => {
  const map: MapData = {
    blockSize: 16,
    screenCols: 4,
    screenRows: 4,
    screens: {},
  };

  test('a text placement becomes a live TextObject on its level', () => {
    const screen = new Screen({
      data: {
        x: 0,
        y: 0,
        placements: [
          {
            id: 'txt1',
            kind: 'text',
            text: 'Sign',
            fontSize: 8,
            color: '#0af',
            x: 32,
            y: 48,
            level: 2,
          },
        ],
      },
      assets: new AssetManager(),
      map,
    });
    screen.activate();

    const texts = screen.objectsByType(TextObject);
    expect(texts).toHaveLength(1);
    const t = texts[0]!;
    expect(t).toMatchObject({ id: 'txt1', text: 'Sign', fontSize: 8, color: '#0af', x: 32, y: 48, level: 2 });
  });
});
