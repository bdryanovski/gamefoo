/**
 * Main menu system for the engine.
 *
 * @category UI
 * @module ui/menu/MenuSystem
 * @since 0.5.0
 */

import type { InputMapper } from '@/core/controls/input_mapper';
import { DEFAULT_CONTROLS } from '@/core/controls/schemes/default';
import type { ControlScheme } from '@/core/controls/types';
import type Engine from '@/core/engine';
import type Input from '@/core/input';
import { Bitmap } from '@/core/renderer/objects/bitmap';
import type { RenderContext } from '@/core/renderer/type';
import type { SubSystem } from '@/subsystems/types';
import Panel from '../containers/Panel';
import Tabs, { type TabPage } from '../containers/Tabs';
import type { UITheme } from '../core/Theme';
import { DEFAULT_THEME } from '../themes/DefaultTheme';
import UISystem from '../UISystem';
import type { IMenuPage } from './MenuPage';

/**
 * Creates a checkerboard dither pattern bitmap.
 * Pattern: alternating pixels in a 2x2 grid, creating 50% opacity effect.
 *
 * @param size - Size of the pattern (default 2x2)
 * @returns Bitmap with checkerboard pattern
 *
 * @internal
 */
function createDitherPattern(size: number = 2): Bitmap {
  // 2x2 checkerboard:
  // 10
  // 01
  const data: number[] = [];
  for (let row = 0; row < size; row++) {
    let rowBits = 0;
    for (let col = 0; col < size; col++) {
      // Checkerboard: (row + col) % 2 === 0
      if ((row + col) % 2 === 0) {
        rowBits |= 1 << (size - 1 - col);
      }
    }
    data.push(rowBits);
  }
  return new Bitmap('dither_pattern', data, { width: size, height: size });
}

/**
 * Menu system configuration.
 *
 * @since 0.5.0
 */
export interface MenuSystemConfig {
  /**
   * Menu width
   */
  width?: number;
  /**
   * Menu height
   */
  height?: number;
  /**
   * Theme to use
   */
  theme?: UITheme;
  /**
   * Action to toggle menu (default: 'MENU' which maps to Escape)
   */
  toggleAction?: string;
  /**
   * Initial pages
   */
  pages?: IMenuPage[];
  /**
   * Control scheme (defaults to DEFAULT_CONTROLS)
   */
  controlScheme?: ControlScheme;
  /**
   * Overlay color for dithered background (default: '#000000')
   */
  overlayColor?: string;
}

/**
 * Main menu system that manages menu pages.
 *
 * The menu system is implemented using the UI framework
 * with no special-case rendering logic.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const menuSystem = new MenuSystem({
 *   width: 280,
 *   height: 200,
 * });
 *
 * // Register default pages
 * menuSystem.registerPage(new ControlsPage());
 * menuSystem.registerPage(new AudioPage());
 *
 * // Add to engine
 * engine.use(menuSystem);
 *
 * // Toggle with key
 * if (input.isKeyPressed('Escape')) {
 *   menuSystem.toggle();
 * }
 * ```
 */
export default class MenuSystem implements SubSystem {
  // ═══════════════════════════════════════════════════════════════════════════
  // SubSystem Implementation
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subsystem identifier
   */
  readonly id = 'menu';

  /**
   * Execution order (after UI system)
   */
  readonly order = 95;

  /**
   * Whether the subsystem is enabled
   */
  enabled: boolean = true;

  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Menu width
   */
  private _width: number;

  /**
   * Menu height
   */
  private _height: number;

  /**
   * Toggle action (semantic action name)
   */
  private _toggleAction: string;

  /**
   * Control scheme
   */
  private _controlScheme: ControlScheme;

  /**
   * Theme
   */
  private _theme: UITheme;

  /**
   * Overlay color (for dither pattern)
   */
  private _overlayColor: string = '#000000';

  /**
   * Screen dimensions (for overlay)
   */
  private _screenWidth: number = 0;
  private _screenHeight: number = 0;

  /**
   * Dither pattern bitmap
   */
  private _ditherPattern: Bitmap;

  // ═══════════════════════════════════════════════════════════════════════════
  // Components
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Internal UI system
   */
  private _uiSystem: UISystem;

  /**
   * Main container panel
   */
  private _panel: Panel;

  /**
   * Tabs container
   */
  private _tabs: Tabs;

