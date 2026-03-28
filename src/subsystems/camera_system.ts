import Camera from "../core/camera";
import type { RenderContext } from "../core/renderer/type";
import type { Vector2 } from "../generic_types";
import type { SubSystem } from "./types";

/**
 * CameraSystem is responsible for managing the camera's position and view.
 * It can follow a target (like a player) and adjust the view accordingly.
 *
 * @since 0.2.0
 *
 * @category SubSystems
 */
export class CameraSystem implements SubSystem {
  /**
   * The unique identifier for this subsystem.
   */
  id = "camera";
  order = 10;

  camera: Camera;

  private target: () => Vector2 | null = () => null;

  constructor(width: number, height: number, target: () => Vector2 | null) {
    this.camera = new Camera(width, height);

    if (target) {
      this.target = target;
    }
  }

  update() {
    let v = null;
    if (this.target) {
      v = this.target();
    }

    if (v !== null) {
      this.camera.follow(v);
    }
  }

  preRender(ctx: RenderContext) {
    const v = this.camera.getViewRect();
    ctx.save();
    ctx.translate(-v.x, -v.y);
  }

  postRender(ctx: RenderContext) {
    ctx.restore();
  }
}
