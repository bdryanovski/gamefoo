import Control from "../core/behaviours/control";
import DynamicEntity from "./dynamic_entity";

export default class Player extends DynamicEntity {
  get control(): Control | undefined {
    return this.getBehavior(Control);
  }

  update(deltaTime: number): void {
    this.updateBehaviors(deltaTime);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
    this.renderBehaviors(ctx);
  }
}
