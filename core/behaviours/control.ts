import type DynamicEntity from "../../entities/dynamic_entity";
import { Behaviour } from "../behaviour";
import type Input from "../input";

export class Control extends Behaviour<DynamicEntity> {
  readonly type = "control";

  private input: Input;

  private speed: number = 400; // pixels per second

  constructor(owner: DynamicEntity, input: Input) {
    super(owner);
    this.input = input;
  }

  update(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    if (this.input.isKeyDown("a") || this.input.isKeyDown("arrowleft")) dx -= 1;
    if (this.input.isKeyDown("d") || this.input.isKeyDown("arrowright"))
      dx += 1;
    if (this.input.isKeyDown("w") || this.input.isKeyDown("arrowup")) dy -= 1;
    if (this.input.isKeyDown("s") || this.input.isKeyDown("arrowdown")) dy += 1;

    // Normalize diagonal movement
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      this.owner.x += (dx / len) * this.speed * deltaTime;
      this.owner.y += (dy / len) * this.speed * deltaTime;
    }
  }
}
