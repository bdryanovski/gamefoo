/**
 * Tab container for switching between pages.
 *
 * @category UI
 * @module ui/containers/Tabs
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type {
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UISize,
} from '../core/types';
import type UIWidget from '../core/UIWidget';

/**
 * Tab page definition.
 *
 * @since 0.5.0
 */
export interface TabPage {
  /** Tab identifier */
  id: string;
  /** Tab title */
  title: string;
  /** Page content widget */
  content: UIWidget;
}

/**
 * Configuration for Tabs.
 *
 * @since 0.5.0
 */
export interface TabsConfig extends ContainerConfig {
  /** Tab pages */
  pages?: TabPage[];
  /** Active tab index */
  activeIndex?: number;
  /** Tab bar height */
  tabHeight?: number;
  /** Tab change callback */
  onChange?: (index: number, page: TabPage) => void;
}

/**
 * Tab container for page switching.
 *
 * Only the active page is rendered.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const tabs = new Tabs({
 *   pages: [
 *     { id: 'audio', title: 'Audio', content: audioPage },
 *     { id: 'video', title: 'Video', content: videoPage },
 *     { id: 'controls', title: 'Controls', content: controlsPage },
 *   ],
 *   activeIndex: 0,
 * });
 * ```
 */
export default class Tabs extends Container {
  /** Tab pages */
  protected _pages: TabPage[] = [];

  /** Active tab index */
  protected _activeIndex: number = 0;

  /** Tab bar height */
  protected _tabHeight: number = 16;

  /** Change callback */
  protected _onChange: ((index: number, page: TabPage) => void) | null = null;

  /** Cached tab widths */
  private _tabWidths: number[] = [];

