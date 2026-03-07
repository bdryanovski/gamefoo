import { DynamicEntity, Engine, Entity, Input, ObjectSystem, Text } from "../../src/index";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WIDTH = 200;
const HEIGHT = 75;
const GROUND_Y = HEIGHT - 10;
const START_X = 20;
const START_Y = HEIGHT / 2 - 10;

const SCROLL_SPEED = 48;
const PIPE_GAP = 22;
const PIPE_WIDTH = 11;
const PIPE_SPAWN_INTERVAL = 1.4;
const PIPE_MIN_HEIGHT = 8;
const SCORE_PER_PIPE = 10;

const FLAP_STRENGTH = -75;
const GRAVITY = 255;
const MAX_FALL_SPEED = 150;
const GAME_OVER_COOLDOWN = 0.5;

const Colors = {
  background: "#e0e0e0",
  foreground: "#1a1a1a",
  middle: "#888888",
} as const;

// ---------------------------------------------------------------------------
// Game State
// ---------------------------------------------------------------------------

enum GameState {
  IDLE = "idle",
  READY = "ready",
  PLAYING = "playing",
  GAME_OVER = "gameover",
}

const game = {
  state: GameState.IDLE as GameState,
  score: 0,
  highScore: 0,
  gameOverTimer: 0,
};

function triggerGameOver(): void {
  if (game.state === GameState.GAME_OVER) return;
  game.state = GameState.GAME_OVER;
  game.gameOverTimer = 0;
  if (game.score > game.highScore) {
    game.highScore = game.score;
  }
}

