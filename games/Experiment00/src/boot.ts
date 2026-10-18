// oxlint-disable max-statements
import {
  AmbientSporeShader,
  Asset,
  DialogBox,
  DialogRunner,
  FontSheet,
  MapManager,
  MapObjectRegistry,
  ScreenRegistry,
  ScreenTransitionShader,
  ShaderSystem,
  TextObject,
  VignetteShader,
  type DialogDocument,
  type Engine,
} from '../../../src/index';
import { AUDIO, resolveAudio } from './config/audio';
import type { GameContext } from './context';
import { Bat } from './objects/bat';
import { Bookshelf } from './objects/bookshelf';
import { Campfire } from './objects/campfire';
import { Candle } from './objects/candle';
import { Candles } from './objects/candles';
import { Chest } from './objects/chest';
import { FlyingSkull } from './objects/flying_skull';
import { Ghost } from './objects/ghost';
import { Goblin } from './objects/goblin';
import { Her } from './objects/her';
import { Lanter } from './objects/lanter';
import { Olive } from './objects/olive';
import { Portal } from './objects/portal';
import { Rat } from './objects/rat';
import { Sign } from './objects/sign';
import { Skeleton } from './objects/skeleton';
import { Slime } from './objects/slime';
import { SlimeKing } from './objects/slime_king';
import { Torch } from './objects/torch';
import { DarkChamberScreen } from './screens/dark-chamber';
import { HeaderScreen } from './screens/header';
import { RoomScreen } from './screens/room';
import type { WorldSystem } from './systems/world';

/** Map objects the editor can place — the map instantiates a class wherever it places a matching object. */
const OBJECT_CLASSES = [
  Campfire,
  Portal,
  Sign,
  Bookshelf,
  Rat,
  Bat,
  Ghost,
  Slime,
  FlyingSkull,
  Skeleton,
  Goblin,
  Her,
  SlimeKing,
  Torch,
  Lanter,
  Olive,
  Candle,
  Candles,
  Chest,
];

/**
 * Boots the game: streams every asset and installs the loaded pieces into
 * the systems (the `use*` binding pattern). The splash covers the world
 * until `markReady()` — failures are non-fatal where the game still runs
 * (title card, font, dialogs export).
 */
export async function boot(context: GameContext, engine: Engine): Promise<void> {
  const loadStart = performance.now();
  context.telemetry.gameStart();

  // The world system is resolved from the engine (it is registered by the
  // composition root); boot installs the loaded map + spawns the player.
  const world = engine.get<WorldSystem>('world');

  // 1. Title card, first so it is on screen while the world streams in.
  context.splash?.useImage(await Asset.load('/assets/images/splash.jpg').catch(() => undefined));

  // 2. The single bitmap font used for ALL text (8×8 CP437 atlas) — installed
  //    as the default for every text path before the map streams in, so
  //    editor-authored text placements are drawn with it too.
  context.font = await FontSheet.load('/assets/fonts/dungeonmode/bitmap/dungeon-437.png').catch(
    () => undefined,
  );
  if (context.font) {
    TextObject.defaultFont = context.font;
    context.hud?.useFont(context.font, 2);
    context.inventoryView.setFont(context.font, 2);
  }
  context.dialog?.useBox(context.font ? new DialogBox({ font: context.font }) : new DialogBox());

  // 3. Objects + screens registries (declarative, so wiring is scannable).
  const registry = new MapObjectRegistry();
  for (const objectClass of OBJECT_CLASSES) registry.register(objectClass);

  const screens = new ScreenRegistry();
  screens.setDefault(RoomScreen);
  screens.register(0, 8, DarkChamberScreen);
  screens.register(0, 0, HeaderScreen);

  // 4. The editor's live working project, straight from disk, unmodified.
  //    Image urls are "/uploads/<file>".
  const url = '/project/projects/proj_mtj0babj_m.json';
  const project = await fetch(url).then((r) => r.json());
  const map = new MapManager();
  await map.load(project, {
    resolve: (img) => `/project${img.url}`,
    registry,
    screens,
    services: context,
  });
  world?.useMap(map); // also enters the first screen (0,0)

  // 5. The `n0..n9` number sprites (lock keypad) from the project catalog:
  //    name → id → draw-ready frame.
  const spriteIdByName = new Map<string, string>(
    ((project.sprites ?? []) as Array<{ name: string; id: string }>).map((s) => [s.name, s.id]),
  );
  context.lock?.useNumberFrames(
    Array.from({ length: 10 }, (_, digit) => {
      const id = spriteIdByName.get(`n${digit}`);
      return id ? map.assets.frame(id) : undefined;
    }),
  );

  // 6. Dialogs — the editor's standalone export (kept current on every save).
  const dialogs: DialogDocument = await fetch(
    '/project/exports/proj_mtj0babj_m/experiment00.dialogs.json',
  )
    .then((r) => (r.ok ? r.json() : { trees: {} }))
    .catch(() => ({ trees: {} }));
  context.dialogs = dialogs; // kept so item/journal entries resolve their text
  context.dialog?.useRunner(new DialogRunner(dialogs));

  // 7. Screen-space effects: vignette, then drifting spores on top, then the
  //    iris (rendered last by ShaderSystem at order 900 — it covers every
  //    other effect, the HUD and any dialog while a transition plays). The
  //    iris instance goes to the transition system; it only drives coverage.
  const shaders = new ShaderSystem();
  shaders.add(new VignetteShader({ intensity: 0.4, inner: 0.55 }));
  shaders.add(new AmbientSporeShader({ density: 1.2, alpha: 0.22 }));
  context.transition?.useShader(shaders.add(new ScreenTransitionShader({ block: 18 })));
  engine.use(shaders); // order 900

  // 8. Audio catalog — the AudioSystem instance itself is a subsystem from
  //    frame one (registered in main); boot only loads it. The listener
  //    follows the player so campfire emitters attenuate with distance.
  const audioProject = await fetch(AUDIO.projectUrl).then((r) => r.json());
  await context.audio?.load(audioProject, { resolve: (d) => resolveAudio(d.file) });
  context.audio?.setListener(() => context.player?.center() ?? { x: 0, y: 0 });

  // 9. The persistent player — the one game-owned object.
  world?.spawnPlayer();

  // 10. Everything loaded — the splash flips to "Press E to start".
  context.splash?.markReady();
  context.telemetry.gameLoaded(performance.now() - loadStart);
}
