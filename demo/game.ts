import { Engine, Player } from "../index";

const CANVAS_W = 800;
const CANVAS_H = 600;
const PLAYER_SIZE = 32;
const PLAYER_SPEED = 200;

class DemoPlayer extends Player {
  private keys = new Set<string>();

  constructor(x: number, y: number) {
    super(x, y, PLAYER_SIZE, PLAYER_SIZE);

    window.addEventListener("keydown", (e) =>
      this.keys.add(e.key.toLowerCase()),
    );
    window.addEventListener("keyup", (e) =>
      this.keys.delete(e.key.toLowerCase()),
    );
  }

  override update(deltaTime: number): void {
    if (this.keys.has("arrowleft") || this.keys.has("a"))
      this.x -= PLAYER_SPEED * deltaTime;
    if (this.keys.has("arrowright") || this.keys.has("d"))
      this.x += PLAYER_SPEED * deltaTime;
    if (this.keys.has("arrowup") || this.keys.has("w"))
      this.y -= PLAYER_SPEED * deltaTime;
    if (this.keys.has("arrowdown") || this.keys.has("s"))
      this.y += PLAYER_SPEED * deltaTime;

    this.x = Math.max(0, Math.min(CANVAS_W - PLAYER_SIZE, this.x));
    this.y = Math.max(0, Math.min(CANVAS_H - PLAYER_SIZE, this.y));
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#5566ff";
    ctx.fillRect(this.x, this.y, PLAYER_SIZE, PLAYER_SIZE);

    ctx.fillStyle = "#88aaff";
    ctx.fillRect(this.x + 4, this.y + 4, PLAYER_SIZE - 8, PLAYER_SIZE - 8);
  }
}

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#1a1a2e",
});

const player = new DemoPlayer(
  CANVAS_W / 2 - PLAYER_SIZE / 2,
  CANVAS_H / 2 - PLAYER_SIZE / 2,
);

engine.player = player;

engine.setup(() => {
  console.log("GameFoo engine initialized");
});
