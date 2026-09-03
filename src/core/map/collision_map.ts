import type MapObject from './map_object';
import type { CollisionShape, Rect } from './types';

/**
 * A collision shape resolved into world (screen) pixels, tagged with its
 * layer and — for object/character colliders — the {@link MapObject} that
 * owns it (so a query can turn "what did I bump/touch" into "which object").
 */
export interface WorldCollider {
  /**
   * Collision layer id, e.g. `"solid"`, `"trigger"`, `"activation"`.
   */
  layer: string;
  /**
   * The shape in world space (rect x/y absolute, circle cx/cy absolute).
   */
  shape: CollisionShape;
  /**
   * Axis-aligned bounds of {@link WorldCollider.shape}, cached for queries.
   */
  bounds: Rect;
  /**
   * Owning object, when the collider comes from a placed object/character.
   */
  owner?: MapObject;
}

/**
 * World-space AABB of a collision shape.
 */
export function shapeBounds(shape: CollisionShape): Rect {
  if (shape.kind === 'circle') {
    const d = shape.radius * 2;
    return { x: shape.cx - shape.radius, y: shape.cy - shape.radius, width: d, height: d };
  }
  return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
}

/**
 * Returns a copy of `shape` translated by `(dx, dy)` into world space.
 */
export function translateShape(shape: CollisionShape, dx: number, dy: number): CollisionShape {
  if (shape.kind === 'circle') {
    return { kind: 'circle', cx: shape.cx + dx, cy: shape.cy + dy, radius: shape.radius };
  }
  const { x, y, width, height } = shape;
  return { kind: 'rect', x: x + dx, y: y + dy, width, height };
}

