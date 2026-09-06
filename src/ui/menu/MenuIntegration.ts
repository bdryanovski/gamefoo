/**
 * Menu Integration - Connects menu pages to engine systems.
 *
 * Provides a bridge between the UI menu system and the game engine,
 * allowing menu changes to affect actual game behavior.
 *
 * @category UI
 * @module ui/menu/MenuIntegration
 * @since 0.5.0
 */

import type { ControlScheme } from '@/core/controls/types';
import type Engine from '@/core/engine';
import type { ColorPalette, GeneratedPalette } from '@/core/palettes/types';

/**
 * Union type for both palette types.
 *
 * @since 0.5.0
 */
export type AnyPalette = ColorPalette | GeneratedPalette;

import { type ControlSchemeName, getControlScheme } from '@/core/controls';
import type { GridSize, MonitorSystem } from '@/subsystems/monitor_system';
import type MenuSystem from './MenuSystem';
import type AudioPage from './pages/AudioPage';
import type ControlsPage from './pages/ControlsPage';
import type DebugPage from './pages/DebugPage';
import type GraphicsPage from './pages/GraphicsPage';
import type PalettePage from './pages/PalettePage';
import type QuitPage from './pages/QuitPage';

/**
 * Debug overlay state.
 *
 * @since 0.5.0
 */
export interface DebugState {
  showFps: boolean;
  showGraph: boolean;
  showMemory: boolean;
  showGrid: boolean;
  gridSize: GridSize;
}

/**
 * Graphics state.
 *
 * @since 0.5.0
 */
export interface GraphicsState {
  /**
   * Display scale
   */
  scale: number;
  /**
   * Resolution width
   */
  width: number;
  /**
   * Resolution height
   */
  height: number;
}

/**
 * Audio state.
 *
 * @since 0.5.0
 */
export interface AudioState {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

/**
 * Integration configuration.
 *
 * @since 0.5.0
 */
export interface MenuIntegrationConfig {
  /**
   * Available palettes (supports both ColorPalette and GeneratedPalette)
   */
  palettes?: AnyPalette[];
  /**
   * Initial palette index
   */
  initialPaletteIndex?: number;
  /**
   * Initial control scheme
   */
  initialControlScheme?: ControlSchemeName;
  /**
   * Initial graphics state
   */
  initialGraphics?: Partial<GraphicsState>;
  /**
   * Initial audio state
   */
  initialAudio?: Partial<AudioState>;
  /**
   * MonitorSystem for debug controls (optional)
   */
  monitorSystem?: MonitorSystem;
}

/**
 * Callback interface for integration events.
 *
 * @since 0.5.0
 */
export interface MenuIntegrationCallbacks {
  /**
   * Called when control scheme changes
   */
  onControlSchemeChange?: (scheme: ControlScheme, name: ControlSchemeName) => void;
  /**
   * Called when palette changes
   */
  onPaletteChange?: (palette: AnyPalette, index: number) => void;
  /**
   * Called when graphics settings change
   */
  onGraphicsChange?: (state: GraphicsState) => void;
  /**
   * Called when audio settings change
   */
  onAudioChange?: (state: AudioState) => void;
  /**
   * Called when debug settings change
   */
  onDebugChange?: (state: DebugState) => void;
  /**
   * Called when quit is confirmed
   */
  onQuit?: () => void;
}

/**
 * Menu Integration - Connects menu pages to engine systems.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const integration = new MenuIntegration(engine, menuSystem, {
 *   palettes: [PICO8, TIC80, GAMEBOY],
 *   initialControlScheme: 'DEFAULT',
 * });
 *
 * integration.onControlSchemeChange = (scheme, name) => {
 *   engine.inputMapper.setScheme(scheme);
 * };
 *
 * integration.onPaletteChange = (palette) => {
 *   game.setActivePalette(palette);
 * };
 * ```
 */
export default class MenuIntegration {
  /**
   * Engine reference
   */
  private _engine: Engine;

  /**
   * Menu system reference
   */
  private _menuSystem: MenuSystem;

  /**
   * MonitorSystem reference for debug controls
   */
  private _monitorSystem: MonitorSystem | null = null;

  /**
   * Current state
   */
  private _controlScheme: ControlSchemeName = 'DEFAULT';
  private _paletteIndex: number = 0;
  private _graphics: GraphicsState;
  private _audio: AudioState;

  /**
   * Available palettes
   */
  private _palettes: AnyPalette[] = [];

