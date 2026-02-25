import type { Control } from "../core/behaviours/control";
import type { HealthKit } from "../core/behaviours/healtkit";
import DynamicEntity from "./dynamic_entity";

export default class Player extends DynamicEntity {
  get control(): Control | undefined {
    return this.getBehaviour<Control>("control");
  }

  get healthkit(): HealthKit | undefined {
    return this.getBehaviour<HealthKit>("healthkit");
  }

  update(deltaTime: number): void {
    this.updateBehaviours(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
    this.renderBehaviours(ctx);
  }
}
