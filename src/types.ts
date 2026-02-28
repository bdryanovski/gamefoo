/**
 * Shared type definitions used throughout the GameFoo engine.
 *
 * This module contains the foundational interfaces and type aliases that
 * form the contract between the engine core, entities, and behaviours.
 *
 * @category Types
 * @module types
 * @since 0.1.0
 */

import type DynamicEntity from "./entities/dynamic_entity";
import type Entity from "./entities/entity";

/**
 * A two-dimensional vector representing a position, direction, or offset.
 *
 * Used pervasively across the engine for entity positions, velocities,
 * camera coordinates, and collider offsets.
 *
 * @category Types
 * @since 0.1.0
 *
 * @example Basic position
 * ```ts
 * const position: Vector2 = { x: 100, y: 200 };
 * ```
 *
 * @example Direction vector
 * ```ts
 * const direction: Vector2 = { x: Math.cos(angle), y: Math.sin(angle) };
 * ```
 */
export interface Vector2 {
  /** Horizontal component (increases rightward). */
  x: number;
  /** Vertical component (increases downward in canvas coordinates). */
  y: number;
}

/**
 * Union of all entity types that can be managed by the engine's
 * {@link GameObjectRegister}.
 *
 * Covers both static entities ({@link Entity}) and physics-capable
 * entities ({@link DynamicEntity}).
 *
 * @category Types
 * @since 0.1.0
 *
 * @see {@link Entity}        — base abstract entity
 * @see {@link DynamicEntity}  — entity with velocity and speed
 */
export type GameObject = Entity | DynamicEntity;

/**
 * Discriminated union describing the shape of a collision volume.
 *
 * The `type` field acts as the discriminant:
 *
 * | `type`     | Extra fields               | Description                    |
 * | ---------- | -------------------------- | ------------------------------ |
 * | `"aabb"`   | `width`, `height`, `offset?` | Axis-aligned bounding box      |
 * | `"circle"` | `radius`, `offset?`          | Circle centred on the entity   |
 *
 * @category Types
 * @since 0.1.0
 *
 * @example AABB collider
 * ```ts
 * const box: ColliderShape = {
 *   type: "aabb",
 *   width: 32,
 *   height: 32,
 * };
 * ```
 *
 * @example Circle collider with offset
 * ```ts
 * const circle: ColliderShape = {
 *   type: "circle",
 *   radius: 16,
 *   offset: { x: 0, y: -4 },
 * };
 * ```
 */
export type ColliderShape =
  | {
      /** Discriminant for an axis-aligned bounding box. */
      type: "aabb";
      /** Width of the bounding box in pixels. */
      width: number;
      /** Height of the bounding box in pixels. */
      height: number;
      /**
       * Optional positional offset relative to the owning entity's origin.
       * @defaultValue `{ x: 0, y: 0 }`
       */
      offset?: Vector2;
    }
  | {
      /** Discriminant for a circular collider. */
      type: "circle";
      /** Radius of the circle in pixels. */
      radius: number;
      /**
       * Optional positional offset relative to the owning entity's origin.
       * @defaultValue `{ x: 0, y: 0 }`
       */
      offset?: Vector2;
    };

/**
 * Payload delivered to a {@link Collidable.onCollision} callback when two
 * colliders overlap.
 *
 * Provides references to both participating entities and their tag sets
 * so the callback can determine the nature of the collision.
 *
 * @category Types
 * @since 0.1.0
 *
 * @example Handling a collision
 * ```ts
 * function handleHit(info: CollisionInfo) {
 *   if (info.otherTags.has("enemy")) {
 *     console.log(`${info.self.id} was hit by ${info.other.id}`);
 *   }
 * }
 * ```
 */
export interface CollisionInfo {
  /** The entity that *owns* this collision callback. */
  self: Entity;
  /** The other entity involved in the collision. */
  other: Entity;
  /** Tags belonging to {@link CollisionInfo.self | self}. */
  selfTags: Set<string>;
  /** Tags belonging to {@link CollisionInfo.other | other}. */
  otherTags: Set<string>;
}

/**
 * Axis-aligned rectangle used internally by the collision detection
 * system ({@link World}) to represent an entity's bounding volume in
 * world-space.
 *
 * @category Types
 * @since 0.1.0
 *
 * @see {@link World} — consumes these bounds during the detection pass
 */
export interface WorldBounds {
  /** Left edge X coordinate. */
  x: number;
  /** Top edge Y coordinate. */
  y: number;
  /** Horizontal extent in pixels. */
  width: number;
  /** Vertical extent in pixels. */
  height: number;
}
