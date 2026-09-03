import { showMessage } from '../hud';
import { RoomScreen } from './room';

/**
 * A bespoke room bound to one coordinate via `screens.register(x, y, ...)`.
 *
 * It overrides {@link RoomScreen.onEnter} to give the chamber its own
 * character: every campfire spawns **dead and cold** (a per-screen object
 * variant applied through {@link Campfire.extinguish}), and a story line is
 * pushed to the HUD instead of the generic room toast. This is the pattern
 * for enemy variants too — e.g. a screen could recolour/level a `Skeleton`
 * here without the map data knowing anything about it.
 */
export class DarkChamberScreen extends RoomScreen {
  protected override onEnter(): void {
    for (const fire of this.campfires()) {
      fire.extinguish();
    }
    showMessage('A cold draft drifts through. The fires here are long dead.', 3.5);
  }
}
