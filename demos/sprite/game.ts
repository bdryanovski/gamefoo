import {
  Control,
  DynamicEntity,
  Engine,
  Input,
  Player,
  Asset,
  Sprite,
  SpriteRender,
} from "../../src/index";

const CANVAS_W = 800;
const CANVAS_H = 600;
const TILE = 48;

const engine = new Engine("game", CANVAS_W, CANVAS_H, {
  backgroundColor: "#1a1a2e",
});

const input = new Input();

/** Minimal entity that delegates update/render entirely to behaviours. */
class SpriteEntity extends DynamicEntity {
  constructor(id: string, x: number, y: number, w: number, h: number) {
    super(id, x, y, w, h);
  }
  override update(dt: number): void {
    this.updateBehaviours(dt);
  }
  override render(ctx: CanvasRenderingContext2D): void {
    this.renderBehaviours(ctx);
  }
}

/** Simple canvas text label. */
class Label extends DynamicEntity {
  private text: string;
  constructor(id: string, text: string, x: number, y: number) {
    super(id, x, y, 0, 0);
    this.text = text;
  }
  override update(_dt: number): void {}
  override render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#6666aa";
    ctx.font = "bold 13px monospace";
    ctx.fillText(this.text, this.x, this.y);
  }
}

/** Player with directional sprite animation controlled by keyboard. */
class Hero extends Player {
  private sr?: SpriteRender;

  constructor(x: number, y: number) {
    super("hero", x, y, TILE, TILE);
  }

  bindSprite(sr: SpriteRender): void {
    this.sr = sr;
  }

  override update(dt: number): void {
    super.update(dt);

    this.x = Math.max(0, Math.min(CANVAS_W - TILE, this.x));
    this.y = Math.max(0, Math.min(CANVAS_H - TILE, this.y));

    if (!this.sr) return;

    const left = input.isKeyDown("a") || input.isKeyDown("arrowleft");
    const right = input.isKeyDown("d") || input.isKeyDown("arrowright");
    const up = input.isKeyDown("w") || input.isKeyDown("arrowup");
    const down = input.isKeyDown("s") || input.isKeyDown("arrowdown");

    if (left) {
      this.sr.play("walk_side");
      this.sr.setFlipX(true);
    } else if (right) {
      this.sr.play("walk_side");
      this.sr.setFlipX(false);
    } else if (up) {
      this.sr.setFlipX(false);
      this.sr.play("walk_up");
    } else if (down) {
      this.sr.setFlipX(false);
      this.sr.play("walk_down");
    } else {
      this.sr.setFlipX(false);
      this.sr.play("idle");
    }
  }

  override render(ctx: CanvasRenderingContext2D): void {
    this.renderBehaviours(ctx);
  }
}

const hero = new Hero(380, 400);
hero.attachBehaviour(new Control(hero, input));
engine.player = hero;

engine.setup(async () => {
  const image = await Asset.load("/sprite/assets/tiles.png");
  const cols = Math.floor(image.width / 16);

  /** Convert tile column/row to flat frame index. */
  const f = (col: number, row: number) => row * cols + col;

  // ═══════════════════════════════════════════════════════════
  //  1 · STATIC SPRITES — single-frame, no animation
  // ═══════════════════════════════════════════════════════════

  engine.attachObjects(new Label("lbl-s", "1 · Static Sprites", 30, 35));

  const staticTiles = [
    { col: 0, row: 0 },
    { col: 1, row: 0 },
    { col: 2, row: 0 },
    { col: 3, row: 0 },
    { col: 0, row: 1 },
    { col: 1, row: 1 },
  ];

  for (let i = 0; i < staticTiles.length; i++) {
    const t = staticTiles[i]!;
    const entity = new SpriteEntity(
      `static-${i}`,
      30 + i * (TILE + 8),
      45,
      TILE,
      TILE,
    );
    const sheet = new Sprite(image, 16, 16, {
      idle: { frames: [f(t.col, t.row)], duration: 1, loop: true },
    });
    const sr = new SpriteRender(entity, sheet);
    entity.attachBehaviour(sr);
    sr.play("idle");
    engine.attachObjects(entity);
  }

  // ═══════════════════════════════════════════════════════════
  //  2 · ANIMATED SPRITES — looping at different speeds
  // ═══════════════════════════════════════════════════════════

  engine.attachObjects(
    new Label(
      "lbl-a",
      "2 · Animated Sprites (looping at different speeds)",
      30,
      150,
    ),
  );

  const animDefs = [
    { frames: [f(0, 0), f(1, 0), f(2, 0), f(3, 0)], dur: 0.4 },
    { frames: [f(0, 2), f(1, 2), f(2, 2), f(3, 2)], dur: 0.25 },
    { frames: [f(4, 0), f(5, 0), f(6, 0), f(7, 0)], dur: 0.15 },
    { frames: [f(4, 2), f(5, 2), f(6, 2), f(7, 2)], dur: 0.08 },
  ];

  for (let i = 0; i < animDefs.length; i++) {
    const a = animDefs[i]!;
    const x = 30 + i * (TILE + 40);

    const entity = new SpriteEntity(`anim-${i}`, x, 160, TILE, TILE);
    const sheet = new Sprite(image, 16, 16, {
      loop: { frames: a.frames, duration: a.dur, loop: true },
    });
    const sr = new SpriteRender(entity, sheet);
    entity.attachBehaviour(sr);
    sr.play("loop");
    engine.attachObjects(entity);

    engine.attachObjects(
      new Label(`lbl-d${i}`, `${a.dur}s`, x + 12, 160 + TILE + 16),
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  3 · PLAYER — key press changes animation + flipX demo
  // ═══════════════════════════════════════════════════════════

  engine.attachObjects(
    new Label(
      "lbl-p",
      "3 · Player (WASD / Arrows — animation changes direction, flipX for left)",
      30,
      310,
    ),
  );

  const heroSheet = new Sprite(image, 16, 16, {
    idle: { frames: [f(104, 0)], duration: 1, loop: true },
    walk_down: {
      frames: [f(104, 0), f(105, 0), f(106, 0)],
      duration: 0.15,
      loop: true,
    },
    walk_side: {
      frames: [f(104, 1), f(105, 1), f(106, 1)],
      duration: 0.15,
      loop: true,
    },
    walk_up: {
      frames: [f(104, 3), f(105, 3), f(106, 3)],
      duration: 0.15,
      loop: true,
    },
  });

  const sr = new SpriteRender(hero, heroSheet);
  hero.attachBehaviour(sr);
  hero.bindSprite(sr);
  sr.play("idle");
});
