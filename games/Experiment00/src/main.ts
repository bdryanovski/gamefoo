// The Experiment00 composition root: build the renderer, the engine, the
// service bag (GameContext) and the systems; boot() loads the world into
// them behind the splash. Every mechanic lives in a system or an object.
import {
  AudioSystem,
  DitherFog,
  Engine,
  InputSystem,
  InteractionSystem,
  MemoryBackend,
  MonitorSystem,
  StateStore,
  WebRenderer,
} from '../../../src/index';
import { boot } from './boot';
import type { GameContext } from './context';
import { PLAYER_LEVEL, SCALE, SCREEN_H, SCREEN_W } from './constants';
import { DEFAULT_ITEMS, Inventory, InventoryView, ItemCatalog, Journal } from './inventory';
import { Telemetry } from './telemetry';
import { GameFlow } from './systems/flow';
import { WorldSystem } from './systems/world';
import { PickupSystem } from './systems/pickup';
import { AudioDirectorSystem } from './systems/audio_director';
import { TransitionSystem } from './systems/transition';
import { HudSystem } from './systems/hud';
import { DialogSystem } from './systems/dialog';
import { LockKeypadSystem } from './systems/lock_keypad';
import { InventorySystem } from './systems/inventory';
import { SplashSystem } from './systems/splash';
import { GAME_CONTROLS } from './config/controls';
import { GAME_KEYS } from './config/keymap';

// The Experiment00 project: a 320×256 world, up-scaled ×3 for display.
const renderer = new WebRenderer('game', SCREEN_W * SCALE, SCREEN_H * SCALE);
const engine = new Engine(renderer, { backgroundColor: '#12121c' });

// Services — everything the systems and objects share (systems fill the rest).
const input = new InputSystem({ scheme: GAME_CONTROLS });
const save = new StateStore({ backend: new MemoryBackend('experiment00:save'), autoSave: true });
const audio = new AudioSystem(); // loaded by boot; a subsystem from frame one
const inventory = new Inventory(save.scope('inventory'));
const journal = new Journal(save.scope('journal'));
const items = new ItemCatalog(DEFAULT_ITEMS, save.scope('items'));
// The Esc book overlay: opened/closed by InventorySystem, drawn above the rest.
const inventoryView = new InventoryView({ inventory, journal, items });
const ctx: GameContext = {
  input,
  save,
  inventory,
  journal,
  items,
  inventoryView,
  telemetry: new Telemetry(),
  audio,
};

// Systems — the whole game (order values per 00-architecture.md §3).
const flow = new GameFlow();
const world = new WorldSystem(ctx, {
  screenW: SCREEN_W,
  screenH: SCREEN_H,
  scale: SCALE,
  playerLevel: PLAYER_LEVEL,
});
const pickup = new PickupSystem(ctx);
const interact = new InteractionSystem({
  actor: () => ctx.player ?? null,
  objects: () => ctx.world?.objects() ?? [],
  input: ctx.input,
  action: 'PRIMARY',
  services: ctx,
  isActive: () => ctx.flow?.worldActive ?? false,
});
const audioDirector = new AudioDirectorSystem(ctx);
const transition = new TransitionSystem(ctx);
const hud = new HudSystem(
  ctx,
  () => `screen ${world.screenKey()}   WASD/Arrows move · E/Space/A use · Esc/Start inventory`,
);
const dialog = new DialogSystem(ctx);
const lock = new LockKeypadSystem(ctx);
const inventorySystem = new InventorySystem(ctx);
const splash = new SplashSystem(ctx);

ctx.flow = flow;
ctx.world = world;
ctx.hud = hud;
ctx.dialog = dialog;
ctx.lock = lock;
ctx.transition = transition;
ctx.splash = splash;

engine
  .use(input) // order 0 — raw input + action edges
  .use(flow) // 5 — modal stack / freeze arbiter
  .use(world) // 20 — map + player + fog + critter perception
  .use(pickup) // 35 — walk-over pickups
  .use(interact) // 40 — the interact action
  .use(audio) // 60 — engine audio subsystem
  .use(audioDirector) // 65 — ambients / footsteps / campfire loops
  .use(transition) // 70 — iris screen-cuts
  .use(hud) // 80 — toasts + screen label
  .use(dialog) // 85 — dialog modal
  .use(lock) // 87 — lock keypad modal
  .use(inventorySystem) // 88 — inventory/journal overlay
  .use(splash) // 89 — title card; init() pushes 'splash': frozen from frame 1
  .use(
    new MonitorSystem({
      graph: false,
      showFps: true,
      showMemory: true,
      memoryGraph: false,
      x: SCREEN_W * SCALE - 100,
      y: 80,
    }),
  ); // 90 — fps/memory overlay

// The only raw keyboard listener: the WebAudio gesture unlock + the scroll
// shield (InputSystem never calls preventDefault). Every game action is polled.
window.addEventListener('keydown', (e) => {
  void ctx.audio?.unlock();
  if (GAME_KEYS.has(e.key.toLowerCase())) e.preventDefault();
});

void engine.setup(async () => {
  // Dither fog of war, authored in WORLD space (320×256 — the coordinates
  // objects and the player already live in) so lights track their owners
  // with no scale juggling. Set on the context **before** boot: objects reach
  // it through the shared services bag when their `onSpawn` runs.
  ctx.fog = new DitherFog(renderer, {
    width: engine.dementions.width,
    height: engine.dementions.height,
    cellSize: 0.5,
    color: '#382910',
    ambientCoverage: 5,
    blendSharpness: 16,
    defaultPattern: 'bayer2',
  });
  // Boot in the background (the frame loop starts as soon as this callback
  // returns) so the title card shows its `Loading...` prompt while the world
  // streams in — the pre-refactor `void game.load()` timing.
  void boot(ctx, engine);
});
