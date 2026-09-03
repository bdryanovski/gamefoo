/**
 * Menu SubSystem - Engine-integrated menu system.
 *
 * A complete menu subsystem that integrates with the engine and automatically
 * configures menu settings to affect engine systems (graphics, audio, controls, debug).
 *
 * @category UI
 * @module ui/menu/MenuSubSystem
 * @since 0.5.0
 */

import type Engine from '@/core/engine';
import type { RenderContext } from '@/core/renderer/type';
import type { SubSystem } from '@/subsystems/types';
import type { MonitorSystem } from '@/subsystems/monitor_system';
import type { ControlScheme } from '@/core/controls/types';
import type { ControlSchemeName } from '@/core/controls';
import { getControlScheme } from '@/core/controls';
import type { UITheme } from '../core/Theme';
import MenuSystem, { type MenuSystemConfig } from './MenuSystem';
import MenuIntegration, {
  type AnyPalette,
  type AudioState,
  type DebugState,
  type GraphicsState,
  type MenuIntegrationConfig,
} from './MenuIntegration';

/**
 * Menu subsystem configuration.
 *
 * @since 0.5.0
 */
export interface MenuSubSystemConfig {
  /**
   * Menu width (default: 280)
   */
  width?: number;
  /**
   * Menu height (default: 200)
   */
  height?: number;
  /**
   * Theme to use
   */
  theme?: UITheme;
  /**
   * Overlay color for dithered background (default: '#000000')
   */
  overlayColor?: string;

  /**
   * Available palettes for palette page
   */
  palettes?: AnyPalette[];
  /**
   * Initial palette index
   */
  initialPaletteIndex?: number;
  /**
   * Initial control scheme name
   */
  initialControlScheme?: ControlSchemeName;

  /**
   * Initial audio state
   */
  initialAudio?: Partial<AudioState>;

  /**
   * MonitorSystem reference for debug controls (auto-detected if not provided)
   */
  monitorSystem?: MonitorSystem;

  /**
   * Whether to auto-register default pages (default: true)
   */
  autoRegisterPages?: boolean;

  /**
   * Whether to show palette page (default: true if palettes provided)
   */
  showPalettePage?: boolean;
}

/**
 * Menu subsystem event callbacks.
 *
 * @since 0.5.0
 */
export interface MenuSubSystemCallbacks {
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
  /**
   * Called when menu is shown
   */
  onShow?: () => void;
  /**
   * Called when menu is hidden
   */
  onHide?: () => void;
}

/**
 * Menu SubSystem - Engine-integrated menu system.
 *
 * Provides a complete pause/settings menu that automatically integrates
 * with engine systems:
 *
 * - **Graphics**: Resize canvas and engine when resolution/scale changes
 * - **Audio**: Control volume levels (requires custom audio integration)
 * - **Controls**: Switch control schemes via InputMapper
 * - **Debug**: Control MonitorSystem overlays (FPS, memory, grid)
 * - **Palette**: Switch color palettes (requires custom integration)
 *
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * const menuSubSystem = new MenuSubSystem({
 *   width: 280,
 *   height: 200,
 *   palettes: [PICO8, GAMEBOY, TIC80],
 * });
 *
 * // Add to engine - auto-detects MonitorSystem if present
 * engine.use(menuSubSystem);
 *
 * // Custom palette handling
 * menuSubSystem.onPaletteChange = (palette, index) => {
 *   game.setActivePalette(palette);
 * };
 * ```
 *
 * @example With MonitorSystem
 * ```ts
 * const monitor = new MonitorSystem();
 * const menu = new MenuSubSystem({
 *   monitorSystem: monitor,
 * });
 *
 * engine.use(monitor);
 * engine.use(menu);
 * ```
 *
 * @example Custom audio integration
 * ```ts
 * const menu = new MenuSubSystem();
 * menu.onAudioChange = (state) => {
 *   audioManager.setMasterVolume(state.masterVolume / 100);
 *   audioManager.setMusicVolume(state.musicVolume / 100);
 *   audioManager.setSfxVolume(state.sfxVolume / 100);
 *   audioManager.setMuted(state.muted);
 * };
 * ```
 */
export default class MenuSubSystem implements SubSystem {
  /**
   * Subsystem ID
   */
  readonly id = 'menu-subsystem';

  /**
   * Execution order (after MonitorSystem at 90, but defines MenuSystem at 95)
   */
  readonly order = 92;

  /**
   * Subsystem enabled state
   */
  enabled = true;

  /**
   * Engine reference
   */
  private _engine: Engine | null = null;

  /**
   * Configuration
   */
  private _config: MenuSubSystemConfig;

  /**
   * Internal MenuSystem
   */
  private _menuSystem: MenuSystem | null = null;

  /**
   * Internal MenuIntegration
   */
  private _integration: MenuIntegration | null = null;

