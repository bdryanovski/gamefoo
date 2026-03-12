import {
  Collidable,
  Control,
  DynamicEntity,
  Engine,
  Entity,
  FontBitmap,
  Input,
  Player,
  World,
} from "../../src/index";

import Sprite from "../../src/core/sprite";
import { Grid } from "../../src/core/grid/grid";
import { IsometricProjection } from "../../src/core/grid/isometric";
import { TileSet } from "../../src/core/tilemap/tileset";
import { TileMap } from "../../src/core/tilemap/tilemap";
import { TilemapSystem } from "../../src/core/tilemap/tilemap_system";
import { IsometricCameraSystem } from "../../src/subsystems/iso_camera_system";
import { Pathfinder } from "../../src/core/utils/pathfinding";
import { PathFollower } from "../../src/core/behaviours/path_follower";
import { MapGenerator } from "../../src/core/utils/map_generator";
import { GridDebugSystem } from "../../src/debug/grid_debug";
import { ObjectSystem } from "../../src/subsystems/object_system";
import { CollisionSystem } from "../../src/subsystems/collision_system";
import { MonitorSystem } from "../../src/subsystems/monitor_system";
import type { BiomeRule } from "../../src/core/utils/map_generator_types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CANVAS_W = 640;
const CANVAS_H = 480;
const TILE_W = 64;
const TILE_H = 32;
const MAP_COLS = 30;
const MAP_ROWS = 24;
const NPC_SPEED = 50;

// ---------------------------------------------------------------------------
// Biome colors — index matches biome tileId (0..5)
// ---------------------------------------------------------------------------

const BIOME_COLORS = [
  "#1a3a5c", // 0 deep_water
  "#2a5a8c", // 1 water
  "#c2b280", // 2 sand
  "#5a8a3a", // 3 grass
  "#3a6a2a", // 4 forest
  "#6a6a6a", // 5 mountain
];

const biomes: BiomeRule[] = [
  { name: "deep_water", tileId: 0, minNoise: -1.0,  maxNoise: -0.35, walkable: false },
  { name: "water",      tileId: 1, minNoise: -0.35, maxNoise: -0.1,  walkable: false },
  { name: "sand",       tileId: 2, minNoise: -0.1,  maxNoise:  0.05, walkable: true },
  { name: "grass",      tileId: 3, minNoise:  0.05, maxNoise:  0.45, walkable: true },
  { name: "forest",     tileId: 4, minNoise:  0.45, maxNoise:  0.7,  walkable: true },
  { name: "mountain",   tileId: 5, minNoise:  0.7,  maxNoise:  1.01, walkable: false },
];

// ---------------------------------------------------------------------------
// Decoration config — what to scatter on each biome
// ---------------------------------------------------------------------------

interface DecoConfig {
  color: string;
  type: "tree" | "bush" | "rock" | "grass" | "cactus" | "flower";
  solid: boolean;
  heightTiles: number;
}

