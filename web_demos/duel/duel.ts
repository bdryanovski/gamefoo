import {
  Behaviour,
  CONSOLES,
  Control,
  CONTROL_SCHEMES,
  DynamicEntity,
  Engine,
  Input,
  InputMapper,
  MonitorSystem,
  ObjectSystem,
  RenderContext,
  Vector2,
  WebRenderer,
} from '../../src/index';

const RESOLUTION = CONSOLES['PLAYDATE'].resolution;
const COLORS = CONSOLES['PLAYDATE'].palette.named;
const KEYS = CONTROL_SCHEMES['PLAYDATE'];

const CANVAS_W = RESOLUTION.width;
const CANVAS_H = RESOLUTION.height;

const PLAYER_W = 10;
const PLAYER_H = 30;

const WORLD_PADDING = 10;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H);

const engine = new Engine(renderer, {
  backgroundColor: COLORS.BLACK,
});

class Player extends DynamicEntity {
  constructor(name: string, x: number, y: number) {
    super(name, x, y, PLAYER_W, PLAYER_H);

    this.setSpeed(100);
  }
  update(dt: number) {
    super.update(dt);
  }

  render(ctx: RenderContext) {
    super.renderBehaviours(ctx);
    ctx.fillRect(this.x, this.y, this.size.width, this.size.height, COLORS.WHITE);
  }
}

const PlayerA = new Player('PlayerA', WORLD_PADDING, WORLD_PADDING);
const PlayerB = new Player(
  'PlayerB',
  CANVAS_W - WORLD_PADDING - PLAYER_W,
  CANVAS_H - WORLD_PADDING - PLAYER_H,
);

class AimControl extends Behaviour<DynamicEntity> {
  readonly type = 'AimControl';
  private target: DynamicEntity;
  private map: any;
  private input: Input;
  private aimX: number;
  private aimY: number;
  constructor(target: DynamicEntity, input: Input) {
    super(target);

    this.input = input;

    this.map = new InputMapper(input, KEYS);
  }

  override update(dt: number) {
    this.input.update();
    super.update(dt);
    const { x, y } = this.input.getMousePosition();

    if (this.map.isActionPressed('PRIMARY')) {
      console.log('Space bar', x, y);
    }
    this.aimX = x;
    this.aimY = y;
  }

  override render(ctx: RenderContext) {
    ctx.drawText('X', this.aimX, this.aimY, COLORS.WHITE);
  }
}

class Bullet extends DynamicEntity {
  private root: Vector2;
  private end: Vector2;

  constructor(name: string, x: number, y: number) {
    super('bullet_' + name, x, y, 3, 3);
    this.root = { x, y };
    this.end = {
      x: 200,
      y: 300,
    };
    this.speed = 1;
  }

  override update(dt: number) {
    super.update(dt);

    if (this.outOfScreen()) {
      return;
    }

    const dx = this.end.x - this.root.x;
    const dy = this.end.y - this.root.y;

    const length = Math.sqrt(dx * 2 + dy * 2);
    const dirX = dx / length;
    const dirY = dy / length;

    this.position.x += dirX * this.speed;
    this.position.y += dirY * this.speed;
  }

  override render(ctx: RenderContext) {
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height, COLORS.WHITE);
  }

  public direction(target: Vector2) {
    this.end = target;
  }

  private outOfScreen() {
    if (this.position.x >= CANVAS_W || this.position.x <= 0) {
      return true;
    }
    if (this.position.y >= CANVAS_H || this.position.y <= 0) {
      return true;
    }

    return false;
  }
}

class EnemyAI extends Behaviour<DynamicEntity> {
  readonly type = 'AI';
  private target: DynamicEntity;
  private speed: number;
  private keepDistance: number;
  private alignThreshold: number;

  constructor(
    owner: DynamicEntity,
    target: DynamicEntity,
    speed = 80,
    keepDistance = 50,
    alignThreshold = 5,
  ) {
    super(owner);
    this.target = target;
    this.speed = speed;
    this.keepDistance = keepDistance;
    this.alignThreshold = alignThreshold;
  }

  override update(dt: number): void {
    const enemyPos = this.owner.getPosition();
    const targetPos = this.target.getPosition();

    // Calculate distance to target
    const dx = targetPos.x - enemyPos.x;
    const dy = targetPos.y - enemyPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let moveX = 0;
    let moveY = 0;

    // Align vertically with player (match Y position)
    if (Math.abs(dy) > this.alignThreshold) {
      moveY = dy > 0 ? 1 : -1;
    }

    // Chase or retreat based on distance
    if (distance > this.keepDistance) {
      // Too far - move closer (only on X axis to maintain alignment behavior)
      moveX = dx > 0 ? 1 : -1;
    } else if (distance < this.keepDistance * 0.8) {
      // Too close - back away
      moveX = dx > 0 ? -1 : 1;
    }
    // If at ideal distance, stay put on X axis (moveX stays 0)

    // Normalize and apply movement
    const len = Math.sqrt(moveX * moveX + moveY * moveY);
    if (len > 0) {
      this.owner.setVelocity({ x: moveX / len, y: moveY / len });
      this.owner.setSpeed(this.speed);
    } else {
      this.owner.setVelocity({ x: 0, y: 0 });
    }
  }
}

// -- implementation

const input = new Input({ canvasId: 'game', gameScale: 1 });

PlayerA.attachBehaviour(new Control(PlayerA, input));
PlayerA.attachBehaviour(new AimControl(PlayerA, input));

// EnemyAI(owner, target, speed, keepDistance, alignThreshold)
PlayerB.attachBehaviour(new EnemyAI(PlayerB, PlayerA, 80, 60, 5));

engine.use(input);
engine.use(new ObjectSystem([PlayerA, PlayerB, new Bullet('1', 20, 30)]));
engine.use(new MonitorSystem());

engine.setup(() => {});
