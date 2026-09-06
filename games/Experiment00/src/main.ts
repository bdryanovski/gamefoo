import {
  DialogBox,
  type DialogDocument,
  DialogRunner,
  Engine,
  Input,
  MapManager,
  type MapObjectContext,
  MapObjectRegistry,
  type RenderContext,
  ScreenRegistry,
  ShaderSystem,
  VignetteShader,
  WebRenderer,
} from '../../../src/index';
import { drawMessages, updateMessages } from './hud';
import { Campfire, loadCampfireConfig } from './objects/campfire';
import { Bookshelf } from './objects/bookshelf';
import { Player } from './objects/player';
import { Portal } from './objects/portal';
import { Rat } from './objects/rat';
import { Slime } from './objects/slime';
import { Sign } from './objects/sign';
import { DarkChamberScreen } from './screens/dark-chamber';
import { RoomScreen } from './screens/room';

// The Experiment00 project uses 20×16 screens of 16px tiles → a
// 320×256 screen, up-scaled ×2 for display (640×512).
const SCREEN_W = 320;
const SCREEN_H = 256;
const SCALE = 2;
const PLAYER_SIZE = 16;
// Screen tile size (px). Portal `spawn` cells are authored in grid col/row
// and converted to pixels with this.
const BLOCK_SIZE = 16;
// The player draws on this z-level; layers above it (e.g. the `pillars`
// layer at level 3) occlude it, so keep it below them.
const PLAYER_LEVEL = 2;

const renderer = new WebRenderer('game', SCREEN_W * SCALE, SCREEN_H * SCALE);

/**
 * Drives the Experiment00 map with a playable character: WASD/arrows walk the
 * player around, open portals carry the player between screens, and `E`
 * interacts with a nearby campfire.
 *
 * Objects and screens are wired declaratively: a {@link MapObjectRegistry}
 * maps object names to classes (so the map auto-instantiates a `Campfire`
 * wherever it sees one), and a {@link ScreenRegistry} maps coordinates to
 * screen classes (a default {@link RoomScreen} for every room, with a bespoke
 * {@link DarkChamberScreen} at `(0, 3)`). The player is the one game-owned
 * object — it persists across screens, so the game spawns and repositions it.
 */
class MapGame extends Engine {
  private map?: MapManager;
  private cx = 0;
  private cy = 0;
  private readonly input = new Input();
  private player?: Player;
  private lastSafe = { x: 0, y: 0 };
  private dialog?: DialogRunner;
  private readonly dialogBox = new DialogBox();

  async load() {
    // Objects: the map instantiates a class wherever it places a matching
    // object. `Campfire` is keyed by its static `type` ("campfire").
    const registry = new MapObjectRegistry();
    registry.register(Campfire);
    registry.register(Portal);
    registry.register(Sign);
    registry.register(Bookshelf);
    registry.register(Rat);
    registry.register(Slime);
    await loadCampfireConfig('/project/exports/proj_mtj0babj_m/campfire.object.json');

    // Screens: a default class for every room, overridden per coordinate.
    const screens = new ScreenRegistry();
    screens.setDefault(RoomScreen);
    screens.register(0, 3, DarkChamberScreen);

    // Read the editor's live working project straight from disk (served at
    // /project/…), unmodified. Image urls are "/uploads/<file>".
    const url = '/project/projects/proj_mtj0babj_m.json';
    const project = await fetch(url).then((r) => r.json());
    const map = new MapManager();
    await map.load(project, {
      resolve: (img) => `/project${img.url}`,
      registry,
      screens,
    });
    this.map = map;

    // Dialogs come from the editor's standalone export (kept current on every
    // save) — the runtime consumes that file directly.
    const dialogs: DialogDocument = await fetch(
      '/project/exports/proj_mtj0babj_m/experiment00.dialogs.json',
    )
      .then((r) => (r.ok ? r.json() : { trees: {} }))
      .catch(() => ({ trees: {} }));
    this.dialog = new DialogRunner(dialogs);

    const shaders = new ShaderSystem();
    shaders.add(new VignetteShader({ intensity: 0.4, inner: 0.55 }));
    this.use(shaders);

    // Start on the dark chamber (its screen class extinguishes the fires),
    // then spawn the player centred.
    this.navigate(0, 3);
    this.spawnPlayer();
    window.addEventListener('keydown', (e) => this.onKey(e));
  }

  /** Builds the persistent player from the loaded "player" prefab. */
  private spawnPlayer(): void {
    const assets = this.map?.assets;
    const def = assets?.objectByName('player');
    if (!assets || !def) return;
    const start = def.machine.states.find((s) => s.name === 'Idle')?.id;
    const context: MapObjectContext = {
      assets,
      machine: def.machine,
      def,
      properties: def.properties,
      x: (SCREEN_W - PLAYER_SIZE) / 2,
      y: (SCREEN_H - PLAYER_SIZE) / 2,
      level: PLAYER_LEVEL,
      startStateId: start ?? def.machine.initialStateId ?? undefined,
    };
    this.player = new Player(context, this.input);
    this.player.onSpawn();
    this.lastSafe = { x: this.player.x, y: this.player.y };
    this.map?.current?.collision.addOccupant(this.player);
  }

  /** Live campfires on the active screen. */
  private campfires(): Campfire[] {
    return this.map?.current?.objectsByType(Campfire) ?? [];
  }

