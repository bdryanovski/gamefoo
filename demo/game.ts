import { Control, Engine, HealthKit, Input, Player } from "../index";

const CANVAS_W = 800;
const CANVAS_H = 600;
const PLAYER_SIZE = 50;

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

    console.log(
      `HP: ${this.healthkit?.getHealth()}/${this.healthkit?.getMaxHealth()}`,
      `Pos: (${this.x.toFixed(0)}, ${this.y.toFixed(0)})`,
    );
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

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#1a1a2e",
});

engine.player = player;

engine.setup(() => {
  console.log("GameFoo engine initialized");
});
