import type DynamicEntity from "./entities/dynamic_entity";
import type Entity from "./entities/entity";

export interface Vector2 {
  x: number;
  y: number;
}

export type GameObject = Entity | DynamicEntity;
