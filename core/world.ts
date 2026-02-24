import type { WorldBounds } from "../types";
import type { Collidable } from "./behaviours/collidable";

export default class World {
  private colliders: Set<Collidable> = new Set();

  register(collider: Collidable): void {
    this.colliders.add(collider);
  }

  unregister(collider: Collidable): void {
    this.colliders.delete(collider);
  }

  detect(): void {
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

  private tagsOverlap(wants: Set<string>, has: Set<string>): boolean {
    for (const tag of wants) {
      if (has.has(tag)) return true;
    }
    return false;
  }

  private intersects(
    a: Collidable,
    boundsA: WorldBounds,
    b: Collidable,
    boundsB: WorldBounds,
  ): boolean {
    const shapeA = a.shape;
    const shapeB = b.shape;

    if (shapeA.type === "aabb" && shapeB.type === "aabb") {
      return this.aabbVSAabb(boundsA, boundsB);
    }

    if (shapeA.type === "circle" && shapeB.type === "circle") {
      return this.circleVSCircle(
        boundsA,
        shapeA.radius,
        boundsB,
        shapeB.radius,
      );
    }

    const [circle, circleBounds, rect] =
      shapeA.type === "circle" ? [a, boundsA, boundsB] : [b, boundsB, boundsA];

    return this.circleVSAAabb(circle, circleBounds, rect);
  }
  private aabbVSAabb(a: WorldBounds, b: WorldBounds): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private circleVSCircle(
    a: Collidable,
    boundsA: WorldBounds,
    b: Collidable,
    boundsB: WorldBounds,
  ): boolean {
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

  private circleVSAAabb(
    circle: Collidable,
    circleBounds: WorldBounds,
    rect: WorldBounds,
  ): boolean {
    if (circle.shape.type !== "circle") return false;

    const cx = circleBounds.x + circle.shape.radius;
    const cy = circleBounds.y + circle.shape.radius;

    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return dx * dx + dy * dy <= circle.shape.radius * circle.shape.radius;
  }
}