  /**
   * Creates a new Tabs container.
   *
   * @param config - Tabs configuration
   *
   * @since 0.5.0
   */
  constructor(config: TabsConfig = {}) {
    super({
      ...config,
      padding: config.padding ?? 4,
      focusable: config.focusable ?? true,
    });
    if (config.pages !== undefined) this.setPages(config.pages);
    if (config.activeIndex !== undefined)
      this._activeIndex = config.activeIndex;
    if (config.tabHeight !== undefined) this._tabHeight = config.tabHeight;
    if (config.onChange !== undefined) this._onChange = config.onChange;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Tab pages */
  get pages(): readonly TabPage[] {
    return this._pages;
  }

  /** Active tab index */
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(value: number) {
    if (
      value >= 0
      && value < this._pages.length
      && this._activeIndex !== value
    ) {
      this._activeIndex = value;
      this.markLayoutDirty();

      if (this._onChange && this._pages[value]) {
        this._onChange(value, this._pages[value]);
      }
    }
  }

  /** Active page */
  get activePage(): TabPage | null {
    return this._pages[this._activeIndex] ?? null;
  }

  /** Number of pages */
  get pageCount(): number {
    return this._pages.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Page Management
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Sets all pages.
   *
   * @param pages - Tab pages
   *
   * @since 0.5.0
   */
  setPages(pages: TabPage[]): void {
    // Clear existing
    this._children = [];
    this._pages = pages;

    // Add page contents as children
    for (const page of pages) {
      this.addChild(page.content);
      page.content.visible = false;
    }

    // Show active page
    const activePage = this._pages[this._activeIndex];
    if (activePage) {
      activePage.content.visible = true;
    }

    this.updateTabWidths();
    this.markLayoutDirty();
  }

  /**
   * Adds a page.
   *
   * @param page - Tab page to add
   *
   * @since 0.5.0
   */
  addPage(page: TabPage): void {
    this._pages.push(page);
    this.addChild(page.content);
    page.content.visible = this._pages.length - 1 === this._activeIndex;
    this.updateTabWidths();
    this.markLayoutDirty();
  }

  /**
   * Removes a page by index.
   *
   * @param index - Page index
   *
   * @since 0.5.0
   */
  removePage(index: number): void {
    if (index < 0 || index >= this._pages.length) return;

    const page = this._pages[index]!;
    this.removeChild(page.content);
    this._pages.splice(index, 1);

    // Adjust active index
    if (this._activeIndex >= this._pages.length) {
      this._activeIndex = Math.max(0, this._pages.length - 1);
    }

    // Show new active page
    const newActivePage = this._pages[this._activeIndex];
    if (newActivePage) {
      newActivePage.content.visible = true;
    }

    this.updateTabWidths();
    this.markLayoutDirty();
  }

  /**
   * Gets page by ID.
   *
   * @param id - Page ID
   *
   * @since 0.5.0
   */
  getPageById(id: string): TabPage | null {
    return this._pages.find((p) => p.id === id) ?? null;
  }

  /**
   * Switches to a page by ID.
   *
   * @param id - Page ID
   *
   * @since 0.5.0
   */
  switchTo(id: string): boolean {
    const index = this._pages.findIndex((p) => p.id === id);
    if (index >= 0) {
      this.activeIndex = index;
      return true;
    }
    return false;
  }

  /**
   * Updates cached tab widths.
   *
   * @internal
   */
  private updateTabWidths(): void {
    this._tabWidths = [];
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;

      for (const page of this._pages) {
        this._tabWidths.push(font.getTextWidth(page.title) + 8);
      }
    } catch {
      for (const page of this._pages) {
        this._tabWidths.push(page.title.length * 6 + 8);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size.
   *
   * @since 0.5.0
   */
  override getPreferredSize(): UISize {
    // Find largest page content
    let maxWidth = 0;
    let maxHeight = 0;

    for (const page of this._pages) {
      const size = page.content.getPreferredSize();
      maxWidth = Math.max(maxWidth, size.width);
      maxHeight = Math.max(maxHeight, size.height);
    }

    // Add tab bar height
    return {
      width: Math.max(
        this._width,
        maxWidth + this._padding.left + this._padding.right,
      ),
      height: Math.max(
        this._height,
        this._tabHeight + maxHeight + this._padding.top + this._padding.bottom,
      ),
    };
  }

  /**
   * Layouts the active page content.
   *
   * @since 0.5.0
   */
  override layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent.absoluteX + this._x;
      this._absoluteY = this._parent.absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    // Update visibility and layout only active page
    for (let i = 0; i < this._pages.length; i++) {
      const page = this._pages[i]!;
      const isActive = i === this._activeIndex;

      page.content.visible = isActive;

      if (isActive) {
        // Position content below tab bar
        page.content.x = this._padding.left;
        page.content.y = this._tabHeight + this._padding.top;
        page.content.width =
          this._width - this._padding.left - this._padding.right;
        page.content.height =
          this._height
          - this._tabHeight
          - this._padding.top
          - this._padding.bottom;
        page.content.layout();
      }
    }

    this._layoutDirty = false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Events
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handles input events.
   *
   * @param event - Input event
   * @returns True if consumed
   *
   * @since 0.5.0
   */
  override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) return false;

    // Note: Mouse interaction removed - tabs are keyboard-only
    // Tab switching is handled by parent (MenuSystem) via LEFT/RIGHT actions

    // Forward events to active page content
    const activePage = this.activePage;
    if (activePage) {
      return activePage.content.handleEvent(event);
    }

    return false;
  }

  /**
   * Gets the tab index at a screen point.
   *
   * @internal
   */
  private getTabIndexAtPoint(x: number, y: number): number {
    // Check if in tab bar
    if (
      y < this._absoluteY
      || y >= this._absoluteY + this._tabHeight
      || x < this._absoluteX
      || x >= this._absoluteX + this._width
    ) {
      return -1;
    }

    // Find which tab
    let tabX = this._absoluteX + this._padding.left;
    for (let i = 0; i < this._pages.length; i++) {
      const tabWidth = this._tabWidths[i] ?? 40;
      if (x >= tabX && x < tabX + tabWidth) {
        return i;
      }
      tabX += tabWidth;
    }

    return -1;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the tabs.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected override drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;

      // Draw tab bar background
      ctx.fillRect(
        0,
        0,
        this._width,
        this._tabHeight,
        theme.colors['tabs.background'],
      );

      // Draw tabs
      let tabX = this._padding.left;
      for (let i = 0; i < this._pages.length; i++) {
        const page = this._pages[i]!;
        const tabWidth = this._tabWidths[i] ?? 40;
        const isActive = i === this._activeIndex;

        // Tab background
        const tabBg = isActive
          ? theme.colors['tabs.activeBackground']
          : theme.colors['tabs.background'];
        ctx.fillRect(tabX, 0, tabWidth, this._tabHeight, tabBg);

        // Tab text
        const textColor = isActive
          ? theme.colors['tabs.activeText']
          : theme.colors['tabs.text'];
        const textX = tabX + 4;
        const textY = (this._tabHeight - font.height) / 2;

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = textColor;
          font.renderText(page.title, textX, textY, ctx);
        } else {
          ctx.drawText(page.title, textX, textY, textColor);
        }

        // Tab border (right side)
        ctx.fillRect(
          tabX + tabWidth - 1,
          0,
          1,
          this._tabHeight,
          theme.colors['tabs.border'],
        );

        tabX += tabWidth;
      }

      // Draw bottom border of tab bar
      ctx.fillRect(
        0,
        this._tabHeight - 1,
        this._width,
        1,
        theme.colors['tabs.border'],
      );
    } catch {
      // Fallback rendering - just tab bar
      ctx.fillRect(0, 0, this._width, this._tabHeight, '#222222');

      let tabX = this._padding.left;
      for (let i = 0; i < this._pages.length; i++) {
        const page = this._pages[i]!;
        const tabWidth = this._tabWidths[i] ?? 40;
        const isActive = i === this._activeIndex;

        ctx.fillRect(
          tabX,
          0,
          tabWidth,
          this._tabHeight,
          isActive ? '#333333' : '#222222',
        );
        ctx.drawText(page.title, tabX + 4, 4, isActive ? '#FFFFFF' : '#888888');
        tabX += tabWidth;
      }
    }
  }
}
