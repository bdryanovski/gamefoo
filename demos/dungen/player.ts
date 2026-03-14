import { Entity, Input } from "../../src";
import {
  DASH_COOLDOWN,
  DASH_DURATION,
  DASH_SPEED,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
} from "./constants";

export class DungenPlayer extends Entity {
  private input: Input;
  private speed = 100;

  private wallMap: boolean[][];

  private hp = 3;
  private maxHp = 3;
  private invincibleTimer = 0;

  private facing: { x: number; y: number } = { x: 0, y: 1 };

  private attackTimer = 0;
  private attacking = false;

  private dashCooldown = 0;
  private dashTimer = 0;
  private dashing = false;

  constructor(x: number, y: number, input: Input, wallMap: boolean[][]) {
    super("player", x, y, TILE_SIZE, TILE_SIZE);
    this.input = input;
    this.wallMap = wallMap;
  }

  update(deltaTime: number) {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= deltaTime;
    }

    if (this.attackTimer > 0) {
      this.attackTimer -= deltaTime;
      if (this.attackTimer <= 0) this.attacking = false;
    }

    if (this.input.isKeyDown(" ") && !this.attacking) {
      this.attacking = true;
      this.attackTimer = 0.2;
    }

    let dx = 0;
    let dy = 0;

    if (this.input.isKeyDown("w") || this.input.isKeyDown("ArrowUp")) dy = -1;
    if (this.input.isKeyDown("s") || this.input.isKeyDown("ArrowDown")) dy = 1;
    if (this.input.isKeyDown("a") || this.input.isKeyDown("ArrowLeft")) dx = -1;
    if (this.input.isKeyDown("d") || this.input.isKeyDown("ArrowRight")) dx = 1;

    if (dx !== 0 && dy !== 0) {
      const diag = 1 / Math.sqrt(2);
      dx *= diag;
      dy *= diag;
    }

    if (dx !== 0 || dy !== 0) {
      this.facing = { x: Math.sign(dx), y: Math.sign(dy) };
    }

    if (this.dashCooldown > 0) {
      this.dashCooldown -= deltaTime;
    }

    if (
      this.input.isKeyDown("x") &&
      this.dashCooldown <= 0 &&
      (dx !== 0 || dy !== 0) &&
      !this.dashing
    ) {
      this.dashing = true;
      this.dashTimer = DASH_DURATION;
      this.dashCooldown = DASH_COOLDOWN;
    }

    if (this.dashing) {
      this.dashTimer -= deltaTime;
      if (this.dashTimer <= 0) this.dashing = false;
    }

    const currentSpeed = this.dashing ? DASH_SPEED : this.speed;

    const newX = this.x + dx * currentSpeed * deltaTime;
    const newY = this.y + dy * currentSpeed * deltaTime;

    if (!this.collides(newX, this.y)) {
      this.x = newX;
    }
    if (!this.collides(this.x, newY)) {
      this.y = newY;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer * 10) % 2 === 0) {
      return;
    }

    if (this.dashing) {
      ctx.fillStyle = "rgba(127, 219, 202, 0.3)";
      ctx.fillRect(
        this.x - this.facing.x * TILE_SIZE * 0.5,
        this.y - this.facing.y * TILE_SIZE * 0.5,
        TILE_SIZE,
        TILE_SIZE,
      );
    }

    ctx.fillStyle = this.dashing ? "#ffffff" : "#7fdbca";
    ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);

    if (this.attacking) {
      const box = this.getAttackBox();
      ctx.fillStyle = "rgba(255, 255, 100, 0.6)";
      ctx.fillRect(box.x, box.y, box.w, box.h);
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

  getHp(): number {
    return this.hp;
  }
  getMaxHp(): number {
    return this.maxHp;
  }
  isAlive(): boolean {
    return this.hp > 0;
  }

  takeDamage() {
    if (this.invincibleTimer > 0 || this.dashing) return;
    this.hp -= 1;
    this.invincibleTimer = 1.0;
  }

  getDashCooldown(): number {
    return this.dashCooldown;
  }

  isAttacking(): boolean {
    return this.attacking;
  }
  getFacing(): { x: number; y: number } {
    return this.facing;
  }

  getAttackBox(): { x: number; y: number; w: number; h: number } {
    return {
      x: this.x + this.facing.x * TILE_SIZE,
      y: this.y + this.facing.y * TILE_SIZE,
      w: TILE_SIZE,
      h: TILE_SIZE,
    };
  }

  heal(amount: number) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }
}
