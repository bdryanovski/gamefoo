import GameObjectRegister from '../core/game_object_register';
import type { RenderContext } from '../core/renderer/type';
import type { GameObject } from '../entities/types';
import type { SubSystem } from './types';

/**
 * Configuration options for {@link ObjectSystem}.
 *
 * @since 0.4.0
 * @category SubSystems
 */
export interface ObjectSystemConfig {
  /**
   * When `true`, objects are Y-sorted (by `y` position ascending)
   * before each render pass. Essential for isometric games where
   * objects closer to the camera must draw on top.
   *
   * @defaultValue `false`
   */
  depthSort?: boolean;
}

/**
 * ObjectSystem is responsible for managing all non-player game objects within the engine.
 * It maintains a central registry of game objects and delegates per-frame update and render calls to them.
 *
 * @since 0.2.0
 * @category SubSystems
 */
export class ObjectSystem implements SubSystem {
  id = 'objects';

  order = 20;

  private objects: GameObjectRegister = new GameObjectRegister();

  private _depthSort: boolean;

  /**
   * @param objects - Initial list of game objects to register.
   * @param config  - Optional configuration (depth sorting, etc.).
   *
   * @since 0.2.0
   */
  constructor(objects: GameObject[] = [], config?: ObjectSystemConfig) {
    this._depthSort = config?.depthSort ?? false;
    for (const obj of objects) {
      this.objects.register(obj);
    }
  }

  update(deltaTime: number) {
    this.objects.updateAll(deltaTime);
  }

  render(ctx: RenderContext) {
    if (this._depthSort) {
      this.objects.sort((a, b) => a.y - b.y);
    }
    this.objects.renderAll(ctx);
  }
}
