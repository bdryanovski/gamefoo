import type { GameObject } from "../generic_types";

/**
 * Central registry that stores and manages all non-player
 * {@link GameObject | game objects} within the engine.
 *
 * Objects are keyed by their `id` property, so each ID must be unique.
 * The {@link Engine} delegates per-frame `update` and `render` calls to
 * this register.
 *
 * @category Core
 * @since 0.1.0
 *
 * @example Registering and retrieving objects
 * ```ts
 * const register = new GameObjectRegister();
 *
 * register.register(tree);
 * register.register(rock);
 *
 * const found = register.get("tree"); // Entity | undefined
 * console.log(register.has("rock"));  // true
 * ```
 *
 * @example Bulk update / render
 * ```ts
 * // Called internally by Engine each frame:
 * register.updateAll(deltaTime);
 * register.renderAll(ctx);
 * ```
 *
 * @see {@link Engine.attachObjects} — convenience method that delegates here
 */
export default class GameObjectRegister {
  /**
   * Internal map from entity ID to its {@link GameObject} instance.
   */
  private objects: Map<string, GameObject> = new Map();

  private _cache: GameObject[] | null = null;

  /**
   * Adds a game object to the registry.
   *
   * If an object with the same `id` already exists it will be
   * silently overwritten.
   *
   * @param object - The game object to register.
   *
   * @example
   * ```ts
   * register.register(new Crate("crate_1", 200, 150, 32, 32));
   * ```
   */
  register(object: GameObject) {
    this.objects.set(object.id, object);
    this._cache = null;
  }

  /**
   * Retrieves a registered object by its unique ID.
   *
   * @param id - The ID of the object to find.
   * @returns The matching {@link GameObject}, or `undefined` if not found.
   *
   * @example
   * ```ts
   * const crate = register.get("crate_1");
   * if (crate) crate.x += 10;
   * ```
   */
  get(id: string): GameObject | undefined {
    return this.objects.get(id);
  }

  /**
   * Checks whether an object with the given ID is registered.
   *
   * @param id - The ID to look up.
   * @returns `true` if the registry contains the object.
   */
  has(id: string): boolean {
    return this.objects.has(id);
  }

  /**
   * Returns all registered objects as an array.
   *
   * Make sure to also cache the objects
   *
   * @since 0.2.0
   *
   * @returns An array of all {@link GameObject} instances in the registry.
   */
  toArray(): GameObject[] {
    if (!this._cache) {
      this._cache = Array.from(this.objects.values());
    }

    return this._cache;
  }

  /**
   * Returns all registered objects that pass the supplied filter.
   *
   * @param filter - (optional) A predicate function. Return `true` to include the
   *   object in the result.
   * @returns An array of matching {@link GameObject} instances.
   *
   * @example
   * ```ts
   * const enemies = register.getAll(() => true);
   * ```
   */
  getAll(filter?: () => true): GameObject[] {
    if (typeof filter === "function") {
      return this.toArray().filter(filter);
    }

    return this.toArray();
  }

  /**
   * Calls {@link GameObject.update | update(deltaTime)} on every
   * registered object.
   *
   * @param deltaTime - Seconds elapsed since the previous frame.
   */
  updateAll(deltaTime: number): void {
    for (const obj of this.getAll()) {
      obj.update(deltaTime);
    }
  }

  /**
   * Calls {@link GameObject.render | render(ctx)} on every registered
   * object.
   *
   * @param ctx - The canvas 2-D rendering context.
   */
  renderAll(ctx: CanvasRenderingContext2D): void {
    for (const obj of this.getAll()) {
      obj.render(ctx);
    }
  }
}
