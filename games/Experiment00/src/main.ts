import {
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
import { Player } from './objects/player';
import { DarkChamberScreen } from './screens/dark-chamber';
import { RoomScreen } from './screens/room';

// The Experiment00 project uses 20×16 screens of 16px tiles → a
// 320×256 screen, up-scaled ×2 for display (640×512).
const SCREEN_W = 320;
const SCREEN_H = 256;
const SCALE = 2;
const PLAYER_SIZE = 16;

const renderer = new WebRenderer('game', SCREEN_W * SCALE, SCREEN_H * SCALE);

/**
 * Drives the Experiment00 map with a playable character: WASD/arrows walk the
 * player around, walls of the screen hand off to the neighbouring screen, and
 * `E` interacts with a nearby campfire.
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

  async load() {
    // Objects: the map instantiates a class wherever it places a matching
    // object. `Campfire` is keyed by its static `type` ("campfire").
    const registry = new MapObjectRegistry();
    registry.register(Campfire);
    await loadCampfireConfig('/project/exports/proj_mtj0babj_m/campfire.object.json');

    // Screens: a default class for every room, overridden per coordinate.
    const screens = new ScreenRegistry();
    screens.setDefault(RoomScreen);
    screens.register(0, 3, DarkChamberScreen);

    // Read the editor's live working project straight from disk (served at
    // /project/…), unmodified. Image urls are "/uploads/<file>".
    const url = '/project/projects/proj_mtj0babj_m.json';
    this.map = await MapManager.fromUrl(url, {
      resolve: (img) => `/project${img.url}`,
      registry,
      screens,
    });

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
      level: 5,
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

  /** Hands the player to the neighbouring screen when it leaves the edge. */
  private handleTransitions(): void {
    const player = this.player;
    if (!player) return;
    const maxX = SCREEN_W - PLAYER_SIZE;
    const maxY = SCREEN_H - PLAYER_SIZE;
    if (player.x < 0) player.place(this.navigate(this.cx - 1, this.cy) ? maxX - 1 : 0, player.y);
    else if (player.x > maxX)
      player.place(this.navigate(this.cx + 1, this.cy) ? 1 : maxX, player.y);
    if (player.y < 0) player.place(player.x, this.navigate(this.cx, this.cy - 1) ? maxY - 1 : 0);
    else if (player.y > maxY)
      player.place(player.x, this.navigate(this.cx, this.cy + 1) ? 1 : maxY);
  }

  /** Toggles a campfire within the player's reach. */
  private interact(): void {
    const player = this.player;
    if (!player) return;
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
    if (e.key === 'e' || e.key === 'E' || e.key === ' ') this.interact();
  }

  override update(dt: number) {
    this.map?.update(dt);
    updateMessages(dt);
    const player = this.player;
    const screen = this.map?.current;
    if (!player || !screen) return;
    player.update(dt, screen.collision);
    this.handleTransitions();
    const current = this.map?.current;
    if (!current) return;
    const foot = player.footPoint();
    if (current.collision.isWalkable(foot.x, foot.y)) {
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
    this.map?.render(ctx);
    this.player?.render(ctx);
    ctx.restore();

    const fires = this.campfires();
    const lit = fires.filter((f) => f.lit).length;
    ctx.drawText(
      `screen ${this.cx},${this.cy}   WASD move · E interact   campfires ${lit}/${fires.length} lit`,
      8,
      20,
      '#ffffff',
    );
    drawMessages(ctx, 8, 40);
  }
}

const game = new MapGame(renderer, { backgroundColor: '#12121c' });
game.setup(() => {
  void game.load();
});
