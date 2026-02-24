import { Control } from "../core/behaviours/control";
import DynamicEntity from "./dynamic_entity";

export default class Player extends DynamicEntity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  get control(): Control | undefined {
    return this.getBehavioursByType(Control)[0];
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