  /** Navigates to a screen; returns whether it existed. */
  private navigate(x: number, y: number): boolean {
    if (!this.map?.navigateTo(x, y)) return false;
    this.cx = x;
    this.cy = y;
    if (this.player) this.map.current?.collision.addOccupant(this.player);
    return true;
  }

  /** Opens a nearby portal (and travels), else toggles a nearby campfire. */
  private interact(): void {
    const player = this.player;
    if (!player) return;

    // Portals: open the nearest one within reach and travel to its target.
    const portal = this.map?.current
      ?.objectsByType(Portal)
      .find((p) => p.overlaps(player.interactionBox()));
    if (portal) {
      portal.open();
      const target = portal.target;
      if (target && this.navigate(target.x, target.y)) {
        // Author-set spawn cell (grid col/row) → pixels, clamped so the player
        // stays on-screen; falls back to centre when the portal sets none.
        const spawn = portal.spawn;
        const px = spawn
          ? Math.max(0, Math.min(SCREEN_W - PLAYER_SIZE, spawn.col * BLOCK_SIZE))
          : (SCREEN_W - PLAYER_SIZE) / 2;
        const py = spawn
          ? Math.max(0, Math.min(SCREEN_H - PLAYER_SIZE, spawn.row * BLOCK_SIZE))
          : (SCREEN_H - PLAYER_SIZE) / 2;
        player.place(px, py);
        this.lastSafe = { x: player.x, y: player.y };
      }
      return;
    }

    // Signs: open the dialog modal for a nearby sign that names a tree.
    const sign = this.map?.current
      ?.objectsByType(Sign)
      .find((s) => s.overlaps(player.interactionBox()));
    if (sign) {
      const ref = sign.dialogRef;
      if (ref && this.dialog?.start(ref)) return;
    }

    // Bookshelves: open the dialog modal for a nearby shelf that has one.
    const shelf = this.map?.current
      ?.objectsByType(Bookshelf)
      .find((b) => b.overlaps(player.interactionBox()));
    if (shelf) {
      const ref = shelf.dialogRef;
      if (ref && this.dialog?.start(ref)) return;
    }

    // Campfires: toggle the nearest within reach.
    const p = player.box();
    const pcx = p.x + p.width / 2;
    const pcy = p.y + p.height / 2;
    const reach = 24;
    for (const fire of this.campfires()) {
      const b = fire.collisionBox;
      const dx = pcx - (b.x + b.w / 2);
      const dy = pcy - (b.y + b.h / 2);
      if (dx * dx + dy * dy <= reach * reach) {
        fire.toggle();
        break;
      }
    }
  }

  private onKey(e: KeyboardEvent): void {
    const dialog = this.dialog;
    if (dialog?.active) {
      // Modal is up: arrows move the option cursor, E/Enter confirms.
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') dialog.moveSelection(-1);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') dialog.moveSelection(1);
      else if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter')
        dialog.confirm();
      else return;
      e.preventDefault();
      return;
    }
    if (e.key === 'e' || e.key === 'E' || e.key === ' ') this.interact();
  }

  override update(dt: number) {
    // Advance the dialog typewriter + slide animation every frame; while the
    // modal is open it freezes the world (no map/player updates).
    this.dialog?.update(dt);
    this.dialogBox.update(dt, this.dialog?.active ?? false);
    if (this.dialog?.active) return;

    // Feed each rat the player's box + collision so its AI can sense/flee,
    // before the screen advances the live objects (which runs their update).
    if (this.player && this.map?.current) {
      const pbox = this.player.box();
      for (const rat of this.map.current.objectsByType(Rat)) {
        rat.sense(pbox, this.map.current.collision);
      }
      for (const slime of this.map.current.objectsByType(Slime)) {
        slime.sense(pbox, this.map.current.collision);
      }
    }
    this.map?.update(dt);
    updateMessages(dt);
    const player = this.player;
    const screen = this.map?.current;
    if (!player || !screen) return;
    player.update(dt, screen.collision);

    // Screens no longer hand off at their edges — portals are the only exit,
    // so keep the player inside the current screen's bounds.
    const maxX = SCREEN_W - PLAYER_SIZE;
    const maxY = SCREEN_H - PLAYER_SIZE;
    player.place(Math.max(0, Math.min(maxX, player.x)), Math.max(0, Math.min(maxY, player.y)));

    const foot = player.footPoint();
    if (screen.collision.isWalkable(foot.x, foot.y)) {
      this.lastSafe = { x: player.x, y: player.y };
    } else {
      player.place(this.lastSafe.x, this.lastSafe.y);
    }
  }

  override render(ctx: RenderContext) {
    const raw = ctx.getCanvas?.();
    if (raw) raw.imageSmoothingEnabled = false;

    ctx.save();
    ctx.scale(SCALE, SCALE);
    const player = this.player;
    this.map?.render(
      ctx,
      player ? { level: PLAYER_LEVEL, render: (c) => player.render(c) } : undefined,
    );
    ctx.restore();

    const fires = this.campfires();
    const lit = fires.filter((f) => f.lit).length;
    ctx.drawText(
      `screen ${this.cx},${this.cy}   WASD move · E use / open portal   campfires ${lit}/${fires.length} lit`,
      8,
      20,
      '#ffffff',
    );
    drawMessages(ctx, 8, 40);

    // Dialog modal on top of everything (screen space).
    if (this.dialog) this.dialogBox.render(ctx, this.dialog);
  }
}

const game = new MapGame(renderer, { backgroundColor: '#12121c' });
game.setup(() => {
  void game.load();
});
