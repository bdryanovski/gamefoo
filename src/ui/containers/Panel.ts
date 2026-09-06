/**
 * Panel container widget with background and optional border.
 *
 * @category UI
 * @module ui/containers/Panel
 * @since 0.5.0
 */

import type { RenderContext } from '@/core/renderer/type';
import Container, { type ContainerConfig } from '../core/Container';

/**
 * Configuration for Panel.
 *
 * @since 0.5.0
 */
export interface PanelConfig extends ContainerConfig {
  /**
   * Optional title text
   */
  title?: string;
  /**
   * Whether to show border
   */
  showBorder?: boolean;
  /**
   * Title height (0 for no title bar)
   */
  titleHeight?: number;
}

/**
 * Panel container with background and optional border/title.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * const panel = new Panel({
 *   title: 'Settings',
 *   width: 200,
 *   height: 150,
 *   padding: 8,
 * });
 *
 * panel.addChild(new Label({ text: 'Volume' }));
 * panel.addChild(new Slider({ min: 0, max: 100, value: 50 }));
 * ```
 */
export default class Panel extends Container {
  /**
   * Title text
   */
  protected _title: string = '';

  /**
   * Show border
   */
  protected _showBorder: boolean = true;

  /**
   * Title height
   */
  protected _titleHeight: number = 0;

  /**
   * Creates a new Panel.
   *
   * @param config - Panel configuration
   *
   * @since 0.5.0
   */
  constructor(config: PanelConfig = {}) {
    super({
      ...config,
      padding: config.padding ?? 4,
    });
    if (config.title !== undefined) {
      this._title = config.title;
      this._titleHeight = config.titleHeight ?? 12;
    }
    if (config.showBorder !== undefined) {
      this._showBorder = config.showBorder;
    }
    if (config.titleHeight !== undefined) {
      this._titleHeight = config.titleHeight;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Properties
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Title text
   */
  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    if (this._title !== value) {
      this._title = value;
      if (value && this._titleHeight === 0) {
        this._titleHeight = 12;
      }
      this.markLayoutDirty();
    }
  }

  /**
   * Show border
   */
  public get showBorder(): boolean {
    return this._showBorder;
  }

  public set showBorder(value: boolean) {
    this._showBorder = value;
  }

  /**
   * Title height
   */
  public get titleHeight(): number {
    return this._titleHeight;
  }

  public set titleHeight(value: number) {
    if (this._titleHeight !== value) {
      this._titleHeight = value;
      this.markLayoutDirty();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Layouts children accounting for title bar.
   *
   * @since 0.5.0
   */
  public override layout(): void {
    // Adjust effective padding for title bar
    const originalPaddingTop = this._padding.top;
    if (this._title && this._titleHeight > 0) {
      this._padding.top += this._titleHeight;
    }

    super.layout();

    // Restore padding
    this._padding.top = originalPaddingTop;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Rendering
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Draws the panel.
   *
   * @param ctx - Render context
   *
   * @since 0.5.0
   */
  protected override drawSelf(ctx: RenderContext): void {
    try {
      const theme = this.getTheme();

      // Draw background
      ctx.fillRect(0, 0, this._width, this._height, theme.colors['panel.background']);

      // Draw border
      if (this._showBorder && theme.borderWidth > 0) {
        ctx.strokeRect(0, 0, this._width, this._height, theme.colors['panel.border']);
      }

      // Draw title bar
      if (this._title && this._titleHeight > 0) {
        // Title background
        ctx.fillRect(0, 0, this._width, this._titleHeight, theme.colors['panel.header']);

        // Title separator
        ctx.fillRect(0, this._titleHeight - 1, this._width, 1, theme.colors['panel.border']);

        // Title text
        const font = theme.fonts.default;
        const textX = this._padding.left;
        const textY = (this._titleHeight - font.height) / 2;

        const canvas = ctx.getCanvas?.();
        if (canvas) {
          canvas.fillStyle = theme.colors['label.text'];
          font.renderText(this._title, textX, textY, ctx);
        } else {
          ctx.drawText(this._title, textX, textY, theme.colors['label.text']);
        }
      }
    } catch {
      // Fallback rendering
      ctx.fillRect(0, 0, this._width, this._height, '#1a1a1a');

      if (this._showBorder) {
        ctx.strokeRect(0, 0, this._width, this._height, '#444444');
      }

      if (this._title && this._titleHeight > 0) {
        ctx.fillRect(0, 0, this._width, this._titleHeight, '#333333');
        ctx.drawText(this._title, this._padding.left, 2, '#FFFFFF');
      }
    }
  }
}
