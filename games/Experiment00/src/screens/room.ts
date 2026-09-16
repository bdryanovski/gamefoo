import { Screen } from '../../../../src/index';
import { showMessage } from '../hud';
import { Campfire } from '../objects/campfire';

/**
 * The game's default screen. Registered with `screens.setDefault(RoomScreen)`
 * so every screen without a bespoke class behaves this way.
 *
 * It adds two things on top of the base engine {@link Screen}: a shared
 * {@link RoomScreen.campfires} accessor that bespoke rooms reuse, and a brief
 * "Room x,y" toast whenever the player enters — demonstrating the per-screen
 * {@link Screen.onEnter} lifecycle hook.
 */
export class RoomScreen extends Screen {
  /** Live campfires currently on this screen. */
  protected campfires(): Campfire[] {
    return this.objectsByType(Campfire);
  }

  protected override onEnter(): void {
    const [x, y] = this.coordinate;
    showMessage(`Room ${x},${y}`, 1.2);
  }
}
