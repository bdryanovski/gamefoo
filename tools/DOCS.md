# GameFoo Dev Tools — Tilemap Sprite Editor

A retro-styled visual editor for cutting spritesheets into named sprite
regions, building animations, and exporting JSON configs that the GameFoo
engine can consume directly.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Interface Overview](#interface-overview)
3. [Tools](#tools)
4. [Sprites](#sprites)
5. [Animations](#animations)
6. [Game Objects](#game-objects)
7. [Grid Settings](#grid-settings)
8. [Persistence & Auto-Save](#persistence--auto-save)
9. [Project Management](#project-management)
10. [Save & Export Screen](#save--export-screen)
11. [Export Formats](#export-formats)
12. [Consuming Exports in the Engine](#consuming-exports-in-the-engine)
13. [Keyboard Shortcuts](#keyboard-shortcuts)
14. [Server API Reference](#server-api-reference)
15. [Architecture Notes](#architecture-notes)

---

## Quick Start

```bash
cd tools
bun install
bun run dev
# → http://localhost:3001
```

1. Open or drag-drop a tilemap/spritesheet image.
2. Configure the grid dimensions to match your tile size.
3. Use **Grid Pick** (G) to click tiles, or **Region** (R) to draw
   free-form rectangles.
4. Name your sprites in the right panel.
5. Select multiple sprites, then create an animation from them.
6. Export to JSON.

---

## Interface Overview

```
┌──────────────────────────────────────────────────────────────┐
│ Title Bar ─ project name, Open Image, Load Project           │
├────┬─────────────────────────────────────┬───────────────────┤
│TOOL│            CANVAS                   │   RIGHT PANEL     │
│BAR │                                     │                   │
│    │  Tilemap image with grid overlay    │  [Tabs]           │
│    │  and sprite region outlines         │  Sprites | Anims  │
│    │                                     │  Objects | Export  │
│    │  Zoom: scroll wheel                 │                   │
│    │  Pan: middle-click or H tool        │  Properties,      │
│    │                                     │  lists, preview   │
├────┴─────────────────────────────────────┴───────────────────┤
│ Status Bar ─ image info, tool, cursor position, zoom, counts │
└──────────────────────────────────────────────────────────────┘
```

---

## Tools

| Tool            | Key | Description                                      |
|-----------------|-----|--------------------------------------------------|
| **Select** (⇱)  | V   | Click sprites to select. Shift+click for multi.  |
| **Grid Pick** (▦)| G   | Click grid cells to create/select sprites.       |
| **Region** (▭)  | R   | Click-drag to draw free-form sprite rectangles.  |
| **Pan** (✥)     | H   | Click-drag to pan the canvas. Also: middle-click.|

Additional toolbar buttons:

- **#** — Toggle grid visibility on/off.
- **+** / **−** — Zoom in / out.
- **⊙** — Reset zoom and pan to default.

---

## Sprites

Sprites are rectangular regions cut from the tilemap image. Each sprite has:

| Property   | Type     | Description                                         |
|------------|----------|-----------------------------------------------------|
| `name`     | string   | Unique name (used as key in exported JSON).          |
| `x`, `y`   | number   | Top-left position in the source image (pixels).      |
| `width`    | number   | Width in pixels.                                     |
| `height`   | number   | Height in pixels.                                    |
| `anchor`   | {x, y}   | Anchor/pivot point relative to top-left of frame.    |
| `group`    | string   | Logical group name (e.g. "hero", "enemies").         |
| `order`    | number   | Ordering index within its group (for sorting).       |
| `level`    | number   | Z-level / layer depth.                               |
| `tags`     | string[] | Arbitrary tags for filtering/categorization.         |

### Creating Sprites

**Grid Pick mode (G):**
Click on grid cells. Each click creates a sprite sized to the grid cell.
The sprite is auto-named `sprite_{col}_{row}`.

**Region mode (R):**
Click and drag to draw a rectangle. When grid is enabled, coordinates
snap to grid boundaries. The rectangle becomes a new sprite region.

### Editing Sprites

Select a sprite (click it on canvas, or click in the sprite list).
The Properties section appears with editable fields for all properties.

### Multi-select

Hold **Shift** while clicking to select multiple sprites. This is useful
for batch operations and for creating animations from multiple frames.

---

## Animations

Animations are ordered sequences of sprite frames with timing info.

| Property   | Type      | Description                                         |
|------------|-----------|-----------------------------------------------------|
| `name`     | string    | Animation name (e.g. "idle", "walk_right").          |
| `frames`   | string[]  | Ordered list of sprite IDs forming the animation.    |
| `duration`  | number    | Seconds each frame is displayed before advancing.    |
| `loop`     | boolean   | Whether the animation loops after the last frame.    |

### Creating Animations

1. Go to the **Anims** tab.
2. (Optional) Select sprites on the canvas first — they become the
   initial frames.
3. Click **+ New**.

### Editing Animations

- **Reorder frames:** Use ◀ ▶ buttons under each frame thumbnail.
- **Remove frames:** Click ✕ under a frame.
- **Add frames:** Select sprites on canvas, then click **+ Add Selected**.
- **Preview:** The live preview plays the animation at the configured
  speed directly in the panel.

---

## Game Objects

Game Objects group related sprites and animations into logical entities.
For example, a "hero" object might contain idle, walk, and attack sprites
along with their corresponding animations.

| Property     | Type                    | Description                      |
|--------------|-------------------------|----------------------------------|
| `name`       | string                  | Object name (e.g. "hero").       |
| `sprites`    | string[]                | Associated sprite IDs.           |
| `animations` | string[]                | Associated animation IDs.        |
| `properties` | Record<string, string>  | Custom key-value properties.     |

Custom properties are freeform and can store things like `speed`,
`health`, `collider_type`, etc.

---

## Grid Settings

Configure how the grid overlay divides the tilemap:

| Setting      | Description                                          |
|--------------|------------------------------------------------------|
| **Cell W/H** | Width and height of each grid cell in pixels.        |
| **Offset X/Y**| Margin before the first column/row.                |
| **Spacing X/Y**| Gap between cells (for spritesheets with padding). |

These settings directly map to the engine's `GridConfig` interface,
so the Grid export format can be consumed by `Sprite.fromGrid()` without
transformation.

---

## Persistence & Auto-Save

The editor automatically preserves your work across page refreshes.

### How it works

1. **Every change** you make (adding sprites, renaming, changing grid
   settings, creating animations — everything) is debounced-saved to
   **localStorage** (300ms delay).
2. **Uploaded images** are sent to the server and stored in
   `tools/public/uploads/`. The state references server paths (not
   base64 data URLs), so localStorage stays small and fast.
3. **On page refresh**, the editor restores the full state from
   localStorage and reloads the image from the server URL.
4. You **never lose progress** — no need to manually save during work.

### What gets persisted

| Data               | Where                         | When                      |
|--------------------|-------------------------------|---------------------------|
| Full editor state  | localStorage                  | Every change (debounced)  |
| Uploaded images    | `public/uploads/`             | On file upload            |
| Saved projects     | `public/projects/{id}.json`   | On manual "Save"          |
| Export files       | `public/exports/{id}/`        | On "Save to Server"       |

---

## Project Management

Click **Projects** in the title bar to open the project manager.

### Features

- **List** all saved projects with name, sprite/animation counts,
  image name, and last-modified timestamp.
- **Open** a project to load its full state (image, sprites,
  animations, objects, grid settings — everything).
- **New Project** clears the editor to a fresh state.
- **Import JSON** loads a previously exported `.project.json` file.
  If the project contains a data-URL image, it's automatically
  re-uploaded to the server.
- **Delete** removes a project and its export files from the server.
- The **current** project is highlighted in the list.

### Workflow

1. Work on your tilemap, define sprites, build animations.
2. Click **Save** → project is persisted to the server.
3. Start a new project → click **Projects → + New Project**.
4. Switch between projects via **Projects → Open**.
5. Share a project by exporting its `.project.json` and importing
   it on another machine (image re-upload handled automatically).

---

## Save & Export Screen

Click **Save** in the title bar to save the current project and
open the export screen.

### What the screen shows

1. **Save confirmation** — project is saved to the server.
2. **Image location** — where the uploaded image is stored.
3. **Generated files** — all export format files with:
   - Filename and description
   - Copy, Download, and Show/Hide buttons
   - Server path (after saving to server)
4. **Save Export Files to Server** — writes all JSON files to
   `public/exports/{projectId}/` on the server.
5. **Usage instructions** — ready-to-use code snippets showing
   how to consume each export format in the game engine.

### File output

When you click "Save Export Files to Server", the following files
are written:

```
tools/public/exports/{projectId}/
├── {name}.atlas.json      # Sprite.fromAtlas() format
├── {name}.grid.json       # Sprite.fromGrid() format (if grid enabled)
├── {name}.full.json       # Full export with objects + metadata
└── {name}.project.json    # Re-importable editor state
```

---

## Export Formats

### 1. Atlas Format (`*.atlas.json`)

For use with `Sprite.fromAtlas()`. Best for non-uniform spritesheets
or when you want named frame access.

```json
{
  "meta": {
    "version": "1.0",
    "tool": "gamefoo-tilemap-editor",
    "projectName": "My Game",
    "image": "hero.png",
    "imageWidth": 256,
    "imageHeight": 128,
    "exportedAt": "2025-01-15T12:00:00.000Z"
  },
  "frames": {
    "hero_idle_0": { "x": 0, "y": 0, "width": 32, "height": 32 },
    "hero_idle_1": { "x": 32, "y": 0, "width": 32, "height": 32 },
    "hero_walk_0": { "x": 64, "y": 0, "width": 32, "height": 32, "anchor": { "x": 16, "y": 32 } }
  },
  "animations": {
    "idle": { "frames": ["hero_idle_0", "hero_idle_1"], "duration": 0.25, "loop": true },
    "walk": { "frames": ["hero_walk_0", "hero_walk_1", "hero_walk_2"], "duration": 0.15, "loop": true }
  }
}
```

### 2. Grid Format (`*.grid.json`)

For use with `Sprite.fromGrid()`. Best for uniform spritesheets where
all frames share the same dimensions.

```json
{
  "meta": { "..." : "same as atlas" },
  "grid": {
    "frameWidth": 32,
    "frameHeight": 32,
    "offsetX": 0,
    "offsetY": 0,
    "spacingX": 0,
    "spacingY": 0
  },
  "namedFrames": {
    "grass": 0,
    "water": 1,
    "sand": 5,
    "hero_idle": 24
  },
  "animations": {
    "water_flow": { "frames": [1, 2, 3], "duration": 0.3, "loop": true }
  }
}
```

### 3. Full Format (`*.full.json`)

Comprehensive export with everything — frames, animations, game objects,
sprite metadata, and optional grid config.

```json
{
  "meta": { "..." : "same as atlas" },
  "grid": { "..." : "optional, present if grid was enabled" },
  "frames": { "..." : "same as atlas format" },
  "animations": { "..." : "same as atlas format" },
  "objects": {
    "hero": {
      "sprites": ["hero_idle_0", "hero_walk_0"],
      "animations": ["idle", "walk"],
      "properties": { "speed": "120", "health": "100" }
    }
  },
  "spriteMetadata": {
    "hero_idle_0": {
      "tags": ["hero", "idle"],
      "group": "hero",
      "order": 0,
      "level": 1,
      "properties": {}
    }
  }
}
```

### 4. Project File (`*.project.json`)

Internal format for saving/loading editor state. Contains the full
`AppState` including the base64-encoded image. **Not intended for
engine consumption.**

---

## Consuming Exports in the Engine

### Atlas format → `Sprite.fromAtlas()`

```typescript
import { Asset, Sprite, SpriteRender } from "@dryanovski/gamefoo";

// Load the exported atlas JSON
const response = await fetch("assets/hero.atlas.json");
const atlas = await response.json();

// Load the spritesheet image
const image = await Asset.load(`assets/${atlas.meta.image}`);

// Create sprite directly from export data
const sprite = Sprite.fromAtlas(image, atlas.frames, atlas.animations);

// Use it on an entity
const render = new SpriteRender(entity, sprite);
entity.attachBehaviour(render);
render.play("idle");
```

### Grid format → `Sprite.fromGrid()`

```typescript
import { Asset, Sprite } from "@dryanovski/gamefoo";

const response = await fetch("assets/tileset.grid.json");
const data = await response.json();

const image = await Asset.load(`assets/${data.meta.image}`);
const sprite = Sprite.fromGrid(image, data.grid, data.animations);

// Access named frames
const grassFrameIndex = data.namedFrames["grass"];
const rect = sprite.getFrameRect(grassFrameIndex);
```

### Grid format → TileSet / TileMap

```typescript
import { Asset, Sprite, TileSet, TileLayer, TileMap, Grid } from "@dryanovski/gamefoo";

const response = await fetch("assets/tileset.grid.json");
const data = await response.json();

const image = await Asset.load(`assets/${data.meta.image}`);
const sprite = Sprite.fromGrid(image, data.grid);

const tileSet = new TileSet({ sprite });

// Build layers from your level data
const ground = new TileLayer({
  name: "ground",
  cols: 20,
  rows: 15,
  tileSet,
  data: levelData, // your tile indices array
});

const grid = new Grid(20, 15, data.grid.frameWidth, data.grid.frameHeight);
const tilemap = new TileMap({ grid, layers: [ground] });
```

### Full format → Mixed usage

```typescript
const response = await fetch("assets/game.full.json");
const data = await response.json();
const image = await Asset.load(`assets/${data.meta.image}`);

// Create atlas sprite for character animations
const heroSprite = Sprite.fromAtlas(image, data.frames, data.animations);

// Access object definitions for game logic
const heroConfig = data.objects["hero"];
console.log(heroConfig.properties.speed);  // "120"
console.log(heroConfig.animations);        // ["idle", "walk"]

// Access sprite metadata for additional info
const meta = data.spriteMetadata["hero_idle_0"];
console.log(meta.tags);   // ["hero", "idle"]
console.log(meta.level);  // 1
```

---

## Keyboard Shortcuts

| Key    | Action                          |
|--------|---------------------------------|
| V      | Select tool                     |
| G      | Grid Pick tool                  |
| R      | Region (draw) tool              |
| H      | Pan (hand) tool                 |
| Scroll | Zoom in/out (at cursor)         |
| Shift  | Multi-select (with click)       |
| Middle | Pan (any tool)                  |

---

## Server API Reference

The tools server exposes these API endpoints:

| Method   | Endpoint                          | Description                        |
|----------|-----------------------------------|------------------------------------|
| `POST`   | `/api/upload`                     | Upload image (multipart form)      |
| `GET`    | `/api/projects`                   | List all saved projects            |
| `GET`    | `/api/projects/:id`              | Load a specific project            |
| `POST`   | `/api/projects/:id`              | Save/update a project              |
| `DELETE` | `/api/projects/:id`              | Delete project and its exports     |
| `POST`   | `/api/projects/:id/export`       | Generate export files on server    |

### Upload response

```json
{ "path": "/uploads/1234_hero.png", "name": "hero.png" }
```

### Project list response

```json
[{
  "id": "proj_abc123",
  "name": "My Game",
  "lastModified": "2025-01-15T12:00:00.000Z",
  "spriteCount": 32,
  "animCount": 5,
  "imageName": "tileset.png"
}]
```

### Server directory structure

```
tools/public/
├── uploads/                    # Uploaded tilemap images
│   └── 1234_tileset.png
├── projects/                   # Saved project state (JSON)
│   └── proj_abc123.json
└── exports/                    # Generated export files
    └── proj_abc123/
        ├── my_game.atlas.json
        ├── my_game.grid.json
        ├── my_game.full.json
        └── my_game.project.json
```

---

## Architecture Notes

### Directory structure

```
tools/
├── package.json          # Separate deps (React, types)
├── tsconfig.json         # TypeScript config
├── server.ts             # Bun.serve() + API routes (upload, CRUD, export)
├── index.html            # HTML shell
├── DOCS.md               # This file
├── public/
│   ├── uploads/          # Server-stored uploaded images
│   ├── projects/         # Server-stored project JSONs
│   └── exports/          # Server-generated export files
└── src/
    ├── index.tsx          # React mount point
    ├── App.tsx            # Root component + reducer + auto-save
    ├── types.ts           # All type definitions
    ├── retro.css          # 90s-style UI theme
    ├── components/
    │   ├── Toolbar.tsx         # Left tool sidebar
    │   ├── TilemapCanvas.tsx   # Main canvas (render + interaction)
    │   ├── SpritePanel.tsx     # Sprite list + grid settings + properties
    │   ├── AnimationPanel.tsx  # Animation builder + live preview
    │   ├── ObjectPanel.tsx     # Game object grouping
    │   ├── ExportPanel.tsx     # Export format selection + JSON preview
    │   ├── StatusBar.tsx       # Bottom status bar
    │   ├── ProjectManager.tsx  # Project list/create/open/delete modal
    │   └── SaveScreen.tsx      # Save confirmation + export files screen
    └── utils/
        ├── export.ts      # JSON export generators
        ├── storage.ts     # localStorage + server API client
        └── uid.ts         # Unique ID generator
```

### Separation from main project

The `tools/` directory has its own `package.json` with React as a
dependency. This keeps dev tool dependencies **out of** the main
`@dryanovski/gamefoo` package that gets published to npm.

When the game engine is more mature, it can be imported into tools
as a dependency, allowing the editor to use engine classes (Sprite,
TileSet, etc.) directly for more accurate previews.

### State management

All app state lives in a single `useReducer` in `App.tsx`. Actions
are typed via the `AppAction` discriminated union. Components receive
state and dispatch as props — no external state library needed.

### Persistence layers

1. **localStorage** — auto-saved on every change (debounced 300ms).
   Restores on refresh. Keeps the current working state.
2. **Server files** — saved on manual "Save". Images go to
   `public/uploads/`, projects to `public/projects/`, exports to
   `public/exports/`. All files persist across server restarts.
3. **Image loading** — a `useEffect` watches `state.imageData.url`
   and loads the `HTMLImageElement` into React state. Works for both
   initial load, project switch, and localStorage restore.

### Canvas rendering

`TilemapCanvas` uses a native HTML5 Canvas with manual rendering via
`requestAnimationFrame`. All transforms (zoom, pan) are applied via
canvas context transforms. Mouse coordinates are converted between
screen space and image space for accurate interaction.
