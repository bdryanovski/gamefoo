/**
 * Key binding widget for capturing and displaying key/gamepad bindings.
 *
 * @category UI
 * @module ui/controls/KeyBinding
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import type {
  UIInputEvent,
  UIKeyEvent,
  UIMouseButtonEvent,
  UISize,
} from '../core/types';
import UIWidget, { type UIWidgetConfig } from '../core/UIWidget';

/**
 * Configuration for KeyBinding.
 *
 * @since 0.5.0
 */
export interface KeyBindingConfig extends UIWidgetConfig {
  /** Action label */
  label?: string;
  /** Current binding display text */
  binding?: string;
  /** Change callback */
  onChange?: (key: string) => void;
  /** Gap between label and binding */
  gap?: number;
  /** Binding display width */
  bindingWidth?: number;
}

/**
 * Key binding widget for capturing keyboard/gamepad input.
 *
 * Click or press Enter to enter capture mode, then press a key to bind.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const jumpBinding = new KeyBinding({
 *   label: 'Jump',
 *   binding: 'SPACE',
 *   onChange: (key) => {
 *     controls.rebind('jump', key);
 *   },
 * });
 * ```
 */
export default class KeyBinding extends UIWidget {
  /** Action label */
  protected _label: string = '';

  /** Current binding display text */
  protected _binding: string = '';

  /** Change callback */
  protected _onChange: ((key: string) => void) | null = null;

  /** Gap between label and binding */
  protected _gap: number = 10;

  /** Binding display width */
  protected _bindingWidth: number = 60;

  /** Whether in capture mode */
  protected _capturing: boolean = false;

  /** Blink timer for capture mode */
  protected _blinkTimer: number = 0;

  /** Blink state */
  protected _blinkVisible: boolean = true;

  /** Keys to ignore for capture (modifiers) */
  private static readonly IGNORE_KEYS = new Set([
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'CapsLock',
    'NumLock',
    'ScrollLock',
  ]);

