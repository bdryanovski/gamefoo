import {
  CameraSystem,
  Collidable,
  CollisionSystem,
  Control,
  DynamicEntity,
  Engine,
  Entity,
  FontBitmap,
  Input,
  ObjectSystem,
  PerlinNoise,
  Player,
  type RenderContext,
  type Vector2,
  WebRenderer,
  World,
} from "../../src/index";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CANVAS_W = 800;
const CANVAS_H = 600;
const WORLD_W = 4000;
const WORLD_H = 4000;
const PLAYER_SIZE = 24;
const GRID_SIZE = 80;

// ---------------------------------------------------------------------------
// WORKAROUND: Manual camera offset
//
// The engine's Camera tracks the player but Engine.render() never calls
// ctx.translate(), so nothing actually scrolls. We keep a module-level
// offset that every entity subtracts in its render() method.
// ---------------------------------------------------------------------------

const cam: Vector2 = { x: 0, y: 0 };

function worldToScreen(wx: number, wy: number): Vector2 {
  return { x: wx - cam.x, y: wy - cam.y };
}

function isOnScreen(wx: number, wy: number, margin = 100): boolean {
  const sx = wx - cam.x;
  const sy = wy - cam.y;
  return sx > -margin && sx < CANVAS_W + margin && sy > -margin && sy < CANVAS_H + margin;
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

const renderer = new WebRenderer("game", CANVAS_W, CANVAS_H);
const engine = new Engine(renderer, { backgroundColor: "#1a2a1a", gameScale: 1 });
const world = new World();

// ---------------------------------------------------------------------------
// Terrain — Perlin-based ground color variation
// ---------------------------------------------------------------------------

const terrainNoise = new PerlinNoise(42);
const objectNoise = new PerlinNoise(137);

function terrainColor(wx: number, wy: number): string {
  const n = terrainNoise.fbm(wx * 0.003, wy * 0.003, 3, 2, 0.5);
  const g = Math.floor(30 + (n + 1) * 15);
  const r = Math.floor(18 + (n + 1) * 6);
  return `rgb(${r}, ${g}, ${r - 4})`;
}

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

class Explorer extends Player {
  private trail: Vector2[] = [];
  private trailTimer = 0;

  constructor() {
    super("player", WORLD_W / 2, WORLD_H / 2, PLAYER_SIZE, PLAYER_SIZE);
  }

  override update(dt: number): void {
    super.update(dt);

    // Clamp to world bounds
    this.x = Math.max(0, Math.min(WORLD_W - PLAYER_SIZE, this.x));
    this.y = Math.max(0, Math.min(WORLD_H - PLAYER_SIZE, this.y));

    // Update camera offset to center player on screen
    cam.x = this.x - CANVAS_W / 2 + PLAYER_SIZE / 2;
    cam.y = this.y - CANVAS_H / 2 + PLAYER_SIZE / 2;

    // Leave a fading trail
    this.trailTimer += dt;
    if (this.trailTimer > 0.05) {
      this.trailTimer = 0;
      this.trail.push({
        x: this.x + PLAYER_SIZE / 2,
        y: this.y + PLAYER_SIZE / 2,
      });
      if (this.trail.length > 120) this.trail.shift();
    }
  }

  override render(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!

    // Terrain patches — rendered here because the engine draws the player
    // BEFORE registered objects, so this is our only chance to paint under them.
    // (Another camera issue: no render-layer / z-order system.)
    this.drawTerrain(ctx);

    // Trail
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i]!;
      if (!isOnScreen(t.x, t.y, 10)) continue;
      const s = worldToScreen(t.x, t.y);
      const alpha = (i / this.trail.length) * 0.3;
      c.fillStyle = `rgba(120, 220, 180, ${alpha})`;
      c.beginPath();
      c.arc(s.x, s.y, 2, 0, Math.PI * 2);
      c.fill();
    }

    // Player body
    const s = worldToScreen(this.x, this.y);
    c.fillStyle = "#44ddaa";
    c.fillRect(s.x, s.y, PLAYER_SIZE, PLAYER_SIZE);
    c.fillStyle = "#88ffcc";
    c.fillRect(s.x + 3, s.y + 3, PLAYER_SIZE - 6, PLAYER_SIZE - 6);

    // Direction indicator (small dot)
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(s.x + PLAYER_SIZE / 2, s.y + PLAYER_SIZE / 2, 2, 0, Math.PI * 2);
    c.fill();

    this.renderBehaviours(ctx);
  }

  private drawTerrain(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    const step = 40;
    const startWx = Math.floor(cam.x / step) * step;
    const startWy = Math.floor(cam.y / step) * step;

    for (let wx = startWx - step; wx < cam.x + CANVAS_W + step; wx += step) {
      for (let wy = startWy - step; wy < cam.y + CANVAS_H + step; wy += step) {
        if (wx < 0 || wy < 0 || wx > WORLD_W || wy > WORLD_H) continue;
        const s = worldToScreen(wx, wy);
        c.fillStyle = terrainColor(wx, wy);
        c.fillRect(s.x, s.y, step + 1, step + 1);
      }
    }
  }
}

