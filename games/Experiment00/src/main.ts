// oxlint-disable max-statements curly
import {
  AudioSystem,
  DialogBox,
  type DialogDocument,
  DialogRunner,
  Engine,
  Input,
  LocalStorageBackend,
  MapManager,
  type MapObjectContext,
  MapObjectRegistry,
  type RenderContext,
  ScreenRegistry,
  ShaderSystem,
  type SoundHandle,
  StateStore,
  VignetteShader,
  WebRenderer,
  MemoryBackend,
} from '../../../src/index';
import { drawMessages, showMessage, updateMessages } from './hud';
import { Olive } from './objects/olive';
import { Campfire } from './objects/campfire';
import { Torch } from './objects/torch';
import { Bookshelf } from './objects/bookshelf';
import { Player } from './objects/player';
import { Portal } from './objects/portal';
import { Rat } from './objects/rat';
import { Slime } from './objects/slime';
import { Sign } from './objects/sign';
import { DarkChamberScreen } from './screens/dark-chamber';
import { RoomScreen } from './screens/room';
import { Ghost } from './objects/ghost';
import { FlyingSkull } from './objects/flying_skull';

// The Experiment00 project uses 20×16 screens of 16px tiles → a
// 320×256 screen, up-scaled ×2 for display (640×512).
const SCREEN_W = 320;
const SCREEN_H = 256;
const SCALE = 3;
const PLAYER_SIZE = 16;
// Screen tile size (px). Portal `spawn` cells are authored in grid col/row
// and converted to pixels with this.
const BLOCK_SIZE = 16;
// The player draws on this z-level; layers above it (e.g. the `pillars`
// layer at level 3) occlude it, so keep it below them.
const PLAYER_LEVEL = 2;

/**
 * Audio wiring for the demo, kept declarative so it is easy to tune:
 *
 * - `backgroundByScreen` maps a screen coordinate (`"cx,cy"`) to an ambient
 *   bed id; every other screen falls back to `defaultBackground`.
 * - `footstepSequence` is cycled one step per `stepInterval` seconds while the
 *   player walks, so a footfall rhythm emerges from movement.
 * - `campfireSound` is a looping, distance-attenuated emitter attached to each
 *   lit campfire (swells as the player approaches, silent far away).
 *
 * Ids reference `assets/audio/experiment00.audio.project.json`.
 */
const AUDIO = {
  projectUrl: '/assets/audio/experiment00.audio.project.json',
  ambientFade: 1.2,
  defaultBackground: 'bg_sewers',
  backgroundByScreen: {
    '0,3': 'bg_cave',
  } as Record<string, string>,
  footstepSequence: 'seq_footsteps',
  stepInterval: 0.32,
  stepVolume: 0.6,
  campfireSound: 'campfire_loop',
  campfireVolume: 1,
} as const;

