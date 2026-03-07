import { InternalBitmapFontName } from "../../src/core/fonts/font_bitmap";
import {
  Engine,
  Entity,
  FontBitmap,
  FontBitmapPrebuild,
  ObjectSystem,
  Text,
  type Vector2,
} from "../../src/index";

const input = new Input();

const WIDTH = 200;
const HEIGHT = 75;
const BACKGROUND = "#e0e0e0";

const GROUND_H = HEIGHT - 10;

const START_X = 20;
const START_Y = HEIGHT / 2 - 10;

const GSTATE = {
  IDLE: "idle",
  READY: "ready",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

const Colors = {
  background: "#e0e0e0",
  foreground: "#1a1a1a",
  middle: "#888888",
};

let gameState = GSTATE.IDLE;
let gameOverTime = 0;
let score = 0;
let highScore = 0;

class Player extends DynamicEntity {
  protected readonly flapStrenght = -75;
  protected readonly gravity = 255;
  protected readonly maxFallSpeed = 150;

  public height: number;
  public width: number;

  private bobTimer = 0;

  private flapKeyWasDown = false;

  private bgColor = Colors.background;
  private fgColor = Colors.foreground;

  private sprite = [
    [1, 0, 1, 1, 0, 0],
    [1, 1, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 0],
  ];

  constructor(width = 5, height = 5) {
    super("player", START_X, START_Y, width, height);
    this.velocity = { x: 0, y: 0 };

    this.width = width;
    this.height = height;
  }

  flap() {
    this.velocity.y = this.flapStrenght;
  }

  reset() {
    this.x = START_X;
    this.y = START_Y;
    this.velocity = { x: 0, y: 0 };
  }

  consumeFlap(): boolean {
    const isDown = input.isKeyDown("w");
    if (isDown && !this.flapKeyWasDown) {
      this.flapKeyWasDown = true;
      return true;
    }

    if (!isDown) {
      this.flapKeyWasDown = false;
    }
    return false;
  }

  override update(delta: number): void {
    if (gameState === GSTATE.PLAYING) {
      this.velocity.y += this.gravity * delta;
      /**
       * Don't fall faster than maxFallSpeed, otherwise the game becomes unplayable.
       */
      if (this.velocity.y > this.maxFallSpeed) {
        this.velocity.y = this.maxFallSpeed;
      }

      this.y += this.velocity.y * delta;

      if (this.y < 0) {
        this.y = 0;
        this.velocity.y = 0;
      }

      if (this.y + this.height >= GROUND_H) {
        this.y = GROUND_H - this.height;
        gameOver();
      }
    } else if (gameState === GSTATE.GAMEOVER) {
      gameOverTime += delta;
      this.velocity.y += this.gravity * delta;
      this.y += this.velocity.y * delta;
      if (this.y + this.height >= GROUND_H) {
        this.y = GROUND_H - this.height;
        this.velocity.y = 0;
      }
    } else if (gameState === GSTATE.READY) {
      this.bobTimer += delta;
      this.y = START_Y + Math.sin(this.bobTimer * 3) * 2;
    }

    if (this.consumeFlap()) {
      if (gameState === GSTATE.READY) {
        gameState = GSTATE.PLAYING;
        this.flap();
      } else if (gameState === GSTATE.PLAYING) {
        this.flap();
      } else if (gameState === GSTATE.GAMEOVER && gameOverTime > 0.5) {
        restartGame();
      }
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    const px = Math.round(this.x);
    const py = Math.round(this.y);

    ctx.fillStyle = this.fgColor;
    for (let row = 0; row < this.sprite.length; row++) {
      const cols = this.sprite[row]!;
      for (let col = 0; col < cols.length; col++) {
        if (cols[col]) {
          ctx.fillRect(px + col, py + row, 1, 1);
        }
      }
    }
    //
    //ctx.fillStyle = this.bgColor;
    //ctx.fillRect(px + 2, py + 2, 1, 1);
  }
}

const player = new Player();

class Ground extends DynamicEntity {
  private scrollX = 0;
  private height = 10;

  public speed = 48;

  constructor(height = 10) {
    super("ground", 0, GROUND_H, WIDTH, height);

    this.height = height;
  }

  override update(delta: number): void {
    if (gameState === GSTATE.PLAYING) {
      this.scrollX = (this.scrollX + this.speed * delta) % 6;
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    ctx.fillRect(0, GROUND_H, WIDTH, 1);

    ctx.fillStyle = Colors.background;
    ctx.fillRect(0, GROUND_H + 1, WIDTH, this.height - 1);

    ctx.fillStyle = Colors.middle;

    for (let gx = -Math.round(this.scrollX); gx < WIDTH; gx += 6) {
      ctx.fillRect(gx, GROUND_H + 1, 1, 2);
    }
  }
}
const ground = new Ground();

const engine = new Engine("flappy-canvas", WIDTH, HEIGHT, {
  backgroundColor: Colors.background,
});

type Pipe = {
  x: number;
  height: number;
  scored: boolean;
};

let pipeSpawnTimer = 0;

class Pipes extends DynamicEntity {
  private width = 11;
  private gap = 22;
  public speed = 48;
  private spawnInterval = 1.4;
  private minHeight = 8;

  private scorePoint = 10;

  private pipes: Pipe[] = [];

  constructor() {
    super("pipes", 0, 0, 0, 0);
  }

  spawnPipe() {
    const min = this.minHeight;
    const max = GROUND_H - this.gap - this.minHeight;
    const height = min + Math.random() * (max - min);
    this.pipes.push({
      x: WIDTH,
      height: Math.round(height),
      scored: false,
    });
  }

  resetPipes() {
    this.pipes.length = 0;
    pipeSpawnTimer = 0;
  }

  override update(delta: number): void {
    if (gameState !== GSTATE.PLAYING) return;

    pipeSpawnTimer += delta;
    if (pipeSpawnTimer >= this.spawnInterval) {
      this.spawnPipe();
      pipeSpawnTimer = 0;
    }

    const bLeft = Math.round(player.x) + 1;
    const bRight = bLeft + player.width - 1;
    const bTop = Math.round(player.y);
    const bBottom = bTop + player.height;

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i]!;
      pipe.x -= this.speed * delta;

      if (pipe.x + this.width < 0) {
        this.pipes.splice(i, 1);
        continue;
      }

      if (!pipe.scored && pipe.x + this.width < bLeft) {
        pipe.scored = true;
        score += this.scorePoint;
      }

      const pLeft = Math.round(pipe.x);
      const pRight = pLeft + this.width;
      const gapTop = pipe.height;
      const gapBottom = pipe.height + this.gap;

      if (bRight > pLeft && bLeft < pRight) {
        if (bTop < gapTop || bBottom > gapBottom) {
          gameOver();
        }
      }
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    for (const pipe of this.pipes) {
      const px = Math.round(pipe.x);
      const gapTop = pipe.height;
      const gapBottom = pipe.height + this.gap;

      // Top pipe
      ctx.fillRect(px, 0, this.width, gapTop);

      // Bottom pipe
      ctx.fillRect(px, gapBottom, this.width, GROUND_H - gapBottom);
    }
  }
}

const pipes = new Pipes();

engine.attachObjects(pipes);
engine.attachObjects(player);
engine.attachObjects(ground);

engine.setup(() => {
  gameState = GSTATE.READY;
  console.log("Flappy setup");
});

const restartGame = (): void => {
  gameState = GSTATE.PLAYING;
  score = 0;
  player.reset();
  player.flap();
  pipes.resetPipes();
  // reset pipes
};

const gameOver = (): void => {
  if (gameState === GSTATE.GAMEOVER) return;
  gameState = GSTATE.GAMEOVER;
  gameOverTime = 0;
  if (score > highScore) {
    highScore = score;
  }
};
