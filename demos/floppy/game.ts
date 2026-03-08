import { Behaviour, DynamicEntity, Engine, Entity, Input, ObjectSystem, StateMachine, Text } from "../../src/index";

// ---------------------------------------------------------------------------
// Layout — shared by many classes, derived from game dimensions
// ---------------------------------------------------------------------------

const WIDTH = 200;
const HEIGHT = 75;
const GROUND_Y = HEIGHT - 10;

const Colors = {
  background: "#e0e0e0",
  foreground: "#1a1a1a",
  middle: "#888888",
} as const;

// ---------------------------------------------------------------------------
// Game State — shared contract between Floppy engine and all entities
// ---------------------------------------------------------------------------

enum GameState {
  IDLE = "idle",
  READY = "ready",
  PLAYING = "playing",
  GAME_OVER = "gameover",
}

class FloppyState {
  readonly fsm = new StateMachine(GameState.IDLE);
  score = 0;
  highScore = 0;
  gameOverTimer = 0;

  constructor() {
    this.fsm.onEnter(GameState.GAME_OVER, () => {
      this.gameOverTimer = 0;
      if (this.score > this.highScore) {
        this.highScore = this.score;
      }
    });
  }

  get isPlaying(): boolean {
    return this.fsm.is(GameState.PLAYING);
  }

  get isGameOver(): boolean {
    return this.fsm.is(GameState.GAME_OVER);
  }

  get isReady(): boolean {
    return this.fsm.is(GameState.READY);
  }
}

// ---------------------------------------------------------------------------
// Bird
// ---------------------------------------------------------------------------

class Bird extends DynamicEntity {
  readonly birdW = 6;
  readonly birdH = 5;

  private static readonly MASK = [0b101100, 0b111010, 0b011111, 0b111100, 0b010100];

  private readonly startX: number;
  private readonly startY: number;
  private readonly flapStrength: number;
  private readonly gravity: number;
  private readonly maxFallSpeed: number;

  private bobTimer = 0;
  private gs: FloppyState;

  constructor(gs: FloppyState, startX = 20, startY = HEIGHT / 2 - 10, flapStrength = -75, gravity = 255, maxFallSpeed = 150) {
    super("bird", startX, startY, 6, 5);
    this.velocity = { x: 0, y: 0 };
    this.gs = gs;
    this.startX = startX;
    this.startY = startY;
    this.flapStrength = flapStrength;
    this.gravity = gravity;
    this.maxFallSpeed = maxFallSpeed;
  }

  flap(): void {
    this.velocity.y = this.flapStrength;
  }

  reset(): void {
    this.x = this.startX;
    this.y = this.startY;
    this.velocity = { x: 0, y: 0 };
  }

  override update(dt: number): void {
    switch (this.gs.fsm.current) {
      case GameState.PLAYING:
        this.velocity.y = Math.min(this.velocity.y + this.gravity * dt, this.maxFallSpeed);
        this.y += this.velocity.y * dt;

        if (this.y < 0) {
          this.y = 0;
          this.velocity.y = 0;
        }
        if (this.y + this.birdH >= GROUND_Y) {
          this.y = GROUND_Y - this.birdH;
          this.gs.fsm.transition(GameState.GAME_OVER);
        }
        break;

      case GameState.GAME_OVER:
        this.gs.gameOverTimer += dt;
        this.velocity.y += this.gravity * dt;
        this.y += this.velocity.y * dt;
        if (this.y + this.birdH >= GROUND_Y) {
          this.y = GROUND_Y - this.birdH;
          this.velocity.y = 0;
        }
        break;

      case GameState.READY:
        this.bobTimer += dt;
        this.y = this.startY + Math.sin(this.bobTimer * 3) * 2;
        break;
    }

    this.updateBehaviours(dt);
  }

