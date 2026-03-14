import { Entity } from "../../src";
import { MAP_COLS, MAP_ROWS, TILE_SIZE, VIEW_RADIUS } from "./constants";

export class DungenEnemy extends Entity {
  private wallMap: boolean[][];
  private speed = 40;
  private dx = 0;
  private dy = 0;
  private dirTimer = 0;
  private dirInterval: number;

  private target: Entity | null = null;
  private losCheck: (x0: number, y0: number, x1: number, y1: number) => boolean;
  private chasing = false;
  private chaseSpeed = 60;

  private hp: number;
  private maxHp: number;
  private enemyType: "slime" | "phantom" | "archer";

  private knockbackVx = 0;
  private knockbackVy = 0;
  private knockbackTimer = 0;

  private shootTimer = 1.5;
  private shootInterval = 2;
  private onShoot: ((x: number, y: number, vx: number, vy: number) => void) | null = null;

  constructor(
    id: string,
    x: number,
    y: number,
    wallMap: boolean[][],
    target: Entity,
    losCheck: (x0: number, y0: number, x1: number, y1: number) => boolean,
    type: "slime" | "archer" | "phantom" = "slime",
  ) {
    super(id, x, y, TILE_SIZE, TILE_SIZE);
    this.wallMap = wallMap;
    this.target = target;
    this.losCheck = losCheck;
    this.enemyType = type;
    this.dirInterval = 1 + Math.random() * 2;
    this.pickDirection();

    if (type === "phantom") {
      this.hp = 2;
      this.maxHp = 2;
      this.speed = 50;
      this.chaseSpeed = 80;
    } else if (type === "archer") {
      this.hp = 1;
      this.maxHp = 1;
      this.speed = 30;
      this.chaseSpeed = 30;
    } else {
      this.hp = 1;
      this.maxHp = 1;
      this.speed = 40;
      this.chaseSpeed = 60;
    }
  }

  private pickDirection() {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [0, 0],
    ];
    const pick = dirs[Math.floor(Math.random() * dirs.length)];
    this.dx = pick[0];
    this.dy = pick[1];
    this.dirTimer = 0;
  }

  update(deltaTime: number) {
    const myCol = Math.floor(this.x / TILE_SIZE);
    const myRow = Math.floor(this.y / TILE_SIZE);
    const tCol = Math.floor(this.target!.x / TILE_SIZE);
    const tRow = Math.floor(this.target!.y / TILE_SIZE);

    const dist = Math.abs(myCol - tCol) + Math.abs(myRow - tRow);

    const detectRange = this.enemyType === "archer" ? VIEW_RADIUS + 3
      : this.enemyType === "phantom" ? VIEW_RADIUS + 5
      : VIEW_RADIUS + 2;
    this.chasing = dist < detectRange && this.losCheck(myCol, myRow, tCol, tRow);

    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= deltaTime;
      const newX = this.x + this.knockbackVx * deltaTime;
      const newY = this.y + this.knockbackVy * deltaTime;
      if (!this.collides(newX, this.y)) this.x = newX;
      if (!this.collides(this.x, newY)) this.y = newY;
      return;
    }

    if (this.enemyType === "archer" && this.chasing) {
      const dxToPlayer = this.target!.x - this.x;
      const dyToPlayer = this.target!.y - this.y;
      const len = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);

      const preferredDist = TILE_SIZE * 4;

      if (len > preferredDist + TILE_SIZE) {
        const nx = dxToPlayer / len;
        const ny = dyToPlayer / len;
        const newX = this.x + nx * this.chaseSpeed * deltaTime;
        const newY = this.y + ny * this.chaseSpeed * deltaTime;
        if (!this.collides(newX, this.y)) this.x = newX;
        if (!this.collides(this.x, newY)) this.y = newY;
      } else if (len < preferredDist) {
        const nx = -dxToPlayer / len;
        const ny = -dyToPlayer / len;
        const newX = this.x + nx * this.speed * deltaTime;
        const newY = this.y + ny * this.speed * deltaTime;
        if (!this.collides(newX, this.y)) this.x = newX;
        if (!this.collides(this.x, newY)) this.y = newY;
      }

      this.shootTimer += deltaTime;
      if (this.shootTimer >= this.shootInterval && len > 0 && len < preferredDist + TILE_SIZE * 2 && this.onShoot) {
        this.shootTimer = 0;
        const speed = 120;
        this.onShoot(
          this.x + TILE_SIZE / 2,
          this.y + TILE_SIZE / 2,
          (dxToPlayer / len) * speed,
          (dyToPlayer / len) * speed,
        );
      }
      return;
    }

    if (this.chasing) {
      const dxToPlayer = this.target!.x - this.x;
      const dyToPlayer = this.target!.y - this.y;
      const len = Math.sqrt(dxToPlayer * dxToPlayer + dyToPlayer * dyToPlayer);

      if (len > 0) {
        const nx = dxToPlayer / len;
        const ny = dyToPlayer / len;

        const newX = this.x + nx * this.chaseSpeed * deltaTime;
        const newY = this.y + ny * this.chaseSpeed * deltaTime;

        if (!this.collides(newX, this.y)) this.x = newX;
        if (!this.collides(this.x, newY)) this.y = newY;
      }
    } else {
      this.dirTimer += deltaTime;
      if (this.dirTimer >= this.dirInterval) {
        this.pickDirection();
      }

      const newX = this.x + this.dx * this.speed * deltaTime;
      const newY = this.y + this.dy * this.speed * deltaTime;

      if (!this.collides(newX, this.y)) {
        this.x = newX;
      } else {
        this.pickDirection();
      }
      if (!this.collides(this.x, newY)) {
        this.y = newY;
      } else {
        this.pickDirection();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.enemyType === "archer") {
      ctx.fillStyle = this.chasing ? "#ffff40" : "#cccc30";
      ctx.fillRect(this.x + 1, this.y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      ctx.fillStyle = "#ff4040";
      ctx.fillRect(this.x + 5, this.y + 7, 6, 2);
    } else if (this.enemyType === "phantom") {
      ctx.fillStyle = this.chasing ? "#b050ff" : "#7040a0";
      ctx.fillRect(this.x + 1, this.y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      if (this.hp < this.maxHp) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillRect(this.x + 4, this.y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      }
    } else {
      ctx.fillStyle = this.chasing ? "#ff3030" : "#e05050";
      ctx.fillRect(this.x + 2, this.y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    }
  }

  private collides(px: number, py: number): boolean {
    const left = Math.floor(px / TILE_SIZE);
    const right = Math.floor((px + TILE_SIZE - 1) / TILE_SIZE);
    const top = Math.floor(py / TILE_SIZE);
    const bottom = Math.floor((py + TILE_SIZE - 1) / TILE_SIZE);

    for (let row = top; row <= bottom; row++) {
      for (let col = left; col <= right; col++) {
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
        if (this.wallMap[row][col]) return true;
      }
    }
    return false;
  }

  takeDamage(): boolean {
    this.hp -= 1;
    return this.hp <= 0;
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  applyKnockback(fromX: number, fromY: number) {
    const dx = this.x - fromX;
    const dy = this.y - fromY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    this.knockbackVx = (dx / len) * 200;
    this.knockbackVy = (dy / len) * 200;
    this.knockbackTimer = 0.15;
  }

  setShootCallback(cb: (x: number, y: number, vx: number, vy: number) => void) {
    this.onShoot = cb;
  }

  getType() {
    return this.enemyType;
  }
}