function restartGame(): void {
  game.state = GameState.PLAYING;
  game.score = 0;
  bird.reset();
  bird.flap();
  pipeManager.resetPipes();
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const input = new Input();

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

const BIRD_SPRITE = [
  [1, 0, 1, 1, 0, 0],
  [1, 1, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0],
  [0, 1, 0, 1, 0, 0],
];

class Bird extends DynamicEntity {
  private bobTimer = 0;
  private flapKeyWasDown = false;

  constructor() {
    super("bird", START_X, START_Y, 6, 5);
    this.velocity = { x: 0, y: 0 };
  }

  flap(): void {
    this.velocity.y = FLAP_STRENGTH;
  }

  reset(): void {
    this.x = START_X;
    this.y = START_Y;
    this.velocity = { x: 0, y: 0 };
  }

  private consumeFlap(): boolean {
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

  override update(dt: number): void {
    switch (game.state) {
      case GameState.PLAYING:
        this.velocity.y = Math.min(this.velocity.y + GRAVITY * dt, MAX_FALL_SPEED);
        this.y += this.velocity.y * dt;

        if (this.y < 0) {
          this.y = 0;
          this.velocity.y = 0;
        }
        if (this.y + this.getSize().height >= GROUND_Y) {
          this.y = GROUND_Y - this.getSize().height;
          triggerGameOver();
        }
        break;

      case GameState.GAME_OVER:
        game.gameOverTimer += dt;
        this.velocity.y += GRAVITY * dt;
        this.y += this.velocity.y * dt;
        if (this.y + this.getSize().height >= GROUND_Y) {
          this.y = GROUND_Y - this.getSize().height;
          this.velocity.y = 0;
        }
        break;

      case GameState.READY:
        this.bobTimer += dt;
        this.y = START_Y + Math.sin(this.bobTimer * 3) * 2;
        break;
    }

    if (this.consumeFlap()) {
      if (game.state === GameState.READY) {
        game.state = GameState.PLAYING;
        this.flap();
      } else if (game.state === GameState.PLAYING) {
        this.flap();
      } else if (game.state === GameState.GAME_OVER && game.gameOverTimer > GAME_OVER_COOLDOWN) {
        restartGame();
      }
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    const px = Math.round(this.x);
    const py = Math.round(this.y);

    ctx.fillStyle = Colors.foreground;
    for (let row = 0; row < BIRD_SPRITE.length; row++) {
      const cols = BIRD_SPRITE[row]!;
      for (let col = 0; col < cols.length; col++) {
        if (cols[col]) {
          ctx.fillRect(px + col, py + row, 1, 1);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Ground
// ---------------------------------------------------------------------------

class Ground extends DynamicEntity {
  private scrollX = 0;

  constructor() {
    super("ground", 0, GROUND_Y, WIDTH, 10);
  }

  override update(dt: number): void {
    if (game.state === GameState.PLAYING) {
      this.scrollX = (this.scrollX + SCROLL_SPEED * dt) % 6;
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    ctx.fillRect(0, GROUND_Y, WIDTH, 1);

    ctx.fillStyle = Colors.background;
    ctx.fillRect(0, GROUND_Y + 1, WIDTH, this.getSize().height - 1);

    ctx.fillStyle = Colors.middle;
    for (let gx = -Math.round(this.scrollX); gx < WIDTH; gx += 6) {
      ctx.fillRect(gx, GROUND_Y + 1, 1, 2);
    }
  }
}

// ---------------------------------------------------------------------------
// Pipes
// ---------------------------------------------------------------------------

interface PipeData {
  x: number;
  gapY: number;
  scored: boolean;
}

class PipeManager extends Entity {
  private pipes: PipeData[] = [];
  private spawnTimer = 0;
  private bird: Bird;

  constructor(bird: Bird) {
    super("pipes", 0, 0);
    this.bird = bird;
  }

  resetPipes(): void {
    this.pipes.length = 0;
    this.spawnTimer = 0;
  }

  private spawnPipe(): void {
    const min = PIPE_MIN_HEIGHT;
    const max = GROUND_Y - PIPE_GAP - PIPE_MIN_HEIGHT;
    this.pipes.push({
      x: WIDTH,
      gapY: Math.round(min + Math.random() * (max - min)),
      scored: false,
    });
  }

  override update(dt: number): void {
    if (game.state !== GameState.PLAYING) return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= PIPE_SPAWN_INTERVAL) {
      this.spawnPipe();
      this.spawnTimer = 0;
    }

    const birdPos = this.bird.getPosition();
    const birdSize = this.bird.getSize();
    const bLeft = Math.round(birdPos.x) + 1;
    const bRight = bLeft + birdSize.width - 1;
    const bTop = Math.round(birdPos.y);
    const bBottom = bTop + birdSize.height;

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i]!;
      pipe.x -= SCROLL_SPEED * dt;

      if (pipe.x + PIPE_WIDTH < 0) {
        this.pipes.splice(i, 1);
        continue;
      }

      if (!pipe.scored && pipe.x + PIPE_WIDTH < bLeft) {
        pipe.scored = true;
        game.score += SCORE_PER_PIPE;
      }

      const pLeft = Math.round(pipe.x);
      const pRight = pLeft + PIPE_WIDTH;
      const gapTop = pipe.gapY;
      const gapBottom = pipe.gapY + PIPE_GAP;

      if (bRight > pLeft && bLeft < pRight) {
        if (bTop < gapTop || bBottom > gapBottom) {
          triggerGameOver();
        }
      }
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    for (const pipe of this.pipes) {
      const px = Math.round(pipe.x);
      const gapTop = pipe.gapY;
      const gapBottom = pipe.gapY + PIPE_GAP;

      ctx.fillRect(px, 0, PIPE_WIDTH, gapTop);
      ctx.fillRect(px, gapBottom, PIPE_WIDTH, GROUND_Y - gapBottom);
    }
  }
}

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------

class ScoreLabel extends Text {
  constructor() {
    super("score-label", "3x5");
    this.y = 2;
  }

  override update(_dt: number): void {
    if (game.state === GameState.PLAYING || game.state === GameState.GAME_OVER) {
      const text = `${game.score}`;
      this.setText(text);
      this.x = Math.round((WIDTH - this.font.getTextWidth(text)) / 2);
    } else {
      this.setText("");
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    super.render(ctx);
  }
}

class MessageLabel extends Text {
  constructor() {
    super("message-label", "3x5");
  }

  override update(_dt: number): void {
    let text = "";

    switch (game.state) {
      case GameState.READY:
        text = "PRESS W TO FLAP";
        break;
      case GameState.GAME_OVER:
        text = `GAME OVER  HI:${game.highScore}`;
        break;
    }

    this.setText(text);
    this.x = Math.round((WIDTH - this.font.getTextWidth(text)) / 2);
    this.y = Math.round(GROUND_Y / 2 + 10);
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    super.render(ctx);
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const bird = new Bird();
const pipeManager = new PipeManager(bird);

const engine = new Engine("game", WIDTH, HEIGHT, {
  backgroundColor: Colors.background,
  gameScale: 4,
});

engine.use(
  new ObjectSystem([pipeManager, bird, new Ground(), new ScoreLabel(), new MessageLabel()]),
);

engine.setup(() => {
  game.state = GameState.READY;
});