  override render(ctx: CanvasRenderingContext2D): void {
    const px = Math.round(this.x);
    const py = Math.round(this.y);

    ctx.fillStyle = Colors.foreground;
    for (let row = 0; row < this.birdH; row++) {
      const bits = Bird.MASK[row]!;
      for (let col = 0; col < this.birdW; col++) {
        if (bits & (1 << (this.birdW - 1 - col))) {
          ctx.fillRect(px + col, py + row, 1, 1);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// FlapControl Behaviour
// ---------------------------------------------------------------------------

class FlapControl extends Behaviour<Bird> {
  readonly type = "flap-control";

  private input: Input;
  private gs: FloppyState;
  private onRestart: () => void;
  private readonly cooldown: number;
  private wasDown = false;

  constructor(owner: Bird, input: Input, gs: FloppyState, onRestart: () => void, cooldown = 0.5) {
    super(owner);
    this.input = input;
    this.gs = gs;
    this.onRestart = onRestart;
    this.cooldown = cooldown;
  }

  private consumeFlap(): boolean {
    const isDown = this.input.isKeyDown("w");
    if (isDown && !this.wasDown) {
      this.wasDown = true;
      return true;
    }
    if (!isDown) {
      this.wasDown = false;
    }
    return false;
  }

  update(_dt: number): void {
    if (!this.consumeFlap()) return;

    if (this.gs.isReady) {
      this.gs.fsm.transition(GameState.PLAYING);
      this.owner.flap();
    } else if (this.gs.isPlaying) {
      this.owner.flap();
    } else if (this.gs.isGameOver && this.gs.gameOverTimer > this.cooldown) {
      this.onRestart();
    }
  }
}

// ---------------------------------------------------------------------------
// Ground
// ---------------------------------------------------------------------------

class Ground extends DynamicEntity {
  private scrollX = 0;
  private readonly groundH: number;
  private readonly scrollSpeed: number;
  private readonly tickSpacing: number;
  private gs: FloppyState;

  constructor(gs: FloppyState, scrollSpeed = 48, tickSpacing = 6) {
    super("ground", 0, GROUND_Y, WIDTH, 10);
    this.groundH = this.getSize().height;
    this.gs = gs;
    this.scrollSpeed = scrollSpeed;
    this.tickSpacing = tickSpacing;
  }

  override update(dt: number): void {
    if (this.gs.isPlaying) {
      this.scrollX = (this.scrollX + this.scrollSpeed * dt) % this.tickSpacing;
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    ctx.fillRect(0, GROUND_Y, WIDTH, 1);

    ctx.fillStyle = Colors.background;
    ctx.fillRect(0, GROUND_Y + 1, WIDTH, this.groundH - 1);

    ctx.fillStyle = Colors.middle;
    for (let gx = -Math.round(this.scrollX); gx < WIDTH; gx += this.tickSpacing) {
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
  private gs: FloppyState;

  private readonly speed: number;
  private readonly gap: number;
  private readonly pipeWidth: number;
  private readonly spawnInterval: number;
  private readonly minHeight: number;
  private readonly gapRange: number;
  private readonly scorePerPipe: number;

  constructor(bird: Bird, gs: FloppyState, speed = 48, gap = 22, pipeWidth = 11, spawnInterval = 1.4, minHeight = 8, scorePerPipe = 10) {
    super("pipes", 0, 0);
    this.bird = bird;
    this.gs = gs;
    this.speed = speed;
    this.gap = gap;
    this.pipeWidth = pipeWidth;
    this.spawnInterval = spawnInterval;
    this.minHeight = minHeight;
    this.gapRange = GROUND_Y - gap - minHeight * 2;
    this.scorePerPipe = scorePerPipe;
  }

  resetPipes(): void {
    this.pipes.length = 0;
    this.spawnTimer = 0;
  }

  private spawnPipe(): void {
    this.pipes.push({
      x: WIDTH,
      gapY: Math.round(this.minHeight + Math.random() * this.gapRange),
      scored: false,
    });
  }

  override update(dt: number): void {
    if (!this.gs.isPlaying) return;

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnPipe();
      this.spawnTimer = 0;
    }

    const birdPos = this.bird.getPosition();
    const bLeft = Math.round(birdPos.x) + 1;
    const bRight = bLeft + this.bird.birdW - 1;
    const bTop = Math.round(birdPos.y);
    const bBottom = bTop + this.bird.birdH;

    const frameDist = this.speed * dt;
    let writeIdx = 0;

    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i]!;
      pipe.x -= frameDist;

      if (pipe.x + this.pipeWidth < 0) continue;

      if (!pipe.scored && pipe.x + this.pipeWidth < bLeft) {
        pipe.scored = true;
        this.gs.score += this.scorePerPipe;
      }

      const pLeft = Math.round(pipe.x);
      const pRight = pLeft + this.pipeWidth;
      const gapBottom = pipe.gapY + this.gap;

      if (bRight > pLeft && bLeft < pRight) {
        if (bTop < pipe.gapY || bBottom > gapBottom) {
          this.gs.fsm.transition(GameState.GAME_OVER);
        }
      }

      this.pipes[writeIdx++] = pipe;
    }

    this.pipes.length = writeIdx;
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i]!;
      const px = Math.round(pipe.x);
      const gapBottom = pipe.gapY + this.gap;

      ctx.fillRect(px, 0, this.pipeWidth, pipe.gapY);
      ctx.fillRect(px, gapBottom, this.pipeWidth, GROUND_Y - gapBottom);
    }
  }
}

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------

class ScoreLabel extends Text {
  private lastScore = -1;
  private lastVisible = false;
  private gs: FloppyState;

  constructor(gs: FloppyState) {
    super("score-label", "3x5");
    this.y = 2;
    this.gs = gs;
  }

  override update(_dt: number): void {
    const visible = this.gs.isPlaying || this.gs.isGameOver;

    if (!visible) {
      if (this.lastVisible) {
        this.setText("");
        this.lastVisible = false;
      }
      return;
    }

    if (this.gs.score !== this.lastScore || !this.lastVisible) {
      const text = `${this.gs.score}`;
      this.setText(text);
      this.x = Math.round((WIDTH - this.font.getTextWidth(text)) / 2);
      this.lastScore = this.gs.score;
      this.lastVisible = true;
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    super.render(ctx);
  }
}

class MessageLabel extends Text {
  private lastState = GameState.IDLE;
  private lastHighScore = -1;
  private gs: FloppyState;

  constructor(gs: FloppyState) {
    super("message-label", "3x5");
    this.y = Math.round(GROUND_Y / 2 + 10);
    this.gs = gs;
  }

  override update(_dt: number): void {
    if (this.gs.fsm.current === this.lastState && this.gs.highScore === this.lastHighScore) return;
    this.lastState = this.gs.fsm.current;
    this.lastHighScore = this.gs.highScore;

    let text = "";
    switch (this.gs.fsm.current) {
      case GameState.READY:
        text = "PRESS W TO FLAP";
        break;
      case GameState.GAME_OVER:
        text = `GAME OVER  HI:${this.gs.highScore}`;
        break;
    }

    this.setText(text);
    this.x = Math.round((WIDTH - this.font.getTextWidth(text)) / 2);
  }

  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.foreground;
    super.render(ctx);
  }
}

// ---------------------------------------------------------------------------
// Floppy — Engine subclass that owns state and orchestrates entities
// ---------------------------------------------------------------------------

class Floppy extends Engine {
  readonly gs = new FloppyState();

  private bird: Bird;
  private pipes: PipeManager;

  constructor() {
    super("game", WIDTH, HEIGHT, {
      backgroundColor: Colors.background,
      gameScale: 4,
    });

    const input = new Input();
    const scrollSpeed = 48;

    this.bird = new Bird(this.gs);
    this.bird.attachBehaviour(new FlapControl(this.bird, input, this.gs, () => this.restart()));

    this.pipes = new PipeManager(this.bird, this.gs, scrollSpeed);

    this.use(
      new ObjectSystem([
        this.pipes,
        this.bird,
        new Ground(this.gs, scrollSpeed),
        new ScoreLabel(this.gs),
        new MessageLabel(this.gs),
      ]),
    );
  }

  restart(): void {
    this.gs.fsm.transition(GameState.PLAYING);
    this.gs.score = 0;
    this.bird.reset();
    this.bird.flap();
    this.pipes.resetPipes();
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const floppy = new Floppy();

floppy.setup(() => {
  floppy.gs.fsm.transition(GameState.READY);
});