/** Prefixes the audio base path and percent-encodes each path segment. */
const resolveAudio = (file: string): string =>
  '/assets/audio/' + file.split('/').map(encodeURIComponent).join('/');

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
  private audio?: AudioSystem;
  /** Seconds since the last footfall; starts "ready" so walking steps at once. */
  private stepTimer: number = AUDIO.stepInterval;
  /** Looping campfire emitter per lit fire on the active screen. */
  private readonly fireVoices = new Map<Campfire, SoundHandle>();
  /**
   * Persistent save state (localStorage-backed, saved on every change). Holds
   * durable world facts such as which olives have been picked up, so they do
   * not reappear on screen re-entry or reload.
   */
  private readonly save = new StateStore({
    backend: new MemoryBackend('experiment00:save'),
    autoSave: true,
  });

  async load(): Promise<void> {
    // Objects: the map instantiates a class wherever it places a matching
    // object. `Campfire` is keyed by its static `type` ("campfire").
    const registry = new MapObjectRegistry();
    registry.register(Campfire);
    registry.register(Portal);
    registry.register(Sign);
    registry.register(Bookshelf);
    registry.register(Rat);
    registry.register(Slime);
    registry.register(FlyingSkull);
    registry.register(Torch);
    registry.register(Olive);
    // Olives read/write their collected flag from the shared save store.
    Olive.useState(this.save.scope('olives'));

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

    // Audio: load the sound/sequence catalog and expose it as a subsystem.
    // File paths are resolved under assets/audio and percent-encoded (names
    // contain spaces). The listener follows the player so campfire emitters
    // attenuate with distance.
    const audio = new AudioSystem();
    const audioProject = await fetch(AUDIO.projectUrl).then((r) => r.json());
    await audio.load(audioProject, { resolve: (d) => resolveAudio(d.file) });
    this.audio = audio;
    this.use(audio);
    audio.setListener(() => this.listenerPoint());

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
    this.updateBackground();
    return true;
  }

  /** Point (screen px) the world is heard from — the player's centre. */
  private listenerPoint(): { x: number; y: number } {
    const p = this.player;
    if (!p) return { x: 0, y: 0 };
    return { x: p.x + PLAYER_SIZE / 2, y: p.y + PLAYER_SIZE / 2 };
  }

  /** Crossfades to the ambient bed configured for the current screen. */
  private updateBackground(): void {
    const id = AUDIO.backgroundByScreen[`${this.cx},${this.cy}`] ?? AUDIO.defaultBackground;
    this.audio?.playAmbient(id, { fadeIn: AUDIO.ambientFade, fadeOut: AUDIO.ambientFade });
  }

  /**
   * Reconciles the looping campfire emitters with the lit fires on-screen:
   * starts a distance-attenuated, fire-following voice for each newly lit
   * campfire and fades out any that went cold or left with the screen.
   */
  private syncCampfires(): void {
    const audio = this.audio;
    if (!audio) return;
    const lit = new Set(this.campfires().filter((f) => f.lit));
    for (const [fire, handle] of this.fireVoices) {
      if (lit.has(fire)) continue;
      handle.stop({ fadeOut: 0.3 });
      this.fireVoices.delete(fire);
    }
    for (const fire of lit) {
      if (this.fireVoices.has(fire)) continue;
      const handle = audio.playSound(AUDIO.campfireSound, {
        volume: AUDIO.campfireVolume,
        follow: () => {
          const b = fire.collisionBox;
          return { x: b.x + b.w / 2, y: b.y + b.h / 2 };
        },
      });
      if (handle) this.fireVoices.set(fire, handle);
    }
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
      this.audio?.playSound('portal_open', { volume: 0.7 });
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
    // Any key is a user gesture — resume the (autoplay-suspended) audio context.
    void this.audio?.unlock();
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

  override update(dt: number): void {
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

      for (const flyingskull of this.map.current.objectsByType(FlyingSkull)) {
        flyingskull.sense(pbox, this.map.current.collision);
      }
      for (const ghost of this.map.current.objectsByType(Ghost)) {
        ghost.sense(pbox, this.map.current.collision);
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

    // Footsteps: cycle the configured sequence one step per interval while the
    // player walks; reset the timer when idle so the next stride steps at once.
    if (player.isWalking()) {
      this.stepTimer += dt;
      if (this.stepTimer >= AUDIO.stepInterval) {
        this.audio?.playSequenceStep(AUDIO.footstepSequence, {
          tracker: 'player',
          volume: AUDIO.stepVolume,
          rate: 0.94 + Math.random() * 0.12,
        });
        this.stepTimer = 0;
      }
    } else {
      this.stepTimer = AUDIO.stepInterval;
    }

    // Keep the looping campfire emitters in sync with the lit fires on-screen.
    this.syncCampfires();

    // Collect any olive the player is standing on.
    this.pickupOlives();
  }

  /**
   * Picks up every olive whose `pickup` collider the player overlaps: records
   * it (so it stays gone across screens/reloads), shows a toast, and — for an
   * olive with a `message` property — opens its dialog and stops for the frame
   * (the modal freezes the world).
   */
  private pickupOlives(): void {
    const player = this.player;
    const screen = this.map?.current;
    if (!player || !screen) return;
    for (const object of screen.collision.owners(player.box(), 'pickup', player)) {
      if (!(object instanceof Olive) || !object.collect()) continue;
      showMessage('You picked an olive', 1.2);
      const ref = object.dialogRef;
      if (ref && this.dialog?.start(ref)) break;
    }
  }

  override render(ctx: RenderContext): void {
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
game.setup(async () => {
  await void game.load();
});
