import type { WorldBounds } from "../types";
import type { Collidable } from "./behaviours/collidable";

/**
 * Spatial collision-detection world.
 *
 * `World` maintains a set of {@link Collidable} behaviours and, each
 * frame, performs an **O(n^2)** broad-phase + narrow-phase pass via
 * {@link World.detect}.  It supports:
 *
 * - **Layer filtering** — only colliders on the same layer are tested.
 * - **Tag-based interest** — a collider only receives callbacks for
 *   tags it has opted into via `collidesWith`.
 * - **Shape combinations** — AABB vs AABB, circle vs circle, and
 *   circle vs AABB.
 * - **Solid overlap resolution** — when both colliders are marked
 *   `solid`, entities are pushed apart along the axis of least
 *   penetration.
 * - **Fixed bodies** — colliders flagged `fixed` are immovable; the
 *   other body absorbs the full push.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Registering colliders
 * ```ts
 * const world = new World();
 *
 * const collidable = new Collidable(entity, world, {
 *   shape: { type: "aabb", width: 32, height: 32 },
 *   layer: 0,
 *   tags: new Set(["enemy"]),
 *   solid: true,
 *   collidesWith: new Set(["player", "bullet"]),
 * });
 *
 * entity.attachBehaviour(collidable); // calls world.register internally
 * ```
 *
 * @example Running detection manually
 * ```ts
 * world.detect(); // typically called by Engine.update each frame
 * ```
 *
 * @see {@link Collidable} — the behaviour that plugs into this world
 * @see {@link Engine}     — calls {@link World.detect} every frame
 */
export default class World {
  /**
   * The live set of all registered {@link Collidable} behaviours.
   */
  private colliders: Set<Collidable> = new Set();

  /**
   * Adds a collider to the world so it participates in future
   * {@link World.detect} passes.
   *
   * Called automatically by {@link Collidable.onAttach}.
   *
   * @param collider - The collidable behaviour to register.
   */
  register(collider: Collidable): void {
    this.colliders.add(collider);
  }

  /**
   * Removes a collider from the world.
   *
   * Called automatically by {@link Collidable.onDetach}.
   *
   * @param collider - The collidable behaviour to remove.
   */
  unregister(collider: Collidable): void {
    this.colliders.delete(collider);
  }

  /**
   * Runs one full collision-detection pass over every registered
   * collider.
   *
   * **Algorithm:**
   *
   * 1. Iterate all unique pairs `(i, j)` where `i < j`.
   * 2. Skip disabled colliders or mismatched layers.
   * 3. Check tag interest in both directions.
   * 4. Compute world bounds and test intersection.
   * 5. If both are `solid`, resolve the overlap.
   * 6. Fire `onCollision` callbacks on interested sides.
   *
   * @since 0.1.0
   */
  detect(): void {
    /**
     * Note: this naive O(n^2) approach is fine for small numbers of colliders
     * (e.g. <100) but will degrade rapidly as that grows. For larger games,
     * consider implementing spatial partitioning (e.g. quad-trees) to reduce
     * the number of pairwise checks.
     * In the meantime, users can mitigate performance issues by carefully
     * managing which colliders are active and using layers/tags to minimize
     * unnecessary checks.
     * This method is intentionally straightforward for clarity and ease of
     * extension (e.g. adding new shapes or filters) in the early stages of
     * development.
     *
     * Future optimizations could include:
     * - Spatial partitioning (quad-trees, grids)
     *   - Sweep and prune (sorting by axis)
     *   - Early-out checks (e.g. bounding circles)
     *   - Parallel processing (Web Workers)
     *   - Configurable broad-phase strategies
     *   - Caching world bounds and only updating when necessary
     *   - Object pooling for collision data structures
     *   - Profiling and optimizing hot paths (e.g. intersection tests)
     *   - Allowing users to provide custom collision filters or callbacks
     *   - Supporting more complex shapes (polygons, capsules) with appropriate tests
     *   - Providing debug visualization tools to help users understand collisions
     *   - Documenting best practices for performance (e.g. using layers/tags effectively)
     *   - Providing warnings or profiling tools when performance degrades due to too many colliders
     *   - etc.
     */
    if (this.colliders.size === 0) return;

    const list = Array.from(this.colliders);
    const len = list.length;

    for (let i = 0; i < len; i++) {
      const obj = list[i];
      if (!obj?.enabled) continue;

      for (let j = i + 1; j < len; j++) {
        const other = list[j];
        if (!other?.enabled) continue;

        if (obj.layer !== other.layer) continue;

        const objWantOther = this.tagsOverlap(obj.collidesWith, other.tags);
        const otherWantObj = this.tagsOverlap(other.collidesWith, obj.tags);

        const boundsObj = obj.getWorldBounds();
        const boundsOther = other.getWorldBounds();

        if (!this.intersects(obj, boundsObj, other, boundsOther)) continue;

        if (obj.solid && other.solid) {
          this.resolveOverlap(obj, boundsObj, other, boundsOther);
        }

        if (objWantOther && obj.onCollision) {
          obj.onCollision({
            self: obj.getOwner(),
            other: other.getOwner(),
            selfTags: obj.tags,
            otherTags: other.tags,
          });
        }

        if (otherWantObj && other.onCollision) {
          other.onCollision({
            self: other.getOwner(),
            other: obj.getOwner(),
            selfTags: other.tags,
            otherTags: obj.tags,
          });
        }
      }
    }
  }

