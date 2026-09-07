/**
 * Main UI subsystem for the GameFoo engine.
 *
 * UISystem integrates the UI framework with the engine's subsystem architecture.
 * It manages the UI tree, theme, input routing, and focus management.
 *
 * @category UI
 * @module ui/UISystem
 * @since 0.5.0
 */

import { InputMapper } from '@/core/controls/input_mapper';
import { DEFAULT_CONTROLS } from '@/core/controls/schemes/default';
import type { ControlScheme } from '@/core/controls/types';
import type Engine from '@/core/engine';
import Input from '@/core/input';
import type { RenderContext } from '@/core/renderer/type';
import type { SubSystem } from '@/subsystems/types';
import FocusManager from './core/FocusManager';
import InputRouter from './core/InputRouter';
import type { UITheme } from './core/Theme';
import UIStateManager from './core/UIStateManager';
import type UIWidget from './core/UIWidget';

/**
 * UISystem configuration options.
 *
 * @since 0.5.0
 */
export interface UISystemConfig {
  /**
   * Initial theme
   */
  theme?: UITheme;
  /**
   * Whether to block game input when UI is active
   */
  blockGameInput?: boolean;
  /**
   * Control scheme for UI navigation (defaults to DEFAULT_CONTROLS)
   */
  controlScheme?: ControlScheme;
  /**
   * Disable horizontal focus navigation (when parent handles tab switching)
   */
  disableHorizontalNav?: boolean;
}

/**
 * Main UI subsystem that integrates with the GameFoo engine.
 *
 * @since 0.5.0
 *
 * @example Basic usage
 * ```ts
 * const uiSystem = new UISystem({ theme: myTheme });
 * engine.use(uiSystem);
 *
 * // Create UI
 * const panel = new Panel({ width: 200, height: 150 });
 * panel.addChild(new Button({ text: 'Click me' }));
 * uiSystem.setRoot(panel);
 *
 * // Show/hide
 * uiSystem.show();
 * uiSystem.hide();
 * ```
 */
export default class UISystem implements SubSystem {
  // ═══════════════════════════════════════════════════════════════════════════
  // SubSystem Implementation
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subsystem identifier
   */
  readonly id = 'ui';

  /**
   * Execution order (after game objects, before final render)
   */
  readonly order = 90;

  /**
   * Whether the subsystem is enabled
   */
  enabled: boolean = true;

  // ═══════════════════════════════════════════════════════════════════════════
  // Core Components
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Root widget of the UI tree
   */
  private _root: UIWidget | null = null;

  /**
   * Current theme
   */
  private _theme: UITheme | null = null;

  /**
   * State manager for focus/hover/pressed states
   */
  private _stateManager: UIStateManager;

  /**
   * Focus navigation manager
   */
  private _focusManager: FocusManager;

  /**
   * Input routing
   */
  private _inputRouter: InputRouter | null = null;

  /**
   * Engine reference
   */
  private _engine: Engine | null = null;

  /**
   * Input system reference
   */
  private _input: Input | null = null;

  /**
   * Input mapper for semantic action queries
   */
  private _inputMapper: InputMapper | null = null;

  /**
   * Control scheme for UI navigation
   */
  private _controlScheme: ControlScheme;

  /**
   * Whether UI is currently visible/active
   */
  private _visible: boolean = false;

  /**
   * Whether to block game input when UI is active
   */
  private _blockGameInput: boolean = true;

  /**
   * Disable horizontal navigation (when parent handles tab switching)
   */
  private _disableHorizontalNav: boolean = false;

  /**
   * Popup layer (for dropdowns, tooltips, etc.)
   */
  private _popupLayer: UIWidget[] = [];

  /**
   * Creates a new UISystem.
   *
   * @param config - Configuration options
   *
   * @since 0.5.0
   */
  constructor(config?: UISystemConfig) {
    this._stateManager = new UIStateManager();
    this._focusManager = new FocusManager(this._stateManager);
    this._controlScheme = config?.controlScheme ?? DEFAULT_CONTROLS;

    if (config?.theme) {
      this._theme = config.theme;
    }
    if (config?.blockGameInput !== undefined) {
      this._blockGameInput = config.blockGameInput;
    }
    if (config?.disableHorizontalNav !== undefined) {
      this._disableHorizontalNav = config.disableHorizontalNav;
    }
  }

