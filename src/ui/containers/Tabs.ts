/**
 * Tab container for switching between pages.
 *
 * @category UI
 * @module ui/containers/Tabs
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';
import type { UIInputEvent, UISize } from '../core/types';
import type UIWidget from '../core/UIWidget';

/**
 * Tab page definition.
 *
 * @since 0.5.0
 */
export interface TabPage {
  /**
   * Tab identifier
   */
  id: string;
  /**
   * Tab title
   */
  title: string;
  /**
   * Page content widget
   */
  content: UIWidget;
}

/**
 * Configuration for Tabs.
 *
 * @since 0.5.0
 */
export interface TabsConfig extends ContainerConfig {
  /**
   * Tab pages
   */
  pages?: TabPage[];
  /**
   * Active tab index
   */
  activeIndex?: number;
  /**
   * Tab bar height
   */
  tabHeight?: number;
  /**
   * Tab change callback
   */
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
  /**
   * Tab pages
   */
  protected _pages: TabPage[] = [];

  /**
   * Active tab index
   */
  protected _activeIndex: number = 0;

  /**
   * Tab bar height
   */
  protected _tabHeight: number = 16;

  /**
   * Change callback
   */
  protected _onChange: ((index: number, page: TabPage) => void) | null = null;

  /**
   * Cached tab widths
   */
  private _tabWidths: number[] = [];

