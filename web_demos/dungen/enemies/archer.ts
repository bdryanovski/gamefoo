import { Entity } from "../../../src";
import { DungenEnemy } from "../enemy";

export class Archer extends DungenEnemy {
  constructor(
    id: string,
    x: number,
    y: number,
    wallMap: boolean[][],
    target: Entity,
    losCheck: (x0: number, y0: number, x1: number, y1: number) => boolean,
  ) {
    super(id, x, y, wallMap, target, losCheck);

    this.enemyType = "archer";

    this.hp = 1;
    this.maxHp = 1;
    this.speed = 30;
    this.chaseSpeed = 30;
  }
}
