import type { RenderContext } from "../../src/core/renderer/type";
import { Asset, Engine, Input, PerlinNoise, Sprite, WebRenderer } from "../../src/index";
import {
  CANVAS_H,
  CANVAS_W,
  GROUNDS,
  MAP_COLS,
  MAP_ROWS,
  MINIMAP_PADDING,
  MINIMAP_SCALE,
  TILE,
  TILE_SIZE,
  VIEW_RADIUS,
  VIS_SEEN,
  VIS_UNSEEN,
  VIS_VISIBLE,
} from "./constants";
import { Archer } from "./enemies/archer";
import { Phantom } from "./enemies/phantom";
import { Slime } from "./enemies/slime";
import type { DungenEnemy } from "./enemy";
import { DungenPlayer } from "./player";
import { drawTile } from "./utils";

let SEED = 44;

class DungenEngine extends Engine {
  private ready = false;
  private assets: any;

  private tileMap: number[][] = [];
  private wallMap: boolean[][] = [];
  private decorMap: (number | null)[][] = [];
  private visMap: number[][] = [];

  // PLayer
  private input = new Input();
  private player!: DungenPlayer;

  // camera
  private cameraX = 0;
  private cameraY = 0;

  private score = 0;
  private eWasDown = false;

  private enemies: DungenEnemy[] = [];
  private gameOver = false;
  private rWasDown = false;
  private kills = 0;

  // levels
  private level = 1;
  private exitCol = 0;
  private exitRow = 0;

  // power ups
  private messages: { text: string; x: number; y: number; timer: number }[] = [];

  private shakeTimer = 0;
  private shakeIntensity = 0;
  private damageFlashTimer = 0;

