import type {
  AudioSystem,
  DitherFog,
  FontSheet,
  Input,
  MapObject,
  Screen,
  StateStore,
} from '../../../src/index';
import type { Inventory } from './inventory';
import type { Player } from './objects/player';
import type { Telemetry } from './telemetry';
import type { GameFlow } from './systems/flow';
import type { SplashSystem } from './systems/splash';
import type { DialogSystem } from './systems/dialog';
import type { HudSystem } from './systems/hud';
import type { LockKeypadSystem } from './systems/lock_keypad';
import type { TransitionSystem } from './systems/transition';

/** World queries + navigation the interactions need. */
export interface WorldRef {
  /** Whether a screen exists at the coordinate (a travel destination). */
  canNavigate(x: number, y: number): boolean;
  /**
   * Navigates to a screen; `placePlayer` (when given) repositions the
   * player right after the swap — e.g. onto the authored spawn cell.
   * Returns whether the screen existed.
   */
  navigate(x: number, y: number, placePlayer?: (player: Player) => void): boolean;
  /** Objects on the active screen. */
  objects(): MapObject[];
  /** The active screen (undefined before the map loads). */
  current(): Screen | undefined;
  /** The active screen coordinate as `"cx,cy"`. */
  screenKey(): string;
}

/**
 * The service bag: one typed object replaces the old `useState` singletons,
 * the `fog.ts`/`hud.ts` globals and `MapGame`'s fields. Built by the
 * composition root, filled in two stages — services at construction, and the
 * loaded pieces / systems as boot and composition progress.
 */
export interface GameContext {
  // Services — available from construction:
  readonly input: Input;
  readonly save: StateStore;
  readonly inventory: Inventory;
  readonly telemetry: Telemetry;

  // Loaded during boot — undefined until then (guard with `?.`):
  audio?: AudioSystem;
  font?: FontSheet;
  fog?: DitherFog;
  player?: Player; // published by WorldSystem.spawnPlayer()

  // Systems — filled by main.ts at composition time:
  flow?: GameFlow;
  world?: WorldRef;
  hud?: HudSystem;
  dialog?: DialogSystem;
  lock?: LockKeypadSystem;
  transition?: TransitionSystem;
  splash?: SplashSystem;
}
