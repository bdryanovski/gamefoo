import type DynamicEntity from "../../entities/dynamic_entity";
import { Behaviour } from "../behaviour";

export class HealthKit extends Behaviour<DynamicEntity> {
  readonly type = "HealthKit";

  private health: number;

  constructor(owner: DynamicEntity, health: number) {
    super(owner);
    this.health = health;
  }

  update(_deltaTime: number): void {}
}
