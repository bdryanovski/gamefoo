import type { RenderContext } from '@/core/renderer/type';
import type { Demension, Vector2 } from '@/generic_types';

/**
 * Abstract base class for all renderable objects in the GameFoo engine.
 *
 * `Node` provides the fundamental building blocks shared by all game objects:
 *
 * - **Position** — a 2-D {@link Node.position | position} with `x`/`y` accessors.
 * - **Size** — bounding {@link Node.size | dimensions} in pixels.
 * - **Lifecycle** — abstract {@link Node.update | update} and
 *   {@link Node.render | render} methods that subclasses must implement.
 *
 * This is the lowest-level base class in the entity hierarchy. For game
 * entities with identity and behaviours, see {@link Entity}. For entities
 * with physics (velocity/speed), see {@link DynamicEntity}.
 *
 * @category Entities
 * @since 0.5.0
 *
 * @example Subclassing Node directly
 * ```ts
 * import Node from "gamefoo/entities/node";
 *
 * class Particle extends Node {
 *   constructor(x: number, y: number) {
 *     super({ x, y }, { width: 2, height: 2 });
 *   }
 *
 *   update(dt: number) {
 *     this.y += 100 * dt; // Fall down
 *   }
 *
 *   render(ctx: RenderContext) {
 *     ctx.fillRect(this.x, this.y, 2, 2, "#ff0000");
 *   }
 * }
 * ```
 *
 * @see {@link Entity} — extends Node with identity and behaviours
 * @see {@link DynamicEntity} — extends Entity with velocity/speed
 * @see {@link Bitmap} — extends Node for pixel-art sprites
 */
export default abstract class Node {
  /**
   * World-space position of the node's origin (top-left corner).
   *
   * @since 0.5.0
   */
  protected readonly position: Vector2 = { x: 0, y: 0 };

  /**
   * Bounding dimensions of the node in pixels.
   *
   * @since 0.5.0
   */
  protected readonly size: Demension = { width: 0, height: 0 };

  /**
   * Creates a new Node.
   *
   * @param position - Initial position as `{ x, y }`.
   * @param size - Optional dimensions as `{ width, height }`. Defaults to 0×0.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // Position only (zero size)
   * super({ x: 100, y: 200 });
   *
   * // Position and size
   * super({ x: 100, y: 200 }, { width: 32, height: 32 });
   * ```
   */
  constructor(position: Vector2, size?: Demension) {
    if (position) {
      this.position = position;
    }
    if (size) {
      this.size = size;
    }
  }

  /**
   * Horizontal position of the node (shorthand for `position.x`).
   *
   * @since 0.5.0
   */
  public get x(): number {
    return this.position.x;
  }

  /**
   * Sets the horizontal position.
   *
   * @since 0.5.0
   */
  public set x(value: number) {
    this.position.x = value;
  }

  /**
   * Vertical position of the node (shorthand for `position.y`).
   *
   * @since 0.5.0
   */
  public get y(): number {
    return this.position.y;
  }

  /**
   * Sets the vertical position.
   *
   * @since 0.5.0
   */
  public set y(value: number) {
    this.position.y = value;
  }

  /**
   * Returns the node's current position.
   *
   * @returns The internal {@link Vector2} reference with `x` and `y`.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const pos = node.getPosition();
   * console.log(`Node at (${pos.x}, ${pos.y})`);
   * ```
   */
  public getPosition(): Vector2 {
    return this.position;
  }

  /**
   * Returns the node's bounding dimensions.
   *
   * @returns The internal {@link Demension} reference with `width` and `height`.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * const size = node.getSize();
   * console.log(`Node is ${size.width}×${size.height} pixels`);
   * ```
   */
  public getSize(): Demension {
    return this.size;
  }

  /**
   * Sets the node's bounding dimensions.
   *
   * @param width - New width in pixels.
   * @param height - New height in pixels.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * this.setSize(64, 64); // Resize to 64×64
   * ```
   */
  protected setSize(width: number, height: number): void {
    this.size.width = width;
    this.size.height = height;
  }

  /**
   * Advances the node's state by one frame.
   *
   * Called once per frame by the game loop. Subclasses must implement
   * this method to update position, animation, AI, or any other
   * per-frame logic.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * update(dt: number) {
   *   this.x += this.velocity.x * dt;
   *   this.y += this.velocity.y * dt;
   * }
   * ```
   */
  public abstract update(deltaTime: number): void;

  /**
   * Draws the node to the screen.
   *
   * Called once per frame after {@link Node.update | update}. Subclasses
   * must implement this method to render sprites, shapes, text, or any
   * other visual representation.
   *
   * @param ctx - The rendering context (canvas or terminal).
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * render(ctx: RenderContext) {
   *   ctx.fillRect(this.x, this.y, this.size.width, this.size.height, "#ff0000");
   * }
   * ```
   */
  public abstract render(ctx: RenderContext): void;
}