const player = new Explorer();
player.attachBehaviour(new Control(player, new Input()));

player.attachBehaviour(
  new Collidable(player, world, {
    shape: { type: "aabb", width: PLAYER_SIZE, height: PLAYER_SIZE },
    layer: 0,
    tags: new Set(["player"]),
    solid: true,
    collidesWith: new Set(["obstacle"]),
  }),
);

// ---------------------------------------------------------------------------
// World Objects
// ---------------------------------------------------------------------------

let objectIdCounter = 0;

class Tree extends Entity {
  private trunkH: number;
  private crownR: number;
  private shade: string;

  constructor(x: number, y: number) {
    const w = 20 + Math.random() * 16;
    const h = 40 + Math.random() * 30;
    super(`tree_${objectIdCounter++}`, x, y, w, h);
    this.trunkH = h * 0.4;
    this.crownR = w * 0.7;
    const g = Math.floor(80 + Math.random() * 80);
    this.shade = `rgb(${Math.floor(g * 0.3)}, ${g}, ${Math.floor(g * 0.2)})`;
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 80)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);
    const cx = s.x + this.size.width / 2;

    // Trunk
    c.fillStyle = "#5a3a1a";
    c.fillRect(cx - 3, s.y + this.size.height - this.trunkH, 6, this.trunkH);

    // Crown
    c.fillStyle = this.shade;
    c.beginPath();
    c.arc(cx, s.y + this.size.height - this.trunkH, this.crownR, 0, Math.PI * 2);
    c.fill();
  }
}

class Rock extends Entity {
  private radius: number;
  private shade: string;

  constructor(x: number, y: number) {
    const r = 8 + Math.random() * 18;
    super(`rock_${objectIdCounter++}`, x, y, r * 2, r * 2);
    this.radius = r;
    const v = Math.floor(80 + Math.random() * 60);
    this.shade = `rgb(${v}, ${v - 5}, ${v - 15})`;
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 50)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);
    c.fillStyle = this.shade;
    c.beginPath();
    c.ellipse(s.x + this.radius, s.y + this.radius, this.radius, this.radius * 0.7, 0, 0, Math.PI * 2);
    c.fill();

    // Highlight
    c.fillStyle = "rgba(255,255,255,0.08)";
    c.beginPath();
    c.ellipse(s.x + this.radius - 2, s.y + this.radius - 3, this.radius * 0.5, this.radius * 0.3, -0.3, 0, Math.PI * 2);
    c.fill();
  }
}

class Bush extends Entity {
  private radius: number;
  private shade: string;

  constructor(x: number, y: number) {
    const r = 6 + Math.random() * 10;
    super(`bush_${objectIdCounter++}`, x, y, r * 2, r * 2);
    this.radius = r;
    const g = Math.floor(60 + Math.random() * 50);
    this.shade = `rgb(${Math.floor(g * 0.5)}, ${g}, ${Math.floor(g * 0.3)})`;
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 30)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);
    const cx = s.x + this.radius;
    const cy = s.y + this.radius;

    // Three overlapping circles
    c.fillStyle = this.shade;
    c.beginPath();
    c.arc(cx - 3, cy, this.radius * 0.8, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(cx + 3, cy - 1, this.radius * 0.7, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.arc(cx, cy - 4, this.radius * 0.6, 0, Math.PI * 2);
    c.fill();
  }
}

class Flower extends Entity {
  private petalColor: string;

  constructor(x: number, y: number) {
    super(`flower_${objectIdCounter++}`, x, y, 6, 6);
    const colors = ["#ff6b8a", "#ffaa44", "#aa88ff", "#44ccff", "#ffff66", "#ff66cc"];
    this.petalColor = colors[Math.floor(Math.random() * colors.length)]!;
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 10)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);

    // Petals
    c.fillStyle = this.petalColor;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
      c.beginPath();
      c.arc(s.x + 3 + Math.cos(a) * 3, s.y + 3 + Math.sin(a) * 3, 2, 0, Math.PI * 2);
      c.fill();
    }
    // Center
    c.fillStyle = "#ffe066";
    c.beginPath();
    c.arc(s.x + 3, s.y + 3, 1.5, 0, Math.PI * 2);
    c.fill();
  }
}

