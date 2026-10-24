import type { MapObjectConstructor } from './map_object';

/**
 * Maps an object-type key to the {@link MapObject} subclass that should
 * represent it. Populate it before {@link MapManager.load}; machine
 * placements whose key is unregistered fall back to the base `MapObject`.
 *
 * The loader resolves a placement's key as `properties.class` if present,
 * otherwise the object's `name`.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const registry = new MapObjectRegistry();
 * registry.register(Chest);            // uses Chest.type
 * registry.register("torch", Torch);   // explicit key
 * const map = await MapManager.fromUrl("./map.json", { registry });
 * ```
 *
 * @see {@link MapObject}
 */
export default class MapObjectRegistry {
  private readonly byType = new Map<string, MapObjectConstructor>();

  /**
   * Registers a class. With one argument the class's static `type` is the
   * key; with two, the first argument is an explicit key.
   *
   * @throws {Error} When called with a single class that has no static
   *   `type`.
   */
  register(ctor: MapObjectConstructor): void;
  register(type: string, ctor: MapObjectConstructor): void;
  register(a: MapObjectConstructor | string, b?: MapObjectConstructor): void {
    if (typeof a === 'string') {
      if (!b) {
        throw new Error(`MapObjectRegistry.register("${a}", …) requires a class`);
      }
      this.byType.set(a, b);
      return;
    }
    if (!a.type) {
      throw new Error(
        'MapObjectRegistry.register(Class) requires a static `type`; ' +
          'pass an explicit key instead: register("key", Class)',
      );
    }
    this.byType.set(a.type, a);
  }

  /**
   * The class registered for `key`, or `undefined`.
   */
  resolve(key: string): MapObjectConstructor | undefined {
    return this.byType.get(key);
  }
}
