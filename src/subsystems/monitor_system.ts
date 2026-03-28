import type { RenderContext } from '../core/renderer/type';
import Monitor from '../debug/monitor';
import type { SubSystem } from './types';

/**
 * MonitorSystem is responsible for displaying debug information on the screen.
 * It uses the Monitor class to track and render various performance metrics,
 *
 * @since 0.2.0
 *
 * @category SubSystems
 */
export class MonitorSystem implements SubSystem {
  id = 'monitor';

  order = 100;

  private monitor = new Monitor();

  update(deltaTime: number) {
    this.monitor.update(deltaTime);
  }

  render(ctx: RenderContext) {
    this.monitor.render(ctx);
  }
}