class Pond extends Entity {
  private rx: number;
  private ry: number;

  constructor(x: number, y: number) {
    const rx = 30 + Math.random() * 40;
    const ry = 20 + Math.random() * 25;
    super(`pond_${objectIdCounter++}`, x, y, rx * 2, ry * 2);
    this.rx = rx;
    this.ry = ry;
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 100)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);

    c.fillStyle = "rgba(40, 80, 140, 0.6)";
    c.beginPath();
    c.ellipse(s.x + this.rx, s.y + this.ry, this.rx, this.ry, 0, 0, Math.PI * 2);
    c.fill();

    // Shimmer
    c.fillStyle = "rgba(100, 170, 255, 0.15)";
    c.beginPath();
    c.ellipse(s.x + this.rx - 5, s.y + this.ry - 5, this.rx * 0.6, this.ry * 0.5, -0.2, 0, Math.PI * 2);
    c.fill();
  }
}

// Wandering creature to make the world feel alive
class Critter extends DynamicEntity {
  private dirTimer = 0;
  private dirInterval = 0;
  private color: string;

  constructor(x: number, y: number) {
    super(`critter_${objectIdCounter++}`, x, y, 10, 10);
    this.speed = 30 + Math.random() * 40;
    this.pickDir();
    const hue = Math.floor(Math.random() * 360);
    this.color = `hsl(${hue}, 50%, 60%)`;
  }

  private pickDir(): void {
    const angle = Math.random() * Math.PI * 2;
    this.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    this.dirTimer = 0;
    this.dirInterval = 2 + Math.random() * 4;
  }

  update(dt: number): void {
    this.dirTimer += dt;
    if (this.dirTimer >= this.dirInterval) this.pickDir();

    this.x += this.velocity.x * this.speed * dt;
    this.y += this.velocity.y * this.speed * dt;

    // Bounce off world edges
    if (this.x < 0 || this.x > WORLD_W - 10) {
      this.velocity.x *= -1;
      this.x = Math.max(0, Math.min(WORLD_W - 10, this.x));
    }
    if (this.y < 0 || this.y > WORLD_H - 10) {
      this.velocity.y *= -1;
      this.y = Math.max(0, Math.min(WORLD_H - 10, this.y));
    }
  }