const BIOME_DECOS: Record<number, { items: DecoConfig[]; chance: number }> = {
  2: {
    chance: 0.06,
    items: [
      { color: "#8a8060", type: "rock",   solid: true,  heightTiles: 1 },
      { color: "#6a9a4a", type: "cactus", solid: true,  heightTiles: 2 },
    ],
  },
  3: {
    chance: 0.25,
    items: [
      { color: "#4a8a2a", type: "grass",  solid: true,  heightTiles: 1.5 },
      { color: "#3a7a1a", type: "grass",  solid: true,  heightTiles: 1 },
      { color: "#e46a8a", type: "flower", solid: false, heightTiles: 1 },
      { color: "#eaaa3a", type: "flower", solid: false, heightTiles: 1 },
    ],
  },
  4: {
    chance: 0.35,
    items: [
      { color: "#2a5a1a", type: "tree",  solid: true, heightTiles: 3 },
      { color: "#1a4a0a", type: "tree",  solid: true, heightTiles: 3 },
      { color: "#3a6a2a", type: "bush",  solid: true, heightTiles: 1.5 },
      { color: "#4a5a3a", type: "rock",  solid: true, heightTiles: 1 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Procedural tileset — draws colored isometric diamonds onto a canvas
// ---------------------------------------------------------------------------

function generateTilesetImage(
  colors: string[],
  tileW: number,
  tileH: number,
): HTMLImageElement {
  const count = colors.length;
  const canvas = document.createElement("canvas");
  canvas.width = tileW * count;
  canvas.height = tileH;
  const ctx = canvas.getContext("2d")!;

  const hw = tileW / 2;
  const hh = tileH / 2;

  for (let i = 0; i < count; i++) {
    const ox = i * tileW;

    ctx.fillStyle = colors[i]!;
    ctx.beginPath();
    ctx.moveTo(ox + hw, 0);
    ctx.lineTo(ox + tileW, hh);
    ctx.lineTo(ox + hw, tileH);
    ctx.lineTo(ox, hh);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

// ---------------------------------------------------------------------------
// Decoration Entity — simple colored shape
// ---------------------------------------------------------------------------

class DecorationEntity extends Entity {
  private config: DecoConfig;

  constructor(id: string, x: number, y: number, config: DecoConfig) {
    super(id, x, y, 10, 10);
    this.config = config;
  }

  update(_dt: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const { color, type } = this.config;

    switch (type) {
      case "tree": {
        ctx.fillStyle = "#4a3520";
        ctx.fillRect(this.x + 3, this.y + 6, 3, 8);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y - 6);
        ctx.lineTo(this.x + 12, this.y + 7);
        ctx.lineTo(this.x - 2, this.y + 7);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "bush": {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(this.x + 5, this.y + 4, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "rock": {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(this.x + 4, this.y + 4, 5, 3, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.ellipse(this.x + 3, this.y + 3, 3, 2, 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "grass": {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const bx = this.x + i * 2;
          const h = 4 + (i % 3) * 2;
          ctx.beginPath();
          ctx.moveTo(bx, this.y + 6);
          ctx.lineTo(bx + 1, this.y + 6 - h);
          ctx.stroke();
        }
        break;
      }
      case "cactus": {
        ctx.fillStyle = color;
        ctx.fillRect(this.x + 3, this.y - 2, 3, 10);
        ctx.fillRect(this.x, this.y + 1, 3, 4);
        ctx.fillRect(this.x + 6, this.y + 3, 3, 4);
        break;
      }
      case "flower": {
        ctx.fillStyle = "#3a7a1a";
        ctx.fillRect(this.x + 4, this.y + 2, 1, 5);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x + 4, this.y + 1, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Static Collider Entity — invisible collision body for solid decorations
// ---------------------------------------------------------------------------

class StaticColliderEntity extends Entity {
  constructor(id: string, x: number, y: number, w: number, h: number) {
    super(id, x, y, w, h);
  }
  update(_dt: number): void {}
  render(_ctx: CanvasRenderingContext2D): void {}
}

// ---------------------------------------------------------------------------
// NPC Entity — a simple wandering character rendered as a pixel sprite
// ---------------------------------------------------------------------------

class NpcEntity extends DynamicEntity {
  private color: string;
  private label: string;
  private font: FontBitmap;

  constructor(id: string, x: number, y: number, color: string, label: string) {
    super(id, x, y, 10, 10);
    this.color = color;
    this.label = label;
    this.font = new FontBitmap("3x5");
  }

  update(dt: number): void {
    this.updateBehaviours(dt);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(this.x + 5, this.y + 12, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + 2, this.y + 2, 6, 8);

    ctx.fillStyle = "#fdd";
    ctx.fillRect(this.x + 3, this.y, 4, 4);

    ctx.fillStyle = "#222";
    ctx.fillRect(this.x + 3, this.y + 1, 1, 1);
    ctx.fillRect(this.x + 6, this.y + 1, 1, 1);

    ctx.fillStyle = "#fff";
    this.font.renderText(this.label, this.x - 2, this.y - 8, ctx);

    this.renderBehaviours(ctx);
  }
}

// ---------------------------------------------------------------------------
// Player Entity — keyboard-controlled pixel character
// ---------------------------------------------------------------------------

class HeroEntity extends Player {
  private font: FontBitmap;

  constructor(x: number, y: number) {
    super("hero", x, y, 12, 12);
    this.font = new FontBitmap("3x5");
  }

  update(dt: number): void {
    this.updateBehaviours(dt);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(this.x + 6, this.y + 14, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4488ff";
    ctx.fillRect(this.x + 2, this.y + 3, 8, 9);

    ctx.fillStyle = "#fdd";
    ctx.fillRect(this.x + 3, this.y, 6, 5);

    ctx.fillStyle = "#222";
    ctx.fillRect(this.x + 4, this.y + 2, 1, 1);
    ctx.fillRect(this.x + 7, this.y + 2, 1, 1);

    ctx.fillStyle = "#543";
    ctx.fillRect(this.x + 3, this.y, 6, 1);

    ctx.fillStyle = "#4af";
    this.font.renderText("YOU", this.x, this.y - 8, ctx);

    this.renderBehaviours(ctx);
  }
}

// ---------------------------------------------------------------------------
// HUD Entity — draws info overlay in screen-space
// ---------------------------------------------------------------------------

class HudEntity extends Entity {
  private cameraSystem: IsometricCameraSystem;
  private player: HeroEntity;
  private projection: IsometricProjection;
  private font: FontBitmap;

  constructor(
    cam: IsometricCameraSystem,
    player: HeroEntity,
    projection: IsometricProjection,
  ) {
    super("hud", 0, 0, 0, 0);
    this.cameraSystem = cam;
    this.player = player;
    this.projection = projection;
    this.font = new FontBitmap("3x5");
  }

  update(_dt: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const cell = this.projection.screenToGrid(this.player.x, this.player.y);
    const zoom = this.cameraSystem.camera.zoom;

    const lines = [
      `ISOMETRIC DEMO`,
      `pos: ${this.player.x.toFixed(0)},${this.player.y.toFixed(0)}`,
      `cell: ${cell.col},${cell.row}`,
      `zoom: ${zoom.toFixed(1)}x`,
      ``,
      `G=grid C=coll P=path`,
      `+/- = zoom`,
    ];

    const lh = 8;
    const px = 6;
    const py = 6;

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(px - 2, py - 2, 100, lines.length * lh + 6);

    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = i === 0 ? "#7fdbca" : "#ccc";
      this.font.renderText(lines[i]!, px, py + i * lh, ctx);
    }

    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

function main() {
  const engine = new Engine("game", CANVAS_W, CANVAS_H, {
    backgroundColor: "#1a2a3a",
  });

  // ── Projection ──────────────────────────────────────────────────
  const projection = new IsometricProjection({
    tileWidth: TILE_W,
    tileHeight: TILE_H,
    origin: { x: MAP_COLS * (TILE_W / 2), y: 32 },
  });

  // ── Procedural tileset — colored diamonds ──────────────────────
  const tilesetImg = generateTilesetImage(BIOME_COLORS, TILE_W, TILE_H);
  const sprite = Sprite.fromGrid(tilesetImg, {
    frameWidth: TILE_W,
    frameHeight: TILE_H,
  });
  const tileSet = new TileSet({ sprite });

  // ── Map generation ─────────────────────────────────────────────
  const mapGen = new MapGenerator({
    cols: MAP_COLS,
    rows: MAP_ROWS,
    seed: 19,
    scale: 0.09,
    octaves: 4,
    lacunarity: 2,
    persistence: 0.5,
    biomes,
  });

  const { grid, layer: groundLayer } = mapGen.buildLayer(tileSet, "ground", TILE_W, TILE_H);

  const tilemap = new TileMap({
    grid,
    layers: [groundLayer],
    projection,
    collisionLayerName: "ground",
  });

  // ── Collision world ────────────────────────────────────────────
  const world = new World();
  tilemap.buildColliders(world);

  // ── Find a walkable spawn point near the center ────────────────
  function findWalkableCell(preferCol: number, preferRow: number): { col: number; row: number } {
    for (let radius = 0; radius < Math.max(MAP_COLS, MAP_ROWS); radius++) {
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const c = preferCol + dc;
          const r = preferRow + dr;
          const cell = grid.getCell(c, r);
          if (cell?.walkable) return { col: c, row: r };
        }
      }
    }
    return { col: preferCol, row: preferRow };
  }

  // ── Player ─────────────────────────────────────────────────────
  const spawnCell = findWalkableCell(Math.floor(MAP_COLS / 2), Math.floor(MAP_ROWS / 2));
  const spawnPos = projection.gridToScreen(spawnCell.col, spawnCell.row);

  const player = new HeroEntity(spawnPos.x + TILE_W / 2 - 6, spawnPos.y + TILE_H / 2 - 6);

  const input = new Input();
  const control = new Control(player, input);
  Object.assign(control, { speed: 100 });
  player.attachBehaviour(control);
  player.attachBehaviour(
    new Collidable(player, world, {
      shape: { type: "aabb", width: 12, height: 12 },
      solid: true,
      tags: new Set(["player"]),
      collidesWith: new Set(["wall", "npc"]),
    }),
  );

  // ── NPCs with pathfinding ─────────────────────────────────────
  const pathfinder = new Pathfinder({
    grid,
    allowDiagonal: true,
    heuristic: "euclidean",
  });

  const NPC_COLORS = ["#e44", "#e84", "#e4e", "#4ee"];
  const NPC_NAMES = ["ADA", "BOB", "MAX", "ZOE"];
  const npcs: NpcEntity[] = [];
  const followers: PathFollower[] = [];

  for (let i = 0; i < 4; i++) {
    const npcCell = findWalkableCell(
      4 + Math.floor(Math.random() * (MAP_COLS - 8)),
      4 + Math.floor(Math.random() * (MAP_ROWS - 8)),
    );
    const npcPos = projection.gridToScreen(npcCell.col, npcCell.row);

    const npc = new NpcEntity(
      `npc_${i}`,
      npcPos.x + TILE_W / 2 - 5,
      npcPos.y + TILE_H / 2 - 5,
      NPC_COLORS[i]!,
      NPC_NAMES[i]!,
    );

    npc.attachBehaviour(
      new Collidable(npc, world, {
        shape: { type: "aabb", width: 10, height: 10 },
        solid: true,
        tags: new Set(["npc"]),
        collidesWith: new Set(["wall", "player"]),
      }),
    );

    const follower = new PathFollower(npc, pathfinder, grid, {
      projection,
      speed: NPC_SPEED,
      arrivalThreshold: 4,
      onPathComplete: () => wanderTo(follower),
    });
    npc.attachBehaviour(follower);

    npcs.push(npc);
    followers.push(follower);
  }

  function wanderTo(follower: PathFollower): void {
    let attempts = 0;
    while (attempts < 20) {
      const col = Math.floor(Math.random() * MAP_COLS);
      const row = Math.floor(Math.random() * MAP_ROWS);
      if (grid.getCell(col, row)?.walkable) {
        if (follower.moveTo(col, row)) return;
      }
      attempts++;
    }
  }

  for (const f of followers) wanderTo(f);

  // ── Scatter colored decorations on biome-appropriate tiles ─────
  const decorations: DecorationEntity[] = [];
  const decoColliders: StaticColliderEntity[] = [];
  let decoId = 0;

  grid.forEach((cell) => {
    const biomeDecor = BIOME_DECOS[cell.value];
    if (!biomeDecor || !cell.walkable) return;
    if (Math.random() >= biomeDecor.chance) return;

    const cfg = biomeDecor.items[Math.floor(Math.random() * biomeDecor.items.length)]!;

    const pos = projection.gridToScreen(cell.col, cell.row);
    const cx = cfg.solid
      ? pos.x + TILE_W / 2
      : pos.x + TILE_W / 2 + (Math.random() * 8 - 4);
    const cy = cfg.solid
      ? pos.y + TILE_H / 2
      : pos.y + TILE_H / 2 + (Math.random() * 4 - 2);

    decorations.push(
      new DecorationEntity(`deco_${decoId++}`, cx, cy, cfg),
    );

    if (cfg.solid) {
      const collW = TILE_W * 0.35;
      const collH = TILE_H * 0.5;
      const collEntity = new StaticColliderEntity(
        `dcol_${cell.col}_${cell.row}`,
        cx - collW / 2,
        cy,
        collW,
        collH,
      );
      collEntity.attachBehaviour(
        new Collidable(collEntity, world, {
          shape: { type: "aabb", width: collW, height: collH },
          solid: true,
          fixed: true,
          tags: new Set(["wall"]),
          collidesWith: new Set(["player", "npc"]),
        }),
      );
      decoColliders.push(collEntity);
    }
  });

  // ── Camera ─────────────────────────────────────────────────────
  const cameraSystem = new IsometricCameraSystem(
    CANVAS_W,
    CANVAS_H,
    () => player.getPosition(),
    projection,
    { zoom: 1.5, lerpSpeed: 0.08, minZoom: 0.5, maxZoom: 4 },
  );

  // ── HUD ────────────────────────────────────────────────────────
  const hud = new HudEntity(cameraSystem, player, projection);

  // ── Debug system ───────────────────────────────────────────────
  const debugSystem = new GridDebugSystem({
    grid,
    projection,
    world,
    showGrid: false,
    showCollisionBounds: false,
    showPathfinding: false,
    showTileInspector: true,
    showWorldCoordinates: true,
  });

  // ── Object system (Y-sorted for isometric depth) ───────────────
  const allEntities = [player, ...npcs, ...decorations, ...decoColliders];
  const objectSystem = new ObjectSystem(allEntities, { depthSort: true });

  // HUD renders in screen-space — always on top, not Y-sorted.
  const hudSystem = new ObjectSystem([hud]);
  hudSystem.order = 90;

  // ── Wire up subsystems ─────────────────────────────────────────
  engine.use(cameraSystem);

  const tmSystem = new TilemapSystem(tilemap);
  engine.use(tmSystem);
  tmSystem.attachCamera(cameraSystem);

  engine.use(objectSystem);
  engine.use(new CollisionSystem(world));
  engine.use(debugSystem);
  engine.use(hudSystem);
  engine.use(new MonitorSystem());

  // ── Keyboard toggles ──────────────────────────────────────────
  const keyState: Record<string, boolean> = {};

  document.addEventListener("keydown", (e) => {
    if (keyState[e.key]) return;
    keyState[e.key] = true;

    if (e.key === "g" || e.key === "G") {
      (debugSystem as any).showGrid = !(debugSystem as any).showGrid;
    }
    if (e.key === "p" || e.key === "P") {
      (debugSystem as any).showPathfinding = !(debugSystem as any).showPathfinding;
      if ((debugSystem as any).showPathfinding) {
        const allPaths: { col: number; row: number }[] = [];
        for (const f of followers) {
          allPaths.push(...f.currentPath);
        }
        debugSystem.setDebugPath(allPaths);
      } else {
        debugSystem.setDebugPath([]);
      }
    }
    if (e.key === "c" || e.key === "C") {
      (debugSystem as any).showCollisionBounds = !(debugSystem as any).showCollisionBounds;
    }
    if (e.key === "=" || e.key === "+") {
      cameraSystem.camera.zoom = Math.min(4, cameraSystem.camera.zoom + 0.5);
    }
    if (e.key === "-" || e.key === "_") {
      cameraSystem.camera.zoom = Math.max(0.5, cameraSystem.camera.zoom - 0.5);
    }
  });

  document.addEventListener("keyup", (e) => {
    keyState[e.key] = false;
  });

  // ── Continuously feed path data to debug overlay ───────────────
  let debugTick = 0;

  const originalUpdate = engine.update.bind(engine);
  engine.update = (dt: number) => {
    originalUpdate(dt);

    const view = cameraSystem.camera.getViewRect();
    debugSystem.setViewport(view.x, view.y, view.width, view.height);

    debugTick += dt;
    if (debugTick > 0.5 && (debugSystem as any).showPathfinding) {
      debugTick = 0;
      const allPaths: { col: number; row: number }[] = [];
      for (const f of followers) {
        allPaths.push(...f.currentPath);
      }
      debugSystem.setDebugPath(allPaths);
    }
  };

  // ── Start ──────────────────────────────────────────────────────
  engine.setup();
}

main();