  /**
   * Whether to use abbreviated (first letter) titles.
   * Automatically enabled when full titles don't fit.
   *
   * @since 0.5.0
   */
  private _useAbbreviatedTitles: boolean = false;

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
    if (config.pages !== undefined) {
      this.setPages(config.pages);
    }
    if (config.activeIndex !== undefined) {
      this._activeIndex = config.activeIndex;
    }
    if (config.tabHeight !== undefined) {
      this._tabHeight = config.tabHeight;
    }
    if (config.onChange !== undefined) {
      this._onChange = config.onChange;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Tab pages
   */
  public get pages(): readonly TabPage[] {
    return this._pages;
  }

  /**
   * Active tab index
   */
  public get activeIndex(): number {
    return this._activeIndex;
  }

  public set activeIndex(value: number) {
    if (value >= 0 && value < this._pages.length && this._activeIndex !== value) {
      this._activeIndex = value;
      this.markLayoutDirty();

      if (this._onChange && this._pages[value]) {
        this._onChange(value, this._pages[value]);
      }
    }
  }

  /**
   * Active page
   */
  public get activePage(): TabPage | null {
    return this._pages[this._activeIndex] ?? null;
  }

  /**
   * Number of pages
   */
  public get pageCount(): number {
    return this._pages.length;
  }

  /**
   * Sets the width and recalculates tab widths.
   *
   * @since 0.5.0
   */
  public override set width(value: number) {
    if (this._width !== value) {
      this._width = value;
      this.updateTabWidths();
      this.markLayoutDirty();
    }
  }

  public override get width(): number {
    return this._width;
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
  public setPages(pages: TabPage[]): void {
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
  public addPage(page: TabPage): void {
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
  public removePage(index: number): void {
    if (index < 0 || index >= this._pages.length) {
      return;
    }

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
  public getPageById(id: string): TabPage | null {
    return this._pages.find((p) => p.id === id) ?? null;
  }

  /**
   * Switches to a page by ID.
   *
   * @param id - Page ID
   *
   * @since 0.5.0
   */
  public switchTo(id: string): boolean {
    const index = this._pages.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.activeIndex = index;
      return true;
    }
    return false;
  }

  /**
   * Updates tab widths based on text size and available space.
   * Will use abbreviated titles (first letter) if full titles don't fit.
   *
   * @internal
   * @since 0.5.0
   */
  private updateTabWidths(): void {
    this._tabWidths = [];
    this._useAbbreviatedTitles = false;

    if (this._pages.length === 0) {
      return;
    }

    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;

      // Calculate full title widths
      const fullWidths: number[] = [];
      let totalFullWidth = 0;
      for (const page of this._pages) {
        const w = font.getTextWidth(page.title) + 8;
        fullWidths.push(w);
        totalFullWidth += w;
      }

      // Calculate abbreviated title widths (first letter only)
      const abbrevWidths: number[] = [];
      let totalAbbrevWidth = 0;
      for (const page of this._pages) {
        const firstLetter = page.title.charAt(0).toUpperCase();
        const w = font.getTextWidth(firstLetter) + 8;
        abbrevWidths.push(w);
        totalAbbrevWidth += w;
      }

      // Available width for tabs
      const availableWidth = this._width - this._padding.left - this._padding.right;

      // Use abbreviated titles if full titles don't fit
      if (totalFullWidth > availableWidth && totalAbbrevWidth <= availableWidth) {
        this._useAbbreviatedTitles = true;
        this._tabWidths = abbrevWidths;
      } else if (totalFullWidth > availableWidth) {
        // Even abbreviated don't fit - use equal widths
        this._useAbbreviatedTitles = true;
        const equalWidth = Math.floor(availableWidth / this._pages.length);
        this._tabWidths = this._pages.map(() => Math.max(equalWidth, 10));
      } else {
        this._tabWidths = fullWidths;
      }
    } catch {
      // Fallback: simple calculation
      const availableWidth = this._width - this._padding.left - this._padding.right;
      const fullWidths = this._pages.map((p) => p.title.length * 6 + 8);
      const totalFullWidth = fullWidths.reduce((a, b) => a + b, 0);

      if (totalFullWidth > availableWidth) {
        this._useAbbreviatedTitles = true;
        const equalWidth = Math.floor(availableWidth / this._pages.length);
        this._tabWidths = this._pages.map(() => Math.max(equalWidth, 10));
      } else {
        this._tabWidths = fullWidths;
      }
    }
  }

  /**
   * Gets the display title for a tab (full or abbreviated).
   *
   * @param page - Tab page
   * @returns Display title
   *
   * @internal
   * @since 0.5.0
   */
  private getDisplayTitle(page: TabPage): string {
    if (this._useAbbreviatedTitles) {
      return page.title.charAt(0).toUpperCase();
    }
    return page.title;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calculates preferred size.
   *
   * @since 0.5.0
   */
  public override getPreferredSize(): UISize {
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
      width: Math.max(this._width, maxWidth + this._padding.left + this._padding.right),
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
  public override layout(): void {
    // Calculate absolute position
    if (this._parent) {
      this._absoluteX = this._parent.absoluteX + this._x;
      this._absoluteY = this._parent.absoluteY + this._y;
    } else {
      this._absoluteX = this._x;
      this._absoluteY = this._y;
    }

    // Update visibility and layout only active page
    for (let pageIndex = 0; pageIndex < this._pages.length; pageIndex += 1) {
      const page = this._pages[pageIndex]!;
      const isActive = pageIndex === this._activeIndex;

      page.content.visible = isActive;

      if (isActive) {
        // Position content below tab bar
        page.content.x = this._padding.left;
        page.content.y = this._tabHeight + this._padding.top;
        page.content.width = this._width - this._padding.left - this._padding.right;
        page.content.height =
          this._height - this._tabHeight - this._padding.top - this._padding.bottom;
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
  public override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }

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
      y < this._absoluteY ||
      y >= this._absoluteY + this._tabHeight ||
      x < this._absoluteX ||
      x >= this._absoluteX + this._width
    ) {
      return -1;
    }

    // Find which tab
    let tabX = this._absoluteX + this._padding.left;
    for (let pageIndex = 0; pageIndex < this._pages.length; pageIndex += 1) {
      const tabWidth = this._tabWidths[pageIndex] ?? 40;
      if (x >= tabX && x < tabX + tabWidth) {
        return pageIndex;
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
      ctx.fillRect(0, 0, this._width, this._tabHeight, theme.colors['tabs.background']);

      // Draw tabs
      let tabX = this._padding.left;
      for (let pageIndex = 0; pageIndex < this._pages.length; pageIndex += 1) {
        const page = this._pages[pageIndex]!;
        const tabWidth = this._tabWidths[pageIndex] ?? 40;
        const isActive = pageIndex === this._activeIndex;
        const displayTitle = this.getDisplayTitle(page);

        // Tab background
        const tabBg = isActive
          ? theme.colors['tabs.activeBackground']
          : theme.colors['tabs.background'];
        ctx.fillRect(tabX, 0, tabWidth, this._tabHeight, tabBg);

        // Tab text (centered if abbreviated)
        const textColor = isActive ? theme.colors['tabs.activeText'] : theme.colors['tabs.text'];
        const textWidth = font.getTextWidth(displayTitle);
        const textX = this._useAbbreviatedTitles ? tabX + (tabWidth - textWidth) / 2 : tabX + 4;
        const textY = (this._tabHeight - font.height) / 2;

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = textColor;
          font.renderText(displayTitle, textX, textY, ctx);
        } else {
          ctx.drawText(displayTitle, textX, textY, textColor);
        }

        // Tab border (right side)
        ctx.fillRect(tabX + tabWidth - 1, 0, 1, this._tabHeight, theme.colors['tabs.border']);

        tabX += tabWidth;
      }

      // Draw bottom border of tab bar
      ctx.fillRect(0, this._tabHeight - 1, this._width, 1, theme.colors['tabs.border']);
    } catch {
      // Fallback rendering - just tab bar
      ctx.fillRect(0, 0, this._width, this._tabHeight, '#222222');

      let tabX = this._padding.left;
      for (let pageIndex = 0; pageIndex < this._pages.length; pageIndex += 1) {
        const page = this._pages[pageIndex]!;
        const tabWidth = this._tabWidths[pageIndex] ?? 40;
        const isActive = pageIndex === this._activeIndex;
        const displayTitle = this.getDisplayTitle(page);

        ctx.fillRect(tabX, 0, tabWidth, this._tabHeight, isActive ? '#333333' : '#222222');
        ctx.drawText(displayTitle, tabX + 4, 4, isActive ? '#FFFFFF' : '#888888');
        tabX += tabWidth;
      }
    }
  }
}
