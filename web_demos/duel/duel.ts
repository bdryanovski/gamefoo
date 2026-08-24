import {
  Behaviour,
  Bitmap,
  BitmapAnimator,
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

const CONSOLE = 'ATARI_2600';

const RESOLUTION = CONSOLES[CONSOLE].resolution;
const COLORS = CONSOLES[CONSOLE].palette.named;
const KEYS = CONTROL_SCHEMES[CONSOLE];

const CANVAS_W = RESOLUTION.width;
const CANVAS_H = RESOLUTION.height;

const PLAYER_W = 10;
const PLAYER_H = 30;

const WORLD_PADDING = 10;

const renderer = new WebRenderer('game', CANVAS_W, CANVAS_H, 5);

const engine = new Engine(renderer, {
  backgroundColor: COLORS.BLACK,
});

class Player extends DynamicEntity {
  private color: string = COLORS.WHITE;

  protected animator: BitmapAnimator;

  constructor(name: string, x: number, y: number, color: string) {
    super(name, x, y, PLAYER_W, PLAYER_H);
    this.color = color;

    this.setSpeed(100);

    this.animator = new BitmapAnimator(
      {
        x: x,
        y: y,
      },
      {
        width: PLAYER_W,
        height: PLAYER_H,
      },
      {
        idle: [
          new Bitmap('walk_0', [50, 27, 33, 42, 45, 2, 27], { width: 7, height: 7 }),
          new Bitmap('walk_1', [20, 77, 19, 92, 25, 62, 87], { width: 7, height: 7 }),
          new Bitmap('walk_2', [80, 57, 3, 42, 15, 62, 57], { width: 7, height: 7 }),
        ],
      },
    );

    this.animator.loop(true);
    this.animator.setDuration(0.5);
  }
  update(dt: number) {
    super.update(dt);
    this.animator.update(dt);
    this.animator.state('idle');
  }

  render(ctx: RenderContext) {
    super.renderBehaviours(ctx);
    // ctx.fillRect(this.x, this.y, this.size.width, this.size.height, this.color);
    this.animator.x = this.x;
    this.animator.y = this.y;

    this.animator.render(ctx);
  }

  getColor() {
    return this.color;
  }
}

const PlayerA = new Player('PlayerA', WORLD_PADDING, WORLD_PADDING, COLORS.YELLOW);
const PlayerB = new Player(
  'PlayerB',
  CANVAS_W - WORLD_PADDING - PLAYER_W,
  CANVAS_H - WORLD_PADDING - PLAYER_H,
  COLORS.PURPLE,
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
  private shake: number;

  constructor(
    owner: DynamicEntity,
    target: DynamicEntity,
    speed = 400,
    keepDistance = 120,
    alignThreshold = 5,
    shake = 10,
  ) {
    super(owner);
    this.target = target;
    this.speed = speed;
    this.keepDistance = keepDistance;
    this.alignThreshold = alignThreshold;
    this.shake = shake;
  }

  private directionTime = 0;
  private targetOffsetX = 0;
  private targetOffsetY = 0;
  private currentOffsetX = 0;
  private currentOffsetY = 0;
  private smoothing = 0.1;

  override update(dt: number): void {
    this.directionTime -= dt;
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

    // Chase or retreat to maintain exact distance
    if (distance > this.keepDistance + 2) {
      // Too far - move closer
      moveX = dx > 0 ? 1 : -1;
    } else if (distance < this.keepDistance - 2) {
      // Too close - back away
      moveX = dx > 0 ? -1 : 1;
    }
    // Small buffer of ±2 pixels to prevent jitter at exact distance

    // Random shake offset (only when at keepDistance, for dodge effect)
    if (this.directionTime <= 0) {
      this.targetOffsetX = (Math.random() * 2 - 1) * this.shake;
      this.targetOffsetY = (Math.random() * 2 - 1) * this.shake;
      this.directionTime = 0.3 + Math.random() * 0.5;
    }

    // Smooth the shake
    this.currentOffsetX += (this.targetOffsetX - this.currentOffsetX) * this.smoothing;
    this.currentOffsetY += (this.targetOffsetY - this.currentOffsetY) * this.smoothing;

    // Combine chase movement + shake into final velocity
    const finalX = moveX * this.speed + this.currentOffsetX;
    const finalY = moveY * this.speed + this.currentOffsetY;

    // Normalize if needed to cap max speed
    const len = Math.sqrt(finalX * finalX + finalY * finalY);
    if (len > 0) {
      const maxSpeed = this.speed + this.shake;
      const scale = Math.min(1, maxSpeed / len);
      this.owner.setVelocity({ x: (finalX / len) * scale, y: (finalY / len) * scale });
      this.owner.setSpeed(len * scale);
    } else {
      this.owner.setVelocity({ x: 0, y: 0 });
    }
  }
}

// -- implementation

const input = new Input({ canvasId: 'game', gameScale: engine.gameScale });

PlayerA.attachBehaviour(new Control(PlayerA, input));
PlayerA.attachBehaviour(new AimControl(PlayerA, input));

// EnemyAI(owner, target, speed, keepDistance, alignThreshold)
PlayerB.attachBehaviour(new EnemyAI(PlayerB, PlayerA, 80, 60, 5));

engine.use(input);
engine.use(new ObjectSystem([PlayerA, PlayerB, new Bullet('1', 20, 30)]));
engine.use(new MonitorSystem({ graph: false }));

engine.setup(() => {});