  /**
   * MonitorSystem reference
   */
  private _monitorSystem: MonitorSystem | null = null;

  /**
   * Callbacks
   */
  private _callbacks: MenuSubSystemCallbacks = {};

  /**
   * Previous menu visibility (for onShow/onHide callbacks)
   */
  private _wasVisible: boolean = false;

  /**
   * Creates a new MenuSubSystem.
   *
   * @param config - Configuration options
   *
   * @since 0.5.0
   */
  constructor(config: MenuSubSystemConfig = {}) {
    this._config = config;
    this._monitorSystem = config.monitorSystem ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SubSystem Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initializes the menu subsystem.
   *
   * Creates the MenuSystem, MenuIntegration, and registers default pages.
   * Auto-detects MonitorSystem from engine if not provided.
   *
   * @param engine - Engine instance
   *
   * @since 0.5.0
   */
  init(engine: Engine): void {
    this._engine = engine;

    // Create MenuSystem
    const menuConfig: MenuSystemConfig = {
      width: this._config.width ?? 280,
      height: this._config.height ?? 200,
      theme: this._config.theme,
      overlayColor: this._config.overlayColor,
    };

    this._menuSystem = new MenuSystem(menuConfig);
    this._menuSystem.init(engine);

    // Create integration config
    const integrationConfig: MenuIntegrationConfig = {
      palettes: this._config.palettes ?? [],
      initialPaletteIndex: this._config.initialPaletteIndex,
      initialControlScheme: this._config.initialControlScheme,
      initialAudio: this._config.initialAudio,
      initialGraphics: {
        scale: engine.gameScale,
        width: engine.dementions.width,
        height: engine.dementions.height,
      },
      monitorSystem: this._monitorSystem ?? undefined,
    };

    // Create integration
    this._integration = new MenuIntegration(engine, this._menuSystem, integrationConfig);

    // Set up internal callbacks that affect the engine
    this._integration.setCallbacks({
      onControlSchemeChange: (scheme, name) => {
        this._callbacks.onControlSchemeChange?.(scheme, name);
      },
      onPaletteChange: (palette, index) => {
        this._callbacks.onPaletteChange?.(palette, index);
      },
      onGraphicsChange: (state) => {
        this.applyGraphicsChange(state);
        this._callbacks.onGraphicsChange?.(state);
      },
      onAudioChange: (state) => {
        this._callbacks.onAudioChange?.(state);
      },
      onDebugChange: (state) => {
        this._callbacks.onDebugChange?.(state);
      },
      onQuit: () => {
        if (this._callbacks.onQuit) {
          this._callbacks.onQuit();
        } else {
          // Default quit behavior - just hide the menu
          this.hide();
        }
      },
    });

    // Auto-register default pages
    if (this._config.autoRegisterPages !== false) {
      this._integration.registerAllPages();
    }
  }

  /**
   * Pre-update hook - processes menu input.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  preUpdate(deltaTime: number): void {
    this._menuSystem?.preUpdate(deltaTime);

    // Track visibility changes for callbacks
    const isVisible = this._menuSystem?.visible ?? false;
    if (isVisible !== this._wasVisible) {
      if (isVisible) {
        this._callbacks.onShow?.();
      } else {
        this._callbacks.onHide?.();
      }
      this._wasVisible = isVisible;
    }
  }

  /**
   * Update hook.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  update(deltaTime: number): void {
    this._menuSystem?.update(deltaTime);
  }

  /**
   * Render hook - draws the menu.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  render(ctx: RenderContext): void {
    this._menuSystem?.render(ctx);
  }

  /**
   * Cleanup hook.
   *
   * @since 0.5.0
   */
  destroy(): void {
    this._menuSystem?.destroy();
    this._menuSystem = null;
    this._integration = null;
    this._engine = null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Engine Integration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Applies graphics changes to the engine and renderer.
   *
   * @param state - New graphics state
   *
   * @internal
   */
  private applyGraphicsChange(state: GraphicsState): void {
    if (!this._engine) {
      return;
    }

    const renderer = this._engine.renderer;

    // Resize renderer if it supports it
    if ('resize' in renderer && typeof renderer.resize === 'function') {
      (renderer as any).resize(state.width, state.height, state.scale);
    }

    // Resize engine
    this._engine.resize(state.width, state.height);

    // Resize menu to fit new screen
    this._menuSystem?.resize(state.width, state.height);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Shows the menu.
   *
   * @since 0.5.0
   */
  show(): void {
    this._menuSystem?.show();
  }

  /**
   * Hides the menu.
   *
   * @since 0.5.0
   */
  hide(): void {
    this._menuSystem?.hide();
  }

  /**
   * Toggles menu visibility.
   *
   * @since 0.5.0
   */
  toggle(): void {
    this._menuSystem?.toggle();
  }

  /**
   * Whether the menu is currently visible.
   *
   * @since 0.5.0
   */
  get visible(): boolean {
    return this._menuSystem?.visible ?? false;
  }

  /**
   * The underlying MenuSystem instance.
   *
   * Use this to register custom pages or access advanced features.
   *
   * @since 0.5.0
   */
  get menuSystem(): MenuSystem | null {
    return this._menuSystem;
  }

  /**
   * The MenuIntegration instance.
   *
   * Use this to access current state or register additional callbacks.
   *
   * @since 0.5.0
   */
  get integration(): MenuIntegration | null {
    return this._integration;
  }

  /**
   * Sets the MonitorSystem reference.
   *
   * Call this before init() to ensure debug page controls work correctly.
   *
   * @param monitor - MonitorSystem instance
   *
   * @since 0.5.0
   */
  setMonitorSystem(monitor: MonitorSystem): void {
    this._monitorSystem = monitor;
    this._integration?.setMonitorSystem(monitor);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Callback Setters
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the control scheme change callback.
   *
   * @since 0.5.0
   */
  set onControlSchemeChange(callback: MenuSubSystemCallbacks['onControlSchemeChange']) {
    this._callbacks.onControlSchemeChange = callback;
  }

  /**
   * Sets the palette change callback.
   *
   * @since 0.5.0
   */
  set onPaletteChange(callback: MenuSubSystemCallbacks['onPaletteChange']) {
    this._callbacks.onPaletteChange = callback;
  }

  /**
   * Sets the graphics change callback.
   *
   * Note: Graphics changes are automatically applied to the engine.
   * Use this callback for additional custom handling.
   *
   * @since 0.5.0
   */
  set onGraphicsChange(callback: MenuSubSystemCallbacks['onGraphicsChange']) {
    this._callbacks.onGraphicsChange = callback;
  }

  /**
   * Sets the audio change callback.
   *
   * Use this to integrate with your audio system.
   *
   * @since 0.5.0
   */
  set onAudioChange(callback: MenuSubSystemCallbacks['onAudioChange']) {
    this._callbacks.onAudioChange = callback;
  }

  /**
   * Sets the debug change callback.
   *
   * Note: If MonitorSystem is provided, debug changes are automatically applied.
   * Use this callback for additional custom handling.
   *
   * @since 0.5.0
   */
  set onDebugChange(callback: MenuSubSystemCallbacks['onDebugChange']) {
    this._callbacks.onDebugChange = callback;
  }

  /**
   * Sets the quit callback.
   *
   * If not set, quit action will simply hide the menu.
   *
   * @since 0.5.0
   */
  set onQuit(callback: MenuSubSystemCallbacks['onQuit']) {
    this._callbacks.onQuit = callback;
  }

  /**
   * Sets the show callback.
   *
   * @since 0.5.0
   */
  set onShow(callback: MenuSubSystemCallbacks['onShow']) {
    this._callbacks.onShow = callback;
  }

  /**
   * Sets the hide callback.
   *
   * @since 0.5.0
   */
  set onHide(callback: MenuSubSystemCallbacks['onHide']) {
    this._callbacks.onHide = callback;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // State Getters
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Current control scheme name.
   *
   * @since 0.5.0
   */
  get controlScheme(): ControlSchemeName {
    return this._integration?.controlScheme ?? 'DEFAULT';
  }

  /**
   * Current control scheme configuration.
   *
   * @since 0.5.0
   */
  get controlSchemeConfig(): ControlScheme {
    return this._integration?.controlSchemeConfig ?? getControlScheme('DEFAULT');
  }

  /**
   * Current palette index.
   *
   * @since 0.5.0
   */
  get paletteIndex(): number {
    return this._integration?.paletteIndex ?? 0;
  }

  /**
   * Current palette.
   *
   * @since 0.5.0
   */
  get palette(): AnyPalette | null {
    return this._integration?.palette ?? null;
  }

  /**
   * Current graphics state.
   *
   * @since 0.5.0
   */
  get graphics(): Readonly<GraphicsState> {
    return (
      this._integration?.graphics ?? {
        scale: 1,
        width: 320,
        height: 240,
      }
    );
  }

  /**
   * Current audio state.
   *
   * @since 0.5.0
   */
  get audio(): Readonly<AudioState> {
    return (
      this._integration?.audio ?? {
        masterVolume: 100,
        musicVolume: 80,
        sfxVolume: 100,
        muted: false,
      }
    );
  }

  /**
   * Current debug state.
   *
   * @since 0.5.0
   */
  get debug(): Readonly<DebugState> {
    return (
      this._integration?.debug ?? {
        showFps: false,
        showGraph: false,
        showMemory: false,
        showGrid: false,
        gridSize: 'none',
      }
    );
  }
}

// Re-export types for convenience
export type { AnyPalette, AudioState, DebugState, GraphicsState } from './MenuIntegration';