  /**
   * Returns `true` if any tag in `wants` exists in `has`.
   *
   * @param wants - Tags the collider is interested in.
   * @param has   - Tags the other collider owns.
   * @returns Whether at least one tag overlaps.
   *
   * @internal
   */
  private tagsOverlap(wants: Set<string>, has: Set<string>): boolean {
    for (const tag of wants) {
      if (has.has(tag)) return true;
    }
    return false;
  }

  /**
   * Dispatches to the correct narrow-phase test based on collider
   * shape types.
   *
   * Supports AABB-vs-AABB, circle-vs-circle, and circle-vs-AABB.
   *
   * @param a       - First collidable.
   * @param boundsA - World bounds of `a`.
   * @param b       - Second collidable.
   * @param boundsB - World bounds of `b`.
   * @returns `true` if the two shapes overlap.
   *
   * @internal
   */
  private intersects(a: Collidable, boundsA: WorldBounds, b: Collidable, boundsB: WorldBounds): boolean {
    const shapeA = a.shape;
    const shapeB = b.shape;

    if (shapeA.type === "aabb" && shapeB.type === "aabb") {
      return this.aabbVSAabb(boundsA, boundsB);
    }

    if (shapeA.type === "circle" && shapeB.type === "circle") {
      return this.circleVSCircle(a, boundsA, b, boundsB);
    }

    const [circle, circleBounds, rect] = shapeA.type === "circle" ? [a, boundsA, boundsB] : [b, boundsB, boundsA];

    return this.circleVSAAabb(circle, circleBounds, rect);
  }

  /**
   * AABB-vs-AABB overlap test.
   *
   * @param a - First bounding rectangle.
   * @param b - Second bounding rectangle.
   * @returns `true` if the rectangles overlap.
   *
   * @internal
   */
  private aabbVSAabb(a: WorldBounds, b: WorldBounds): boolean {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  /**
   * Circle-vs-circle overlap test using squared-distance comparison
   * (avoids `Math.sqrt`).
   *
   * @param a       - First collidable (must have `circle` shape).
   * @param boundsA - World bounds of `a`.
   * @param b       - Second collidable (must have `circle` shape).
   * @param boundsB - World bounds of `b`.
   * @returns `true` if the circles overlap.
   *
   * @internal
   */
  private circleVSCircle(a: Collidable, boundsA: WorldBounds, b: Collidable, boundsB: WorldBounds): boolean {
    if (a.shape.type !== "circle" || b.shape.type !== "circle") return false;

    const cx1 = boundsA.x + a.shape.radius;
    const cy1 = boundsA.y + a.shape.radius;
    const cx2 = boundsB.x + b.shape.radius;
    const cy2 = boundsB.y + b.shape.radius;

    const dx = cx2 - cx1;
    const dy = cy2 - cy1;
    const distSq = dx * dx + dy * dy;
    const radSum = a.shape.radius + b.shape.radius;

    return distSq <= radSum * radSum;
  }

  /**
   * Circle-vs-AABB overlap test. Finds the closest point on the
   * rectangle to the circle centre and checks the squared distance.
   *
   * @param circle       - The collidable with a `circle` shape.
   * @param circleBounds - World bounds of the circle collider.
   * @param rect         - World bounds of the AABB collider.
   * @returns `true` if the circle and rectangle overlap.
   *
   * @internal
   */
  private circleVSAAabb(circle: Collidable, circleBounds: WorldBounds, rect: WorldBounds): boolean {
    if (circle.shape.type !== "circle") return false;

    const cx = circleBounds.x + circle.shape.radius;
    const cy = circleBounds.y + circle.shape.radius;

    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return dx * dx + dy * dy <= circle.shape.radius * circle.shape.radius;
  }

  /**
   * Resolves positional overlap between two solid colliders by pushing
   * their owning entities apart along the axis of minimum penetration.
   *
   * Respects the `fixed` flag: if one collider is fixed the other
   * absorbs the full displacement; if both are fixed, no resolution
   * occurs.
   *
   * @param a       - First collidable.
   * @param boundsA - World bounds of `a`.
   * @param b       - Second collidable.
   * @param boundsB - World bounds of `b`.
   *
   * @internal
   */
  private resolveOverlap(a: Collidable, boundsA: WorldBounds, b: Collidable, boundsB: WorldBounds): void {
    const overlapX = Math.min(boundsA.x + boundsA.width - boundsB.x, boundsB.x + boundsB.width - boundsA.x);
    const overlapY = Math.min(boundsA.y + boundsA.height - boundsB.y, boundsB.y + boundsB.height - boundsA.y);

    let pushX = 0;
    let pushY = 0;

    if (overlapX < overlapY) {
      pushX = boundsA.x < boundsB.x ? -overlapX : overlapX;
    } else {
      pushY = boundsA.y < boundsB.y ? -overlapY : overlapY;
    }

    const ownerA = a.getOwner();
    const ownerB = b.getOwner();

    if (a.fixed && b.fixed) {
      return;
    }

    if (a.fixed) {
      ownerB.x -= pushX;
      ownerB.y -= pushY;
    } else if (b.fixed) {
      ownerA.x += pushX;
      ownerA.y += pushY;
    } else {
      ownerA.x += pushX / 2;
      ownerA.y += pushY / 2;
      ownerB.x -= pushX / 2;
      ownerB.y -= pushY / 2;
    }
  }
}
