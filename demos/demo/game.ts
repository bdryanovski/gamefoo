import type { RenderContext } from "../../src/core/renderer/type";
import {
  Collidable,
  type CollisionInfo,
  Control,
  DynamicEntity,
  Engine,
  HealthKit,
  Input,
  ObjectSystem,
  Player,
  WebRenderer,
  World,
} from "../../src/index";

const CANVAS_W = 800;
const CANVAS_H = 600;
const PLAYER_SIZE = 50;

const renderer = new WebRenderer("game", CANVAS_W, CANVAS_H);
const engine = new Engine(renderer, { backgroundColor: "#1a1a2e" });

// Shared collision world for this demo
const world = new World();

// ---------------------------------------------------------------------------
// Player
// ---------------------------------------------------------------------------

class BlueBox extends Player {
  constructor(x: number, y: number) {
    super("player", x, y, PLAYER_SIZE, PLAYER_SIZE);
  }

  override update(deltaTime: number): void {
    super.update(deltaTime);
    this.x = Math.max(0, Math.min(CANVAS_W - PLAYER_SIZE, this.x));
    this.y = Math.max(0, Math.min(CANVAS_H - PLAYER_SIZE, this.y));
    if (this.x <= 0 || this.x >= CANVAS_W - PLAYER_SIZE) {
      this.healthkit?.takeDamage(1);
    }
  }

  override render(ctx: RenderContext): void {
    ctx.fillRect(this.x, this.y, PLAYER_SIZE, PLAYER_SIZE, "#5566ff");
    ctx.fillRect(this.x + 4, this.y + 4, PLAYER_SIZE - 8, PLAYER_SIZE - 8, "#88aaff");
  }
}

const player = new BlueBox(CANVAS_W / 2 - PLAYER_SIZE / 2, CANVAS_H / 2 - PLAYER_SIZE / 2);
player.attachBehaviour(new Control(player, new Input()));
player.attachBehaviour(new HealthKit(player, 200));
player.attachBehaviour(
  new Collidable(player, world, {
    shape: { type: "aabb", width: PLAYER_SIZE, height: PLAYER_SIZE },
    layer: 0,
    tags: new Set(["player"]),
    solid: true,
    collidesWith: new Set(["blob"]),
    onCollision: (collision: CollisionInfo) => {
      if (collision.otherTags.has("blob")) {
        player.healthkit?.takeDamage(10);
      }
      console.log("Player collided with blob! Health:", player.healthkit?.getHealth());
    },
  }),
);

// ---------------------------------------------------------------------------
// Blob
// ---------------------------------------------------------------------------

class Blob extends DynamicEntity {
  private directionTimer = 0;
  private directionInterval = 0;
  private dashing = false;

  private static readonly SLOW_SPEED = 60;
  private static readonly FAST_SPEED = 250;
  private static readonly DASH_CHANCE = 0.15;

  constructor(x: number, y: number) {
    super("blob", x, y, 30, 30);
    this.pickNewDirection();
  }

  private pickNewDirection(): void {
    const angle = Math.random() * Math.PI * 2;
    this.dashing = Math.random() < Blob.DASH_CHANCE;
    this.speed = this.dashing ? Blob.FAST_SPEED : Blob.SLOW_SPEED;
    this.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    this.directionTimer = 0;
    this.directionInterval = this.dashing ? 0.3 + Math.random() * 0.4 : 1.5 + Math.random() * 2.5;
  }

  override update(deltaTime: number): void {
    this.directionTimer += deltaTime;
    if (this.directionTimer >= this.directionInterval) this.pickNewDirection();

    this.x += this.velocity.x * this.speed * deltaTime;
    this.y += this.velocity.y * this.speed * deltaTime;

    if (this.x <= 0 || this.x >= CANVAS_W - this.size.width) {
      this.velocity.x *= -1;
      this.x = Math.max(0, Math.min(CANVAS_W - this.size.width, this.x));
    }
    if (this.y <= 0 || this.y >= CANVAS_H - this.size.height) {
      this.velocity.y *= -1;
      this.y = Math.max(0, Math.min(CANVAS_H - this.size.height, this.y));
    }
  }

  override render(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    c.fillStyle = this.dashing ? "#ff2222" : "#ff5555";
    c.beginPath();
    c.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
    c.fill();
    if (this.dashing) {
      c.strokeStyle = "#ff8888";
      c.lineWidth = 2;
      c.stroke();
    }
  }
}

const blob = new Blob(100, 100);
blob.attachBehaviour(
  new Collidable(blob, world, {
    shape: { type: "circle", radius: 15 },
    layer: 0,
    tags: new Set(["blob"]),
    solid: true,
    collidesWith: new Set(["player"]),
    onCollision: () => console.log("Blob collided with player!"),
  }),
);

// ---------------------------------------------------------------------------
// Tree
// ---------------------------------------------------------------------------

class Tree extends DynamicEntity {
  constructor(x: number, y: number) {
    super("tree", x, y, 40, 60);
  }

  override render(ctx: RenderContext): void {
    const c = ctx.getCanvas!()!
    c.fillStyle = "#654321";
    c.fillRect(this.x + 15, this.y + 30, 10, 10);
    c.fillStyle = "#228822";
    c.beginPath();
    c.moveTo(this.x + 20, this.y - 40);
    c.lineTo(this.x, this.y + 30);
    c.lineTo(this.x + 40, this.y + 30);
    c.closePath();
    c.fill();
  }

  override update(_deltaTime: number): void {}
}

const tree = new Tree(300, 200);
tree.attachBehaviour(
  new Collidable(tree, world, {
    shape: { type: "aabb", width: 40, height: 60 },
    layer: 0,
    tags: new Set(["tree"]),
    solid: true,
    fixed: true,
    collidesWith: new Set(["player"]),
    onCollision: () => console.log("Player collided with tree!"),
  }),
);

// ---------------------------------------------------------------------------
// Boot — wire everything into subsystems
// ---------------------------------------------------------------------------

engine.use(new ObjectSystem([player, blob, tree]));

engine.setup(() => {
  console.log("GameFoo engine initialized");
});
