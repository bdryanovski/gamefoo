import type DynamicEntity from "../../entities/dynamic_entity";
import { Behaviour } from "../behaviour";

export class HealthKit extends Behaviour<DynamicEntity> {
  readonly type = "healthkit";

  private health: number;
  private maxHP: number;

  constructor(owner: DynamicEntity, health: number, maxHP?: number) {
    super(owner);
    this.health = health;
    this.maxHP = maxHP || health;
  }

  update(_deltaTime: number): void {}

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHP, this.health + amount);
  }

  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHP;
  }

  setMaxHealth(value: number): void {
    this.maxHP = value;
    if (this.health > this.maxHP) {
      this.health = this.maxHP;
    }
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  getHealthPercent(): number {
    return this.maxHP > 0 ? this.health / this.maxHP : 0;
  }
}