  /**
   * Creates a new KeyBinding.
   *
   * @param config - KeyBinding configuration
   *
   * @since 0.5.0
   */
  constructor(config: KeyBindingConfig = {}) {
    super({
      ...config,
      focusable: config.focusable ?? true,
      padding: config.padding ?? 4,
    });
    if (config.label !== undefined) this._label = config.label;
    if (config.binding !== undefined) this._binding = config.binding;
    if (config.onChange !== undefined) this._onChange = config.onChange;
    if (config.gap !== undefined) this._gap = config.gap;
    if (config.bindingWidth !== undefined)
      this._bindingWidth = config.bindingWidth;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /** Action label */
  get label(): string {
    return this._label;
  }

  set label(value: string) {
    if (this._label !== value) {
      this._label = value;
      this.markLayoutDirty();
    }
  }

  /** Current binding */
  get binding(): string {
    return this._binding;
  }

  set binding(value: string) {
    if (this._binding !== value) {
      this._binding = value;
      if (this._onChange) {
        this._onChange(value);
      }
    }
  }

  /** Whether in capture mode */
  get capturing(): boolean {
    return this._capturing;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Capture Mode
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Starts capture mode.
   *
   * @since 0.5.0
   */
  startCapture(): void {
    this._capturing = true;
    this._blinkTimer = 0;
    this._blinkVisible = true;
  }

  /**
   * Stops capture mode.
   *
   * @since 0.5.0
   */
  stopCapture(): void {
    this._capturing = false;
  }

  /**
   * Captures a key.
   *
   * @param key - Key to capture
   *
   * @since 0.5.0
   */
  captureKey(key: string): void {
    if (KeyBinding.IGNORE_KEYS.has(key)) return;

    this._binding = this.formatKeyName(key);
    this.stopCapture();

    if (this._onChange) {
      this._onChange(key);
    }
  }

  /**
   * Formats a key name for display.
   *
   * @param key - Raw key name
   * @returns Formatted display name
   *
   * @internal
   */
  private formatKeyName(key: string): string {
    // Common key name mappings
    const keyMap: Record<string, string> = {
      ' ': 'SPACE',
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      Escape: 'ESC',
      Enter: 'ENTER',
      Backspace: 'BKSP',
      Tab: 'TAB',
      Delete: 'DEL',
      Insert: 'INS',
      Home: 'HOME',
      End: 'END',
      PageUp: 'PGUP',
      PageDown: 'PGDN',
    };

    return keyMap[key] ?? key.toUpperCase();
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

      const labelWidth = font.getTextWidth(this._label);

      return {
        width: Math.max(
          this._width,
          this._padding.left
            + labelWidth
            + this._gap
            + this._bindingWidth
            + this._padding.right,
        ),
        height: Math.max(
          this._height,
          this._padding.top + font.height + this._padding.bottom,
        ),
      };
    } catch {
      return { width: this._width || 120, height: this._height || 16 };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Update
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Updates blink timer.
   *
   * @param deltaTime - Time since last frame
   *
   * @since 0.5.0
   */
  override update(deltaTime: number): void {
    super.update(deltaTime);

    if (this._capturing) {
      this._blinkTimer += deltaTime;
      if (this._blinkTimer >= 0.3) {
        this._blinkTimer -= 0.3;
        this._blinkVisible = !this._blinkVisible;
      }
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

    if (this._capturing) {
      if (event.type === 'keydown') {
        const keyEvent = event as UIKeyEvent;

        // Escape cancels capture
        if (keyEvent.key === 'Escape') {
          this.stopCapture();
          event.consume();
          return true;
        }

        // Capture the key
        this.captureKey(keyEvent.key);
        event.consume();
        return true;
      }
    } else {
      if (event.type === 'mouseup') {
        const mouseEvent = event as UIMouseButtonEvent;
        if (
          mouseEvent.button === 'left'
          && this.containsPoint(mouseEvent.x, mouseEvent.y)
        ) {
          this.startCapture();
          event.consume();
          return true;
        }
      }

      if (event.type === 'keydown') {
        const keyEvent = event as UIKeyEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          this.startCapture();
          event.consume();
          return true;
        }
      }
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the key binding widget.
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

      // Draw focus indicator
      if (isFocused && !this._capturing) {
        const focusColor = theme.colors['focus.ring'];
        ctx.strokeRect(0, 0, this._width, this._height, focusColor);
      }

      const textY = this._padding.top;
      const canvas = ctx.getCanvas?.();

      // Draw label
      if (this._label) {
        const labelColor = isFocused
          ? theme.colors['focus.ring']
          : theme.colors['label.text'];
        if (canvas) {
          canvas.fillStyle = labelColor;
          font.renderText(this._label, this._padding.left, textY, ctx);
        } else {
          ctx.drawText(this._label, this._padding.left, textY, labelColor);
        }
      }

      // Draw binding box
      const bindingX = this._width - this._padding.right - this._bindingWidth;
      const bindingY = 0;
      const bindingH = this._height;

      const boxBgColor = this._capturing
        ? theme.colors['input.borderFocus']
        : theme.colors['input.background'];
      const boxBorderColor = isFocused
        ? theme.colors['focus.ring']
        : theme.colors['input.border'];

      ctx.fillRect(
        bindingX,
        bindingY,
        this._bindingWidth,
        bindingH,
        boxBgColor,
      );
      ctx.strokeRect(
        bindingX,
        bindingY,
        this._bindingWidth,
        bindingH,
        boxBorderColor,
      );

      // Draw binding text
      let displayText: string;
      let textColor: string;

      if (this._capturing) {
        displayText = this._blinkVisible ? '...' : '';
        textColor = theme.colors['input.text'];
      } else if (this._binding) {
        displayText = this._binding;
        textColor = theme.colors['input.text'];
      } else {
        displayText = '---';
        textColor = theme.colors['input.placeholder'];
      }

      // Center text in binding box
      const textWidth = font.getTextWidth(displayText);
      const textX = bindingX + (this._bindingWidth - textWidth) / 2;

      if (canvas) {
        canvas.fillStyle = textColor;
        font.renderText(displayText, textX, textY, ctx);
      } else {
        ctx.drawText(displayText, textX, textY, textColor);
      }
    } catch {
      // Fallback rendering
      ctx.drawText(
        this._label,
        this._padding.left,
        this._padding.top,
        '#FFFFFF',
      );

      const bindingX = this._width - this._padding.right - this._bindingWidth;
      ctx.fillRect(bindingX, 0, this._bindingWidth, this._height, '#333333');
      ctx.strokeRect(bindingX, 0, this._bindingWidth, this._height, '#666666');

      const text = this._capturing ? '...' : this._binding || '---';
      ctx.drawText(text, bindingX + 4, this._padding.top, '#FFFFFF');
    }
  }
}
