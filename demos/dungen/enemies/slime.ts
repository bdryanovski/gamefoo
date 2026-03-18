import { Entity } from "../../../src";
import { DungenEnemy } from "../enemy";

export class Slime extends DungenEnemy {
  constructor(
    id: string,
    x: number,
    y: number,
    wallMap: boolean[][],
    target: Entity,
    losCheck: (x0: number, y0: number, x1: number, y1: number) => boolean,
  ) {
    super(id, x, y, wallMap, target, losCheck);

    this.enemyType = "slime";

    this.hp = 1;
    this.maxHp = 1;
    this.speed = 40;
    this.chaseSpeed = 60;
  }
}
