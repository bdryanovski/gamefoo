/**
 * Dropdown widget for selecting from a list of options.
 *
 * @category UI
 * @module ui/controls/Dropdown
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UIMouseMoveEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Dropdown item.
 *
 * @since 0.5.0
 */
export interface DropdownItem {
  /** Display label */
  label: string;
  /** Optional value (defaults to label) */
  value?: string | number;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * Configuration for Dropdown.
 *
 * @since 0.5.0
 */
export interface DropdownConfig extends UIWidgetConfig {
  /** Dropdown items */
  items?: DropdownItem[];
  /** Selected index */
  selectedIndex?: number;
  /** Change callback */
  onChange?: (index: number, item: DropdownItem) => void;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Maximum visible items in popup */
  maxVisibleItems?: number;
}

/**
 * Dropdown widget for selecting from a list.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const dropdown = new Dropdown({
 *   items: [
 *     { label: 'Option 1', value: 1 },
 *     { label: 'Option 2', value: 2 },
 *     { label: 'Option 3', value: 3 },
 *   ],
 *   selectedIndex: 0,
 *   onChange: (index, item) => {
 *     console.log('Selected:', item.label);
 *   },
 * });
 * ```
 */
export default class Dropdown extends UIWidget {
  /** Dropdown items */
  protected _items: DropdownItem[] = [];

  /** Selected index */
  protected _selectedIndex: number = -1;

  /** Change callback */
  protected _onChange: ((index: number, item: DropdownItem) => void) | null =
    null;

  /** Placeholder text */
  protected _placeholder: string = 'Select...';

  /** Maximum visible items */
  protected _maxVisibleItems: number = 5;

  /** Whether dropdown is expanded */
  protected _expanded: boolean = false;

  /** Highlighted index in popup */
  protected _highlightedIndex: number = -1;

  /** Scroll offset for visible items */
  protected _scrollOffset: number = 0;

  /** Track if we were focused last frame */
  private _wasFocused: boolean = false;

  /**
   * Creates a new Dropdown.
   *
   * @param config - Dropdown configuration
   *
   * @since 0.5.0
   */
  constructor(config: DropdownConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 4,
    });
    if (config.items !== undefined) this._items = config.items;
    if (config.selectedIndex !== undefined)
      this._selectedIndex = config.selectedIndex;
    if (config.onChange !== undefined) this._onChange = config.onChange;
    if (config.placeholder !== undefined)
      this._placeholder = config.placeholder;
    if (config.maxVisibleItems !== undefined)
      this._maxVisibleItems = config.maxVisibleItems;

