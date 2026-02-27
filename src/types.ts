import type DynamicEntity from "./entities/dynamic_entity";
import type Entity from "./entities/entity";

export interface Vector2 {
  x: number;
  y: number;
}

export type GameObject = Entity | DynamicEntity;

export type ColliderShape =
  | { type: "aabb"; width: number; height: number; offset?: Vector2 }
  | { type: "circle"; radius: number; offset?: Vector2 };

export interface CollisionInfo {
  self: Entity;
  other: Entity;
  selfTags: Set<string>;
  otherTags: Set<string>;
}

export interface WorldBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