  /**
   * Callbacks
   */
  private _callbacks: MenuIntegrationCallbacks = {};

  /**
   * Creates a new MenuIntegration.
   *
   * @param engine - Engine instance
   * @param menuSystem - MenuSystem instance
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(engine: Engine, menuSystem: MenuSystem, config: MenuIntegrationConfig = {}) {
    this._engine = engine;
    this._menuSystem = menuSystem;
    this._monitorSystem = config.monitorSystem ?? null;

    // Initialize state
    this._palettes = config.palettes ?? [];
    this._paletteIndex = config.initialPaletteIndex ?? 0;
    this._controlScheme = config.initialControlScheme ?? 'DEFAULT';

    this._graphics = {
      scale: config.initialGraphics?.scale ?? engine.gameScale,
      width: config.initialGraphics?.width ?? engine.dementions.width,
      height: config.initialGraphics?.height ?? engine.dementions.height,
    };

    this._audio = {
      masterVolume: config.initialAudio?.masterVolume ?? 100,
      musicVolume: config.initialAudio?.musicVolume ?? 80,
      sfxVolume: config.initialAudio?.sfxVolume ?? 100,
      muted: config.initialAudio?.muted ?? false,
    };
  }

  /**
   * Sets the callbacks for integration events.
   *
   * @param callbacks - Callback functions
   *
   * @since 0.5.0
   */
  public setCallbacks(callbacks: MenuIntegrationCallbacks): void {
    this._callbacks = { ...this._callbacks, ...callbacks };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Page Creators
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Creates a connected ControlsPage.
   *
   * @returns ControlsPage instance
   *
   * @since 0.5.0
   */
  public createControlsPage(): ControlsPage {
    // Dynamic import to avoid circular dependencies
    const { default: ControlsPage } = require('./pages/ControlsPage');

    return new ControlsPage({
      initialScheme: this._controlScheme,
      onSchemeChange: (scheme: ControlScheme, name: ControlSchemeName) => {
        this._controlScheme = name;
        this._callbacks.onControlSchemeChange?.(scheme, name);
      },
    });
  }

  /**
   * Creates a connected GraphicsPage.
   *
   * @returns GraphicsPage instance
   *
   * @since 0.5.0
   */
  public createGraphicsPage(): GraphicsPage {
    const { default: GraphicsPage } = require('./pages/GraphicsPage');

    return new GraphicsPage({
      scale: this._graphics.scale,
      scales: [1, 2, 3, 4],
      resolution: {
        width: this._graphics.width,
        height: this._graphics.height,
      },
      onScaleChange: (scale: number) => {
        this._graphics.scale = scale;
        this._callbacks.onGraphicsChange?.({ ...this._graphics });
      },
      onResolutionChange: (res: { width: number; height: number }) => {
        this._graphics.width = res.width;
        this._graphics.height = res.height;
        this._callbacks.onGraphicsChange?.({ ...this._graphics });
      },
    });
  }

  /**
   * Creates a connected AudioPage.
   *
   * @returns AudioPage instance
   *
   * @since 0.5.0
   */
  public createAudioPage(): AudioPage {
    const { default: AudioPage } = require('./pages/AudioPage');

    return new AudioPage({
      masterVolume: this._audio.masterVolume,
      musicVolume: this._audio.musicVolume,
      sfxVolume: this._audio.sfxVolume,
      muted: this._audio.muted,
      onMasterVolumeChange: (volume: number) => {
        this._audio.masterVolume = volume;
        this._callbacks.onAudioChange?.({ ...this._audio });
      },
      onMusicVolumeChange: (volume: number) => {
        this._audio.musicVolume = volume;
        this._callbacks.onAudioChange?.({ ...this._audio });
      },
      onSfxVolumeChange: (volume: number) => {
        this._audio.sfxVolume = volume;
        this._callbacks.onAudioChange?.({ ...this._audio });
      },
      onMutedChange: (muted: boolean) => {
        this._audio.muted = muted;
        this._callbacks.onAudioChange?.({ ...this._audio });
      },
    });
  }

  /**
   * Creates a connected PalettePage.
   *
   * @returns PalettePage instance
   *
   * @since 0.5.0
   */
  public createPalettePage(): PalettePage {
    const { default: PalettePage } = require('./pages/PalettePage');

    return new PalettePage({
      palettes: this._palettes,
      selectedIndex: this._paletteIndex,
      onPaletteChange: (palette: AnyPalette, index: number) => {
        this._paletteIndex = index;
        this._callbacks.onPaletteChange?.(palette, index);
      },
    });
  }

  /**
   * Creates a connected DebugPage.
   *
   * If MonitorSystem is provided, the page directly controls it.
   * Otherwise, callbacks are fired for manual handling.
   *
   * @returns DebugPage instance
   *
   * @since 0.5.0
   */
  public createDebugPage(): DebugPage {
    const { default: DebugPage } = require('./pages/DebugPage');

    const page = new DebugPage({
      monitorSystem: this._monitorSystem ?? undefined,
      onShowFpsChange: (_value: boolean) => {
        this._callbacks.onDebugChange?.(this.debug);
      },
      onShowGraphChange: (_value: boolean) => {
        this._callbacks.onDebugChange?.(this.debug);
      },
      onShowMemoryChange: (_value: boolean) => {
        this._callbacks.onDebugChange?.(this.debug);
      },
      onShowGridChange: (_value: boolean) => {
        this._callbacks.onDebugChange?.(this.debug);
      },
      onGridSizeChange: (_size: GridSize) => {
        this._callbacks.onDebugChange?.(this.debug);
      },
    });

    return page;
  }

  /**
   * Creates a connected QuitPage.
   *
   * @param message - Optional custom message
   * @returns QuitPage instance
   *
   * @since 0.5.0
   */
  public createQuitPage(message?: string): QuitPage {
    const { default: QuitPage } = require('./pages/QuitPage');

    return new QuitPage({
      message: message ?? 'Are you sure you want to quit?',
      onQuit: () => {
        this._callbacks.onQuit?.();
      },
      onCancel: () => {
        this._menuSystem.hide();
      },
    });
  }

  /**
   * Registers all default pages to the menu system.
   *
   * @since 0.5.0
   */
  public registerAllPages(): void {
    this._menuSystem.registerPage(this.createControlsPage());
    this._menuSystem.registerPage(this.createGraphicsPage());
    this._menuSystem.registerPage(this.createAudioPage());

    if (this._palettes.length > 0) {
      this._menuSystem.registerPage(this.createPalettePage());
    }

    this._menuSystem.registerPage(this.createDebugPage());
    this._menuSystem.registerPage(this.createQuitPage());
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // State Getters
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Current control scheme name.
   *
   * @since 0.5.0
   */
  public get controlScheme(): ControlSchemeName {
    return this._controlScheme;
  }

  /**
   * Current control scheme object.
   *
   * @since 0.5.0
   */
  public get controlSchemeConfig(): ControlScheme {
    return getControlScheme(this._controlScheme);
  }

  /**
   * Current palette index.
   *
   * @since 0.5.0
   */
  public get paletteIndex(): number {
    return this._paletteIndex;
  }

  /**
   * Current palette.
   *
   * @since 0.5.0
   */
  public get palette(): AnyPalette | null {
    return this._palettes[this._paletteIndex] ?? null;
  }

  /**
   * Current graphics state.
   *
   * @since 0.5.0
   */
  public get graphics(): Readonly<GraphicsState> {
    return this._graphics;
  }

  /**
   * Current audio state.
   *
   * @since 0.5.0
   */
  public get audio(): Readonly<AudioState> {
    return this._audio;
  }

  /**
   * Current debug state (reads from MonitorSystem if available).
   *
   * @since 0.5.0
   */
  public get debug(): Readonly<DebugState> {
    if (this._monitorSystem) {
      return {
        showFps: this._monitorSystem.showFps,
        showGraph: this._monitorSystem.showGraph,
        showMemory: this._monitorSystem.showMemory,
        showGrid: this._monitorSystem.showGrid,
        gridSize: this._monitorSystem.gridSize,
      };
    }
    // Fallback defaults
    return {
      showFps: false,
      showGraph: false,
      showMemory: false,
      showGrid: false,
      gridSize: 'none',
    };
  }

  /**
   * MonitorSystem reference.
   *
   * @since 0.5.0
   */
  public get monitorSystem(): MonitorSystem | null {
    return this._monitorSystem;
  }

  /**
   * Sets the MonitorSystem reference.
   *
   * @param monitor - MonitorSystem instance
   *
   * @since 0.5.0
   */
  public setMonitorSystem(monitor: MonitorSystem): void {
    this._monitorSystem = monitor;
  }
}
