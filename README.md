# GameFoo

A lightweight, behavior-based 2D game engine written in TypeScript. Works in both browser (Canvas 2D) and terminal (ANSI/TTY) environments.

## Features

- **Dual Renderer Support** - Canvas 2D for browsers, ANSI truecolor for terminals
- **Behavior-Based Architecture** - Compose complex game logic from reusable behaviors
- **Entity Hierarchy** - Base entities, dynamic entities with physics, players, and text
- **Collision Detection** - Spatial collision with AABB and circle shapes, layer filtering
- **Tilemap System** - Multi-layer tilemaps with tileset support
- **A\* Pathfinding** - Configurable heuristics, 4-dir and 8-dir movement
- **Procedural Generation** - Perlin noise, biome-based map generation
- **State Machine** - Type-safe FSM with lifecycle hooks
- **Sprite System** - Grid/atlas-based sprites, animations, bitmap fonts and icons

## Installation

```bash
# Using Bun (recommended)
bun add @dryanovski/gamefoo

# Using npm
npm install @dryanovski/gamefoo
```

## Quick Start

### Browser

```typescript
import {
  Engine,
  WebRenderer,
  Player,
  Control,
  Input,
  ObjectSystem,
} from "@dryanovski/gamefoo";

const renderer = new WebRenderer("game-canvas", 800, 600);
const engine = new Engine(renderer, { backgroundColor: "#1a1a2e" });

class Hero extends Player {
  render(ctx) {
    ctx.fillRect(this.x, this.y, 50, 50, "#5566ff");
  }
}

const player = new Hero("hero", 400, 300, 50, 50);
player.attachBehaviour(new Control(player, new Input()));

engine.use(new ObjectSystem([player]));
engine.setup(() => console.log("Game started!"));
```

### Terminal

```typescript
import {
  Engine,
  TerminalRenderContext,
  IntervalLoopDriver,
  ObjectSystem,
} from "@dryanovski/gamefoo";

const renderer = new TerminalRenderContext({ cols: 80, rows: 24 });
const engine = new Engine(renderer, {
  loopDriver: new IntervalLoopDriver(30),
});

engine.render = (ctx) => {
  ctx.drawText("Hello, Terminal!", 10, 5, "#ffffff");
};

engine.use(new ObjectSystem([]));
engine.setup();
```

## Development

```bash
# Install dependencies
bun install

# Run web demos (dev server with HMR)
bun run dev

# Run terminal demo
bun terminal_demos/basic/index.ts

# Build the library
bun run build

# Run tests
bun test

# Type checking
bun run typecheck

# Lint and format
bun run lint
bun run format
```

## Project Structure

```
gamefoo/
├── src/                     # Library source
│   ├── core/                # Engine, camera, collision, sprites
│   │   ├── behaviours/      # Built-in behaviors
│   │   ├── grid/            # 2D grid and isometric projection
│   │   ├── tilemap/         # Tilemap system
│   │   ├── renderer/        # Web and terminal renderers
│   │   ├── fonts/           # Bitmap fonts
│   │   ├── icons/           # Bitmap icons
│   │   └── utils/           # Pathfinding, map generation, noise
│   ├── entities/            # Entity classes
│   ├── subsystems/          # Engine subsystems
│   └── debug/               # Debug tools
├── web_demos/               # Browser demos
├── terminal_demos/          # Terminal demos
├── tools/                   # Tilemap/sprite editor
├── docs/                    # Documentation site
└── tests/                   # Test files
```

## Web Demos

Run `bun run dev` and visit:

- `/demo` - Basic collision and entity demo
- `/dungen` - Dungeon crawler with fog of war and procedural generation
- `/isometric` - Isometric world with NPCs and pathfinding
- `/endless-world` - Infinite procedural world generation
- `/floppy` - Flappy bird clone
- `/fonts` - Bitmap font showcase
- `/icons` - Bitmap icon showcase
- `/clock` - Analog clock demo

## Core Concepts

### Behaviors

Entities gain functionality through attached behaviors:

```typescript
const player = new Player("hero", 100, 100, 32, 32);
player.attachBehaviour(new Control(player, new Input()));
player.attachBehaviour(new Collidable(player, world, "player"));
player.attachBehaviour(new HealthKit(player, 100));
```

Built-in behaviors: `Control`, `Collidable`, `HealthKit`, `SpriteRender`, `TerminalRender`, `PathFollower`

### Subsystems

Modular engine features that can be composed:

```typescript
engine.use(new ObjectSystem([player, enemy]));
engine.use(new CollisionSystem(world));
engine.use(new CameraSystem(camera, player));
engine.use(new MonitorSystem());
```

### Collision World

```typescript
const world = new World();

world.register(player, { layer: "player", solid: true });
world.register(wall, { layer: "wall", solid: true, fixed: true });
world.register(pickup, { layer: "item", tag: "coin" });

// Query collisions
const hits = world.query(player, { layer: "item", tag: "coin" });
```

### Tilemaps

```typescript
const tileset = new TileSet(spriteSheet, 16, 16);
const layer = new TileLayer(mapWidth, mapHeight, tileData);
const tilemap = new TileMap(tileset, [layer]);

engine.use(new TilemapSystem(tilemap));
```

### Pathfinding

```typescript
const pathfinder = new AStarPathfinder(grid, {
  heuristic: "manhattan",
  allowDiagonal: false,
});

const path = pathfinder.findPath(startX, startY, endX, endY);
```

## License

MIT
