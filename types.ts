export interface Vector2 {
  x: number;
  y: number;
}

export type GameObjectType = "sprite" | "text" | "shape";

export interface GameObject {
  id: string;
  name: string;
  widht: number;
  height: number;
  type: GameObjectType;
  position: Vector2;
  rotation: number;
  scale: Vector2;
  visible: boolean;
}