  /**
   * Registered pages
   */
  private _pages: Map<string, IMenuPage> = new Map();

  /**
   * Engine reference
   */
  private _engine: Engine | null = null;

  /**
   * Input reference
   */
  private _input: Input | null = null;

  /**
   * Input mapper for semantic actions
   */
  private _inputMapper: InputMapper | null = null;

  /**
   * Whether menu is visible
   */
  private _visible: boolean = false;

  /**
   * Creates a new MenuSystem.
   *
   * @param config - Configuration options
   *
   * @since 0.5.0
   */
  constructor(config: MenuSystemConfig = {}) {
    this._width = config.width ?? 280;
    this._height = config.height ?? 200;
    this._toggleAction = config.toggleAction ?? 'MENU';
    this._theme = config.theme ?? DEFAULT_THEME;
    this._controlScheme = config.controlScheme ?? DEFAULT_CONTROLS;

    // Create dither pattern for overlay
    this._ditherPattern = createDitherPattern(2);
    if (config.overlayColor) {
      this._overlayColor = config.overlayColor;
    }

    // Create UI system with control scheme
    // Disable horizontal nav - MenuSystem handles tab switching with LEFT/RIGHT
    this._uiSystem = new UISystem({
      theme: this._theme,
      controlScheme: this._controlScheme,
      disableHorizontalNav: true,
    });

    // Create main panel (no title, no padding - tabs fill entirely)
    this._panel = new Panel({
      id: 'menu_panel',
      width: this._width,
      height: this._height,
      padding: 0,
    });

    // Create tabs (fill the panel completely)
    this._tabs = new Tabs({
      id: 'menu_tabs',
      width: this._width,
      height: this._height,
    });

    this._panel.addChild(this._tabs);
    this._uiSystem.setRoot(this._panel);

    // Register initial pages
    if (config.pages) {
      for (const page of config.pages) {
        this.registerPage(page);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Accessors
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Whether menu is visible
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Menu width
   */
  get width(): number {
    return this._width;
  }

  /**
   * Menu height
   */
  get height(): number {
    return this._height;
  }

  /**
   * Number of registered pages
   */
  get pageCount(): number {
    return this._pages.size;
  }

  /**
   * Active page ID
   */
  get activePageId(): string | null {
    const activePage = this._tabs.activePage;
    return activePage?.id ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Visibility
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Shows the menu.
   *
   * @since 0.5.0
   */
  show(): void {
    this._visible = true;
    this._uiSystem.show();

    // Notify active page
    const activePage = this._tabs.activePage;
    if (activePage) {
      const page = this._pages.get(activePage.id);
      page?.onShow?.();
    }
  }

  /**
   * Hides the menu.
   *
   * @since 0.5.0
   */
  hide(): void {
    // Notify active page
    const activePage = this._tabs.activePage;
    if (activePage) {
      const page = this._pages.get(activePage.id);
      page?.onHide?.();
    }

    this._visible = false;
    this._uiSystem.hide();
  }

  /**
   * Toggles menu visibility.
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
  // Page Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Registers a menu page.
   *
   * @param page - Page to register
   *
   * @since 0.5.0
   */
  registerPage(page: IMenuPage): void {
    if (this._pages.has(page.id)) {
      console.warn(`Menu page "${page.id}" already registered, replacing...`);
    }

    this._pages.set(page.id, page);

    // Add to tabs
    this._tabs.addPage({
      id: page.id,
      title: page.title,
      content: page.root,
    });
  }

  /**
   * Unregisters a menu page.
   *
   * @param id - Page ID to remove
   *
   * @since 0.5.0
   */
  unregisterPage(id: string): void {
    const page = this._pages.get(id);
    if (!page) {
      return;
    }

    this._pages.delete(id);

    // Remove from tabs
    const index = this._tabs.pages.findIndex((p: TabPage) => p.id === id);
    if (index !== -1) {
      this._tabs.removePage(index);
    }
  }

  /**
   * Gets a registered page.
   *
   * @param id - Page ID
   *
   * @since 0.5.0
   */
  getPage(id: string): IMenuPage | null {
    return this._pages.get(id) ?? null;
  }

  /**
   * Switches to a specific page.
   *
   * @param id - Page ID
   * @returns True if page was found and switched to
   *
   * @since 0.5.0
   */
  switchToPage(id: string): boolean {
    const oldPage = this._tabs.activePage;
    if (oldPage) {
      const page = this._pages.get(oldPage.id);
      page?.onHide?.();
    }

    const success = this._tabs.switchTo(id);

    if (success) {
      const newPage = this._pages.get(id);
      newPage?.onShow?.();
    }

    return success;
  }

  /**
   * Switches to the previous tab.
   *
   * @returns True if switched
   *
   * @since 0.5.0
   */
  previousTab(): boolean {
    const currentIndex = this._tabs.activeIndex;
    if (currentIndex > 0) {
      const oldPage = this._tabs.activePage;
      if (oldPage) {
        this._pages.get(oldPage.id)?.onHide?.();
      }

      this._tabs.activeIndex = currentIndex - 1;

      const newPage = this._tabs.activePage;
      if (newPage) {
        this._pages.get(newPage.id)?.onShow?.();
      }
      return true;
    }
    return false;
  }

  /**
   * Switches to the next tab.
   *
   * @returns True if switched
   *
   * @since 0.5.0
   */
  nextTab(): boolean {
    const currentIndex = this._tabs.activeIndex;
    if (currentIndex < this._tabs.pageCount - 1) {
      const oldPage = this._tabs.activePage;
      if (oldPage) {
        this._pages.get(oldPage.id)?.onHide?.();
      }

      this._tabs.activeIndex = currentIndex + 1;

      const newPage = this._tabs.activePage;
      if (newPage) {
        this._pages.get(newPage.id)?.onShow?.();
      }
      return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Overlay
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the overlay color.
   *
   * @param color - Color string (hex or named color)
   *
   * @since 0.5.0
   */
  setOverlayColor(color: string): void {
    this._overlayColor = color;
  }

  /**
   * Gets the current overlay color.
   *
   * @returns Current overlay color
   *
   * @since 0.5.0
   */
  get overlayColor(): string {
    return this._overlayColor;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Positioning
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Centers the menu on screen.
   *
   * @param screenWidth - Screen width
   * @param screenHeight - Screen height
   *
   * @since 0.5.0
   */
  centerOnScreen(screenWidth: number, screenHeight: number): void {
    this._panel.x = Math.floor((screenWidth - this._width) / 2);
    this._panel.y = Math.floor((screenHeight - this._height) / 2);
    this._panel.markLayoutDirty();
  }

  /**
   * Sets the menu position.
   *
   * @param x - X position
   * @param y - Y position
   *
   * @since 0.5.0
   */
  setPosition(x: number, y: number): void {
    this._panel.x = x;
    this._panel.y = y;
    this._panel.markLayoutDirty();
  }

  /**
   * Resizes the menu to fit the new screen dimensions.
   *
   * The menu will be sized to fit within the screen with margins,
   * and will be re-centered automatically.
   *
   * @param screenWidth - New screen width
   * @param screenHeight - New screen height
   * @param margin - Margin from screen edges (default: 8)
   *
   * @since 0.5.0
   *
   * @example
   * ```ts
   * // After changing resolution
   * renderer.resize(160, 144);
   * engine.resize(160, 144);
   * menuSystem.resize(160, 144);
   * ```
   */
  resize(screenWidth: number, screenHeight: number, margin: number = 8): void {
    // Store new screen dimensions
    this._screenWidth = screenWidth;
    this._screenHeight = screenHeight;

    // Calculate available space
    const availableWidth = screenWidth - margin * 2;
    const availableHeight = screenHeight - margin * 2;

    // Calculate new menu size (fit within available space, but don't exceed original configured size)
    // For very small screens, use most of the available space
    // For larger screens, use the configured size or a reasonable maximum
    const maxMenuWidth = Math.min(this._width, availableWidth);
    const maxMenuHeight = Math.min(this._height, availableHeight);

    // Ensure minimum usable size (at least 80x60 for basic UI)
    const newWidth = Math.max(80, maxMenuWidth);
    const newHeight = Math.max(60, maxMenuHeight);

    // Update dimensions
    this._width = newWidth;
    this._height = newHeight;

    // Update panel and tabs sizes
    this._panel.width = newWidth;
    this._panel.height = newHeight;
    this._tabs.width = newWidth;
    this._tabs.height = newHeight;

    // Mark layout dirty to recalculate
    this._panel.markLayoutDirty();
    this._tabs.markLayoutDirty();

    // Re-center on screen
    this.centerOnScreen(screenWidth, screenHeight);
  }

  /**
   * Gets the current screen dimensions.
   *
   * @returns Screen width and height
   *
   * @since 0.5.0
   */
  get screenDimensions(): { width: number; height: number } {
    return { width: this._screenWidth, height: this._screenHeight };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Theme
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets the menu theme.
   *
   * @param theme - Theme to use
   *
   * @since 0.5.0
   */
  setTheme(theme: UITheme): void {
    this._theme = theme;
    this._uiSystem.setTheme(theme);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SubSystem Lifecycle
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Initializes the menu system.
   *
   * Automatically gets canvas and scale from the engine's renderer.
   *
   * @param engine - Engine instance
   *
   * @since 0.5.0
   */
  init(engine: Engine): void {
    this._engine = engine;

    // Initialize internal UI system (it will create Input and InputMapper)
    this._uiSystem.init(engine);

    // Use the UI system's input and mapper (don't create duplicates)
    this._input = (this._uiSystem as any)._input;
    this._inputMapper = this._uiSystem.inputMapper;

    // Store screen dimensions for overlay
    this._screenWidth = engine.dementions.width;
    this._screenHeight = engine.dementions.height;

    // Center menu on screen
    this.centerOnScreen(this._screenWidth, this._screenHeight);
  }

  /**
   * Pre-update - handles toggle key and menu navigation.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  preUpdate(deltaTime: number): void {
    // Let UISystem update input first
    this._uiSystem.preUpdate(deltaTime);

    // Check toggle action using InputMapper (semantic action)
    if (this._inputMapper?.isActionPressed(this._toggleAction)) {
      this.toggle();
    }

    // Handle menu-specific LEFT/RIGHT for tab switching when visible
    if (this._visible && this._inputMapper) {
      // Check if focused widget wants to capture horizontal navigation
      const focused = this._uiSystem.stateManager.getFocused();
      const captureHorizNav = focused?.wantsCaptureHorizontalNav() ?? false;

      if (captureHorizNav) {
        // Forward LEFT/RIGHT to the focused widget
        if (this._inputMapper.isActionPressed('LEFT')) {
          if (
            'handleHorizontalNav' in focused! &&
            typeof (focused as any).handleHorizontalNav === 'function'
          ) {
            (focused as any).handleHorizontalNav('left');
          }
        } else if (this._inputMapper.isActionPressed('RIGHT')) {
          if (
            'handleHorizontalNav' in focused! &&
            typeof (focused as any).handleHorizontalNav === 'function'
          ) {
            (focused as any).handleHorizontalNav('right');
          }
        }
      } else {
        // LEFT/RIGHT switches tabs when no widget captures them
        if (this._inputMapper.isActionPressed('LEFT')) {
          this.previousTab();
        } else if (this._inputMapper.isActionPressed('RIGHT')) {
          this.nextTab();
        }
      }
    }
  }

  /**
   * Update.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  update(deltaTime: number): void {
    if (this._visible) {
      this._uiSystem.update(deltaTime);
    }
  }

  /**
   * Render.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  render(ctx: RenderContext): void {
    if (this._visible) {
      // Draw dithered overlay to darken the background
      this.renderOverlay(ctx);

      // Draw the menu UI
      this._uiSystem.render(ctx);
    }
  }

  /**
   * Renders the dithered overlay pattern.
   *
   * Creates a semi-transparent checkerboard effect that dims
   * the game content behind the menu, keeping focus on the menu.
   *
   * @param ctx - Render context
   *
   * @internal
   * @since 0.5.0
   */
  private renderOverlay(ctx: RenderContext): void {
    const canvas = ctx.getCanvas?.();
    if (!canvas) {
      return;
    }

    const pattern = this._ditherPattern.render();
    if (!pattern) {
      return;
    }

    canvas.save();
    canvas.fillStyle = this._overlayColor;

    // Tile the 2x2 dither pattern across the entire screen
    const patternSize = 2;
    for (let patternY = 0; patternY < this._screenHeight; patternY += patternSize) {
      for (let patternX = 0; patternX < this._screenWidth; patternX += patternSize) {
        canvas.save();
        canvas.translate(patternX, patternY);
        canvas.fill(pattern);
        canvas.restore();
      }
    }

    canvas.restore();
  }

  /**
   * Destroys the menu system.
   *
   * @since 0.5.0
   */
  destroy(): void {
    this._uiSystem.destroy();
    this._pages.clear();
    this._engine = null;
    this._input = null;
  }
}