    this._highlightedIndex = this._selectedIndex;
  }

  /**
   * Update method - checks for focus loss.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  override update(deltaTime: number): void {
    super.update(deltaTime);

    // Close dropdown if we lost focus
    const isFocused = this.isFocused();
    if (this._wasFocused && !isFocused && this._expanded) {
      this.close();
    }
    this._wasFocused = isFocused;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Dropdown items */
  get items(): DropdownItem[] {
    return this._items;
  }

  set items(value: DropdownItem[]) {
    this._items = value;
    if (this._selectedIndex >= value.length) {
      this._selectedIndex = -1;
    }
    this.markLayoutDirty();
  }

  /** Selected index */
  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    if (
      value >= -1
      && value < this._items.length
      && this._selectedIndex !== value
    ) {
      this._selectedIndex = value;
      this._highlightedIndex = value;
      if (this._onChange && value >= 0) {
        this._onChange(value, this._items[value]!);
      }
    }
  }

  /** Selected item */
  get selectedItem(): DropdownItem | null {
    return this._selectedIndex >= 0
      ? (this._items[this._selectedIndex] ?? null)
      : null;
  }

  /** Whether expanded */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * When expanded, dropdown wants to capture UP/DOWN for internal navigation.
   *
   * @returns True when dropdown is expanded
   *
   * @since 0.5.0
   */
  override wantsCaptureNavigation(): boolean {
    return this._expanded;
  }

  /**
   * Truncates text to fit within available width, adding "..." if truncated.
   *
   * @param text - Text to truncate
   * @param maxWidth - Maximum width in pixels
   * @param font - Font to measure with
   * @returns Truncated text
   *
   * @internal
   * @since 0.5.0
   */
  private truncateText(
    text: string,
    maxWidth: number,
    font: { getTextWidth: (s: string) => number },
  ): string {
    if (font.getTextWidth(text) <= maxWidth) {
      return text;
    }

    const ellipsis = '..';
    const ellipsisWidth = font.getTextWidth(ellipsis);

    // Binary search for max length that fits
    let low = 0;
    let high = text.length;

    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      const truncated = text.substring(0, mid);
      if (font.getTextWidth(truncated) + ellipsisWidth <= maxWidth) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    if (low === 0) {
      return ellipsis;
    }

    return text.substring(0, low) + ellipsis;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Methods
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Opens the dropdown popup.
   *
   * @since 0.5.0
   */
  open(): void {
    this._expanded = true;
    this._highlightedIndex = this._selectedIndex >= 0 ? this._selectedIndex : 0;
    // Reset scroll to show highlighted item
    this._scrollOffset = 0;
    this.ensureHighlightedVisible();
  }

  /**
   * Closes the dropdown popup.
   *
   * @since 0.5.0
   */
  close(): void {
    this._expanded = false;
    this._scrollOffset = 0;
  }

  /**
   * Toggles the dropdown.
   *
   * @since 0.5.0
   */
  toggle(): void {
    if (this._expanded) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Activates the dropdown (called by UISystem on PRIMARY action).
   *
   * When closed, opens the dropdown.
   * When open, selects the highlighted item.
   *
   * @since 0.5.0
   */
  activate(): void {
    if (this._expanded) {
      this.selectHighlighted();
    } else {
      this.open();
    }
  }

  /**
   * Handles navigation when dropdown captures it (expanded state).
   *
   * @param direction - 'up' or 'down'
   *
   * @since 0.5.0
   */
  handleNavigation(direction: 'up' | 'down'): void {
    if (!this._expanded) return;

    if (direction === 'up') {
      this._highlightedIndex = Math.max(0, this._highlightedIndex - 1);
    } else if (direction === 'down') {
      this._highlightedIndex = Math.min(
        this._items.length - 1,
        this._highlightedIndex + 1,
      );
    }

    // Ensure highlighted item is visible by adjusting scroll offset
    this.ensureHighlightedVisible();
  }

  /**
   * Ensures the highlighted item is visible in the scroll view.
   *
   * @internal
   */
  private ensureHighlightedVisible(): void {
    if (this._highlightedIndex < this._scrollOffset) {
      // Highlighted item is above visible area
      this._scrollOffset = this._highlightedIndex;
    } else if (
      this._highlightedIndex
      >= this._scrollOffset + this._maxVisibleItems
    ) {
      // Highlighted item is below visible area
      this._scrollOffset = this._highlightedIndex - this._maxVisibleItems + 1;
    }
  }

  /**
   * Cancels the current operation (closes dropdown if expanded).
   *
   * @since 0.5.0
   */
  cancel(): void {
    if (this._expanded) {
      this.close();
    }
  }

  /**
   * Selects the currently highlighted item.
   *
   * @since 0.5.0
   */
  selectHighlighted(): void {
    if (
      this._highlightedIndex >= 0
      && this._highlightedIndex < this._items.length
    ) {
      const item = this._items[this._highlightedIndex];
      if (item && !item.disabled) {
        this.selectedIndex = this._highlightedIndex;
        this.close();
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
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;

      // Calculate width based on longest item
      let maxWidth = font.getTextWidth(this._placeholder);
      for (const item of this._items) {
        const itemWidth = font.getTextWidth(item.label);
        maxWidth = Math.max(maxWidth, itemWidth);
      }

      // Add space for arrow indicator
      const arrowWidth = 10;

      return {
        width: Math.max(
          this._width,
          this._padding.left + maxWidth + arrowWidth + this._padding.right,
        ),
        height: Math.max(
          this._height,
          this._padding.top + font.height + this._padding.bottom,
        ),
      };
    } catch {
      return { width: this._width || 80, height: this._height || 16 };
    }
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

    if (event.type === 'mouseup') {
      const mouseEvent = event as UIMouseButtonEvent;
      if (mouseEvent.button === 'left') {
        if (this._expanded) {
          // Check if clicked on an item
          const itemIndex = this.getItemIndexAtPoint(
            mouseEvent.x,
            mouseEvent.y,
          );
          if (itemIndex >= 0) {
            this._highlightedIndex = itemIndex;
            this.selectHighlighted();
          } else if (!this.containsPoint(mouseEvent.x, mouseEvent.y)) {
            this.close();
          }
        } else if (this.containsPoint(mouseEvent.x, mouseEvent.y)) {
          this.toggle();
        }
        event.consume();
        return true;
      }
    }

    if (event.type === 'mousemove' && this._expanded) {
      const mouseEvent = event as UIMouseMoveEvent;
      const itemIndex = this.getItemIndexAtPoint(mouseEvent.x, mouseEvent.y);
      if (itemIndex >= 0) {
        this._highlightedIndex = itemIndex;
      }
    }

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;

      if (this._expanded) {
        switch (keyEvent.key) {
          case 'ArrowUp':
            this._highlightedIndex = Math.max(0, this._highlightedIndex - 1);
            event.consume();
            return true;
          case 'ArrowDown':
            this._highlightedIndex = Math.min(
              this._items.length - 1,
              this._highlightedIndex + 1,
            );
            event.consume();
            return true;
          case 'Enter':
          case ' ':
            this.selectHighlighted();
            event.consume();
            return true;
          case 'Escape':
            this.close();
            event.consume();
            return true;
        }
      } else {
        switch (keyEvent.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            this.open();
            event.consume();
            return true;
        }
      }
    }

    return false;
  }

  /**
   * Gets the item index at a screen point.
   *
   * @internal
   */
  private getItemIndexAtPoint(x: number, y: number): number {
    if (!this._expanded) return -1;

    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;
      const itemHeight = font.height + 4;

      const popupX = this._absoluteX;
      const popupY = this._absoluteY + this._height;
      const popupHeight =
        Math.min(this._items.length, this._maxVisibleItems) * itemHeight;

      if (x < popupX || x >= popupX + this._width) return -1;
      if (y < popupY || y >= popupY + popupHeight) return -1;

      const relY = y - popupY;
      const index = Math.floor(relY / itemHeight);

      return index >= 0 && index < this._items.length ? index : -1;
    } catch {
      return -1;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the dropdown.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;
      const isFocused = this.isFocused();

      // Draw main button
      const bgColor = theme.colors['dropdown.background'];
      const borderColor = isFocused
        ? theme.colors['focus.ring']
        : theme.colors['dropdown.border'];
      const textColor = isFocused
        ? theme.colors['focus.ring']
        : theme.colors['label.text'];

      ctx.fillRect(0, 0, this._width, this._height, bgColor);
      ctx.strokeRect(0, 0, this._width, this._height, borderColor);

      // Draw focus border thicker
      if (isFocused) {
        ctx.strokeRect(1, 1, this._width - 2, this._height - 2, borderColor);
      }

      // Draw selected text or placeholder (truncated to fit)
      const rawText = this.selectedItem?.label ?? this._placeholder;
      const arrowSpace = 12; // Space for dropdown arrow
      const maxTextWidth =
        this._width - this._padding.left - this._padding.right - arrowSpace;
      const displayText = this.truncateText(rawText, maxTextWidth, font);
      const textX = this._padding.left;
      const textY = this._padding.top;

      const canvas = ctx.getCanvas?.();
      if (canvas) {
        canvas.fillStyle =
          this._selectedIndex < 0 ? theme.colors['label.textMuted'] : textColor;
        font.renderText(displayText, textX, textY, ctx);
      } else {
        ctx.drawText(displayText, textX, textY, textColor);
      }

      // Draw dropdown arrow
      const arrowX = this._width - this._padding.right - 6;
      const arrowY = (this._height - 4) / 2;
      ctx.fillRect(arrowX, arrowY, 6, 1, textColor);
      ctx.fillRect(arrowX + 1, arrowY + 1, 4, 1, textColor);
      ctx.fillRect(arrowX + 2, arrowY + 2, 2, 1, textColor);

      // Popup is rendered in renderOverlay() to appear on top of everything
    } catch {
      // Fallback rendering
      ctx.fillRect(0, 0, this._width, this._height, '#333333');
      ctx.strokeRect(0, 0, this._width, this._height, '#666666');

      const text = this.selectedItem?.label ?? this._placeholder;
      ctx.drawText(text, this._padding.left, this._padding.top, '#FFFFFF');
    }
  }

  /**
   * Renders the dropdown popup overlay.
   * Called after all widgets are rendered to ensure popup is on top.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  override renderOverlay(ctx: RenderContext): void {
    if (!this._visible || !this._expanded) return;

    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;
      const itemHeight = font.height + 4;

      const visibleCount = Math.min(this._items.length, this._maxVisibleItems);
      const popupHeight = visibleCount * itemHeight;

      // Calculate absolute position for popup
      const popupX = this._absoluteX;
      const popupY = this._absoluteY + this._height;

      // Draw popup background
      const bgColor = theme.colors['dropdown.background'];
      const borderColor = theme.colors['dropdown.border'];

      ctx.fillRect(popupX, popupY, this._width, popupHeight, bgColor);
      ctx.strokeRect(popupX, popupY, this._width, popupHeight, borderColor);

      // Draw scroll indicator if there are more items above
      if (this._scrollOffset > 0) {
        // Draw up arrow indicator
        const arrowY = popupY + 2;
        ctx.fillRect(
          popupX + this._width / 2 - 3,
          arrowY,
          6,
          1,
          theme.colors['label.textMuted'],
        );
        ctx.fillRect(
          popupX + this._width / 2 - 2,
          arrowY + 1,
          4,
          1,
          theme.colors['label.textMuted'],
        );
        ctx.fillRect(
          popupX + this._width / 2 - 1,
          arrowY + 2,
          2,
          1,
          theme.colors['label.textMuted'],
        );
      }

      // Draw visible items (with scroll offset)
      for (let i = 0; i < visibleCount; i++) {
        const itemIndex = i + this._scrollOffset;
        if (itemIndex >= this._items.length) break;

        const item = this._items[itemIndex]!;
        const itemY = popupY + i * itemHeight;

        // Highlight
        if (itemIndex === this._highlightedIndex) {
          ctx.fillRect(
            popupX + 1,
            itemY,
            this._width - 2,
            itemHeight,
            theme.colors['dropdown.itemHover'],
          );
        }

        // Text (truncated to fit popup width)
        const textColor = item.disabled
          ? theme.colors['label.textMuted']
          : theme.colors['label.text'];
        const maxItemTextWidth =
          this._width - this._padding.left - this._padding.right - 2;
        const itemText = this.truncateText(item.label, maxItemTextWidth, font);

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = textColor;
          font.renderText(
            itemText,
            popupX + this._padding.left,
            itemY + 2,
            ctx,
          );
        } else {
          ctx.drawText(
            itemText,
            popupX + this._padding.left,
            itemY + 2,
            textColor,
          );
        }
      }

      // Draw scroll indicator if there are more items below
      if (this._scrollOffset + visibleCount < this._items.length) {
        // Draw down arrow indicator
        const arrowY = popupY + popupHeight - 5;
        ctx.fillRect(
          popupX + this._width / 2 - 1,
          arrowY,
          2,
          1,
          theme.colors['label.textMuted'],
        );
        ctx.fillRect(
          popupX + this._width / 2 - 2,
          arrowY + 1,
          4,
          1,
          theme.colors['label.textMuted'],
        );
        ctx.fillRect(
          popupX + this._width / 2 - 3,
          arrowY + 2,
          6,
          1,
          theme.colors['label.textMuted'],
        );
      }
    } catch {
      // No fallback needed for popup
    }
  }
}
