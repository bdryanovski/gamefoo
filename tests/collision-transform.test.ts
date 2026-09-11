/**
 * Contract: collider shapes follow a placement's flip/rotation (about the
 * object footprint centre), so a rotated or flipped object's colliders track
 * its sprite instead of staying in the authored orientation.
 */
import { describe, expect, test } from 'vitest';
import { transformShape } from '../src/core/map/collision_map';
import type { CollisionShape } from '../src/core/map/types';

const footprint = { width: 16, height: 16 };
// A "top frame" collider: full width, upper 11px (like the portal's solid).
const topRect: CollisionShape = { kind: 'rect', x: 0, y: 0, width: 16, height: 11 };

function rect(shape: CollisionShape) {
  if (shape.kind !== 'rect') throw new Error('expected rect');
  return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
}

describe('transformShape', () => {
  test('no transform just translates to world', () => {
    expect(rect(transformShape(topRect, 100, 200, undefined, footprint))).toEqual({
      x: 100,
      y: 200,
      width: 16,
      height: 11,
    });
  });

  test('flipY moves the top collider to the bottom of the cell', () => {
    // y flips about cy=8: [0,11] -> [5,16].
    expect(rect(transformShape(topRect, 100, 200, { flipY: true }, footprint))).toEqual({
      x: 100,
      y: 205,
      width: 16,
      height: 11,
    });
  });

  test('rotation 180 moves the top collider to the bottom', () => {
    const r = rect(transformShape(topRect, 100, 200, { rotation: 180 }, footprint));
    expect(r.x).toBeCloseTo(100);
    expect(r.y).toBeCloseTo(205);
    expect(r.width).toBeCloseTo(16);
    expect(r.height).toBeCloseTo(11);
  });

  test('rotation 90 swaps the collider onto a side (w/h swap)', () => {
    // top frame (wide, short) becomes a side frame (narrow, tall).
    const r = rect(transformShape(topRect, 100, 200, { rotation: 90 }, footprint));
    expect(r.width).toBeCloseTo(11);
    expect(r.height).toBeCloseTo(16);
    expect(r.y).toBeCloseTo(200);
  });

  test('a centred collider is unchanged by flipY (symmetry)', () => {
    const centred: CollisionShape = { kind: 'rect', x: 4, y: 4, width: 8, height: 8 };
    const r = rect(transformShape(centred, 0, 0, { flipY: true }, footprint));
    expect(r).toEqual({ x: 4, y: 4, width: 8, height: 8 });
  });
});
