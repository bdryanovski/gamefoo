/**
 * Text input widget for keyboard entry.
 *
 * @category UI
 * @module ui/controls/TextInput
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  UICharInputEvent,
  UIInputEvent,
  UIKeyEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for TextInput.
 *
 * @since 0.5.0
 */
export interface TextInputConfig extends UIWidgetConfig {
  /** Current text value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum length */
  maxLength?: number;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Submit callback (on Enter) */
  onSubmit?: (value: string) => void;
  /** Password mode (masks characters) */
  password?: boolean;
}

/**
 * Text input widget for keyboard entry.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const input = new TextInput({
 *   placeholder: 'Enter name...',
 *   maxLength: 20,
 *   onChange: (value) => {
 *     playerName = value;
 *   },
 * });
 * ```
 */
export default class TextInput extends UIWidget {
  /** Current text value */
  protected _value: string = '';

  /** Placeholder text */
  protected _placeholder: string = '';

  /** Maximum length */
  protected _maxLength: number = 256;

  /** Change callback */
  protected _onChange: ((value: string) => void) | null = null;

  /** Submit callback */
  protected _onSubmit: ((value: string) => void) | null = null;

  /** Password mode */
  protected _password: boolean = false;

  /** Cursor position */
  protected _cursorPosition: number = 0;

  /** Selection start (-1 if no selection) */
  protected _selectionStart: number = -1;

  /** Cursor blink timer */
  protected _cursorBlinkTime: number = 0;

  /** Cursor visible state */
  protected _cursorVisible: boolean = true;

  /** Cursor blink interval in seconds */
  private readonly CURSOR_BLINK_INTERVAL = 0.5;