  private particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }[] = [];

  private lightMap: boolean[][] = [];

  private drops: {
    x: number;
    y: number;
    type: "hp" | "loot";
    timer: number;
  }[] = [];

  private projectiles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }[] = [];

  constructor(width: number, height: number) {
    super(new WebRenderer("game", width, height), {
      backgroundColor: "#000",
      gameScale: 1,
    });

    this.initialize();
  }

  protected async initialize() {
    const res = await fetch("/dungen/assets/dungen.grid.json");
    const data = await res.json();
    const image = await Asset.load("/dungen/assets/" + data.meta.image);
    const sprite = Sprite.fromGrid(image, data.grid, data.animations);

    this.assets = sprite;
    this.generateMap();

    const spawn = this.findSpawnPoint();
    this.player = new DungenPlayer(spawn.x, spawn.y, this.input, this.wallMap);

    this.placeExit();
    this.ensureConnected();
    this.spawnEnemies(15);
    this.ready = true;
  }

  private restart() {
    SEED = Math.floor(Math.random() * 100000);
    this.score = 0;
    this.kills = 0;
    this.level = 1;
    this.gameOver = false;
    this.enemies = [];
    this.messages = [];
    this.particles = [];
    this.projectiles = [];

    this.generateMap();

    const spawn = this.findSpawnPoint();
    this.player = new DungenPlayer(spawn.x, spawn.y, this.input, this.wallMap);

    this.placeExit();
    this.ensureConnected();
    this.spawnEnemies(15);
  }

  override update(delta: number) {
    if (!this.ready) return;

    const rDown = this.input.isKeyDown("r");
    if (rDown && !this.rWasDown) {
      this.restart();
    }
    this.rWasDown = rDown;

    if (this.gameOver) return;

    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer -= delta;
    }

    this.player.update(delta);

    for (const enemy of this.enemies) {
      enemy.update(delta);
    }
    this.checkPlayerAttack();
    this.checkEnemyCollision();

    if (!this.player.isAlive()) {
      this.gameOver = true;
      return;
    }

    this.particles = this.particles.filter((p) => {
      p.life -= delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 80 * delta;
      return p.life > 0;
    });

    this.projectiles = this.projectiles.filter((p) => {
      p.life -= delta;
      p.x += p.vx * delta;
      p.y += p.vy * delta;

      const col = Math.floor(p.x / TILE_SIZE);
      const row = Math.floor(p.y / TILE_SIZE);
      if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS && this.wallMap[row]?.[col]) {
        return false;
      }

      if (this.player.isAttacking()) {
        const box = this.player.getAttackBox();
        if (p.x > box.x && p.x < box.x + box.w && p.y > box.y && p.y < box.y + box.h) {
          let nearest: DungenEnemy | null = null;
          let nearestDist = Infinity;
          for (const e of this.enemies) {
            const d = Math.abs(e.x - p.x) + Math.abs(e.y - p.y);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = e;
            }
          }
          if (nearest) {
            const dx = nearest.x - p.x;
            const dy = nearest.y - p.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            p.vx = (dx / len) * 180;
            p.vy = (dy / len) * 180;
          } else {
            p.vx *= -1;
            p.vy *= -1;
          }
          p.life = 3;
          this.spawnParticles(p.x, p.y, "#ffffff", 4);
          this.messages.push({
            text: "DEFLECT!",
            x: p.x - 16,
            y: p.y - 12,
            timer: 0.8,
          });
          return true;
        }
      }

      for (const enemy of this.enemies) {
        if (p.x > enemy.x && p.x < enemy.x + TILE_SIZE && p.y > enemy.y && p.y < enemy.y + TILE_SIZE) {
          enemy.takeDamage();
          enemy.applyKnockback(p.x, p.y);
          if (enemy.isDead()) {
            this.spawnParticles(enemy.x, enemy.y, "#ff6060", 8);
            this.spawnDrop(enemy.x, enemy.y);
            this.kills += 1;
          } else {
            this.spawnParticles(enemy.x, enemy.y, "#ffffff", 4);
          }
          return false;
        }
      }
      this.enemies = this.enemies.filter((e) => !e.isDead());

      const px = this.player.x;
      const py = this.player.y;
      if (p.x > px && p.x < px + TILE_SIZE && p.y > py && p.y < py + TILE_SIZE) {
        const hpBefore = this.player.getHp();
        this.player.takeDamage();
        if (this.player.getHp() < hpBefore) {
          this.triggerShake(3, 0.2);
          this.damageFlashTimer = 0.2;
        }
        return false;
      }

      return p.life > 0;
    });

    this.drops = this.drops.filter((d) => {
      d.timer -= delta;
      const px = Math.floor(this.player.x / TILE_SIZE);
      const py = Math.floor(this.player.y / TILE_SIZE);
      const dx = Math.floor(d.x / TILE_SIZE);
      const dy = Math.floor(d.y / TILE_SIZE);

      if (px === dx && py === dy) {
        if (d.type === "hp" && this.player.getHp() < this.player.getMaxHp()) {
          this.player.heal(1);
          this.messages.push({ text: "+1 HP", x: d.x, y: d.y, timer: 1.5 });
        } else {
          this.score += 1;
          this.messages.push({ text: "+1 Loot", x: d.x, y: d.y, timer: 1.0 });
        }
        this.spawnParticles(d.x, d.y, d.type === "hp" ? "#ff5050" : "#ffdd44", 4);
        return false;
      }

      return d.timer > 0;
    });

    this.checkInteraction();
    this.messages = this.messages.filter((m) => {
      m.timer -= delta;
      m.y -= 20 * delta;
      return m.timer > 0;
    });

    this.checkExit();
    this.updateCamera();
    if (this.shakeTimer > 0) {
      this.shakeTimer -= delta;
    }
    this.updateVisibility();
  }

  override render(ctx: RenderContext) {
    const c = ctx.getCanvas!()!
    if (!this.ready) return;

    c.save();

    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * 2 * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * 2 * this.shakeIntensity;
    }

    c.translate(-this.cameraX + shakeX, -this.cameraY + shakeY);

    // Draw only visible on screen
    const startCol = Math.max(0, Math.floor(this.cameraX / TILE_SIZE));
    const endCol = Math.min(MAP_COLS, Math.ceil((this.cameraX + CANVAS_W) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(this.cameraY / TILE_SIZE));
    const endRow = Math.min(MAP_ROWS, Math.ceil((this.cameraY + CANVAS_H) / TILE_SIZE));

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        drawTile(ctx, this.assets, this.tileMap[row]?.[col] ?? 0, col, row);
      }
    }

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const decor = this.decorMap[row]?.[col];
        if (decor !== null && decor !== undefined) {
          drawTile(ctx, this.assets, decor, col, row);
        }
      }
    }

    for (const d of this.drops) {
      const col = Math.floor(d.x / TILE_SIZE);
      const row = Math.floor(d.y / TILE_SIZE);
      if (col < startCol || col >= endCol || row < startRow || row >= endRow) continue;
      if (this.visMap[row]?.[col] !== VIS_VISIBLE) continue;

      const bob = Math.sin(d.timer * 4) * 2;
      c.fillStyle = d.type === "hp" ? "#ff5050" : "#ffdd44";
      c.fillRect(d.x + 4, d.y + 4 + bob, TILE_SIZE - 8, TILE_SIZE - 8);
      c.fillStyle = "rgba(255, 255, 255, 0.5)";
      c.fillRect(d.x + 6, d.y + 5 + bob, 3, 3);
    }

    const exitVis = this.visMap[this.exitRow]?.[this.exitCol];
    if (exitVis === VIS_VISIBLE || exitVis === VIS_SEEN) {
      c.fillStyle = exitVis === VIS_VISIBLE ? "#50e050" : "#2a7a2a";
      c.fillRect(this.exitCol * TILE_SIZE + 2, this.exitRow * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      if (exitVis === VIS_VISIBLE) {
        c.strokeStyle = "#90ff90";
        c.lineWidth = 1;
        c.strokeRect(this.exitCol * TILE_SIZE + 1, this.exitRow * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      }
    }

    this.player.render(ctx);

    for (const msg of this.messages) {
      c.font = "bold 10px 'Courier New', monospace";
      c.fillStyle = `rgba(255, 255, 255, ${Math.min(1, msg.timer)})`;
      c.fillText(msg.text, msg.x, msg.y);
    }

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const vis = this.visMap[row]?.[col];
        if (vis === VIS_VISIBLE) continue;

        if (vis === VIS_SEEN && this.lightMap[row]?.[col]) {
          c.fillStyle = "rgba(20, 10, 0, 0.4)";
        } else if (vis === VIS_SEEN) {
          c.fillStyle = "rgba(0, 0, 0, 0.6)";
        } else {
          c.fillStyle = "rgba(0, 0, 0, 1)";
        }
        c.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const p of this.particles) {
      const alpha = Math.min(1, p.life * 3);
      const size = 1 + p.life * 3;
      c.globalAlpha = alpha;
      c.fillStyle = p.color;
      c.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }
    c.globalAlpha = 1;

    for (const enemy of this.enemies) {
      const ecol = Math.floor(enemy.x / TILE_SIZE);
      const erow = Math.floor(enemy.y / TILE_SIZE);
      if (erow >= 0 && erow < MAP_ROWS && ecol >= 0 && ecol < MAP_COLS && this.visMap[erow]?.[ecol] === VIS_VISIBLE) {
        enemy.render(ctx);
      }
    }

    for (const proj of this.projectiles) {
      const col = Math.floor(proj.x / TILE_SIZE);
      const row = Math.floor(proj.y / TILE_SIZE);
      if (row >= 0 && row < MAP_ROWS && col >= 0 && col < MAP_COLS && this.visMap[row]?.[col] === VIS_VISIBLE) {
        c.fillStyle = "#ff4444";
        c.beginPath();
        c.arc(proj.x, proj.y, 3, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "#ffaa00";
        c.beginPath();
        c.arc(proj.x, proj.y, 1.5, 0, Math.PI * 2);
        c.fill();
      }
    }

    if (this.damageFlashTimer > 0) {
      const alpha = (this.damageFlashTimer / 0.3) * 0.3;
      c.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      c.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    c.restore();
    this.renderMinimap(ctx);
    this.renderHUD(ctx);
  }
  private triggerShake(intensity: number, duration: number) {
    this.shakeIntensity = intensity;
    this.shakeTimer = duration;
  }

  private isWall(col: number, row: number): boolean {
    if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return true;
    return this.wallMap[row]?.[col] ?? false;
  }

  private autoTile() {
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        if (!this.isWall(col, row)) continue;

        const up = !this.isWall(col, row - 1);
        const down = !this.isWall(col, row + 1);
        const left = !this.isWall(col - 1, row);
        const right = !this.isWall(col + 1, row);

        if (down && right) {
          this.tileMap[row]![col] = TILE.CORNER_TL;
        } else if (down && left) {
          this.tileMap[row]![col] = TILE.CORNER_TR;
        } else if (up && right) {
          this.tileMap[row]![col] = TILE.CORNER_BL;
        } else if (up && left) {
          this.tileMap[row]![col] = TILE.CORNER_BR;
        } else if (down) {
          this.tileMap[row]![col] = TILE.WALL_TOP;
        } else if (up) {
          this.tileMap[row]![col] = TILE.WALL_BOTTOM;
        } else if (right) {
          this.tileMap[row]![col] = TILE.WALL_LEFT;
        } else if (left) {
          this.tileMap[row]![col] = TILE.WALL_RIGHT;
        } else {
          this.tileMap[row]![col] = TILE.WALL_INNER;
        }
      }
    }
  }

  private generateMap() {
    const perlin = new PerlinNoise(SEED);
    const scale = 10;
    const wallThreshold = 0.0;

    this.wallMap = [];
    this.tileMap = [];

    for (let row = 0; row < MAP_ROWS; row++) {
      const wallLine: boolean[] = [];
      const tileLine: number[] = [];
      for (let col = 0; col < MAP_COLS; col++) {
        const isBorder = row === 0 || row === MAP_ROWS - 1 || col === 0 || col === MAP_COLS - 1;
        const isWall = isBorder || perlin.fbm(col / scale, row / scale, 4, 2, 0.5) > wallThreshold;

        wallLine.push(isWall);

        if (isWall) {
          tileLine.push(TILE.WALL_INNER);
        } else {
          const noiseVal = perlin.fbm(col / scale, row / scale, 4, 2, 0.5);
          const groundIndex = Math.abs(Math.floor(noiseVal * 100)) % GROUNDS.length;
          tileLine.push(GROUNDS[groundIndex] ?? 0);
        }
      }
      this.wallMap.push(wallLine);
      this.tileMap.push(tileLine);
    }

    this.autoTile();
    this.placeDecorations();
    this.ensureConnected();

    this.visMap = [];
    for (let row = 0; row < MAP_ROWS; row++) {
      this.visMap.push(new Array(MAP_COLS).fill(VIS_UNSEEN));
    }

    this.buildLightMap();
  }

  private placeDecorations() {
    const perlin = new PerlinNoise(SEED + 99);
    this.decorMap = [];

    for (let row = 0; row < MAP_ROWS; row++) {
      const line: (number | null)[] = [];
      for (let col = 0; col < MAP_COLS; col++) {
        if (this.wallMap[row]?.[col]) {
          line.push(null);
          continue;
        }

        const val = perlin.noise2d(col * 3.7, row * 3.7);

        if (val > 0.55) {
          line.push(TILE.CHEST_1);
          this.wallMap[row]![col] = true;
        } else if (val > 0.45) {
          line.push(TILE.FIRE_0);
          this.wallMap[row]![col] = false;
        } else {
          line.push(null);
        }
      }
      this.decorMap.push(line);
    }
  }

  private updateVisibility() {
    const px = Math.floor(this.player.x / TILE_SIZE);
    const py = Math.floor(this.player.y / TILE_SIZE);

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        if (this.visMap[row]?.[col] === VIS_VISIBLE) {
          this.visMap[row]![col] = VIS_SEEN;
        }
      }
    }

    // player view
    for (let dy = -VIEW_RADIUS; dy <= VIEW_RADIUS; dy++) {
      for (let dx = -VIEW_RADIUS; dx <= VIEW_RADIUS; dx++) {
        if (dx * dx + dy * dy > VIEW_RADIUS * VIEW_RADIUS) continue;

        const col = px + dx;
        const row = py + dy;
        if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) continue;

        if (this.hasLineOfSight(px, py, col, row)) {
          this.visMap[row]![col] = VIS_VISIBLE;
        }
      }
    }

    // torch light — reveal as VIS_SEEN if still unseen
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        if (this.lightMap[row]?.[col] && this.visMap[row]?.[col] === VIS_UNSEEN) {
          this.visMap[row]![col] = VIS_SEEN;
        }
      }
    }
  }

  private hasLineOfSight(x0: number, y0: number, x1: number, y1: number): boolean {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (this.wallMap[y0]?.[x0] && !(x0 === x1 && y0 === y1)) return false;
      if (x0 === x1 && y0 === y1) return true;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  // Drop the player at start

  private findSpawnPoint(): { x: number; y: number } {
    for (let row = 1; row < MAP_ROWS - 1; row++) {
      for (let col = 1; col < MAP_COLS - 1; col++) {
        if (!this.wallMap[row]?.[col]) {
          return { x: col * TILE_SIZE, y: row * TILE_SIZE };
        }
      }
    }
    return { x: TILE_SIZE, y: TILE_SIZE };
  }

  // camera
  private updateCamera() {
    const playerPos = this.player.getPosition();
    const mapPixelW = MAP_COLS * TILE_SIZE;
    const mapPixelH = MAP_ROWS * TILE_SIZE;

    this.cameraX = playerPos.x - CANVAS_W / 2;
    this.cameraY = playerPos.y - CANVAS_H / 2;

    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraY < 0) this.cameraY = 0;
    if (this.cameraX > mapPixelW - CANVAS_W) this.cameraX = mapPixelW - CANVAS_W;
    if (this.cameraY > mapPixelH - CANVAS_H) this.cameraY = mapPixelH - CANVAS_H;
  }

  private renderMinimap(renderCtx: RenderContext) {
    const ctx = renderCtx.getCanvas!()!
    const mmW = MAP_COLS * MINIMAP_SCALE;
    const mmH = MAP_ROWS * MINIMAP_SCALE;
    const mmX = CANVAS_W - mmW - MINIMAP_PADDING;
    const mmY = MINIMAP_PADDING;

    // background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(mmX - 1, mmY - 1, mmW + 2, mmH + 2);

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const vis = this.visMap[row]?.[col];
        if (vis === VIS_UNSEEN) continue;

        const alpha = vis === VIS_VISIBLE ? 1.0 : 0.4;

        if (this.wallMap[row]?.[col]) {
          ctx.fillStyle = `rgba(80, 60, 120, ${alpha})`;
        } else if (this.lightMap[row]?.[col] && vis === VIS_SEEN) {
          ctx.fillStyle = `rgba(200, 160, 80, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(160, 140, 100, ${alpha})`;
        }

        ctx.fillRect(mmX + col * MINIMAP_SCALE, mmY + row * MINIMAP_SCALE, MINIMAP_SCALE, MINIMAP_SCALE);
      }
    }

    // player dot
    const px = Math.floor(this.player.x / TILE_SIZE);
    const py = Math.floor(this.player.y / TILE_SIZE);
    ctx.fillStyle = "#7fdbca";
    ctx.fillRect(mmX + px * MINIMAP_SCALE, mmY + py * MINIMAP_SCALE, MINIMAP_SCALE + 1, MINIMAP_SCALE + 1);

    const eVis = this.visMap[this.exitRow]?.[this.exitCol];
    if (eVis && eVis !== VIS_UNSEEN) {
      ctx.fillStyle = "#50e050";
      ctx.fillRect(
        mmX + this.exitCol * MINIMAP_SCALE,
        mmY + this.exitRow * MINIMAP_SCALE,
        MINIMAP_SCALE + 1,
        MINIMAP_SCALE + 1,
      );
    }
  }

  private checkInteraction() {
    const eDown = this.input.isKeyDown("e");

    if (eDown && !this.eWasDown) {
      const px = Math.floor(this.player.x / TILE_SIZE);
      const py = Math.floor(this.player.y / TILE_SIZE);

      const neighbors = [
        [px, py],
        [px - 1, py],
        [px + 1, py],
        [px, py - 1],
        [px, py + 1],
      ];

      for (const [col, row] of neighbors as [number, number][]) {
        if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) continue;

        if (this.decorMap[row]?.[col] === TILE.CHEST_1) {
          this.decorMap[row]![col] = TILE.CHEST_0;
          this.wallMap[row]![col] = false;
          this.score += 1;

          if (this.player.getHp() < this.player.getMaxHp() && Math.random() < 0.5) {
            this.player.heal(1);
            this.messages.push({
              text: "+1 HP",
              x: col * TILE_SIZE,
              y: row * TILE_SIZE,
              timer: 1.5,
            });
          } else {
            this.messages.push({
              text: "+1 Loot",
              x: col * TILE_SIZE,
              y: row * TILE_SIZE,
              timer: 1.0,
            });
          }
          this.spawnParticles(col * TILE_SIZE, row * TILE_SIZE, "#ffdd44", 6);
          break;
        }
      }
    }

    this.eWasDown = eDown;
  }

  // hud
  private renderHUD(renderCtx: RenderContext) {
    const ctx = renderCtx.getCanvas!()!
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(MINIMAP_PADDING, MINIMAP_PADDING, 165, 90);

    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#7fdbca";
    ctx.fillText(`Lv.${this.level}  Seed: ${SEED}`, MINIMAP_PADDING + 8, MINIMAP_PADDING + 16);
    ctx.fillText(`Chests: ${this.score}`, MINIMAP_PADDING + 8, MINIMAP_PADDING + 34);

    const hearts = "♥".repeat(this.player.getHp()) + "♡".repeat(this.player.getMaxHp() - this.player.getHp());
    ctx.fillStyle = "#e05050";
    ctx.fillText(`HP: ${hearts}`, MINIMAP_PADDING + 8, MINIMAP_PADDING + 52);

    ctx.fillStyle = "#ffff64";
    ctx.fillText(`Kills: ${this.kills}`, MINIMAP_PADDING + 8, MINIMAP_PADDING + 70);

    if (this.enemies.length === 0) {
      ctx.fillStyle = "#50e050";
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.fillText("FLOOR CLEARED!", MINIMAP_PADDING + 8, MINIMAP_PADDING + 85);
      ctx.font = "12px 'Courier New', monospace";
    } else {
      ctx.fillStyle = "#666";
      ctx.fillText("[SPACE] [X] [E] [R]", MINIMAP_PADDING + 8, MINIMAP_PADDING + 85);
    }

    if (this.gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, CANVAS_H / 2 - 40, CANVAS_W, 80);

      ctx.font = "bold 28px 'Courier New', monospace";
      ctx.fillStyle = "#e05050";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2);

      ctx.font = "14px 'Courier New', monospace";
      ctx.fillStyle = "#aaa";
      ctx.fillText(`Score: ${this.score} chests, ${this.kills} kills`, CANVAS_W / 2, CANVAS_H / 2 + 24);

      ctx.fillText("Press R to restart", CANVAS_W / 2, CANVAS_H / 2 + 44);
      ctx.textAlign = "left";
    }
  }

  // Enemies
  private spawnEnemies(count: number) {
    const perlin = new PerlinNoise(SEED + 200);
    const spawn = this.findSpawnPoint();
    const reachable = this.floodFill(Math.floor(spawn.x / TILE_SIZE), Math.floor(spawn.y / TILE_SIZE));
    const candidates: { x: number; y: number }[] = [];
    const losCheck = this.hasLineOfSight.bind(this);

    for (let row = 2; row < MAP_ROWS - 2; row++) {
      for (let col = 2; col < MAP_COLS - 2; col++) {
        if (this.wallMap[row]?.[col]) continue;
        if (this.decorMap[row]?.[col] !== null) continue;
        if (!reachable.has(`${col},${row}`)) continue;

        const val = perlin.noise2d(col * 5.3, row * 5.3);
        if (val > 0.6) {
          candidates.push({ x: col * TILE_SIZE, y: row * TILE_SIZE });
        }
      }
    }

    const phantomChance = Math.min(0.3, this.level * 0.08);
    const archerChance = 0.3;

    for (let i = 0; i < Math.min(count, candidates.length); i++) {
      const pos = candidates[i]!;
      const roll = Math.random();
      let type: "slime" | "phantom" | "archer";
      if (roll < archerChance) {
        type = "archer";
      } else if (roll < archerChance + phantomChance) {
        type = "phantom";
      } else {
        type = "slime";
      }

      let enemy: DungenEnemy | undefined;

      if (type === "phantom") {
        enemy = new Phantom(`enemy_${i}`, pos.x, pos.y, this.wallMap, this.player, losCheck);
      }

      if (type === "archer") {
        enemy = new Archer(`enemy_${i}`, pos.x, pos.y, this.wallMap, this.player, losCheck);

        enemy.setShootCallback((x, y, vx, vy) => {
          this.projectiles.push({ x, y, vx, vy, life: 3 });
        });
      }

      if (type === "slime") {
        enemy = new Slime(`enemy_${i}`, pos.x, pos.y, this.wallMap, this.player, losCheck);
      }

      if (enemy) this.enemies.push(enemy);
    }
  }

  private checkEnemyCollision() {
    const px = this.player.x;
    const py = this.player.y;

    for (const enemy of this.enemies) {
      const ex = enemy.x;
      const ey = enemy.y;

      const overlap = px < ex + TILE_SIZE && px + TILE_SIZE > ex && py < ey + TILE_SIZE && py + TILE_SIZE > ey;

      if (overlap) {
        const hpBefore = this.player.getHp();
        this.player.takeDamage();
        if (this.player.getHp() < hpBefore) {
          this.triggerShake(4, 0.3);
          this.damageFlashTimer = 0.3;
        }
        break;
      }
    }
  }

  private checkPlayerAttack() {
    if (!this.player.isAttacking()) return;

    const box = this.player.getAttackBox();

    for (const enemy of this.enemies) {
      const hit =
        enemy.x < box.x + box.w &&
        enemy.x + TILE_SIZE > box.x &&
        enemy.y < box.y + box.h &&
        enemy.y + TILE_SIZE > box.y;

      if (hit) {
        enemy.takeDamage();
        enemy.applyKnockback(this.player.x, this.player.y);
        if (enemy.isDead()) {
          this.spawnParticles(enemy.x, enemy.y, "#ff6060", 8);
          this.spawnDrop(enemy.x, enemy.y);
        } else {
          this.spawnParticles(enemy.x, enemy.y, "#ffffff", 4);
        }
      }
    }

    const before = this.enemies.length;
    this.enemies = this.enemies.filter((e) => !e.isDead());
    this.kills += before - this.enemies.length;
  }

  // Exit
  private placeExit() {
    const spawnCol = Math.floor(this.player.x / TILE_SIZE);
    const spawnRow = Math.floor(this.player.y / TILE_SIZE);

    let bestDist = 0;
    this.exitCol = spawnCol;
    this.exitRow = spawnRow;

    for (let row = 1; row < MAP_ROWS - 1; row++) {
      for (let col = 1; col < MAP_COLS - 1; col++) {
        if (this.wallMap[row]?.[col]) continue;
        if (this.decorMap[row]?.[col] !== null) continue;

        const dist = Math.abs(col - spawnCol) + Math.abs(row - spawnRow);
        if (dist > bestDist) {
          bestDist = dist;
          this.exitCol = col;
          this.exitRow = row;
        }
      }
    }
  }

  private checkExit() {
    const pCol = Math.floor(this.player.x / TILE_SIZE);
    const pRow = Math.floor(this.player.y / TILE_SIZE);

    if (pCol === this.exitCol && pRow === this.exitRow) {
      this.nextLevel();
    }
  }

  private nextLevel() {
    this.level += 1;
    SEED = Math.floor(Math.random() * 100000);
    this.enemies = [];
    this.messages = [];
    this.particles = [];
    this.projectiles = [];

    this.generateMap();

    const spawn = this.findSpawnPoint();
    this.player = new DungenPlayer(spawn.x, spawn.y, this.input, this.wallMap);
    this.placeExit();
    this.ensureConnected();
    this.spawnEnemies(15 + this.level * 3);
  }

  private spawnParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 60;
      this.particles.push({
        x: x + TILE_SIZE / 2,
        y: y + TILE_SIZE / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4,
        color,
      });
    }
  }

  private buildLightMap() {
    const TORCH_RADIUS = 3;

    this.lightMap = [];
    for (let row = 0; row < MAP_ROWS; row++) {
      this.lightMap.push(new Array(MAP_COLS).fill(false));
    }

    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        if (this.decorMap[row]?.[col] !== TILE.FIRE_0) continue;

        for (let dy = -TORCH_RADIUS; dy <= TORCH_RADIUS; dy++) {
          for (let dx = -TORCH_RADIUS; dx <= TORCH_RADIUS; dx++) {
            if (dx * dx + dy * dy > TORCH_RADIUS * TORCH_RADIUS) continue;

            const r = row + dy;
            const c = col + dx;
            if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) continue;

            if (this.hasLineOfSight(col, row, c, r)) {
              this.lightMap[r]![c] = true;
            }
          }
        }
      }
    }
  }

  private floodFill(startCol: number, startRow: number): Set<string> {
    const visited = new Set<string>();
    const stack: [number, number][] = [[startCol, startRow]];

    while (stack.length > 0) {
      const [col, row] = stack.pop()!;
      const key = `${col},${row}`;

      if (visited.has(key)) continue;
      if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) continue;
      if (this.wallMap[row]?.[col]) continue;

      visited.add(key);

      stack.push([col + 1, row]);
      stack.push([col - 1, row]);
      stack.push([col, row + 1]);
      stack.push([col, row - 1]);
    }

    return visited;
  }

  private ensureConnected() {
    const spawn = this.findSpawnPoint();
    const spawnCol = Math.floor(spawn.x / TILE_SIZE);
    const spawnRow = Math.floor(spawn.y / TILE_SIZE);

    const reachable = this.floodFill(spawnCol, spawnRow);

    if (reachable.has(`${this.exitCol},${this.exitRow}`)) return;

    const targetCol = this.exitCol;
    const targetRow = this.exitRow;
    let col = spawnCol;
    let row = spawnRow;

    while (col !== targetCol || row !== targetRow) {
      if (col < targetCol) col++;
      else if (col > targetCol) col--;

      if (this.wallMap[row]?.[col]) {
        this.wallMap[row]![col] = false;
        this.tileMap[row]![col] = TILE.GROUND_0;
      }

      if (row < targetRow) row++;
      else if (row > targetRow) row--;

      if (this.wallMap[row]?.[col]) {
        this.wallMap[row]![col] = false;
        this.tileMap[row]![col] = TILE.GROUND_0;
      }
    }

    this.autoTile();
  }

  private spawnDrop(x: number, y: number) {
    if (Math.random() > 0.3) return; // 30% drop chance
    const type = Math.random() < 0.4 ? "hp" : "loot";
    this.drops.push({ x, y, type, timer: 8 });
  }
}

const engine = new DungenEngine(CANVAS_W, CANVAS_H);
engine.setup();
