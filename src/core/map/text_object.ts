import type { RenderContext } from '../renderer/type';
import type { ShaderRegion } from '../shaders/types';
import MapObject from './map_object';
import type { MapObjectContext, TextConfig } from './types';

/**
 * Default CSS font family used when a `text` placement omits `font`.
 */
const DEFAULT_FONT = 'monospace';
/**
 * Default font size (game pixels) used when a `text` placement omits `fontSize`.
 */
const DEFAULT_FONT_SIZE = 16;
/**
 * Default colour used when a `text` placement omits `color`.
 */
const DEFAULT_COLOR = '#ffffff';

/**
 * A live, drawable string placed on a screen — a first-class {@link MapObject}
 * so it participates in the layer draw order, appears in
 * {@link Screen.objects}, and can be moved, restyled, or faded at runtime
 * (grab it via {@link Screen.objectsByType | objectsByType(TextObject)} and
 * mutate {@link TextObject.text | text}, {@link TextObject.x | x}/`y`,
 * {@link TextObject.color | color}, or {@link TextObject.alpha | alpha}).
 *
 * Built from a `text` {@link Placement} by {@link Screen}; the placement's
 * {@link TextConfig} seeds the initial style. Unlike sprite-backed objects it
 * carries no finite-state machine display — {@link TextObject.render | render}
 * draws the string directly with the canvas font API.
 *
 * @category Map
 * @since 0.5.0
 *
 * @example Fade a title in as its screen becomes active
 * ```ts
 * class TitleScreen extends Screen {
 *   protected override onEnter(): void {
 *     for (const t of this.objectsByType(TextObject)) t.alpha = 0;
 *   }
 *   protected override onUpdate(dt: number): void {
 *     for (const t of this.objectsByType(TextObject)) {
 *       t.alpha = Math.min(1, t.alpha + dt);
 *     }
 *   }
 * }
 * ```
 *
 * @see {@link MapObject}
 * @see {@link TextConfig}
 */
export default class TextObject extends MapObject {
  /**
   * Registry key.
   */
  static override readonly type = 'Text';

  /**
   * The rendered string. Reassign to change what the player sees.
   */
  text: string;
  /**
   * CSS font family.
   */
  font: string;
  /**
   * Font size in game (logical) pixels.
   */
  fontSize: number;
  /**
   * CSS colour string.
   */
  color: string;
  /**
   * Horizontal alignment relative to {@link TextObject.x | x}.
   */
  align: 'left' | 'center' | 'right';
  /**
   * Draw opacity in `[0, 1]`, multiplied into the canvas alpha. Animate this
   * to fade text in or out.
   */
  alpha = 1;

  constructor(ctx: MapObjectContext) {
    super(ctx);
    const cfg: TextConfig = ctx.text ?? { text: '' };
    this.text = cfg.text ?? '';
    this.font = cfg.font ?? DEFAULT_FONT;
    this.fontSize = cfg.fontSize ?? DEFAULT_FONT_SIZE;
    this.color = cfg.color ?? DEFAULT_COLOR;
    this.align = cfg.align ?? 'left';
  }

  /**
   * Replaces the rendered string.
   */
  setText(text: string): void {
    this.text = text;
  }

  /**
   * Draws the string at the object origin with its font/size/colour/alignment,
   * then lets any attached shaders render over its bounds.
   */
  override render(ctx: RenderContext): void {
    const raw = ctx.getCanvas?.();
    if (raw) {
      raw.save();
      raw.globalAlpha *= this.alpha;
      raw.font = `${this.fontSize}px ${this.font}`;
      raw.textAlign = this.align;
      raw.textBaseline = 'top';
      raw.fillStyle = this.color;
      raw.fillText(this.text, this.x, this.y);
      raw.restore();
    } else {
      ctx.drawText(this.text, this.x, this.y, this.color);
    }
    // No sprite parts to draw; still render attached shaders over our bounds.
    super.render(ctx);
  }

  /**
   * Approximate text box in world pixels — the region passed to shaders. Width
   * is estimated (no canvas metrics needed off-screen); good enough for glow
   * regions and editor-independent bookkeeping.
   */
  protected override bounds(): ShaderRegion {
    const width = Math.max(1, this.text.length * this.fontSize * 0.6);
    const height = this.fontSize;
    const x = this.align === 'center' ? this.x - width / 2 : this.align === 'right' ? this.x - width : this.x;
    return { x, y: this.y, width, height };
  }
}
