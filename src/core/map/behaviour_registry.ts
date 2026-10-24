import type MapObject from './map_object';
import type { MapObjectBehaviour } from './map_behaviour';

/**
 * Builds one behaviour for an owner. Factories read tuning from the owner's
 * authored `properties`; an optional shared `services` bag (threaded from
 * {@link MapLoadOptions.services}) lets a factory reach game singletons
 * (a fog instance, a state store) without importing them directly.
 */
export type BehaviourFactory = (owner: MapObject, services?: object) => MapObjectBehaviour;

/**
 * Maps an authored behaviour `type` to a factory, so behaviors become
 * placeable from the editor like object classes are today.
 *
 * An object authors its behaviours in the map project (its prefab `behaviours`
 * list, optionally overridden per placement); on screen activation each name is
 * resolved here, constructed with the instance as owner, and attached.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const behaviours = new MapObjectBehaviourRegistry();
 * behaviours.register('light-source', (o) => new LightSource(o));
 *
 * const map = await MapManager.fromUrl('./map.json', { behaviours });
 * ```
 *
 * @see {@link MapObjectBehaviour}
 */
export class MapObjectBehaviourRegistry {
  private readonly factories = new Map<string, BehaviourFactory>();

  /**
   * Registers a factory under `type`.
   */
  register(type: string, factory: BehaviourFactory): void {
    this.factories.set(type, factory);
  }

  /**
   * The factory registered for `type`, or `undefined`.
   */
  resolve(type: string): BehaviourFactory | undefined {
    return this.factories.get(type);
  }
}
