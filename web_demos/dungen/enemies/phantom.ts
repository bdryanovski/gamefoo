import { Entity } from "../../../src";
import { DungenEnemy } from "../enemy";

export class Phantom extends DungenEnemy {
  constructor(
    id: string,
    x: number,
    y: number,
    wallMap: boolean[][],
    target: Entity,
    losCheck: (x0: number, y0: number, x1: number, y1: number) => boolean,
  ) {
    super(id, x, y, wallMap, target, losCheck);

    this.enemyType = "phantom";

    this.hp = 2;
    this.maxHp = 2;
    this.speed = 50;
    this.chaseSpeed = 80;
  }
}
