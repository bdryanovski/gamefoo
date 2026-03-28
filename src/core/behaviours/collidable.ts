import type Entity from '../../entities/entity';
import type {
  ColliderShape,
  CollisionInfo,
  GameObject,
  WorldBounds,
} from '../../generic_types';
import { Behaviour } from '../behaviour';
import type World from '../world';

/**
 * Options for constructing a {@link Collidable} behaviour.
 *
 * Every field except `shape` is optional and has a sensible default.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Minimal options
 * ```ts
 * const opts: CollidableOptions = {
 *   shape: { type: "aabb", width: 32, height: 32 },
 * };
 * ```
 *
 * @example Full options
 * ```ts
 * const opts: CollidableOptions = {
 *   shape: { type: "circle", radius: 16 },
 *   layer: 0,
 *   tags: new Set(["enemy"]),
 *   solid: true,
 *   fixed: false,
 *   collidesWith: new Set(["player", "bullet"]),
 *   onCollision: (info) => console.log("hit!", info.other.id),
 * };
 * ```
 */
type CollidableOptions = {
  /**
   * The geometric shape used for intersection tests.
   *
   * @see {@link ColliderShape}
   */
  shape: ColliderShape;

  /**
   * Collision layer index. Only colliders on the **same** layer are
   * tested against each other.
   *
   * @defaultValue `0`
   */
  layer?: number;

  /**
   * Tags that identify *this* collider (e.g. `"player"`, `"bullet"`).
   *
   * @defaultValue empty `Set`
   */
  tags?: Set<string>;

  /**
   * Tags this collider is **interested in**. The `onCollision` callback
   * only fires when the other collider has at least one matching tag.
   *
   * @defaultValue empty `Set`
   */
  collidesWith?: Set<string>;

  /**
   * Whether overlap resolution should be applied when this collider
   * intersects another solid collider.
   *
   * @defaultValue `false`
   */
  solid?: boolean;

  /**
   * If `true`, this collider is treated as immovable during overlap
   * resolution — the other entity absorbs the full displacement.
   *
   * @defaultValue `false`
   */
  fixed?: boolean;

  /**
   * Callback invoked when a collision with a tag-matched collider is
   * detected.
   *
   * @param info - Details about the collision, including both entities
   *   and their tag sets.
   *
   * @see {@link CollisionInfo}
   */
  onCollision?: (info: CollisionInfo) => void;
};

/**
 * Collision behaviour that can be attached to any {@link Entity}.
 *
 * When attached, the `Collidable` automatically registers itself with
 * the engine's {@link World} (via {@link Collidable.onAttach}) and
 * unregisters on detach. Each frame the `World` queries the collider's
 * shape, bounds, and tags to determine intersections.
 *
 * @category Behaviours
 * @since 0.1.0
 *
 * @example Creating and attaching a box collider
 * ```ts
 * import { Collidable, Entity, type CollisionInfo } from "gamefoo";
 *
 * const entity = new Enemy("goblin", 100, 200, 30, 30);
 *
 * entity.attachBehaviour(
 *   new Collidable(entity, engine.collisions, {
 *     shape: { type: "aabb", width: 30, height: 30 },
 *     layer: 0,
 *     tags: new Set(["enemy"]),
 *     solid: true,
 *     collidesWith: new Set(["player"]),
 *     onCollision: (info: CollisionInfo) => {
 *       console.log(`${info.self.id} hit ${info.other.id}`);
 *     },
 *   }),
 * );
 * ```
 *
 * @example Circle collider for a projectile
 * ```ts
 * entity.attachBehaviour(
 *   new Collidable(bullet, engine.collisions, {
 *     shape: { type: "circle", radius: 4 },
 *     tags: new Set(["bullet"]),
 *     collidesWith: new Set(["enemy"]),
 *   }),
 * );
 * ```
 *
 * @see {@link World}          — the collision detection system
 * @see {@link ColliderShape}  — supported shape types
 * @see {@link CollisionInfo}  — payload delivered to callbacks
 * @see {@link Behaviour}      — abstract base class
 */
export class Collidable extends Behaviour<GameObject> {
  /** @inheritDoc */
  readonly type = 'collidable';

  /**
   * Geometric shape used for intersection tests.
   *
   * @see {@link ColliderShape}
   */
  public shape: ColliderShape;

  /**
   * Collision layer. Only colliders sharing the same layer value are
   * tested.
   *
   * @defaultValue `0`
   */
  public layer: number = 0;

  /**
   * Tags identifying this collider (e.g. `"player"`, `"enemy"`).
   *
   * @defaultValue empty `Set`
   */
  public tags: Set<string> = new Set();

  /**
   * Tags this collider wants to be notified about.
   *
   * @defaultValue empty `Set`
   */
  public collidesWith: Set<string> = new Set();

  /**
   * Whether this collider participates in overlap resolution.
   *
   * @defaultValue `false`
   */
  public solid: boolean = false;

  /**
   * Whether the owning entity is immovable during overlap resolution.
   *
   * @defaultValue `false`
   */
  public fixed: boolean = false;

  /**
   * User-supplied callback invoked when a tag-matched collision is
   * detected.
   */
  public onCollision: (info: CollisionInfo) => void;

  /** Reference to the {@link World} this collider is registered with. */
  private world: World;

  /**
   * Creates a new collidable behaviour.
   *
   * @param owner   - The game object entity that owns this collider.
   * @param world   - The collision {@link World} to register with.
   * @param options - Configuration for shape, tags, solidity, and
   *   callbacks. See {@link CollidableOptions}.
   */
  constructor(owner: GameObject, world: World, options: CollidableOptions) {
    super(owner);

    this.world = world;

    const size = owner.getSize();

    this.shape = options.shape ?? {
      type: 'aabb',
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

  /**
   * No-op — collision logic lives in {@link World.detect}.
   *
   * @param _deltaTime - Unused.
   */
  update(_deltaTime: number): void {}

  /**
   * Lifecycle hook: registers this collider with the {@link World}
   * when the behaviour is attached to an entity.
   *
   * @see {@link Behaviour.onAttach}
   */
  override onAttach(): void {
    this.world.register(this);
  }

  /**
   * Lifecycle hook: removes this collider from the {@link World}
   * when the behaviour is detached.
   *
   * @see {@link Behaviour.onDetach}
   */
  override onDetach(): void {
    this.world.unregister(this);
  }

  /**
   * Returns the {@link Entity} that owns this behaviour.
   *
   * Used by the {@link World} to read and mutate entity position
   * during overlap resolution.
   *
   * @returns The owning entity.
   */
  getOwner(): Entity {
    return this.owner;
  }

  /**
   * Computes this collider's axis-aligned bounding rectangle in
   * world-space, accounting for the shape's optional offset.
   *
   * @returns A {@link WorldBounds} rectangle.
   *
   * @example
   * ```ts
   * const bounds = collidable.getWorldBounds();
   * // { x: 100, y: 200, width: 30, height: 30 }
   * ```
   */
  getWorldBounds(): WorldBounds {
    const pos = this.owner.getPosition();
    const offset =
      'offset' in this.shape && this.shape.offset
        ? this.shape.offset
        : { x: 0, y: 0 };

    if (this.shape.type === 'aabb') {
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