function overlapAABB(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

/**
 * The per-screen collision world. Built once from a screen's static tile/
 * sprite colliders (indexed in a uniform spatial hash) plus a walkable
 * "ground" grid, then queried each frame. Live objects and characters join
 * as {@link CollisionMap.addOccupant | occupants} whose colliders are read
 * fresh (so they stay correct as objects move or change FSM state).
 *
 * Everyone — walls, props, and the player — shares this one structure, so
 * movement, bump resolution, fall checks and interaction all read the same
 * precomputed world.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const { x, y } = screen.collision.resolve(player.box(), dx, dy, player);
 * player.place(x, y);
 * if (!screen.collision.isWalkable(x + 8, y + 14)) player.fall();
 * const [target] = screen.collision.owners(player.reach(), 'activation', player);
 * ```
 */
export default class CollisionMap {
  public readonly cols: number;
  public readonly rows: number;
  public readonly cellSize: number;

  private readonly statics: WorldCollider[] = [];
  private readonly cellIndex = new Map<number, number[]>();
  private readonly ground: Uint8Array;
  private readonly occupants = new Set<MapObject>();

  constructor(cols: number, rows: number, cellSize: number) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.ground = new Uint8Array(cols * rows);
  }

  /**
   * Adds a resident collider (from a tile/sprite) to the spatial index.
   */
  public addStatic(collider: WorldCollider): void {
    const index = this.statics.length;
    this.statics.push(collider);
    for (const cell of this.cellsOf(collider.bounds)) {
      const bucket = this.cellIndex.get(cell);
      if (bucket) {
        bucket.push(index);
      } else {
        this.cellIndex.set(cell, [index]);
      }
    }
  }

  /**
   * Marks a cell as walkable ground (or not).
   */
  public setWalkable(col: number, row: number, walkable = true): void {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) {
      return;
    }
    this.ground[row * this.cols + col] = walkable ? 1 : 0;
  }

  /**
   * Registers a live object/character; its colliders are read each query.
   */
  public addOccupant(object: MapObject): void {
    this.occupants.add(object);
  }

  /**
   * Unregisters a live object/character.
   */
  public removeOccupant(object: MapObject): void {
    this.occupants.delete(object);
  }

  /**
   * Drops every occupant (e.g. when leaving the screen).
   */
  public clearOccupants(): void {
    this.occupants.clear();
  }

  /**
   * Whether the world point `(x, y)` sits over walkable ground.
   */
  public isWalkable(x: number, y: number): boolean {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) {
      return false;
    }
    return this.ground[row * this.cols + col] === 1;
  }

  /**
   * Colliders overlapping `bounds`, optionally filtered to one `layer`.
   */
  public query(bounds: Rect, layer?: string, ignore?: MapObject): WorldCollider[] {
    const out: WorldCollider[] = [];
    for (const collider of this.candidates(bounds, ignore)) {
      if (layer && collider.layer !== layer) {
        continue;
      }
      if (overlapAABB(bounds, collider.bounds)) {
        out.push(collider);
      }
    }
    return out;
  }

  /**
   * Whether anything on `layer` overlaps `bounds`.
   */
  public overlaps(bounds: Rect, layer?: string, ignore?: MapObject): boolean {
    for (const collider of this.candidates(bounds, ignore)) {
      if (layer && collider.layer !== layer) {
        continue;
      }
      if (overlapAABB(bounds, collider.bounds)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Distinct owning objects whose colliders overlap `bounds`.
   */
  public owners(bounds: Rect, layer?: string, ignore?: MapObject): MapObject[] {
    const out: MapObject[] = [];
    for (const collider of this.query(bounds, layer, ignore)) {
      if (collider.owner && !out.includes(collider.owner)) {
        out.push(collider.owner);
      }
    }
    return out;
  }

  /**
   * Slides `box` by `(dx, dy)`, stopping at any `solid` collider (axis by
   * axis, so it slides along walls). Returns the resolved top-left position.
   *
   * @param box    - The mover's world AABB.
   * @param dx     - Desired X delta this step.
   * @param dy     - Desired Y delta this step.
   * @param ignore - An owner to skip (usually the mover itself).
   */
  public resolve(box: Rect, dx: number, dy: number, ignore?: MapObject): { x: number; y: number } {
    let x = box.x;
    let y = box.y;
    const w = box.width;
    const h = box.height;

    if (dx !== 0) {
      let limit = x + dx;
      // Probe the whole swept path so thin walls can't be tunnelled through.
      const probe: Rect = { x: Math.min(x, limit), y, width: Math.abs(dx) + w, height: h };
      for (const collider of this.query(probe, 'solid', ignore)) {
        const b = collider.bounds;
        if (dx > 0) {
          if (b.x + b.width <= x) {
            continue; // behind the mover
          }
          limit = Math.min(limit, b.x - w);
        } else {
          if (b.x >= x + w) {
            continue;
          }
          limit = Math.max(limit, b.x + b.width);
        }
      }
      x = limit;
    }
    if (dy !== 0) {
      let limit = y + dy;
      const probe: Rect = { x, y: Math.min(y, limit), width: w, height: Math.abs(dy) + h };
      for (const collider of this.query(probe, 'solid', ignore)) {
        const b = collider.bounds;
        if (dy > 0) {
          if (b.y + b.height <= y) {
            continue;
          }
          limit = Math.min(limit, b.y - h);
        } else {
          if (b.y >= y + h) {
            continue;
          }
          limit = Math.max(limit, b.y + b.height);
        }
      }
      y = limit;
    }
    return { x, y };
  }

  /**
   * Yields candidate colliders near `bounds`: indexed statics + occupants.
   */
  private *candidates(bounds: Rect, ignore?: MapObject): Iterable<WorldCollider> {
    const seen = new Set<number>();
    for (const cell of this.cellsOf(bounds)) {
      const bucket = this.cellIndex.get(cell);
      if (!bucket) {
        continue;
      }
      for (const index of bucket) {
        if (seen.has(index)) {
          continue;
        }
        seen.add(index);
        yield this.statics[index]!;
      }
    }
    for (const object of this.occupants) {
      if (object === ignore) {
        continue;
      }
      for (const collider of object.worldColliders()) {
        yield collider;
      }
    }
  }

  /**
   * Cell keys (row*cols+col) that `bounds` overlaps, clamped to the grid.
   */
  private *cellsOf(bounds: Rect): Iterable<number> {
    const c0 = Math.max(0, Math.floor(bounds.x / this.cellSize));
    const r0 = Math.max(0, Math.floor(bounds.y / this.cellSize));
    const c1 = Math.min(this.cols - 1, Math.floor((bounds.x + bounds.width) / this.cellSize));
    const r1 = Math.min(this.rows - 1, Math.floor((bounds.y + bounds.height) / this.cellSize));
    for (let row = r0; row <= r1; row++) {
      for (let col = c0; col <= c1; col++) {
        yield row * this.cols + col;
      }
    }
  }
}