  /**
   * Creates a new TextInput.
   *
   * @param config - TextInput configuration
   *
   * @since 0.5.0
   */
  constructor(config: TextInputConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 4,
    });
    if (config.value !== undefined) {
      this._value = config.value;
      this._cursorPosition = config.value.length;
    }
    if (config.placeholder !== undefined)
      this._placeholder = config.placeholder;
    if (config.maxLength !== undefined) this._maxLength = config.maxLength;
    if (config.onChange !== undefined) this._onChange = config.onChange;
    if (config.onSubmit !== undefined) this._onSubmit = config.onSubmit;
    if (config.password !== undefined) this._password = config.password;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Current text value */
  get value(): string {
    return this._value;
  }

  set value(val: string) {
    const newValue = val.slice(0, this._maxLength);
    if (this._value !== newValue) {
      this._value = newValue;
      this._cursorPosition = Math.min(this._cursorPosition, newValue.length);
      if (this._onChange) {
        this._onChange(newValue);
      }
    }
  }

  /** Placeholder text */
  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
  }

  /** Maximum length */
  get maxLength(): number {
    return this._maxLength;
  }

  set maxLength(value: number) {
    this._maxLength = value;
    if (this._value.length > value) {
      this.value = this._value.slice(0, value);
    }
  }

  /** Password mode */
  get password(): boolean {
    return this._password;
  }

  set password(value: boolean) {
    this._password = value;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Text Manipulation
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Inserts text at cursor position.
   *
   * @param text - Text to insert
   *
   * @since 0.5.0
   */
  insertText(text: string): void {
    if (this._selectionStart >= 0) {
      // Replace selection
      const start = Math.min(this._selectionStart, this._cursorPosition);
      const end = Math.max(this._selectionStart, this._cursorPosition);
      this.value = this._value.slice(0, start) + text + this._value.slice(end);
      this._cursorPosition = start + text.length;
      this._selectionStart = -1;
    } else {
      // Insert at cursor
      if (this._value.length + text.length <= this._maxLength) {
        this.value =
          this._value.slice(0, this._cursorPosition)
          + text
          + this._value.slice(this._cursorPosition);
        this._cursorPosition += text.length;
      }
    }
    this.resetCursorBlink();
  }

  /**
   * Deletes character(s).
   *
   * @param direction - 'backward' or 'forward'
   *
   * @since 0.5.0
   */
  deleteText(direction: 'backward' | 'forward'): void {
    if (this._selectionStart >= 0) {
      // Delete selection
      const start = Math.min(this._selectionStart, this._cursorPosition);
      const end = Math.max(this._selectionStart, this._cursorPosition);
      this.value = this._value.slice(0, start) + this._value.slice(end);
      this._cursorPosition = start;
      this._selectionStart = -1;
    } else if (direction === 'backward' && this._cursorPosition > 0) {
      this.value =
        this._value.slice(0, this._cursorPosition - 1)
        + this._value.slice(this._cursorPosition);
      this._cursorPosition--;
    } else if (
      direction === 'forward'
      && this._cursorPosition < this._value.length
    ) {
      this.value =
        this._value.slice(0, this._cursorPosition)
        + this._value.slice(this._cursorPosition + 1);
    }
    this.resetCursorBlink();
  }

  /**
   * Moves cursor.
   *
   * @param direction - Direction to move
   * @param select - Whether to extend selection
   *
   * @since 0.5.0
   */
  moveCursor(
    direction: 'left' | 'right' | 'home' | 'end',
    select: boolean = false,
  ): void {
    if (select && this._selectionStart < 0) {
      this._selectionStart = this._cursorPosition;
    } else if (!select) {
      this._selectionStart = -1;
    }

    switch (direction) {
      case 'left':
        this._cursorPosition = Math.max(0, this._cursorPosition - 1);
        break;
      case 'right':
        this._cursorPosition = Math.min(
          this._value.length,
          this._cursorPosition + 1,
        );
        break;
      case 'home':
        this._cursorPosition = 0;
        break;
      case 'end':
        this._cursorPosition = this._value.length;
        break;
    }
    this.resetCursorBlink();
  }

  /**
   * Selects all text.
   *
   * @since 0.5.0
   */
  selectAll(): void {
    this._selectionStart = 0;
    this._cursorPosition = this._value.length;
  }

  /**
   * Resets cursor blink timer.
   *
   * @internal
   */
  private resetCursorBlink(): void {
    this._cursorBlinkTime = 0;
    this._cursorVisible = true;
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

      return {
        width: Math.max(this._width, 60),
        height: Math.max(
          this._height,
          this._padding.top + font.height + this._padding.bottom,
        ),
      };
    } catch {
      return { width: this._width || 60, height: this._height || 16 };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Update
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates cursor blink.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  override update(deltaTime: number): void {
    super.update(deltaTime);

    // Update cursor blink
    this._cursorBlinkTime += deltaTime;
    if (this._cursorBlinkTime >= this.CURSOR_BLINK_INTERVAL) {
      this._cursorBlinkTime -= this.CURSOR_BLINK_INTERVAL;
      this._cursorVisible = !this._cursorVisible;
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

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;
      return this.handleKeyDown(keyEvent);
    }

    if (event.type === 'charinput') {
      const charEvent = event as UICharInputEvent;
      this.insertText(charEvent.char);
      event.consume();
      return true;
    }

    return false;
  }

  /**
   * Handles key down events.
   *
   * @internal
   */
  private handleKeyDown(event: UIKeyEvent): boolean {
    switch (event.key) {
      case 'Backspace':
        this.deleteText('backward');
        event.consume();
        return true;

      case 'Delete':
        this.deleteText('forward');
        event.consume();
        return true;

      case 'ArrowLeft':
        this.moveCursor('left', event.shift);
        event.consume();
        return true;

      case 'ArrowRight':
        this.moveCursor('right', event.shift);
        event.consume();
        return true;

      case 'Home':
        this.moveCursor('home', event.shift);
        event.consume();
        return true;

      case 'End':
        this.moveCursor('end', event.shift);
        event.consume();
        return true;

      case 'Enter':
        if (this._onSubmit) {
          this._onSubmit(this._value);
        }
        event.consume();
        return true;

      case 'a':
        if (event.ctrl || event.meta) {
          this.selectAll();
          event.consume();
          return true;
        }
        // Fall through to default character input
        break;

      default:
        // Handle printable characters
        if (event.key.length === 1 && !event.ctrl && !event.meta) {
          this.insertText(event.key);
          event.consume();
          return true;
        }
        break;
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the text input.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();
      const font = theme.fonts.default;

      // Draw background
      ctx.fillRect(
        0,
        0,
        this._width,
        this._height,
        theme.colors['input.background'],
      );
      ctx.strokeRect(
        0,
        0,
        this._width,
        this._height,
        theme.colors['input.border'],
      );

      const textX = this._padding.left;
      const textY = this._padding.top;

      // Draw selection if any
      if (this._selectionStart >= 0) {
        const start = Math.min(this._selectionStart, this._cursorPosition);
        const end = Math.max(this._selectionStart, this._cursorPosition);
        const selStartX =
          textX + font.getTextWidth(this.getDisplayText().slice(0, start));
        const selWidth = font.getTextWidth(
          this.getDisplayText().slice(start, end),
        );

        ctx.fillRect(
          selStartX,
          textY,
          selWidth,
          font.height,
          theme.colors['input.selection'],
        );
      }

      // Draw text or placeholder
      const displayText = this.getDisplayText();
      const canvas = ctx.getCanvas?.();

      if (displayText) {
        if (canvas) {
          canvas.fillStyle = theme.colors['input.text'];
          font.renderText(displayText, textX, textY, ctx);
        } else {
          ctx.drawText(displayText, textX, textY, theme.colors['input.text']);
        }
      } else if (this._placeholder) {
        if (canvas) {
          canvas.fillStyle = theme.colors['input.placeholder'];
          font.renderText(this._placeholder, textX, textY, ctx);
        } else {
          ctx.drawText(
            this._placeholder,
            textX,
            textY,
            theme.colors['input.placeholder'],
          );
        }
      }

      // Draw cursor (when focused and visible)
      if (this._cursorVisible) {
        const cursorX =
          textX + font.getTextWidth(displayText.slice(0, this._cursorPosition));
        ctx.fillRect(
          cursorX,
          textY,
          1,
          font.height,
          theme.colors['input.caret'],
        );
      }
    } catch {
      // Fallback rendering
      ctx.fillRect(0, 0, this._width, this._height, '#222222');
      ctx.strokeRect(0, 0, this._width, this._height, '#666666');

      const text = this._value || this._placeholder;
      ctx.drawText(
        text,
        this._padding.left,
        this._padding.top,
        this._value ? '#FFFFFF' : '#888888',
      );
    }
  }

  /**
   * Gets the display text (masked for password mode).
   *
   * @internal
   */
  private getDisplayText(): string {
    if (this._password) {
      return '*'.repeat(this._value.length);
    }
    return this._value;
  }
}
