import type DynamicEntity from "../../entities/dynamic_entity";
import type Entity from "../../entities/entity";
import type { ColliderShape, CollisionInfo, WorldBounds } from "../../types";
import { Behaviour } from "../behaviour";
import type World from "../world";

type CollidableOptions = {
  shape: ColliderShape;
  layer?: number;
  tags?: Set<string>;
  collidesWith?: Set<string>;
  solid?: boolean;
  fixed?: boolean;
  onCollision?: (info: CollisionInfo) => void;
};

export class Collidable extends Behaviour<DynamicEntity> {
  readonly type = "collidable";

  public shape: ColliderShape;

  public layer: number = 0;

  public tags: Set<string> = new Set();

  public collidesWith: Set<string> = new Set();

  public solid: boolean = false;

  public fixed: boolean = false;

  public onCollision: (info: CollisionInfo) => void;

  private world: World;

  constructor(owner: DynamicEntity, world: World, options: CollidableOptions) {
    super(owner);

    this.world = world;

    const size = owner.getSize();

    this.shape = options.shape;
    this.shape = options.shape ?? {
      type: "aabb",
      width: size.width,
      height: size.height,
    };
    this.layer = options.layer ?? 0;
    this.tags = options.tags ?? new Set();
    this.solid = options.solid ?? false;
    this.fixed = options.fixed ?? false;
    this.collidesWith = options.collidesWith ?? new Set();
    this.onCollision = options.onCollision || (() => {});
  }

  update(_deltaTime: number): void {}

  override onAttach(): void {
    this.world.register(this);
  }

  override onDetach(): void {
    this.world.unregister(this);
  }

  getOwner(): Entity {
    return this.owner;
  }

  getWorldBounds(): WorldBounds {
    const pos = this.owner.getPosition();
    const offset =
      "offset" in this.shape && this.shape.offset
        ? this.shape.offset
        : { x: 0, y: 0 };

    if (this.shape.type === "aabb") {
      return {
        x: pos.x + offset.x,
        y: pos.y + offset.y,
        width: this.shape.width,
        height: this.shape.height,
      };
    }

    const r = this.shape.radius;
    return {
      x: pos.x + offset.x - r,
      y: pos.y + offset.y - r,
      width: r * 2,
      height: r * 2,
    };
  }
}