  /**
   * Sets whether horizontal navigation is disabled.
   *
   * @param disabled - Whether to disable horizontal nav
   *
   * @since 0.5.0
   */
  setDisableHorizontalNav(disabled: boolean): void {
    this._disableHorizontalNav = disabled;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Accessors
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gets the state manager
   */
  get stateManager(): UIStateManager {
    return this._stateManager;
  }

  /**
   * Gets the focus manager
   */
  get focusManager(): FocusManager {
    return this._focusManager;
  }

  /**
   * Gets the input router
   */
  get inputRouter(): InputRouter | null {
    return this._inputRouter;
  }

  /**
   * Gets the current theme
   */
  get theme(): UITheme | null {
    return this._theme;
  }

  /**
   * Whether the UI is currently visible
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Whether the UI is active and receiving input
   */
  get isActive(): boolean {
    return this._visible && this.enabled && this._root !== null;
  }

  /**
   * Whether game input should be blocked
   */
  get shouldBlockGameInput(): boolean {
    return this._blockGameInput && this.isActive;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Theme Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the active theme.
   *
   * @param theme - Theme to set
   *
   * @since 0.5.0
   */
  setTheme(theme: UITheme): void {
    this._theme = theme;
    if (this._root) {
      this._root.setTheme(theme);
    }
  }

  /**
   * Gets the active theme.
   *
   * @returns The current theme
   * @throws Error if no theme is set
   *
   * @since 0.5.0
   */
  getTheme(): UITheme {
    if (!this._theme) {
      throw new Error('No theme set for UISystem');
    }
    return this._theme;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Root Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the root widget.
   *
   * @param root - Root widget
   *
   * @since 0.5.0
   */
  setRoot(root: UIWidget | null): void {
    if (this._root) {
      this._stateManager.onWidgetDestroyed(this._root);
      this._root.setStateManager(null);
    }

    this._root = root;

    if (root) {
      root.setStateManager(this._stateManager);
      if (this._theme) {
        root.setTheme(this._theme);
      }
    }

    this._focusManager.setRoot(root);
    if (this._inputRouter) {
      this._inputRouter.setRoot(root);
    }
  }

  /**
   * Gets the root widget.
   *
   * @returns The root widget or null
   *
   * @since 0.5.0
   */
  getRoot(): UIWidget | null {
    return this._root;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Visibility
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Shows the UI.
   *
   * @since 0.5.0
   */
  show(): void {
    this._visible = true;
    if (this._root) {
      // Force layout before focusing so visibility is set correctly
      this._root.layout();
      this._focusManager.focusFirst();
    }
  }

  /**
   * Hides the UI.
   *
   * @since 0.5.0
   */
  hide(): void {
    this._visible = false;
    this._stateManager.resetAll();
  }

  /**
   * Toggles UI visibility.
   *
   * @returns The new visibility state
   *
   * @since 0.5.0
   */
  toggle(): boolean {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
    return this._visible;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Popup Layer
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Adds a popup widget (rendered on top of everything).
   *
   * @param widget - Popup widget to add
   *
   * @since 0.5.0
   */
  addPopup(widget: UIWidget): void {
    if (this._theme) {
      widget.setTheme(this._theme);
    }
    this._popupLayer.push(widget);
  }

  /**
   * Removes a popup widget.
   *
   * @param widget - Popup widget to remove
   *
   * @since 0.5.0
   */
  removePopup(widget: UIWidget): void {
    const index = this._popupLayer.indexOf(widget);
    if (index !== -1) {
      this._popupLayer.splice(index, 1);
    }
  }

  /**
   * Clears all popup widgets.
   *
   * @since 0.5.0
   */
  clearPopups(): void {
    this._popupLayer = [];
  }

  /**
   * Sends a navigation direction to the focused widget.
   *
   * Used when a widget captures navigation (e.g., expanded dropdown).
   *
   * @param direction - Navigation direction
   *
   * @internal
   * @since 0.5.0
   */
  private sendNavigationToFocused(direction: 'up' | 'down'): void {
    const focused = this._stateManager.getFocused();
    if (
      focused &&
      'handleNavigation' in focused &&
      typeof focused.handleNavigation === 'function'
    ) {
      (focused as { handleNavigation: (dir: string) => void }).handleNavigation(direction);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Widget Lookup
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Finds a widget by ID.
   *
   * @param id - Widget ID to find
   * @returns The widget or null
   *
   * @since 0.5.0
   */
  findById(id: string): UIWidget | null {
    return this._root?.findById(id) ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SubSystem Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initializes the UI system.
   *
   * Automatically gets canvas and scale from the engine's renderer.
   *
   * @param engine - Engine instance
   *
   * @since 0.5.0
   */
  init(engine: Engine): void {
    this._engine = engine;

    // Get canvas element from the engine's render context
    const canvas = engine.renderer.getCanvas?.()?.canvas;
    const canvasId = canvas?.id;

    // Create Input with engine's canvas and scale settings
    this._input = new Input({
      canvasId: canvasId,
      gameScale: engine.gameScale,
    });

    // Create InputMapper with the control scheme
    this._inputMapper = new InputMapper(this._input, this._controlScheme);

    this._inputRouter = new InputRouter(this._input, this._stateManager, this._focusManager);
    if (this._root) {
      this._inputRouter.setRoot(this._root);
    }
  }

  /**
   * Gets the input mapper for semantic action queries.
   *
   * @returns The InputMapper instance
   *
   * @since 0.5.0
   */
  get inputMapper(): InputMapper | null {
    return this._inputMapper;
  }

  /**
   * Sets a new control scheme.
   *
   * @param scheme - The control scheme to use
   *
   * @since 0.5.0
   */
  setControlScheme(scheme: ControlScheme): void {
    this._controlScheme = scheme;
    if (this._input) {
      this._inputMapper = new InputMapper(this._input, scheme);
    }
  }

  /**
   * Pre-update hook - processes input.
   *
   * Uses InputMapper for semantic action-based navigation.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  preUpdate(_deltaTime: number): void {
    // Update input state for "just pressed" detection
    this._input?.update();

    if (!this.isActive) {
      return;
    }

    // Handle navigation using InputMapper (semantic actions)
    if (this._inputMapper) {
      // Check if focused widget wants to capture navigation (e.g., expanded dropdown)
      const focused = this._stateManager.getFocused();
      const captureNav = focused?.wantsCaptureNavigation() ?? false;

      // Vertical navigation (unless widget captures it)
      if (!captureNav) {
        if (this._inputMapper.isActionPressed('UP')) {
          this._focusManager.focusDirection('up');
        } else if (this._inputMapper.isActionPressed('DOWN')) {
          this._focusManager.focusDirection('down');
        }
      } else {
        // Forward navigation to the widget that wants to capture it
        if (this._inputMapper.isActionPressed('UP')) {
          this.sendNavigationToFocused('up');
        } else if (this._inputMapper.isActionPressed('DOWN')) {
          this.sendNavigationToFocused('down');
        }
      }

      // Horizontal navigation (can be disabled for menu tab switching)
      if (!this._disableHorizontalNav) {
        if (this._inputMapper.isActionPressed('LEFT')) {
          this._focusManager.focusDirection('left');
        } else if (this._inputMapper.isActionPressed('RIGHT')) {
          this._focusManager.focusDirection('right');
        }
      }

      // Action button activates focused widget
      if (this._inputMapper.isActionPressed('PRIMARY')) {
        if (focused && 'activate' in focused && typeof focused.activate === 'function') {
          (focused as { activate: () => void }).activate();
        }
      }

      // Secondary button for cancel/back
      if (this._inputMapper.isActionPressed('SECONDARY')) {
        // If focused widget captures navigation, let it handle cancel first
        if (captureNav && focused && 'cancel' in focused && typeof focused.cancel === 'function') {
          (focused as { cancel: () => void }).cancel();
        } else {
          // Otherwise clear popups
          this.clearPopups();
        }
      }
    }

    // Process mouse input through InputRouter
    if (this._inputRouter) {
      this._inputRouter.processInput();
    }
  }

  /**
   * Update hook - updates UI widgets.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  update(deltaTime: number): void {
    if (!this.isActive || !this._root) {
      return;
    }

    this._root.update(deltaTime);

    // Update popups
    for (const popup of this._popupLayer) {
      popup.update(deltaTime);
    }
  }

  /**
   * Render hook - renders UI widgets.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  render(ctx: RenderContext): void {
    if (!this.isActive || !this._root) {
      return;
    }

    // Render main UI tree
    this._root.render(ctx);

    // Render overlays (dropdowns, tooltips, etc.) on top of all widgets
    this._root.renderOverlay(ctx);

    // Render popups on top of everything
    for (const popup of this._popupLayer) {
      popup.render(ctx);
    }
  }

  /**
   * Destroys the UI system.
   *
   * @since 0.5.0
   */
  destroy(): void {
    if (this._root) {
      this._root.destroy();
      this._root = null;
    }

    this._stateManager.destroy();
    this._focusManager.destroy();
    this._inputRouter?.destroy();

    this._popupLayer = [];
    this._engine = null;
    this._input = null;
  }
}
