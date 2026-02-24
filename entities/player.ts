import { Control } from "../core/behaviours/control";
import { HealthKit } from "../core/behaviours/healtkit";
import DynamicEntity from "./dynamic_entity";

export default class Player extends DynamicEntity {
  constructor(id: string, x: number, y: number, width: number, height: number) {
    super(id, x, y, width, height);
  }

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
