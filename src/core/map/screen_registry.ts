import type { ScreenConstructor } from './screen';
import { screenKey } from './types';

/**
 * Maps a screen coordinate (`"x,y"`) to the {@link Screen} subclass that
 * should represent it, with an optional default class applied to every other
 * screen. Populate it before {@link MapManager.load}; coordinates without an
 * entry fall back to the default class, and if none is set, to the base
 * {@link Screen}.
 *
 * This lets a game keep most screens generic while giving specific rooms
 * bespoke logic — configuring object variants, applying story state, or
 * triggering UI on enter/exit.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const screens = new ScreenRegistry();
 * screens.register(0, 4, DarkChamberScreen); // one bespoke room
 * screens.setDefault(RoomScreen);            // every other room
 * const map = await MapManager.fromUrl('./map.json', { screens });
 * ```
 *
 * @see {@link Screen}
 * @see {@link MapObjectRegistry}
 */
export default class ScreenRegistry {
  private readonly byCoordinate = new Map<string, ScreenConstructor>();
  private defaultConstructor?: ScreenConstructor;

  /**
   * Binds a screen class to a single grid coordinate.
   */
  register(x: number, y: number, ctor: ScreenConstructor): void {
    this.byCoordinate.set(screenKey(x, y), ctor);
  }

  /**
   * Sets the class used for every screen without an explicit coordinate
   * entry.
   */
  setDefault(ctor: ScreenConstructor): void {
    this.defaultConstructor = ctor;
  }

  /**
   * The screen class for `(x, y)` — the per-coordinate entry, else the
   * default, else `undefined` (caller falls back to the base `Screen`).
   */
  resolve(x: number, y: number): ScreenConstructor | undefined {
    return this.byCoordinate.get(screenKey(x, y)) ?? this.defaultConstructor;
  }
}
