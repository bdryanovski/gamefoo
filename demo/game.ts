import {
  Collidable,
  Control,
  DynamicEntity,
  Engine,
  Entity,
  HealthKit,
  Input,
  Player,
  type CollisionInfo,
} from "../index";

const CANVAS_W = 800;
const CANVAS_H = 600;
const PLAYER_SIZE = 50;

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#1a1a2e",
});

class BlueBox extends Player {
  constructor(x: number, y: number) {
    super("player", x, y, PLAYER_SIZE, PLAYER_SIZE);
  }

  override update(deltaTime: number): void {
    super.update(deltaTime);

    this.x = Math.max(0, Math.min(CANVAS_W - PLAYER_SIZE, this.x));
    this.y = Math.max(0, Math.min(CANVAS_H - PLAYER_SIZE, this.y));

    // Hit the wall and take damage
    if (this.x <= 0 || this.x >= CANVAS_W - PLAYER_SIZE) {
      this.healthkit?.takeDamage(1);
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#5566ff";
    ctx.fillRect(this.x, this.y, PLAYER_SIZE, PLAYER_SIZE);

    ctx.fillStyle = "#88aaff";
    ctx.fillRect(this.x + 4, this.y + 4, PLAYER_SIZE - 8, PLAYER_SIZE - 8);
  }
}

const player = new BlueBox(
  CANVAS_W / 2 - PLAYER_SIZE / 2,
  CANVAS_H / 2 - PLAYER_SIZE / 2,
);

player.attachBehaviour(new Control(player, new Input()));
player.attachBehaviour(new HealthKit(player, 200));

player.attachBehaviour(
  new Collidable(player, engine.collisions, {
    shape: { type: "aabb", width: PLAYER_SIZE, height: PLAYER_SIZE },
    layer: 0,
    tags: new Set(["player"]),
    collidesWith: new Set(["blob"]),
    onCollision: (collision: CollisionInfo) => {
      if (collision.otherTags.has("blob")) {
        player.healthkit?.takeDamage(10);
      }

      console.log(
        "Player collided with blob! Health:",
        player.healthkit?.getHealth(),
      );
    },
  }),
);

engine.player = player;

// One blob

class Blob extends DynamicEntity {
  constructor(x: number, y: number) {
    super("blob", x, y, 30, 30);
  }

  override update(_deltaTime: number): void {
    // Move randomly and change direction occasionally
    // write me some implmentation of random movement for blob
    const speed = Math.random() * 0.5 + 0.5; // Random speed between 0.5 and 1
    this.x += (Math.random() - 0.5) * speed;
    this.y += (Math.random() - 0.5) * speed;

    // Occasionally change direction
    if (Math.random() < Math.random() * 0.01) {
      this.x += (Math.random() - 0.5) * speed * 10;
      this.y += (Math.random() - 0.5) * speed * 10;
    }

    // go all arround the canvas and bounce off the walls
    if (this.x <= 0 || this.x >= CANVAS_W - this.size.width) {
      this.x = Math.max(0, Math.min(CANVAS_W - this.size.width, this.x));
    }
    if (this.y <= 0 || this.y >= CANVAS_H - this.size.height) {
      this.y = Math.max(0, Math.min(CANVAS_H - this.size.height, this.y));
    }

    // make sure blob stays within canvas bounds
    this.x = Math.max(0, Math.min(CANVAS_W - this.size.width, this.x));
    this.y = Math.max(0, Math.min(CANVAS_H - this.size.height, this.y));
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#ff5555";
    ctx.beginPath();
    ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

const blob = new Blob(100, 100);

blob.attachBehaviour(
  new Collidable(blob, engine.collisions, {
    shape: { type: "circle", radius: 15 },
    layer: 0,
    tags: new Set(["blob"]),
    collidesWith: new Set(["player"]),
    onCollision: (other) => {
      console.log("Blob collided with player!");
    },
  }),
);

engine.attachObjects(blob);

engine.setup(() => {
  console.log("GameFoo engine initialized");
});