  render(ctx: RenderContext): void {
    if (!isOnScreen(this.x, this.y, 20)) return;
    const c = ctx.getCanvas!()!
    const s = worldToScreen(this.x, this.y);
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(s.x + 5, s.y + 5, 5, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#fff";
    c.beginPath();
    c.arc(s.x + 5, s.y + 4, 1.5, 0, Math.PI * 2);
    c.fill();
  }
}

// ---------------------------------------------------------------------------
// World generation using Perlin noise for clustering
// ---------------------------------------------------------------------------

function spawnObjects(): Entity[] {
  const objects: Entity[] = [];
  const MARGIN = 60;

  // Trees — cluster in "forest" zones
  for (let i = 0; i < 500; i++) {
    const x = MARGIN + Math.random() * (WORLD_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (WORLD_H - MARGIN * 2);
    const n = objectNoise.fbm(x * 0.004, y * 0.004, 3);
    if (n > 0.05) {
      const tree = new Tree(x, y);
      tree.attachBehaviour(
        new Collidable(tree, world, {
          shape: { type: "circle", radius: 8 },
          layer: 0,
          tags: new Set(["obstacle"]),
          solid: true,
          fixed: true,
          collidesWith: new Set(["player"]),
        }),
      );
      objects.push(tree);
    }
  }

  // Rocks
  for (let i = 0; i < 300; i++) {
    const x = MARGIN + Math.random() * (WORLD_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (WORLD_H - MARGIN * 2);
    const n = objectNoise.noise2d(x * 0.006, y * 0.006);
    if (n < -0.1) {
      const rock = new Rock(x, y);
      rock.attachBehaviour(
        new Collidable(rock, world, {
          shape: { type: "circle", radius: rock.getSize().width / 2 },
          layer: 0,
          tags: new Set(["obstacle"]),
          solid: true,
          fixed: true,
          collidesWith: new Set(["player"]),
        }),
      );
      objects.push(rock);
    }
  }

  // Bushes
  for (let i = 0; i < 400; i++) {
    const x = MARGIN + Math.random() * (WORLD_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (WORLD_H - MARGIN * 2);
    objects.push(new Bush(x, y));
  }

  // Flowers — scattered everywhere
  for (let i = 0; i < 600; i++) {
    const x = MARGIN + Math.random() * (WORLD_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (WORLD_H - MARGIN * 2);
    objects.push(new Flower(x, y));
  }

  // Ponds — sparse
  for (let i = 0; i < 20; i++) {
    const x = 200 + Math.random() * (WORLD_W - 400);
    const y = 200 + Math.random() * (WORLD_H - 400);
    objects.push(new Pond(x, y));
  }

  // Critters — wandering creatures
  for (let i = 0; i < 40; i++) {
    const x = MARGIN + Math.random() * (WORLD_W - MARGIN * 2);
    const y = MARGIN + Math.random() * (WORLD_H - MARGIN * 2);
    objects.push(new Critter(x, y));
  }

  objects.push(new HUD());

  return objects;
}

// ---------------------------------------------------------------------------
// HUD — draws on top of everything, in screen coordinates
// ---------------------------------------------------------------------------

const font = new FontBitmap("5x5");

class HUD extends Entity {
  constructor() {
    super("hud", 0, 0, CANVAS_W, CANVAS_H);
  }

  update(_dt: number): void {}

  render(ctx: RenderContext): void {
    this.drawGrid(ctx);
    this.drawWorldBorder(ctx);
    this.drawMinimap(ctx);
    this.drawCoords(ctx);
  }

  private drawGrid(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    c.strokeStyle = "rgba(255, 255, 255, 0.03)";
    c.lineWidth = 1;

    const startX = -(cam.x % GRID_SIZE);
    const startY = -(cam.y % GRID_SIZE);

    for (let x = startX; x < CANVAS_W; x += GRID_SIZE) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, CANVAS_H);
      c.stroke();
    }
    for (let y = startY; y < CANVAS_H; y += GRID_SIZE) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(CANVAS_W, y);
      c.stroke();
    }
  }

  private drawWorldBorder(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    const tl = worldToScreen(0, 0);
    const br = worldToScreen(WORLD_W, WORLD_H);

    c.strokeStyle = "rgba(255, 80, 80, 0.4)";
    c.lineWidth = 2;
    c.setLineDash([8, 6]);
    c.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    c.setLineDash([]);
  }

  private drawMinimap(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    const mmW = 140;
    const mmH = 140;
    const mmX = CANVAS_W - mmW - 10;
    const mmY = 10;
    const scale = mmW / WORLD_W;

    // Background
    c.fillStyle = "rgba(0, 0, 0, 0.6)";
    c.fillRect(mmX, mmY, mmW, mmH);
    c.strokeStyle = "rgba(255, 255, 255, 0.2)";
    c.lineWidth = 1;
    c.strokeRect(mmX, mmY, mmW, mmH);

    // Viewport rectangle
    c.strokeStyle = "rgba(255, 255, 100, 0.5)";
    c.lineWidth = 1;
    c.strokeRect(mmX + cam.x * scale, mmY + cam.y * scale, CANVAS_W * scale, CANVAS_H * scale);

    // Player dot
    const px = player.getPosition().x;
    const py = player.getPosition().y;
    c.fillStyle = "#44ddaa";
    c.beginPath();
    c.arc(mmX + px * scale, mmY + py * scale, 3, 0, Math.PI * 2);
    c.fill();
  }

  private drawCoords(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    const px = Math.floor(player.getPosition().x);
    const py = Math.floor(player.getPosition().y);
    const text = `POS ${px},${py}  CAM ${Math.floor(cam.x)},${Math.floor(cam.y)}  WORLD ${WORLD_W}x${WORLD_H}`;

    c.fillStyle = "rgba(0,0,0,0.5)";
    c.fillRect(8, CANVAS_H - 20, text.length * 5 + 8, 14);

    c.fillStyle = "#7fdbca";
    font.renderText(text, 12, CANVAS_H - 17, ctx);
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

engine.setup(() => {
  const objects = spawnObjects();
  engine.use(new ObjectSystem([player, ...objects] as any));
  engine.use(new CollisionSystem(world));

  console.log("%c🌍 Endless World loaded — %d objects spawned", "color: #7fdbca; font-weight: bold", objectIdCounter);
  console.log(
    "%cCamera issues: Engine.render() ignores camera transform — using manual offset workaround",
    "color: #f88",
  );
});
